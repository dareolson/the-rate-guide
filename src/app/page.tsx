"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  DISCIPLINES, EXPERIENCE_LEVELS, LOCATION_TIERS,
  DEFAULT_BILLABLE_DAYS, calculate, realityCheck, fmt,
  INFLATION_BASE_YEAR,
  type Discipline, type ExperienceLevel, type LocationTier,
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
// SHARE BUTTON
// ==============================================
function ShareButton({ inputs }: { inputs: CalcInputs }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    const params = inputsToParams(inputs);
    const url = `${window.location.origin}?${params.toString()}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={copy}
      style={{
        marginTop: "1.5rem",
        background: "none",
        border: `1px solid ${copied ? "var(--accent)" : "var(--border)"}`,
        color: copied ? "var(--accent)" : "var(--text-dim)",
        fontFamily: "var(--mono)",
        fontSize: "0.72rem",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        padding: "0.65rem 1.5rem",
        cursor: "pointer",
        transition: "color 0.2s, border-color 0.2s",
        width: "100%",
      }}
    >
      {copied ? "Link Copied ✓" : "Copy Shareable Link ↗"}
    </button>
  );
}

// ==============================================
// REALITY CHECK PANEL
// Shows what the take-home goal actually means
// month-to-month after basic living expenses.
// ==============================================
function RealityCheck({ rc, location }: { rc: RealityCheckResult; location: string }) {
  const leftOverColor = rc.leftOver < 300
    ? "var(--danger)"
    : rc.leftOver < 800
    ? "#f5a623"
    : "var(--text)";

  const row = (label: string, value: string, negative = false, dim = false) => (
    <div key={label} style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "0.7rem 0",
      borderBottom: "1px solid var(--border)",
      fontSize: "0.8rem",
    }}>
      <span style={{ color: dim ? "var(--text-dim)" : "var(--text)" }}>{label}</span>
      <span style={{
        fontFamily: "var(--mono)",
        color: negative ? "var(--danger)" : dim ? "var(--text-dim)" : "var(--text)",
      }}>
        {negative ? "−" : ""}{value}
      </span>
    </div>
  );

  return (
    <div style={{
      marginTop: "3rem",
      borderTop: "2px solid var(--border)",
      paddingTop: "2rem",
    }}>
      <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "0.5rem" }}>
        Reality Check
      </div>
      <h2 style={{ fontSize: "1.4rem", fontFamily: "var(--mono)", marginBottom: "0.5rem", lineHeight: 1.2 }}>
        What does this actually buy you?
      </h2>

      {/* Inflation context */}
      <p style={{ fontSize: "0.78rem", color: "var(--text-dim)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
        In {INFLATION_BASE_YEAR} dollars, your {fmt(rc.monthlyTakeHome * 12)} take-home goal
        has the purchasing power of <strong style={{ color: "var(--text)" }}>{fmt(rc.in2019Dollars)}</strong>.
        Inflation didn&apos;t wait for your rate to catch up.
      </p>

      {/* Monthly breakdown */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "0.75rem" }}>
          Monthly in a {location}
        </div>

        {row("Monthly take-home", fmt(rc.monthlyTakeHome))}
        {row("Rent (1BR avg)", fmt(rc.rent), true)}
        {row("Food", fmt(rc.food), true)}
        {row("Transportation", fmt(rc.transportation), true)}
        {row("Utilities", fmt(rc.utilities), true)}
      </div>

      {/* What's left */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: "1rem 1.2rem",
        background: "var(--surface)",
        borderLeft: `3px solid ${leftOverColor}`,
      }}>
        <div>
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "0.2rem" }}>
            Left over after essentials
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", lineHeight: 1.5 }}>
            {rc.leftOver < 300
              ? "This isn't a living wage. It's survival mode."
              : rc.leftOver < 800
              ? "There's almost no cushion here. One bad month and you're in trouble."
              : "This gives you some breathing room — but not much margin for the unexpected."}
          </div>
        </div>
        <div style={{ fontFamily: "var(--mono)", fontSize: "2rem", color: leftOverColor, whiteSpace: "nowrap", marginLeft: "1.5rem" }}>
          {rc.leftOver < 0 ? "−" : ""}{fmt(Math.abs(rc.leftOver))}/mo
        </div>
      </div>

      <p style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "1rem", lineHeight: 1.6 }}>
        These are estimates based on 2025–2026 averages for a {location}. Your actual expenses will vary —
        but if your number already feels tight here, it&apos;s tight in real life.
        Consider raising your take-home goal before calculating your rate.
      </p>
    </div>
  );
}

// ==============================================
// RESULTS PANEL
// ==============================================
function Results({ results, inputs }: { results: CalcResults; inputs: CalcInputs }) {
  const rc = realityCheck(inputs.takeHome, inputs.location);
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

      <ShareButton inputs={inputs} />

      <RealityCheck rc={rc} location={inputs.location} />
    </div>
  );
}

// ==============================================
// CALCULATOR — form + state
// ==============================================
function Calculator() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
          URWorthy
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

        <button
          onClick={() => setResults(calculate(inputs))}
          style={{
            width: "100%",
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
      </div>

      {results && <Results results={results} inputs={inputs} />}
    </div>
  );
}

// Suspense required for useSearchParams in Next.js App Router
export default function Page() {
  return (
    <Suspense>
      <Calculator />
    </Suspense>
  );
}
