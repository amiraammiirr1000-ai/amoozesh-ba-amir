-- Multi-user v2: public student signup, unique handles, class invite codes and privacy-safe roster.
-- Run AFTER schema.sql in Supabase SQL Editor.

alter table public.profiles add column if not exists username text;
alter table public.profiles add column if not exists email text;
update public.profiles p set email=u.email
from auth.users u where u.id=p.id and p.email is null;
update public.profiles set username='user_'||substr(replace(id::text,'-',''),1,10) where username is null or btrim(username)='';
create unique index if not exists profiles_username_ci_uidx on public.profiles (lower(username));
create index if not exists profiles_email_idx on public.profiles (email);

alter table public.classes add column if not exists invite_code text;
alter table public.classes alter column invite_code set default upper(substr(encode(gen_random_bytes(6),'hex'),1,10));
update public.classes set invite_code=upper(substr(encode(gen_random_bytes(6),'hex'),1,10))
where invite_code is null or btrim(invite_code)='';
create unique index if not exists classes_invite_code_uidx on public.classes(invite_code);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
declare requested_role text; requested_username text;
begin
  requested_role := coalesce(new.raw_user_meta_data->>'requested_role','student');
  if requested_role not in ('teacher','student') then requested_role := 'student'; end if;
  requested_username := lower(regexp_replace(coalesce(new.raw_user_meta_data->>'username',''), '[^a-zA-Z0-9_]', '', 'g'));
  if length(requested_username)<3 then requested_username := 'user_'||substr(replace(new.id::text,'-',''),1,10); end if;
  insert into public.profiles(id, display_name, username, email, role, approval_status)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'display_name',''), split_part(coalesce(new.email,''),'@',1)),
    requested_username,
    new.email,
    requested_role,
    case when requested_role = 'teacher' then 'pending' else 'approved' end
  );
  return new;
exception when unique_violation then
  raise exception 'این آیدی قبلاً انتخاب شده است؛ آیدی دیگری انتخاب کنید.';
end;
$$;

-- Only the account owner and administrator can read full profile details.
drop policy if exists "profiles read self or admin" on public.profiles;
create policy "profiles read self or admin" on public.profiles for select to authenticated
using (id=auth.uid() or public.current_role()='admin');

-- Teacher receives only a privacy-safe roster (display name + username), never email or private account data.
create or replace function public.class_student_roster(p_class_id uuid)
returns table(student_id uuid, display_name text, username text)
language plpgsql stable security definer set search_path = public
as $$
begin
  if not exists(select 1 from public.classes c where c.id=p_class_id and c.teacher_id=auth.uid() and public.current_role()='teacher' and public.is_approved()) then
    raise exception 'اجازه مشاهده فهرست این کلاس را ندارید.';
  end if;
  return query
    select p.id, p.display_name, p.username
    from public.class_members m join public.profiles p on p.id=m.student_id
    where m.class_id=p_class_id order by p.display_name;
end;
$$;

-- Students join a teacher's class with a shareable invite code. No student directory is exposed.
create or replace function public.join_class_by_code(p_code text)
returns uuid language plpgsql security definer set search_path = public
as $$
declare v_class_id uuid;
begin
  if auth.uid() is null or public.current_role()<>'student' or not public.is_approved() then
    raise exception 'برای عضویت باید با حساب فعال دانش‌آموز وارد شوید.';
  end if;
  select id into v_class_id from public.classes where invite_code=upper(btrim(p_code));
  if v_class_id is null then raise exception 'کد کلاس معتبر نیست.'; end if;
  insert into public.class_members(class_id,student_id) values(v_class_id,auth.uid())
  on conflict(class_id,student_id) do nothing;
  return v_class_id;
end;
$$;

grant execute on function public.class_student_roster(uuid) to authenticated;
grant execute on function public.join_class_by_code(text) to authenticated;

comment on column public.profiles.email is 'Private account email; visible only to the account owner and system administrator via RLS.';
comment on column public.profiles.username is 'Public handle shown to teachers only inside classes they own.';
comment on column public.classes.invite_code is 'Shareable class enrollment code; never grants teacher or admin privileges.';
