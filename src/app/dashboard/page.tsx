"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  DISCIPLINES, EXPERIENCE_LEVELS, LOCATION_TIERS,
  RATE_FLOORS, LOCATION_MULTIPLIERS, fmt,
  type Discipline, type ExperienceLevel, type LocationTier,
} from "@/lib/calculator";
import { STRATEGIES } from "@/lib/strategies";

// ==============================================
// TYPES
// ==============================================
interface Profile {
  id:           string;
  email:        string;
  discipline:   Discipline | null;
  experience:   ExperienceLevel | null;
  location:     LocationTier | null;
  current_rate: number | null;
  target_rate:  number | null;
  has_kit:      boolean;
}

interface RateEntry {
  id:         string;
  created_at: string;
  rate:       number;
  note:       string | null;
}

// ==============================================
// SMALL COMPONENTS
// ==============================================
function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "0.5rem" }}>
      {children}
    </div>
  );
}

function Select<T extends string>({ value, onChange, options }: {
  value: T | null;
  onChange: (v: T) => void;
  options: readonly T[];
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value as T)}
      style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "var(--mono)", fontSize: "0.85rem", padding: "0.6rem 0.9rem", width: "100%" }}
    >
      <option value="" disabled>Select...</option>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
}

// ==============================================
// UNDERCHARGING ANALYSIS
// Shows the real cost of charging below your value
// ==============================================
function UnderchargingAnalysis({ profile }: { profile: Profile }) {
  if (!profile.current_rate || !profile.target_rate) return null;

  const gap = profile.target_rate - profile.current_rate;
  if (gap <= 0) return null;

  // How bad is the gap?
  const gapPct     = gap / profile.target_rate;
  const annualLoss = gap * 150; // 150 billable days

  // Market floor check
  const floor = (profile.discipline && profile.location)
    ? RATE_FLOORS[profile.discipline][profile.experience ?? "Emerging"] * LOCATION_MULTIPLIERS[profile.location]
    : null;
  const belowFloor = floor && profile.current_rate < floor;

  // Severity messaging
  const severity = gapPct >= 0.5 ? "critical" : gapPct >= 0.25 ? "significant" : "moderate";

  const headlines: Record<string, string> = {
    critical:    "You're not undercharging. You're subsidizing your clients.",
    significant: "Every project you take at this rate costs you money you'll never get back.",
    moderate:    "The gap between where you are and where you should be is a choice. It doesn't have to be.",
  };

  const contexts: Record<string, string[]> = {
    critical: [
      `At ${fmt(profile.current_rate)}/day, you're not running a business — you're running a favor.`,
      `${fmt(annualLoss)}/year is the price you're paying to avoid an uncomfortable conversation with a client.`,
      "Clients don't respect low rates. They just use them.",
    ],
    significant: [
      `The difference between your rate and your target is ${fmt(annualLoss)} a year.`,
      "That's not a rounding error. That's a decision — one you can unmake.",
      "Undercharging signals inexperience, even when the work says otherwise.",
    ],
    moderate: [
      `You're within striking distance of ${fmt(profile.target_rate)}/day — but every project at the current rate trains clients to expect it.`,
      `${fmt(annualLoss)}/year is the annual cost of being too comfortable with the number you named.`,
      "The next rate conversation is easier than the one you're avoiding.",
    ],
  };

  return (
    <div style={{ marginTop: "2.5rem", borderTop: "2px solid var(--border)", paddingTop: "2rem" }}>
      <div style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "0.5rem" }}>
        Analysis
      </div>
      <h2 style={{ fontFamily: "var(--mono)", fontSize: "1.3rem", marginBottom: "1.5rem", color: severity === "critical" ? "var(--danger)" : "var(--text)", lineHeight: 1.3 }}>
        {headlines[severity]}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {contexts[severity].map((line) => (
          <p key={line} style={{ fontSize: "0.85rem", color: "var(--text-dim)", lineHeight: 1.7, margin: 0 }}>
            {line}
          </p>
        ))}
      </div>

      {/* The hard number */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
        <span style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-dim)" }}>
          What you&apos;re leaving on the table per year
        </span>
        <span style={{ fontFamily: "var(--mono)", fontSize: "1.8rem", color: "var(--danger)", fontWeight: "bold" }}>
          {fmt(annualLoss)}
        </span>
      </div>

      {/* Below-floor callout */}
      {belowFloor && (
        <div style={{ marginTop: "1rem", background: "rgba(255,59,59,0.08)", border: "1px solid rgba(255,59,59,0.3)", padding: "1rem 1.25rem" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--danger)", lineHeight: 1.6 }}>
            Your current rate is below the market floor for a {profile.experience} {profile.discipline} in a {profile.location} ({fmt(floor!)}/day).
            {" "}This means you&apos;re not just behind your goal — you&apos;re behind the market.
          </span>
        </div>
      )}
    </div>
  );
}

