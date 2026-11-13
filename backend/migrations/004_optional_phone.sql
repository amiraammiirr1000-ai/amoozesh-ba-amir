-- Migration 004: optional phone field for profiles and signup metadata.
-- Run once in Supabase SQL Editor. Phone is visible only through existing self/admin profile RLS.

alter table public.profiles add column if not exists phone text;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
declare requested_role text; requested_username text; requested_phone text;
begin
  requested_role := coalesce(new.raw_user_meta_data->>'requested_role','student');
  if requested_role not in ('teacher','student') then requested_role := 'student'; end if;
  requested_username := lower(regexp_replace(coalesce(new.raw_user_meta_data->>'username',''), '[^a-zA-Z0-9_]', '', 'g'));
  if length(requested_username)<3 then requested_username := 'user_'||substr(replace(new.id::text,'-',''),1,10); end if;
  requested_phone := nullif(btrim(coalesce(new.raw_user_meta_data->>'phone','')), '');
  if requested_phone is not null and requested_phone !~ '^[+0-9() -]{7,20}$' then
    requested_phone := null;
  end if;
  insert into public.profiles(id, display_name, username, email, phone, role, approval_status)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'display_name',''), split_part(coalesce(new.email,''),'@',1)),
    requested_username,
    new.email,
    requested_phone,
    requested_role,
    case when requested_role = 'teacher' then 'pending' else 'approved' end
  );
  return new;
exception when unique_violation then
  raise exception 'این آیدی قبلاً انتخاب شده است؛ آیدی دیگری انتخاب کنید.';
end;
$$;

comment on column public.profiles.phone is 'Optional contact number; full profile access is restricted to account owner and administrator by RLS.';
