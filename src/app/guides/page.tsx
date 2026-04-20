// ==============================================
// /guides — Rate Guide index page
// Lists all discipline rate guide articles.
// Server component — fully static, SEO-friendly.
//
// To add a new guide: add an entry to GUIDES below.
// No other changes needed.
// ==============================================

import type { Metadata } from "next";
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
// Add new guides here — slug, discipline label,
// title, 1–2 sentence description, read time,
// and the calculator pre-fill URL.
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
  },
  {
    slug:       "video-editor-day-rate",
    discipline: "Video Editor",
    title:      "Video Editor Day Rate: What to Charge in 2026",
    description:
      "Day rate, hourly, and project pricing data for freelance editors — from Cutjamm's 2025 salary survey, IATSE Local 700 contracts, and working editor rate sheets.",
    readTime:   "9 min",
    calcUrl:    "/?d=Video+Editor",
  },
] as const;

// ==============================================
// GUIDE CARD
// ==============================================
function GuideCard({
  slug,
  discipline,
  title,
  description,
  readTime,
  calcUrl,
  featured = false,
}: {
  slug:       string;
  discipline: string;
  title:      string;
  description:string;
  readTime:   string;
  calcUrl:    string;
  featured?:  boolean;
}) {
  return (
    <Link
      href={`/${slug}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <article
        className="card-hover"
        style={{
          background:    "var(--surface)",
          border:        "1px solid var(--border)",
          borderRadius:  "4px",
          padding:       featured ? "2.25rem 2.5rem" : "1.75rem 2rem",
          display:       "flex",
          flexDirection: "column",
          gap:           "0.9rem",
          height:        "100%",
          cursor:        "pointer",
        }}
      >
        {/* Discipline badge */}
        <div style={{
          fontFamily:    "var(--mono)",
          fontSize:      "0.68rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color:         "var(--accent)",
          fontWeight:    600,
        }}>
          {discipline}
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily:  "var(--mono)",
          fontSize:    featured ? "1.25rem" : "1rem",
          fontWeight:  700,
          color:       "var(--text)",
          lineHeight:  1.3,
          margin:      0,
        }}>
          {title}
        </h2>

        {/* Description */}
        <p style={{
          fontFamily: "var(--sans)",
          fontSize:   "0.85rem",
          color:      "var(--text-mid)",
          lineHeight: 1.7,
          margin:     0,
          flex:       1,
        }}>
          {description}
        </p>

        {/* Footer — read time + read link */}
        <div style={{
          display:    "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop:  "0.25rem",
          paddingTop: "0.75rem",
          borderTop:  "1px solid var(--border)",
        }}>
          <span style={{
            fontFamily:    "var(--mono)",
            fontSize:      "0.72rem",
            color:         "var(--text-dim)",
            letterSpacing: "0.05em",
          }}>
            {readTime} read
          </span>
          <span style={{
            fontFamily:    "var(--mono)",
            fontSize:      "0.72rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color:         "var(--accent)",
          }}>
            Read →
          </span>
        </div>
      </article>
    </Link>
  );
}

// ==============================================
// PAGE
// ==============================================
export default function GuidesPage() {
  const [featured, ...rest] = GUIDES;

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "4rem 1.5rem 6rem" }}>

      {/* Header */}
      <div className="fade-in" style={{ marginBottom: "3.5rem" }}>
        <div style={{
          fontFamily:    "var(--mono)",
          fontSize:      "0.68rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color:         "var(--accent)",
          marginBottom:  "0.75rem",
        }}>
          The Rate Guide
        </div>
        <h1 style={{
          fontFamily:  "var(--mono)",
          fontSize:    "clamp(1.75rem, 5vw, 2.75rem)",
          fontWeight:  700,
          lineHeight:  1.1,
          color:       "var(--text)",
          marginBottom:"0.75rem",
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
          Research-backed day rate data by discipline — drawn from union contracts,
          industry surveys, and working professionals. Know what the market pays
          before you name a number.
        </p>
      </div>

      {/* Featured post — full width */}
      <div className="fade-in" style={{ marginBottom: "1.5rem" }}>
        <GuideCard {...featured} featured />
      </div>

      {/* Remaining posts — responsive grid */}
      {rest.length > 0 && (
        <div
          className="fade-in"
          style={{
            display:               "grid",
            gridTemplateColumns:   "repeat(auto-fill, minmax(280px, 1fr))",
            gap:                   "1.5rem",
          }}
        >
          {rest.map((guide) => (
            <GuideCard key={guide.slug} {...guide} />
          ))}
        </div>
      )}

      {/* More coming callout */}
      <div style={{
        marginTop:    "3.5rem",
        paddingTop:   "2rem",
        borderTop:    "1px solid var(--border)",
        display:      "flex",
        alignItems:   "center",
        justifyContent: "space-between",
        flexWrap:     "wrap",
        gap:          "1rem",
      }}>
        <p style={{
          fontFamily: "var(--sans)",
          fontSize:   "0.85rem",
          color:      "var(--text-dim)",
          lineHeight: 1.6,
          margin:     0,
        }}>
          More guides in progress — colorist, motion designer, producer, gaffer, and sound mixer.
        </p>
        <Link
          href="/"
          style={{
            fontFamily:    "var(--mono)",
            fontSize:      "0.72rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color:         "var(--accent)",
            textDecoration:"none",
            whiteSpace:    "nowrap",
          }}
        >
          Calculate your rate →
        </Link>
      </div>

    </div>
  );
}
