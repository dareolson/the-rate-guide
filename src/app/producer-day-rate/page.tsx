// ==============================================
// /producer-day-rate
// SEO landing page targeting:
//   "producer day rate 2026"
//   "how much should a freelance producer charge"
//   "line producer day rate"
//   "freelance film producer rates"
//
// Data sources:
//   - Producers Guild of America (PGA) 2024 rate survey
//   - IATSE / DGA adjacent rate benchmarks
//   - ProductionHub 2025 freelance producer survey
//   - Mandy.com producer rate data 2025
//   - Working practitioners (Stage 32, Production Beast community)
// ==============================================

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Producer Day Rate: What to Charge in 2026",
  description:
    "Real day rate data for freelance producers in 2026. Line producers, field producers, and executive producers — rates by production type, budget tier, and when a percentage deal beats a day rate.",
  alternates: { canonical: "/producer-day-rate" },
  openGraph: {
    title: "Producer Day Rate: What to Charge in 2026",
    description:
      "Rate ranges by experience level and production type — with line producer budget tiers, EP percentage structures, and the hidden costs that make most producer day rates too low.",
    url: "https://therateguide.com/producer-day-rate",
    images: [
      {
        url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&q=80&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Film production clapperboard on set",
      },
    ],
  },
};

// ==============================================
// CHART COMPONENTS
// ==============================================

function RateRangeChart() {
  const tiers = [
    { label: "Entry",  years: "0–2 yrs",  range: "$400–$650/day",    min: 400,  max: 650,  color: "#706860" },
    { label: "Mid",    years: "3–6 yrs",  range: "$650–$1,100/day",  min: 650,  max: 1100, color: "#b0a898" },
    { label: "Senior", years: "7–12 yrs", range: "$1,100–$1,800/day",min: 1100, max: 1800, color: "#d4920a" },
    { label: "Expert", years: "12+ yrs",  range: "$1,800–$3,500/day",min: 1800, max: 3500, color: "#e8e0d0" },
  ];
  const scale = 3600;

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
        <span>$900</span>
        <span>$1,800</span>
        <span>$3,600+</span>
      </div>
    </div>
  );
}

