"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { track } from "@vercel/analytics";          // custom event tracking
import { createClient } from "@/lib/supabase/client"; // anonymous DB logging
import {
  DISCIPLINES, EXPERIENCE_LEVELS, LOCATION_TIERS, FAMILY_SIZES, US_STATES, STATE_ANNUAL_COL,
  DEFAULT_BILLABLE_DAYS, calculate, currentEarnings, realityCheck, marketRange, fmt,
  INFLATION_BASE_YEAR, RATE_FLOORS, RATE_CEILINGS, LOCATION_MULTIPLIERS,
  HEALTH_INSURANCE_ANNUAL, SE_TAX_RATE, PROFIT_RATE,
  type Discipline, type ExperienceLevel, type LocationTier, type FamilySize, type USState,
  type CalcInputs, type CalcResults, type RealityCheckResult,
} from "@/lib/calculator";

// ==============================================
// URL STATE — encode/decode calculator inputs
// so results are shareable via link
// ==============================================
function inputsToParams(inputs: CalcInputs): URLSearchParams {
  const p = new URLSearchParams();
  p.set("d",  inputs.discipline);
  p.set("e",  inputs.experience);
  p.set("l",  inputs.location);
  p.set("th", String(inputs.takeHome));
  p.set("bd", String(inputs.billableDays));
  p.set("k",  inputs.hasKit ? "1" : "0");
  p.set("p",  inputs.includeProfit ? "1" : "0");
  return p;
}

function paramsToInputs(p: URLSearchParams): Partial<CalcInputs> {
  const out: Partial<CalcInputs> = {};
  const d = p.get("d"); if (DISCIPLINES.includes(d as Discipline)) out.discipline = d as Discipline;
  const e = p.get("e"); if (EXPERIENCE_LEVELS.includes(e as ExperienceLevel)) out.experience = e as ExperienceLevel;
  const l = p.get("l"); if (LOCATION_TIERS.includes(l as LocationTier)) out.location = l as LocationTier;
  const th = Number(p.get("th")); if (th > 0) out.takeHome = th;
  const bd = Number(p.get("bd")); if (bd > 0) out.billableDays = bd;
  if (p.has("k")) out.hasKit = p.get("k") === "1";
  if (p.has("p")) out.includeProfit = p.get("p") === "1";
  return out;
}

// ==============================================
// SMALL REUSABLE COMPONENTS
// ==============================================
function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily:    "var(--mono)",
      fontSize:      "0.78rem",      // raised from 0.7 → 14px
      letterSpacing: "0.07em",       // tightened from 0.18em — less work for the eye
      textTransform: "uppercase",
      fontWeight:    600,            // weight carries hierarchy instead of size alone
      color:         "var(--text)",  // full cream — text-dim fails contrast at this size
      marginBottom:  "0.6rem",
    }}>
      {children}
    </div>
  );
}

function RadioGroup<T extends string>({
  options, value, onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            background:   value === opt ? "rgba(212,146,10,0.12)" : "transparent",
            color:        value === opt ? "var(--accent)" : "var(--text-dim)",
            border:       `1px solid ${value === opt ? "var(--accent)" : "var(--border)"}`,
            fontFamily:   "var(--mono)",
            fontSize:     "0.83rem",
            letterSpacing:"0.04em",
            padding:      "0.45rem 0.9rem",
            borderRadius: "4px",
            cursor:       "pointer",
            transition:   "all 0.15s",
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ==============================================
// ANIMATED RATE — count-up reveal on calculate
// Runs from 0 → target in 700ms with ease-out cubic
// ==============================================
function AnimatedRate({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const duration = 700;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(value * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value]);

  return <>{fmt(display)}</>;
}

// ==============================================
// SHARE BUTTONS
// Two versions: personal (full inputs) and
// client-safe (rate only, no income/days exposed)
// ==============================================
function ShareButton({ inputs, results }: { inputs: CalcInputs; results: CalcResults }) {
  const [copiedPersonal, setCopiedPersonal] = useState(false);
  const [copiedClient,   setCopiedClient]   = useState(false);

  // Personal link — full inputs, for sharing with yourself or peers
  const copyPersonal = () => {
    const params = inputsToParams(inputs);
    const url = `${window.location.origin}?${params.toString()}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedPersonal(true);
      setTimeout(() => setCopiedPersonal(false), 2000);
    });
  };

  // Client-safe link — hides income goal and billable days
  // Only passes discipline, experience, location, computed rate, and kit flag
  const copyClient = () => {
    const p = new URLSearchParams();
    p.set("d",      inputs.discipline);
    p.set("e",      inputs.experience);
    p.set("l",      inputs.location);
    p.set("r",      String(Math.round(results.dayRate)));  // computed rate only
    p.set("k",      inputs.hasKit ? "1" : "0");
    p.set("client", "1");                                  // triggers client view
    const url = `${window.location.origin}?${p.toString()}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedClient(true);
      setTimeout(() => setCopiedClient(false), 2000);
    });
  };

  const btnBase = {
    background:     "none",
    fontFamily:     "var(--mono)",
    fontSize:       "0.72rem",
    letterSpacing:  "0.15em",
    textTransform:  "uppercase" as const,
    padding:        "0.65rem 1.5rem",
    borderRadius:   "4px",
    cursor:         "pointer",
    transition:     "color 0.2s, border-color 0.2s",
    flex:           1,
  };

  return (
    <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
      {/* Personal share — shows all your numbers */}
      <button onClick={copyPersonal} style={{
        ...btnBase,
        border: `1px solid ${copiedPersonal ? "var(--accent)" : "var(--border)"}`,
        color:  copiedPersonal ? "var(--accent)" : "var(--text-dim)",
      }}>
        {copiedPersonal ? "Copied ✓" : "Copy My Link ↗"}
      </button>

      {/* Client share — hides income goal, shows only rate + overhead context */}
      <button onClick={copyClient} style={{
        ...btnBase,
        border:      `1px solid ${copiedClient ? "var(--accent)" : "var(--accent)"}`,
        color:       copiedClient ? "var(--accent)" : "#000",
        background:  copiedClient ? "transparent" : "var(--accent)",
        fontWeight:  "bold",
      }}>
        {copiedClient ? "Client Link Copied ✓" : "Share With Client ↗"}
      </button>
    </div>
  );
}

