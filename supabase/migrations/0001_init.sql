-- ============================================================
-- FinPilot — Initial Schema + RLS (Clerk-compatible)
-- users.id is TEXT to match Clerk user ids (e.g. 'user_2abc...')
-- Run before seed.sql
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Helpers: read Clerk JWT claims (Supabase sets request.jwt.claims)
-- ------------------------------------------------------------
create or replace function auth_uid() returns text
  language sql stable as $$
    select nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'sub','')
$$;

create or replace function is_admin() returns boolean
  language sql stable as $$
    select exists (
      select 1 from users
      where id = auth_uid() and role = 'admin'
    )
$$;

-- ------------------------------------------------------------
-- USERS
-- ------------------------------------------------------------
create table if not exists users (
  id             text primary key,                 -- Clerk user id
  email          text unique not null,
  name           text,
  phone          text,
  income_range   text check (income_range in ('<30k','30k-50k','50k-1L','1L-2L','2L+')),
  risk_appetite  text check (risk_appetite in ('conservative','moderate','aggressive')),
  language       text default 'en' check (language in ('en','hi')),
  role           text default 'user' check (role in ('user','admin')),
  referral_code  text unique not null,
  referred_by    text references users(referral_code) on delete set null,
  credits        int  default 0,
  created_at     timestamptz default now()
);
create index if not exists users_referral_code_idx on users(referral_code);

-- ------------------------------------------------------------
-- GOALS
-- ------------------------------------------------------------
create table if not exists goals (
  id             uuid primary key default gen_random_uuid(),
  user_id        text not null references users(id) on delete cascade,
  title          text not null,
  target_amount  numeric(12,2) not null,
  current_amount numeric(12,2) default 0,
  deadline       date,
  category       text,
  created_at     timestamptz default now()
);
create index if not exists goals_user_idx on goals(user_id);

-- ------------------------------------------------------------
-- TRANSACTIONS
-- ------------------------------------------------------------
create table if not exists transactions (
  id         uuid primary key default gen_random_uuid(),
  user_id    text not null references users(id) on delete cascade,
  amount     numeric(12,2) not null,
  category   text,
  merchant   text,
  date       date not null,
  type       text check (type in ('credit','debit')),
  source     text check (source in ('bank','upi','card','manual','csv','pdf')),
  created_at timestamptz default now()
);
create index if not exists tx_user_date_idx on transactions(user_id, date desc);

-- ------------------------------------------------------------
-- FD PORTFOLIOS
-- ------------------------------------------------------------
create table if not exists fd_portfolios (
  id            uuid primary key default gen_random_uuid(),
  user_id       text not null references users(id) on delete cascade,
  bank          text not null,
  amount        numeric(12,2) not null,
  rate          numeric(4,2) not null,
  start_date    date not null,
  maturity_date date not null,
  tenure_months int  not null,
  created_at    timestamptz default now()
);
create index if not exists fd_user_idx on fd_portfolios(user_id);

