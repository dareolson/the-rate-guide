// ==============================================
// The Rate Guide — Rate Calculator Logic
// Mirrors the formula in LOGIC.md exactly.
// ==============================================

export const DISCIPLINES = [
  "Camera Operator",
  "Cinematographer / DP",
  "Video Editor",
  "Colorist",
  "Motion Designer",
  "Producer",
] as const;

export type Discipline = (typeof DISCIPLINES)[number];

export const EXPERIENCE_LEVELS = ["Emerging", "Mid", "Senior", "Expert"] as const;
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

export const LOCATION_TIERS = ["Major Market", "Mid Market", "Small Market"] as const;
export type LocationTier = (typeof LOCATION_TIERS)[number];

// Rate floors by discipline + experience ($/day)
// Source: 2024-2025 market data per LOGIC.md
export const RATE_FLOORS: Record<Discipline, Record<ExperienceLevel, number>> = {
  "Camera Operator":       { Emerging: 400, Mid: 600, Senior: 800,  Expert: 1000 },
  "Cinematographer / DP":  { Emerging: 500, Mid: 800, Senior: 1200, Expert: 1500 },
  "Video Editor":          { Emerging: 350, Mid: 550, Senior: 750,  Expert: 1000 },
  "Colorist":              { Emerging: 400, Mid: 600, Senior: 900,  Expert: 1200 },
  "Motion Designer":       { Emerging: 350, Mid: 600, Senior: 850,  Expert: 1100 },
  "Producer":              { Emerging: 400, Mid: 650, Senior: 900,  Expert: 1200 },
};

// Typical rate ceilings by discipline + experience ($/day)
// Represents what well-positioned professionals at each level command.
// Floor = minimum the market pays. Ceiling = strong-but-realistic top end.
// Source: industry rate surveys, union cards, production rate data 2024-2025.
export const RATE_CEILINGS: Record<Discipline, Record<ExperienceLevel, number>> = {
  "Camera Operator":       { Emerging: 600,  Mid: 900,  Senior: 1300, Expert: 1800 },
  "Cinematographer / DP":  { Emerging: 800,  Mid: 1400, Senior: 2000, Expert: 3000 },
  "Video Editor":          { Emerging: 550,  Mid: 900,  Senior: 1400, Expert: 2000 },
  "Colorist":              { Emerging: 650,  Mid: 1000, Senior: 1600, Expert: 2500 },
  "Motion Designer":       { Emerging: 600,  Mid: 1000, Senior: 1500, Expert: 2200 },
  "Producer":              { Emerging: 650,  Mid: 1100, Senior: 1600, Expert: 2500 },
};

// Returns the market range (floor → ceiling) adjusted for location
// and the position label for the user's rate within that range.
export function marketRange(
  discipline: Discipline,
  experience: ExperienceLevel,
  location:   LocationTier,
  dayRate:    number,
): {
  floor:       number;
  ceiling:     number;
  position:    "below" | "low" | "mid" | "high" | "above";
  percentile:  number; // 0–100 within the floor→ceiling range
} {
  const multiplier = LOCATION_MULTIPLIERS[location];
  const floor      = RATE_FLOORS[discipline][experience]   * multiplier;
  const ceiling    = RATE_CEILINGS[discipline][experience] * multiplier;

  // Position within range as 0–100
  const raw        = (dayRate - floor) / (ceiling - floor);
  const percentile = Math.round(Math.min(Math.max(raw * 100, 0), 100));

  const position =
    dayRate < floor            ? "below" :
    dayRate < floor + (ceiling - floor) * 0.33 ? "low"   :
    dayRate < floor + (ceiling - floor) * 0.66 ? "mid"   :
    dayRate <= ceiling         ? "high"  :
    "above";

  return { floor, ceiling, position, percentile };
}

export const LOCATION_MULTIPLIERS: Record<LocationTier, number> = {
  "Major Market": 1.3,
  "Mid Market":   1.0,
  "Small Market": 0.85,
};

export const HEALTH_INSURANCE_ANNUAL = 7400; // 2026 ACA marketplace average
export const SE_TAX_RATE             = 0.153;
export const PROFIT_RATE             = 0.20;
export const KIT_FEE_DEFAULT         = 300;
export const DEFAULT_BILLABLE_DAYS   = 150;

