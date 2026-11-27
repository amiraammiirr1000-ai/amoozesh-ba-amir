-- Migration 005: harden assignment submission and grading boundaries.
-- Run after schema.sql and multiuser-v2.sql in Supabase SQL Editor.
-- Students may submit only to assignments in classes they have joined.
-- A student cannot set grades/feedback, and teachers cannot rewrite submitted work.

alter table public.submissions
  drop constraint if exists submissions_score_range_check;
alter table public.submissions
  add constraint submissions_score_range_check
  check (score is null or (score >= 0 and score <= 100));

create or replace function public.guard_submission_write()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text := public.current_role();
begin
  if auth.uid() is null or not public.is_approved() then
    raise exception 'برای ثبت یا ارزیابی تکلیف باید حساب فعال داشته باشید.';
  end if;

  if tg_op = 'INSERT' then
    if v_role <> 'student' or new.student_id <> auth.uid() then
      raise exception 'فقط دانش‌آموز می‌تواند پاسخ خودش را ثبت کند.';
    end if;
    if not exists (
      select 1
      from public.assignments a
      join public.class_members m on m.class_id = a.class_id
      where a.id = new.assignment_id
        and m.student_id = auth.uid()
    ) then
      raise exception 'این تکلیف متعلق به کلاسی نیست که عضو آن باشید.';
    end if;
    -- Never trust client-supplied grading fields.
    new.score := null;
    new.teacher_feedback := null;
    return new;
  end if;

  if tg_op = 'UPDATE' then
    if v_role = 'teacher' then
      if new.assignment_id is distinct from old.assignment_id
         or new.student_id is distinct from old.student_id
         or new.answer_text is distinct from old.answer_text
         or new.file_path is distinct from old.file_path then
        raise exception 'معلم فقط مجاز به ثبت نمره و بازخورد است؛ پاسخ دانش‌آموز قابل بازنویسی نیست.';
      end if;
      if not exists (
        select 1 from public.assignments a
        where a.id = old.assignment_id and a.teacher_id = auth.uid()
      ) then
        raise exception 'فقط معلم همان تکلیف می‌تواند آن را ارزیابی کند.';
      end if;
      if new.score is not null and (new.score < 0 or new.score > 100) then
        raise exception 'نمره باید بین صفر تا صد باشد.';
      end if;
      return new;
    elsif v_role = 'admin' then
      return new;
    end if;
    raise exception 'اجازه ویرایش پاسخ یا نمره را ندارید.';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_guard_submission_write on public.submissions;
create trigger trg_guard_submission_write
before insert or update on public.submissions
for each row execute function public.guard_submission_write();

drop policy if exists "students submit own work" on public.submissions;
create policy "students submit own work" on public.submissions
for insert to authenticated
with check (
  student_id = auth.uid()
  and public.current_role() = 'student'
  and public.is_approved()
  and exists (
    select 1
    from public.assignments a
    join public.class_members m on m.class_id = a.class_id
    where a.id = submissions.assignment_id
      and m.student_id = auth.uid()
  )
);

drop policy if exists "teachers grade submissions" on public.submissions;
create policy "teachers grade submissions" on public.submissions
for update to authenticated
using (
  public.is_approved()
  and (
    (public.current_role() = 'teacher' and exists (
      select 1 from public.assignments a
      where a.id = submissions.assignment_id and a.teacher_id = auth.uid()
    ))
    or public.current_role() = 'admin'
  )
)
with check (
  public.is_approved()
  and (
    (public.current_role() = 'teacher' and exists (
      select 1 from public.assignments a
      where a.id = submissions.assignment_id and a.teacher_id = auth.uid()
    ))
    or public.current_role() = 'admin'
  )
);

-- A teacher may not move an assignment into a class they do not own.
drop policy if exists "teachers update assignments" on public.assignments;
create policy "teachers update assignments" on public.assignments
for update to authenticated
using (
  teacher_id = auth.uid()
  and public.current_role() = 'teacher'
  and public.is_approved()
  and public.is_class_teacher(class_id)
)
with check (
  teacher_id = auth.uid()
  and public.current_role() = 'teacher'
  and public.is_approved()
  and public.is_class_teacher(class_id)
);

revoke all on function public.guard_submission_write() from public;
comment on function public.guard_submission_write() is
  'Enforces class membership on student submission and prevents students/teachers from altering protected grading/submission fields.';
