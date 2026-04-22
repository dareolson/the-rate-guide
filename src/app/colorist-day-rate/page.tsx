// ==============================================
// /colorist-day-rate
// SEO landing page targeting:
//   "colorist day rate 2026"
//   "how much should a freelance colorist charge"
//   "color grading day rate"
//   "DaVinci Resolve colorist rates"
//
// Data sources:
//   - IATSE Local 700 (Motion Picture Editors Guild) 2024-27 Majors Wage Schedules
//   - Mixing Light pay transparency survey (working colorists)
//   - Colorbox.net rate card 2025
//   - dayrates.org colorist data (Nov 2025)
//   - Creative COW colorist forum (practitioner reports)
//   - DC Color rate card 2025
//   - Premium Beat state-of-freelance-coloring survey
// ==============================================

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Colorist Day Rate: What to Charge in 2026",
  description:
    "Real day rate data for freelance colorists in 2026. Rates by experience level, production type, and market — with IATSE Local 700 union minimums, the DaVinci Resolve ownership factor, and the revision trap that quietly kills colorist margins.",
  alternates: { canonical: "/colorist-day-rate" },
  openGraph: {
    title: "Colorist Day Rate: What to Charge in 2026",
    description:
      "Rate ranges for freelance colorists — drawn from IATSE Local 700 wage schedules, Mixing Light practitioner surveys, and working colorist rate sheets.",
    url: "https://therateguide.com/colorist-day-rate",
    images: [
      {
        url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&q=80&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Color grading monitors in a post-production suite",
      },
    ],
  },
};

// ==============================================
// CHART COMPONENTS
// ==============================================

function RateRangeChart() {
  const tiers = [
    { label: "Emerging", years: "0–2 yrs",  range: "$300–$500/day",    min: 300,  max: 500,  color: "#706860" },
    { label: "Mid",      years: "3–6 yrs",  range: "$500–$900/day",    min: 500,  max: 900,  color: "#b0a898" },
    { label: "Senior",   years: "7–12 yrs", range: "$900–$1,500/day",  min: 900,  max: 1500, color: "#d4920a" },
    { label: "Expert",   years: "12+ yrs",  range: "$1,500–$3,500+/day",min: 1500, max: 3500, color: "#e8e0d0" },
  ];
  const scale = 4000;

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
                position:     "absolute",
                left:         `${leftPct}%`,
                width:        `${widthPct}%`,
                background:   tier.color,
                height:       "100%",
                borderRadius: "3px",
              }} />
            </div>
          </div>
        );
      })}
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--mono)", fontSize: "0.7rem", color: "var(--text-dim)" }}>
        <span>$0</span><span>$1,000</span><span>$2,000</span><span>$3,000+</span>
      </div>
    </div>
  );
}

