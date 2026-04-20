export const APP_NAME = "FinPilot";
export const APP_TAGLINE = "Your AI co-pilot for Indian personal finance.";

export const INCOME_RANGES = ["<30k", "30k-50k", "50k-1L", "1L-2L", "2L+"] as const;
export const RISK_LEVELS = ["conservative", "moderate", "aggressive"] as const;
export const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी" },
] as const;

export const GOAL_CATEGORIES = [
  "safety", "lifestyle", "gadget", "home", "family", "education", "retirement",
] as const;

export const EXPENSE_CATEGORIES = [
  "salary", "rent", "utilities", "groceries", "dining", "transport",
  "subscriptions", "shopping", "investment", "health", "education", "other",
] as const;

export const CHAT_SUGGESTIONS = [
  "What is the difference between ELSS and PPF?",
  "How much should I save monthly if my goal is ₹10L in 3 years?",
  "Explain SIP vs lump-sum investing",
  "Is it worth prepaying my home loan or investing the extra money?",
  "What are the tax benefits under Section 80C?",
];
