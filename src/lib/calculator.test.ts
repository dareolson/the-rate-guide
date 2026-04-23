// ==============================================
// calculator.test.ts
// Unit tests for all exported functions in calculator.ts
// Run with: npm test
// ==============================================

import { describe, it, expect } from "vitest";
import {
  calculate,
  currentEarnings,
  marketRange,
  realityCheck,
  federalEffectiveRate,
  fmt,
  RATE_FLOORS,
  RATE_CEILINGS,
  LOCATION_MULTIPLIERS,
  STATE_TAX_RATE,
  HEALTH_INSURANCE_ANNUAL,
  SE_TAX_RATE,
  PROFIT_RATE,
  FREELANCE_WRITEOFFS,
  DEFAULT_BILLABLE_DAYS,
} from "./calculator";

// ==============================================
// federalEffectiveRate
// ==============================================
describe("federalEffectiveRate", () => {
  it("returns the lowest rate for income below $15k", () => {
    expect(federalEffectiveRate(0)).toBe(0.04);
    expect(federalEffectiveRate(14999)).toBe(0.04);
  });

  it("returns correct rate at each bracket boundary", () => {
    expect(federalEffectiveRate(15000)).toBe(0.08);
    expect(federalEffectiveRate(30000)).toBe(0.11);
    expect(federalEffectiveRate(50000)).toBe(0.14);
    expect(federalEffectiveRate(75000)).toBe(0.17);
    expect(federalEffectiveRate(100000)).toBe(0.20);
    expect(federalEffectiveRate(140000)).toBe(0.23);
  });

  it("returns the top rate for very high income", () => {
    expect(federalEffectiveRate(200000)).toBe(0.26);
    expect(federalEffectiveRate(500000)).toBe(0.26);
  });
});

// ==============================================
// fmt
// ==============================================
describe("fmt", () => {
  it("formats round numbers with dollar sign", () => {
    expect(fmt(1000)).toBe("$1,000");
    expect(fmt(500)).toBe("$500");
  });

  it("rounds fractional values", () => {
    expect(fmt(999.6)).toBe("$1,000");
    expect(fmt(999.4)).toBe("$999");
  });

  it("handles zero", () => {
    expect(fmt(0)).toBe("$0");
  });

  it("handles large numbers", () => {
    expect(fmt(100000)).toBe("$100,000");
  });
});

