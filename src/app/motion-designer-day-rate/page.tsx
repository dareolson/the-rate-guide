// ==============================================
// /motion-designer-day-rate
// SEO landing page targeting:
//   "motion designer day rate 2026"
//   "how much should a freelance motion designer charge"
//   "freelance motion design rates"
//   "after effects freelance day rate"
//
// Data sources:
//   - School of Motion 2024 State of the Industry Survey
//   - ZipRecruiter April 2026 dataset
//   - IATSE Local 839 (The Animation Guild) 2024–27 Majors Agreement
//   - Motionographer community / practitioner data
// ==============================================

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Motion Designer Day Rate: What to Charge in 2026",
  description:
    "Real day rate data for freelance motion designers in 2026. Rates by experience, specialization, and production type — 2D vs. 3D premiums, what agencies actually pay, and the mistakes that quietly compress motion designer margins.",
  alternates: { canonical: "/motion-designer-day-rate" },
  openGraph: {
    title: "Motion Designer Day Rate: What to Charge in 2026",
    description:
      "Rate ranges by experience level, specialization, and market — drawn from the School of Motion 2024 industry survey, IATSE Local 839 rate cards, and practitioner data.",
    url: "https://therateguide.com/motion-designer-day-rate",
    images: [
      {
        url: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&q=80&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Motion designer working at a creative workstation",
      },
    ],
  },
};

// ==============================================
// CHART COMPONENTS
// ==============================================

function RateRangeChart() {
  const tiers = [
    { label: "Entry",   years: "0–2 yrs",  range: "$350–$600/day",    min: 350,  max: 600,  color: "#706860" },
    { label: "Mid",     years: "3–6 yrs",  range: "$600–$1,000/day",  min: 600,  max: 1000, color: "#b0a898" },
    { label: "Senior",  years: "7–12 yrs", range: "$1,000–$1,500/day",min: 1000, max: 1500, color: "#d4920a" },
    { label: "Expert",  years: "12+ yrs",  range: "$1,500–$2,500/day",min: 1500, max: 2500, color: "#e8e0d0" },
  ];
  const scale = 2600;

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
        <span>$650</span>
        <span>$1,300</span>
        <span>$2,600+</span>
      </div>
    </div>
  );
}

function SpecializationChart() {
  const specs = [
    { label: "2D Generalist",               range: "$500–$900",   min: 500,  max: 900,  color: "#706860" },
    { label: "2D + Character Animation",    range: "$700–$1,100", min: 700,  max: 1100, color: "#8a7e72" },
    { label: "3D Generalist (C4D/Blender)", range: "$750–$1,200", min: 750,  max: 1200, color: "#b0a898" },
    { label: "3D + VFX / Compositing",      range: "$1,000–$1,600",min: 1000,max: 1600, color: "#d4920a" },
    { label: "Houdini FX Artist",           range: "$1,400–$2,500",min: 1400,max: 2500, color: "#e8e0d0" },
  ];
  const scale = 2600;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", margin: "2rem 0" }}>
      {specs.map((spec) => {
        const leftPct  = (spec.min / scale) * 100;
        const widthPct = Math.min(((spec.max - spec.min) / scale) * 100, 100 - leftPct);
        return (
          <div key={spec.label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", fontWeight: 700, color: spec.color }}>
                {spec.label}
              </span>
              <span style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", color: spec.color }}>
                {spec.range}
              </span>
            </div>
            <div style={{ background: "var(--border)", borderRadius: "3px", height: "10px", position: "relative" }}>
              <div style={{
                position: "absolute",
                left: `${leftPct}%`,
                width: `${widthPct}%`,
                background: spec.color,
                height: "100%",
                borderRadius: "3px",
              }} />
            </div>
          </div>
        );
      })}
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--mono)", fontSize: "0.7rem", color: "var(--text-dim)" }}>
        <span>$0</span>
        <span>$650</span>
        <span>$1,300</span>
        <span>$2,600+</span>
      </div>
    </div>
  );
}

