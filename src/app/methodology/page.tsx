// ==============================================
// The Rate Guide — Methodology & Rate Justification
// A transparent breakdown of how every number
// in the calculator was derived and sourced.
// ==============================================

import type { Metadata } from "next";

// Page-specific metadata — inherits site name from layout title template
export const metadata: Metadata = {
  title:       "How We Calculate Freelance Day Rates",
  description: "A fully sourced breakdown of the freelance rate formula — self-employment tax, health insurance, billable days, market floors, and inflation. Show your clients the math.",
  alternates:  { canonical: "/methodology" },
  openGraph: {
    title:       "How We Calculate Freelance Day Rates — The Rate Guide",
    description: "Every number sourced. SE tax from the IRS, health insurance from KFF, inflation from BLS CPI-U. Show this page to any client who questions your rate.",
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
          How We Calculate Your Rate
        </h1>
        <p style={{ color: "var(--text-dim)", fontSize: "1.05rem", marginTop: "0.75rem", lineHeight: 1.75, maxWidth: "560px", fontFamily: "var(--serif)" }}>
          Every number in this calculator is derived from public data and industry standards — not guesswork. This page exists so you can show it to a client, a hiring manager, or yourself.
        </p>
      </div>

      {/* The Formula */}
      <Section id="formula" label="The Core Formula" title="What a day rate actually has to cover">
        <P>
          Most people calculate their rate wrong. They take what they want to make, divide by some number of days, and call it done. That ignores a third of the real cost of being self-employed.
        </P>
        <P>
          The correct formula starts with your take-home goal and works forward — adding every cost you absorb as a freelancer that a salaried employee never sees on their pay stub.
        </P>
        <Callout>
          Day Rate = (Take-Home Goal + Health Insurance + Self-Employment Tax + Profit Margin) ÷ Billable Days
        </Callout>
        <P>
          Each of those inputs is explained below with its source. None of them are arbitrary.
        </P>
      </Section>

      {/* Self-Employment Tax */}
      <Section id="se-tax" label="Factor 01" title={`Self-employment tax — ${seTaxPct}%`}>
        <P>
          When you work for an employer, they pay half of your Social Security and Medicare taxes. As a freelancer, you pay both halves — the employer side and the employee side.
        </P>
        <DataRow label="Social Security"       value="12.4%" note="on first $168,600 of net earnings (2024)" />
        <DataRow label="Medicare"              value="2.9%"  note="on all net earnings" />
        <DataRow label="Total SE tax rate"     value={`${seTaxPct}%`} />
        <P>
          This is not an estimate or a conservative assumption. It is the statutory rate in IRS Publication 334 and Schedule SE. A W-2 employee making the same gross income pays roughly half this amount — their employer absorbs the other half invisibly.
        </P>
        <Callout>
          A freelancer billing ${(60000 * (1 + SE_TAX_RATE)).toLocaleString("en-US", { maximumFractionDigits: 0 })} gross needs to cover ${Math.round(60000 * SE_TAX_RATE).toLocaleString("en-US")} in SE tax to keep $60,000 in take-home pay. That money has to come from somewhere — it comes from your rate.
        </Callout>
        <Source>IRS Publication 334 (Tax Guide for Small Business); IRS Schedule SE; Social Security Administration wage base 2024</Source>
      </Section>

      {/* Health Insurance */}
      <Section id="health" label="Factor 02" title={`Health insurance — $${HEALTH_INSURANCE_ANNUAL.toLocaleString("en-US")}/year`}>
        <P>
          Salaried employees typically receive employer-subsidized health coverage. Freelancers buy their own. The ${HEALTH_INSURANCE_ANNUAL.toLocaleString("en-US")} figure represents the average annual premium for an individual ACA marketplace plan in 2026, before subsidies.
        </P>
        <DataRow label="Monthly premium (2026 avg)" value="$617/mo"  />
        <DataRow label="Annual total"               value={`$${HEALTH_INSURANCE_ANNUAL.toLocaleString("en-US")}`} />
        <P>
          Subsidies exist on a sliding income scale and are not accounted for here because they phase out as income rises and vary significantly by state, plan selection, and age. This figure represents the unsubsidized baseline — what you need to budget before any assistance.
        </P>
        <P>
          If you currently have coverage through a spouse, union, or other means, you may exclude this from your calculation. For everyone else, it is a real line item.
        </P>
        <Source>KFF Health Insurance Marketplace Calculator (2026); U.S. Department of Health &amp; Human Services ACA premium data</Source>
      </Section>

      {/* Profit Margin */}
      <Section id="profit" label="Factor 03" title={`Profit margin — ${profitPct}% (optional)`}>
        <P>
          A rate that exactly covers your expenses leaves no margin for error. Equipment fails. Projects fall through. Clients go silent. The {profitPct}% profit buffer is included as an optional line item — you can toggle it off in the calculator — but it represents the difference between a sustainable business and one that collapses when anything goes wrong.
        </P>
        <Callout>
          Profit is not greed. It is the financial equivalent of having a spare tire. A {profitPct}% margin on a $1,200/day rate is $240 — the cost of one round-trip flight to a client location, one day of equipment rental, or one bad invoice that never gets paid.
        </Callout>
        <P>
          Industry guidance from freelance business resources and the Freelancers Union commonly recommends 15–25% net profit targets for creative service businesses. We use {profitPct}% as a middle-ground default.
        </P>
        <Source>Freelancers Union; SCORE (U.S. Small Business Administration); standard small business financial planning guidance</Source>
      </Section>

      {/* Billable Days */}
      <Section id="billable-days" label="Factor 04" title={`Billable days — ${DEFAULT_BILLABLE_DAYS} per year`}>
        <P>
          A full-time salaried employee works roughly 260 days a year. A freelancer does not bill 260 days. The difference is absorbed by unpaid gaps between projects, time spent on business development, invoicing, admin, equipment maintenance, and the weeks between gigs that nobody tells you about before you go independent.
        </P>
        <DataRow label="Calendar work days (52 weeks × 5)"  value="260 days" />
        <DataRow label="Vacation / sick / holidays"          value="−20 days" />
        <DataRow label="Business development & admin"        value="−35 days" note="prospecting, invoicing, calls" />
        <DataRow label="Project gaps & dry spells"           value="−55 days" note="realistic for most markets" />
        <DataRow label="Estimated billable days"             value={`${DEFAULT_BILLABLE_DAYS} days`} />
        <P>
          {DEFAULT_BILLABLE_DAYS} days is not pessimistic. It is the number consistently cited in freelance surveys across creative disciplines. Experienced freelancers with full client rosters may bill 170–180 days. Newer freelancers may bill fewer. {DEFAULT_BILLABLE_DAYS} is a responsible baseline.
        </P>
        <P>
          You can adjust this in the calculator. Increasing it lowers your required day rate; decreasing it raises it. The math is transparent.
        </P>
        <Source>Freelancers Union Annual Freelancing in America Report; AND CO Freelancer Income Report; industry common practice</Source>
      </Section>

      {/* Rate Floors */}
      <Section id="rate-floors" label="Market Reference" title="Rate floors by discipline and experience">
        <P>
          The calculator compares your computed rate against market floors — the minimum a working professional at each level typically commands in a mid-market environment. These are not aspirational targets. They are the low end of what the market has demonstrated it will pay.
        </P>
        <P>
          These figures are drawn from 2024–2025 data across production rate cards, union minimums, freelance platform surveys, and direct industry reporting. They represent what clients actually pay when they hire experienced professionals — not what they offer when lowballing.
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
          The same day of work commands different rates in New York than in Tulsa — not because the work is different, but because the clients, budgets, and cost of living are different. Location multipliers adjust the rate floor to reflect what the local market will bear.
        </P>
        <DataRow label="Major Market (LA, NYC, Chicago, Miami)" value={`×${LOCATION_MULTIPLIERS["Major Market"]}`} note="+30% above baseline" />
        <DataRow label="Mid Market (Austin, Atlanta, Denver…)"  value={`×${LOCATION_MULTIPLIERS["Mid Market"]}`}   note="baseline" />
        <DataRow label="Small Market (regional cities, rural)"  value={`×${LOCATION_MULTIPLIERS["Small Market"]}`} note="−15% below baseline" />
        <P>
          These multipliers are conservative. Major-market productions frequently pay significantly above these floors — particularly for senior and expert-level crew on commercial and streaming work. The floor is a floor, not a ceiling.
        </P>
      </Section>

      {/* Inflation */}
      <Section id="inflation" label="Purchasing Power" title={`Inflation — ${inflationPct}% since ${INFLATION_BASE_YEAR}`}>
        <P>
          The reality check section of the calculator anchors your take-home goal to its {INFLATION_BASE_YEAR} purchasing power equivalent. This is not rhetorical — it is a factual adjustment for what a dollar is worth.
        </P>
        <DataRow label={`Cumulative CPI-U inflation (Jan ${INFLATION_BASE_YEAR} → Jan 2026)`} value={`+${inflationPct}%`} />
        <DataRow label="Inflation multiplier used"                                             value={`×${INFLATION_SINCE_2019}`} />
        <P>
          If you were earning $80,000 in {INFLATION_BASE_YEAR}, you need approximately ${Math.round(80000 * INFLATION_SINCE_2019).toLocaleString("en-US")} today to have the same purchasing power. A rate that hasn&apos;t kept pace with inflation isn&apos;t the same rate — it&apos;s a pay cut.
        </P>
        <P>
          This is why freelancers who haven&apos;t raised their rates in five or more years are effectively earning less than they were. The numbers didn&apos;t stay the same. The cost of everything else moved.
        </P>
        <Source>U.S. Bureau of Labor Statistics CPI-U (All Urban Consumers, All Items), January {INFLATION_BASE_YEAR} through January 2026</Source>
      </Section>

      {/* Closing */}
      <section style={{ borderTop: "2px solid var(--accent-2)", paddingTop: "2.5rem", marginTop: "3rem" }}>
        <h2 style={{ fontFamily: "var(--mono)", fontSize: "1.4rem", marginBottom: "1rem", lineHeight: 1.2 }}>
          The rate isn&apos;t high. The conversation is overdue.
        </h2>
        <p style={{ fontSize: "1.05rem", color: "var(--text-dim)", lineHeight: 1.8, marginBottom: "2rem", fontFamily: "var(--serif)" }}>
          Every number on this page is derived from public data. None of it is negotiable with math. What gets negotiated is your willingness to present it — and to hold to it.
        </p>
        <a href="/" style={{ display: "inline-block", background: "var(--accent)", color: "#000", fontFamily: "var(--mono)", fontSize: "0.78rem", letterSpacing: "0.18em", textTransform: "uppercase", padding: "0.85rem 1.75rem", textDecoration: "none", fontWeight: "bold" }}>
          Calculate Your Rate →
        </a>
      </section>

    </div>
  );
}
