import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"; // page view + event tracking

export const metadata: Metadata = {
  title: "The Rate Guide — Know Your Rate",
  description: "A transparent rate calculator for creative freelancers. Stop undercharging.",
};

// ==============================================
// GLOBAL NAV
// Appears on every page — links back to calculator
// and to key sections of the site
// ==============================================
function Nav() {
  return (
    <nav style={{
      borderBottom:   "1px solid var(--border)",
      padding:        "0.85rem 1.5rem",
      display:        "flex",
      justifyContent: "space-between",
      alignItems:     "center",
      gap:            "1rem",
      flexWrap:       "wrap",
    }}>
      {/* Logo / home */}
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
          { label: "Calculator", href: "/" },
          { label: "Methodology", href: "/methodology" },
          { label: "The Store", href: "/store" },
          { label: "Sign In", href: "/login" },
        ].map(({ label, href }) => (
          <a key={href} href={href} style={{
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
    <html lang="en">
      <body>
        <Nav />
        {children}
        <Analytics /> {/* Vercel Analytics — tracks page views automatically */}
      </body>
    </html>
  );
}
