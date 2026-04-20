-- ============================================================
-- FinPilot — Seed Data
-- Run after schema migrations. Idempotent where possible.
-- ============================================================

-- ------------------------------------------------------------
-- 1. BANKS + FD RATES (hardcoded, updated via /admin/content)
-- ------------------------------------------------------------
create table if not exists banks (
  id            uuid primary key default gen_random_uuid(),
  name          text not null unique,
  type          text not null check (type in ('PSU','Private','SFB','Foreign')),
  logo_url      text,
  updated_at    timestamptz default now()
);

create table if not exists fd_rates (
  id            uuid primary key default gen_random_uuid(),
  bank_id       uuid references banks(id) on delete cascade,
  tenure_months int  not null,
  rate_general  numeric(4,2) not null,
  rate_senior   numeric(4,2) not null,
  min_amount    int  default 1000,
  updated_at    timestamptz default now(),
  unique (bank_id, tenure_months)
);

insert into banks (name, type) values
  ('State Bank of India','PSU'),
  ('HDFC Bank','Private'),
  ('ICICI Bank','Private'),
  ('Axis Bank','Private'),
  ('Kotak Mahindra Bank','Private'),
  ('IndusInd Bank','Private'),
  ('Yes Bank','Private'),
  ('Punjab National Bank','PSU'),
  ('Bank of Baroda','PSU'),
  ('Canara Bank','PSU'),
  ('IDFC First Bank','Private'),
  ('RBL Bank','Private'),
  ('Suryoday Small Finance Bank','SFB'),
  ('Unity Small Finance Bank','SFB'),
  ('Ujjivan Small Finance Bank','SFB'),
  ('Equitas Small Finance Bank','SFB'),
  ('AU Small Finance Bank','SFB')
on conflict (name) do nothing;