export interface CalcInputs {
  discipline:    Discipline;
  experience:    ExperienceLevel;
  location:      LocationTier;
  takeHome:      number;
  billableDays:  number;
  hasKit:        boolean;
  includeProfit: boolean;
}

export interface CalcResults {
  takeHome:          number;
  healthInsurance:   number;
  seTax:             number;
  profit:            number;
  totalGrossNeeded:  number;
  billableDays:      number;
  dayRate:           number;
  halfDayRate:       number;
  hourlyRate:        number;
  kitFee:            number;
  rateFloor:         number;
  belowFloor:        boolean;
}

export function calculate(inputs: CalcInputs): CalcResults {
  const { takeHome, billableDays, hasKit, includeProfit, discipline, experience, location } = inputs;

  // Step 1 — take-home goal
  // Step 2 — add health insurance
  const subtotal1 = takeHome + HEALTH_INSURANCE_ANNUAL;

  // Step 3 — self-employment tax (both sides)
  const seTax = subtotal1 * SE_TAX_RATE;

  // Step 4 — profit margin (optional)
  const subtotal2 = subtotal1 + seTax;
  const profit = includeProfit ? subtotal2 * PROFIT_RATE : 0;
  const totalGrossNeeded = subtotal2 + profit;

  // Step 5 — divide by billable days
  const dayRate     = totalGrossNeeded / billableDays;
  const halfDayRate = dayRate * 0.60;
  const hourlyRate  = dayRate / 10;

  // Step 6 — kit fee (listed separately)
  const kitFee = hasKit ? KIT_FEE_DEFAULT : 0;

  // Floor check — apply location multiplier
  const rateFloor = RATE_FLOORS[discipline][experience] * LOCATION_MULTIPLIERS[location];
  const belowFloor = dayRate < rateFloor;

  return {
    takeHome,
    healthInsurance: HEALTH_INSURANCE_ANNUAL,
    seTax,
    profit,
    totalGrossNeeded,
    billableDays,
    dayRate,
    halfDayRate,
    hourlyRate,
    kitFee,
    rateFloor,
    belowFloor,
  };
}

// Format a number as USD with no cents
export function fmt(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}

// ==============================================
// COST OF LIVING REALITY CHECK
// Shows what the take-home goal actually means
// month-to-month after basic living expenses.
// Data based on 2025-2026 averages by market tier.
// ==============================================

export interface CostOfLiving {
  rent:           number; // 1BR apartment/mo
  food:           number; // groceries + dining/mo
  transportation: number; // car or transit/mo
  utilities:      number; // electric, internet, phone/mo
}

// Monthly expense estimates by market tier
export const COST_OF_LIVING: Record<LocationTier, CostOfLiving> = {
  "Major Market": { rent: 2500, food: 550, transportation: 150, utilities: 175 },
  "Mid Market":   { rent: 1500, food: 450, transportation: 375, utilities: 145 },
  "Small Market": { rent:  900, food: 350, transportation: 425, utilities: 120 },
};

// Cumulative CPI inflation from Jan 2019 → Jan 2026 (~27%)
// Source: BLS CPI-U
export const INFLATION_SINCE_2019 = 1.27;
export const INFLATION_BASE_YEAR  = 2019;

export interface RealityCheckResult {
  monthlyTakeHome:   number;
  rent:              number;
  food:              number;
  transportation:    number;
  utilities:         number;
  totalExpenses:     number;
  leftOver:          number;
  in2019Dollars:     number; // purchasing power of take-home in 2019 terms
}

export function realityCheck(takeHome: number, location: LocationTier): RealityCheckResult {
  const col   = COST_OF_LIVING[location];
  const monthly = takeHome / 12;
  const totalExpenses = col.rent + col.food + col.transportation + col.utilities;
  const leftOver = monthly - totalExpenses;

  return {
    monthlyTakeHome:  monthly,
    rent:             col.rent,
    food:             col.food,
    transportation:   col.transportation,
    utilities:        col.utilities,
    totalExpenses,
    leftOver,
    in2019Dollars:    takeHome / INFLATION_SINCE_2019,
  };
}
