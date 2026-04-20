# FinPilot

AI co-pilot for Indian personal finance — FD ladders, expense tracking, goals, and a Hindi+English chatbot. Built for the Blostem hackathon.

## Stack
Next.js 14 (App Router) · TypeScript · Tailwind · shadcn patterns · Clerk · Supabase · Anthropic Claude · Recharts · Resend · Vercel.

## Setup

```bash
pnpm install          # or npm install / yarn
cp .env.example .env.local
# fill in Clerk, Supabase, Anthropic, Resend keys
```

### Database
In Supabase SQL editor, run in order:
1. `supabase/migrations/0001_init.sql`
2. `supabase/migrations/0002_rpcs.sql`
3. `supabase/seed.sql`

### Clerk → Supabase JWT
1. Clerk dashboard → JWT Templates → New → name it `supabase`
2. Signing algorithm: HS256, secret: `SUPABASE_JWT_SECRET` (from Supabase → Project Settings → API)
3. Claims: `{ "role": "authenticated" }` (default)

### Run
```bash
pnpm dev
```

## Demo access
- **Guest:** visit `/dashboard?guest=1` (no signup)
- **Admin:** sign up with the email set in `ADMIN_EMAIL` env var — first signup auto-promotes to admin

## Routes
| Path | Purpose |
|---|---|
| `/` | Landing |
| `/login`, `/signup` | Clerk auth |
| `/onboarding` | Capture income/risk/language |
| `/dashboard` | Unified home |
| `/fd-ladder` | Compare + AI generate |
| `/expenses` | Upload + AI insights |
| `/chat` | Finance chatbot (EN/HI) |
| `/goals` | Track + What-If simulator |
| `/referrals` | Share link, leaderboard |
| `/refer/[code]` | Public referral landing |
| `/admin/*` | Role-gated admin panel |

## Architecture
- Clerk handles auth. JWT template `supabase` bridges auth to Postgres RLS via `auth_uid()`.
- All user data (goals/tx/FDs/chats) is RLS-protected; admin routes use service role.
- Claude calls go through server-only API routes with per-user rate limits and are logged to `ai_calls` for cost tracking.
- Feature flags drive gradual rollout from `/admin/features`.
# finpilot-