// ==============================================
// calculate — core formula
// ==============================================
describe("calculate", () => {
  const baseInputs = {
    discipline:    "Cinematographer / DP" as const,
    experience:    "Mid" as const,
    location:      "Mid Market" as const,
    takeHome:      60000,
    billableDays:  DEFAULT_BILLABLE_DAYS,
    hasKit:        false,
    includeProfit: false,
  };

  it("returns a positive day rate", () => {
    const r = calculate(baseInputs);
    expect(r.dayRate).toBeGreaterThan(0);
  });

  it("day rate × billable days ≈ total gross needed", () => {
    const r = calculate(baseInputs);
    expect(r.dayRate * r.billableDays).toBeCloseTo(r.totalGrossNeeded, 0);
  });

  it("SE tax is 15.3% of (takeHome + healthInsurance)", () => {
    const r = calculate(baseInputs);
    const expectedSeTax = (baseInputs.takeHome + HEALTH_INSURANCE_ANNUAL) * SE_TAX_RATE;
    expect(r.seTax).toBeCloseTo(expectedSeTax, 1);
  });

  it("half-day rate is 60% of day rate", () => {
    const r = calculate(baseInputs);
    expect(r.halfDayRate).toBeCloseTo(r.dayRate * 0.60, 2);
  });

  it("hourly rate is day rate divided by 10", () => {
    const r = calculate(baseInputs);
    expect(r.hourlyRate).toBeCloseTo(r.dayRate / 10, 2);
  });

  it("profit is 0 when includeProfit is false", () => {
    const r = calculate({ ...baseInputs, includeProfit: false });
    expect(r.profit).toBe(0);
  });

  it("profit is 20% of pre-profit total when includeProfit is true", () => {
    const withoutProfit = calculate({ ...baseInputs, includeProfit: false });
    const withProfit    = calculate({ ...baseInputs, includeProfit: true });
    expect(withProfit.profit).toBeCloseTo(withoutProfit.totalGrossNeeded * PROFIT_RATE, 1);
  });

  it("kit fee is 0 when hasKit is false", () => {
    const r = calculate({ ...baseInputs, hasKit: false });
    expect(r.kitFee).toBe(0);
  });

  it("kit fee is $300 when hasKit is true", () => {
    const r = calculate({ ...baseInputs, hasKit: true });
    expect(r.kitFee).toBe(300);
  });

  it("higher take-home produces higher day rate", () => {
    const low  = calculate({ ...baseInputs, takeHome: 40000 });
    const high = calculate({ ...baseInputs, takeHome: 100000 });
    expect(high.dayRate).toBeGreaterThan(low.dayRate);
  });

  it("fewer billable days produces higher day rate", () => {
    const busy  = calculate({ ...baseInputs, billableDays: 200 });
    const slow  = calculate({ ...baseInputs, billableDays: 100 });
    expect(slow.dayRate).toBeGreaterThan(busy.dayRate);
  });

  it("major market produces higher rate floor than small market", () => {
    const major = calculate({ ...baseInputs, location: "Major Market" });
    const small = calculate({ ...baseInputs, location: "Small Market" });
    expect(major.rateFloor).toBeGreaterThan(small.rateFloor);
  });

  it("belowFloor is true when take-home is very low", () => {
    // Very low take-home → very low day rate → will be below floor
    const r = calculate({ ...baseInputs, takeHome: 5000, billableDays: 200 });
    expect(r.belowFloor).toBe(true);
  });

  it("belowFloor is false when take-home is high enough to clear the floor", () => {
    // $120k goal at 150 days → ~$1,100/day, above the $800 Mid DP floor
    const r = calculate({ ...baseInputs, takeHome: 120000, billableDays: 150 });
    expect(r.belowFloor).toBe(false);
  });

  it("uses custom health insurance when provided", () => {
    const custom = calculate({ ...baseInputs, healthInsurance: 12000 });
    const def    = calculate(baseInputs);
    expect(custom.healthInsurance).toBe(12000);
    expect(custom.dayRate).toBeGreaterThan(def.dayRate);
  });

  it("state tax is higher for major market than small market", () => {
    const major = calculate({ ...baseInputs, location: "Major Market" });
    const small = calculate({ ...baseInputs, location: "Small Market" });
    expect(major.stateTaxRate).toBeGreaterThan(small.stateTaxRate);
  });
});

// ==============================================
// currentEarnings — reverse calculation
// ==============================================
describe("currentEarnings", () => {
  it("gross annual equals dayRate × billableDays", () => {
    const r = currentEarnings(800, 150, "Mid Market");
    expect(r.grossAnnual).toBe(800 * 150);
  });

  it("SE tax is 15.3% of gross", () => {
    const r = currentEarnings(800, 150, "Mid Market");
    expect(r.seTax).toBeCloseTo(r.grossAnnual * SE_TAX_RATE, 1);
  });

  it("net take-home is less than gross", () => {
    const r = currentEarnings(800, 150, "Mid Market");
    expect(r.netTakeHome).toBeLessThan(r.grossAnnual);
  });

  it("net take-home is never negative", () => {
    const r = currentEarnings(50, 10, "Mid Market"); // extremely low scenario
    expect(r.netTakeHome).toBeGreaterThanOrEqual(0);
  });

  it("higher day rate produces higher net take-home", () => {
    const low  = currentEarnings(400, 150, "Mid Market");
    const high = currentEarnings(1200, 150, "Mid Market");
    expect(high.netTakeHome).toBeGreaterThan(low.netTakeHome);
  });

  it("health insurance is always the national average", () => {
    const r = currentEarnings(800, 150, "Mid Market");
    expect(r.healthInsurance).toBe(HEALTH_INSURANCE_ANNUAL);
  });

  it("write-offs are always $10,000", () => {
    const r = currentEarnings(800, 150, "Mid Market");
    expect(r.writeoffs).toBe(FREELANCE_WRITEOFFS);
  });
});

