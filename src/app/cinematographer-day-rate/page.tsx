// ==============================================
// /cinematographer-day-rate
// SEO landing page targeting:
//   "how much should a cinematographer charge per day"
//   "cinematographer day rate 2026"
//   "DP day rate freelance"
//
// Data sources:
//   - No Film School Global Cinematography Survey (2023, 2,000+ respondents)
//   - IATSE Local 600 rate cards (2024-2025, icg600.com)
//   - Assemble day rate guide 2024
//   - Ambient Skies crew rate guide 2024
//   - Jeremiah Warren / Medium commercial DP survey
//   - Storyhunter DP rate guide
// ==============================================

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cinematographer Day Rate: What to Charge in 2026",
  description:
    "Real day rate data for freelance cinematographers and DPs in 2026. Emerging to expert, union to non-union, commercial to documentary — with market breakdowns and the five mistakes that keep DPs underpaid.",
  alternates: { canonical: "/cinematographer-day-rate" },
  openGraph: {
    title: "Cinematographer Day Rate: What to Charge in 2026",
    description:
      "Rate ranges by experience level, production type, and market — drawn from IATSE rate cards, No Film School's 2,000-respondent survey, and working DP rate sheets.",
    url: "https://therateguide.com/cinematographer-day-rate",
    images: [
      {
        url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&q=80&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Cinematographer on set",
      },
    ],
  },
};

// ==============================================
// CHART COMPONENTS
// ==============================================

function RateRangeChart() {
  const tiers = [
    { label: "Emerging", years: "0–3 yrs", range: "$300–$600/day",   min: 300,  max: 600,  color: "#706860" },
    { label: "Mid",      years: "4–7 yrs", range: "$800–$1,500/day", min: 800,  max: 1500, color: "#b0a898" },
    { label: "Senior",   years: "8–14 yrs",range: "$1,500–$3,500/day",min: 1500, max: 3500, color: "#d4920a" },
    { label: "Expert",   years: "15+ yrs", range: "$3,500–$10,000+/day",min: 3500,max: 7000, color: "#e8e0d0" },
  ];
  const scale = 7500;

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
              <div
                style={{
                  position:    "absolute",
                  left:        `${leftPct}%`,
                  width:       `${widthPct}%`,
                  background:  tier.color,
                  height:      "100%",
                  borderRadius: "3px",
                }}
              />
            </div>
          </div>
        );
      })}
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--mono)", fontSize: "0.7rem", color: "var(--text-dim)" }}>
        <span>$0</span>
        <span>$2,500</span>
        <span>$5,000</span>
        <span>$7,500+</span>
      </div>
    </div>
  );
}

