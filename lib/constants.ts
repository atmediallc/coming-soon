export const SITE_CONFIG = {
  productName: "TraderAdd",
  badge: "Private beta · Limited seats",
  headline: "The trading journal that thinks with you.",
  subheadline:
    "TraderAdd brings your trades, journals, charts, analytics and AI reviews into one workflow so you can understand your process with more clarity.",
  cta: "Request Access",
  privacyNote: "No spam. Product updates only.",
  waitlistMomentum: "Built for process-driven traders joining the private beta.",
  successMessage: "You're in. We'll reach out when your spot opens.",
  errorMessage: "Enter a valid email to request access.",
  loadingMessage: "Requesting...",
  disclaimer: "TraderAdd is not financial advice. Trading involves risk.",
  sampleDataDisclaimer: "Sample data for product preview only.",
  links: {
    twitter: "https://twitter.com/traderadd",
    linkedin: "https://linkedin.com/company/traderadd",
    contact: "mailto:hello@traderadd.com",
  },
};

export const LAUNCH_CONFIG = {
  enabled: true,
  targetDate: "2026-09-01",
  launchLabel: "Private beta opens",
  launchWindow: "Q3 2026",
  capacityLabel: "Limited early access",
  progressLabel: "Beta access preparation",
  progressPercent: 62,
  openStateLabel: "Private beta is opening now.",
};

export const MOCKUP_DATA = {
  netPnL: "+$12,450",
  winRate: "68.5%",
  profitFactor: "2.4",
  rMultiple: "+1.8R",
  tradesReviewed: "142",
  reviewScore: "A−",
  aiInsight:
    "Your best trades share the same pattern: planned entry, controlled risk, and post-trade notes completed within 24 hours.",
  journalQuality: "High",
  backtestWinRate: "71.2%",
  backtestSharpe: "1.94",
  calendarStreak: "12-day streak",
};

export const FEATURES = [
  // Journal & Review
  {
    category: "journal",
    title: "Trade Journal",
    description:
      "Capture entries, exits, notes, emotions, mistakes, and trade context in one structured workflow.",
    icon: "book",
  },
  {
    category: "journal",
    title: "AI Trade Reviews",
    description:
      "Turn each completed trade into a clearer review with signals, patterns, and next-step coaching.",
    icon: "brain",
    featured: true,
  },
  {
    category: "journal",
    title: "Workflow Coach",
    description:
      "A structured process to maintain peak performance and avoid overtrading or revenge trading.",
    icon: "target",
  },
  // Analytics & Charts
  {
    category: "analytics",
    title: "Performance Analytics",
    description:
      "Track your performance by setup, symbol, session, risk profile, and behavior patterns.",
    icon: "bar-chart",
  },
  {
    category: "analytics",
    title: "Advanced Charting",
    description:
      "Review trades directly on chart context with entries, exits, risk levels, and price action.",
    icon: "candlestick-chart",
  },
  {
    category: "analytics",
    title: "Calendar Intelligence",
    description:
      "See your trading month through daily performance, review quality, streaks, and behavior signals.",
    icon: "calendar",
  },
  // Risk & Systems
  {
    category: "risk",
    title: "Backtesting & Simulator",
    description:
      "Test ideas, review scenarios, and study process quality before putting capital at risk.",
    icon: "activity",
  },
  {
    category: "risk",
    title: "Risk & Discipline Tracking",
    description:
      "Identify rule breaks, overtrading, risk drift, and patterns that affect decision quality.",
    icon: "shield-check",
  },
  {
    category: "risk",
    title: "Market Data Integrations",
    description:
      "Connect market context into the review workflow without turning your journal into a spreadsheet.",
    icon: "database",
  },
];

export const FEATURE_CATEGORIES = [
  { key: "journal", label: "Journal & Review" },
  { key: "analytics", label: "Analytics & Charts" },
  { key: "risk", label: "Risk & Systems" },
];

export const PROCESS_STEPS = [
  {
    label: "Raw Trades",
    description: "Import or log trades from any session",
    color: "bg-white/8",
  },
  {
    label: "Notes & Context",
    description: "Add emotions, setups, and decision notes",
    color: "bg-white/8",
  },
  {
    label: "AI Review",
    description: "Get pattern signals and behavior coaching",
    color: "bg-accent/30",
    highlighted: true,
  },
  {
    label: "Metrics",
    description: "Analytics across every dimension of performance",
    color: "bg-white/8",
  },
  {
    label: "Repeatable Process",
    description: "A clearer trading workflow, every session",
    color: "bg-emerald-500/20",
    isOutput: true,
  },
];

export const AUDIENCE_PROFILES = [
  {
    icon: "chart",
    label: "Discretionary Traders",
    description: "Who want to understand what's actually driving their results",
  },
  {
    icon: "shield",
    label: "Funded Account Traders",
    description: "Who need discipline tracking and consistent review workflows",
  },
  {
    icon: "users",
    label: "Trading Teams",
    description: "Who want shared review workflows and performance visibility",
  },
  {
    icon: "target",
    label: "Performance-Focused Operators",
    description: "Who treat trading as a professional process, not a gamble",
  },
];

export const CURRENT_YEAR = 2026;
