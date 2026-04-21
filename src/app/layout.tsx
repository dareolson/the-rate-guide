import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"; // page view + event tracking
import { JetBrains_Mono, Lora, Inter } from "next/font/google";
import NavAuthLink from "@/components/NavAuthLink";

// Load fonts via next/font — self-hosted, zero layout shift, no external requests
const jetbrainsMono = JetBrains_Mono({
  subsets:  ["latin"],
  variable: "--font-mono",
  display:  "swap",
});

const lora = Lora({
  subsets:  ["latin"],
  variable: "--font-serif",
  display:  "swap",
});

const inter = Inter({
  subsets:  ["latin"],
  variable: "--font-sans",
  display:  "swap",
});

export const metadata: Metadata = {
  // Title template — child pages override the first part, site name stays
  title: {
    default:  "The Rate Guide — Know Your Rate",
    template: "%s — The Rate Guide",
  },
  description:
    "A free, transparent day rate calculator for creative freelancers — cinematographers, editors, colorists, motion designers, and producers. Stop undercharging.",
  keywords: [
    // Calculator-intent queries — what someone types when they want a tool
    "freelance day rate calculator",
    "day rate calculator",
    "freelance rate calculator",
    "how to calculate freelance day rate",
    "freelance rate formula",
    // Discipline-specific — what someone types when they want their specific rate
    "cinematographer day rate",
    "DP day rate",
    "how much should a DP charge",
    "camera operator day rate",
    "video editor day rate",
    "freelance video editor rates",
    "colorist day rate",
    "freelance colorist rates",
    "motion designer day rate",
    "motion graphics day rate",
    "freelance motion designer rates",
    "producer day rate",
    "freelance producer rates",
    // Intent queries — "what should I charge"
    "how much to charge as a freelancer",
    "what should I charge as a freelance cinematographer",
    "freelance creative rates",
    "freelance film production rates",
    "video production day rates",
    // Market and context queries
    "freelance rate by experience",
    "freelance rates by city",
    "freelance self employment tax calculator",
    "freelance health insurance cost",
    "freelance rate guide",
    "stop undercharging freelance",
  ],
  // Canonical URL — prevents duplicate content penalties
  metadataBase: new URL("https://therateguide.com"),
  alternates: { canonical: "/" },
  // Open Graph — controls how the link looks when shared on social
  openGraph: {
    type:        "website",
    url:         "https://therateguide.com",
    title:       "The Rate Guide — Know Your Rate",
    description: "Free day rate calculator for creative freelancers. See the full math — SE tax, health insurance, market floors, and more.",
    siteName:    "The Rate Guide",
  },
  // Twitter card
  twitter: {
    card:        "summary_large_image",
    title:       "The Rate Guide — Know Your Rate",
    description: "Stop undercharging. See exactly what your day rate needs to cover.",
  },
  // Crawling permissions
  robots: {
    index:          true,
    follow:         true,
    googleBot: {
      index:             true,
      follow:            true,
      "max-snippet":     -1,
      "max-image-preview": "large",
    },
  },
};

// ==============================================
// GLOBAL NAV
// Appears on every page — links back to calculator
// and to key sections of the site
// ==============================================
function Nav() {
  return (
    <nav style={{
      position:       "sticky",
      top:            0,
      zIndex:         100,
      borderBottom:   "1px solid var(--border)",
      padding:        "0.85rem 1.5rem",
      display:        "flex",
      justifyContent: "space-between",
      alignItems:     "center",
      gap:            "1rem",
      flexWrap:       "wrap",
      background:     "rgba(22,18,13,0.88)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
    }}>
      {/* Logo — links home, clears all URL params for a fresh start */}
      <a href="/" style={{
        fontFamily:     "var(--mono)",
        fontSize:       "0.78rem",
        letterSpacing:  "0.2em",
        textTransform:  "uppercase",
        color:          "var(--accent)",
        textDecoration: "none",
        fontWeight:     "bold",
      }}>
        The Rate Guide
      </a>

      {/* Page links */}
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        {[
          { label: "Rate Guides",  href: "/guides" },
          { label: "Methodology", href: "/methodology" },
          { label: "The Store",   href: "/store" },
        ].map(({ label, href }) => (
          <a key={label} href={href} style={{
            fontFamily:     "var(--mono)",
            fontSize:       "0.68rem",
            letterSpacing:  "0.12em",
            textTransform:  "uppercase",
            color:          "var(--text-dim)",
            textDecoration: "none",
          }}>
            {label}
          </a>
        ))}
        {/* Discord community link — replace href with real invite URL */}
        <a href="#" style={{
          fontFamily:     "var(--mono)",
          fontSize:       "0.68rem",
          letterSpacing:  "0.12em",
          textTransform:  "uppercase",
          color:          "var(--accent)",
          textDecoration: "none",
          border:         "1px solid var(--accent)",
          padding:        "0.35rem 0.75rem",
          borderRadius:   "3px",
          whiteSpace:     "nowrap",
        }}>
          Community ↗
        </a>
        <NavAuthLink />
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${lora.variable} ${inter.variable}`}>
      <body>
        <Nav />
        {children}
        <Analytics /> {/* Vercel Analytics — tracks page views automatically */}
      </body>
    </html>
  );
}
