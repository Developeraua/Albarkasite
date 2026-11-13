# Security checklist

This repository is a Vite/React static frontend using hosted Supabase. It does
not contain an Express server. Server-only middleware such as Helmet, Argon2,
filesystem path resolvers, XML parsers, or custom JWT verification must be
implemented in the API service if one is added later. Supabase Auth must remain
the password and session authority; authorization must be enforced with RLS.

## Project and supply chain

- [x] TypeScript uses `strict`, `noImplicitAny`, and `strictNullChecks`.
- [x] `package-lock.json` is committed and CI uses `npm ci --ignore-scripts`.
- [x] `.npmrc` enables audits, disables funding output, pins new installs, and
  sets `ignore-scripts=true`.
- [x] CI runs `npm audit --omit=dev --audit-level=high` and a production build.
- [x] Dependabot checks npm and GitHub Actions weekly.
- [ ] Review dependency changes before merging; use `overrides` only for a
  tested patched transitive version.
- [ ] Add Snyk or another SCA scanner if required by the deployment policy.

## Secrets and configuration

- [x] `.env` variants are ignored; `.env.example` contains dummy public values.
- [x] The browser uses only a Supabase publishable key. Never expose a
  `service_role` key, SMTP password, management token, or database password.
- [ ] Rotate credentials immediately if any private value reaches Git history.
- [ ] Enable gitleaks or git-secrets in the organization pre-commit workflow.

## Browser and static-host controls

- [x] `public/_headers` supplies HSTS, nosniff, frame denial, no-referrer,
  Permissions Policy, COOP, and CSP for hosts that support `_headers` files.
- [ ] Configure the same headers at the production CDN if it does not support
  `_headers`; headers are more reliable than HTML meta tags.
- [ ] The current single-file build requires inline scripts and styles, so CSP
  includes `unsafe-inline`. For a nonce/hash-only policy, stop inlining the
  bundle and serve hashed external assets or generate CSP hashes at deployment.
- [x] No `dangerouslySetInnerHTML`, `innerHTML`, `eval`, or `new Function` usage
  exists in `src`.
- [x] React text interpolation is used, preventing client-side template
  injection by default. Never add Angular/Vue template expression evaluation,
  `v-html`, or unsanitized `dangerouslySetInnerHTML`.

## Authentication and data

- [x] Supabase Auth checks real sessions before redirecting after sign-in.
- [x] Signup does not auto-login and handles email confirmation explicitly.
- [x] Private client paths call `supabase.auth.getSession()` and redirect to
  `/login` without a session.
- [x] Profile tables use RLS policies and server-side Auth triggers.
- [ ] Client route guards are UX only. Every private table and Storage bucket
  must have restrictive Supabase RLS policies; never trust browser checks.
- [ ] Require MFA for administrative accounts in Supabase.
- [ ] Keep authentication errors generic where account enumeration is a risk.
- [x] Browser authentication is proxied through Express; Supabase tokens are
  stored only in signed Secure/HttpOnly/SameSite cookies.
- [x] Database roles are restricted to `USER` and `SUPER_ADMIN`; role checks are
  server-side and backed by RLS/security-definer functions.
- [x] SUPER_ADMIN access requires a verified TOTP factor and aal2 session.
- [x] On Sales and Projects writes require cookie authentication, CSRF,
  SUPER_ADMIN role middleware, user-token RLS, and database audit triggers.
- [x] Server-managed passwords use Argon2id with bounded input, common-password
  rejection, and rehash detection. Supabase Auth remains responsible for the
  website's email/password hashes.

## WebSockets

- [x] Supabase endpoints use HTTPS and their corresponding secure `wss://`
  origin is the only websocket origin allowed by CSP.
- [ ] For any custom websocket server: verify the `Origin` header during the
  handshake, require `wss://`, authenticate on connect and per message, and
  enforce message-size and rate limits.

## Logging and production endpoints

- [x] No application `console.log`, `console.warn`, or `console.error` calls are
  present in frontend source.
- [ ] Verify deployment and server logs never contain PII, tokens, JWTs,
  passwords, cookies, authorization headers, or API keys. Add field-level log
  redaction middleware to any future API.
- [ ] Ensure `/dev`, `/debug`, `/staging`, `/_next/data`, Swagger, GraphQL
  Playground, source maps, and diagnostic endpoints are disabled or
  authentication-gated in production.
- [x] Vite production output does not expose Next.js, Swagger, GraphQL, Express,
  or development-debug endpoints.

## Operational review

- [ ] Force HTTPS at the deployment edge.
- [ ] Configure WAF and edge request limits for authentication and contact
  endpoints where appropriate.
- [ ] Review Supabase Auth rate limits, redirect allowlists, SMTP configuration,
  Storage policies, and database RLS before each production release.
- [ ] Run a dependency audit, production build, and authenticated RLS test as a
  release gate.

## Local filesystem access

- [x] Server-side user-selected files must pass through
  `server/lib/safePath.ts` before any read operation.
- [x] The resolver rejects absolute paths, null bytes, lexical traversal,
  sibling-prefix bypasses, and symlinks escaping `STORAGE_ROOT`.
- [ ] Keep `STORAGE_ROOT` non-writable by untrusted users where possible to
  reduce symlink race risks.

## Object merging

- [x] User-controlled object merges must use
  `server/lib/prototypeGuard.ts`.
- [x] `__proto__`, `constructor`, and `prototype` are ignored at every level.
- [x] Accessors, class instances, cycles, excessive nesting, and excessive key
  counts are rejected before merging.

## XML parsing

- [x] Prefer JSON. Any required XML parsing must use
  `server/lib/xmlParser.ts`.
- [x] DTDs, entities, XInclude, custom entity references, type coercion, and
  oversized or excessively nested documents are rejected.
- [x] Do not introduce `libxmljs2` releases with known native parser or build
  dependency vulnerabilities.