function ProductionTypeTable() {
  const rows = [
    { type: "National Commercial",        range: "$1,200–$3,000", note: "Top rates in the discipline; brand budgets support it" },
    { type: "Network / Streaming (Episodic)", range: "$900–$2,000", note: "Close to union floor on major productions; weekly hire common" },
    { type: "Corporate / Branded Content", range: "$500–$1,200",  note: "Wide range — Fortune 500 pays like commercial; small business does not" },
    { type: "Feature Film (Indie)",        range: "$600–$1,500",  note: "Prestige trades against pay on lower-budget features" },
    { type: "Music Video",                 range: "$400–$800",    note: "Major label vs. emerging artist spans the entire range" },
    { type: "Dailies / Transcoding",       range: "$400–$700",    note: "Different skill set; lower rate, higher volume, often longer bookings" },
    { type: "Short Film",                  range: "$150–$400",    note: "Reel building; below break-even for most experienced colorists" },
  ];

  return (
    <div style={{ margin: "2rem 0", overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--mono)", fontSize: "0.82rem" }}>
        <thead>
          <tr>
            {["Production Type", "Day Rate Range", "Notes"].map((h) => (
              <th key={h} style={{ textAlign: "left", padding: "0.6rem 0.75rem", borderBottom: "2px solid var(--border)", color: "var(--text-dim)", letterSpacing: "0.05em", textTransform: "uppercase", fontSize: "0.72rem" }}>
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
    { role: "Colorist (Journeyperson)",       hourly: "$100.06/hr", daily: "$975.59/day",  note: "Finishing colorist, dramatic/episodic productions" },
    { role: "Colorist (Entry Level)",          hourly: "$86.75/hr",  daily: "$845.81/day",  note: "" },
    { role: "Dailies Colorist (Journeyperson)",hourly: "$77.70/hr",  daily: "$699.30/day",  note: "Dailies and transcoding work; different classification" },
    { role: "Dailies Colorist (Entry Level)",  hourly: "$67.70/hr",  daily: "$609.30/day",  note: "" },
    { role: "Color Assist (Journeyperson)",    hourly: "$65.40/hr",  daily: "$588.60/day",  note: "Assists principal colorist; prep, renders, delivery" },
    { role: "Color Assist (Entry Level)",      hourly: "$57.23/hr",  daily: "$515.07/day",  note: "" },
  ];

  return (
    <div style={{ margin: "2rem 0", overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--mono)", fontSize: "0.82rem" }}>
        <thead>
          <tr>
            {["Role", "Hourly Minimum", "Daily Equivalent", "Notes"].map((h) => (
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
              <td style={{ padding: "0.65rem 0.75rem", color: "var(--accent)", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>{row.hourly}</td>
              <td style={{ padding: "0.65rem 0.75rem", color: "var(--accent)", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>{row.daily}</td>
              <td style={{ padding: "0.65rem 0.75rem", color: "var(--text-dim)", borderBottom: "1px solid var(--border)", fontSize: "0.75rem" }}>{row.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "0.5rem", fontStyle: "italic" }}>
        Source: IATSE Local 700 (Motion Picture Editors Guild) 2024–27 Majors Wage Schedules, effective Aug 3, 2025. Daily equivalent calculated at 9.75 hours.
      </p>
    </div>
  );
}

function MarketMultiplierChart() {
  const markets = [
    { label: "Major (LA, NYC)",               multiplier: 1.30, display: "+30%",     width: 100 },
    { label: "Mid (Chicago, Atlanta, Austin)", multiplier: 1.00, display: "Baseline", width: 77  },
    { label: "Small (regional, rural)",        multiplier: 0.85, display: "-15%",     width: 65  },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", margin: "2rem 0" }}>
      {markets.map((m) => (
        <div key={m.label}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.8rem", color: "var(--text)" }}>{m.label}</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.8rem", color: m.multiplier >= 1 ? "var(--accent)" : "var(--text-dim)" }}>{m.display}</span>
          </div>
          <div style={{ background: "var(--border)", borderRadius: "3px", height: "8px" }}>
            <div style={{ width: `${m.width}%`, background: m.multiplier >= 1 ? "var(--accent)" : "var(--text-dim)", height: "100%", borderRadius: "3px" }} />
          </div>
        </div>
      ))}
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
export default function ColoristDayRatePage() {
  return (
    <article style={{ maxWidth: "720px", margin: "0 auto", padding: "3rem 1.5rem 6rem" }}>

      {/* Hero Image */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/7", borderRadius: "6px", overflow: "hidden", marginBottom: "3rem" }}>
        <Image
          src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&q=80&auto=format&fit=crop"
          alt="Color grading monitors in a post-production suite"
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
        What Should a Colorist Charge Per Day in 2026?
      </h1>

      {/* Intro */}
      <P>
        A colorist finishing a national commercial can earn $2,000 in a single day. The same person, grading dailies on an indie feature, bills $400. The spread between those two numbers is wider than in almost any other post-production discipline — and which side you land on depends on decisions most colorists never make deliberately.
      </P>
      <P>
        This guide draws on IATSE Local 700 wage schedules, Mixing Light practitioner surveys, and working colorist rate sheets to give you a specific number to anchor on — broken down by experience level, production type, pricing model, and the equipment factor that most colorist rate guides ignore entirely.
      </P>

      {/* TOC */}
      <nav style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "4px", padding: "1.25rem 1.5rem", margin: "2rem 0 3rem" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "0.75rem" }}>On This Page</div>
        <ol style={{ margin: 0, paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {[
            ["#ranges",    "Rate Ranges by Experience Level"],
            ["#production","Rates by Production Type"],
            ["#union",     "Union Rates (IATSE Local 700)"],
            ["#facility",  "Facility vs. Freelance"],
            ["#resolve",   "The DaVinci Resolve Factor"],
            ["#market",    "How Location Changes Your Rate"],
            ["#pricing",   "Day Rate vs. Project Rate vs. Hourly"],
            ["#mistakes",  "Five Mistakes That Keep Colorists Underpaid"],
            ["#calculate", "Calculate Your Rate"],
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
        The general freelance market puts colorist day rates between $700 and $1,000 across all experience levels and projects. That average obscures the range. Emerging colorists working short-form content and student projects land at $300–$500/day. Expert finishing colorists on major commercial work charge $1,500–$3,500/day and up. The number that matters is the one relevant to your tier and the production type you are targeting.
      </P>
      <RateRangeChart />
      <P>
        Emerging colorists (0–2 years) typically work in the $300–$500 range on low-budget projects where reel building takes priority. Once you have finishing credits on broadcast or commercial work, $600–$800 becomes a defensible floor. Mid-level colorists with a track record on branded content and episodic work consistently report $700–$900/day in mid-size markets.
      </P>
      <P>
        Senior colorists with 7–12 years of finishing credits command $900–$1,500/day depending on production type and market. At the expert tier, rates on national commercials and prestige episodic work reach $1,500–$3,500/day. Those numbers come from a subset of the market — colorists with strong agency relationships, specialized genre credits, or a proprietary workflow that clients cannot easily replicate.
      </P>
      <Callout>
        The IATSE Local 700 journeyperson colorist minimum on major productions is $975.59/day as of August 2025. For non-union colorists targeting commercial and branded work, that figure is a useful floor benchmark even without a union card.
      </Callout>

      {/* ── Section 2 ── */}
      <H2 id="production">Rates by Production Type</H2>
      <P>
        Production type determines budget class, and budget class sets the ceiling. A colorist with eight years of experience can charge $2,500/day on a national spot and $700/day on a corporate video in the same week. The work looks similar on the outside. The client budgets are not.
      </P>
      <ProductionTypeTable />
      <P>
        Dailies work deserves its own note. Dailies colorists and finishing colorists are distinct roles with different rate structures. Dailies work pays less per day but often offers longer guaranteed bookings and a more predictable schedule. Many finishing colorists treat dailies as fill work between projects rather than a primary rate tier.
      </P>

      {/* ── Section 3 ── */}
      <H2 id="union">Union Rates (IATSE Local 700)</H2>
      <P>
        Colorists fall under IATSE Local 700 (the Motion Picture Editors Guild), which covers post-production labor on major studio and streaming productions. The 2024–27 Majors Agreement sets hard minimums for finishing colorists, dailies colorists, and color assists — with separate classifications for journeyperson and entry level.
      </P>
      <UnionRateTable />
      <P>
        The finishing colorist journeyperson minimum of $975.59/day reflects an effective 9.75-hour day at $100.06/hr. Hours beyond that threshold bill at 1.5x, then 2x after 12 hours. A standard 10-hour union finishing day runs close to $1,150 in base labor before any overscale.
      </P>
      <P>
        On non-union productions — the majority of corporate, branded content, and independent film work — these floors do not apply. They remain the most credible reference point for what a fully budgeted production considers fair, which makes them useful in any rate negotiation.
      </P>

      {/* ── Section 4 ── */}
      <H2 id="facility">Facility vs. Freelance</H2>
      <P>
        Post houses charge clients $200–$500/hour for a grading suite and a colorist. High-end finishing facilities in LA and NYC reach $1,000/hour on premium bookings. The colorist working in that suite earns a fraction of the facility rate — typically $75–$150/hour of what the client pays.
      </P>
      <P>
        Freelance colorists working independently capture the full rate. The tradeoff is overhead: equipment depreciation, facility rental when needed, software licenses, storage, and the cost of slow periods. A facility staff colorist with a predictable salary and employer-paid benefits often earns more in total compensation than a freelancer billing $800/day who works 90 days a year.
      </P>
      <Callout>
        The math only favors freelance if you bill enough days to cover the overhead gap. At 120 billable days and $800/day, gross revenue is $96,000. After self-employment tax, health insurance, software, and storage, take-home is closer to $60,000 — comparable to a mid-level staff position at a regional post house, with none of the stability.
      </Callout>
      <P>
        That comparison is not an argument against freelancing. It is an argument for charging what the math requires. Use the calculator at the bottom of this page to find your actual break-even rate.
      </P>

      {/* ── Section 5 ── */}
      <H2 id="resolve">The DaVinci Resolve Factor</H2>
      <P>
        DaVinci Resolve Studio is the dominant grading software across the market. Its free tier and $295 perpetual license brought professional-grade color tools to every level of the market. That accessibility compressed rates at the low end — clients who once paid $800/day for a colorist with specialized software access now compare that rate against $200/day for a self-taught editor with a Resolve license.
      </P>
      <P>
        The colorists who benefit from Resolve ownership are the ones who own the complete hardware stack: a Resolve dongle for Studio, a calibrated reference monitor (typically a $3,000–$8,000 investment), a high-performance workstation, and fast NVMe storage. That kit lets them work remotely on client projects without renting a facility suite, and it justifies an equipment rental line item on top of their labor rate.
      </P>
      <H3>Billing your suite</H3>
      <P>
        The industry standard is to invoice equipment as a separate line item from labor. A colorist bringing a full mobile suite to a project — Resolve dongle, calibrated display, workstation — can justify $200–$500/day in equipment rental on top of their day rate. Mixing the two into a single number obscures both your labor value and your gear ROI.
      </P>
      <P>
        Remote grading rates run $25–$200/hour depending on the platform and client type. DC Color, a Washington DC facility, publishes a remote grading rate of $300/hour — on the high end, reflecting a premium setup and client base. For most freelance colorists offering remote work, $75–$125/hour is the relevant range.
      </P>

      {/* ── Section 6 ── */}
      <H2 id="market">How Location Changes Your Rate</H2>
      <P>
        Los Angeles holds roughly 40% of the US colorist workforce and the widest rate spread — the highest top earners and the most entry-level positions exist in the same market. New York is more consistent across skill levels. Both cities carry a 25–35% premium over mid-market rates.
      </P>
      <MarketMultiplierChart />
      <P>
        Secondary markets compress rates on lower-budget work but track closer to LA and NYC on productions originating from those markets. A colorist in Atlanta finishing a project for a New York ad agency can charge New York rates if the work and the relationship support it. Geography matters less than it did ten years ago for colorists with a strong remote workflow.
      </P>

      {/* ── Section 7 ── */}
      <H2 id="pricing">Day Rate vs. Project Rate vs. Hourly</H2>
      <P>
        Colorists use all three pricing models depending on the project type. Day rates dominate on productions with unpredictable session lengths — commercials, episodic work, anything with client-attended sessions that run long. Project rates make sense for short-form content with a defined deliverable and revision scope. Hourly rates appear most on remote work and smaller corporate jobs.
      </P>
      <H3>When to use a project rate</H3>
      <P>
        A project rate works when you can accurately estimate hours and revision rounds. A music video with one round of revisions and a defined deliverable is a reasonable project rate candidate. A commercial with multiple stakeholders and open-ended approval rounds is not. Scope creep costs colorists more than almost any other discipline because clients treat color as infinitely tweakable after they see a first pass.
      </P>
      <H3>Revision structure</H3>
      <P>
        Build revision limits into every project rate. Two rounds of revisions is standard. A third round bills at your hourly rate. Without that clause in writing, a project rate becomes an unlimited service contract. The Mixing Light practitioner community consistently identifies revision scope as the single largest source of margin loss for freelance colorists.
      </P>
      <Callout>
        A project rate of $1,200 for a 3-minute branded video sounds reasonable until it runs to five revision rounds. At a real effective rate of $60/hour, that is 20 hours of work — two and a half full days. Your day rate for the same work would have been $1,500–$2,400 with proper billing.
      </Callout>

      {/* ── Section 8 ── */}
      <H2 id="mistakes">Five Mistakes That Keep Colorists Underpaid</H2>

      <H3>1. Mixing labor and equipment into one rate</H3>
      <P>
        A colorist who owns a full suite and charges $800/day all-in is giving away equipment rental for free. Invoice labor and equipment separately. It protects your labor rate when clients push back on price and creates a clear record of what your gear earns.
      </P>

      <H3>2. No revision cap on project rates</H3>
      <P>
        Every project rate quote needs a revision clause. Two rounds standard, third round at hourly, beyond that at a premium. Clients who receive unlimited color feedback will give unlimited color feedback. Build the boundary into the agreement before work starts.
      </P>

      <H3>3. Pricing dailies and finishing at the same rate</H3>
      <P>
        Dailies work and finishing work are different disciplines with different market rates. Pricing them identically means either your finishing rate is too low or your dailies rate is too high. Know which tier you are operating in and price accordingly.
      </P>

      <H3>4. Discounting remote work</H3>
      <P>
        Remote grading requires the same skill, the same software, and the same calibrated output as in-person work. The client saves facility overhead — that saving belongs to them, not to you as a rate discount. Remote delivery is a convenience you provide, not a reason to charge less for your labor.
      </P>

      <H3>5. Holding the same rate after building a real credit list</H3>
      <P>
        A broadcast credit, a festival feature, or a national commercial warrants a rate reassessment. Colorists who built their rate in year two of their career and held it through year eight are leaving compounding money behind. Clients who leave when you raise your rate were anchored to a price, not to your work.
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
          Enter your take-home goal. The calculator adds self-employment tax, health insurance, and an optional profit margin — then tells you the day rate you need to clear it, and where that rate falls in the market for your experience level and location.
        </p>
        <Link
          href="/?d=Colorist"
          style={{
            display:        "inline-block",
            background:     "var(--accent)",
            color:          "#000",
            fontFamily:     "var(--mono)",
            fontSize:       "0.85rem",
            letterSpacing:  "0.15em",
            textTransform:  "uppercase",
            fontWeight:     "bold",
            padding:        "0.9rem 2rem",
            borderRadius:   "4px",
            textDecoration: "none",
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
            ["IATSE Local 700 (Motion Picture Editors Guild) 2024–27 Majors Wage Schedules", "https://www.editorsguild.com/Wages-and-Contracts"],
            ["Mixing Light — Pay Transparency: Hourly Rates for US Colorists and DITs", "https://mixinglight.com/color-grading-tutorials/hourly-rate-for-colorists-and-dits/"],
            ["Colorbox.net Rate Card 2025", "https://www.colorbox.net/ratecard/"],
            ["dayrates.org — Colorist Day Rates (Updated November 2025)", "https://dayrates.org/colorist/"],
            ["DC Color Rate Card", "https://dccolor.com/rate-card/"],
            ["Premium Beat — The State of Freelance Coloring Today", "https://www.premiumbeat.com/blog/the-state-of-freelance-coloring-today/"],
            ["Creative COW — Colorist Hourly Rates and Billing Discussion", "https://creativecow.net/forums/thread/hourly-rates-billing-etc/"],
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
