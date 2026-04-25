// ==============================================
// /guides — Rate Guide index page
// Server component — fully static, SEO-friendly.
// To add a guide: add one entry to GUIDES below.
// ==============================================

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rate Guides — Day Rate Research by Discipline",
  description:
    "Research-backed day rate guides for creative freelancers. Cinematographers, video editors, colorists, motion designers, and more — real data from surveys, union contracts, and working professionals.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Rate Guides — The Rate Guide",
    description:
      "Real day rate data for creative freelancers, by discipline. Stop guessing what to charge.",
    url: "https://therateguide.com/guides",
  },
};

// ==============================================
// POST DATA
// ratePreview: 3 tiers shown as a mini spectrum
// inside the card — gives readers a data hook
// before they click.
// ==============================================
const GUIDES = [
  {
    slug:       "cinematographer-day-rate",
    discipline: "Cinematographer / DP",
    title:      "Cinematographer Day Rate: What to Charge in 2026",
    description:
      "Rate ranges by experience level, production type, and market — drawn from IATSE Local 600 rate cards, No Film School's 2,000-respondent survey, and working DP rate sheets.",
    readTime:   "8 min",
    calcUrl:    "/?d=Cinematographer+%2F+DP",
    image:      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=80&auto=format&fit=crop",
    imageAlt:   "Cinematographer shooting on location",
    ratePreview: [
      { label: "Emerging", range: "$300–$600" },
      { label: "Mid",      range: "$800–$1,500" },
      { label: "Senior",   range: "$1,500–$3,500" },
      { label: "Expert",   range: "$3,500+" },
    ],
  },
  {
    slug:       "video-editor-day-rate",
    discipline: "Video Editor",
    title:      "Video Editor Day Rate: What to Charge in 2026",
    description:
      "Day rate, hourly, and project pricing for freelance editors — from Cutjamm's 2025 salary survey, IATSE Local 700 contracts, and working editor rate sheets.",
    readTime:   "9 min",
    calcUrl:    "/?d=Video+Editor",
    image:      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80&auto=format&fit=crop",
    imageAlt:   "Video editor at workstation",
    ratePreview: [
      { label: "Entry",   range: "$300–$500" },
      { label: "Mid",     range: "$500–$800" },
      { label: "Senior",  range: "$800–$1,200" },
      { label: "Expert",  range: "$1,200+" },
    ],
  },
  {
    slug:       "colorist-day-rate",
    discipline: "Colorist",
    title:      "Colorist Day Rate: What to Charge in 2026",
    description:
      "Rates by experience level, production type, and market — with IATSE Local 700 union minimums, the DaVinci Resolve ownership factor, and the revision trap that quietly kills colorist margins.",
    readTime:   "9 min",
    calcUrl:    "/?d=Colorist",
    image:      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&q=80&auto=format&fit=crop",
    imageAlt:   "Color grading in a dark post-production suite",
    ratePreview: [
      { label: "Emerging", range: "$300–$500" },
      { label: "Mid",      range: "$500–$900" },
      { label: "Senior",   range: "$900–$1,500" },
      { label: "Expert",   range: "$1,500+" },
    ],
  },
  {
    slug:        "motion-designer-day-rate",
    discipline:  "Motion Designer",
    title:       "Motion Designer Day Rate: What to Charge in 2026",
    description:
      "Day rates for freelance motion designers and After Effects artists — by production type, software stack, and market. When to charge separately for design vs. animation.",
    readTime:    "8 min",
    calcUrl:     "/?d=Motion+Designer",
    image:       "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80&auto=format&fit=crop",
    imageAlt:    "Motion graphics on screen",
    ratePreview: [
      { label: "Emerging", range: "$350–$600" },
      { label: "Mid",      range: "$600–$900" },
      { label: "Senior",   range: "$900–$1,200" },
      { label: "Expert",   range: "$1,200+" },
    ],
  },
  {
    slug:        "producer-day-rate",
    discipline:  "Producer",
    title:       "Producer Day Rate: What to Charge in 2026",
    description:
      "Day rates for freelance producers — line producers, field producers, and executive producers. Budget tier, project type, and when a percentage deal makes more sense than a day rate.",
    readTime:    "9 min",
    calcUrl:     "/?d=Producer",
    image:       "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&q=80&auto=format&fit=crop",
    imageAlt:    "Film clapperboard on set",
    ratePreview: [
      { label: "Emerging", range: "$400–$650" },
      { label: "Mid",      range: "$650–$1,000" },
      { label: "Senior",   range: "$1,000–$1,500" },
      { label: "Expert",   range: "$1,500+" },
    ],
  },
  {
    slug:        "camera-operator-day-rate",
    discipline:  "Camera Operator",
    title:       "Camera Operator Day Rate: What to Charge in 2026",
    description:
      "Day rates for freelance camera operators — B-camera, steadicam, gimbal, and ENG. How the rate differs from a DP and when operators carry their own package.",
    readTime:    "7 min",
    calcUrl:     "/?d=Camera+Operator",
    image:       "https://images.unsplash.com/photo-1540655037529-dec987208707?w=1200&q=80&auto=format&fit=crop",
    imageAlt:    "Camera operator on set",
    comingSoon:  true,
    ratePreview: [
      { label: "Emerging", range: "$300–$500" },
      { label: "Mid",      range: "$500–$800" },
      { label: "Senior",   range: "$800–$1,200" },
      { label: "Expert",   range: "$1,200+" },
    ],
  },
  {
    slug:        "sound-mixer-day-rate",
    discipline:  "Sound Mixer",
    title:       "Sound Mixer Day Rate: What to Charge in 2026",
    description:
      "Day rates for freelance production sound mixers — narrative, documentary, commercial, and corporate. Equipment package rates and the difference between production sound and post audio.",
    readTime:    "7 min",
    calcUrl:     "/?d=Sound+Mixer",
    image:       "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&q=80&auto=format&fit=crop",
    imageAlt:    "Sound mixer with audio equipment",
    comingSoon:  true,
    ratePreview: [
      { label: "Emerging", range: "$350–$550" },
      { label: "Mid",      range: "$550–$850" },
      { label: "Senior",   range: "$850–$1,200" },
      { label: "Expert",   range: "$1,200+" },
    ],
  },
  {
    slug:        "gaffer-day-rate",
    discipline:  "Gaffer",
    title:       "Gaffer Day Rate: What to Charge in 2026",
    description:
      "Day rates for freelance gaffers — commercial, narrative, and branded content. Gear package rates, best boy splits, and how lighting complexity drives rate.",
    readTime:    "7 min",
    calcUrl:     "/?d=Gaffer",
    image:       "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f?w=1200&q=80&auto=format&fit=crop",
    imageAlt:    "Film lighting setup on set",
    comingSoon:  true,
    ratePreview: [
      { label: "Emerging", range: "$300–$500" },
      { label: "Mid",      range: "$500–$750" },
      { label: "Senior",   range: "$750–$1,100" },
      { label: "Expert",   range: "$1,100+" },
    ],
  },
];