// ==============================================
// marketRange — position within rate range
// ==============================================
describe("marketRange", () => {
  it("returns floor and ceiling adjusted for location", () => {
    const r = marketRange("Cinematographer / DP", "Mid", "Major Market", 1000);
    const expectedFloor   = RATE_FLOORS["Cinematographer / DP"]["Mid"] * LOCATION_MULTIPLIERS["Major Market"];
    const expectedCeiling = RATE_CEILINGS["Cinematographer / DP"]["Mid"] * LOCATION_MULTIPLIERS["Major Market"];
    expect(r.floor).toBeCloseTo(expectedFloor, 1);
    expect(r.ceiling).toBeCloseTo(expectedCeiling, 1);
  });

  it("rate below floor returns 'below' position", () => {
    const floor = RATE_FLOORS["Video Editor"]["Emerging"] * LOCATION_MULTIPLIERS["Mid Market"];
    const r = marketRange("Video Editor", "Emerging", "Mid Market", floor - 1);
    expect(r.position).toBe("below");
  });

  it("rate above ceiling returns 'above' position", () => {
    const ceiling = RATE_CEILINGS["Video Editor"]["Expert"] * LOCATION_MULTIPLIERS["Mid Market"];
    const r = marketRange("Video Editor", "Expert", "Mid Market", ceiling + 1);
    expect(r.position).toBe("above");
  });

  it("rate at floor returns 'low' position", () => {
    const floor = RATE_FLOORS["Colorist"]["Mid"] * LOCATION_MULTIPLIERS["Mid Market"];
    const r = marketRange("Colorist", "Mid", "Mid Market", floor);
    expect(r.position).toBe("low");
  });

  it("percentile is 0 at the floor", () => {
    const floor = RATE_FLOORS["Producer"]["Senior"] * LOCATION_MULTIPLIERS["Mid Market"];
    const r = marketRange("Producer", "Senior", "Mid Market", floor);
    expect(r.percentile).toBe(0);
  });

  it("percentile is 100 at the ceiling", () => {
    const ceiling = RATE_CEILINGS["Producer"]["Senior"] * LOCATION_MULTIPLIERS["Mid Market"];
    const r = marketRange("Producer", "Senior", "Mid Market", ceiling);
    expect(r.percentile).toBe(100);
  });

  it("percentile is between 0 and 100 for a mid-range rate", () => {
    const floor   = RATE_FLOORS["Gaffer"]["Mid"] * LOCATION_MULTIPLIERS["Mid Market"];
    const ceiling = RATE_CEILINGS["Gaffer"]["Mid"] * LOCATION_MULTIPLIERS["Mid Market"];
    const midRate = (floor + ceiling) / 2;
    const r = marketRange("Gaffer", "Mid", "Mid Market", midRate);
    expect(r.percentile).toBeGreaterThan(0);
    expect(r.percentile).toBeLessThan(100);
  });
});

