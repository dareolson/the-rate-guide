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
const PLAN_YEAR   = 2026;
const DEFAULT_AGE = 35;

export async function GET(request: NextRequest) {
  const zip = request.nextUrl.searchParams.get("zip")?.trim();

  if (!zip || !/^\d{5}$/.test(zip)) {
    return NextResponse.json({ error: "Invalid ZIP" }, { status: 400 });
  }

  if (!CMS_API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 503 });
  }

  try {
    // Step 1 — resolve ZIP to county FIPS
    const countyRes = await fetch(
      `${CMS_BASE}/counties/by/zip/${zip}?apikey=${CMS_API_KEY}`,
      { next: { revalidate: 86400 } }, // cache 24h — county→ZIP mapping doesn't change
    );
    if (!countyRes.ok) throw new Error(`County lookup failed: ${countyRes.status}`);
    const countyData = await countyRes.json();

    const counties: { fips: string; name: string; state: string }[] = countyData.counties ?? [];
    if (counties.length === 0) throw new Error("No county found for ZIP");

    // Use the first county (most ZIPs map to one; multi-county ZIPs are rare)
    const fips  = counties[0].fips;
    const state = counties[0].state;

    // Step 2 — fetch plans for this location
    const plansRes = await fetch(
      `${CMS_BASE}/plans/search?apikey=${CMS_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          household: {
            income:            50000, // required field; doesn't affect premium, only subsidy
            people: [{ age: DEFAULT_AGE, aptc_eligible: false, is_pregnant: false, uses_tobacco: false }],
          },
          market:   "Individual",
          place: {
            countyfips: fips,
            state,
            zipcode: zip,
          },
          year: PLAN_YEAR,
        }),
        next: { revalidate: 86400 },
      },
    );

    if (!plansRes.ok) throw new Error(`Plans fetch failed: ${plansRes.status}`);
    const plansData = await plansRes.json();

    const plans: { metal_level: string; premium: number }[] = plansData.plans ?? [];

    // Filter to Silver plans only
    const silverPlans = plans.filter(p => p.metal_level === "Silver");
    if (silverPlans.length === 0) throw new Error("No Silver plans found");

    // Average monthly premium across all Silver plans
    const avgMonthly = silverPlans.reduce((sum, p) => sum + p.premium, 0) / silverPlans.length;
    const avgAnnual  = Math.round(avgMonthly * 12);

    return NextResponse.json({
      zip,
      state,
      county:        counties[0].name,
      avgMonthlyPremium: Math.round(avgMonthly),
      avgAnnualPremium:  avgAnnual,
      planCount:     silverPlans.length,
      year:          PLAN_YEAR,
    });

  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
