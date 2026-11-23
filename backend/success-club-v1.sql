-- Success Club v1 for آموزش با امیر
-- Run once in Supabase SQL Editor after schema.sql and multiuser-v2.sql.
-- Optional student_progress-v1.sql may be run before or after this migration.

create table if not exists public.success_clubs (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null unique references public.classes(id) on delete cascade,
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  school_name text not null default '',
  teacher_name text not null default '',
  club_title text not null default 'باشگاه ستاره‌های موفقیت',
  academic_year text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.success_groups (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.success_clubs(id) on delete cascade,
  group_no integer not null check (group_no between 1 and 100),
  name text not null default '',
  created_at timestamptz not null default now(),
  unique (club_id, group_no)
);

create table if not exists public.success_students (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.success_clubs(id) on delete cascade,
  group_id uuid not null references public.success_groups(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  role text not null default 'عضو' check (role in ('سرگروه','جانشین','زیرگروه','عضو')),
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.success_subjects (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.success_clubs(id) on delete cascade,
  name text not null,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (club_id, name)
);

create table if not exists public.success_assessments (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.success_clubs(id) on delete cascade,
  student_id uuid not null references public.success_students(id) on delete cascade,
  subject_id uuid not null references public.success_subjects(id) on delete cascade,
  assessment_date date not null default current_date,
  score numeric(5,2) not null check (score >= 0 and score <= 20),
  note text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.success_performance (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.success_clubs(id) on delete cascade,
  student_id uuid not null references public.success_students(id) on delete cascade,
  month_no integer not null check (month_no between 1 and 12),
  homework integer not null default 0 check (homework between 0 and 4),
  participation integer not null default 0 check (participation between 0 and 4),
  effort integer not null default 0 check (effort between 0 and 4),
  responsibility integer not null default 0 check (responsibility between 0 and 4),
  cooperation integer not null default 0 check (cooperation between 0 and 4),
  updated_at timestamptz not null default now(),
  unique (student_id, month_no)
);

create table if not exists public.success_awards (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.success_clubs(id) on delete cascade,
  student_id uuid references public.success_students(id) on delete cascade,
  group_id uuid references public.success_groups(id) on delete cascade,
  month_no integer check (month_no between 1 and 12),
  award_title text not null,
  reason text not null default '',
  created_at timestamptz not null default now(),
  constraint success_award_target_check check (student_id is not null or group_id is not null)
);

create index if not exists success_groups_club_idx on public.success_groups(club_id, group_no);
create index if not exists success_students_group_idx on public.success_students(group_id, display_order);
create index if not exists success_assessments_student_date_idx on public.success_assessments(student_id, assessment_date desc);
create index if not exists success_performance_club_month_idx on public.success_performance(club_id, month_no);

create or replace function public.can_access_success_club(p_club_id uuid)
returns boolean language sql stable security definer set search_path=public
as $$
  select exists (
    select 1 from public.success_clubs sc
    join public.classes c on c.id=sc.class_id
    where sc.id=p_club_id
      and (c.teacher_id=auth.uid() or public.current_role()='admin'
        or exists(select 1 from public.class_members cm where cm.class_id=c.id and cm.student_id=auth.uid()))
  );
$$;

create or replace function public.can_manage_success_club(p_club_id uuid)
returns boolean language sql stable security definer set search_path=public
as $$
  select exists (
    select 1 from public.success_clubs sc
    join public.classes c on c.id=sc.class_id
    where sc.id=p_club_id
      and (c.teacher_id=auth.uid() or public.current_role()='admin')
  );
$$;

revoke all on function public.can_access_success_club(uuid) from public;
revoke all on function public.can_manage_success_club(uuid) from public;
grant execute on function public.can_access_success_club(uuid) to authenticated;
grant execute on function public.can_manage_success_club(uuid) to authenticated;

alter table public.success_clubs enable row level security;
alter table public.success_groups enable row level security;
alter table public.success_students enable row level security;
alter table public.success_subjects enable row level security;
alter table public.success_assessments enable row level security;
alter table public.success_performance enable row level security;
alter table public.success_awards enable row level security;

drop policy if exists "success clubs participants read" on public.success_clubs;
create policy "success clubs participants read" on public.success_clubs for select to authenticated
using (public.can_access_success_club(id));
drop policy if exists "success clubs teacher create" on public.success_clubs;
create policy "success clubs teacher create" on public.success_clubs for insert to authenticated
with check (teacher_id=auth.uid() and public.current_role()='teacher' and public.is_approved()
  and exists(select 1 from public.classes c where c.id=class_id and c.teacher_id=auth.uid()));
drop policy if exists "success clubs teacher update" on public.success_clubs;
create policy "success clubs teacher update" on public.success_clubs for update to authenticated
using (public.can_manage_success_club(id)) with check (public.can_manage_success_club(id));
drop policy if exists "success clubs teacher delete" on public.success_clubs;
create policy "success clubs teacher delete" on public.success_clubs for delete to authenticated
using (public.can_manage_success_club(id));

drop policy if exists "success groups participants read" on public.success_groups;
create policy "success groups participants read" on public.success_groups for select to authenticated
using (public.can_access_success_club(club_id));
drop policy if exists "success groups teacher manage" on public.success_groups;
create policy "success groups teacher manage" on public.success_groups for all to authenticated
using (public.can_manage_success_club(club_id)) with check (public.can_manage_success_club(club_id));

drop policy if exists "success students teacher or self read" on public.success_students;
create policy "success students teacher or self read" on public.success_students for select to authenticated
using (public.can_manage_success_club(club_id) or profile_id=auth.uid());
drop policy if exists "success students teacher manage" on public.success_students;
create policy "success students teacher manage" on public.success_students for all to authenticated
using (public.can_manage_success_club(club_id)) with check (public.can_manage_success_club(club_id));

drop policy if exists "success subjects participants read" on public.success_subjects;
create policy "success subjects participants read" on public.success_subjects for select to authenticated
using (public.can_access_success_club(club_id));
drop policy if exists "success subjects teacher manage" on public.success_subjects;
create policy "success subjects teacher manage" on public.success_subjects for all to authenticated
using (public.can_manage_success_club(club_id)) with check (public.can_manage_success_club(club_id));

drop policy if exists "success assessments own or teacher read" on public.success_assessments;
create policy "success assessments own or teacher read" on public.success_assessments for select to authenticated
using (public.can_manage_success_club(club_id) or exists(
  select 1 from public.success_students s where s.id=student_id and s.profile_id=auth.uid()
));
drop policy if exists "success assessments teacher manage" on public.success_assessments;
create policy "success assessments teacher manage" on public.success_assessments for all to authenticated
using (public.can_manage_success_club(club_id)) with check (public.can_manage_success_club(club_id));

drop policy if exists "success performance own or teacher read" on public.success_performance;
create policy "success performance own or teacher read" on public.success_performance for select to authenticated
using (public.can_manage_success_club(club_id) or exists(
  select 1 from public.success_students s where s.id=student_id and s.profile_id=auth.uid()
));
drop policy if exists "success performance teacher manage" on public.success_performance;
create policy "success performance teacher manage" on public.success_performance for all to authenticated
using (public.can_manage_success_club(club_id)) with check (public.can_manage_success_club(club_id));

drop policy if exists "success awards own or teacher read" on public.success_awards;
create policy "success awards own or teacher read" on public.success_awards for select to authenticated
using (public.can_manage_success_club(club_id) or exists(
  select 1 from public.success_students s where s.id=student_id and s.profile_id=auth.uid()
));
drop policy if exists "success awards teacher manage" on public.success_awards;
create policy "success awards teacher manage" on public.success_awards for all to authenticated
using (public.can_manage_success_club(club_id)) with check (public.can_manage_success_club(club_id));

comment on table public.success_clubs is 'Teacher-configurable classroom achievement clubs; records are isolated by class and protected by RLS.';
