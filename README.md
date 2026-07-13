# Nexora

Premium personal productivity platform — tasks, calendar, habits, goals, expenses, and notes in one place.

## Quick start

```bash
npm install
cp .env.example .env   # add your Supabase keys
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Environment variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `DATABASE_URL` | Postgres connection (migrations only, server-side) |

**Password encoding:** Special characters in the database password must be URL-encoded (`@` → `%40`, `#` → `%23`, `$` → `%24`).

**Pooler connection** (if direct `db.*` host is unreachable):

```
postgresql://postgres.<project-ref>:<encoded-password>@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres?sslmode=require
```

## Database migrations

```bash
chmod +x scripts/apply-migrations.sh
./scripts/apply-migrations.sh
```

Migrations live in `supabase/migrations/`.

## Supabase Auth setup

### Email auth
Enabled by default in Supabase Dashboard → Authentication → Providers.

### Google OAuth
1. [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Authorized redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`
4. Paste Client ID + Secret in Supabase → Auth → Google

### GitHub OAuth
1. GitHub → Settings → Developer settings → OAuth Apps → New
2. Authorization callback URL: `https://<project-ref>.supabase.co/auth/v1/callback`
3. Paste Client ID + Secret in Supabase → Auth → GitHub

### Site URL (required for redirects)
Supabase Dashboard → Authentication → URL Configuration:
- **Site URL:** `http://localhost:5173` (dev) or your production URL
- **Redirect URLs:** `http://localhost:5173/**`, production URL

## Phase status

| Phase | Status |
|-------|--------|
| 1 — Planning | ✅ Complete |
| 2 — Foundation (auth + DB) | ✅ Complete |
| 3 — Dashboard + layout | ✅ Complete |
| 4 — Tasks | 🔜 Next |

## Tech stack

React · TypeScript · Vite · Tailwind CSS · shadcn/ui · TanStack Query · Supabase
