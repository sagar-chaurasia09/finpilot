 FinPilot** is an AI-powered personal finance web app tailored for the Indian market. It helps Indian millennials plan FD ladders across 17+ banks, auto-categorize expenses from CSV/PDF statements, set and simulate financial goals, and chat with a bilingual (English + Hindi) finance assistant powered by Claude Sonnet 4.5.

Every feature is runnable instantly in **Demo Mode** — no API keys required — and gracefully upgrades to full functionality (real auth, database, AI) once you plug in your Clerk, Supabase, and Anthropic keys.

---

## 🎯 Features

### 📈 FD Ladder Builder
- Compare FD rates across **17+ Indian banks** (PSU, Private, Small Finance Banks)
- AI-optimized ladder generator: give it your amount, timeline, and liquidity needs — Claude returns a staggered FD strategy
- Top rates up to **8.75%** (Unity SFB, 3Y)

### 💳 AI Expense Tracker
- Upload CSV or PDF bank statements → auto-parsed and categorized
- Interactive donut and bar charts broken down by category
- AI-generated monthly review with personalized spending/saving recommendations
- Multilingual insights (English or Hindi)

### 🎯 Goals + What-If Simulator
- Set financial goals with target amount, deadline, and category
- Real-time progress bars
- **What-If simulator**: slide to cut monthly spend or add SIP and watch compounding growth animate live on a 30-year horizon

### 💬 Finance Chatbot
- Bilingual assistant (English / हिन्दी) for FDs, SIPs, PPF, 80C, loans, tax planning
- Streaming responses from Claude Sonnet 4.5
- Preset prompts for common questions

### 🎁 Referrals
- Unique referral code per user
- Public landing page at `/refer/[code]`
- Leaderboard with top referrers and conversion stats

### 🛡️ Admin Panel
- HMAC-signed cookie session (separate from user auth)
- User management, content moderation, referral oversight
- AI usage analytics, feature flags, audit log
- Edge-compatible middleware guard

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3.4, custom design tokens |
| **UI primitives** | Radix UI (Dialog, Dropdown, Select, Tabs, Toast) |
| **Animation** | Framer Motion, custom CSS 3D transforms |
| **Auth** | Clerk (with JWT template → Supabase RLS) |
| **Database** | Supabase Postgres with Row-Level Security |
| **AI** | Anthropic Claude Sonnet 4.5 |
| **Charts** | Recharts |
| **Email** | Resend (optional) |
| **File parsing** | PapaParse (CSV), pdf-parse (PDF) |
| **Validation** | Zod |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

### Design System — Midnight Gold
- Background `#0a0a0a` · Surface `#121212` · Borders `#262626`
- Primary `#d4af37` (Royal Gold) · Accent `#f59e0b` (Amber)
- Text `#f9fafb` / `#a1a1aa`
- Shimmering gold gradient text, animated aurora blobs, 3D tilt cards, glassmorphism

---

## 📂 Project Structure