function ProductionTypeTable() {
  const rows = [
    { type: "National Commercial",      range: "$2,000–$5,000",   note: "Highest consistent rates; brand budgets carry it" },
    { type: "Regional Commercial",      range: "$800–$2,000",     note: "Mid-tier agency and regional brand work" },
    { type: "Network / Streaming TV",   range: "$1,000–$3,500",   note: "Union minimums + overscale; usually hired weekly" },
    { type: "Corporate / Branded",      range: "$600–$1,800",     note: "Wide range — Fortune 500 pays like commercial" },
    { type: "Music Video",              range: "$500–$5,000+",    note: "Major label vs. emerging artist is the whole spread" },
    { type: "Documentary",              range: "$500–$1,500",     note: "Lower daily rate; longer guaranteed booking" },
    { type: "Feature Film (non-union)", range: "$800–$3,000",     note: "Prestige trades against pay on lower-budget projects" },
    { type: "Short Film / Spec",        range: "$0–$400",         note: "Deferred or nominal; reel value only" },
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
    { role: "Director of Photography",    commercial: "$1,234/day", film: "$1,163/day", note: "Commercial = 8-hr call; feature = daily minimum (weekly is operative)" },
    { role: "Camera Operator",            commercial: "$755/day",   film: "$719/day",   note: "" },
    { role: "1st AC",                     commercial: "$546/day",   film: "—",          note: "" },
    { role: "Digital Imaging Technician", commercial: "$720/day",   film: "—",          note: "" },
  ];

  return (
    <div style={{ margin: "2rem 0", overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--mono)", fontSize: "0.82rem" }}>
        <thead>
          <tr>
            {["Role", "Commercial (AICP)", "Film / TV (Basic)", "Notes"].map((h) => (
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
              <td style={{ padding: "0.65rem 0.75rem", color: "var(--accent)", borderBottom: "1px solid var(--border)" }}>{row.commercial}</td>
              <td style={{ padding: "0.65rem 0.75rem", color: "var(--accent)", borderBottom: "1px solid var(--border)" }}>{row.film}</td>
              <td style={{ padding: "0.65rem 0.75rem", color: "var(--text-dim)", borderBottom: "1px solid var(--border)", fontSize: "0.75rem" }}>{row.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "0.5rem", fontStyle: "italic" }}>
        Source: IATSE Local 600 rate cards, 2024–2025. Commercial = AICP Agreement (LA). Film/TV = Basic Agreement, Western Region. Hours beyond 8 = 1.5x; beyond 12 = 2x.
      </p>
    </div>
  );
}

function MarketMultiplierChart() {
  const markets = [
    { label: "Major (LA, NYC)",                   multiplier: 1.30, display: "+30%",  width: 100 },
    { label: "Mid (Chicago, Atlanta, Austin)",     multiplier: 1.00, display: "Baseline", width: 77 },
    { label: "Small (regional cities, rural)",     multiplier: 0.85, display: "-15%", width: 65 },
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
export default function CinematographerDayRatePage() {
  return (
    <article style={{ maxWidth: "720px", margin: "0 auto", padding: "3rem 1.5rem 6rem" }}>

      {/* Hero Image */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/7", borderRadius: "6px", overflow: "hidden", marginBottom: "3rem" }}>
        <Image
          src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&q=80&auto=format&fit=crop"
          alt="Film camera on set"
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
        What Should a Cinematographer Charge Per Day in 2026?
      </h1>

      {/* Intro */}
      <P>
        Every week, a working DP somewhere takes $500 for a job that warranted $1,500. Not because they lacked the credits, the gear, or the client relationship. Because they guessed at their rate instead of building one.
      </P>
      <P>
        This guide uses data from the No Film School global survey (2,000+ respondents), IATSE Local 600 published rate cards, and working DP rate sheets to give you a specific number to anchor on — broken down by experience level, production type, and market.
      </P>

      {/* TOC */}
      <nav style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "4px", padding: "1.25rem 1.5rem", margin: "2rem 0 3rem" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "0.75rem" }}>On This Page</div>
        <ol style={{ margin: 0, paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {[
            ["#ranges",      "Rate Ranges by Experience Level"],
            ["#production",  "Rates by Production Type"],
            ["#union",       "Union Rates (IATSE Local 600)"],
            ["#market",      "How Location Changes Your Rate"],
            ["#drivers",     "What Drives Your Number Up or Down"],
            ["#weekly",      "Day Rate vs. Weekly Rate"],
            ["#mistakes",    "Five Mistakes That Keep DPs Underpaid"],
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
        The No Film School 2023 survey found US cinematographers lead all camera department roles at a median of $1,000/day. That figure covers everyone from a DP fresh out of film school to a DP shooting Super Bowl spots. The useful breakdown is by tier.
      </P>
      <RateRangeChart />
      <P>
        Emerging DPs (0–3 years) typically work in the $300–$600 range, often on shorts and music videos where building a reel takes priority over rate. Once you have consistent credits and a real portfolio, $800 becomes a reasonable floor — and $1,000–$1,500/day is where most mid-level working DPs in mid-size markets report landing on commercial and branded content jobs.
      </P>
      <P>
        Senior DPs with 8–14 years of production behind them command $1,500–$3,500/day depending on market and production type. At the expert tier, the ceiling opens up significantly — major national campaigns and prestige projects can run $5,000–$20,000/day, though those figures come from a small percentage of working DPs.
      </P>
      <Callout>
        The Assemble 2024 guide pegs the non-union commercial DP average at $650–$750/day. That number skews low because it includes newer entrants and market weighting toward corporate and regional work. For an experienced non-union DP targeting commercial clients, $1,000–$1,800/day is the more relevant benchmark.
      </Callout>

      {/* ── Section 2 ── */}
      <H2 id="production">Rates by Production Type</H2>
      <P>
        What you shoot matters as much as how long you have been shooting. A DP with seven years of experience can legitimately command $2,500/day on a national spot and $900/day on a documentary in the same month. The production type tells you what budget class you are operating in, and that sets the ceiling.
      </P>
      <ProductionTypeTable />
      <P>
        Corporate and branded content is the bread and butter for most working DPs outside of LA and NYC. The range is wide because Fortune 500 internal productions pay like commercial work while small business content pays like indie film. Always ask about the client before quoting.
      </P>

      {/* ── Section 3 ── */}
      <H2 id="union">Union Rates (IATSE Local 600)</H2>
      <P>
        Union rates set a hard floor on production budgets that include IATSE crew. On a commercial in Los Angeles, the minimum call for a union DP under the AICP agreement is $1,234/day — and that is before overtime, which kicks in at 1.5x after hour 8 and double-time after hour 12. A standard 10-hour commercial day for a union DP runs closer to $1,700.
      </P>
      <UnionRateTable />
      <P>
        Feature film minimums look lower on paper because the operative unit is the week, not the day. A union DP on a studio feature earns a minimum of roughly $5,163/week under the Basic Agreement. Daily-hire rates on features are contractual floors — most working DPs negotiate overscale above them.
      </P>
      <P>
        Non-union markets, particularly right-to-work states across the Midwest and South, have no equivalent floor. That is where the race to the bottom happens most visibly. Knowing the union floor is useful even if you never carry a card, because it tells you what the market establishes as fair in a fully-budgeted production.
      </P>

      {/* ── Section 4 ── */}
      <H2 id="market">How Location Changes Your Rate</H2>
      <P>
        Production density drives rates. LA and NYC carry a roughly 30% premium over mid-market rates because the budgets are bigger, the expectations are higher, and the competition to hire experienced crew is real. Small and secondary markets run 10–20% below the national baseline.
      </P>
      <MarketMultiplierChart />
      <P>
        Atlanta has grown enough as a production hub that union rates on studio-originated projects approach LA levels. Chicago historically runs close to NYC on union commercial work. Beyond those anchors, the further you are from a production-dense market, the more the local commercial and corporate budgets compress.
      </P>
      <P>
        One dynamic worth noting: a DP based in a secondary market but working for clients in LA or NYC can command close to major-market rates if they travel for those shoots. Several working DPs report that out-of-market jobs consistently pay their full rate while local gigs require negotiation. If you have the credits to attract remote clients, price accordingly.
      </P>

      {/* ── Section 5 ── */}
      <H2 id="drivers">What Drives Your Number Up or Down</H2>

      <H3>Camera Package</H3>
      <P>
        Your gear is a separate revenue center. A DP bringing an Arri Alexa Mini LF package can add $1,000–$2,000/day on top of their labor rate. Basic mirrorless kits (Sony FX6, Blackmagic) run $200–$400/day. Mid-range cinema packages (RED Komodo, Sony Venice) land in the $500–$800 range. The industry standard is to invoice kit fees as a separate line item — mixing them into your day rate obscures both your labor value and your gear ROI.
      </P>

      <H3>Budget Signal</H3>
      <P>
        Ask the production what they have budgeted for the DP before you name a number. Crew size telegraphs budget quickly — a 20-person crew signals resources; two people shooting on gimbals signals the opposite. Experienced DPs openly acknowledge pricing in tiers: the rate for a Fortune 500 campaign is not the rate for an indie filmmaker, even if the shoot day looks similar.
      </P>

      <H3>Turnaround and Overtime</H3>
      <P>
        Short turnarounds (under 10 hours between wrap and next call) trigger forced call penalties. The next day runs at 1.5x from the first hour. Standard overtime kicks in after 10 hours, double-time after 12–14 depending on the agreement. For non-union work, these protections only hold if you build them into your contract. Most experienced DPs working non-union specify their own OT rates in writing before the shoot.
      </P>

      <H3>Rush Bookings</H3>
      <P>
        A 48-hour turnaround booking warrants a 25% premium. A 24-hour turnaround warrants 50%. Those figures are not universal, but they are widely accepted as reasonable across production communities. If a client cannot find someone else at the last minute, you are holding leverage — use it.
      </P>

      <H3>Travel Days</H3>
      <P>
        Travel days bill at half your day rate. Scout days and prep days also typically bill at 50%. They require your time and commitment even if no camera rolls. Leaving these unpaid is one of the most common ways DPs quietly undercharge on location productions.
      </P>

      {/* ── Section 6 ── */}
      <H2 id="weekly">Day Rate vs. Weekly Rate</H2>
      <P>
        The standard discount for a weekly booking is 4x your day rate — you work five or six days and bill for four. That structure gives the production a discount for guaranteed volume while protecting your effective daily earnings from collapsing.
      </P>
      <P>
        The same logic applies to equipment: gear commonly bills on "4-day weeks," meaning a production shooting six days pays for four days of rental per week. It is a convention the industry arrived at as a reasonable compromise between production efficiency and crew sustainability.
      </P>
      <Callout>
        A guaranteed two-week booking at $900/effective day beats two separate one-day jobs at $1,200/day if finding work is uncertain. The discount is worth something — but it should be modest. Offering 40%+ weekly discounts without confirmed days in writing is where DPs lose real money.
      </Callout>

      {/* ── Section 7 ── */}
      <H2 id="mistakes">Five Mistakes That Keep DPs Underpaid</H2>

      <H3>1. Pricing labor below your cost</H3>
      <P>
        Most DPs calculate their rate based on visible shoot hours and ignore the overhead: gear depreciation, production insurance, non-billable client management, slow periods, quarterly taxes. The gap between what you bill and what you actually earn is typically 20–40% wider than you think. Build your overhead into your rate before you quote anything.
      </P>

      <H3>2. A 100% close rate</H3>
      <P>
        If you book every job you bid, your rate is too low. A healthy close rate for an experienced DP is 25–40%. Booking 80–90% of inquiries means you are leaving money on every job you take.
      </P>

      <H3>3. Not raising rates after significant credits</H3>
      <P>
        A major brand commercial, a network TV credit, or a festival feature warrants a rate reassessment. Many DPs keep the rate they set early in their career because they fear client churn. The clients who leave when you raise your rate were not your long-term clients anyway.
      </P>

      <H3>4. Working below rate on "prestigious" projects</H3>
      <P>
        High-budget productions framed as passion projects or portfolio builders rarely deliver the promised upside. A production that can afford a 20-person crew and a full lighting package can afford to pay a fair DP rate. When a well-resourced production asks you to cut your rate, you are subsidizing their margin.
      </P>

      <H3>5. Skipping the budget conversation</H3>
      <P>
        Quoting blind — naming your rate before understanding the production's budget — forces you to guess. Producers know their budget. Ask directly: "What do you have budgeted for the DP?" You will either get a number you can work with or a signal that the project is not worth your time.
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
          Enter your take-home goal. The calculator adds self-employment tax, health insurance, and an optional profit margin — then tells you the day rate you need to clear it, and where that rate falls in the market for your discipline.
        </p>
        <Link
          href="/?d=Cinematographer+%2F+DP"
          style={{
            display:       "inline-block",
            background:    "var(--accent)",
            color:         "#000",
            fontFamily:    "var(--mono)",
            fontSize:      "0.85rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontWeight:    "bold",
            padding:       "0.9rem 2rem",
            borderRadius:  "4px",
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
            ["No Film School Global Cinematography Survey (2023)", "https://nofilmschool.com/cinematography-survey-results"],
            ["IATSE Local 600 Rate Cards (2024–2025)", "https://www.icg600.com/rates"],
            ["IATSE Commercial Rates Guide (AICP Agreement)", "https://cmsproductions.com/blog/iatse-commercial-rates/"],
            ["Assemble — Day Rates for Film Crew 2024", "https://www.onassemble.com/blog/a-comprehensive-guide-to-day-rates-for-film-crew-2021"],
            ["Ambient Skies — Common Rates for Camera Operators and DPs", "https://ambientskies.com/blog/filmmaking/what-are-common-rates-for-camera-operators-dps-other-dits/"],
            ["Storyhunter Day Rate Guide for Video Production Roles", "https://medium.com/storyhunter/what-are-day-rates-for-video-production-roles-heres-your-go-to-guide-59a0be54e037"],
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
