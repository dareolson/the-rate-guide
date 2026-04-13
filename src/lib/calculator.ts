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

// Family size options
export const FAMILY_SIZES = [
  "Single",
  "Couple",
  "Family of 3",
  "Family of 4",
] as const;
export type FamilySize = (typeof FAMILY_SIZES)[number];

// Health insurance annual premiums by family size
// Source: KFF Employer Health Benefits Survey 2025 / ACA marketplace 2026
export const HEALTH_INSURANCE_BY_FAMILY: Record<FamilySize, number> = {
  "Single":      7400,   // individual ACA avg
  "Couple":      14800,  // two-person plan avg
  "Family of 3": 19200,  // two adults + one child
  "Family of 4": 22000,  // two adults + two children
};

export interface CostOfLiving {
  rent:           number; // housing/mo (adjusted for family size)
  food:           number; // groceries + dining/mo
  transportation: number; // car payment/insurance or transit/mo
  utilities:      number; // electric, gas, water/mo
  cellPhone:      number; // cell plan(s)/mo
  clothing:       number; // clothing + personal care/mo
  entertainment:  number; // streaming, activities, misc/mo
  childcare:      number; // daycare/school costs/mo (0 if no children)
  savings:        number; // recommended emergency fund contribution/mo
}

// Monthly expense estimates by market tier AND family size
// Sources: BLS Consumer Expenditure Survey 2024, MIT Living Wage Calculator,
// NerdWallet Cost of Living data 2025-2026
export const COST_OF_LIVING: Record<LocationTier, Record<FamilySize, CostOfLiving>> = {
  "Major Market": {
    "Single":      { rent: 2500, food: 550,  transportation: 150,  utilities: 175, cellPhone: 80,  clothing: 120, entertainment: 100, childcare: 0,    savings: 300 },
    "Couple":      { rent: 3200, food: 900,  transportation: 400,  utilities: 220, cellPhone: 150, clothing: 200, entertainment: 150, childcare: 0,    savings: 500 },
    "Family of 3": { rent: 3800, food: 1100, transportation: 500,  utilities: 260, cellPhone: 160, clothing: 280, entertainment: 180, childcare: 2200, savings: 600 },
    "Family of 4": { rent: 4400, food: 1400, transportation: 600,  utilities: 300, cellPhone: 200, clothing: 350, entertainment: 200, childcare: 3800, savings: 700 },
  },
  "Mid Market": {
    "Single":      { rent: 1500, food: 450,  transportation: 375,  utilities: 145, cellPhone: 80,  clothing: 100, entertainment: 80,  childcare: 0,    savings: 200 },
    "Couple":      { rent: 1900, food: 750,  transportation: 600,  utilities: 185, cellPhone: 150, clothing: 160, entertainment: 120, childcare: 0,    savings: 350 },
    "Family of 3": { rent: 2300, food: 900,  transportation: 700,  utilities: 220, cellPhone: 160, clothing: 220, entertainment: 140, childcare: 1400, savings: 400 },
    "Family of 4": { rent: 2700, food: 1150, transportation: 800,  utilities: 250, cellPhone: 200, clothing: 280, entertainment: 160, childcare: 2600, savings: 500 },
  },
  "Small Market": {
    "Single":      { rent:  900, food: 350,  transportation: 425,  utilities: 120, cellPhone: 75,  clothing: 80,  entertainment: 60,  childcare: 0,    savings: 150 },
    "Couple":      { rent: 1200, food: 600,  transportation: 650,  utilities: 155, cellPhone: 140, clothing: 130, entertainment: 90,  childcare: 0,    savings: 250 },
    "Family of 3": { rent: 1500, food: 750,  transportation: 750,  utilities: 185, cellPhone: 150, clothing: 180, entertainment: 110, childcare: 900,  savings: 300 },
    "Family of 4": { rent: 1800, food: 950,  transportation: 850,  utilities: 210, cellPhone: 190, clothing: 230, entertainment: 130, childcare: 1800, savings: 400 },
  },
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
  cellPhone:         number;
  clothing:          number;
  entertainment:     number;
  childcare:         number;
  savings:           number;
  healthInsurance:   number; // monthly portion of annual premium
  totalExpenses:     number;
  leftOver:          number;
  in2019Dollars:     number;
}

export function realityCheck(
  takeHome:   number,
  location:   LocationTier,
  familySize: FamilySize = "Single",
): RealityCheckResult {
  const col            = COST_OF_LIVING[location][familySize];
  const monthly        = takeHome / 12;
  const healthMonthly  = HEALTH_INSURANCE_BY_FAMILY[familySize] / 12;

  const totalExpenses =
    col.rent + col.food + col.transportation + col.utilities +
    col.cellPhone + col.clothing + col.entertainment +
    col.childcare + col.savings + healthMonthly;

  const leftOver = monthly - totalExpenses;

  return {
    monthlyTakeHome:  monthly,
    rent:             col.rent,
    food:             col.food,
    transportation:   col.transportation,
    utilities:        col.utilities,
    cellPhone:        col.cellPhone,
    clothing:         col.clothing,
    entertainment:    col.entertainment,
    childcare:        col.childcare,
    savings:          col.savings,
    healthInsurance:  healthMonthly,
    totalExpenses,
    leftOver,
    in2019Dollars:    takeHome / INFLATION_SINCE_2019,
  };
}