```
finpilot/
├── app/
│   ├── (app)/                      # Authenticated user routes (shared sidebar layout)
│   │   ├── dashboard/              # Unified home — net worth, FD, expenses, goals snapshot
│   │   ├── fd-ladder/              # Compare bank rates + AI ladder generator
│   │   ├── expenses/               # Upload, categorize, insights, charts
│   │   ├── chat/                   # Bilingual finance chatbot
│   │   ├── goals/                  # Set goals + What-If compounding simulator
│   │   ├── referrals/              # Share link + leaderboard
│   │   ├── settings/               # Profile, language, risk profile
│   │   └── layout.tsx              # Sidebar nav + user badge
│   │
│   ├── admin/                      # Admin panel (cookie-guarded)
│   │   ├── page.tsx                # Overview metrics
│   │   ├── users/                  # User management
│   │   ├── content/                # Content moderation
│   │   ├── referrals/              # Referral oversight
│   │   ├── ai-usage/               # AI call analytics
│   │   ├── features/               # Feature flags
│   │   ├── logs/                   # Audit log
│   │   └── layout.tsx              # Admin sidebar + logout
│   │
│   ├── admin-login/                # Public admin sign-in (HMAC cookie)
│   ├── login/[[...rest]]/          # Clerk sign-in
│   ├── signup/[[...rest]]/         # Clerk sign-up
│   ├── onboarding/                 # Capture income / risk / language
│   ├── refer/[code]/               # Public referral landing
│   │
│   ├── api/                        # Route handlers
│   │   ├── admin/login/            # POST/DELETE HMAC session
│   │   ├── chat/                   # Stream Claude responses
│   │   ├── expenses/upload/        # CSV/PDF → categorized tx
│   │   ├── insights/               # AI monthly review
│   │   ├── ladder/                 # AI FD ladder generator
│   │   └── me/onboarding/          # Persist onboarding answers
│   │
│   ├── page.tsx                    # Animated landing (3D hero, stats, features, CTA)
│   ├── layout.tsx                  # Root layout (conditional Clerk provider)
│   └── globals.css                 # Midnight Gold theme + 3D utilities
│
├── components/
│   ├── AnimatedBackground.tsx      # Mouse-parallax aurora blobs + grid overlay
│   ├── HeroScene.tsx               # Floating 3D card stack (portfolio mockup)
│   ├── TiltCard.tsx                # Spring-smoothed 3D tilt wrapper w/ glare
│   ├── AdminLogoutButton.tsx       # Clears admin cookie
│   ├── UserBadge.tsx               # Demo-mode user chip
│   └── UserBadgeClerk.tsx          # Clerk-powered user chip
│
├── lib/
│   ├── anthropic.ts                # Claude client + prompt builders
│   ├── constants.ts                # App name, ranges, categories, suggestions
│   ├── demo.ts                     # Demo data + isDemoMode flag
│   ├── rate-limit.ts               # Per-user AI call rate limiter
│   ├── use-clerk-user.ts           # Hook bridging Clerk → app user shape
│   ├── utils.ts                    # formatINR, date helpers
│   └── supabase/
│       ├── client.ts               # Browser client (stub in demo mode)
│       └── server.ts               # Server client w/ Clerk JWT forwarding
│
├── supabase/
│   ├── migrations/
│   │   ├── 0001_init.sql           # Tables, auth_uid(), is_admin(), RLS policies
│   │   └── 0002_rpcs.sql           # increment_credits, referral_leaderboard
│   └── seed.sql                    # 17 banks, FD rates, 4 demo users, transactions
│
├── middleware.ts                   # Clerk middleware + admin cookie guard (Edge)
├── tailwind.config.ts              # Midnight Gold palette + fonts + shadows
├── next.config.js
├── tsconfig.json
├── postcss.config.js
└── package.json
```

---

## 🛣️ Routes

### Public
| Path | Description |
|---|---|
| `/` | Animated landing with 3D hero scene |
| `/login` | Clerk sign-in |
| `/signup` | Clerk sign-up |
| `/admin-login` | Admin cookie sign-in |
| `/refer/[code]` | Public referral landing |

### User (authenticated)
| Path | Description |
|---|---|
| `/onboarding` | Capture income range, risk appetite, language |
| `/dashboard` | Net worth, portfolio, recent activity, AI insights |
| `/fd-ladder` | Compare bank rates, AI-generate optimal ladder |
| `/expenses` | Upload statements, view categorized transactions + charts |
| `/chat` | Bilingual finance chatbot (Claude) |
| `/goals` | Goal list + What-If compounding simulator |
| `/referrals` | Personal referral code, share link, progress |
| `/referrals/leaderboard` | Top referrers (30-day) |
| `/settings` | Profile, language, risk preferences |

### Admin (cookie-gated)
| Path | Description |
|---|---|
| `/admin` | Overview metrics (users, AI calls, conversions) |
| `/admin/users` | User list + management |
| `/admin/content` | Content moderation |
| `/admin/referrals` | Referral oversight |
| `/admin/ai-usage` | AI call analytics per user/day |
| `/admin/features` | Feature flag toggles |
| `/admin/logs` | Audit log |

### API
| Method + Path | Description |
|---|---|
| `POST /api/admin/login` | Validate credentials → set HMAC cookie |
| `DELETE /api/admin/login` | Clear admin cookie |
| `POST /api/chat` | Stream Claude chat responses |
| `POST /api/expenses/upload` | Parse CSV/PDF → categorize → insert |
| `POST /api/insights` | Generate monthly review |
| `POST /api/ladder` | AI FD ladder generator |
| `POST /api/me/onboarding` | Save onboarding answers |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+
- npm / pnpm / yarn

### 1. Clone and install

```bash
git clone https://github.com/sagar-chaurasia09/finpilot.git
cd finpilot
npm install
```

### 2. Environment variables

Create `.env.local` in the project root:

