// ==============================================
// /video-editor-day-rate
// SEO landing page targeting:
//   "video editor day rate 2026"
//   "how much should a freelance video editor charge"
//   "freelance video editor rates"
//
// Data sources:
//   - Cutjamm 2025 Video Editor Salary Survey (201 respondents, Q4 2024)
//   - IATSE Local 700 (Motion Picture Editors Guild) 2024-27 Majors Agreement
//   - ZipRecruiter April 2026 dataset
//   - Creative COW LA editors forum (working practitioners)
//   - Topsheet IATSE theatrical rates 2025-2026
// ==============================================

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Video Editor Day Rate: What to Charge in 2026",
  description:
    "Real day rate data for freelance video editors in 2026. Day rate vs. hourly vs. project rate, IATSE union minimums, rates by production type, and the revision cycle trap that quietly kills editor margins.",
  alternates: { canonical: "/video-editor-day-rate" },
  openGraph: {
    title: "Video Editor Day Rate: What to Charge in 2026",
    description:
      "Rate ranges by experience level, production type, and market — drawn from the Cutjamm 2025 salary survey, IATSE Local 700 rate cards, and Creative COW practitioner data.",
    url: "https://therateguide.com/video-editor-day-rate",
    images: [
      {
        url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Video editor working at a workstation",
      },
    ],
  },
};

// ==============================================
// CHART COMPONENTS
// ==============================================

function RateRangeChart() {
  const tiers = [
    { label: "Entry",  years: "0–2 yrs",  range: "$300–$500/day",    min: 300,  max: 500,  color: "#706860" },
    { label: "Mid",    years: "3–6 yrs",  range: "$500–$800/day",    min: 500,  max: 800,  color: "#b0a898" },
    { label: "Senior", years: "7–12 yrs", range: "$800–$1,200/day",  min: 800,  max: 1200, color: "#d4920a" },
    { label: "Expert", years: "12+ yrs",  range: "$1,200–$1,500/day",min: 1200, max: 1500, color: "#e8e0d0" },
  ];
  const scale = 1600;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", margin: "2rem 0" }}>
      {tiers.map((tier) => {
        const leftPct  = (tier.min / scale) * 100;
        const widthPct = Math.min(((tier.max - tier.min) / scale) * 100, 100 - leftPct);
        return (
          <div key={tier.label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: "0.82rem", fontWeight: 700, color: tier.color }}>
                {tier.label}
                <span style={{ fontWeight: 400, color: "var(--text-dim)", marginLeft: "0.5rem" }}>
                  {tier.years}
                </span>
              </span>
              <span style={{ fontFamily: "var(--mono)", fontSize: "0.82rem", color: tier.color }}>
                {tier.range}
              </span>
            </div>
            <div style={{ background: "var(--border)", borderRadius: "3px", height: "10px", position: "relative" }}>
              <div style={{
                position: "absolute",
                left: `${leftPct}%`,
                width: `${widthPct}%`,
                background: tier.color,
                height: "100%",
                borderRadius: "3px",
              }} />
            </div>
          </div>
        );
      })}
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--mono)", fontSize: "0.7rem", color: "var(--text-dim)" }}>
        <span>$0</span>
        <span>$500</span>
        <span>$1,000</span>
        <span>$1,500+</span>
      </div>
    </div>
  );
}

