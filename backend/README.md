# Multi-user architecture — آموزش با امیر

## What this adds
- Shared public learning content stored centrally.
- Individual accounts for teachers and students.
- Teacher sign-up is **pending** until the administrator approves it.
- Student sign-up is active by default.
- Teacher-owned classes, enrollments, assignments and student submissions.
- Row Level Security (RLS) policies keep each teacher's classes and each student's records scoped to the correct account.

## Important deployment note
The repository does not contain a Supabase project URL or public client key, and no database can be provisioned from GitHub alone. Until a project is created and configured, the app continues in its current local/offline mode. Do not paste a service-role key into the app.

## Setup
1. Create a Supabase project.
2. Open **SQL Editor**, paste and run `schema.sql`.
3. In **Project Settings → API**, copy the Project URL and publishable/anon key.
4. Put those two values in `backend-config.js` and commit the file. These are public client values; database access is protected by RLS.
5. In Supabase **Authentication → URL Configuration**, add the deployed GitHub Pages URL and local development URL to the allowed redirect URLs.
6. Open the app and create an account using the email/password form. Choose **معلم** or **دانش‌آموز**.
7. To make the first administrator, find the account UUID in **Authentication → Users**, then run:
   ```sql
   update public.profiles
   set role='admin', approval_status='approved'
   where id='PASTE-ADMIN-USER-UUID-HERE';
   ```
8. Sign out and back in. The admin account can approve/reject teacher registrations from the administrator panel.

## Roles
- **Admin:** approve teachers; manage shared content and system accounts.
- **Teacher:** only after approval, create/manage own classes, enroll students, publish shared content, issue assignments and grade submissions.
- **Student:** access shared published lessons and content, see only their own classes/assignments/submissions and submit work.

## Data migration
Existing browser localStorage data is not automatically uploaded. Import/migration needs an explicit review and a later migration tool so private student data is not uploaded accidentally.

## Security
- Never use Supabase service-role keys in browser code.
- RLS is mandatory; hiding a button in the UI is not authorization.
- Use HTTPS, strong passwords, email verification, and backups.
- A production launch should add rate limits/abuse controls and test policies with separate teacher/student accounts.