// ==============================================
// STRATEGY PANEL
// Shows proficiencies that justify a higher rate
// ==============================================
function StrategyPanel({ profile }: { profile: Profile }) {
  if (!profile.discipline || !profile.experience) return null;

  const key = `${profile.discipline}__${profile.experience}` as keyof typeof STRATEGIES;
  const strategies = STRATEGIES[key];
  if (!strategies) return null;

  const floor = profile.location
    ? RATE_FLOORS[profile.discipline][profile.experience] * LOCATION_MULTIPLIERS[profile.location]
    : null;

  return (
    <div style={{ marginTop: "3rem", borderTop: "2px solid var(--border)", paddingTop: "2rem" }}>
      <div style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "0.5rem" }}>
        Your Roadmap
      </div>
      <h2 style={{ fontFamily: "var(--mono)", fontSize: "1.3rem", marginBottom: "0.5rem" }}>
        What justifies a higher rate for a {profile.experience} {profile.discipline}
      </h2>
      {floor && (
        <p style={{ fontSize: "0.78rem", color: "var(--text-dim)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
          Market floor for your tier in a {profile.location}: <strong style={{ color: "var(--accent)" }}>{fmt(floor)}/day</strong>.
          {profile.current_rate && profile.current_rate < floor
            ? " You're currently below this. The items below will help you close the gap."
            : " Here's what gets you to the next level."}
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {strategies.map((section) => (
          <div key={section.category}>
            <div style={{ fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "0.6rem" }}>
              {section.category}
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {section.items.map((item) => (
                <li key={item} style={{ fontSize: "0.82rem", color: "var(--text-dim)", lineHeight: 1.6, paddingLeft: "1rem", position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, color: "var(--accent)" }}>→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==============================================
// RATE HISTORY
// ==============================================
function RateHistory({ history, onAdd }: {
  history: RateEntry[];
  onAdd: (rate: number, note: string) => void;
}) {
  const [rate, setRate] = useState("");
  const [note, setNote] = useState("");

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!rate) return;
    onAdd(Number(rate), note);
    setRate(""); setNote("");
  };

  return (
    <div style={{ marginTop: "3rem", borderTop: "2px solid var(--border)", paddingTop: "2rem" }}>
      <div style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "0.5rem" }}>
        Rate History
      </div>
      <h2 style={{ fontFamily: "var(--mono)", fontSize: "1.3rem", marginBottom: "1.5rem" }}>
        Log a rate change
      </h2>

      <form onSubmit={submit} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        <div style={{ position: "relative", flex: "0 0 140px" }}>
          <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)", fontFamily: "var(--mono)" }}>$</span>
          <input
            type="number" placeholder="Day rate" value={rate}
            onChange={(e) => setRate(e.target.value)} required
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "var(--mono)", fontSize: "0.85rem", padding: "0.6rem 0.75rem 0.6rem 1.5rem", width: "100%" }}
          />
        </div>
        <input
          type="text" placeholder='Note (optional) — "Raised after Beyond Meat gig"'
          value={note} onChange={(e) => setNote(e.target.value)}
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "var(--mono)", fontSize: "0.82rem", padding: "0.6rem 0.9rem", flex: 1, minWidth: "200px" }}
        />
        <button type="submit" style={{ background: "var(--accent)", color: "#000", border: "none", fontFamily: "var(--mono)", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", padding: "0.6rem 1.2rem", cursor: "pointer", fontWeight: "bold" }}>
          Log
        </button>
      </form>

      {history.length === 0 ? (
        <p style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>No rate history yet. Log your current rate above.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {history.map((entry, i) => (
            <div key={entry.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "baseline",
              padding: "0.8rem 0", borderBottom: "1px solid var(--border)", gap: "1rem",
            }}>
              <div>
                <span style={{ fontFamily: "var(--mono)", fontSize: "1.1rem", color: i === 0 ? "var(--accent)" : "var(--text)" }}>
                  {fmt(entry.rate)}/day
                </span>
                {entry.note && <span style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginLeft: "1rem" }}>{entry.note}</span>}
              </div>
              <span style={{ fontSize: "0.7rem", color: "var(--text-dim)", whiteSpace: "nowrap" }}>
                {new Date(entry.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==============================================
// DASHBOARD PAGE
// ==============================================
function DashboardPage() {
  const router   = useRouter();
  const supabase = createClient();

  const [profile, setProfile]   = useState<Profile | null>(null);
  const [history, setHistory]   = useState<RateEntry[]>([]);
  const [saving,  setSaving]    = useState(false);
  const [saved,   setSaved]     = useState(false);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const [{ data: profileData }, { data: historyData }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("rate_history").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);

      if (profileData) setProfile(profileData as Profile);
      if (historyData) setHistory(historyData as RateEntry[]);
      setLoading(false);
    };
    load();
  }, [supabase, router]);

  const saveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    await supabase.from("profiles").update({
      discipline:   profile.discipline,
      experience:   profile.experience,
      location:     profile.location,
      current_rate: profile.current_rate,
      target_rate:  profile.target_rate,
      has_kit:      profile.has_kit,
    }).eq("id", profile.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const logRate = async (rate: number, note: string) => {
    if (!profile) return;
    const { data } = await supabase
      .from("rate_history")
      .insert({ user_id: profile.id, rate, note: note || null })
      .select()
      .single();
    if (data) {
      setHistory((prev) => [data as RateEntry, ...prev]);
      setProfile((prev) => prev ? { ...prev, current_rate: rate } : prev);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "var(--mono)", color: "var(--text-dim)", fontSize: "0.8rem", letterSpacing: "0.15em" }}>
      Loading...
    </div>
  );

  if (!profile) return null;

  const gap = profile.current_rate && profile.target_rate
    ? profile.target_rate - profile.current_rate
    : null;

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "4rem 1.5rem 6rem" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <a href="/" style={{ fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--accent)", textDecoration: "none" }}>The Rate Guide</a>
          <h1 style={{ fontFamily: "var(--mono)", fontSize: "1.8rem", marginTop: "0.5rem" }}>Your Dashboard</h1>
          <p style={{ color: "var(--text-dim)", fontSize: "0.78rem", marginTop: "0.25rem" }}>{profile.email}</p>
        </div>
        <button onClick={signOut} style={{ background: "none", border: "1px solid var(--border)", color: "var(--text-dim)", fontFamily: "var(--mono)", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.5rem 1rem", cursor: "pointer" }}>
          Sign Out
        </button>
      </div>

      {/* Rate snapshot */}
      {(profile.current_rate || profile.target_rate) && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", background: "var(--border)", marginBottom: "2.5rem" }}>
          {[
            { label: "Current Rate", value: profile.current_rate ? `${fmt(profile.current_rate)}/day` : "—", highlight: false },
            { label: "Target Rate",  value: profile.target_rate  ? `${fmt(profile.target_rate)}/day`  : "—", highlight: true  },
          ].map(({ label, value, highlight }) => (
            <div key={label} style={{ background: "var(--surface)", padding: "1.25rem 1.5rem" }}>
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "0.4rem" }}>{label}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "1.6rem", color: highlight ? "var(--accent)" : "var(--text)" }}>{value}</div>
            </div>
          ))}
          {gap !== null && gap > 0 && (
            <div style={{ background: "var(--surface)", padding: "1rem 1.5rem", gridColumn: "1 / -1" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                Gap: <strong style={{ color: "var(--text)", fontFamily: "var(--mono)" }}>{fmt(gap)}/day</strong> — that&apos;s <strong style={{ color: "var(--text)", fontFamily: "var(--mono)" }}>{fmt(gap * 150)}/year</strong> at 150 billable days. The roadmap below shows you how to close it.
              </span>
            </div>
          )}
        </div>
      )}

      <UnderchargingAnalysis profile={profile} />

      {/* Profile form */}
      <div>
        <div style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "1.25rem" }}>
          Your Profile
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <Label>Discipline</Label>
            <Select options={DISCIPLINES} value={profile.discipline} onChange={(v) => setProfile((p) => p ? { ...p, discipline: v } : p)} />
          </div>
          <div>
            <Label>Experience Level</Label>
            <Select options={EXPERIENCE_LEVELS} value={profile.experience} onChange={(v) => setProfile((p) => p ? { ...p, experience: v } : p)} />
          </div>
          <div>
            <Label>Market</Label>
            <Select options={LOCATION_TIERS} value={profile.location} onChange={(v) => setProfile((p) => p ? { ...p, location: v } : p)} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {[
              { label: "Current Day Rate", key: "current_rate" as const },
              { label: "Target Day Rate",  key: "target_rate"  as const },
            ].map(({ label, key }) => (
              <div key={key}>
                <Label>{label}</Label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)", fontFamily: "var(--mono)" }}>$</span>
                  <input
                    type="number" min={0}
                    value={profile[key] ?? ""}
                    onChange={(e) => setProfile((p) => p ? { ...p, [key]: e.target.value ? Number(e.target.value) : null } : p)}
                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "var(--mono)", fontSize: "0.9rem", padding: "0.6rem 0.75rem 0.6rem 1.5rem", width: "100%" }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", fontSize: "0.82rem", color: "var(--text-dim)" }}>
              <input
                type="checkbox" checked={profile.has_kit}
                onChange={(e) => setProfile((p) => p ? { ...p, has_kit: e.target.checked } : p)}
                style={{ accentColor: "var(--accent)", width: "1rem", height: "1rem", cursor: "pointer" }}
              />
              I carry a kit
            </label>
          </div>

          <button
            onClick={saveProfile} disabled={saving}
            style={{ width: "100%", padding: "0.9rem", background: saved ? "transparent" : "var(--accent)", color: saved ? "var(--accent)" : "#000", border: saved ? "1px solid var(--accent)" : "none", fontFamily: "var(--mono)", fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", fontWeight: "bold", transition: "all 0.2s" }}
          >
            {saving ? "Saving..." : saved ? "Saved ✓" : "Save Profile"}
          </button>
        </div>
      </div>

      <RateHistory history={history} onAdd={logRate} />
      <StrategyPanel profile={profile} />
    </div>
  );
}

export default dynamic(() => Promise.resolve(DashboardPage), { ssr: false });