function ProductionTypeTable() {
  const rows = [
    { type: "Social / Short-form content",     range: "$300–$500",    note: "High volume, commoditized — rate ceiling limited by creator budgets" },
    { type: "E-learning / Explainer video",    range: "$450–$750",    note: "Large market; corporate clients set the ceiling" },
    { type: "Broadcast design (local/regional)",range: "$600–$900",   note: "Station promos, lower thirds, ID packages" },
    { type: "Broadcast design (national)",     range: "$900–$1,400",  note: "Network rebrand campaigns, opener packages, sports graphics" },
    { type: "Commercial / Advertising",        range: "$900–$1,600",  note: "Highest-paying freelance category outside film VFX" },
    { type: "Film title sequences",            range: "$1,200–$2,500",note: "High prestige, usually project-based — budget varies widely" },
    { type: "Feature VFX / Compositing",       range: "$1,000–$1,800",note: "Often billed through VFX houses; IATSE-adjacent on union productions" },
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
    { role: "Journey-level Animator",          daily: "~$689/day",  weekly: "$3,445/wk", note: "Studio staff — Disney, WB, DreamWorks, Netflix Animation" },
    { role: "Assistant Animator",              daily: "~$534/day",  weekly: "$2,672/wk", note: "" },
    { role: "Story Artist",                    daily: "~$750/day",  weekly: "$3,750/wk", note: "Storyboard/visual development; top tier at major studios" },
    { role: "Layout Artist",                   daily: "~$620/day",  weekly: "$3,100/wk", note: "" },
    { role: "Character TD / Technical Artist", daily: "~$720/day",  weekly: "$3,600/wk", note: "Rigging and pipeline — adjacent to motion design in studios" },
  ];

  return (
    <div style={{ margin: "2rem 0", overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--mono)", fontSize: "0.82rem" }}>
        <thead>
          <tr>
            {["Role", "Daily Equivalent", "Weekly Minimum", "Notes"].map((h) => (
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
        Source: IATSE Local 839 (The Animation Guild) 2024–27 Majors Agreement. These are studio staff minimums — not freelance rates. Daily equivalents calculated at weekly minimum ÷ 5. Most guild members are hired on weekly deals.
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
export default function MotionDesignerDayRatePage() {
  return (
    <article style={{ maxWidth: "720px", margin: "0 auto", padding: "3rem 1.5rem 6rem" }}>

      {/* Hero Image */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/7", borderRadius: "6px", overflow: "hidden", marginBottom: "3rem" }}>
        <Image
          src="https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&q=80&auto=format&fit=crop"
          alt="Motion designer at a creative workstation"
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
        What Should a Freelance Motion Designer Charge Per Day in 2026?
      </h1>

      {/* Intro */}
      <P>
        Motion design sits at an awkward intersection: part animation, part graphic design, part post-production. That ambiguity costs motion designers money. Without a dominant union floor or a single salary survey the industry rallies around, most freelancers price by feel — usually too low, and without distinguishing between a 2D kinetic type loop and a Houdini fluid simulation that requires six hours of render time.
      </P>
      <P>
        This guide draws from the School of Motion 2024 State of the Industry survey, ZipRecruiter's April 2026 dataset, IATSE Local 839 rate cards, and working practitioners in the Motionographer community to give you real numbers — by experience level, specialization, production type, and market.
      </P>

      {/* TOC */}
      <nav style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "4px", padding: "1.25rem 1.5rem", margin: "2rem 0 3rem" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "0.75rem" }}>On This Page</div>
        <ol style={{ margin: 0, paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {[
            ["#ranges",         "Rate Ranges by Experience Level"],
            ["#specialization", "How Specialization Changes Everything"],
            ["#production",     "Rates by Production Type"],
            ["#union",          "Union Rates (IATSE Local 839)"],
            ["#billing",        "Day Rate vs. Project Rate vs. Retainer"],
            ["#location",       "Location and the Remote Advantage"],
            ["#mistakes",       "Six Mistakes That Keep Motion Designers Underpaid"],
            ["#calculate",      "Calculate Your Rate"],
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
        ZipRecruiter's April 2026 data puts the average motion designer salary at $74,500 per year. That figure is a blunt instrument — it averages 2D generalists doing social media content with Houdini FX artists on film VFX. At 120 billable days per year (a realistic freelance volume when you account for prospecting, admin, and slow months), that average income requires a day rate of $621 just to maintain it.
      </P>
      <RateRangeChart />
      <P>
        Entry-level designers (0–2 years) typically land in the $350–$600 range, working on YouTube, social content, and e-learning. Once you have a real portfolio and repeat clients, $600–$1,000 is achievable. Senior designers with broadcast, commercial, or streaming credits move into the $1,000–$1,500 range. The expert tier — which generally means a specialized skill like Houdini, feature-level compositing, or a track record on major national campaigns — starts at $1,500 and runs well past $2,000 for the right job.
      </P>
      <Callout>
        The School of Motion 2024 survey found that the median income for full-time freelance motion designers in major markets sits between $85,000 and $110,000 per year. At 120–140 billable days, that range requires a day rate of $607–$917 at the low end and $786–$917 at the high end. Designers reporting the highest income almost universally cited 3D specialization or commercial agency relationships as the driver.
      </Callout>

      {/* ── Section 2 ── */}
      <H2 id="specialization">How Specialization Changes Everything</H2>
      <P>
        More than any other post-production discipline, motion design income is determined by tool and specialization — not just experience level. A 2D generalist with 10 years of experience and an After Effects-only workflow will price very differently than a 3D generalist with five years of Cinema 4D, and both will price very differently than a Houdini FX artist who can do fluid, fire, and destruction simulations.
      </P>
      <SpecializationChart />

      <H3>Why 3D commands a premium</H3>
      <P>
        3D work is slower, more technically complex, and requires significantly more expensive software. A Cinema 4D license runs $719/year. Houdini FX runs $4,495/year. Render farm costs for complex simulations can run hundreds of dollars per frame on commercial work. When you price 3D work at 2D rates, you are absorbing those costs yourself and charging for a fraction of the actual time the work requires.
      </P>

      <H3>Why Houdini is in a category of its own</H3>
      <P>
        Houdini is the industry standard for procedural VFX — fluid dynamics, destruction, particle systems, pyro effects. The learning curve is steep enough that true Houdini generalists are scarce relative to demand. On film and high-end commercial work, Houdini FX artists routinely bill $1,400–$2,500 per day for solo freelance work. VFX houses pay more, but they also capture the margin between your rate and what they bill the production.
      </P>

      <H3>Character animation is its own market</H3>
      <P>
        Designers who can rig and animate characters — not just move text and shapes, but produce convincing character performance — operate in a separate sub-market. Character animation is slow, exacting, and requires skills that pure motion designers often lack. If you have this capability, separate it from your standard day rate and price it accordingly.
      </P>

      {/* ── Section 3 ── */}
      <H2 id="production">Rates by Production Type</H2>
      <P>
        The production category signals the budget class and defines your ceiling. A motion designer who works primarily in social content will price and earn very differently than one who targets national commercial agencies — even at the same experience level.
      </P>
      <ProductionTypeTable />
      <P>
        Commercial and advertising work is where freelance income peaks for motion designers outside of film VFX. National brands with agency budgets will pay $900–$1,600 per day for strong stylistic work, and top commercial motion designers routinely exceed that on package deals. E-learning is where most mid-market designers find consistent volume — it pays less per day, but the clients are predictable and the briefs are usually clear.
      </P>
      <Callout>
        Broadcast design separates into two distinct markets. Local and regional TV work (station promos, lower thirds, event graphics) sits in the $600–$900 range. National network work — rebrand campaigns, sports graphics packages, opener design — pays $900–$1,400 per day because the deliverables require broadcast-spec precision and the clients know it. The work looks similar. The budgets do not.
      </Callout>

      {/* ── Section 4 ── */}
      <H2 id="union">The Animation Guild (IATSE Local 839)</H2>
      <P>
        IATSE Local 839, The Animation Guild, covers animators, story artists, layout artists, and technical directors at major studios — Disney, Warner Bros., DreamWorks, Netflix Animation, and similar. These are almost exclusively staff positions, not freelance engagements. If you work at a signatory studio, you are covered by the guild. If you freelance for agencies, brands, or production companies, you are not.
      </P>
      <UnionRateTable />
      <P>
        The Animation Guild does not represent freelance motion designers in the same way IATSE Local 600 represents cinematographers or Local 700 represents editors. Most freelance motion design work exists entirely outside any collective bargaining framework. That makes market rates both more negotiable and more variable — and it places the entire burden of rate research on individual designers.
      </P>
      <P>
        The VFX sector — which overlaps significantly with senior motion design work — has been organizing through the VES (Visual Effects Society) and independent efforts at studios like ILM and Weta, but unionization in VFX remains incomplete. If you do film VFX work as a freelancer, union minimums are not your floor. The market is your floor, and the market rewards specialization.
      </P>

      {/* ── Section 5 ── */}
      <H2 id="billing">Day Rate vs. Project Rate vs. Retainer</H2>

      <H3>When day rate works</H3>
      <P>
        Studio bookings, agency jobs with undefined scope, broadcast design sessions where the client needs you in front of a monitor for a fixed number of days. Day rates work well when the work is iterative and the client expects to direct the session. Define your day in writing — 8 or 10 hours, and what your OT rate is beyond that. Render time is a recurring point of friction: if your machine renders overnight for eight hours on a complex 3D job, that is time you cannot bill other clients. Some senior designers charge a render fee or factor expected render time into their day rate explicitly.
      </P>

      <H3>When project rate works</H3>
      <P>
        Defined deliverables with clear specs: a 30-second commercial spot, a set of social cutdowns, a title card package. Project rates reward efficiency and punish scope creep. The contract must specify the deliverable, the number of included revision rounds, and the format. Motion design is particularly vulnerable to format ambiguity — a client who adds "can we also get a vertical version" after approval has just assigned you a full additional cut. Specify deliverable formats, resolutions, color space, and codecs in the contract before frame one.
      </P>

      <H3>When retainer works</H3>
      <P>
        Ongoing brand relationships — a YouTube channel that publishes weekly, a brand that needs recurring social content, an agency with steady motion needs across multiple clients. The risk is scope creep compounding across months. A sustainable retainer specifies the number of deliverables and included revisions per month, with clear overage rates. A retainer that does not cap scope becomes an unpaid subscription to your labor.
      </P>

      <H3>Styleframes are a billable deliverable</H3>
      <P>
        Many agencies and clients request styleframes before committing to production — a set of 4–8 still frames showing the visual direction, palette, and type treatment of a piece. Styleframes take a full day or more to produce well. They are a design deliverable, not a courtesy. Bill for them. A common structure: a half-day styleframe fee for smaller projects, a full day for complex ones. If the client proceeds to production, fold the styleframe fee into the project total. If they do not, you kept the day rate you earned.
      </P>

      {/* ── Section 6 ── */}
      <H2 id="location">Location and the Remote Advantage</H2>
      <P>
        ZipRecruiter's April 2026 data shows a 24% premium for motion designers in New York City over the national average, with Los Angeles running similar. Chicago, Atlanta, and Austin sit roughly 15–25% below major market rates for equivalent work, and most small markets compress further.
      </P>
      <P>
        Motion designers have the most location independence of any production discipline. A cinematographer has to physically be on set. A motion designer's deliverable is a file. Designers in small or mid-market cities who actively pursue client relationships in LA, New York, or with national brands can charge major-market rates for those engagements regardless of where their render farm sits.
      </P>
      <Callout>
        The School of Motion 2024 survey found that remote-first motion designers — those who primarily work with clients in markets larger than their home city — reported median income 30–40% higher than designers who confined their client search to local agencies. The ceiling is where your clients are, not where you are.
      </Callout>
      <P>
        The practical path for a small-market designer: build a portfolio strong enough that a New York or LA agency would hire you without a local referral, then target those agencies directly. One or two national commercial clients changes your income tier faster than raising rates with existing local clients.
      </P>

      {/* ── Section 7 ── */}
      <H2 id="mistakes">Six Mistakes That Keep Motion Designers Underpaid</H2>

      <H3>1. Pricing 3D work at 2D rates</H3>
      <P>
        This is the most common and most expensive mistake in motion design. A 2D kinetic type animation and a 3D product visualization both produce a 30-second file, but they require different tools, different skills, and dramatically different time investments — and the 3D version includes render time that does not exist in 2D work. Treat 3D as a specialty with its own rate. If a client does not understand why it costs more, explain it. If they still do not understand, they are not the right client for 3D work.
      </P>

      <H3>2. Not billing for render time on complex 3D jobs</H3>
      <P>
        A complex fluid simulation or destruction sequence can require hours of render time per frame. On a 10-second shot at 24fps, that is 240 frames. If your machine renders at 30 minutes per frame, that is five solid days of render time — time your machine is blocked and you cannot bill other work. Either factor render time into the day rate explicitly, charge a render fee, or use a render farm and pass the cost through to the client. Eating render costs quietly is one of the fastest ways to compress your effective hourly rate to nothing.
      </P>

      <H3>3. No revision limit on production — especially renders</H3>
      <P>
        In 2D, a revision might mean adjusting a keyframe curve. In 3D, it might mean rebuilding a scene and re-rendering overnight. Without a contract clause that specifies included revision rounds and what happens beyond them, clients have no reason not to keep iterating. Two included revision rounds is standard. Define what a revision is — a content change, a camera move, a color shift — and what each additional round costs. For 3D work specifically, consider specifying that any revision requiring a re-render is a separate billable item.
      </P>

      <H3>4. Giving away creative direction</H3>
      <P>
        Clients hire motion designers partly for execution — and partly for visual judgment, conceptual thinking, and aesthetic decisions. When you develop a concept, propose a style, or build out a moodboard without billing for that time, you are providing a creative service for free. Concept development, visual exploration, and styleframes are billable. Price them, scope them, and put them on the invoice.
      </P>

      <H3>5. Ambiguous delivery specs</H3>
      <P>
        Output format, codec, resolution, frame rate, color space, delivery platform, audio specs — every ambiguity here is a potential re-render. A client who needs a ProRes 4444 master, a 1080p H.264 for broadcast, a vertical crop for social, and a client-approval MP4 has given you four separate deliverables from the same project. That is four exports, potentially four re-encodes, and four rounds of QC. Specify every deliverable in the scope of work before production begins, and price accordingly.
      </P>

      <H3>6. Conflating reputation with rate</H3>
      <P>
        Motion designers with strong reels often under-raise rates because they attribute their bookings to relationships rather than skill. The relationships exist because of the skill. Every significant credit — a national campaign, a streaming title sequence, a network identity package — warrants a rate reassessment on the next engagement. Existing clients anchor to your original number. New clients set a fresh anchor. The fastest path to a higher rate is a higher rate with the next new client.
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
          Enter your take-home goal. The calculator adds self-employment tax, health insurance, and an optional profit margin — then shows you the day rate you need and how it compares to market floors for motion designers at your experience level.
        </p>
        <Link
          href="/?d=Motion+Designer"
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
            ["School of Motion — 2024 State of the Industry Survey", "https://www.schoolofmotion.com/blog/motion-design-salary"],
            ["ZipRecruiter — Motion Designer Salary (April 2026)", "https://www.ziprecruiter.com/Salaries/Motion-Designer-Salary"],
            ["IATSE Local 839 (The Animation Guild) — 2024–27 Majors Wage Rates", "https://animationguild.org/for-producers/wages-working-conditions/"],
            ["Motionographer — Freelance Rates Discussion", "https://motionographer.com"],
            ["SideFX — Houdini FX Pricing", "https://www.sidefx.com/buy/"],
            ["Maxon — Cinema 4D Pricing", "https://www.maxon.net/cinema-4d"],
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