```bash
# --- Demo mode (runs without any real keys) ---
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_APP_URL=http://localhost:3000

# --- Admin panel (demo defaults) ---
ADMIN_EMAIL=admin@demo.finpilot.app
ADMIN_PASSWORD=admin
ADMIN_SESSION_SECRET=demo-admin-secret-change-me

# --- Clerk (optional — fill to enable real auth) ---
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# --- Supabase (optional) ---
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWT_SECRET=

# --- Anthropic (optional) ---
ANTHROPIC_API_KEY=
CLAUDE_MODEL=claude-sonnet-4-5

# --- Rate limits ---
AI_RATE_LIMIT_PER_MIN=5
AI_RATE_LIMIT_FREE_TIER=3

# --- Resend (optional) ---
RESEND_API_KEY=
RESEND_FROM_EMAIL=FinPilot <hello@finpilot.app>
```

### 3. Run the dev server

```bash
npm run dev
```

Visit **http://localhost:3000**. You're now in demo mode with realistic Indian fintech data (Raj Sharma's transactions, goals, FD rates, etc.).

### 4. (Optional) Enable full mode

To use real services:

#### a. Set up Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. In SQL Editor, run in order:
   ```
   supabase/migrations/0001_init.sql
   supabase/migrations/0002_rpcs.sql
   supabase/seed.sql
   ```
3. Copy the URL, anon key, service role key, and JWT secret to `.env.local`

#### b. Set up Clerk
1. Create an application at [clerk.com](https://clerk.com)
2. **JWT Templates → New** → name it `supabase`
3. Signing algorithm: **HS256**, secret: paste your `SUPABASE_JWT_SECRET`
4. Default claims `{ "role": "authenticated" }`
5. Copy publishable + secret keys to `.env.local`

#### c. Set up Anthropic
1. Get an API key at [console.anthropic.com](https://console.anthropic.com)
2. Paste into `ANTHROPIC_API_KEY`

#### d. Disable demo mode
```
NEXT_PUBLIC_DEMO_MODE=false
```

---

## 🎮 Demo Access

| Role | How to access |
|---|---|
| **Guest user** | Click *Continue as guest* on landing — full demo data loaded |
| **Admin** | Go to `/admin-login` · Email: `admin@demo.finpilot.app` · Password: `admin` |

Demo users include **Raj Sharma** (primary, ₹3.25L net worth), **Priya Iyer**, **Aman Verma**, and the admin account.

---

## 🗄️ Database Schema (Supabase)

Key tables:
- **`users`** — `id` (TEXT, Clerk-compatible), email, language, risk_level, income_range, referral_code, credits, admin flag
- **`goals`** — user_id, title, target, current, deadline, category
- **`transactions`** — user_id, date, merchant, category, amount, type (credit/debit)
- **`fd_portfolios`** — user_id, bank, principal, rate, tenure, maturity_date
- **`fd_rates`** — bank, tenure_months, rate, updated_at *(seeded with 17 banks)*
- **`referrals`** — referrer_id, referred_id, status, reward_credits
- **`chat_sessions`** / **`chat_messages`** — Claude conversations
- **`feature_flags`** — key, enabled, description
- **`admin_logs`** — append-only audit trail

All tables use **Row-Level Security** with `auth_uid()` (reads `sub` claim from Clerk JWT) and `is_admin()` helpers.

---

## 🔐 Authentication Architecture

```
User sign-in (Clerk)
    ↓
Clerk JWT with 'supabase' template (signed with SUPABASE_JWT_SECRET)
    ↓
Supabase client attaches token on every request
    ↓
RLS policies use auth_uid() = sub claim to filter rows
```

**Admin** uses a separate HMAC-SHA256 signed cookie (`finpilot_admin`) verified in Edge middleware via Web Crypto — no database lookup required, 8-hour expiry.

---

## 🎨 Design Highlights

- **3D tilt cards** on feature grid (spring-smoothed, cursor-tracked glare)
- **Floating hero scene** with parallax card stack at different Z-depths
- **Animated aurora background** — three blurred blobs drifting + mouse parallax
- **Shimmering gradient text** on CTAs (gold → amber → pale gold loop)
- **Framer Motion** staggered fade-up scroll reveals
- **Glassmorphism** on overlay cards with gold-tinted borders
- **`prefers-reduced-motion`** fully respected

---

## 🚢 Deployment (Vercel)

1. Push to GitHub (already done)
2. Go to [vercel.com/new](https://vercel.com/new) → import your repo
3. Add the same environment variables from `.env.local`
4. Deploy — ~90 seconds to live URL

The middleware is Edge-compatible, so no special config needed.

---

## 📜 Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run seed` | Seed Supabase with demo data (requires real keys) |

---