-- Rates: (bank, tenure_months, general, senior)
-- Tenures: 6, 12, 24, 36, 60 months
insert into fd_rates (bank_id, tenure_months, rate_general, rate_senior) values
  ((select id from banks where name='State Bank of India'), 6,  5.75, 6.25),
  ((select id from banks where name='State Bank of India'), 12, 6.80, 7.30),
  ((select id from banks where name='State Bank of India'), 24, 7.00, 7.50),
  ((select id from banks where name='State Bank of India'), 36, 6.75, 7.25),
  ((select id from banks where name='State Bank of India'), 60, 6.50, 7.50),

  ((select id from banks where name='HDFC Bank'), 6,  6.00, 6.50),
  ((select id from banks where name='HDFC Bank'), 12, 6.60, 7.10),
  ((select id from banks where name='HDFC Bank'), 24, 7.00, 7.50),
  ((select id from banks where name='HDFC Bank'), 36, 7.00, 7.50),
  ((select id from banks where name='HDFC Bank'), 60, 6.90, 7.40),

  ((select id from banks where name='ICICI Bank'), 6,  5.75, 6.25),
  ((select id from banks where name='ICICI Bank'), 12, 6.70, 7.20),
  ((select id from banks where name='ICICI Bank'), 24, 7.20, 7.70),
  ((select id from banks where name='ICICI Bank'), 36, 7.00, 7.50),
  ((select id from banks where name='ICICI Bank'), 60, 6.90, 7.40),

  ((select id from banks where name='Axis Bank'), 12, 6.70, 7.20),
  ((select id from banks where name='Axis Bank'), 24, 7.10, 7.60),
  ((select id from banks where name='Axis Bank'), 36, 7.10, 7.60),
  ((select id from banks where name='Axis Bank'), 60, 7.00, 7.75),

  ((select id from banks where name='Kotak Mahindra Bank'), 12, 6.60, 7.10),
  ((select id from banks where name='Kotak Mahindra Bank'), 24, 7.15, 7.65),
  ((select id from banks where name='Kotak Mahindra Bank'), 36, 7.00, 7.50),
  ((select id from banks where name='Kotak Mahindra Bank'), 60, 6.20, 6.70),

  ((select id from banks where name='IndusInd Bank'), 12, 7.25, 7.85),
  ((select id from banks where name='IndusInd Bank'), 24, 7.75, 8.25),
  ((select id from banks where name='IndusInd Bank'), 36, 7.25, 7.85),
  ((select id from banks where name='IndusInd Bank'), 60, 7.25, 7.85),

  ((select id from banks where name='Yes Bank'), 12, 7.25, 7.75),
  ((select id from banks where name='Yes Bank'), 24, 8.00, 8.50),
  ((select id from banks where name='Yes Bank'), 36, 7.25, 8.00),
  ((select id from banks where name='Yes Bank'), 60, 7.25, 8.00),

  ((select id from banks where name='IDFC First Bank'), 12, 6.50, 7.00),
  ((select id from banks where name='IDFC First Bank'), 24, 7.75, 8.25),
  ((select id from banks where name='IDFC First Bank'), 36, 7.25, 7.75),
  ((select id from banks where name='IDFC First Bank'), 60, 7.00, 7.50),

  ((select id from banks where name='RBL Bank'), 12, 7.50, 8.00),
  ((select id from banks where name='RBL Bank'), 24, 8.10, 8.60),
  ((select id from banks where name='RBL Bank'), 36, 7.50, 8.00),
  ((select id from banks where name='RBL Bank'), 60, 7.10, 7.60),

  -- Small Finance Banks — the high-rate heroes
  ((select id from banks where name='Suryoday Small Finance Bank'), 12, 8.25, 8.75),
  ((select id from banks where name='Suryoday Small Finance Bank'), 24, 8.60, 9.10),
  ((select id from banks where name='Suryoday Small Finance Bank'), 36, 8.50, 9.00),
  ((select id from banks where name='Suryoday Small Finance Bank'), 60, 8.25, 8.75),

  ((select id from banks where name='Unity Small Finance Bank'), 12, 7.85, 8.35),
  ((select id from banks where name='Unity Small Finance Bank'), 24, 8.15, 8.65),
  ((select id from banks where name='Unity Small Finance Bank'), 36, 8.75, 9.25),
  ((select id from banks where name='Unity Small Finance Bank'), 60, 8.50, 9.00),

  ((select id from banks where name='Ujjivan Small Finance Bank'), 12, 8.00, 8.50),
  ((select id from banks where name='Ujjivan Small Finance Bank'), 24, 8.25, 8.75),
  ((select id from banks where name='Ujjivan Small Finance Bank'), 36, 8.25, 8.75),
  ((select id from banks where name='Ujjivan Small Finance Bank'), 60, 7.20, 7.70),

  ((select id from banks where name='Equitas Small Finance Bank'), 12, 8.20, 8.70),
  ((select id from banks where name='Equitas Small Finance Bank'), 24, 8.50, 9.00),
  ((select id from banks where name='Equitas Small Finance Bank'), 36, 8.00, 8.50),
  ((select id from banks where name='Equitas Small Finance Bank'), 60, 7.25, 7.75),

  ((select id from banks where name='AU Small Finance Bank'), 12, 7.25, 7.75),
  ((select id from banks where name='AU Small Finance Bank'), 24, 8.00, 8.50),
  ((select id from banks where name='AU Small Finance Bank'), 36, 7.75, 8.25),
  ((select id from banks where name='AU Small Finance Bank'), 60, 7.25, 7.75)
on conflict (bank_id, tenure_months) do update
  set rate_general = excluded.rate_general,
      rate_senior  = excluded.rate_senior,
      updated_at   = now();

-- ------------------------------------------------------------
-- 2. DEMO USERS (Raj Sharma = primary guest, + referrals)
-- ------------------------------------------------------------
-- IDs follow Clerk's text format. For guest mode, seed locally with
-- id='demo_guest_raj' and skip Clerk. Real users upsert with Clerk id.