type Guide = typeof GUIDES[number];

// ==============================================
// RATE PREVIEW BAR
// Mini spectrum shown inside cards.
// Gives a data hook before clicking.
// ==============================================
function RatePreview({ tiers }: { tiers: Guide["ratePreview"] }) {
  return (
    <div style={{
      display:   "grid",
      gridTemplateColumns: `repeat(${tiers.length}, 1fr)`,
      gap:       "2px",
      margin:    "0.1rem 0",
    }}>
      {tiers.map((tier, i) => (
        <div key={tier.label} style={{
          background:  i === tiers.length - 1
            ? "var(--accent)"
            : i === tiers.length - 2
            ? "rgba(212,146,10,0.5)"
            : "var(--border)",
          height:      "3px",
          borderRadius:"2px",
        }} />
      ))}
      <div style={{
        gridColumn:    "1",
        fontFamily:    "var(--mono)",
        fontSize:      "0.68rem",
        color:         "var(--text-dim)",
        paddingTop:    "0.4rem",
        letterSpacing: "0.03em",
      }}>
        {tiers[0].range}
      </div>
      <div style={{
        gridColumn:    `${tiers.length}`,
        fontFamily:    "var(--mono)",
        fontSize:      "0.68rem",
        color:         "var(--accent)",
        paddingTop:    "0.4rem",
        textAlign:     "right",
        letterSpacing: "0.03em",
      }}>
        {tiers[tiers.length - 1].range}
      </div>
    </div>
  );
}

