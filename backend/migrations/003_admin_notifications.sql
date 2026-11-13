-- Migration 003: notify administrators when a teacher requests approval.
-- Run once in Supabase SQL Editor after multiuser-v2.sql.
create table if not exists public.admin_notifications (
  id bigint generated always as identity primary key,
  admin_id uuid not null references auth.users(id) on delete cascade,
  teacher_profile_id uuid references public.profiles(id) on delete set null,
  title text not null,
  body text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);
alter table public.admin_notifications enable row level security;
drop policy if exists "admins read own notifications" on public.admin_notifications;
create policy "admins read own notifications" on public.admin_notifications for select to authenticated
using (admin_id = auth.uid() and public.current_role() = 'admin');
drop policy if exists "admins update own notifications" on public.admin_notifications;
create policy "admins update own notifications" on public.admin_notifications for update to authenticated
using (admin_id = auth.uid() and public.current_role() = 'admin')
with check (admin_id = auth.uid() and public.current_role() = 'admin');
grant select, update on public.admin_notifications to authenticated;
revoke all on public.admin_notifications from anon;
create or replace function public.notify_admin_new_teacher()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role = 'teacher' and new.approval_status = 'pending' then
    insert into public.admin_notifications(admin_id, teacher_profile_id, title, body)
    select p.id, new.id, 'درخواست جدید معلم',
      'درخواست ثبت‌نام معلم جدید از طرف ' || coalesce(new.display_name, 'کاربر جدید') ||
      ' (@' || coalesce(new.username, 'بدون آیدی') || ') ثبت شد و منتظر تأیید شماست.'
    from public.profiles p where p.role = 'admin' and p.approval_status = 'approved';
  end if;
  return new;
end;
$$;
drop trigger if exists trg_notify_admin_new_teacher on public.profiles;
create trigger trg_notify_admin_new_teacher after insert on public.profiles
for each row execute function public.notify_admin_new_teacher();
comment on table public.admin_notifications is 'Private in-app notifications for administrators about new teacher approval requests.';