insert into users (id, email, name, phone, income_range, risk_appetite, language, role, referral_code, referred_by, credits)
values
  ('demo_guest_raj',
   'raj.sharma@demo.finpilot.app', 'Raj Sharma', '+919812345601',
   '50k-1L', 'moderate', 'en', 'user', 'RAJ-F8K2', null, 14),

  ('demo_user_priya',
   'priya.iyer@demo.finpilot.app', 'Priya Iyer', '+919812345602',
   '1L-2L', 'aggressive', 'en', 'user', 'PRI-M3L9', 'RAJ-F8K2', 44),

  ('demo_user_aman',
   'aman.verma@demo.finpilot.app', 'Aman Verma', '+919812345603',
   '30k-50k', 'conservative', 'hi', 'user', 'AMN-K7P1', 'RAJ-F8K2', 14),

  ('demo_admin',
   'admin@demo.finpilot.app', 'FinPilot Admin', '+919812345600',
   '1L-2L', 'moderate', 'en', 'admin', 'ADM-0001', null, 999)
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- 3. GOALS (Raj)
-- ------------------------------------------------------------
insert into goals (user_id, title, target_amount, current_amount, deadline, category) values
  ('demo_guest_raj', 'Emergency Fund',           300000,  85000,  '2026-12-31', 'safety'),
  ('demo_guest_raj', 'Goa Trip (Dec 2026)',       80000,  22000,  '2026-12-01', 'lifestyle'),
  ('demo_guest_raj', 'MacBook Pro',              180000,  40000,  '2026-09-30', 'gadget'),
  ('demo_guest_raj', 'Down Payment (2BHK Pune)', 1500000, 210000, '2029-06-30', 'home'),
  ('demo_user_priya', 'Japan Trip',               250000,  95000,  '2027-03-15', 'lifestyle'),
  ('demo_user_aman', 'Wedding Fund',             500000, 120000,  '2028-02-14', 'family');

-- ------------------------------------------------------------
-- 4. TRANSACTIONS (Raj — last 30 days, realistic Indian mix)
-- ------------------------------------------------------------
insert into transactions (user_id, amount, category, merchant, date, type, source) values
  -- Income
  ('demo_guest_raj',  75000, 'salary',        'Acme Corp Payroll',     '2026-04-01', 'credit', 'bank'),

  -- Rent + Utilities
  ('demo_guest_raj', -18000, 'rent',          'Landlord (NoBroker)',   '2026-04-02', 'debit',  'bank'),
  ('demo_guest_raj',  -1450, 'utilities',     'Tata Power',            '2026-04-05', 'debit',  'upi'),
  ('demo_guest_raj',  -899,  'utilities',     'Jio Fiber',             '2026-04-05', 'debit',  'upi'),
  ('demo_guest_raj',  -349,  'utilities',     'Airtel Postpaid',       '2026-04-08', 'debit',  'upi'),

  -- Groceries
  ('demo_guest_raj',  -2340, 'groceries',     'Blinkit',               '2026-04-03', 'debit',  'upi'),
  ('demo_guest_raj',  -1820, 'groceries',     'Zepto',                 '2026-04-10', 'debit',  'upi'),
  ('demo_guest_raj',  -3100, 'groceries',     'BigBasket',             '2026-04-14', 'debit',  'upi'),

  -- Food & dining (the ouch category)
  ('demo_guest_raj',  -485,  'dining',        'Swiggy',                '2026-04-04', 'debit',  'upi'),
  ('demo_guest_raj',  -620,  'dining',        'Zomato',                '2026-04-06', 'debit',  'upi'),
  ('demo_guest_raj',  -340,  'dining',        'Starbucks',             '2026-04-07', 'debit',  'card'),
  ('demo_guest_raj',  -890,  'dining',        'Swiggy',                '2026-04-09', 'debit',  'upi'),
  ('demo_guest_raj',  -1200, 'dining',        'Toit Brewpub',          '2026-04-12', 'debit',  'card'),
  ('demo_guest_raj',  -540,  'dining',        'Zomato',                '2026-04-15', 'debit',  'upi'),
  ('demo_guest_raj',  -720,  'dining',        'Swiggy',                '2026-04-18', 'debit',  'upi'),

  -- Transport
  ('demo_guest_raj',  -240,  'transport',     'Uber',                  '2026-04-04', 'debit',  'upi'),
  ('demo_guest_raj',  -185,  'transport',     'Rapido',                '2026-04-07', 'debit',  'upi'),
  ('demo_guest_raj',  -380,  'transport',     'Ola',                   '2026-04-11', 'debit',  'upi'),
  ('demo_guest_raj',  -1200, 'transport',     'IndianOil (fuel)',      '2026-04-13', 'debit',  'card'),
  ('demo_guest_raj',  -220,  'transport',     'Namma Metro',           '2026-04-16', 'debit',  'upi'),

  -- Subscriptions
  ('demo_guest_raj',  -149,  'subscriptions', 'Netflix',               '2026-04-02', 'debit',  'card'),
  ('demo_guest_raj',  -119,  'subscriptions', 'Spotify',               '2026-04-02', 'debit',  'card'),
  ('demo_guest_raj',  -299,  'subscriptions', 'Amazon Prime',          '2026-04-03', 'debit',  'card'),
  ('demo_guest_raj',  -499,  'subscriptions', 'ChatGPT Plus',          '2026-04-06', 'debit',  'card'),

  -- Shopping
  ('demo_guest_raj',  -2499, 'shopping',      'Amazon',                '2026-04-09', 'debit',  'card'),
  ('demo_guest_raj',  -3799, 'shopping',      'Myntra',                '2026-04-14', 'debit',  'card'),

  -- Investments (good guy)
  ('demo_guest_raj', -10000, 'investment',    'Groww SIP — Nifty 50',  '2026-04-05', 'debit',  'bank'),
  ('demo_guest_raj',  -5000, 'investment',    'Zerodha SIP — Parag Parikh','2026-04-05','debit','bank'),
  ('demo_guest_raj',  -3000, 'investment',    'PPF Contribution',      '2026-04-10', 'debit',  'bank'),

  -- Health
  ('demo_guest_raj',  -650,  'health',        '1mg Pharmacy',          '2026-04-11', 'debit',  'upi'),
  ('demo_guest_raj',  -1500, 'health',        'Cult.fit Membership',   '2026-04-01', 'debit',  'card');

