// ==============================================
// /api/health-insurance
// Fetches average Silver plan premium for a single adult
// from the CMS Health Insurance Marketplace API.
//
// Flow:
//   1. ZIP → CMS counties/by/zip → county FIPS
//   2. ZIP + county + year → CMS plans/search → Silver plans
//   3. Return average Silver premium (annual) for age 35 single adult
//
// Falls back to null on any error — caller uses static average.
// ==============================================

import { NextRequest, NextResponse } from "next/server";

const CMS_API_KEY = process.env.CMS_MARKETPLACE_API_KEY ?? "";
const CMS_BASE    = "https://marketplace.api.healthcare.gov/api/v1";
const DEFAULT_AGE = 35;

// Try the current plan year, fall back to prior year if no plans are found.
// CMS sometimes lags on publishing new year data, and the API returns an empty
// plans array rather than an error when year data isn't available yet.
const CURRENT_YEAR = new Date().getFullYear();
const PLAN_YEARS   = [CURRENT_YEAR, CURRENT_YEAR - 1];

async function fetchSilverPlans(
  zip: string,
  fips: string,
  state: string,
  year: number,
): Promise<{ premium: number }[]> {
  const res = await fetch(
    `${CMS_BASE}/plans/search?apikey=${CMS_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        household: {
          income: 50000, // required; doesn't affect unsubsidized premium
          people: [{ age: DEFAULT_AGE, aptc_eligible: false, is_pregnant: false, uses_tobacco: false }],
        },
        market: "Individual",
        place:  { countyfips: fips, state, zipcode: zip },
        year,
      }),
      next: { revalidate: 86400 },
    },
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Plans API ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  const plans: { metal_level: string; premium: number }[] = data.plans ?? [];

  // Case-insensitive match — the CMS API has returned both "Silver" and "silver"
  return plans.filter(p => p.metal_level?.toLowerCase() === "silver");
}

export async function GET(request: NextRequest) {
  const zip = request.nextUrl.searchParams.get("zip")?.trim();

  if (!zip || !/^\d{5}$/.test(zip)) {
    return NextResponse.json({ error: "Invalid ZIP" }, { status: 400 });
  }

  // Return a specific code so the UI can distinguish "not configured" from
  // "ZIP not found" and show a more helpful message
  if (!CMS_API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 503 });
  }

  try {
    // Step 1 — resolve ZIP to county FIPS
    const countyRes = await fetch(
      `${CMS_BASE}/counties/by/zip/${zip}?apikey=${CMS_API_KEY}`,
      { next: { revalidate: 86400 } },
    );

    if (!countyRes.ok) {
      const body = await countyRes.text().catch(() => "");
      throw new Error(`County API ${countyRes.status}: ${body.slice(0, 200)}`);
    }

    const countyData = await countyRes.json();
    const counties: { fips: string; name: string; state: string }[] = countyData.counties ?? [];
    if (counties.length === 0) throw new Error("No county found for ZIP");

    const { fips, state, name: countyName } = counties[0];

    // Step 2 — fetch Silver plans, trying current year then prior year
    let silverPlans: { premium: number }[] = [];
    let resolvedYear = PLAN_YEARS[0];

    for (const year of PLAN_YEARS) {
      try {
        silverPlans = await fetchSilverPlans(zip, fips, state, year);
        if (silverPlans.length > 0) {
          resolvedYear = year;
          break;
        }
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.warn(`[health-insurance] year ${year} failed:`, err);
        }
        // Continue to next year
      }
    }

    if (silverPlans.length === 0) {
      // State-run exchanges (CA, NY, WA, etc.) don't appear in the CMS API
      return NextResponse.json({ error: "state-exchange", state }, { status: 404 });
    }

    const avgMonthly = silverPlans.reduce((sum, p) => sum + p.premium, 0) / silverPlans.length;
    const avgAnnual  = Math.round(avgMonthly * 12);

    return NextResponse.json({
      zip,
      state,
      county:            countyName,
      avgMonthlyPremium: Math.round(avgMonthly),
      avgAnnualPremium:  avgAnnual,
      planCount:         silverPlans.length,
      year:              resolvedYear,
    });

  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (process.env.NODE_ENV === "development") {
      console.error("[health-insurance] lookup failed:", message);
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
