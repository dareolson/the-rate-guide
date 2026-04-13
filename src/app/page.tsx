"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { track } from "@vercel/analytics";          // custom event tracking
import { createClient } from "@/lib/supabase/client"; // anonymous DB logging
import {
  DISCIPLINES, EXPERIENCE_LEVELS, LOCATION_TIERS, FAMILY_SIZES,
  DEFAULT_BILLABLE_DAYS, calculate, realityCheck, marketRange, fmt,
  INFLATION_BASE_YEAR, RATE_FLOORS, LOCATION_MULTIPLIERS,
  HEALTH_INSURANCE_ANNUAL, SE_TAX_RATE, PROFIT_RATE,
  type Discipline, type ExperienceLevel, type LocationTier, type FamilySize,
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
      fontFamily: "var(--mono)",
      fontSize: "0.7rem",
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: "var(--text-dim)",
      marginBottom: "0.6rem",
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
            background: value === opt ? "var(--accent)" : "transparent",
            color: value === opt ? "#000" : "var(--text-dim)",
            border: `1px solid ${value === opt ? "var(--accent)" : "var(--border)"}`,
            fontFamily: "var(--mono)",
            fontSize: "0.72rem",
            letterSpacing: "0.1em",
            padding: "0.45rem 0.9rem",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
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
        <div style={{ fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "0.25rem" }}>{label}</div>
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
          Every line item reflects a real cost — not a preference.
        </p>
      </div>

      {/* The rate */}
      <div style={{ borderTop: "2px solid var(--accent)", paddingTop: "2rem", marginBottom: "2.5rem" }}>
        <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "0.5rem" }}>
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
              <div style={{ fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "0.25rem" }}>{label}</div>
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
        <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "1.25rem" }}>
          What this rate covers
        </div>

        {row(
          "Self-employment tax",
          `${seTaxPct}%`,
          `Freelancers pay both the employer and employee sides of Social Security and Medicare — ${seTaxPct}% of gross income. A salaried employee's employer absorbs half this cost invisibly. Freelancers absorb it entirely.`
        )}
        {row(
          "Health insurance",
          `~${fmt(HEALTH_INSURANCE_ANNUAL)}/yr`,
          `Without employer-sponsored coverage, freelancers purchase individual health insurance on the open market. The 2026 ACA marketplace average for an individual is approximately ${fmt(HEALTH_INSURANCE_ANNUAL)} per year before subsidies.`
        )}
        {row(
          "Operating margin",
          `${profitPct}%`,
          `A ${profitPct}% operating margin is standard practice for professional service businesses. It covers equipment maintenance, dry periods between projects, professional development, and the administrative cost of running an independent business.`
        )}
        {row(
          "Billable days",
          "~150/yr",
          `Freelancers do not bill 260 days a year. Time is lost to project sourcing, proposal writing, invoicing, travel, equipment prep, and the unavoidable gaps between engagements. 150 billable days is the realistic industry standard.`
        )}
      </div>

      {/* Footer links */}
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        <a href="/methodology" style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", textDecoration: "none" }}>
          Full methodology with sources →
        </a>
        <a href="/" style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-dim)", textDecoration: "none" }}>
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
  const leftOverColor = rc.leftOver < 300
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
    <div style={{ marginTop: "3rem", borderTop: "2px solid var(--border)", paddingTop: "2rem" }}>
      <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "0.5rem" }}>
        Reality Check
      </div>
      <h2 style={{ fontSize: "1.4rem", fontFamily: "var(--mono)", marginBottom: "0.75rem", lineHeight: 1.2 }}>
        What does this actually buy you?
      </h2>

      {/* Inflation context */}
      <p style={{ fontFamily: "var(--serif)", fontSize: "0.88rem", color: "var(--text-dim)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
        In {INFLATION_BASE_YEAR} dollars, your {fmt(rc.monthlyTakeHome * 12)} take-home goal
        has the purchasing power of <strong style={{ color: "var(--text)" }}>{fmt(rc.in2019Dollars)}</strong>.
        Inflation didn&apos;t wait for your rate to catch up.
      </p>

      {/* Family size selector */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "0.6rem" }}>
          Household size
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {FAMILY_SIZES.map((f) => (
            <button key={f} onClick={() => onFamilySizeChange(f)} style={{
              background:    familySize === f ? "var(--accent)" : "transparent",
              color:         familySize === f ? "#000" : "var(--text-dim)",
              border:        `1px solid ${familySize === f ? "var(--accent)" : "var(--border)"}`,
              fontFamily:    "var(--mono)",
              fontSize:      "0.7rem",
              letterSpacing: "0.08em",
              padding:       "0.4rem 0.8rem",
              cursor:        "pointer",
            }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Monthly breakdown */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "0.75rem" }}>
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
        {rc.childcare > 0 && row("Childcare",  fmt(rc.childcare),  true)}
        {row("Savings (recommended)", fmt(rc.savings),      true)}
      </div>

      {/* What's left */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1rem 1.2rem", background: "var(--surface)",
        borderLeft: `3px solid ${leftOverColor}`, flexWrap: "wrap", gap: "1rem",
      }}>
        <div>
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "0.2rem" }}>
            Left over after all expenses
          </div>
          <div style={{ fontFamily: "var(--serif)", fontSize: "0.8rem", color: "var(--text-dim)", lineHeight: 1.5 }}>
            {rc.leftOver < 0
              ? "This take-home goal doesn't cover your expenses. You need a higher rate."
              : rc.leftOver < 300
              ? "This isn't a living wage. It's survival mode."
              : rc.leftOver < 800
              ? "Almost no cushion. One bad month and you're in trouble."
              : "Some breathing room — but not much margin for the unexpected."}
          </div>
        </div>
        <div style={{ fontFamily: "var(--mono)", fontSize: "2rem", color: leftOverColor, whiteSpace: "nowrap" }}>
          {rc.leftOver < 0 ? "−" : ""}{fmt(Math.abs(rc.leftOver))}/mo
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
// ==============================================
function MarketRangePanel({ results, inputs }: { results: CalcResults; inputs: CalcInputs }) {
  const mr = marketRange(inputs.discipline, inputs.experience, inputs.location, results.dayRate);

  // Position label and color
  const config = {
    below: { label: "Below market",       color: "var(--danger)",  message: "Your rate is below the floor for your discipline and market. This isn't humility — it's leaving money on the table." },
    low:   { label: "Low end of market",  color: "#f5a623",        message: "You're in the market but on the lower end. There's meaningful room to grow without pricing yourself out." },
    mid:   { label: "Mid market",         color: "var(--accent)",  message: "Your rate is solid and defensible. You're where working professionals at your level typically land." },
    high:  { label: "High end of market", color: "var(--accent)",  message: "You're commanding a strong rate. This is where well-positioned, in-demand professionals operate." },
    above: { label: "Above market",       color: "var(--text-dim)", message: "Your rate is above the typical ceiling. Make sure your credits and reputation can support it — or reconsider your take-home goal." },
  }[mr.position];

  // Bar width clamped to 4–96% so it never touches the edges
  const barWidth = Math.min(Math.max(mr.percentile, 4), 96);

  return (
    <div style={{ marginTop: "3rem", borderTop: "2px solid var(--border)", paddingTop: "2rem" }}>
      <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "0.5rem" }}>
        Market Context
      </div>
      <h2 style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: "1.3rem", marginBottom: "0.5rem", lineHeight: 1.2 }}>
        Where does your rate land?
      </h2>
      <p style={{ fontFamily: "var(--serif)", fontSize: "0.88rem", color: "var(--text-dim)", lineHeight: 1.7, marginBottom: "1.75rem" }}>
        Based on 2024–2025 market data for a <strong style={{ color: "var(--text)" }}>{inputs.experience} {inputs.discipline}</strong> in a <strong style={{ color: "var(--text)" }}>{inputs.location}</strong>.
      </p>

      {/* Position label */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.6rem" }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", color: config.color, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {config.label}
        </span>
        <span style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", color: "var(--text-dim)" }}>
          {fmt(mr.floor)} — {fmt(mr.ceiling)}
        </span>
      </div>

      {/* Range bar */}
      <div style={{ position: "relative", height: "6px", background: "var(--border)", marginBottom: "0.5rem" }}>
        {/* Filled portion */}
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${barWidth}%`, background: config.color, transition: "width 0.4s ease" }} />
        {/* Marker dot */}
        <div style={{ position: "absolute", top: "50%", left: `${barWidth}%`, transform: "translate(-50%, -50%)", width: "14px", height: "14px", borderRadius: "50%", background: config.color, border: "2px solid var(--bg)" }} />
      </div>

      {/* Floor / ceiling labels */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <span style={{ fontSize: "0.65rem", color: "var(--text-dim)", fontFamily: "var(--mono)" }}>Floor</span>
        <span style={{ fontSize: "0.65rem", color: "var(--text-dim)", fontFamily: "var(--mono)" }}>Ceiling</span>
      </div>

      {/* Contextual message */}
      <p style={{ fontFamily: "var(--serif)", fontSize: "0.88rem", color: "var(--text-dim)", lineHeight: 1.75, borderLeft: `3px solid ${config.color}`, paddingLeft: "1rem" }}>
        {config.message}
      </p>

      {/* Future: community median note */}
      <p style={{ fontSize: "0.68rem", color: "var(--text-dim)", marginTop: "1rem", lineHeight: 1.6, fontStyle: "italic" }}>
        Range based on industry rate surveys and union data. As more users calculate their rates, we&apos;ll show real community medians here.
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
    background:    active ? "var(--accent)" : "var(--surface)",
    color:         active ? "#000" : "var(--text-dim)",
    border:        `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
    fontFamily:    "var(--sans)",
    fontSize:      "0.82rem",
    padding:       "0.65rem 1rem",
    cursor:        "pointer",
    textAlign:     "left" as const,
    lineHeight:    1.4,
    transition:    "all 0.15s",
  });

  return (
    <div style={{ marginTop: "3rem", borderTop: "2px solid var(--border)", paddingTop: "2rem" }}>
      <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "0.5rem" }}>
        Quick question
      </div>

      {/* Submitted state */}
      {submitted ? (
        <div>
          <p style={{ fontFamily: "var(--serif)", fontSize: "1rem", color: "var(--text)", lineHeight: 1.7 }}>
            Thanks for sharing. Every response helps us show the world what freelancers are really worth.
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
// RESULTS PANEL
// ==============================================
function Results({ results, inputs }: { results: CalcResults; inputs: CalcInputs }) {
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
    <div style={{ marginTop: "3rem" }}>

      {/* Main rate */}
      <div style={{ borderTop: "2px solid var(--accent)", paddingTop: "2rem", marginBottom: "2rem" }}>
        <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "0.5rem" }}>
          Your Fair Day Rate
        </div>
        <div style={{ fontSize: "clamp(3rem, 8vw, 5rem)", fontFamily: "var(--mono)", lineHeight: 1, color: "var(--accent)" }}>
          {fmt(results.dayRate)}
        </div>
        <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "0.5rem", letterSpacing: "0.08em" }}>
          Here&apos;s exactly how we got there — and why every line matters.
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
          Hold on. Your calculated rate of {fmt(results.dayRate)}/day falls below the market floor
          of {fmt(results.rateFloor)}/day for a {inputs.experience} {inputs.discipline} in a {inputs.location}.
          Consider adjusting your inputs — or charge the floor rate. You earned it.
        </div>
      )}

      {/* Line-by-line breakdown */}
      <div>
        {[
          {
            label: "Take-Home Goal",
            amount: `${fmt(results.takeHome)}/yr`,
            note: "This is what you want in your pocket after everything. You deserve to name this number without apology.",
          },
          {
            label: "+ Health Insurance",
            amount: `${fmt(results.healthInsurance)}/yr`,
            note: "Salaried employees get this as a benefit. You pay for it yourself. Most freelancers forget to factor this in — don't be most freelancers.",
          },
          {
            label: "+ Self-Employment Tax",
            amount: `${fmt(results.seTax)}/yr`,
            note: "When you work for a company, they cover half your Social Security and Medicare taxes. When you're freelance, you pay both sides. That's an extra 15.3% on top of your income tax.",
          },
          ...(results.profit > 0 ? [{
            label: "+ Profit Margin (20%)",
            amount: `${fmt(results.profit)}/yr`,
            note: "This isn't greed. This is what covers your slow months, equipment repairs, continued education, and your ability to grow. No margin means one bad month wipes you out.",
          }] : []),
          {
            label: `÷ ${results.billableDays} Billable Days`,
            amount: `${results.billableDays} days/yr`,
            note: `${results.billableDays} days sounds like a lot. That's roughly ${(results.billableDays / 52).toFixed(1)} days per week on average — the rest is spent on unpaid admin, marketing, travel, chasing invoices, and the slow seasons every freelancer knows too well.`,
            last: true,
          },
        ].map(({ label, amount, note, last }) => (
          <div key={label} style={{ ...lineStyle, ...(last ? { borderBottom: "2px solid var(--accent)" } : {}) }}>
            <div>
              <div style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-dim)" }}>{label}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", lineHeight: 1.6, maxWidth: "420px", marginTop: "0.3rem" }}>{note}</div>
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "1rem", color: "var(--text)", whiteSpace: "nowrap", textAlign: "right" }}>{amount}</div>
          </div>
        ))}
      </div>

      {/* Rate card */}
      <div style={{
        marginTop: "2rem",
        padding: "1.5rem",
        background: "var(--surface)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1.25rem 2rem",
      }}>
        {[
          ["Day Rate",  fmt(results.dayRate)],
          ["Half-Day",  fmt(results.halfDayRate)],
          ["Hourly",    fmt(results.hourlyRate)],
          ...(results.kitFee > 0 ? [["Kit Fee", `${fmt(results.kitFee)}/day`]] : []),
        ].map(([label, value]) => (
          <div key={label}>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "0.25rem" }}>{label}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "1.4rem", color: "var(--text)" }}>{value}</div>
          </div>
        ))}
      </div>

      <ShareButton inputs={inputs} results={results} />

      <MarketRangePanel results={results} inputs={inputs} />

      <RealityCheck
        rc={rc}
        location={inputs.location}
        familySize={familySize}
        onFamilySizeChange={setFamilySize}
      />

      <Survey inputs={inputs} />
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
    takeHome:      urlInputs.takeHome      ?? 60000,
    billableDays:  urlInputs.billableDays  ?? DEFAULT_BILLABLE_DAYS,
    hasKit:        urlInputs.hasKit        ?? false,
    includeProfit: urlInputs.includeProfit ?? true,
  });

  const [results, setResults] = useState<CalcResults | null>(null);

  // Sync inputs to URL whenever they change
  useEffect(() => {
    const params = inputsToParams(inputs);
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [inputs, router]);

  // Auto-calculate if URL had params on load (shared link)
  useEffect(() => {
    if (searchParams.toString()) setResults(calculate(inputs));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = <K extends keyof CalcInputs>(key: K, value: CalcInputs[K]) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "4rem 1.5rem 6rem" }}>

      {/* Header */}
      <div style={{ marginBottom: "3.5rem" }}>
        <div style={{ fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "0.75rem" }}>
          The Rate Guide
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", fontFamily: "var(--mono)", lineHeight: 1.1, marginBottom: "1rem" }}>
          Know your rate.<br />Stop undercharging.
        </h1>
        <p style={{ color: "var(--text-dim)", fontSize: "0.85rem", lineHeight: 1.7 }}>
          This calculator shows the math — every line, every reason. No guessing. No apology.{" "}
          <a href="/methodology" style={{ color: "var(--accent)", textDecoration: "none", borderBottom: "1px solid var(--accent)" }}>
            How we calculate it →
          </a>
        </p>
      </div>

      {/* Form */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

        <div>
          <Label>What do you do?</Label>
          <select
            value={inputs.discipline}
            onChange={(e) => set("discipline", e.target.value as Discipline)}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              fontFamily: "var(--mono)",
              fontSize: "0.85rem",
              padding: "0.65rem 1rem",
              width: "100%",
              cursor: "pointer",
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
        </div>

        <div>
          <Label>Desired annual take-home</Label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)", fontFamily: "var(--mono)" }}>$</span>
            <input
              type="number"
              value={inputs.takeHome}
              onChange={(e) => set("takeHome", Number(e.target.value))}
              min={0}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text)",
                fontFamily: "var(--mono)",
                fontSize: "0.95rem",
                padding: "0.65rem 1rem 0.65rem 2rem",
                width: "100%",
              }}
            />
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "0.4rem" }}>
            What you want in your pocket after taxes and expenses.
          </div>
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
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", color: "var(--text-dim)", marginTop: "0.25rem" }}>
            <span>50 days</span><span>220 days</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          {([
            { key: "hasKit" as const, label: "I carry a kit (+$300/day)" },
            { key: "includeProfit" as const, label: "Include profit margin (20%)" },
          ]).map(({ key, label }) => (
            <label key={key} style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", fontSize: "0.8rem", color: "var(--text-dim)" }}>
              <input
                type="checkbox"
                checked={inputs[key]}
                onChange={(e) => set(key, e.target.checked)}
                style={{ accentColor: "var(--accent)", width: "1rem", height: "1rem", cursor: "pointer" }}
              />
              {label}
            </label>
          ))}
        </div>

        {/* Calculate + Reset buttons */}
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={async () => {
            const r = calculate(inputs);
            setResults(r);

            // Track custom event in Vercel Analytics
            track("calculate", {
              discipline: inputs.discipline,
              experience: inputs.experience,
              location:   inputs.location,
            });

            // Log anonymous calculation to Supabase for aggregate market data
            // Does NOT store take-home goal — only the computed rate and context
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
            } catch (_) {
              // Logging failure is silent — never block the user experience
            }
          }}
            style={{
              flex: 1,
              padding: "1rem",
              background: "var(--accent)",
              color: "#000",
              fontFamily: "var(--mono)",
              fontSize: "0.85rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Calculate My Rate
          </button>

          {/* Reset — clears results and returns inputs to defaults */}
          {results && (
            <button
              onClick={() => {
                setResults(null);
                setInputs({
                  discipline:    "Cinematographer / DP",
                  experience:    "Mid",
                  location:      "Mid Market",
                  takeHome:      60000,
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

      {results && <Results results={results} inputs={inputs} />}
    </div>
  );
}

// ==============================================
// STRUCTURED DATA (JSON-LD)
// Tells Google this is a web application tool.
// Improves rich result eligibility in search.
// ==============================================
function StructuredData() {
  const schema = {
    "@context":       "https://schema.org",
    "@type":          "WebApplication",
    "name":           "The Rate Guide",
    "url":            "https://therateguide.com",
    "description":    "A free, transparent day rate calculator for creative freelancers. Calculate your fair rate based on take-home goal, self-employment tax, health insurance, and market floors.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "audience": {
      "@type":       "Audience",
      "audienceType": "Creative Freelancers — Cinematographers, Video Editors, Colorists, Motion Designers, Producers, Camera Operators",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
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
