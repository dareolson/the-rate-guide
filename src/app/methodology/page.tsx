// ==============================================
// The Rate Guide — Methodology & Rate Justification
// A transparent breakdown of how every number
// in the calculator was derived and sourced.
// ==============================================

import type { Metadata } from "next";

// Page-specific metadata — inherits site name from layout title template
export const metadata: Metadata = {
  title:       "Freelance Day Rate Formula — How We Calculate It",
  description: "The complete methodology behind the freelance day rate calculator — self-employment tax, health insurance, federal and state income tax, billable days, and market rate floors. Every number sourced.",
  alternates:  { canonical: "/methodology" },
  openGraph: {
    title:       "Freelance Day Rate Formula — The Rate Guide",
    description: "SE tax from the IRS, health insurance from KFF, inflation from BLS CPI-U. Every input sourced. Show this page to any client who questions your rate.",
    url:         "https://therateguide.com/methodology",
  },
};

import {
  HEALTH_INSURANCE_ANNUAL,
  SE_TAX_RATE,
  PROFIT_RATE,
  DEFAULT_BILLABLE_DAYS,
  RATE_FLOORS,
  LOCATION_MULTIPLIERS,
  INFLATION_SINCE_2019,
  INFLATION_BASE_YEAR,
  FREELANCE_WRITEOFFS,
  STATE_TAX_RATE,
  STATE_ANNUAL_COL,
  federalEffectiveRate,
} from "@/lib/calculator";

// ==============================================
// SMALL LAYOUT COMPONENTS
// ==============================================
function Section({ id, label, title, children }: {
  id:       string;
  label:    string;
  title:    string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} style={{ borderTop: "2px solid var(--accent-2)", paddingTop: "2.5rem", marginTop: "3rem" }}>
      <div style={{ fontSize: "0.75rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 600, color: "var(--text)", marginBottom: "0.5rem" }}>
        {label}
      </div>
      <h2 style={{ fontFamily: "var(--sans)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", lineHeight: 1.2 }}>
        {title}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {children}
      </div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "1rem", color: "var(--text-dim)", lineHeight: 1.75, margin: 0, fontFamily: "var(--serif)", maxWidth: "65ch" }}>
      {children}
    </p>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--surface)", borderLeft: "3px solid var(--accent-2)", padding: "1.25rem 1.5rem" }}>
      <p style={{ fontSize: "1rem", color: "var(--text)", lineHeight: 1.8, margin: 0, fontFamily: "var(--serif)" }}>
        {children}
      </p>
    </div>
  );
}

function Source({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "0.78rem", color: "var(--text-dim)", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
      Source: {children}
    </p>
  );
}

function DataRow({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "0.75rem 0", borderBottom: "1px solid var(--border)", gap: "1rem", flexWrap: "wrap" }}>
      <div>
        <span style={{ fontSize: "0.82rem", color: "var(--text)" }}>{label}</span>
        {note && <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginLeft: "0.75rem" }}>{note}</span>}
      </div>
      <span style={{ fontFamily: "var(--mono)", fontSize: "0.9rem", color: "var(--accent)", whiteSpace: "nowrap" }}>{value}</span>
    </div>
  );
}

