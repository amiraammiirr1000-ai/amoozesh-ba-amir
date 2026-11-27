-- آموزش با امیر | پشتیبانی آنلاین v1
-- Run once in Supabase SQL Editor. Safe to re-run.
create table if not exists public.support_feedback (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references public.profiles(id) on delete cascade,
 category text not null check (char_length(category) between 2 and 100),
 message text not null check (char_length(trim(message)) between 8 and 3000),
 contact text,
 app_version text,
 status text not null default 'new' check (status in ('new','reviewing','resolved')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists support_feedback_created_idx on public.support_feedback(created_at desc);
create index if not exists support_feedback_user_idx on public.support_feedback(user_id,created_at desc);
alter table public.support_feedback enable row level security;
drop policy if exists "support users submit own" on public.support_feedback;
create policy "support users submit own" on public.support_feedback for insert to authenticated
with check (user_id=auth.uid() and char_length(trim(message)) between 8 and 3000);
drop policy if exists "support users and admins read" on public.support_feedback;
create policy "support users and admins read" on public.support_feedback for select to authenticated
using (user_id=auth.uid() or public.current_role()='admin');
drop policy if exists "support admins update" on public.support_feedback;
create policy "support admins update" on public.support_feedback for update to authenticated
using (public.current_role()='admin') with check (public.current_role()='admin');
revoke all on public.support_feedback from anon,authenticated;
grant insert,select,update on public.support_feedback to authenticated;
comment on table public.support_feedback is 'User-submitted feedback. Users read only their own submissions; admins can review and update status.';