// ==============================================
// realityCheck — monthly expense breakdown
// ==============================================
describe("realityCheck", () => {
  it("monthly take-home is annual / 12", () => {
    const r = realityCheck(60000, "Mid Market");
    expect(r.monthlyTakeHome).toBeCloseTo(60000 / 12, 1);
  });

  it("total expenses includes all line items", () => {
    const r = realityCheck(60000, "Mid Market", "Single");
    const sum =
      r.rent + r.food + r.transportation + r.utilities +
      r.cellPhone + r.clothing + r.entertainment +
      r.childcare + r.savings + r.healthInsurance;
    expect(r.totalExpenses).toBeCloseTo(sum, 1);
  });

  it("leftOver = monthlyTakeHome - totalExpenses", () => {
    const r = realityCheck(60000, "Mid Market", "Single");
    expect(r.leftOver).toBeCloseTo(r.monthlyTakeHome - r.totalExpenses, 1);
  });

  it("childcare is 0 for Single family size", () => {
    const r = realityCheck(60000, "Mid Market", "Single");
    expect(r.childcare).toBe(0);
  });

  it("childcare is greater than 0 for Family of 3", () => {
    const r = realityCheck(60000, "Mid Market", "Family of 3");
    expect(r.childcare).toBeGreaterThan(0);
  });

  it("major market total expenses exceed small market", () => {
    const major = realityCheck(60000, "Major Market", "Single");
    const small = realityCheck(60000, "Small Market", "Single");
    expect(major.totalExpenses).toBeGreaterThan(small.totalExpenses);
  });

  it("in2019Dollars is less than take-home (inflation adjustment)", () => {
    const r = realityCheck(60000, "Mid Market");
    expect(r.in2019Dollars).toBeLessThan(60000);
  });

  it("defaults to Single when familySize is omitted", () => {
    const withDefault  = realityCheck(60000, "Mid Market");
    const withExplicit = realityCheck(60000, "Mid Market", "Single");
    expect(withDefault.childcare).toBe(withExplicit.childcare);
    expect(withDefault.totalExpenses).toBe(withExplicit.totalExpenses);
  });
});

// ==============================================
// Rate data sanity checks
// ==============================================
describe("rate data integrity", () => {
  const disciplines = [
    "Camera Operator", "Cinematographer / DP", "Video Editor",
    "Colorist", "Motion Designer", "Producer", "Associate Producer",
    "1st AD", "2nd AD", "Key Grip", "Best Boy Grip", "Grip",
    "Gaffer", "Sound Mixer", "Production Assistant", "Key PA",
  ] as const;

  const levels = ["Emerging", "Mid", "Senior", "Expert"] as const;

  it("every discipline has floors for all experience levels", () => {
    disciplines.forEach(d => {
      levels.forEach(l => {
        expect(RATE_FLOORS[d][l]).toBeGreaterThan(0);
      });
    });
  });

  it("every discipline has ceilings for all experience levels", () => {
    disciplines.forEach(d => {
      levels.forEach(l => {
        expect(RATE_CEILINGS[d][l]).toBeGreaterThan(0);
      });
    });
  });

  it("ceiling is always greater than floor for every discipline/level", () => {
    disciplines.forEach(d => {
      levels.forEach(l => {
        expect(RATE_CEILINGS[d][l]).toBeGreaterThan(RATE_FLOORS[d][l]);
      });
    });
  });

  it("rates increase with experience level (floors)", () => {
    disciplines.forEach(d => {
      expect(RATE_FLOORS[d]["Mid"]).toBeGreaterThan(RATE_FLOORS[d]["Emerging"]);
      expect(RATE_FLOORS[d]["Senior"]).toBeGreaterThan(RATE_FLOORS[d]["Mid"]);
      expect(RATE_FLOORS[d]["Expert"]).toBeGreaterThan(RATE_FLOORS[d]["Senior"]);
    });
  });

  it("location multipliers: major > mid > small", () => {
    expect(LOCATION_MULTIPLIERS["Major Market"]).toBeGreaterThan(LOCATION_MULTIPLIERS["Mid Market"]);
    expect(LOCATION_MULTIPLIERS["Mid Market"]).toBeGreaterThan(LOCATION_MULTIPLIERS["Small Market"]);
  });

  it("state tax: major market > mid > small", () => {
    expect(STATE_TAX_RATE["Major Market"]).toBeGreaterThan(STATE_TAX_RATE["Mid Market"]);
    expect(STATE_TAX_RATE["Mid Market"]).toBeGreaterThan(STATE_TAX_RATE["Small Market"]);
  });
});