// ==============================================
// PAGE
// ==============================================
export default function MethodologyPage() {
  const seTaxPct     = Math.round(SE_TAX_RATE * 100 * 10) / 10;
  const profitPct    = Math.round(PROFIT_RATE * 100);
  const inflationPct = Math.round((INFLATION_SINCE_2019 - 1) * 100);

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "5rem 1.5rem 6rem" }}>

      {/* Header */}
      <div style={{ marginBottom: "3rem" }}>
        <a href="/" style={{ fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--accent)", textDecoration: "none" }}>
          ← The Rate Guide
        </a>
        <h1 style={{ fontFamily: "var(--mono)", fontSize: "2rem", marginTop: "1.5rem", lineHeight: 1.1 }}>
          Freelance Day Rate Formula — How We Calculate It
        </h1>
        <p style={{ color: "var(--text-dim)", fontSize: "1.05rem", marginTop: "0.75rem", lineHeight: 1.75, maxWidth: "560px", fontFamily: "var(--serif)" }}>
          Every number comes from public data and industry standards. Show this page to a client who questions your rate, or to yourself when you need the reminder.
        </p>
      </div>

      {/* Table of contents */}
      <nav aria-label="Page contents" style={{ marginBottom: "3rem", padding: "1.25rem 1.5rem", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "4px" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "0.75rem" }}>On this page</div>
        <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.45rem", margin: 0, padding: 0 }}>
          {[
            ["#formula",       "The formula"],
            ["#se-tax",        "Self-employment tax (15.3%)"],
            ["#income-tax",    "Federal and state income tax"],
            ["#health",        "Health insurance"],
            ["#profit",        "Profit margin"],
            ["#billable-days", "Billable days"],
            ["#rate-floors",   "Market rate floors by discipline"],
            ["#location",      "Location multipliers"],
            ["#inflation",     "Inflation adjustment"],
            ["#cost-of-living","Cost of living by state"],
          ].map(([href, label]) => (
            <li key={href}>
              <a href={href} style={{ fontFamily: "var(--mono)", fontSize: "0.8rem", color: "var(--accent)", textDecoration: "none", borderBottom: "1px solid transparent" }}>
                {label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* The Formula */}
      <Section id="formula" label="The Core Formula" title="What a freelance day rate has to cover">
        <P>
          Most people calculate their rate wrong. They take what they want to make, divide by some number of days, and call it done. That misses most of the actual cost of being self-employed.
        </P>
        <P>
          The formula starts with your take-home goal and adds every cost you carry as a freelancer that a salaried employee never sees on their pay stub.
        </P>
        <Callout>
          Day Rate = (Take-Home Goal + Health Insurance + SE Tax + Federal Income Tax + State Tax + Profit Margin) ÷ Billable Days
        </Callout>
        <P>
          Each input below has a source. None are arbitrary.
        </P>
      </Section>

      {/* Self-Employment Tax */}
      <Section id="se-tax" label="Factor 01" title={`Self-employment tax — ${seTaxPct}%`}>
        <P>
          When you work for an employer, they pay half your Social Security and Medicare taxes. As a freelancer, you pay both halves.
        </P>
        <DataRow label="Social Security"       value="12.4%" note="on first $168,600 of net earnings (2024)" />
        <DataRow label="Medicare"              value="2.9%"  note="on all net earnings" />
        <DataRow label="Total SE tax rate"     value={`${seTaxPct}%`} />
        <P>
          This is the statutory rate from IRS Publication 334 and Schedule SE. A W-2 employee at the same gross income pays half this amount. Their employer covers the rest.
        </P>
        <Callout>
          A freelancer billing ${(60000 * (1 + SE_TAX_RATE)).toLocaleString("en-US", { maximumFractionDigits: 0 })} gross owes ${Math.round(60000 * SE_TAX_RATE).toLocaleString("en-US")} in SE tax to keep $60,000 in take-home pay. That money comes from your rate.
        </Callout>
        <Source>IRS Publication 334 (Tax Guide for Small Business); IRS Schedule SE; Social Security Administration wage base 2024</Source>
      </Section>

      {/* Income Tax */}
      <Section id="income-tax" label="Factor 02" title="Federal and state income tax — estimated">
        <P>
          SE tax covers Social Security and Medicare. Federal and state income tax are separate obligations, often larger ones.
        </P>
        <P>
          Income tax depends on your situation, so the calculator uses estimated effective rates: the percentage of taxable income you pay after deductions, not the marginal rate on your top dollar.
        </P>

        <div style={{ fontSize: "0.75rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 600, color: "var(--text)", marginTop: "0.5rem", marginBottom: "0.5rem" }}>
          How taxable income is calculated
        </div>
        <P>
          Income tax applies to taxable income, not gross revenue. Three deductions reduce that number first:
        </P>
        <DataRow label="Health insurance premium"      value="100% deductible" note="IRS Publication 535 — self-employed health insurance deduction" />
        <DataRow label="½ of self-employment tax"      value="~7.65% of gross"  note="IRS Schedule SE — reduces adjusted gross income" />
        <DataRow label="Estimated business write-offs" value={`$${FREELANCE_WRITEOFFS.toLocaleString("en-US")}/yr`} note="home office, equipment depreciation, software, professional development" />
        <P>
          What remains is your estimated taxable income. That&apos;s what federal and state rates hit.
        </P>

        <div style={{ fontSize: "0.75rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 600, color: "var(--text)", marginTop: "0.5rem", marginBottom: "0.5rem" }}>
          Federal effective rate
        </div>
        <P>
          Federal income tax is progressive. The effective rate, the blended average across brackets, runs lower than your top marginal rate. The calculator looks up your bracket based on estimated taxable income:
        </P>
        <DataRow label="Taxable income under $30k"    value={`${Math.round(federalEffectiveRate(25000)  * 100)}%`} />
        <DataRow label="$30k–$50k"                    value={`${Math.round(federalEffectiveRate(40000)  * 100)}%`} />
        <DataRow label="$50k–$75k"                    value={`${Math.round(federalEffectiveRate(60000)  * 100)}%`} />
        <DataRow label="$75k–$100k"                   value={`${Math.round(federalEffectiveRate(85000)  * 100)}%`} />
        <DataRow label="$100k–$140k"                  value={`${Math.round(federalEffectiveRate(120000) * 100)}%`} />
        <DataRow label="$140k–$200k"                  value={`${Math.round(federalEffectiveRate(160000) * 100)}%`} />
        <DataRow label="Over $200k"                   value={`${Math.round(federalEffectiveRate(250000) * 100)}%`} />

        <div style={{ fontSize: "0.75rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 600, color: "var(--text)", marginTop: "0.5rem", marginBottom: "0.5rem" }}>
          State and local rate
        </div>
        <P>
          State income tax ranges from 0% in Texas and Florida to over 13% at the top bracket in California. The calculator uses a median effective rate for your market tier:
        </P>
        <DataRow label="Major Market (LA, NYC, Chicago…)" value={`${Math.round(STATE_TAX_RATE["Major Market"] * 100)}%`} note="weighted toward high-tax states" />
        <DataRow label="Mid Market"                       value={`${Math.round(STATE_TAX_RATE["Mid Market"]   * 100)}%`} note="median U.S. state effective rate" />
        <DataRow label="Small Market"                     value={`${Math.round(STATE_TAX_RATE["Small Market"] * 100)}%`} note="many no-tax or low-tax states" />

        <Callout>
          These are estimates. Your actual liability depends on filing status, deductions, state, and income level. No-income-tax states (TX, FL, WA, NV) will run lower than shown. High earners in California or New York will run higher. Use this as a working estimate. Your accountant has the exact number.
        </Callout>
        <Source>IRS Publication 535 (Business Expenses); IRS Rev. Proc. 2025-28 (2026 tax brackets); Tax Foundation State Individual Income Tax Rates 2025</Source>
      </Section>

      {/* Health Insurance */}
      <Section id="health" label="Factor 03" title={`Health insurance — $${HEALTH_INSURANCE_ANNUAL.toLocaleString("en-US")}/year`}>
        <P>
          Salaried employees get employer-subsidized health coverage. Freelancers buy their own. The ${HEALTH_INSURANCE_ANNUAL.toLocaleString("en-US")} figure is the average annual premium for an individual ACA marketplace plan in 2026, before subsidies.
        </P>
        <DataRow label="Monthly premium (2026 avg)" value="$617/mo"  />
        <DataRow label="Annual total"               value={`$${HEALTH_INSURANCE_ANNUAL.toLocaleString("en-US")}`} />
        <P>
          We don&apos;t factor in subsidies. They phase out as income rises and vary by state, plan selection, and age. This is the unsubsidized baseline, what you need to budget before any assistance applies.
        </P>
        <P>
          If you have coverage through a spouse, union, or other means, skip this line. For everyone else, it is a real cost.
        </P>
        <Source>KFF Health Insurance Marketplace Calculator (2026); U.S. Department of Health &amp; Human Services ACA premium data</Source>
      </Section>

      {/* Profit Margin */}
      <Section id="profit" label="Factor 04" title={`Profit margin — ${profitPct}% (optional)`}>
        <P>
          A rate that exactly covers your expenses leaves no margin for error. Equipment fails. Projects fall through. Clients go silent. The {profitPct}% profit buffer is optional (toggle it off in the calculator), but it separates a sustainable business from one that collapses when anything goes wrong.
        </P>
        <Callout>
          Profit is a buffer. A {profitPct}% margin on a $1,200/day rate is $240, the cost of a round-trip flight to a client or one day of equipment rental. That money covers the bad invoice that never gets paid.
        </Callout>
        <P>
          The Freelancers Union and SCORE both recommend 15–25% net profit targets for creative service businesses. We use {profitPct}% as the default.
        </P>
        <Source>Freelancers Union; SCORE (U.S. Small Business Administration); standard small business financial planning guidance</Source>
      </Section>

      {/* Billable Days */}
      <Section id="billable-days" label="Factor 05" title={`Billable days — ${DEFAULT_BILLABLE_DAYS} per year`}>
        <P>
          A full-time salaried employee works 260 days a year. A freelancer does not bill 260 days. Unpaid gaps eat the rest: business development, invoicing, admin, equipment maintenance, the dry spells between projects nobody warns you about.
        </P>
        <DataRow label="Calendar work days (52 weeks × 5)"  value="260 days" />
        <DataRow label="Vacation / sick / holidays"          value="−20 days" />
        <DataRow label="Business development & admin"        value="−35 days" note="prospecting, invoicing, calls" />
        <DataRow label="Project gaps & dry spells"           value="−55 days" note="realistic for most markets" />
        <DataRow label="Estimated billable days"             value={`${DEFAULT_BILLABLE_DAYS} days`} />
        <P>
          {DEFAULT_BILLABLE_DAYS} days is the number freelance surveys cite across creative disciplines. Experienced freelancers with full client rosters may bill 170–180 days. Newer freelancers bill fewer. {DEFAULT_BILLABLE_DAYS} is a responsible baseline.
        </P>
        <P>
          You can adjust this in the calculator. Increasing it lowers your required day rate; decreasing it raises it. The math is transparent.
        </P>
        <Source>Freelancers Union Annual Freelancing in America Report; AND CO Freelancer Income Report; industry common practice</Source>
      </Section>

      {/* Rate Floors */}
      <Section id="rate-floors" label="Market Reference" title="Rate floors by discipline and experience">
        <P>
          The calculator compares your computed rate against market floors, the minimum a working professional at each level commands in a mid-market environment. These are the low end of what the market pays.
        </P>
        <P>
          These figures come from 2024–2025 data across production rate cards, union minimums, freelance platform surveys, and direct industry reporting. They reflect what clients pay when they hire experienced professionals.
        </P>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem", fontFamily: "var(--mono)" }}>
            <thead>
              <tr>
                {["Discipline", "Emerging", "Mid", "Senior", "Expert"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "0.6rem 0.75rem", borderBottom: "2px solid var(--border)", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-dim)", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(Object.entries(RATE_FLOORS) as [string, Record<string, number>][]).map(([discipline, levels]) => (
                <tr key={discipline} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "0.7rem 0.75rem", color: "var(--text)", whiteSpace: "nowrap" }}>{discipline}</td>
                  {["Emerging", "Mid", "Senior", "Expert"].map((lvl) => (
                    <td key={lvl} style={{ padding: "0.7rem 0.75rem", color: "var(--accent)" }}>
                      ${levels[lvl].toLocaleString("en-US")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <P>
          All figures are base day rates in USD for a mid-market (standard U.S. city) environment. A location multiplier is applied for major markets (×{LOCATION_MULTIPLIERS["Major Market"]}) and small markets (×{LOCATION_MULTIPLIERS["Small Market"]}).
        </P>
        <Source>IATSE Local rate cards; Production Hub freelance rate surveys 2024–2025; Mandy.com industry salary data; direct market research across U.S. production markets</Source>
      </Section>

      {/* Location Multipliers */}
      <Section id="location" label="Location Adjustment" title="Why your market changes your rate">
        <P>
          The same day of work commands different rates in New York than in Tulsa. The clients, budgets, and cost of living are different. Location multipliers adjust the rate floor to reflect what the local market will bear.
        </P>
        <DataRow label="Major Market (LA, NYC, Chicago, Miami)" value={`×${LOCATION_MULTIPLIERS["Major Market"]}`} note="+30% above baseline" />
        <DataRow label="Mid Market (Austin, Atlanta, Denver…)"  value={`×${LOCATION_MULTIPLIERS["Mid Market"]}`}   note="baseline" />
        <DataRow label="Small Market (regional cities, rural)"  value={`×${LOCATION_MULTIPLIERS["Small Market"]}`} note="−15% below baseline" />
        <P>
          These multipliers are conservative. Major-market productions often pay well above these floors, especially for senior and expert-level crew on commercial and streaming work. The floor is a floor.
        </P>
      </Section>

      {/* Inflation */}
      <Section id="inflation" label="Purchasing Power" title={`Inflation — ${inflationPct}% since ${INFLATION_BASE_YEAR}`}>
        <P>
          The reality check section anchors your take-home goal to its {INFLATION_BASE_YEAR} purchasing power equivalent. A dollar in {INFLATION_BASE_YEAR} bought more than a dollar today.
        </P>
        <DataRow label={`Cumulative CPI-U inflation (Jan ${INFLATION_BASE_YEAR} → Jan 2026)`} value={`+${inflationPct}%`} />
        <DataRow label="Inflation multiplier used"                                             value={`×${INFLATION_SINCE_2019}`} />
        <P>
          If you were earning $80,000 in {INFLATION_BASE_YEAR}, you need ${Math.round(80000 * INFLATION_SINCE_2019).toLocaleString("en-US")} today to have the same purchasing power. A rate that hasn&apos;t kept pace with inflation is a pay cut.
        </P>
        <P>
          Freelancers who haven&apos;t raised their rates in five years earn less than they did. Prices moved. Rates didn&apos;t.
        </P>
        <Source>U.S. Bureau of Labor Statistics CPI-U (All Urban Consumers, All Items), January {INFLATION_BASE_YEAR} through January 2026</Source>
      </Section>

      {/* Cost of Living by State */}
      <Section id="cost-of-living" label="Reality Check" title="Cost of living by state — what your take-home actually buys">
        <P>
          Your take-home and your cost of living are two different numbers. The calculator shows the average annual cost of basic living expenses for your state alongside your actual take-home, so you can see the gap or the surplus.
        </P>

        <div style={{ fontSize: "0.75rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 600, color: "var(--text)", marginTop: "0.5rem", marginBottom: "0.5rem" }}>
          What these figures represent
        </div>
        <P>
          Each figure covers the estimated annual cost of basic living expenses for a single adult with no dependents: housing, food, transportation, healthcare, internet, and personal necessities. No discretionary spending, no debt service, no dependents. They are a floor.
        </P>

        <div style={{ fontSize: "0.75rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 600, color: "var(--text)", marginTop: "0.5rem", marginBottom: "0.5rem" }}>
          Methodology — dual-source aggregation
        </div>
        <P>
          Two independent sources, cross-referenced:
        </P>
        <Callout>
          Primary: MIT Living Wage Calculator (livewage.mit.edu) — county and state-level data, 2023–2024. Nine states were confirmed directly from MIT: Alabama, California, Texas, New York, Hawaii, Washington, Florida, Massachusetts, and District of Columbia. These serve as anchor points for the full dataset.
        </Callout>
        <Callout>
          Secondary: MERIC 2025 Annual Average Cost of Living Index (meric.mo.gov) — quarterly index published by the Missouri Economic Research and Information Center, widely used by HR departments, relocation firms, and state economic development agencies. Index is relative to a national baseline of 100.
        </Callout>
        <P>
          For the 42 states not directly confirmed via MIT, we derived figures by applying the MERIC index to a calibrated national baseline. The baseline was established by averaging the relationship between MERIC index values and MIT-confirmed dollar figures across the nine anchor states, then solving for the implied national midpoint. MERIC-derived figures are rounded to the nearest $100.
        </P>
        <P>
          Where the two sources converged closely — as they did for most mid-range states — the figures are reliable to within approximately 3–5%. For high-index states (Hawaii, California, Massachusetts, New York, DC), MIT figures were used directly, since MERIC&apos;s broader consumer basket diverges from MIT&apos;s basic-needs methodology at the high end.
        </P>

        <div style={{ fontSize: "0.75rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 600, color: "var(--text)", marginTop: "0.5rem", marginBottom: "0.5rem" }}>
          State figures
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem", fontFamily: "var(--mono)" }}>
            <thead>
              <tr>
                {["State", "Annual COL", "Source"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "0.6rem 0.75rem", borderBottom: "2px solid var(--border)", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-dim)", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(Object.entries(STATE_ANNUAL_COL) as [string, number][]).map(([state, col]) => {
                const mitStates = ["Alabama","California","Texas","New York","Hawaii","Washington","Florida","Massachusetts","District of Columbia"];
                const isMit = mitStates.includes(state);
                return (
                  <tr key={state} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "0.6rem 0.75rem", color: "var(--text)", whiteSpace: "nowrap" }}>{state}</td>
                    <td style={{ padding: "0.6rem 0.75rem", color: "var(--accent)" }}>${col.toLocaleString("en-US")}</td>
                    <td style={{ padding: "0.6rem 0.75rem", color: "var(--text-dim)", fontSize: "0.7rem" }}>{isMit ? "MIT confirmed" : "MERIC-derived"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Callout>
          These figures are estimates for planning purposes. Your actual cost of living depends on your specific city, housing situation, family composition, and spending habits. A freelancer in San Francisco will find California&apos;s state average significantly understates their actual expenses. A freelancer in a small Texas town may find the figure overstated. Use it as a directional benchmark, not a precise budget.
        </Callout>
        <Source>MIT Living Wage Calculator, livewage.mit.edu, 2023–2024 state data (nine anchor states confirmed directly). MERIC 2025 Annual Average Cost of Living Index, meric.mo.gov (42 states derived). Single adult, no dependents, basic needs only.</Source>
      </Section>

      {/* Closing */}
      <section style={{ borderTop: "2px solid var(--accent-2)", paddingTop: "2.5rem", marginTop: "3rem" }}>
        <h2 style={{ fontFamily: "var(--mono)", fontSize: "1.4rem", marginBottom: "1rem", lineHeight: 1.2 }}>
          The conversation is overdue.
        </h2>
        <p style={{ fontSize: "1.05rem", color: "var(--text-dim)", lineHeight: 1.8, marginBottom: "2rem", fontFamily: "var(--serif)" }}>
          Every number on this page comes from public data. None of it is negotiable with math. You negotiate your willingness to present it and hold to it.
        </p>
        <a href="/" style={{ display: "inline-block", background: "var(--accent)", color: "#000", fontFamily: "var(--mono)", fontSize: "0.78rem", letterSpacing: "0.18em", textTransform: "uppercase", padding: "0.85rem 1.75rem", textDecoration: "none", fontWeight: "bold" }}>
          Calculate Your Rate →
        </a>
      </section>

    </div>
  );
}
