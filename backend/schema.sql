-- آموزش با امیر | Supabase multi-user foundation
-- Run this file in Supabase SQL Editor. Then create the first admin using the bootstrap steps in backend/README.md.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  role text not null default 'student' check (role in ('admin','teacher','student')),
  approval_status text not null default 'approved' check (approval_status in ('pending','approved','rejected','suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  grade text,
  subject text,
  meeting_url text,
  starts_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.class_members (
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (class_id, student_id)
);

create table if not exists public.public_content (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content_type text not null check (content_type in ('lesson','pdf','audio','video','quiz','link')),
  description text,
  storage_path text,
  public_url text,
  is_published boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  instructions text,
  due_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  answer_text text,
  file_path text,
  score numeric(5,2),
  teacher_feedback text,
  submitted_at timestamptz not null default now(),
  unique (assignment_id, student_id)
);

create index if not exists classes_teacher_idx on public.classes(teacher_id);
create index if not exists members_student_idx on public.class_members(student_id);
create index if not exists assignments_class_idx on public.assignments(class_id);
create index if not exists submissions_student_idx on public.submissions(student_id);

create or replace function public.current_role()
returns text language sql stable security definer set search_path = public
as $$ select role from public.profiles where id = auth.uid() $$;

create or replace function public.is_approved()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.profiles where id = auth.uid() and approval_status = 'approved') $$;

create or replace function public.is_class_teacher(p_class uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.classes where id = p_class and teacher_id = auth.uid()) $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
declare requested_role text;
begin
  requested_role := coalesce(new.raw_user_meta_data->>'requested_role','student');
  if requested_role not in ('teacher','student') then requested_role := 'student'; end if;
  insert into public.profiles(id, display_name, role, approval_status)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'display_name',''), split_part(new.email,'@',1)),
    requested_role,
    case when requested_role = 'teacher' then 'pending' else 'approved' end
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_amir on auth.users;
create trigger on_auth_user_created_amir after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.admin_set_teacher_status(p_teacher_id uuid, p_status text)
returns void language plpgsql security definer set search_path = public
as $$
begin
  if not exists(select 1 from public.profiles where id=auth.uid() and role='admin' and approval_status='approved') then
    raise exception 'admin access required';
  end if;
  if p_status not in ('approved','rejected','suspended') then raise exception 'invalid status'; end if;
  update public.profiles set approval_status=p_status, updated_at=now()
  where id=p_teacher_id and role='teacher';
end;
$$;

alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.class_members enable row level security;
alter table public.public_content enable row level security;
alter table public.assignments enable row level security;
alter table public.submissions enable row level security;

drop policy if exists "profiles read self or admin" on public.profiles;
create policy "profiles read self or admin" on public.profiles for select to authenticated
using (id=auth.uid() or public.current_role()='admin');

drop policy if exists "profile update own name" on public.profiles;
create policy "profile update own name" on public.profiles for update to authenticated
using (id=auth.uid()) with check (id=auth.uid() and role=public.current_role());

drop policy if exists "classes read by participants" on public.classes;
create policy "classes read by participants" on public.classes for select to authenticated
using (teacher_id=auth.uid() or public.current_role()='admin' or exists(
  select 1 from public.class_members m where m.class_id=id and m.student_id=auth.uid()
));

drop policy if exists "approved teachers create classes" on public.classes;
create policy "approved teachers create classes" on public.classes for insert to authenticated
with check (teacher_id=auth.uid() and public.current_role()='teacher' and public.is_approved());

drop policy if exists "teachers update own classes" on public.classes;
create policy "teachers update own classes" on public.classes for update to authenticated
using (teacher_id=auth.uid() and public.is_approved()) with check (teacher_id=auth.uid());

drop policy if exists "teachers delete own classes" on public.classes;
create policy "teachers delete own classes" on public.classes for delete to authenticated
using (teacher_id=auth.uid() and public.is_approved());

drop policy if exists "members visible to class participants" on public.class_members;
create policy "members visible to class participants" on public.class_members for select to authenticated
using (student_id=auth.uid() or public.is_class_teacher(class_id) or public.current_role()='admin');

drop policy if exists "teachers enroll students" on public.class_members;
create policy "teachers enroll students" on public.class_members for insert to authenticated
with check (public.is_class_teacher(class_id) and public.current_role()='teacher' and public.is_approved());

drop policy if exists "teachers remove class members" on public.class_members;
create policy "teachers remove class members" on public.class_members for delete to authenticated
using (public.is_class_teacher(class_id) or public.current_role()='admin');

drop policy if exists "published content visible to all signed in" on public.public_content;
create policy "published content visible to all signed in" on public.public_content for select to authenticated
using (is_published=true or public.current_role()='admin');

drop policy if exists "approved teachers manage content" on public.public_content;
create policy "approved teachers manage content" on public.public_content for insert to authenticated
with check (created_by=auth.uid() and public.current_role()='teacher' and public.is_approved());

drop policy if exists "content owners and admin update" on public.public_content;
create policy "content owners and admin update" on public.public_content for update to authenticated
using (created_by=auth.uid() or public.current_role()='admin')
with check (created_by=auth.uid() or public.current_role()='admin');

drop policy if exists "assignment read by class participants" on public.assignments;
create policy "assignment read by class participants" on public.assignments for select to authenticated
using (teacher_id=auth.uid() or public.current_role()='admin' or exists(
  select 1 from public.class_members m where m.class_id=class_id and m.student_id=auth.uid()
));

drop policy if exists "approved teachers create assignments" on public.assignments;
create policy "approved teachers create assignments" on public.assignments for insert to authenticated
with check (teacher_id=auth.uid() and public.current_role()='teacher' and public.is_approved() and public.is_class_teacher(class_id));

drop policy if exists "teachers update assignments" on public.assignments;
create policy "teachers update assignments" on public.assignments for update to authenticated
using (teacher_id=auth.uid() and public.is_approved()) with check (teacher_id=auth.uid());

drop policy if exists "submissions visible to owner teacher or student" on public.submissions;
create policy "submissions visible to owner teacher or student" on public.submissions for select to authenticated
using (student_id=auth.uid() or public.current_role()='admin' or exists(
  select 1 from public.assignments a where a.id=assignment_id and a.teacher_id=auth.uid()
));

drop policy if exists "students submit own work" on public.submissions;
create policy "students submit own work" on public.submissions for insert to authenticated
with check (student_id=auth.uid() and public.current_role()='student' and public.is_approved());

drop policy if exists "students update own submission or teacher grades" on public.submissions;
create policy "students update own submission or teacher grades" on public.submissions for update to authenticated
using (student_id=auth.uid() or exists(select 1 from public.assignments a where a.id=assignment_id and a.teacher_id=auth.uid()))
with check (student_id=auth.uid() or exists(select 1 from public.assignments a where a.id=assignment_id and a.teacher_id=auth.uid()));

grant execute on function public.admin_set_teacher_status(uuid,text) to authenticated;
