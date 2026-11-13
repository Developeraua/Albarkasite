# Role-level security acceptance tests

Run these against a staging deployment with the production migration applied.

## Authentication

- [ ] Sign up with a weak password: request returns 400.
- [ ] Sign up with a `role` field: strict Zod schema rejects the request.
- [ ] Sign up normally: profile is created with role `USER` only.
- [ ] Try password login before confirming email: response is
  `Please verify your email to continue.` and no auth cookies are issued.
- [ ] Confirm email and login: Secure/HttpOnly/SameSite cookies are issued;
  no access or refresh token exists in localStorage/sessionStorage.
- [ ] Fail login five times across one or multiple IPs: account is locked for
  15 minutes.
- [ ] Leave the session inactive for one hour: protected request returns 401.
- [ ] Email OTP works for USER; SUPER_ADMIN OTP-only login is rejected.

## USER authorization

- [ ] USER `GET /admin`: redirects to `/unauthorized`.
- [ ] USER `GET /api/admin/summary`: returns 403.
- [ ] USER POST/PUT/DELETE to `/api/admin/content/properties/*`: returns 403.
- [ ] USER POST/PUT/DELETE to `/api/admin/content/projects/*`: returns 403.
- [ ] USER direct PostgREST insert/update/delete on properties/posts/pages: RLS
  rejects it.
- [ ] USER can insert a comment only with `user_id = auth.uid()`.
- [ ] USER cannot update/delete another user's comment.
- [ ] USER sees only their own profile and cannot update role, verification,
  phone, email, ban, or last-login fields.
- [ ] USER can update only their own `name` and `avatar_url`.
- [ ] USER can insert their own contact message but cannot read messages.

## SUPER_ADMIN authorization

- [ ] Promotion without verified TOTP fails.
- [ ] Fourth SUPER_ADMIN promotion, or promotion of any UUID/email outside the
  three-account allowlist, fails.
- [ ] Password login requires a valid TOTP challenge before `/admin` works.
- [ ] SUPER_ADMIN can create/update/delete properties, posts, and pages.
- [ ] SUPER_ADMIN can add, edit, publish/unpublish, and delete On Sales records
  through `/admin`; public pages reflect the changes.
- [ ] SUPER_ADMIN can add, edit, publish/unpublish, and delete Projects records
  through `/admin`; public pages reflect the changes.
- [ ] Every property/project create, update, and delete creates an audit row.
- [ ] Add Item and per-record Edit controls appear on On Sales/Projects only
  for a verified SUPER_ADMIN session.
- [ ] USER and anonymous sessions never render those page-level controls.
- [ ] Saving in the secured editor causes open On Sales/Projects grids to
  refresh through `/api/content/events` without a full page reload.
- [ ] SUPER_ADMIN can select up to 12 images at once for an On Sales or Project
  item; all valid images appear in its slideshow after save.
- [ ] USER/anonymous multi-image uploads return 401/403 before file parsing.
- [ ] Invalid, mismatched, oversized, or executable image uploads are rejected.
- [ ] Removing/replacing managed slideshow images cleans up `content-images`.
- [ ] SUPER_ADMIN can read/manage comments, contact messages, and profiles.
- [ ] Every SUPER_ADMIN mutation produces an `audit_logs` row.

## Storage and direct intrusion

- [ ] Anonymous upload to every bucket fails.
- [ ] USER upload/update/delete in every bucket fails.
- [ ] SUPER_ADMIN can manage approved buckets after aal2 authentication.
- [ ] Service-role key is absent from browser bundles, source maps, logs, and
  network responses.
- [ ] Requests from an unapproved CORS origin return 403.
- [ ] Direct Postgres connection from an IP outside the firewall allowlist is
  rejected.