function ProductionTypeTable() {
  const rows = [
    { type: "Commercial (national/major brand)", range: "$1,200–$1,500", note: "Highest-paying freelance category" },
    { type: "TV / Streaming (episodic)",         range: "$750–$1,000",   note: "Union scale is the floor; weekly rates common" },
    { type: "Narrative Feature (non-union)",     range: "$500–$900",     note: "Below union, offset by longer engagements" },
    { type: "Branded Content / Corporate",       range: "$650–$900",     note: "Mid-market mainstay; Fortune 500 pays like commercial" },
    { type: "Documentary",                       range: "$400–$800",     note: "Passion project discounting is common" },
    { type: "News / Broadcast",                  range: "$400–$500",     note: "Established budget structures with lower ceiling" },
    { type: "YouTube / Creator Content",         range: "$300–$500",     note: "Per-video or retainer more common than day rate" },
    { type: "Social Media / Short-form",         range: "$150–$350",     note: "Commoditized; platform competition heavy" },
  ];

  return (
    <div style={{ margin: "2rem 0", overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--mono)", fontSize: "0.82rem" }}>
        <thead>
          <tr>
            {["Production Type", "Day Rate Range", "Notes"].map((h) => (
              <th key={h} style={{ textAlign: "left", padding: "0.6rem 0.75rem", borderBottom: "2px solid var(--accent)", color: "var(--text)", letterSpacing: "0.05em", textTransform: "uppercase", fontSize: "0.72rem" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.type} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
              <td style={{ padding: "0.65rem 0.75rem", color: "var(--text)", borderBottom: "1px solid var(--border)" }}>{row.type}</td>
              <td style={{ padding: "0.65rem 0.75rem", color: "var(--accent)", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>{row.range}</td>
              <td style={{ padding: "0.65rem 0.75rem", color: "var(--text-dim)", borderBottom: "1px solid var(--border)" }}>{row.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UnionRateTable() {
  const rows = [
    { role: "Feature Editor (Z-1)",          daily: "$857/day",  weekly: "$3,428/wk", note: "Top tier — lead editor on major features" },
    { role: "Feature Editor (Z-3)",          daily: "$671/day",  weekly: "$2,685/wk", note: "Mid-tier feature editor classification" },
    { role: "Assistant Editor",              daily: "$575/day",  weekly: "$2,302/wk", note: "" },
    { role: "VFX Editor",                   daily: "$575/day",  weekly: "$2,302/wk", note: "" },
    { role: "Trailer Editor",               daily: "—",         weekly: "$3,014/wk", note: "Weekly-only hire; high demand in LA" },
    { role: "Colorist (Journeyperson)",     daily: "$800/day",  weekly: "$4,125/wk", note: "Based on $100/hr × 8-hr minimum" },
  ];

  return (
    <div style={{ margin: "2rem 0", overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--mono)", fontSize: "0.82rem" }}>
        <thead>
          <tr>
            {["Role", "Daily Minimum", "Weekly Minimum", "Notes"].map((h) => (
              <th key={h} style={{ textAlign: "left", padding: "0.6rem 0.75rem", borderBottom: "2px solid var(--border)", color: "var(--text-dim)", letterSpacing: "0.05em", textTransform: "uppercase", fontSize: "0.72rem" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.role} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
              <td style={{ padding: "0.65rem 0.75rem", color: "var(--text)", borderBottom: "1px solid var(--border)" }}>{row.role}</td>
              <td style={{ padding: "0.65rem 0.75rem", color: "var(--accent)", borderBottom: "1px solid var(--border)" }}>{row.daily}</td>
              <td style={{ padding: "0.65rem 0.75rem", color: "var(--accent)", borderBottom: "1px solid var(--border)" }}>{row.weekly}</td>
              <td style={{ padding: "0.65rem 0.75rem", color: "var(--text-dim)", borderBottom: "1px solid var(--border)", fontSize: "0.75rem" }}>{row.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "0.5rem", fontStyle: "italic" }}>
        Source: IATSE Local 700 (Motion Picture Editors Guild) 2024–27 Majors Agreement, effective 2025. 8-hour daily minimum. OT at 1.5x after 8 hours, 2x after 12–14.
      </p>
    </div>
  );
}

function PricingModelChart() {
  const models = [
    { label: "Annual salary / employee",  pct: 35, note: "Most common — staff editor or long-term contract" },
    { label: "Per-project flat fee",       pct: 25, note: "Common for corporate, YouTube, branded content" },
    { label: "Hourly",                     pct: 16, note: "Short gigs, undefined scope, facility bookings" },
    { label: "Monthly retainer",           pct: 12, note: "Highest per-month income model when capped correctly" },
    { label: "Per-minute rate",            pct: 11, note: "Training videos, corporate content ($125–$200/min)" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem", margin: "2rem 0" }}>
      {models.map((m) => (
        <div key={m.label}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.8rem", color: "var(--text)" }}>{m.label}</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.8rem", color: "var(--accent)" }}>{m.pct}%</span>
          </div>
          <div style={{ background: "var(--border)", borderRadius: "3px", height: "8px" }}>
            <div style={{ width: `${m.pct * 2.5}%`, background: "var(--accent)", height: "100%", borderRadius: "3px", opacity: m.pct === 35 ? 1 : m.pct === 25 ? 0.8 : 0.55 }} />
          </div>
          <div style={{ fontFamily: "var(--sans)", fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "0.2rem" }}>{m.note}</div>
        </div>
      ))}
      <p style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "0.5rem", fontStyle: "italic" }}>
        Source: Cutjamm 2025 Video Editor Salary Survey, 201 respondents, Q4 2024.
      </p>
    </div>
  );
}

// ==============================================
// LAYOUT HELPERS
// ==============================================
function P({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "1.05rem", color: "var(--text-mid)", lineHeight: 1.8, margin: "0 0 1.25rem", fontFamily: "var(--sans)" }}>
      {children}
    </p>
  );
}

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} style={{ fontFamily: "var(--sans)", fontSize: "1.4rem", fontWeight: 700, color: "var(--text)", margin: "3rem 0 1rem", lineHeight: 1.25 }}>
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ fontFamily: "var(--mono)", fontSize: "0.85rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "2rem 0 0.75rem" }}>
      {children}
    </h3>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--surface)", borderLeft: "3px solid var(--accent)", padding: "1.25rem 1.5rem", margin: "1.5rem 0" }}>
      <p style={{ fontSize: "1rem", color: "var(--text)", lineHeight: 1.8, margin: 0, fontFamily: "var(--sans)" }}>
        {children}
      </p>
    </div>
  );
}

// ==============================================
// PAGE
// ==============================================
export default function VideoEditorDayRatePage() {
  return (
    <article style={{ maxWidth: "720px", margin: "0 auto", padding: "3rem 1.5rem 6rem" }}>

      {/* Hero Image */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/7", borderRadius: "6px", overflow: "hidden", marginBottom: "3rem" }}>
        <Image
          src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80&auto=format&fit=crop"
          alt="Video editor at workstation"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(14,14,14,0.6) 0%, transparent 60%)" }} />
        <p style={{ position: "absolute", bottom: "0.75rem", right: "0.75rem", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", margin: 0 }}>
          Photo: Unsplash
        </p>
      </div>

      {/* Eyebrow */}
      <div style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "1rem" }}>
        Rates &amp; Business
      </div>

      {/* Title */}
      <h1 style={{ fontFamily: "var(--sans)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, lineHeight: 1.15, color: "var(--text)", margin: "0 0 1.5rem" }}>
        What Should a Freelance Video Editor Charge Per Day in 2026?
      </h1>

      {/* Intro */}
      <P>
        The Cutjamm 2025 salary survey found the average freelance video editor bills $27.55 an hour. At a 10-hour day that is $275 — well below what most working editors need to cover taxes, insurance, and the overhead that never shows up on an invoice. The gap between what editors charge and what the market will pay is real, and it is wider than most editors realize.
      </P>
      <P>
        This guide draws from the Cutjamm survey (201 editors, Q4 2024), IATSE Local 700 rate cards, ZipRecruiter's April 2026 dataset, and working practitioners on Creative COW to give you actual numbers — by experience level, production type, billing model, and market.
      </P>

      {/* TOC */}
      <nav style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "4px", padding: "1.25rem 1.5rem", margin: "2rem 0 3rem" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "0.75rem" }}>On This Page</div>
        <ol style={{ margin: 0, paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {[
            ["#ranges",      "Rate Ranges by Experience Level"],
            ["#billing",     "Day Rate vs. Hourly vs. Project Rate"],
            ["#production",  "Rates by Production Type"],
            ["#union",       "Union Rates (IATSE Local 700)"],
            ["#market",      "How Location Affects Your Rate"],
            ["#posthouses",  "What Post Houses Actually Charge Clients"],
            ["#mistakes",    "Six Mistakes That Keep Editors Underpaid"],
            ["#calculate",   "Calculate Your Rate"],
          ].map(([href, label]) => (
            <li key={href}>
              <a href={href} style={{ color: "var(--text-mid)", fontFamily: "var(--sans)", fontSize: "0.9rem", textDecoration: "none" }}>
                {label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* ── Section 1 ── */}
      <H2 id="ranges">Rate Ranges by Experience Level</H2>
      <P>
        ZipRecruiter's April 2026 dataset puts the national average freelance video editor salary at $65,728 per year — about $31.60 an hour if you assume 40 billable hours a week, every week. No freelancer actually bills that consistently. Adjusted for realistic billable days (100–150 per year), that average income requires a day rate of $440–$660 just to maintain it.
      </P>
      <RateRangeChart />
      <P>
        Entry-level editors (0–2 years) land in the $300–$500 range, often doing YouTube, social media, and corporate content. Once you have a real reel and consistent client relationships, $500–$800 is achievable. Senior editors with strong commercial or episodic credits move into $800–$1,200 territory. The commercial specialist tier — editors with a track record on national brands — tops out around $1,200–$1,500 for non-union work.
      </P>
      <Callout>
        ZipRecruiter's 90th percentile sits at $101,000 per year — roughly $800–$1,000 per billable day at realistic volume. That is the income level a senior editor who consistently lands the right clients can reach without union work.
      </Callout>

      {/* ── Section 2 ── */}
      <H2 id="billing">Day Rate vs. Hourly vs. Project Rate</H2>
      <P>
        The Cutjamm survey asked 201 editors how they prefer to price their work. The results split fairly evenly across models, but the framing matters.
      </P>
      <PricingModelChart />

      <H3>When day rate works</H3>
      <P>
        Multi-day projects, narrative and documentary work, post house bookings, episodic television — anywhere the client needs you in a chair for a defined number of days. Day rates remove clock-watching friction and establish clear expectations on both sides. The standard question to settle: does your day rate cover 8 hours or 10? Define it in writing, then specify your overtime rate for anything beyond that.
      </P>

      <H3>When hourly works</H3>
      <P>
        Short gigs, undefined scope, facility bookings. The standard in professional markets is a 4-hour minimum — you do not take a call for less than that, regardless of how short the actual session runs. A $75/hour rate on a 4-hour minimum is $300 regardless of whether the session ends at hour two. That protects your time from being filled with unprofitable micro-jobs.
      </P>

      <H3>When project rate works</H3>
      <P>
        YouTube, social media packages, corporate videos with a clearly defined deliverable. Project rates reward efficiency — a fast editor earns more per hour than a slow one on the same job. The trap is scope creep. Define the deliverable, the number of included revision rounds (two or three is standard), and what additional revisions cost. A common rate structure: $200 per additional revision round after the included ones. Without that language, a flat-fee project can quietly become your worst-paying job.
      </P>

      <H3>When retainer works</H3>
      <P>
        Ongoing relationships with brands, agencies, or YouTube channels. The Cutjamm survey found the average retainer runs $1,206/month — low, suggesting most retainers are underpriced relative to the volume of work they cover. A sustainable retainer specifies the number of deliverables and revision cycles included per month, with overage rates for anything beyond that.
      </P>

      {/* ── Section 3 ── */}
      <H2 id="production">Rates by Production Type</H2>
      <P>
        The production type tells you the budget class and sets your ceiling. An editor who works exclusively in corporate and branded content will price differently than one targeting commercial agencies — and both should price differently than someone doing YouTube editorial.
      </P>
      <ProductionTypeTable />
      <P>
        Corporate and branded content is where most freelance editors outside of LA and NYC find consistent work. Fortune 500 internal productions and agency-produced brand campaigns pay well; small business content compresses rates fast. Documentary work rewards patience over rate — the money is modest but the engagements tend to be longer and more interesting.
      </P>

      {/* ── Section 4 ── */}
      <H2 id="union">Union Rates (IATSE Local 700)</H2>
      <P>
        IATSE Local 700 represents editors, colorists, VFX artists, and post-production professionals. The 2024–27 Majors Agreement sets hard minimums for union productions. On studio features and network television, these are contractual floors — most working editors negotiate overscale above them.
      </P>
      <UnionRateTable />
      <P>
        Feature editors are primarily hired on weekly deals, not daily. The operative number is the weekly minimum: $3,428/week for a Z-1 editor on a major studio feature, with OT kicking in at 1.5x after 8 hours and 2x after 12–14 hours. On a 10-hour day, a union editor at Z-1 scale clears roughly $1,070 — before benefits contributions that the production pays on top.
      </P>
      <P>
        Non-union editorial work tracks these numbers loosely. Creative COW practitioners cite "$750/day as the norm for series work" and "$800/day for promo work at certain broadcast networks" — consistent with union scale ballparks on the non-union market.
      </P>

      {/* ── Section 5 ── */}
      <H2 id="market">How Location Affects Your Rate</H2>
      <P>
        ZipRecruiter puts the New York City average at $84,365/year versus the national average of $65,728 — a 28% premium. LA runs similarly to NYC on production budgets but with more supply-side competition. David Roth Weiss, a working LA editor, noted on Creative COW: "LA's larger freelancer pool and lower cost of living compared to NYC creates downward pressure on rates."
      </P>
      <P>
        Mid-market cities — Chicago, Atlanta, Austin, Dallas, Denver — generally run 20–40% below major market rates for equivalent work. Atlanta is the exception: TV and film production incentives have drawn enough studio work that rates there approach LA levels on productions that originate from the studios.
      </P>
      <P>
        Remote work has shifted the calculus for small-market editors more than it has for camera department roles. A DP has to physically be on set. An editor does not. Small-market editors with strong reels who actively pursue remote client relationships in LA or NYC can charge major-market rates for those engagements while their local market remains at a lower tier.
      </P>

      {/* ── Section 6 ── */}
      <H2 id="posthouses">What Post Houses Actually Charge Clients</H2>
      <P>
        Post-production facilities bill clients for editorial at a significant markup over what the editor earns. Understanding that spread tells you what the market will bear — and what a direct client relationship is worth.
      </P>
      <Callout>
        The standard facility markup on a freelance editor's day rate runs 25–50% for phone management, 50–100% for active project oversight. In the ad agency world, production markups of 2.5–4x cost are considered normal. A facility paying a freelance editor $500/day bills the client $750–$1,000. A facility paying $700/day bills $1,050–$1,400.
      </Callout>
      <P>
        High-end LA and NYC post houses billing major brands for an editorial suite — editor, room, equipment — can run $2,000–$3,500/day all-in. The editor in that suite may be on a $700–$900 day rate. The facility captures the spread.
      </P>
      <P>
        For a mid-level editor, this means a direct client relationship at $700/day is worth more than a facility booking at $700/day — because in the direct relationship, you capture the full value. Facility bookings make sense for volume, predictability, and credits. Direct clients make sense for building income.
      </P>

      {/* ── Section 7 ── */}
      <H2 id="mistakes">Six Mistakes That Keep Editors Underpaid</H2>

      <H3>1. Quoting edit time, not project time</H3>
      <P>
        Editors routinely quote based on the hours they expect to spend cutting, ignoring client communication, file organization, renders, exports, and revision back-and-forth. A useful rule of thumb: double your estimated edit time to get your actual project time, then price from there.
      </P>

      <H3>2. No revision limit in the contract</H3>
      <P>
        The Cutjamm survey and multiple practitioner sources cite this as the single biggest margin-killer. A $500 flat-fee corporate video with unlimited revisions can become a 15-round project at an effective $35/hour. Two included revision rounds is industry standard. Define in writing what a revision is (content change vs. re-cut vs. recolor) and what additional rounds cost.
      </P>

      <H3>3. Racing to the bottom on platforms</H3>
      <P>
        Upwork and Fiverr train editors to compete on price. The top earners leave those platforms and compete on reputation and relationships instead. If your current client pipeline runs entirely through platforms, it is worth investing time in direct outreach — the rate ceiling is meaningfully higher.
      </P>

      <H3>4. Billing for time, not value</H3>
      <P>
        A 2-minute national commercial that took 40 hours to cut is not worth $1,600 at $40/hour. The commercial is worth what it generates for the client — and major brand campaigns generate significantly more than the edit fee. Positioning your rate against the deliverable's value rather than your hours changes the conversation.
      </P>

      <H3>5. Not raising rates after significant credits</H3>
      <P>
        97% of editors surveyed by Cutjamm said they plan to raise rates within 12 months. Most do not follow through. Every significant credit — a network TV episode, a major brand campaign, a nationally distributed documentary — warrants a rate reassessment. Clients anchor to your first number; it is harder to raise rates with an existing client than to set a higher rate with the next one.
      </P>

      <H3>6. Underpricing specializations</H3>
      <P>
        Motion graphics, color grading, and audio mixing command real premiums and are not easily commoditized. An editor who cuts and also does After Effects work is doing two jobs. Union colorist scale runs $100/hour — $800 for an 8-hour day. Non-union senior colorists on commercial work charge $150–$250/hour. If you have these skills and are bundling them into a standard day rate, you are giving them away.
      </P>

      {/* ── CTA ── */}
      <div id="calculate" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "6px", padding: "2rem", marginTop: "3.5rem", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "0.75rem" }}>
          Free Calculator
        </div>
        <h2 style={{ fontFamily: "var(--sans)", fontSize: "1.4rem", fontWeight: 700, color: "var(--text)", margin: "0 0 0.75rem", lineHeight: 1.3 }}>
          Find the day rate that covers what you actually need
        </h2>
        <p style={{ fontFamily: "var(--sans)", fontSize: "0.95rem", color: "var(--text-mid)", margin: "0 0 1.5rem", lineHeight: 1.7 }}>
          Enter your take-home goal. The calculator adds self-employment tax, health insurance, and an optional profit margin — then shows you the day rate you need and how it compares to market floors for video editors at your experience level.
        </p>
        <Link
          href="/?d=Video+Editor"
          style={{
            display:         "inline-block",
            background:      "var(--accent)",
            color:           "#000",
            fontFamily:      "var(--mono)",
            fontSize:        "0.85rem",
            letterSpacing:   "0.15em",
            textTransform:   "uppercase",
            fontWeight:      "bold",
            padding:         "0.9rem 2rem",
            borderRadius:    "4px",
            textDecoration:  "none",
          }}
        >
          Calculate My Rate
        </Link>
      </div>

      {/* Sources */}
      <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "1rem" }}>
          Sources
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {[
            ["Cutjamm 2025 Video Editor Salary Survey", "https://www.cutjamm.com/blog/2025-video-editor-salary-survey-report"],
            ["IATSE Local 700 (Motion Picture Editors Guild) 2024–27 Majors Wage Rates", "https://www.production.ink/content/files/2025/04/2024-27-Local-700-Majors-Wage-Rates_2025-04-14.pdf"],
            ["Topsheet IATSE Theatrical Rates 2025–2026", "https://www.topsheet.io/edu/rates/iatse/iatse-theatrical-theatrical-rates"],
            ["ZipRecruiter — Freelance Video Editor Salary (April 2026)", "https://www.ziprecruiter.com/Salaries/Freelance-Video-Editor-Salary"],
            ["Creative COW — LA Editors: Hourly or Day Rate?", "https://creativecow.net/forums/thread/la-editorshourly-or-day-rateae/"],
            ["Creative COW — Production Services Markup / Profit Margins", "https://creativecow.net/forums/thread/production-services-markupprofit-margins/"],
            ["Cutjamm — Freelance Video Editing Rates 2026", "https://www.cutjamm.com/blog/video-editing-rates"],
          ].map(([label, href]) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: "var(--sans)", fontSize: "0.82rem", color: "var(--text-dim)", textDecoration: "underline", textUnderlineOffset: "3px" }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>

    </article>
  );
}
