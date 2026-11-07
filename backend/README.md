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
3. Then run `multiuser-v2.sql` in the same SQL Editor. This adds unique student handles, administrator registration directory, class invitation codes, privacy-safe class rosters and student self-enrollment.
4. In **Project Settings → API**, copy the Project URL and publishable/anon key.

5. Put those two values in `backend-config.js` and commit the file. These are public client values; database access is protected by RLS. Never place a service-role/secret key in the app.
6. In Supabase **Authentication → URL Configuration**, add the deployed GitHub Pages URL and local development URL to the allowed redirect URLs.
7. Open the app and create an account using the email/password form. Choose **معلم** or **دانش‌آموز**.
8. To make the first administrator, find the account UUID in **Authentication → Users**, then run:
   ```sql
   update public.profiles
   set role='admin', approval_status='approved'
   where id='PASTE-ADMIN-USER-UUID-HERE';
   ```
9. Sign out and back in. The admin account can approve/reject teacher registrations from the administrator panel.

## Roles
- **Admin:** approve teachers; manage shared content and system accounts.
- **Teacher:** only after approval, create own classes and share invite codes; see only student display names and handles in own class rosters. The SQL schema also supports assignments and grading, which still require connecting the app's assignment UI.
- **Student:** register independently, use public learning content, join a teacher's class with an invite code, and see only their own classes/assignments/submissions. Assignment workflows still need UI integration.

## Signed Android release\n\nThe repository includes a manually triggered workflow at **Actions → Android Signed Release APK**. It refuses to build unless the four repository Actions secrets are configured: `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, and `ANDROID_KEY_PASSWORD`. Generate one persistent Android upload/release keystore with `keytool`, keep a secure offline backup, Base64-encode it, and add these values under **Settings → Secrets and variables → Actions**. Never commit the keystore or passwords. The workflow verifies the APK signature with `apksigner` and publishes a SHA-256 checksum. Keep using the same keystore for every future update, otherwise Android will not install the update over the previous signed version. A valid signature improves provenance and update continuity but cannot guarantee that every device or Play Protect will show no warning.\n\n## Data migration
Existing browser localStorage data is not automatically uploaded. Import/migration needs an explicit review and a later migration tool so private student data is not uploaded accidentally.

## Security
- Never use Supabase service-role keys in browser code.
- RLS is mandatory; hiding a button in the UI is not authorization.
- Use HTTPS, strong passwords, email verification, and backups.
- A production launch should add rate limits/abuse controls and test policies with separate teacher/student accounts.