-- ------------------------------------------------------------
-- CHAT SESSIONS
-- ------------------------------------------------------------
create table if not exists chat_sessions (
  id            uuid primary key default gen_random_uuid(),
  user_id       text not null references users(id) on delete cascade,
  messages_json jsonb default '[]'::jsonb,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
create index if not exists chat_user_idx on chat_sessions(user_id, updated_at desc);

-- ------------------------------------------------------------
-- REFERRALS
-- ------------------------------------------------------------
create table if not exists referrals (
  id           uuid primary key default gen_random_uuid(),
  referrer_id  text not null references users(id) on delete cascade,
  referred_id  text not null references users(id) on delete cascade,
  status       text default 'pending' check (status in ('pending','converted','voided')),
  reward_given boolean default false,
  flagged      boolean default false,
  created_at   timestamptz default now(),
  unique (referrer_id, referred_id)
);
create index if not exists ref_referrer_idx on referrals(referrer_id);

-- ------------------------------------------------------------
-- ADMIN LOGS (append-only)
-- ------------------------------------------------------------
create table if not exists admin_logs (
  id            uuid primary key default gen_random_uuid(),
  admin_id      text not null references users(id),
  action        text not null,
  target_id     text,
  metadata_json jsonb default '{}'::jsonb,
  created_at    timestamptz default now()
);
create index if not exists admin_logs_admin_idx on admin_logs(admin_id, created_at desc);

-- ------------------------------------------------------------
-- FEATURE FLAGS
-- ------------------------------------------------------------
create table if not exists feature_flags (
  id                 uuid primary key default gen_random_uuid(),
  key                text unique not null,
  enabled            boolean default false,
  rollout_percentage int default 0 check (rollout_percentage between 0 and 100),
  updated_at         timestamptz default now()
);

-- ------------------------------------------------------------
-- ANALYTICS EVENTS
-- ------------------------------------------------------------
create table if not exists analytics_events (
  id         uuid primary key default gen_random_uuid(),
  user_id    text references users(id) on delete set null,
  event      text not null,
  metadata   jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
create index if not exists events_event_time_idx on analytics_events(event, created_at desc);

-- ------------------------------------------------------------
-- AI CALL LOGS (for /admin/ai-usage)
-- ------------------------------------------------------------
create table if not exists ai_calls (
  id            uuid primary key default gen_random_uuid(),
  user_id       text references users(id) on delete set null,
  feature       text not null,       -- 'ladder'|'expense'|'chat'|'insights'
  tokens_in     int default 0,
  tokens_out    int default 0,
  cost_usd      numeric(10,6) default 0,
  status        text default 'ok',   -- 'ok'|'error'|'rate_limited'
  created_at    timestamptz default now()
);
create index if not exists ai_calls_user_time_idx on ai_calls(user_id, created_at desc);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table users            enable row level security;
alter table goals            enable row level security;
alter table transactions     enable row level security;
alter table fd_portfolios    enable row level security;
alter table chat_sessions    enable row level security;
alter table referrals        enable row level security;
alter table admin_logs       enable row level security;
alter table feature_flags    enable row level security;
alter table analytics_events enable row level security;
alter table ai_calls         enable row level security;

-- USERS
create policy users_self_read   on users for select using (id = auth_uid() or is_admin());
create policy users_self_update on users for update using (id = auth_uid()) with check (id = auth_uid());
create policy users_admin_all   on users for all    using (is_admin()) with check (is_admin());
create policy users_insert_self on users for insert with check (id = auth_uid());

-- GOALS
create policy goals_owner on goals for all
  using (user_id = auth_uid() or is_admin())
  with check (user_id = auth_uid() or is_admin());

-- TRANSACTIONS
create policy tx_owner on transactions for all
  using (user_id = auth_uid() or is_admin())
  with check (user_id = auth_uid() or is_admin());

-- FD PORTFOLIOS
create policy fd_owner on fd_portfolios for all
  using (user_id = auth_uid() or is_admin())
  with check (user_id = auth_uid() or is_admin());

-- CHAT SESSIONS
create policy chat_owner on chat_sessions for all
  using (user_id = auth_uid() or is_admin())
  with check (user_id = auth_uid() or is_admin());

-- REFERRALS
create policy ref_participant_read on referrals for select
  using (referrer_id = auth_uid() or referred_id = auth_uid() or is_admin());
create policy ref_admin_write on referrals for all
  using (is_admin()) with check (is_admin());
create policy ref_system_insert on referrals for insert
  with check (referrer_id = auth_uid() or referred_id = auth_uid() or is_admin());

-- ADMIN LOGS (insert-only, admin-only)
create policy admin_logs_read   on admin_logs for select using (is_admin());
create policy admin_logs_insert on admin_logs for insert with check (is_admin());

-- FEATURE FLAGS
create policy flags_read        on feature_flags for select using (true);
create policy flags_admin_write on feature_flags for all    using (is_admin()) with check (is_admin());

-- ANALYTICS
create policy events_self_insert on analytics_events for insert
  with check (user_id = auth_uid() or user_id is null);
create policy events_admin_read  on analytics_events for select using (is_admin());

-- AI CALLS
create policy ai_self_insert on ai_calls for insert
  with check (user_id = auth_uid() or user_id is null);
create policy ai_admin_read  on ai_calls for select using (is_admin());
create policy ai_self_read   on ai_calls for select using (user_id = auth_uid());

-- ------------------------------------------------------------
-- TRIGGERS
-- ------------------------------------------------------------
create or replace function touch_updated_at() returns trigger
  language plpgsql as $$
    begin new.updated_at = now(); return new; end
$$;

create trigger chat_touch before update on chat_sessions
  for each row execute function touch_updated_at();

create trigger flags_touch before update on feature_flags
  for each row execute function touch_updated_at();