-- ------------------------------------------------------------
-- 5. FD PORTFOLIO (Raj has a 3-rung ladder)
-- ------------------------------------------------------------
insert into fd_portfolios (user_id, bank, amount, rate, start_date, maturity_date, tenure_months) values
  ('demo_guest_raj', 'HDFC Bank',                    50000, 6.60, '2026-01-15', '2027-01-15', 12),
  ('demo_guest_raj', 'Suryoday Small Finance Bank',  75000, 8.60, '2026-02-01', '2028-02-01', 24),
  ('demo_guest_raj', 'Unity Small Finance Bank',    100000, 8.75, '2026-02-15', '2029-02-15', 36);

-- ------------------------------------------------------------
-- 6. REFERRALS
-- ------------------------------------------------------------
insert into referrals (referrer_id, referred_id, status, reward_given) values
  ('demo_guest_raj','demo_user_priya','converted', true),
  ('demo_guest_raj','demo_user_aman','converted', true);

-- ------------------------------------------------------------
-- 7. FEATURE FLAGS
-- ------------------------------------------------------------
insert into feature_flags (key, enabled, rollout_percentage) values
  ('ai_ladder_generator',   true,  100),
  ('hindi_chatbot',         true,  100),
  ('pdf_statement_upload',  true,   50),
  ('referral_leaderboard',  true,  100),
  ('what_if_simulator',     true,  100),
  ('fd_booking_redirect',   true,  100)
on conflict (key) do nothing;

-- ------------------------------------------------------------
-- 8. CHAT SESSION (one seeded example so /chat doesn't feel empty)
-- ------------------------------------------------------------
insert into chat_sessions (user_id, messages_json) values
  ('demo_guest_raj',
   '[
      {"role":"user","content":"What is the difference between ELSS and PPF?"},
      {"role":"assistant","content":"Great question, Raj! Both save tax under 80C but differ in three ways: (1) Lock-in — ELSS 3 years, PPF 15 years. (2) Returns — ELSS is market-linked (~12% historical), PPF is govt-backed (~7.1%). (3) Risk — ELSS can dip short-term, PPF cannot. For your moderate risk appetite and ₹50k-1L income, a mix of ~₹1L in ELSS + ₹50k in PPF annually is a reasonable split. Want me to model this in the What-If simulator?"}
    ]'::jsonb);

-- ============================================================
-- Done. Guest mode should read user_id = '11111111-...'
-- Admin demo login: admin@demo.finpilot.app
-- ============================================================
