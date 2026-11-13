# Production security deployment

The application is React/Vite plus an Express security gateway. Express
provides the server-side equivalent of Next.js `middleware.ts`: all `/admin`,
`/dashboard`, `/portal`, and `/api/admin` access is checked against a Supabase
session and database role before protected content or operations are returned.

## 1. Environment secrets

Set these in the hosting provider's encrypted server environment, not in Vite,
Git, Docker build arguments, or frontend code:

- `SUPABASE_SERVICE_ROLE_KEY`
- `SESSION_SECRET`
- `JWT_PRIVATE_KEY`
- SMTP credentials

The service-role key belongs only in the Express runtime environment. Never use
the `VITE_` prefix for it. `VITE_SUPABASE_PUBLISHABLE_KEY` is an intentionally
public browser value.

Generate the session secret with at least 32 random bytes, for example:

```bash
openssl rand -base64 48
```

## 2. Database migration

Run all migrations in filename order. The final role-security migration is:

```text
supabase/migrations/20260310000000_create_rls_security.sql
```

It creates the two roles, verified profiles, content tables, comments, contact
messages, audit logs, persistent account lockouts, secure role/ban functions,
triggers, storage policies, and fail-closed RLS on every public table.

Then run `20260312000000_admin_content_crud.sql`. It creates and seeds the
database-backed On Sales and Projects catalogues. Public endpoints return only
published rows; all writes require a verified SUPER_ADMIN aal2 session.

Run `20260315000000_realtime_content.sql` to publish `properties` and
`projects` changes. The Express server consumes Supabase Realtime server-side
and exposes only invalidation events through `/api/content/events`; database
rows and service credentials are never broadcast to browsers.

Run `20260316000000_multi_content_images.sql` to add project image arrays and
the `content-images` bucket. Public reads are allowed; only verified
SUPER_ADMIN aal2 sessions can upload, replace, or delete slideshow images.

## 3. Supabase Auth dashboard

In **Authentication > Providers > Email**:

1. Enable Email provider.
2. Enable **Confirm email**. Do not enable auto-confirm in production.
3. Set minimum password length to at least 8; the application enforces 12 plus
   uppercase, lowercase, number, and special character.
4. Enable leaked-password protection.
5. Keep generic authentication errors/account-enumeration protection enabled.

In **Authentication > URL Configuration**:

1. Set Site URL to the exact HTTPS `PUBLIC_ORIGIN`.
2. Allow only the exact production `/login` callback and explicit local
   development callback. Do not use wildcard production redirects.

For Email OTP, configure the email template to include `{{ .Token }}` so the
six-digit code can be entered in the Email OTP form.

## 4. Designated SUPER_ADMIN accounts

Public signup always creates `USER`. Migration
`20260311000000_pin_super_admins.sql` and
`20260313000000_add_third_super_admin.sql` grant SUPER_ADMIN only when both UUID
and email match one of these immutable pairs:

- `fbff1509-7a2d-4cc6-a5f0-56680768e9c8` / `developeraua@gmail.com`
- `b6da919b-f906-4790-bb48-1550f8cc2ad7` /
  `albarkapropertiesconsultantltd@gmail.com`
- `81f6d908-551d-4a6b-bbaf-1e1a6ca97f32` / `aliyuusman97k@gmail.com`

The migration fails if either UUID/email pair does not match `auth.users`,
demotes every other administrator, and prevents promotion outside these three
identities.
If a designated account has no factor, password login grants only a five-minute
pre-MFA cookie and redirects to `/security`; no admin API accepts that session.
Both accounts must enroll TOTP before SUPER_ADMIN protected routes permit access. Run
`supabase/verify_super_admins.sql` after deployment.

## 6. Database firewall

In Supabase **Database Settings > Network Restrictions**, allow direct Postgres
connections only from approved administration/server IP ranges. Application
traffic should use Supabase APIs with RLS, not a publicly reachable database
password. Rotate the database password after setting the allowlist.

## 7. Storage

- `admin_uploads` is private and SUPER_ADMIN-only.
- `public_images` and the existing catalogue buckets are publicly readable.
- Upload, update, and delete are SUPER_ADMIN-only through RLS.
- Never create an anon/authenticated public upload policy.

## 8. Sessions

Access and refresh tokens exist only in signed, Secure, HttpOnly, SameSite=Strict
cookies. The browser Supabase client has persistence and URL session detection
disabled. Cookies expire after one hour and are refreshed only during active
use. SUPER_ADMIN protected routes additionally require an `aal2` Supabase JWT.

## 9. API deployment

Deploy with the included Dockerfile and terminate TLS at a trusted reverse
proxy. Set `TRUST_PROXY=true` only behind that proxy. Set `ALLOWED_ORIGINS` to
the exact comma-separated HTTPS origin list; never use `*` with credentials.

## 10. Operational checks

- Review `audit_logs` for failed logins, unauthorized access, MFA events, and
  database mutations.
- Configure custom SMTP and suitable Supabase Auth rate limits.
- Keep Dependabot and the security CI workflow enabled.
- Run `npm audit --audit-level=low` and `npm run build` before deployment.