// ==============================================
// CLIENT VIEW
// Shown when ?client=1 is in the URL.
// Displays the rate with structural justifications
// only — no personal income or billable day count.
// ==============================================
function ClientView({ params }: { params: URLSearchParams }) {
  const d = params.get("d") as Discipline | null;
  const e = params.get("e") as ExperienceLevel | null;
  const l = params.get("l") as LocationTier | null;
  const r = Number(params.get("r"));
  const hasKit = params.get("k") === "1";

  // Validate params — fall back gracefully if malformed
  const discipline = d && DISCIPLINES.includes(d)         ? d : null;
  const experience = e && EXPERIENCE_LEVELS.includes(e)   ? e : null;
  const location   = l && LOCATION_TIERS.includes(l)      ? l : null;

  if (!discipline || !experience || !location || !r) {
    return (
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "6rem 1.5rem", textAlign: "center" }}>
        <p style={{ color: "var(--text-dim)", fontFamily: "var(--mono)" }}>Invalid rate card link.</p>
      </div>
    );
  }

  const floor = RATE_FLOORS[discipline][experience] * LOCATION_MULTIPLIERS[location];

  // Generic overhead breakdown — no personal numbers
  // Uses median take-home as basis for illustration only
  const medianTakeHome     = 75000;
  const healthPct          = HEALTH_INSURANCE_ANNUAL / (medianTakeHome + HEALTH_INSURANCE_ANNUAL) * 100;
  const seTaxPct           = Math.round(SE_TAX_RATE * 100 * 10) / 10;
  const profitPct          = Math.round(PROFIT_RATE * 100);

  const row = (label: string, value: string, note: string) => (
    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "1.1rem 0", borderBottom: "1px solid var(--border)", gap: "1.5rem" }}>
      <div>
        <div style={{ fontSize: "0.75rem", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, color: "var(--text)", marginBottom: "0.25rem" }}>{label}</div>
        <div style={{ fontFamily: "var(--serif)", fontSize: "0.82rem", color: "var(--text-dim)", lineHeight: 1.65, maxWidth: "400px" }}>{note}</div>
      </div>
      <div style={{ fontFamily: "var(--mono)", fontSize: "0.95rem", color: "var(--accent)", whiteSpace: "nowrap", textAlign: "right", paddingTop: "0.1rem" }}>{value}</div>
    </div>
  );

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "5rem 1.5rem 6rem" }}>

      {/* Header */}
      <div style={{ marginBottom: "3rem" }}>
        <a href="/" style={{ fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--accent)", textDecoration: "none" }}>
          The Rate Guide
        </a>
        <h1 style={{ fontFamily: "var(--mono)", fontSize: "1.6rem", marginTop: "1.25rem", lineHeight: 1.2 }}>
          Rate Justification<br />for a {experience} {discipline}
        </h1>
        <p style={{ fontFamily: "var(--serif)", color: "var(--text-dim)", fontSize: "0.9rem", marginTop: "0.75rem", lineHeight: 1.75 }}>
          This document explains how a professional day rate is calculated for a creative freelancer.
          Every line item is a real cost.
        </p>
      </div>

      {/* The rate */}
      <div style={{ borderTop: "2px solid var(--accent)", paddingTop: "2rem", marginBottom: "2.5rem" }}>
        <div style={{ fontSize: "0.75rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 600, color: "var(--accent)", marginBottom: "0.5rem" }}>
          Day Rate
        </div>
        <div style={{ fontFamily: "var(--mono)", fontSize: "clamp(3rem, 8vw, 4.5rem)", lineHeight: 1, color: "var(--accent)" }}>
          {fmt(r)}
        </div>
        {hasKit && (
          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "0.5rem" }}>
            + Kit fee billed separately
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1.5rem", background: "var(--surface)", padding: "1.25rem" }}>
          {[
            ["Half-Day", fmt(r * 0.6)],
            ["Hourly",   fmt(r / 10)],
          ].map(([label, value]) => (
            <div key={label}>
              <div style={{ fontSize: "0.75rem", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, color: "var(--text)", marginBottom: "0.25rem" }}>{label}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "1.3rem", color: "var(--text)" }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Market floor reference */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "1rem 1.25rem", marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
        <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", lineHeight: 1.6 }}>
          Market floor for a {experience} {discipline} in a {location}
        </div>
        <div style={{ fontFamily: "var(--mono)", fontSize: "1.1rem", color: r >= floor ? "var(--text)" : "var(--danger)" }}>
          {fmt(floor)}/day
        </div>
      </div>

      {/* Why this number — structural overhead */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontSize: "0.75rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 600, color: "var(--text)", marginBottom: "1.25rem" }}>
          What this rate covers
        </div>

        {row(
          "Self-employment tax",
          `${seTaxPct}%`,
          `Freelancers pay both the employer and employee sides of Social Security and Medicare — ${seTaxPct}% of gross income. A salaried employee's employer covers half this cost. Freelancers cover it entirely.`
        )}
        {row(
          "Health insurance",
          `~${fmt(HEALTH_INSURANCE_ANNUAL)}/yr`,
          `Without employer-sponsored coverage, freelancers purchase individual health insurance on the open market. The 2026 ACA marketplace average for an individual is ${fmt(HEALTH_INSURANCE_ANNUAL)} per year before subsidies.`
        )}
        {row(
          "Operating margin",
          `${profitPct}%`,
          `A ${profitPct}% operating margin is standard practice for professional service businesses. It covers equipment maintenance, dry periods between projects, professional development, and the administrative cost of running an independent business.`
        )}
        {row(
          "Billable days",
          "~150/yr",
          `Freelancers do not bill 260 days a year. Project sourcing, proposal writing, invoicing, travel, equipment prep, and gaps between gigs eat the rest. 150 billable days is the industry standard.`
        )}
      </div>

      {/* Footer links */}
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        <a href="/methodology" style={{ fontSize: "0.78rem", letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--accent)", textDecoration: "none" }}>
          Full methodology with sources →
        </a>
        <a href="/" style={{ fontSize: "0.78rem", letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-dim)", textDecoration: "none" }}>
          Calculate your own rate →
        </a>
      </div>
    </div>
  );
}

// ==============================================
// REALITY CHECK PANEL
// Shows monthly cost of living breakdown by
// family size, with all major expense categories.
// ==============================================
function RealityCheck({
  rc, location, familySize, onFamilySizeChange,
}: {
  rc:                 RealityCheckResult;
  location:           string;
  familySize:         FamilySize;
  onFamilySizeChange: (f: FamilySize) => void;
}) {
  // Childcare toggle — on by default when family has kids, user can turn off
  const hasKids            = rc.childcare > 0;
  const [includeChildcare, setIncludeChildcare] = useState(true);

  // Recalculate left over if childcare is toggled off
  const effectiveChildcare = includeChildcare ? rc.childcare : 0;
  const effectiveTotal     = rc.totalExpenses - rc.childcare + effectiveChildcare;
  const effectiveLeftOver  = rc.monthlyTakeHome - effectiveTotal;

  const leftOverColor = effectiveLeftOver < 300
    ? "var(--danger)"
    : rc.leftOver < 800
    ? "#f5a623"
    : "var(--text)";

  const row = (label: string, value: string, negative = false) => (
    <div key={label} style={{
      display: "flex", justifyContent: "space-between",
      padding: "0.65rem 0", borderBottom: "1px solid var(--border)", fontSize: "0.8rem",
    }}>
      <span style={{ color: "var(--text-dim)" }}>{label}</span>
      <span style={{ fontFamily: "var(--mono)", color: negative ? "var(--danger)" : "var(--text-dim)" }}>
        {negative ? "−" : ""}{value}
      </span>
    </div>
  );

  return (
    <div style={{ marginTop: "1.5rem", background: "var(--surface)", border: "1px solid var(--border)", padding: "1.75rem 2rem", borderRadius: "4px" }}>
      <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "0.5rem" }}>
        Monthly Breakdown
      </div>
      <h2 style={{ fontSize: "1.4rem", fontFamily: "var(--mono)", marginBottom: "0.75rem", lineHeight: 1.2 }}>
        What does this buy you?
      </h2>

      {/* Inflation context */}
      <p style={{ fontFamily: "var(--serif)", fontSize: "0.88rem", color: "var(--text-dim)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
        In {INFLATION_BASE_YEAR} dollars, your {fmt(rc.monthlyTakeHome * 12)} take-home goal
        has the purchasing power of <strong style={{ color: "var(--text)" }}>{fmt(rc.in2019Dollars)}</strong>.
        Inflation didn&apos;t wait for your rate to catch up.
      </p>

      {/* Family size selector */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "0.75rem", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, color: "var(--text)", marginBottom: "0.6rem" }}>
          Household size
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {FAMILY_SIZES.map((f) => (
            <button key={f} onClick={() => onFamilySizeChange(f)} style={{
              background:    familySize === f ? "rgba(212,146,10,0.12)" : "transparent",
              color:         familySize === f ? "var(--accent)" : "var(--text-dim)",
              border:        `1px solid ${familySize === f ? "var(--accent)" : "var(--border)"}`,
              fontFamily:    "var(--mono)",
              fontSize:      "0.7rem",
              letterSpacing: "0.08em",
              padding:       "0.45rem 0.9rem",
              borderRadius:  "4px",
              cursor:        "pointer",
              transition:    "all 0.15s",
            }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Monthly breakdown */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "0.75rem", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, color: "var(--text)", marginBottom: "0.75rem" }}>
          Monthly expenses — {familySize} in a {location}
        </div>

        {row("Take-home",           fmt(rc.monthlyTakeHome))}
        {row("Rent / housing",      fmt(rc.rent),           true)}
        {row("Food",                fmt(rc.food),           true)}
        {row("Transportation",      fmt(rc.transportation), true)}
        {row("Utilities",           fmt(rc.utilities),      true)}
        {row("Health insurance",    fmt(rc.healthInsurance),true)}
        {row("Cell phone",          fmt(rc.cellPhone),      true)}
        {row("Clothing & personal", fmt(rc.clothing),       true)}
        {row("Entertainment",       fmt(rc.entertainment),  true)}
        {/* Childcare row with toggle */}
        {hasKids && (
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "0.65rem 0", borderBottom: "1px solid var(--border)", fontSize: "0.8rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span style={{ color: includeChildcare ? "var(--text-dim)" : "var(--border)" }}>
                Childcare
              </span>
              {/* Toggle — lets user turn off childcare if kids are older */}
              <button
                onClick={() => setIncludeChildcare(!includeChildcare)}
                style={{
                  fontSize: "0.72rem", letterSpacing: "0.04em", textTransform: "uppercase",
                  background: "none", border: `1px solid var(--border)`,
                  color: "var(--text-dim)", fontFamily: "var(--mono)",
                  padding: "0.15rem 0.5rem", borderRadius: "4px", cursor: "pointer",
                }}
              >
                {includeChildcare ? "remove" : "add back"}
              </button>
            </div>
            <span style={{ fontFamily: "var(--mono)", color: includeChildcare ? "var(--danger)" : "var(--border)" }}>
              {includeChildcare ? `−${fmt(rc.childcare)}` : "—"}
            </span>
          </div>
        )}

        {row("Savings (recommended)", fmt(rc.savings), true)}
      </div>

      {/* What's left */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1rem 1.2rem", background: "var(--surface)",
        borderLeft: `3px solid ${leftOverColor}`, flexWrap: "wrap", gap: "1rem",
      }}>
        <div>
          <div style={{ fontSize: "0.75rem", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, color: "var(--text)", marginBottom: "0.2rem" }}>
            Left over after all expenses
          </div>
          <div style={{ fontFamily: "var(--serif)", fontSize: "0.8rem", color: "var(--text-dim)", lineHeight: 1.5 }}>
            {effectiveLeftOver < 0
              ? "This take-home goal doesn't cover your expenses. You need a higher rate."
              : effectiveLeftOver < 300
              ? "Subsistence income. Survival mode."
              : effectiveLeftOver < 800
              ? "Almost no cushion. One bad month and you're in trouble."
              : "Some breathing room, but thin margin for the unexpected."}
          </div>
        </div>
        <div style={{ fontFamily: "var(--mono)", fontSize: "2rem", color: leftOverColor, whiteSpace: "nowrap" }}>
          {effectiveLeftOver < 0 ? "−" : ""}{fmt(Math.abs(effectiveLeftOver))}/mo
        </div>
      </div>

      <p style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "1rem", lineHeight: 1.6 }}>
        Estimates based on 2025–2026 averages. Sources: BLS Consumer Expenditure Survey, MIT Living Wage Calculator.
        Your actual expenses will vary — but if it&apos;s tight here, it&apos;s tight in real life.
      </p>
    </div>
  );
}

// ==============================================
// MARKET RANGE PANEL
// Shows where the user's rate sits within the
// typical floor→ceiling range for their profile.
// Phase 2: swap in real median from calc_events
// once enough data exists (target: 10+ per combo).
//
// dayRate is optional — when omitted the panel shows the range with no marker,
// used at the top of the page before the user enters a rate.
// ==============================================
function MarketRangePanel({
  inputs,
  dayRate,
  rateLabel = "Your rate",
  topBorder = true,
}: {
  inputs:     CalcInputs;
  dayRate?:   number;
  rateLabel?: string;
  topBorder?: boolean;
}) {
  const multiplier = LOCATION_MULTIPLIERS[inputs.location];
  const floor      = RATE_FLOORS[inputs.discipline][inputs.experience]   * multiplier;
  const ceiling    = RATE_CEILINGS[inputs.discipline][inputs.experience] * multiplier;

  const mr       = dayRate !== undefined ? marketRange(inputs.discipline, inputs.experience, inputs.location, dayRate) : null;
  const barWidth = mr ? Math.min(Math.max(mr.percentile, 4), 96) : null;

  const POSITION_CONFIG = {
    below: { label: "Below market",       color: "var(--danger)",   message: "This rate is below the floor for your discipline and market. You're leaving money on the table." },
    low:   { label: "Low end of market",  color: "#f5a623",         message: "You're in the market but on the lower end. There's room to grow without pricing yourself out." },
    mid:   { label: "Mid market",         color: "var(--accent)",   message: "This rate is solid and defensible. You're where working professionals at your level land." },
    high:  { label: "High end of market", color: "var(--accent)",   message: "You're commanding a strong rate, where well-positioned, in-demand professionals operate." },
    above: { label: "Above market",       color: "var(--text-dim)", message: "This rate is above the typical ceiling. Make sure your credits and reputation can support it." },
  };
  const config = mr ? POSITION_CONFIG[mr.position] : null;

  return (
    <div style={{ marginTop: "1.5rem", background: "var(--surface)", border: "1px solid var(--border)", padding: "1.75rem 2rem", borderRadius: "4px", borderTop: topBorder ? "2px solid var(--accent-2)" : "1px solid var(--border)" }}>
      <div style={{ fontSize: "0.75rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 600, color: "var(--text)", marginBottom: "0.4rem" }}>
        Market Context
      </div>
      <p style={{ fontSize: "0.8rem", color: "var(--text-dim)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
        <strong style={{ color: "var(--text)" }}>{inputs.experience} {inputs.discipline}</strong>{" · "}
        <strong style={{ color: "var(--text)" }}>{inputs.location}</strong>{" · "}2024–2025 data
      </p>

      {/* Position label row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.6rem" }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", color: config ? config.color : "var(--text-dim)", letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 600 }}>
          {config ? `${rateLabel} — ${config.label}` : "Market range"}
        </span>
        <span style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", color: "var(--text-dim)" }}>
          {fmt(floor)} — {fmt(ceiling)}
        </span>
      </div>

      {/* Range bar */}
      <div style={{ position: "relative", height: "6px", background: "var(--border)", marginBottom: "0.5rem" }}>
        {mr && config && barWidth !== null && (
          <>
            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${barWidth}%`, background: config.color, transition: "width 0.4s ease" }} />
            <div style={{ position: "absolute", top: "50%", left: `${barWidth}%`, transform: "translate(-50%, -50%)", width: "14px", height: "14px", borderRadius: "50%", background: config.color, border: "2px solid var(--bg)", transition: "left 0.4s ease" }} />
          </>
        )}
      </div>

      {/* Floor / ceiling labels */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--text-dim)", fontFamily: "var(--mono)" }}>Floor</span>
        <span style={{ fontSize: "0.75rem", color: "var(--text-dim)", fontFamily: "var(--mono)" }}>Ceiling</span>
      </div>

      {/* Contextual message — only when a rate is provided */}
      {config && (
        <p style={{ fontFamily: "var(--serif)", fontSize: "0.85rem", color: "var(--text-dim)", lineHeight: 1.75, borderLeft: `3px solid ${config.color}`, paddingLeft: "1rem", marginBottom: "0.75rem" }}>
          {config.message}
        </p>
      )}

      <p style={{ fontSize: "0.65rem", color: "var(--text-dim)", lineHeight: 1.6, fontStyle: "italic", opacity: 0.7 }}>
        Range based on industry rate surveys and union data. US market only. Community medians coming as data grows.
      </p>
    </div>
  );
}

// ==============================================
// SURVEY
// Single question at the end of results.
// Captures whether the calculator changed how
// the user thinks about their rate — used as
// marketing data ("X% were inspired to raise").
// ==============================================
const RESPONSES = [
  "Yes, I'm raising it",
  "Yes, I realized I was already fair",
  "Not sure yet",
  "No change",
] as const;

const INCREASE_RANGES = [
  "Less than $50/day",
  "$50–$100/day",
  "$100–$200/day",
  "$200–$500/day",
  "More than $500/day",
] as const;

function Survey({ inputs }: { inputs: CalcInputs }) {
  const [selected,  setSelected]  = useState<string | null>(null);
  const [range,     setRange]     = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleResponse = async (response: string) => {
    setSelected(response);
    // If raising their rate, wait for the follow-up range before submitting
    if (response !== "Yes, I'm raising it") {
      await submit(response, null);
    }
  };

  const handleRange = async (r: string) => {
    setRange(r);
    await submit(selected!, r);
  };

  const submit = async (response: string, increaseRange: string | null) => {
    try {
      const supabase = createClient();
      await supabase.from("survey_responses").insert({
        response,
        increase_range: increaseRange,
        discipline:     inputs.discipline,
        experience:     inputs.experience,
        location:       inputs.location,
      });
    } catch (_) {
      // Silent — never block UX on a survey failure
    } finally {
      setSubmitted(true);
    }
  };

  const btnStyle = (active: boolean) => ({
    background:    active ? "rgba(212,146,10,0.12)" : "transparent",
    color:         active ? "var(--accent)" : "var(--text-dim)",
    border:        `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
    fontFamily:    "var(--sans)",
    fontSize:      "0.82rem",
    padding:       "0.65rem 1rem",
    borderRadius:  "4px",
    cursor:        "pointer",
    textAlign:     "left" as const,
    lineHeight:    1.4,
    transition:    "all 0.15s",
  });

  return (
    <div style={{ marginTop: "1.5rem", background: "var(--surface)", border: "1px solid var(--border)", padding: "1.75rem 2rem", borderRadius: "4px" }}>
      <div style={{ fontSize: "0.75rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 600, color: "var(--text)", marginBottom: "0.5rem" }}>
        Quick question
      </div>

      {/* Submitted state */}
      {submitted ? (
        <div>
          <p style={{ fontFamily: "var(--serif)", fontSize: "1rem", color: "var(--text)", lineHeight: 1.7 }}>
            Thanks for sharing. Every response helps build a clearer picture of what freelancers earn.
          </p>
        </div>

      /* Follow-up: how much are you raising it? */
      ) : selected === "Yes, I'm raising it" && !range ? (
        <div>
          <h3 style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1.25rem", lineHeight: 1.3 }}>
            By how much?
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {INCREASE_RANGES.map((r) => (
              <button key={r} onClick={() => handleRange(r)} style={btnStyle(false)}>
                {r}
              </button>
            ))}
          </div>
        </div>

      /* Initial question */
      ) : (
        <div>
          <h3 style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1.25rem", lineHeight: 1.3 }}>
            Did this change how you think about your rate?
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {RESPONSES.map((r) => (
              <button key={r} onClick={() => handleResponse(r)} style={btnStyle(selected === r)}>
                {r}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==============================================
// GAP ANALYSIS
// Optional "what do you actually charge?" input.
// Shows how much the user is leaving on the table,
// and logs their real rate for community median data.
// ==============================================
function GapAnalysis({ results, inputs }: { results: CalcResults; inputs: CalcInputs }) {
  const [raw,      setRaw]      = useState("");       // raw input string
  const [logged,   setLogged]   = useState(false);    // prevent duplicate DB writes

  // Parse to a clean number — empty string = no entry yet
  const current = raw === "" ? null : Number(raw.replace(/[^0-9]/g, ""));
  const valid   = current !== null && !isNaN(current) && current > 0;

  // Gap math
  const gapPerDay  = valid ? results.dayRate - current!  : 0;
  const gapPerYear = gapPerDay * results.billableDays;
  const overMin    = valid && current! >= results.dayRate;

  // Log to Supabase once per unique entry (on blur)
  const handleBlur = async () => {
    if (!valid || logged) return;
    try {
      const supabase = createClient();
      await supabase.from("current_rate_reports").insert({
        discipline:   inputs.discipline,
        experience:   inputs.experience,
        location:     inputs.location,
        current_rate: current,
      });
      setLogged(true);
    } catch (_) {
      // Silent — never block UX on logging failure
    }
  };

  return (
    <div style={{ marginTop: "2.5rem", paddingTop: "2rem", borderTop: "1px solid var(--border)" }}>
      <div style={{ fontSize: "0.75rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 600, color: "var(--text)", marginBottom: "0.75rem" }}>
        Gap Analysis
      </div>
      <div style={{ fontSize: "0.9rem", color: "var(--text)", marginBottom: "1rem", lineHeight: 1.5 }}>
        What are you currently charging?{" "}
        <span style={{ color: "var(--text-dim)", fontSize: "0.8rem" }}>(optional — helps us show real market averages)</span>
      </div>

      {/* Input */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
        <span style={{ fontFamily: "var(--mono)", color: "var(--text-dim)", fontSize: "1.1rem" }}>$</span>
        <input
          type="number"
          min="0"
          placeholder="e.g. 450"
          value={raw}
          onChange={e => { setRaw(e.target.value); setLogged(false); }}
          onBlur={handleBlur}
          style={{
            background:   "var(--surface)",
            border:       "1px solid var(--border)",
            borderRadius: "4px",
            color:        "var(--text)",
            fontFamily:   "var(--mono)",
            fontSize:     "1.1rem",
            padding:      "0.6rem 0.85rem",
            width:        "160px",
            outline:      "none",
          }}
        />
        <span style={{ fontFamily: "var(--mono)", color: "var(--text-dim)", fontSize: "0.8rem" }}>/day</span>
      </div>

      {/* Gap display — only shown once they've entered a valid number */}
      {valid && (
        <div style={{
          background:   "var(--surface)",
          border:       `1px solid ${overMin ? "var(--accent)" : "var(--danger)"}`,
          borderRadius: "4px",
          padding:      "1.25rem 1.5rem",
          lineHeight:   1.7,
        }}>
          {overMin ? (
            // Charging at or above their minimum — positive reinforcement
            <div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "1.1rem", color: "var(--accent)", marginBottom: "0.4rem" }}>
                You&apos;re charging above your minimum. Nice.
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-dim)" }}>
                {fmt(current!)}/day vs. {fmt(results.dayRate)}/day minimum. You have {fmt(current! - results.dayRate)}/day of cushion — {fmt((current! - results.dayRate) * results.billableDays)}/year.
              </div>
            </div>
          ) : (
            // Undercharging — show the dollar gap clearly
            <div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "1.1rem", color: "var(--danger)", marginBottom: "0.4rem" }}>
                You&apos;re leaving {fmt(gapPerYear)}/year on the table.
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-dim)", lineHeight: 1.7 }}>
                {fmt(current!)}/day vs. {fmt(results.dayRate)}/day minimum — a gap of {fmt(gapPerDay)}/day.
                At {results.billableDays} billable days, that&apos;s <strong style={{ color: "var(--danger)" }}>{fmt(gapPerYear)}</strong> per year
                you&apos;re working for free.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==============================================
// RESULTS PANEL
// ==============================================
// ==============================================
// EMAIL CAPTURE
// Shown after the rate card. Offer: "save your results."
// Captures email + rate data to Supabase for follow-up.
// ==============================================
function EmailCapture({ results, inputs, currentRate }: { results: CalcResults; inputs: CalcInputs; currentRate: number | null }) {
  const [email,     setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: dbError } = await supabase.from("email_captures").insert({
        email,
        discipline: inputs.discipline,
        experience: inputs.experience,
        location:   inputs.location,
        day_rate:      Math.round(results.dayRate + results.kitFee),
        current_rate:  currentRate ?? null,
      });
      if (dbError) throw dbError;
      track("email_capture", { discipline: inputs.discipline, experience: inputs.experience });

      // Send rate breakdown email — fire and forget, never block on failure
      fetch("/api/send-results", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          email,
          discipline:  inputs.discipline,
          experience:  inputs.experience,
          location:    inputs.location,
          dayRate:     Math.round(results.dayRate + results.kitFee),
          currentRate: currentRate ?? null,
        }),
      }).catch(() => {}); // silent — email is best-effort

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ marginTop: "2rem", padding: "1.25rem 1.5rem", background: "var(--surface)", borderLeft: "3px solid var(--accent)" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.85rem", color: "var(--accent)", marginBottom: "0.25rem" }}>
          Check your inbox.
        </div>
        <div style={{ fontSize: "0.78rem", color: "var(--text-dim)", lineHeight: 1.6 }}>
          Your rate breakdown is on its way to <strong style={{ color: "var(--text)" }}>{email}</strong>.
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "2rem", padding: "1.25rem 1.5rem", background: "var(--surface)" }}>
      <div style={{ fontSize: "0.75rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 600, color: "var(--text)", marginBottom: "0.25rem" }}>
        Save your results
      </div>
      <div style={{ fontSize: "0.78rem", color: "var(--text-dim)", lineHeight: 1.6, marginBottom: "1rem" }}>
        We&apos;ll send your rate breakdown to keep.
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            flex:         "1 1 200px",
            background:   "var(--bg)",
            border:       "1px solid var(--border)",
            borderRadius: "4px",
            color:        "var(--text)",
            fontFamily:   "var(--mono)",
            fontSize:     "0.85rem",
            padding:      "0.65rem 1rem",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            background:    "var(--accent)",
            color:         "#000",
            border:        "none",
            borderRadius:  "4px",
            fontFamily:    "var(--mono)",
            fontSize:      "0.75rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            padding:       "0.65rem 1.25rem",
            cursor:        "pointer",
            fontWeight:    "bold",
            opacity:       loading ? 0.6 : 1,
            whiteSpace:    "nowrap",
          }}
        >
          {loading ? "..." : "Send It"}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "var(--danger)" }}>{error}</div>
      )}

      <div style={{ marginTop: "0.6rem", fontSize: "0.65rem", color: "var(--text-dim)", lineHeight: 1.5 }}>
        No spam. Unsubscribe any time.
      </div>
    </div>
  );
}

// ==============================================
// RESULTS
// ==============================================
function Results({ results, inputs, currentRate, zipCounty }: { results: CalcResults; inputs: CalcInputs; currentRate: number | null; zipCounty: string | null }) {
  // Family size lives in Results — independent of the rate calculation
  const [familySize, setFamilySize] = useState<FamilySize>("Single");
  const rc = realityCheck(inputs.takeHome, inputs.location, familySize);
  const lineStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "1.2rem 0",
    borderBottom: "1px solid var(--border)",
    gap: "2rem",
  };

  return (
    <div className="fade-in" style={{ marginTop: "4.5rem" }}>

      {/* ── ARRIVAL MARKER ─────────────────────────────────────────── */}
      {/* Visual break between form and results — signals "you've arrived" */}
      <div style={{
        display:       "flex",
        alignItems:    "center",
        gap:           "1rem",
        marginBottom:  "2.5rem",
      }}>
        <div style={{ flex: 1, height: "1px", background: "var(--accent-2)" }} />
        <div style={{
          fontFamily:    "var(--mono)",
          fontSize:      "0.65rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color:         "var(--accent)",
          whiteSpace:    "nowrap",
        }}>
          Your Results
        </div>
        <div style={{ flex: 1, height: "1px", background: "var(--accent-2)" }} />
      </div>

      {/* Sticky rate bar — stays visible as user scrolls through the breakdown */}
      <div style={{
        position:        "sticky",
        top:             0,
        zIndex:          10,
        background:      "var(--bg)",
        borderBottom:    "1px solid var(--border)",
        padding:         "0.6rem 0",
        marginBottom:    "2rem",
        display:         "flex",
        alignItems:      "baseline",
        gap:             "0.75rem",
      }}>
        <span style={{ fontSize: "0.75rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--mono)", fontWeight: 600 }}>
          Your Rate
        </span>
        <span style={{ fontFamily: "var(--mono)", fontSize: "1.4rem", color: "var(--accent)", fontWeight: "bold" }}>
          {fmt(results.dayRate + results.kitFee)}/day
        </span>
        <span style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", color: "var(--text-dim)" }}>
          {fmt(results.halfDayRate)} half · {fmt(results.hourlyRate)}/hr
          {results.kitFee > 0 && ` · incl. ${fmt(results.kitFee)} kit`}
        </span>
      </div>

      {/* Main rate — the hero moment */}
      <div style={{ borderTop: "2px solid var(--accent)", paddingTop: "2.5rem", marginBottom: "2.5rem", textAlign: "center" }}>
        <div style={{ fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 600, marginBottom: "1rem", fontFamily: "var(--mono)" }}>
          Your Target Day Rate
        </div>
        <div style={{ fontSize: "clamp(3.5rem, 12vw, 6rem)", fontFamily: "var(--mono)", lineHeight: 1, color: "var(--accent)", fontWeight: "bold", letterSpacing: "-0.02em" }}>
          <AnimatedRate value={results.dayRate + results.kitFee} />
        </div>
        {results.kitFee > 0 && (
          <div style={{ fontSize: "0.75rem", fontFamily: "var(--mono)", color: "var(--text-dim)", marginTop: "0.75rem" }}>
            {fmt(results.dayRate)} day rate + {fmt(results.kitFee)} kit fee
          </div>
        )}
        <div style={{ fontSize: "0.8rem", fontFamily: "var(--serif)", color: "var(--text-dim)", marginTop: "1rem", lineHeight: 1.6 }}>
          Every line below is a real cost.
        </div>
      </div>

      {/* Below floor warning */}
      {results.belowFloor && (
        <div style={{
          border: "1px solid var(--danger)",
          padding: "1rem 1.2rem",
          marginBottom: "2rem",
          fontSize: "0.8rem",
          lineHeight: 1.6,
          color: "var(--danger)",
        }}>
          Your calculated rate of {fmt(results.dayRate)}/day falls below the market floor
          of {fmt(results.rateFloor)}/day for a {inputs.experience} {inputs.discipline} in a {inputs.location}.
          Adjust your inputs or charge the floor rate.
        </div>
      )}

      {/* Line-by-line breakdown — each line staggers in so users read it, not skip it */}
      <div className="fade-in-stagger card-hover" style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "1.75rem 2rem", borderRadius: "4px" }}>
        {[
          {
            label: "Take-Home Goal",
            amount: `${fmt(results.takeHome)}/yr`,
            note: "What you want in your pocket after taxes and expenses.",
          },
          {
            label: "+ Health Insurance",
            amount: `${fmt(results.healthInsurance)}/yr`,
            note: zipCounty
              ? `Avg Silver plan premium for ${zipCounty}. Salaried employees get this as a benefit. You pay for it yourself.`
              : "Salaried employees get this as a benefit. You pay for it yourself. Most freelancers don't factor it in.",
          },
          {
            label: "+ Self-Employment Tax",
            amount: `${fmt(results.seTax)}/yr`,
            note: "When you work for a company, they cover half your Social Security and Medicare taxes. When you're freelance, you pay both sides. That's an extra 15.3% on top of your income tax.",
          },
          {
            label: `+ Federal Income Tax (est. ${Math.round(results.federalTaxRate * 100)}%)`,
            amount: `${fmt(results.federalTax)}/yr`,
            note: `Estimated after your health insurance deduction, the ½ SE tax deduction, and ~$10k in business write-offs. Your actual rate depends on filing status and total deductions.`,
          },
          {
            label: `+ State & Local Tax (est. ${Math.round(results.stateTaxRate * 100)}%)`,
            amount: `${fmt(results.stateTax)}/yr`,
            note: "Median effective rate for your market tier. Major markets (LA, NY, Chicago) skew high. TX and FL have no income tax. An estimate.",
          },
          ...(results.profit > 0 ? [{
            label: "+ Profit Margin (20%)",
            amount: `${fmt(results.profit)}/yr`,
            note: "This covers slow months, equipment repairs, continued education, and your ability to grow. No margin means one bad month wipes you out.",
          }] : []),
          {
            label: `÷ ${results.billableDays} Billable Days`,
            amount: `${results.billableDays} days/yr`,
            note: `${results.billableDays} days is roughly ${(results.billableDays / 52).toFixed(1)} billable days per week. The rest goes to admin, marketing, travel, chasing invoices, and the slow seasons.`,
            last: true,
          },
        ].map(({ label, amount, note, last }) => (
          <div key={label} style={{ ...lineStyle, ...(last ? { borderBottom: "2px solid var(--accent)" } : {}) }}>
            <div>
              <div style={{ fontSize: "0.78rem", letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-dim)" }}>{label}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", lineHeight: 1.6, maxWidth: "420px", marginTop: "0.3rem" }}>{note}</div>
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "1rem", color: "var(--text)", whiteSpace: "nowrap", textAlign: "right" }}>{amount}</div>
          </div>
        ))}
      </div>

      {/* Rate card — auto-fit grid reflows naturally on mobile */}
      <div className="card-hover" style={{
        marginTop: "1.5rem",
        padding: "1.75rem 2rem",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "4px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "1.25rem 2rem",
      }}>
        {[
          ["Day Rate",              fmt(results.dayRate + results.kitFee)],
          ["Half-Day",              fmt(results.halfDayRate)],
          ["Hourly",                fmt(results.hourlyRate)],
          ...(results.kitFee > 0 ? [["  ↳ Rate",  fmt(results.dayRate)], ["  ↳ Kit Fee", fmt(results.kitFee)]] : []),
        ].map(([label, value]) => {
          const isBreakdown = label.startsWith("  ↳");
          return (
            <div key={label}>
              <div style={{ fontSize: isBreakdown ? "0.72rem" : "0.75rem", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, color: isBreakdown ? "var(--text-dim)" : "var(--text)", marginBottom: "0.25rem" }}>{label.trim()}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: isBreakdown ? "0.95rem" : "1.4rem", color: isBreakdown ? "var(--text-dim)" : "var(--text)" }}>{value}</div>
            </div>
          );
        })}
      </div>

      <ShareButton inputs={inputs} results={results} />

      <EmailCapture results={results} inputs={inputs} currentRate={currentRate} />

      {/* ── RHYTHM BREAK ───────────────────────────────────────────── */}
      {/* Minimal pause between dense breakdown and market context.    */}
      {/* A single large stat gives the eye a resting point.          */}
      <div style={{
        marginTop:  "3.5rem",
        marginBottom: "3.5rem",
        textAlign:  "center",
        padding:    "2.5rem 1.5rem",
        borderTop:    "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-dim)", fontFamily: "var(--mono)", marginBottom: "0.75rem" }}>
          At {results.billableDays} billable days
        </div>
        <div style={{ fontFamily: "var(--mono)", fontSize: "clamp(2rem, 6vw, 3rem)", color: "var(--text)", lineHeight: 1, marginBottom: "0.6rem" }}>
          {fmt((results.dayRate + results.kitFee) * results.billableDays)}/yr
        </div>
        <div style={{ fontSize: "0.8rem", color: "var(--text-dim)", fontFamily: "var(--serif)", lineHeight: 1.6 }}>
          gross — before tax, insurance, and overhead
        </div>
      </div>

      {/* Gap summary — only shown if user entered their current rate above */}
      {currentRate !== null && currentRate > 0 && (() => {
        const gap    = results.dayRate - currentRate;
        const gapYr  = gap * results.billableDays;
        const over   = gap <= 0;
        return (
          <div style={{ marginTop: "1.5rem", padding: "1.75rem 2rem", background: "var(--surface)", border: `1px solid ${over ? "var(--accent)" : "var(--danger)"}`, borderRadius: "4px" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.85rem", color: over ? "var(--accent)" : "var(--danger)" }}>
              {over
                ? `You're ${fmt(Math.abs(gap))}/day above your minimum — ${fmt(Math.abs(gapYr))}/year of cushion.`
                : `Gap vs minimum: ${fmt(gap)}/day = ${fmt(gapYr)}/year you're leaving on the table.`}
            </span>
          </div>
        );
      })()}

      {/* Market range — now shows where the CALCULATED minimum falls */}
      <MarketRangePanel inputs={inputs} dayRate={results.dayRate} rateLabel="Your minimum" topBorder={false} />

      {/* Rate strategy note */}
      <div style={{ marginTop: "2rem", padding: "1.5rem 1.75rem", borderLeft: "3px solid var(--accent-2)", background: "var(--surface)" }}>
        <p style={{ fontFamily: "var(--serif)", fontSize: "0.85rem", color: "var(--text-dim)", lineHeight: 1.75, margin: 0 }}>
          Your actual rate depends on what the market will bear.
          If you work below your minimum, make it explicit. Tell them your standard rate and name the discount.
          You do the project. They understand what they&apos;re getting. That&apos;s the kind of thing clients remember.
        </p>
      </div>

      <RealityCheck
        rc={rc}
        location={inputs.location}
        familySize={familySize}
        onFamilySizeChange={setFamilySize}
      />

      <Survey inputs={inputs} />

      {/* Store CTA — negotiation books and resources */}
      <div style={{ marginTop: "3.5rem", borderTop: "2px solid var(--accent-2)", paddingTop: "2rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)" }}>
          Now that you know your number
        </div>
        <p style={{ fontFamily: "var(--serif)", fontSize: "0.9rem", color: "var(--text-dim)", lineHeight: 1.75, margin: 0 }}>
          Knowing your number is one thing. Saying it and holding it when someone pushes back is another. These books help.
        </p>
        <a
          href="/store"
          style={{
            display:        "inline-block",
            marginTop:      "0.5rem",
            fontFamily:     "var(--mono)",
            fontSize:       "0.72rem",
            letterSpacing:  "0.15em",
            textTransform:  "uppercase",
            color:          "var(--accent)",
            textDecoration: "none",
            borderBottom:   "1px solid var(--accent)",
            paddingBottom:  "2px",
            alignSelf:      "flex-start",
          }}
        >
          Browse negotiation resources →
        </a>
      </div>

      {/* Start Over — clears all URL params and results */}
      <div style={{ marginTop: "3rem", textAlign: "center" }}>
        <a href="/" style={{
          fontSize:       "0.7rem",
          letterSpacing:  "0.15em",
          textTransform:  "uppercase",
          color:          "var(--text-dim)",
          textDecoration: "none",
          fontFamily:     "var(--mono)",
          borderBottom:   "1px solid var(--border)",
          paddingBottom:  "2px",
        }}>
          Start Over
        </a>
      </div>
    </div>
  );
}

// ==============================================
// CALCULATOR — form + state
// Detects ?client=1 and renders ClientView instead
// ==============================================
function Calculator() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // If client=1 is in the URL, render the client-safe view
  if (searchParams.get("client") === "1") {
    return <ClientView params={searchParams} />;
  }

  const urlInputs = paramsToInputs(searchParams);

  const [inputs, setInputs] = useState<CalcInputs>({
    discipline:    urlInputs.discipline    ?? "Cinematographer / DP",
    experience:    urlInputs.experience    ?? "Mid",
    location:      urlInputs.location      ?? "Mid Market",
    takeHome:      urlInputs.takeHome      ?? 0,
    billableDays:  urlInputs.billableDays  ?? DEFAULT_BILLABLE_DAYS,
    hasKit:        urlInputs.hasKit        ?? false,
    includeProfit: urlInputs.includeProfit ?? true,
  });

  const [calcCount,            setCalcCount]            = useState<number | null>(null);
  const [results,              setResults]              = useState<CalcResults | null>(null);
  const [currentRate,          setCurrentRate]          = useState<number | null>(null);
  const [currentRateRaw,       setCurrentRateRaw]       = useState("");
  const [currentBillableDays,  setCurrentBillableDays]  = useState(DEFAULT_BILLABLE_DAYS);
  const [takeHomeRaw,          setTakeHomeRaw]          = useState(urlInputs.takeHome ? String(urlInputs.takeHome) : "");
  const [currentRateState,     setCurrentRateState]     = useState<USState | "">("");
  const [rateLogged,           setRateLogged]           = useState(false);
  // Income calculator starts collapsed; auto-expands when URL has params (shared link)
  const [showIncomeCalc, setShowIncomeCalc] = useState(false);

  // Health insurance — ZIP lookup
  const [zipRaw,           setZipRaw]           = useState("");
  const [zipLookupStatus,  setZipLookupStatus]  = useState<"idle" | "loading" | "ok" | "error" | "no-key">("idle");
  const [zipPremiumData,   setZipPremiumData]   = useState<{
    avgMonthlyPremium: number;
    avgAnnualPremium:  number;
    county:            string;
    state:             string;
    planCount:         number;
  } | null>(null);

  const fetchHealthPremium = async (zip: string) => {
    setZipLookupStatus("loading");
    try {
      const res  = await fetch(`/api/health-insurance?zip=${zip}`);
      const data = await res.json();
      if (res.status === 503) { setZipLookupStatus("no-key"); return; }
      if (!res.ok) throw new Error(data.error);
      setZipPremiumData(data);
      setZipLookupStatus("ok");
    } catch {
      setZipPremiumData(null);
      setZipLookupStatus("error");
    }
  };

  // The health insurance figure used in the calculation — live if ZIP resolved, else static default
  const healthInsuranceAnnual = zipPremiumData?.avgAnnualPremium ?? HEALTH_INSURANCE_ANNUAL;

  // Fetch total calculation count for trust signal
  useEffect(() => {
    createClient()
      .from("calc_events")
      .select("*", { count: "exact", head: true })
      .then(({ count }) => { if (count && count > 0) setCalcCount(count); });
  }, []);

  // Sync inputs to URL whenever they change
  useEffect(() => {
    const params = inputsToParams(inputs);
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [inputs, router]);

  // Auto-calculate and expand income section if URL had params on load
  useEffect(() => {
    if (searchParams.toString()) {
      setResults(calculate(inputs));
      setShowIncomeCalc(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Log current rate to Supabase (anonymous market data)
  // Fires on rate blur and again on state selection so we capture both fields.
  const logCurrentRate = async (rate: number, state: USState | "") => {
    if (!rate || rateLogged) return;
    try {
      const supabase = createClient();
      await supabase.from("current_rate_reports").insert({
        discipline:   inputs.discipline,
        experience:   inputs.experience,
        location:     inputs.location,
        current_rate: rate,
        ...(state ? { state } : {}),
      });
      setRateLogged(true);
    } catch (_) { /* silent */ }
  };

  const handleCurrentRateBlur = () => logCurrentRate(currentRate ?? 0, currentRateState);
  const handleStateChange = (state: USState | "") => {
    setCurrentRateState(state);
    setRateLogged(false); // re-log with state included
    if (currentRate) logCurrentRate(currentRate, state);
  };

  const set = <K extends keyof CalcInputs>(key: K, value: CalcInputs[K]) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "4rem 1.5rem 6rem" }}>

      {/* Header */}
      <div className="fade-in" style={{ marginBottom: "4rem" }}>
        <div style={{ fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "0.75rem" }}>
          The Rate Guide
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", fontFamily: "var(--serif)", fontWeight: 700, lineHeight: 1.1, marginBottom: "0.5rem" }}>
          Know your rate.
        </h1>
        <h2 style={{ fontSize: "0.85rem", fontFamily: "var(--mono)", fontWeight: 400, color: "var(--text-dim)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1rem" }}>
          Freelance Day Rate Calculator
        </h2>
        <p style={{ color: "var(--text-dim)", fontSize: "0.85rem", lineHeight: 1.7, marginBottom: "0.75rem" }}>
          This calculator shows the math, every line, every reason. No guessing. No apology.{" "}
          <a href="/methodology" style={{ color: "var(--accent)", textDecoration: "none", borderBottom: "1px solid var(--accent)" }}>
            How we calculate it →
          </a>
        </p>
        {/* Trust signal — live count from calc_events */}
        {calcCount !== null && calcCount > 50 && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", padding: "0.35rem 0.85rem", border: "1px solid var(--border)", borderRadius: "4px", background: "rgba(212,146,10,0.05)" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", display: "inline-block", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", color: "var(--text-dim)", letterSpacing: "0.04em" }}>
              {calcCount.toLocaleString()} rates calculated by DPs, editors, producers, and more
            </span>
          </div>
        )}
        {/* Descriptive paragraph — crawlable by search engines, surfaces all disciplines and use cases */}
        <p style={{ color: "var(--text-dim)", fontSize: "0.78rem", lineHeight: 1.8, maxWidth: "540px", opacity: 0.7 }}>
          A free day rate calculator for cinematographers, DPs, video editors, colorists, motion designers,
          producers, and camera operators. Enter your take-home goal and we&apos;ll calculate the freelance
          day rate you need to cover self-employment tax, health insurance, and a profit margin — then check
          it against real market floors for your experience level and location.
        </p>
      </div>

      {/* ── STEP 1: Profile ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em" }}>01</span>
        <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-dim)" }}>Your Profile</span>
      </div>
      <div className="fade-in-stagger" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

        <div>
          <Label>What do you do?</Label>
          <select
            value={inputs.discipline}
            onChange={(e) => set("discipline", e.target.value as Discipline)}
            style={{
              background:   "var(--surface)",
              border:       "1px solid var(--border)",
              borderRadius: "4px",
              color:        "var(--text)",
              fontFamily:   "var(--mono)",
              fontSize:     "0.85rem",
              padding:      "0.65rem 1rem",
              width:        "100%",
              cursor:       "pointer",
            }}
          >
            {DISCIPLINES.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>

        <div>
          <Label>Experience level</Label>
          <RadioGroup options={EXPERIENCE_LEVELS} value={inputs.experience} onChange={(v) => set("experience", v)} />
        </div>

        <div>
          <Label>Market</Label>
          <RadioGroup options={LOCATION_TIERS} value={inputs.location} onChange={(v) => set("location", v)} />
          <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", marginTop: "0.5rem", lineHeight: 1.6 }}>
            Major (LA, NYC, Chicago, Miami) · Mid (Austin, Denver, Atlanta, Seattle) · Small (regional cities, rural)
          </div>
        </div>

      </div>

      {/* ── STEP 2: Market snapshot — renders immediately from profile ── */}
      <MarketRangePanel inputs={inputs} dayRate={currentRate ?? undefined} rateLabel="Your current rate" />

      {/* Current rate input — primary CTA */}
      <div style={{ marginTop: "1.75rem" }}>
        <div style={{ fontSize: "0.78rem", color: "var(--text-dim)", lineHeight: 1.7, marginBottom: "1.25rem", fontFamily: "var(--serif)" }}>
          Enter your current rate to see where you stand — or skip ahead and set an income goal to find out what you should be charging.
        </div>
        <Label>What are you currently charging?</Label>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontFamily: "var(--mono)", color: "var(--text-dim)" }}>$</span>
          <input
            type="number"
            min="0"
            placeholder="e.g. 450"
            value={currentRateRaw}
            onChange={e => {
              const raw = e.target.value;
              setCurrentRateRaw(raw);
              setRateLogged(false);
              const n = Number(raw);
              setCurrentRate(n > 0 ? n : null);
            }}
            onBlur={handleCurrentRateBlur}
            style={{
              background:   "var(--surface)",
              border:       "1px solid var(--border)",
              borderRadius: "4px",
              color:        "var(--text)",
              fontFamily:   "var(--mono)",
              fontSize:     "1rem",
              padding:      "0.65rem 1rem",
              width:        "180px",
            }}
          />
          <span style={{ fontFamily: "var(--mono)", color: "var(--text-dim)", fontSize: "0.8rem" }}>/day</span>
        </div>
        <div style={{ marginTop: "0.75rem" }}>
          <select
            value={currentRateState}
            onChange={e => handleStateChange(e.target.value as USState | "")}
            style={{
              background:   "var(--surface)",
              border:       "1px solid var(--border)",
              borderRadius: "4px",
              color:        currentRateState ? "var(--text)" : "var(--text-dim)",
              fontFamily:   "var(--mono)",
              fontSize:     "0.85rem",
              padding:      "0.55rem 1rem",
              width:        "220px",
              cursor:       "pointer",
            }}
          >
            <option value="">State (optional)</option>
            {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", marginTop: "0.4rem" }}>
          Optional — updates the market range above and helps us build community averages.
        </div>
      </div>

      {/* ── Reality check: what your current rate actually earns ── */}
      {currentRate !== null && currentRate > 0 && (() => {
        const earnings = currentEarnings(currentRate, currentBillableDays, inputs.location);
        return (
          <div style={{ marginTop: "2rem", padding: "1.75rem 2rem", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "4px" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "1.5rem" }}>
              At {fmt(currentRate)}/day — what you actually take home
            </div>

            {/* Billable days slider */}
            <div style={{ marginBottom: "1.75rem" }}>
              <Label>How many days do you realistically bill per year? — <span style={{ color: "var(--text)" }}>{currentBillableDays} days</span></Label>
              <input
                type="range" min={50} max={220} step={5}
                value={currentBillableDays}
                onChange={e => setCurrentBillableDays(Number(e.target.value))}
                className="gold-slider"
                style={{
                  width:      "100%",
                  background: `linear-gradient(to right, var(--accent) ${((currentBillableDays - 50) / (220 - 50)) * 100}%, var(--border) ${((currentBillableDays - 50) / (220 - 50)) * 100}%)`,
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "0.25rem" }}>
                <span>50 days</span><span>220 days</span>
              </div>
            </div>

            {/* Deduction breakdown */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              {([
                { label: "Gross annual",                                                          value: earnings.grossAnnual,     dim: false, minus: false },
                { label: `SE tax (${(SE_TAX_RATE * 100).toFixed(1)}%)`,                          value: earnings.seTax,           dim: true,  minus: true  },
                { label: "Health insurance",                                                      value: earnings.healthInsurance, dim: true,  minus: true  },
                { label: `Federal income tax (~${Math.round(earnings.federalTaxRate * 100)}%)`,   value: earnings.federalTax,      dim: true,  minus: true  },
                { label: `State income tax (~${Math.round(earnings.stateTaxRate * 100)}%)`,       value: earnings.stateTax,        dim: true,  minus: true  },
              ] as { label: string; value: number; dim: boolean; minus: boolean }[]).map(({ label, value, dim, minus }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontFamily: "var(--mono)", fontSize: "0.85rem" }}>
                  <span style={{ color: "var(--text-dim)" }}>{label}</span>
                  <span style={{ color: dim ? "var(--danger)" : "var(--text)" }}>
                    {minus ? `−${fmt(value)}` : fmt(value)}
                  </span>
                </div>
              ))}

              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "0.85rem", marginTop: "0.35rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--mono)", fontSize: "1.05rem", fontWeight: "bold" }}>
                  <span style={{ color: "var(--text)" }}>Actual take-home</span>
                  <span style={{ color: earnings.netTakeHome < 45000 ? "var(--danger)" : "var(--accent)" }}>
                    {fmt(earnings.netTakeHome)}/yr
                  </span>
                </div>
                <div style={{ textAlign: "right", fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "0.3rem" }}>
                  {fmt(earnings.netTakeHome / 12)}/month
                </div>
              </div>

              {/* State cost of living comparison */}
              {currentRateState && (() => {
                const col     = STATE_ANNUAL_COL[currentRateState];
                const surplus = earnings.netTakeHome - col;
                const covers  = surplus >= 0;
                return (
                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "0.85rem", marginTop: "0.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontFamily: "var(--mono)", fontSize: "0.85rem" }}>
                      <span style={{ color: "var(--text-dim)" }}>Avg. cost of living in {currentRateState}</span>
                      <span style={{ color: "var(--text-dim)", textAlign: "right" }}>
                        {fmt(col)}/yr
                        <span style={{ fontSize: "0.65rem", opacity: 0.6, marginLeft: "0.5rem" }}>MIT Living Wage</span>
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--mono)", fontSize: "0.85rem", marginTop: "0.4rem" }}>
                      <span style={{ color: "var(--text-dim)" }}>{covers ? "Surplus after expenses" : "Shortfall vs. expenses"}</span>
                      <span style={{ color: covers ? "var(--accent)" : "var(--danger)", fontWeight: "bold" }}>
                        {covers ? "+" : "−"}{fmt(Math.abs(surplus))}/yr
                      </span>
                    </div>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-dim)", marginTop: "0.5rem", lineHeight: 1.5, opacity: 0.7 }}>
                      Single adult, no children. livewage.mit.edu
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        );
      })()}

      {/* ── STEP 3: Income calculator — collapsible ── */}
      <div style={{ marginTop: "3rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", borderTop: "1px solid var(--accent-2)", paddingTop: "2rem" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em" }}>02</span>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-dim)" }}>Income Goal</span>
        </div>


        {/* Toggle */}
        <button
          onClick={() => setShowIncomeCalc(v => !v)}
          style={{
            background:    "none",
            border:        "none",
            cursor:        "pointer",
            display:       "flex",
            alignItems:    "center",
            gap:           "0.6rem",
            padding:       0,
            fontFamily:    "var(--mono)",
            fontSize:      "0.75rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color:         "var(--accent)",
          }}
        >
          <span style={{ fontSize: "1rem", lineHeight: 1, transform: showIncomeCalc ? "rotate(90deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>›</span>
          {showIncomeCalc ? "Hide income goal calculator" : "What should I charge to hit a goal?"}
        </button>

        {showIncomeCalc && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginTop: "1.75rem" }}>

            <div>
              <Label>Desired annual take-home</Label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)", fontFamily: "var(--mono)" }}>$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={takeHomeRaw}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    setTakeHomeRaw(raw);
                    const n = Number(raw);
                    if (n > 0) set("takeHome", n);
                  }}
                  onBlur={() => setTakeHomeRaw(String(inputs.takeHome))}
                  style={{
                    background:   "var(--surface)",
                    border:       "1px solid var(--border)",
                    borderRadius: "4px",
                    color:        "var(--text)",
                    fontFamily:   "var(--mono)",
                    fontSize:     "0.95rem",
                    padding:      "0.65rem 1rem 0.65rem 2rem",
                    width:        "100%",
                  }}
                />
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "0.4rem" }}>
                What you want in your pocket after taxes and expenses.
              </div>
            </div>

            {/* ZIP code — fetches real ACA Silver plan premium for their area */}
            <div>
              <Label>Your ZIP code <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "var(--text-dim)" }}>(optional — for accurate health insurance cost)</span></Label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={5}
                  placeholder="e.g. 90210"
                  value={zipRaw}
                  onChange={e => {
                    const v = e.target.value.replace(/[^0-9]/g, "");
                    setZipRaw(v);
                    if (zipLookupStatus !== "idle") setZipLookupStatus("idle");
                    setZipPremiumData(null);
                  }}
                  onBlur={() => {
                    if (zipRaw.length === 5) fetchHealthPremium(zipRaw);
                  }}
                  style={{
                    background:   "var(--surface)",
                    border:       `1px solid ${zipLookupStatus === "error" ? "var(--danger)" : zipLookupStatus === "ok" ? "var(--accent)" : zipLookupStatus === "no-key" ? "var(--border)" : "var(--border)"}`,
                    borderRadius: "4px",
                    color:        "var(--text)",
                    fontFamily:   "var(--mono)",
                    fontSize:     "0.95rem",
                    padding:      "0.65rem 1rem",
                    width:        "140px",
                  }}
                />
                {zipLookupStatus === "loading" && (
                  <span style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--text-dim)" }}>Looking up…</span>
                )}
                {zipLookupStatus === "ok" && zipPremiumData && (
                  <span style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", color: "var(--accent)" }}>
                    {zipPremiumData.county}, {zipPremiumData.state} — avg Silver plan ${zipPremiumData.avgMonthlyPremium}/mo
                  </span>
                )}
                {zipLookupStatus === "error" && (
                  <span style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--danger)" }}>No plans found for this ZIP — using national average</span>
                )}
                {zipLookupStatus === "no-key" && (
                  <span style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--text-dim)" }}>ZIP lookup coming soon — using national average for now</span>
                )}
              </div>
              {zipLookupStatus !== "ok" && (
                <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "0.4rem" }}>
                  Without a ZIP we use the national average of ${HEALTH_INSURANCE_ANNUAL.toLocaleString()}/yr. Your actual cost may vary significantly.
                </div>
              )}
            </div>

            <div>
              <Label>Estimated billable days / year — <span style={{ color: "var(--text)" }}>{inputs.billableDays} days</span></Label>
              <input
                type="range"
                min={50} max={220} step={5}
                value={inputs.billableDays}
                onChange={(e) => set("billableDays", Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent)", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "0.25rem" }}>
                <span>50 days</span><span>220 days</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {([
                { key: "hasKit" as const, label: "I carry a kit (+$300/day)" },
                { key: "includeProfit" as const, label: "Include profit margin (20%)" },
              ]).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => set(key, !inputs[key])}
                  style={{
                    background:    inputs[key] ? "rgba(212,146,10,0.12)" : "transparent",
                    color:         "var(--accent)",
                    border:        `1px solid ${inputs[key] ? "var(--accent)" : "rgba(212,146,10,0.35)"}`,
                    fontFamily:    "var(--mono)",
                    fontSize:      "0.83rem",
                    letterSpacing: "0.04em",
                    padding:       "0.45rem 0.9rem",
                    borderRadius:  "4px",
                    cursor:        "pointer",
                    transition:    "all 0.15s",
                  }}
                >
                  {inputs[key] ? "✓ " : ""}{label}
                </button>
              ))}
            </div>

            {/* Calculate + Reset buttons */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={async () => {
                  const r = calculate({ ...inputs, healthInsurance: healthInsuranceAnnual });
                  setResults(r);

                  track("calculate", {
                    discipline: inputs.discipline,
                    experience: inputs.experience,
                    location:   inputs.location,
                  });

                  try {
                    const supabase = createClient();
                    await supabase.from("calc_events").insert({
                      discipline:    inputs.discipline,
                      experience:    inputs.experience,
                      location:      inputs.location,
                      day_rate:      Math.round(r.dayRate),
                      below_floor:   r.belowFloor,
                      has_kit:       inputs.hasKit,
                      billable_days: inputs.billableDays,
                    });
                  } catch (_) { /* silent */ }
                }}
                style={{
                  flex:          1,
                  padding:       "1rem",
                  background:    "var(--accent)",
                  color:         "#000",
                  fontFamily:    "var(--mono)",
                  fontSize:      "0.85rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  border:        "none",
                  borderRadius:  "4px",
                  cursor:        "pointer",
                  fontWeight:    "bold",
                }}
              >
                Calculate My Rate
              </button>

              {results && (
                <button
                  onClick={() => {
                    setResults(null);
                    setCurrentRate(null);
                    setCurrentRateRaw("");
                    setTakeHomeRaw("");
                    setInputs({
                      discipline:    "Cinematographer / DP",
                      experience:    "Mid",
                      location:      "Mid Market",
                      takeHome:      0,
                      billableDays:  DEFAULT_BILLABLE_DAYS,
                      hasKit:        false,
                      includeProfit: true,
                    });
                    router.replace("/", { scroll: false });
                  }}
                  style={{
                    padding:        "1rem 1.25rem",
                    background:     "none",
                    border:         "1px solid var(--border)",
                    borderRadius:   "4px",
                    color:          "var(--text-dim)",
                    fontFamily:     "var(--mono)",
                    fontSize:       "0.72rem",
                    letterSpacing:  "0.15em",
                    textTransform:  "uppercase",
                    cursor:         "pointer",
                    whiteSpace:     "nowrap",
                  }}
                >
                  Reset
                </button>
              )}
            </div>

          </div>
        )}
      </div>

      {results && <Results results={results} inputs={inputs} currentRate={currentRate} zipCounty={zipPremiumData ? `${zipPremiumData.county}, ${zipPremiumData.state}` : null} />}
    </div>
  );
}