function ProductionTypeTable() {
  const rows = [
    { type: "Social / Creator content",        range: "$350–$600",    note: "Often combined with other roles — coordinator, shooter, editor" },
    { type: "Corporate / branded content",     range: "$600–$1,000",  note: "Most consistent freelance volume; Fortune 500 clients pay at top of range" },
    { type: "Documentary",                     range: "$700–$1,200",  note: "Longer engagements; line producer rate depends on total budget" },
    { type: "Commercial (regional)",           range: "$800–$1,200",  note: "Regional spots with agency involvement" },
    { type: "Commercial (national)",           range: "$1,200–$2,500",note: "Major brand campaigns; AICP budgets drive top-of-range rates" },
    { type: "Episodic TV (non-union)",         range: "$1,000–$1,600",note: "Field producer or segment producer on unscripted" },
    { type: "Episodic TV (union / streamer)",  range: "$1,500–$2,500",note: "DGA adjacent; negotiated per show" },
    { type: "Feature film (line producer)",    range: "$1,800–$3,500",note: "Often a flat fee or percentage deal above $1M budget" },
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

function LineProcuderBudgetTable() {
  const rows = [
    { budget: "Under $50K",        dayRate: "$500–$800",    note: "Often a producing coordinator doing LP work" },
    { budget: "$50K–$250K",        dayRate: "$800–$1,200",  note: "Core commercial and branded content tier" },
    { budget: "$250K–$1M",         dayRate: "$1,200–$2,000",note: "Agency commercials, mid-tier features, docu-series" },
    { budget: "$1M–$5M",           dayRate: "$1,800–$2,800",note: "Flat fee or hybrid rate + back-end common here" },
    { budget: "$5M+",              dayRate: "Negotiated",   note: "Percentage deal standard: 3–5% of above-the-line budget" },
  ];

  return (
    <div style={{ margin: "2rem 0", overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--mono)", fontSize: "0.82rem" }}>
        <thead>
          <tr>
            {["Production Budget", "LP Day Rate", "Notes"].map((h) => (
              <th key={h} style={{ textAlign: "left", padding: "0.6rem 0.75rem", borderBottom: "2px solid var(--border)", color: "var(--text-dim)", letterSpacing: "0.05em", textTransform: "uppercase", fontSize: "0.72rem" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.budget} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
              <td style={{ padding: "0.65rem 0.75rem", color: "var(--text)", borderBottom: "1px solid var(--border)" }}>{row.budget}</td>
              <td style={{ padding: "0.65rem 0.75rem", color: "var(--accent)", borderBottom: "1px solid var(--border)" }}>{row.dayRate}</td>
              <td style={{ padding: "0.65rem 0.75rem", color: "var(--text-dim)", borderBottom: "1px solid var(--border)" }}>{row.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RoleComparisonChart() {
  const roles = [
    { label: "Producing Coordinator", range: "$350–$600",    min: 350,  max: 600,  color: "#706860" },
    { label: "Associate Producer",    range: "$500–$900",    min: 500,  max: 900,  color: "#8a7e72" },
    { label: "Field Producer",        range: "$700–$1,200",  min: 700,  max: 1200, color: "#b0a898" },
    { label: "Line Producer",         range: "$900–$2,000",  min: 900,  max: 2000, color: "#d4920a" },
    { label: "Executive Producer",    range: "$1,500–$3,500",min: 1500, max: 3500, color: "#e8e0d0" },
  ];
  const scale = 3600;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", margin: "2rem 0" }}>
      {roles.map((role) => {
        const leftPct  = (role.min / scale) * 100;
        const widthPct = Math.min(((role.max - role.min) / scale) * 100, 100 - leftPct);
        return (
          <div key={role.label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", fontWeight: 700, color: role.color }}>
                {role.label}
              </span>
              <span style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", color: role.color }}>
                {role.range}
              </span>
            </div>
            <div style={{ background: "var(--border)", borderRadius: "3px", height: "10px", position: "relative" }}>
              <div style={{
                position: "absolute",
                left: `${leftPct}%`,
                width: `${widthPct}%`,
                background: role.color,
                height: "100%",
                borderRadius: "3px",
              }} />
            </div>
          </div>
        );
      })}
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--mono)", fontSize: "0.7rem", color: "var(--text-dim)" }}>
        <span>$0</span>
        <span>$900</span>
        <span>$1,800</span>
        <span>$3,600+</span>
      </div>
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
export default function ProducerDayRatePage() {
  return (
    <article style={{ maxWidth: "720px", margin: "0 auto", padding: "3rem 1.5rem 6rem" }}>

      {/* Hero Image */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/7", borderRadius: "6px", overflow: "hidden", marginBottom: "3rem" }}>
        <Image
          src="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&q=80&auto=format&fit=crop"
          alt="Film production clapperboard on set"
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
        What Should a Freelance Producer Charge Per Day in 2026?
      </h1>

      {/* Intro */}
      <P>
        Producer is the most title-inflated role in production. A 22-year-old coordinating a YouTube shoot and a 20-year veteran managing a $3M commercial budget both call themselves producers. That range makes rate research harder than it is for any other discipline — and it means producers are more likely than anyone else to underprice themselves by anchoring to the wrong end of the market.
      </P>
      <P>
        This guide draws from the Producers Guild of America 2024 rate survey, ProductionHub's 2025 freelance producer data, Mandy.com rate benchmarks, and working practitioners in the Stage 32 and Production Beast communities to give you real numbers — by role, experience level, production budget, and production type.
      </P>

      {/* TOC */}
      <nav style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "4px", padding: "1.25rem 1.5rem", margin: "2rem 0 3rem" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "0.75rem" }}>On This Page</div>
        <ol style={{ margin: 0, paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {[
            ["#ranges",      "Rate Ranges by Experience Level"],
            ["#roles",       "Rates by Role: Coordinator to EP"],
            ["#production",  "Rates by Production Type"],
            ["#lineproducer","Line Producer Rates by Budget Tier"],
            ["#percentage",  "When a Percentage Deal Beats a Day Rate"],
            ["#hidden",      "The Hidden Costs Producers Forget to Price"],
            ["#mistakes",    "Six Mistakes That Keep Producers Underpaid"],
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
        ProductionHub's 2025 data puts the median freelance producer day rate at $850, with the top quartile clearing $1,400 or more. Those numbers track with what working producers report in practitioner communities — entry-level producers (often doing coordinator work under a producer title) land in the $400–$650 range, while senior producers with a track record on national commercials or streaming series regularly bill $1,500–$2,500.
      </P>
      <RateRangeChart />
      <P>
        The expert tier — executive producers with a developed client roster and credits on major brand campaigns or feature projects — bills $1,800–$3,500 per day for active production work, and often structures deals differently than everyone else. At that level, day rates give way to project fees, production company markups, and percentage arrangements.
      </P>
      <Callout>
        ZipRecruiter's April 2026 data puts the average freelance film producer salary at $78,400/year. At 120 billable days — a realistic freelance volume once you account for development, pitching, and slow months — that income requires a day rate of $653. Most producers who read that number immediately recognize they are billing below it.
      </Callout>

      {/* ── Section 2 ── */}
      <H2 id="roles">Rates by Role: Coordinator to EP</H2>
      <P>
        The producer title covers a wider range of actual work than any other credit in production. What you do on the job determines what you should charge — not what you call yourself.
      </P>
      <RoleComparisonChart />

      <H3>Producing Coordinator</H3>
      <P>
        Logistics, scheduling, vendor management, and production support. Often the entry point to producing. The work is execution-focused; creative and financial decision-making sits above this role. $350–$600/day in most markets.
      </P>

      <H3>Associate Producer</H3>
      <P>
        Varies wildly by context. In branded content and corporate, APs often handle field logistics and client communication. In unscripted TV, they may write segments and manage story. In documentary, they may run entire shoot days independently. $500–$900/day, with TV APs at the top of that range.
      </P>

      <H3>Field Producer</H3>
      <P>
        Runs shoots in the field — talent, location, crew, and schedule. Carries significant real-time decision-making authority. Common in news, documentary, branded content, and reality. $700–$1,200/day depending on production scale and market.
      </P>

      <H3>Line Producer</H3>
      <P>
        Owns the budget and the below-the-line. Hires crew, negotiates vendor deals, manages cash flow, and keeps the production solvent. The LP is accountable for the number — not just the schedule. $900–$2,000/day, scaling with total production budget. (See the budget tier table below.)
      </P>

      <H3>Executive Producer</H3>
      <P>
        Client-facing, relationship-driven, financially responsible for the overall deal. On smaller productions, the EP may also line produce. On larger ones, the EP brings in the work, closes the deal, and oversees multiple projects simultaneously. $1,500–$3,500/day for active production involvement — though EPs on large budgets often work on project fees or company markup rather than a personal day rate.
      </P>

      {/* ── Section 3 ── */}
      <H2 id="production">Rates by Production Type</H2>
      <P>
        Budget class drives producer rates more directly than in most other disciplines. A DP negotiates based on their reel; a producer negotiates based on what they are responsible for managing. Larger budgets mean more financial exposure and more complexity — the rate reflects that.
      </P>
      <ProductionTypeTable />
      <P>
        Corporate and branded content is where most mid-market freelance producers find consistent work. The briefs are clear, the clients are professional, and Fortune 500 internal productions pay at the top of the range. The trap is staying in that tier: branded content rates rarely break $1,200/day for a field producer, and the ceiling requires moving into agency commercial work or unscripted television to clear.
      </P>

      {/* ── Section 4 ── */}
      <H2 id="lineproducer">Line Producer Rates by Budget Tier</H2>
      <P>
        A line producer's rate scales with the production budget because the budget determines the scope of the LP's financial responsibility. Managing $80,000 in vendor contracts is not the same job as managing $1.2M — and it should not be priced the same.
      </P>
      <LineProcuderBudgetTable />
      <Callout>
        The industry benchmark most working LPs use: your day rate should represent roughly 1–2% of the total production budget for sub-$500K projects. On a $200K branded content shoot, that puts the LP at $2,000–$4,000 for a two-day production — $1,000–$2,000/day. If you are billing $650/day on a $300K shoot, you are underpriced relative to your financial exposure.
      </Callout>

      {/* ── Section 5 ── */}
      <H2 id="percentage">When a Percentage Deal Beats a Day Rate</H2>
      <P>
        Above $1M in total production budget, the conversation shifts. Day rates become unwieldy for both sides — the client does not want to count days, and the producer's exposure is high enough that a day rate calculation undersells the risk they are absorbing.
      </P>
      <P>
        The standard EP percentage structure on larger productions: 3–5% of the above-the-line budget, sometimes with a below-the-line production fee layered on top. On a $3M feature, a 4% EP fee is $120,000 — the equivalent of $1,500/day over 80 days. That same producer billing a $1,800/day rate over 80 days earns $144,000, so a day rate can still win — but only if the project actually runs that long and you track every day carefully.
      </P>
      <P>
        Percentage deals favor producers who close projects fast and run efficient productions. Day rates favor producers on projects with undefined or expanding scopes. Know which one you are walking into before you negotiate.
      </P>

      {/* ── Section 6 ── */}
      <H2 id="hidden">The Hidden Costs Producers Forget to Price</H2>
      <P>
        Producers carry financial exposure that other production roles do not. A cinematographer who quotes too low loses margin. A producer who quotes too low may end up personally covering shortfalls, eating vendor invoices, or working unpaid weeks because the project ran long. These are not hypothetical risks — they are standard producing experiences.
      </P>

      <H3>Pre-production is unbillable by default</H3>
      <P>
        Most producers spend two to four weeks in pre-production for every week of actual shoot. Scouting, budgeting, vendor outreach, permitting, casting, and client calls all happen before a camera rolls. If your day rate only covers shoot days, you are giving pre-production away. Either build pre-pro days into the contract explicitly or price your shoot-day rate high enough to absorb the overhead.
      </P>

      <H3>Post-production supervision is a separate scope</H3>
      <P>
        On branded content and commercial work, producers are often expected to manage the post process — coordinating with editors, managing client reviews, chasing approvals, and delivering final assets. That work can run another two to four weeks after the shoot. If it is not in your contract, you will do it anyway because the client expects it. Price it in advance.
      </P>

      <H3>Vendor payment timing creates cash flow exposure</H3>
      <P>
        Producers are often the last to get paid on a project. Vendors need to be paid on delivery or shortly after. If the client is on net-60 terms and you fronted crew costs or equipment deposits, you are financing the production. Factor payment schedule, deposit requirements, and client payment terms into your negotiation — not just your day rate.
      </P>

      <H3>Revision rounds and client indecision are billable</H3>
      <P>
        A client who changes the shot list two days before the shoot, requests a reshoot after delivery, or adds a second deliverable after approval has changed the scope. Producers who do not have change order language in their contracts absorb those costs. The contract should specify what is included, what triggers a change order, and what the change order rate is.
      </P>

      {/* ── Section 7 ── */}
      <H2 id="mistakes">Six Mistakes That Keep Producers Underpaid</H2>

      <H3>1. Pricing to the shoot, not the project</H3>
      <P>
        A two-day shoot with four weeks of pre-production and three weeks of post is a nine-week project. If you bill $1,000/day for two shoot days, you earned $2,000 for nine weeks of work. Price the full project — pre-production days, shoot days, post-supervision days — or use a flat project fee that accounts for actual time.
      </P>

      <H3>2. No contract before pre-production begins</H3>
      <P>
        Producers start working the moment a client says yes. Location scouts, preliminary budgets, crew inquiries — it all starts immediately. Without a signed contract and deposit, you are working at risk. Every hour of pre-production you spend before a contract is signed is an hour you may not get paid for. Deposit on signature, contract before work, no exceptions.
      </P>

      <H3>3. Taking on financial liability without a fee for it</H3>
      <P>
        Some clients expect producers to front costs — equipment deposits, location fees, crew advances — and get reimbursed on delivery. If you are floating production costs, you are functioning as a lender. That service has a price. A production finance fee (typically 2–5% of costs advanced) is standard practice and worth including in your contract.
      </P>

      <H3>4. Underpricing because the project is interesting</H3>
      <P>
        Documentary work, passion projects, and mission-driven productions attract producers who discount their rates because the work matters to them. Discounting is a choice — but it should be a deliberate one, not a default. Decide your floor rate, price from there, and offer a discount as a line item rather than simply quoting low. That makes the discount visible and prevents it from becoming the new baseline.
      </P>

      <H3>5. Not raising rates after significant credits</H3>
      <P>
        A national commercial credit, a streaming series producing credit, or a feature film LP credit changes your market position. Existing clients anchor to your original rate. New clients set a fresh anchor. The fastest path to a higher rate is quoting a higher rate with the next new client — not renegotiating with clients who already have a number in their head.
      </P>

      <H3>6. Conflating producing with directing</H3>
      <P>
        On low-budget productions, producers often direct as well. That is two jobs. If you are writing the shot list, directing talent, and also managing the budget and vendor contracts, you should be billing a combined rate that reflects both roles — not the lower of the two. Define your role clearly in the contract and price accordingly.
      </P>

      {/* ── CTA ── */}
      <div id="calculate" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "6px", padding: "2rem", marginTop: "3.5rem", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "0.75rem" }}>
          Free Calculator
        </div>
        <h2 style={{ fontFamily: "var(--sans)", fontSize: "1.4rem", fontWeight: 700, color: "var(--text)", margin: "0 0 0.75rem", lineHeight: 1.3 }}>
          Find the day rate that covers what you need to clear
        </h2>
        <p style={{ fontFamily: "var(--sans)", fontSize: "0.95rem", color: "var(--text-mid)", margin: "0 0 1.5rem", lineHeight: 1.7 }}>
          Enter your take-home goal. The calculator adds self-employment tax, health insurance, and an optional profit margin — then shows you the day rate you need and how it compares to market floors for producers at your experience level.
        </p>
        <Link
          href="/?d=Producer"
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
            ["Producers Guild of America — Rate & Compensation Resources", "https://www.producersguild.org"],
            ["ProductionHub — 2025 Freelance Producer Rate Survey", "https://www.productionhub.com"],
            ["Mandy.com — Producer Day Rate Data 2025", "https://www.mandy.com"],
            ["ZipRecruiter — Freelance Film Producer Salary (April 2026)", "https://www.ziprecruiter.com/Salaries/Freelance-Film-Producer-Salary"],
            ["Stage 32 — Producer Rate Discussion", "https://www.stage32.com"],
            ["Production Beast — Line Producer Community", "https://www.productionbeast.com"],
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
