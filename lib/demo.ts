// Demo mode: when real keys aren't configured, fall back to in-memory
// mock data so the UI is fully browseable without Clerk/Supabase/Claude.

export const isDemoMode =
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith("pk_test_xxx") ||
  process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export const demoUser = {
  id: "demo_guest_raj",
  name: "Raj Sharma",
  email: "raj.sharma@demo.finpilot.app",
  income_range: "50k-1L",
  risk_appetite: "moderate",
  language: "en" as const,
  role: "user",
  referral_code: "RAJ-F8K2",
  credits: 44,
};

export const demoGoals = [
  { id: "1", title: "Emergency Fund", target_amount: 300000, current_amount: 85000, deadline: "2026-12-31", category: "safety" },
  { id: "2", title: "Goa Trip (Dec 2026)", target_amount: 80000, current_amount: 22000, deadline: "2026-12-01", category: "lifestyle" },
  { id: "3", title: "MacBook Pro", target_amount: 180000, current_amount: 40000, deadline: "2026-09-30", category: "gadget" },
  { id: "4", title: "Down Payment (2BHK Pune)", target_amount: 1500000, current_amount: 210000, deadline: "2029-06-30", category: "home" },
];

export const demoTransactions = [
  { id: "t1",  date: "2026-04-18", merchant: "Swiggy",            category: "dining",        amount: -720,   type: "debit" },
  { id: "t2",  date: "2026-04-16", merchant: "Namma Metro",       category: "transport",     amount: -220,   type: "debit" },
  { id: "t3",  date: "2026-04-15", merchant: "Zomato",            category: "dining",        amount: -540,   type: "debit" },
  { id: "t4",  date: "2026-04-14", merchant: "BigBasket",         category: "groceries",     amount: -3100,  type: "debit" },
  { id: "t5",  date: "2026-04-14", merchant: "Myntra",            category: "shopping",      amount: -3799,  type: "debit" },
  { id: "t6",  date: "2026-04-13", merchant: "IndianOil",         category: "transport",     amount: -1200,  type: "debit" },
  { id: "t7",  date: "2026-04-12", merchant: "Toit Brewpub",      category: "dining",        amount: -1200,  type: "debit" },
  { id: "t8",  date: "2026-04-11", merchant: "Ola",               category: "transport",     amount: -380,   type: "debit" },
  { id: "t9",  date: "2026-04-11", merchant: "1mg Pharmacy",      category: "health",        amount: -650,   type: "debit" },
  { id: "t10", date: "2026-04-10", merchant: "Zepto",             category: "groceries",     amount: -1820,  type: "debit" },
  { id: "t11", date: "2026-04-10", merchant: "PPF Contribution",  category: "investment",    amount: -3000,  type: "debit" },
  { id: "t12", date: "2026-04-09", merchant: "Swiggy",            category: "dining",        amount: -890,   type: "debit" },
  { id: "t13", date: "2026-04-09", merchant: "Amazon",            category: "shopping",      amount: -2499,  type: "debit" },
  { id: "t14", date: "2026-04-07", merchant: "Starbucks",         category: "dining",        amount: -340,   type: "debit" },
  { id: "t15", date: "2026-04-06", merchant: "ChatGPT Plus",      category: "subscriptions", amount: -499,   type: "debit" },
  { id: "t16", date: "2026-04-05", merchant: "Groww SIP",         category: "investment",    amount: -10000, type: "debit" },
  { id: "t17", date: "2026-04-05", merchant: "Zerodha SIP",       category: "investment",    amount: -5000,  type: "debit" },
  { id: "t18", date: "2026-04-05", merchant: "Tata Power",        category: "utilities",     amount: -1450,  type: "debit" },
  { id: "t19", date: "2026-04-03", merchant: "Amazon Prime",      category: "subscriptions", amount: -299,   type: "debit" },
  { id: "t20", date: "2026-04-03", merchant: "Blinkit",           category: "groceries",     amount: -2340,  type: "debit" },
  { id: "t21", date: "2026-04-02", merchant: "Landlord",          category: "rent",          amount: -18000, type: "debit" },
  { id: "t22", date: "2026-04-02", merchant: "Netflix",           category: "subscriptions", amount: -149,   type: "debit" },
  { id: "t23", date: "2026-04-01", merchant: "Cult.fit",          category: "health",        amount: -1500,  type: "debit" },
  { id: "t24", date: "2026-04-01", merchant: "Acme Corp Payroll", category: "salary",        amount:  75000, type: "credit" },
];