// ==============================================
// STRUCTURED DATA (JSON-LD)
// Two schemas:
//   1. WebApplication — tells Google this is a tool
//   2. FAQPage — targets "People Also Ask" results
//      for the exact questions freelancers search
// ==============================================
function StructuredData() {
  const appSchema = {
    "@context":          "https://schema.org",
    "@type":             "WebApplication",
    "name":              "The Rate Guide — Freelance Day Rate Calculator",
    "url":               "https://therateguide.com",
    "description":       "Free day rate calculator for creative freelancers. Enter your take-home goal and calculate the day rate you need to cover self-employment tax, health insurance, and profit margin — then see where you fall in the market.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem":   "Web",
    "offers": {
      "@type":         "Offer",
      "price":         "0",
      "priceCurrency": "USD",
    },
    "audience": {
      "@type":        "Audience",
      "audienceType": "Creative freelancers — cinematographers, DPs, video editors, colorists, motion designers, producers, camera operators",
    },
  };

  // FAQ schema targets "People Also Ask" boxes in Google results.
  // Each question matches a real search query pattern.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type":    "FAQPage",
    "mainEntity": [
      {
        "@type":          "Question",
        "name":           "How do I calculate my freelance day rate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":  "Start with your annual take-home goal, add health insurance (~$7,400/year for an individual), then add self-employment tax (15.3%), and an optional 20% profit margin. Divide the total by your estimated billable days (typically 100–175/year). This gives the day rate you need to break even and build a sustainable business.",
        },
      },
      {
        "@type":          "Question",
        "name":           "How much should a freelance cinematographer or DP charge per day?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":  "Freelance cinematographer (DP) day rates typically range from $500–$800/day for emerging-level, $800–$1,400/day for mid-level, $1,200–$2,000/day for senior, and $1,500–$3,000/day for expert-level DPs. Rates increase by roughly 30% in major markets like New York or Los Angeles.",
        },
      },
      {
        "@type":          "Question",
        "name":           "What is a fair day rate for a freelance video editor?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":  "Freelance video editor day rates generally range from $350–$550/day for emerging editors, $550–$900/day mid-level, $750–$1,400/day senior, and $1,000–$2,000/day for expert editors. Rates vary by market — major markets like LA and NYC command a 30% premium over the national baseline.",
        },
      },
      {
        "@type":          "Question",
        "name":           "How much does a freelance colorist charge per day?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":  "Freelance colorist day rates range from $400–$650/day for emerging colorists up to $900–$2,500/day for expert colorists. Colorists who own a DaVinci Resolve Studio suite or work in specialized genres (narrative, commercial) typically command higher rates.",
        },
      },
      {
        "@type":          "Question",
        "name":           "What should a freelance motion designer charge per day?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":  "Freelance motion designer day rates range from $350–$600/day for emerging designers to $850–$2,200/day for expert motion designers. Rates depend on software specialization (After Effects, Cinema 4D, Houdini), client type (agency, brand, broadcast), and market.",
        },
      },
      {
        "@type":          "Question",
        "name":           "Why do freelancers need to charge more than salaried employees?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":  "Freelancers pay both the employee and employer halves of Social Security and Medicare taxes — a 15.3% self-employment tax that salaried workers split with their employer. Freelancers also pay their own health insurance (often $600–$1,800/month), have no paid time off, and must cover slow periods with revenue from billable days. These costs must be built into the day rate to break even.",
        },
      },
      {
        "@type":          "Question",
        "name":           "How many billable days per year does a freelancer actually work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":  "Most full-time freelancers bill between 100 and 175 days per year. The rest is spent on unpaid administrative work, business development, travel, invoicing, taxes, and seasonal slowdowns. 150 days is a common realistic estimate for an established freelancer.",
        },
      },
      {
        "@type":          "Question",
        "name":           "How does location affect freelance day rates?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":  "Major markets like New York, Los Angeles, and Chicago typically pay 25–35% more than national baseline rates due to higher cost of living and denser production markets. Mid-sized markets approximate the national baseline, while smaller markets are typically 10–20% below.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}

// Suspense required for useSearchParams in Next.js App Router
export default function Page() {
  return (
    <>
      <StructuredData />
      <Suspense>
        <Calculator />
      </Suspense>
    </>
  );
}
