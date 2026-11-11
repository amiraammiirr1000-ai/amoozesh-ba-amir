-- آموزش با امیر | Student progress cloud sync v1
-- Run once in Supabase SQL Editor after schema.sql and multiuser-v2.sql.
create table if not exists public.student_progress (
 user_id uuid primary key references public.profiles(id) on delete cascade,
 progress jsonb not null default '{"done":[],"scores":[],"points":0,"gameStats":{}}'::jsonb,
 updated_at timestamptz not null default now(),
 constraint student_progress_object_check check (jsonb_typeof(progress)='object')
);
create index if not exists student_progress_updated_idx on public.student_progress(updated_at desc);
alter table public.student_progress enable row level security;
drop policy if exists "students and assigned teachers read progress" on public.student_progress;
create policy "students and assigned teachers read progress" on public.student_progress for select to authenticated
using (
 user_id=auth.uid() or public.current_role()='admin'
 or exists(select 1 from public.class_members m join public.classes c on c.id=m.class_id
  where m.student_id=student_progress.user_id and c.teacher_id=auth.uid()
   and public.current_role()='teacher' and public.is_approved())
);
revoke all on public.student_progress from anon,authenticated;
grant select on public.student_progress to authenticated;

create or replace function public.merge_student_progress(p_progress jsonb)
returns jsonb language plpgsql security definer set search_path=public as $$
declare
 v_user uuid:=auth.uid(); v_old jsonb; v_in jsonb; v_done jsonb; v_scores jsonb; v_games jsonb; v_out jsonb; v_points integer;
begin
 if v_user is null or public.current_role()<>'student' or not public.is_approved() then
  raise exception 'فقط دانش‌آموز واردشده و فعال می‌تواند پیشرفت خود را همگام کند.';
 end if;
 if p_progress is null or jsonb_typeof(p_progress)<>'object' then raise exception 'ساختار اطلاعات پیشرفت معتبر نیست.'; end if;
 v_in:=jsonb_build_object(
  'done',case when jsonb_typeof(p_progress->'done')='array' then p_progress->'done' else '[]'::jsonb end,
  'scores',case when jsonb_typeof(p_progress->'scores')='array' then p_progress->'scores' else '[]'::jsonb end,
  'points',greatest(0,coalesce((p_progress->>'points')::integer,0)),
  'gameStats',case when jsonb_typeof(p_progress->'gameStats')='object' then p_progress->'gameStats' else '{}'::jsonb end
 );
 select progress into v_old from public.student_progress where user_id=v_user;
 v_old:=coalesce(v_old,'{"done":[],"scores":[],"points":0,"gameStats":{}}'::jsonb);
 select coalesce(jsonb_agg(to_jsonb(n) order by n),'[]'::jsonb) into v_done
 from (select distinct value::integer n from (
  select value from jsonb_array_elements_text(case when jsonb_typeof(v_old->'done')='array' then v_old->'done' else '[]'::jsonb)
  union all select value from jsonb_array_elements_text(v_in->'done')
 ) d where value ~ '^[0-9]{1,6}$') x;
 v_scores:=case when jsonb_array_length(v_in->'scores')>jsonb_array_length(case when jsonb_typeof(v_old->'scores')='array' then v_old->'scores' else '[]'::jsonb)
  then v_in->'scores' else case when jsonb_typeof(v_old->'scores')='array' then v_old->'scores' else '[]'::jsonb end end;
 select coalesce(jsonb_object_agg(k,jsonb_build_object(
  'attempts',greatest(coalesce((old_value->>'attempts')::integer,0),coalesce((new_value->>'attempts')::integer,0)),
  'correct',greatest(coalesce((old_value->>'correct')::integer,0),coalesce((new_value->>'correct')::integer,0))
 )),'{}'::jsonb) into v_games
 from (
  select key k from jsonb_object_keys(case when jsonb_typeof(v_old->'gameStats')='object' then v_old->'gameStats' else '{}'::jsonb end) as o(key)
  union select key k from jsonb_object_keys(v_in->'gameStats') as n(key)
 ) keys
 cross join lateral (select v_old->'gameStats'->k old_value,v_in->'gameStats'->k new_value) vals;
 v_points:=greatest(coalesce((v_old->>'points')::integer,0),coalesce((v_in->>'points')::integer,0));
 v_out:=jsonb_build_object('done',v_done,'scores',v_scores,'points',v_points,'gameStats',v_games);
 insert into public.student_progress(user_id,progress,updated_at) values(v_user,v_out,now())
 on conflict(user_id) do update set progress=excluded.progress,updated_at=now();
 return v_out;
end $$;

create or replace function public.class_student_progress(p_class_id uuid)
returns table(student_id uuid,display_name text,username text,progress jsonb,updated_at timestamptz)
language plpgsql stable security definer set search_path=public as $$
begin
 if not exists(select 1 from public.classes c where c.id=p_class_id and c.teacher_id=auth.uid()
  and public.current_role()='teacher' and public.is_approved()) then
  raise exception 'اجازه مشاهده گزارش این کلاس را ندارید.';
 end if;
 return query select p.id,p.display_name,p.username,
  coalesce(sp.progress,'{"done":[],"scores":[],"points":0,"gameStats":{}}'::jsonb),sp.updated_at
 from public.class_members m join public.profiles p on p.id=m.student_id
 left join public.student_progress sp on sp.user_id=p.id
 where m.class_id=p_class_id order by p.display_name;
end $$;
revoke all on function public.merge_student_progress(jsonb) from public;
revoke all on function public.class_student_progress(uuid) from public;
grant execute on function public.merge_student_progress(jsonb) to authenticated;
grant execute on function public.class_student_progress(uuid) to authenticated;
comment on table public.student_progress is 'Cloud-synced student learning progress. Students write through a self-scoped RPC; teachers read only their own class roster.';