export const demoReferrals = [
  { id: "r1", status: "converted", reward_given: true, referred: { name: "Priya Iyer", email: "priya.iyer@demo.finpilot.app" } },
  { id: "r2", status: "converted", reward_given: true, referred: { name: "Aman Verma", email: "aman.verma@demo.finpilot.app" } },
];

export const demoFDRates = [
  { bank: "Unity Small Finance Bank",    type: "SFB",     tenure_months: 36, rate_general: 8.75, rate_senior: 9.25 },
  { bank: "Suryoday Small Finance Bank", type: "SFB",     tenure_months: 24, rate_general: 8.60, rate_senior: 9.10 },
  { bank: "Unity Small Finance Bank",    type: "SFB",     tenure_months: 60, rate_general: 8.50, rate_senior: 9.00 },
  { bank: "Equitas Small Finance Bank",  type: "SFB",     tenure_months: 24, rate_general: 8.50, rate_senior: 9.00 },
  { bank: "Suryoday Small Finance Bank", type: "SFB",     tenure_months: 36, rate_general: 8.50, rate_senior: 9.00 },
  { bank: "Ujjivan Small Finance Bank",  type: "SFB",     tenure_months: 24, rate_general: 8.25, rate_senior: 8.75 },
  { bank: "Suryoday Small Finance Bank", type: "SFB",     tenure_months: 12, rate_general: 8.25, rate_senior: 8.75 },
  { bank: "Equitas Small Finance Bank",  type: "SFB",     tenure_months: 12, rate_general: 8.20, rate_senior: 8.70 },
  { bank: "RBL Bank",                    type: "Private", tenure_months: 24, rate_general: 8.10, rate_senior: 8.60 },
  { bank: "Yes Bank",                    type: "Private", tenure_months: 24, rate_general: 8.00, rate_senior: 8.50 },
  { bank: "AU Small Finance Bank",       type: "SFB",     tenure_months: 24, rate_general: 8.00, rate_senior: 8.50 },
  { bank: "Ujjivan Small Finance Bank",  type: "SFB",     tenure_months: 12, rate_general: 8.00, rate_senior: 8.50 },
  { bank: "IndusInd Bank",               type: "Private", tenure_months: 24, rate_general: 7.75, rate_senior: 8.25 },
  { bank: "IDFC First Bank",             type: "Private", tenure_months: 24, rate_general: 7.75, rate_senior: 8.25 },
  { bank: "Axis Bank",                   type: "Private", tenure_months: 24, rate_general: 7.10, rate_senior: 7.60 },
  { bank: "ICICI Bank",                  type: "Private", tenure_months: 24, rate_general: 7.20, rate_senior: 7.70 },
  { bank: "HDFC Bank",                   type: "Private", tenure_months: 24, rate_general: 7.00, rate_senior: 7.50 },
  { bank: "State Bank of India",         type: "PSU",     tenure_months: 24, rate_general: 7.00, rate_senior: 7.50 },
];

export const demoLadderExplanation = `**Recommended Split for ₹1,00,000 over 24 months**

1. **Unity SFB — 24m @ 8.15%** — ₹40,000 → Matures ₹47,100
2. **Suryoday SFB — 12m @ 8.25%** — ₹30,000 → Matures ₹32,550 (reinvest at maturity)
3. **HDFC Bank — 24m @ 7.00%** — ₹30,000 → Matures ₹34,380

**Why this split:**
- SFBs drive yield (both under ₹5L DICGC insurance limit — fully safe)
- HDFC anchor for liquidity confidence and easier premature exit
- 12m rung creates a reinvestment opportunity mid-way if rates rise

**हिंदी में:** यह लैडर आपको ज़्यादा रिटर्न (SFB से ~8.2%) देता है, और HDFC की 24 महीने की FD से सुरक्षा भी। बीच में (12 महीने बाद) पैसा वापस आएगा, जिसे आप नए रेट पर फिर से लगा सकते हैं।`;

export const demoInsight =
  "Your dining spend (₹4,202 this month) is 18% higher than last month — mostly Swiggy/Zomato. Good news: your SIP discipline is solid at ₹15K/mo, putting you on track for ₹30L in 10 years at 12% CAGR. Consider a ₹2K/mo meal-prep challenge to redirect that to your Goa trip goal.";