// ==============================================
// FEATURED CARD — full width, image hero
// ==============================================
function FeaturedCard({ guide }: { guide: Guide }) {
  const card = (
    <article className={guide.comingSoon ? "" : "card-hover"} style={{
      position:     "relative",
      border:       "1px solid var(--border)",
      borderRadius: "4px",
      overflow:     "hidden",
      cursor:       guide.comingSoon ? "default" : "pointer",
      opacity:      guide.comingSoon ? 0.6 : 1,
    }}>
      {/* Hero image */}
      <div style={{ position: "relative", height: "420px" }}>
        <Image
          src={guide.image}
          alt={guide.imageAlt}
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          sizes="(max-width: 860px) 100vw, 860px"
          priority
        />
        <div style={{
          position:   "absolute",
          inset:      0,
          background: "linear-gradient(to bottom, rgba(14,14,14,0.2) 0%, rgba(14,14,14,0.7) 50%, rgba(14,14,14,0.97) 100%)",
        }} />
        {/* Discipline badge */}
        <div style={{
          position:      "absolute",
          top:           "1.5rem",
          left:          "1.75rem",
          fontFamily:    "var(--mono)",
          fontSize:      "0.68rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color:         "var(--accent)",
          fontWeight:    700,
          background:    "rgba(14,14,14,0.7)",
          padding:       "0.3rem 0.7rem",
          borderRadius:  "3px",
          border:        "1px solid rgba(212,146,10,0.3)",
        }}>
          {guide.discipline}
        </div>
        {/* Coming soon badge or read time */}
        <div style={{
          position:      "absolute",
          top:           "1.5rem",
          right:         "1.75rem",
          fontFamily:    "var(--mono)",
          fontSize:      "0.68rem",
          color:         guide.comingSoon ? "var(--text-dim)" : "var(--text-dim)",
          letterSpacing: "0.05em",
        }}>
          {guide.comingSoon ? "Coming soon" : `${guide.readTime} read`}
        </div>
        {/* Title — bottom-anchored */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.75rem 2rem 1.5rem" }}>
          <h2 style={{
            fontFamily: "var(--mono)",
            fontSize:   "clamp(1.2rem, 3vw, 1.75rem)",
            fontWeight: 700,
            color:      "var(--text)",
            lineHeight: 1.2,
            margin:     "0 0 0.75rem",
          }}>
            {guide.title}
          </h2>
          <RatePreview tiers={guide.ratePreview} />
        </div>
      </div>
      {/* Description strip */}
      <div style={{
        background:     "var(--surface)",
        padding:        "1.25rem 2rem",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        gap:            "1.5rem",
      }}>
        <p style={{ fontFamily: "var(--sans)", fontSize: "0.88rem", color: "var(--text-mid)", lineHeight: 1.65, margin: 0, flex: 1 }}>
          {guide.description}
        </p>
        {!guide.comingSoon && (
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", whiteSpace: "nowrap", flexShrink: 0 }}>
            Read →
          </span>
        )}
      </div>
    </article>
  );

  return guide.comingSoon
    ? <div>{card}</div>
    : <Link href={`/${guide.slug}`} style={{ textDecoration: "none", display: "block" }}>{card}</Link>;
}

// ==============================================
// GRID CARD — for non-featured posts
// ==============================================
function GridCard({ guide }: { guide: Guide }) {
  const card = (
    <article className={guide.comingSoon ? "" : "card-hover"} style={{
      background:    "var(--surface)",
      border:        "1px solid var(--border)",
      borderRadius:  "4px",
      overflow:      "hidden",
      cursor:        guide.comingSoon ? "default" : "pointer",
      opacity:       guide.comingSoon ? 0.6 : 1,
      height:        "100%",
      display:       "flex",
      flexDirection: "column",
    }}>
      {/* Image */}
      <div style={{ position: "relative", height: "200px", flexShrink: 0 }}>
        <Image
          src={guide.image}
          alt={guide.imageAlt}
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          sizes="(max-width: 600px) 100vw, 420px"
        />
        <div style={{
          position:   "absolute",
          inset:      0,
          background: "linear-gradient(to bottom, rgba(14,14,14,0.1) 0%, rgba(14,14,14,0.6) 100%)",
        }} />
        <div style={{
          position:      "absolute",
          top:           "1rem",
          left:          "1.25rem",
          fontFamily:    "var(--mono)",
          fontSize:      "0.65rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color:         "var(--accent)",
          fontWeight:    700,
          background:    "rgba(14,14,14,0.7)",
          padding:       "0.25rem 0.6rem",
          borderRadius:  "3px",
          border:        "1px solid rgba(212,146,10,0.3)",
        }}>
          {guide.discipline}
        </div>
        {guide.comingSoon && (
          <div style={{
            position:      "absolute",
            top:           "1rem",
            right:         "1.25rem",
            fontFamily:    "var(--mono)",
            fontSize:      "0.65rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color:         "var(--text-dim)",
            background:    "rgba(14,14,14,0.7)",
            padding:       "0.25rem 0.6rem",
            borderRadius:  "3px",
          }}>
            Coming soon
          </div>
        )}
      </div>
      {/* Content */}
      <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1 }}>
        <h2 style={{ fontFamily: "var(--mono)", fontSize: "1rem", fontWeight: 700, color: "var(--text)", lineHeight: 1.3, margin: 0 }}>
          {guide.title}
        </h2>
        <RatePreview tiers={guide.ratePreview} />
        <p style={{ fontFamily: "var(--sans)", fontSize: "0.82rem", color: "var(--text-mid)", lineHeight: 1.65, margin: 0, flex: 1 }}>
          {guide.description}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.75rem", borderTop: "1px solid var(--border)" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", color: "var(--text-dim)", letterSpacing: "0.05em" }}>
            {guide.comingSoon ? "In progress" : `${guide.readTime} read`}
          </span>
          {!guide.comingSoon && (
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)" }}>
              Read →
            </span>
          )}
        </div>
      </div>
    </article>
  );

  return guide.comingSoon
    ? <div style={{ height: "100%" }}>{card}</div>
    : <Link href={`/${guide.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>{card}</Link>;
}

// ==============================================
// PAGE
// ==============================================
export default function GuidesPage() {
  const [featured, ...rest] = GUIDES;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "4rem 1.5rem 6rem" }}>

      {/* Header */}
      <div className="fade-in" style={{ marginBottom: "3rem" }}>
        <div style={{
          fontFamily:    "var(--mono)",
          fontSize:      "0.68rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color:         "var(--accent)",
          marginBottom:  "0.6rem",
        }}>
          The Rate Guide
        </div>
        <h1 style={{
          fontFamily:   "var(--mono)",
          fontSize:     "clamp(1.75rem, 5vw, 2.75rem)",
          fontWeight:   700,
          lineHeight:   1.1,
          color:        "var(--text)",
          marginBottom: "0.75rem",
        }}>
          Rate Guides
        </h1>
        <p style={{
          fontFamily: "var(--sans)",
          fontSize:   "0.95rem",
          color:      "var(--text-mid)",
          lineHeight: 1.75,
          maxWidth:   "52ch",
          margin:     0,
        }}>
          Research-backed day rate data by discipline — union contracts,
          industry surveys, and working professionals. Know what the market
          pays before you name a number.
        </p>
      </div>

      {/* Featured post */}
      <div className="fade-in" style={{ marginBottom: "1.5rem" }}>
        <FeaturedCard guide={featured} />
      </div>

      {/* Remaining posts grid */}
      {rest.length > 0 && (
        <div className="fade-in" style={{
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap:                 "1.5rem",
          alignItems:          "stretch",
        }}>
          {rest.map((guide) => (
            <GridCard key={guide.slug} guide={guide} />
          ))}
        </div>
      )}

      {/* Footer CTA */}
      <div style={{ marginTop: "3.5rem", paddingTop: "2rem", borderTop: "1px solid var(--border)", textAlign: "right" }}>
        <Link href="/" style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", textDecoration: "none" }}>
          Calculate your rate →
        </Link>
      </div>

    </div>
  );
}
