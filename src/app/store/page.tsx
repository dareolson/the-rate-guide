// ==============================================
// The Rate Guide — The Store
// Curated affiliate resources for creative
// freelancers. Everything here is hand-picked.
// Replace AFFILIATE_URL placeholders with real
// affiliate links once accounts are approved.
// ==============================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Resources for Creative Freelancers",
  description: "Hand-picked books, courses, software, and tools for cinematographers, editors, colorists, motion designers, and producers who want to charge what they're worth.",
  alternates:  { canonical: "/store" },
  openGraph: {
    title:       "The Store — The Rate Guide",
    description: "Curated resources for creative freelancers. Negotiation, mindset, business tools, software, and gear — everything hand-picked.",
    url:         "https://therateguide.com/store",
  },
};

// ==============================================
// TYPES
// ==============================================
interface Product {
  name:        string;   // product name
  description: string;   // derek's personal take — not marketing copy
  price:       string;   // approximate price or "Free trial"
  cta:         string;   // button label
  url:         string;   // affiliate link — replace placeholder with real URL
  badge?:      string;   // optional callout e.g. "Best commission"
}

interface Category {
  id:       string;
  label:    string;
  products: Product[];
}

// ==============================================
// STORE DATA
// Replace all AFFILIATE_URL values with your
// real affiliate links once approved.
// ==============================================
const CATEGORIES: Category[] = [
  {
    id:    "negotiation",
    label: "Negotiation & Rates",
    products: [
      {
        name:        "Never Split the Difference",
        description: "Chris Voss was an FBI hostage negotiator. His tactics translate directly to rate conversations — anchoring, silence, the power of 'no'. Required reading before any client negotiation.",
        price:       "~$16",
        cta:         "Get the book",
        url:         "AFFILIATE_URL",
      },
      {
        name:        "Profit First",
        description: "Flips how you think about freelance money. Instead of revenue minus expenses equals profit, you take profit first. Simple system that actually works for irregular creative income.",
        price:       "~$14",
        cta:         "Get the book",
        url:         "AFFILIATE_URL",
      },
      {
        name:        "The Freelancer's Bible",
        description: "Sara Horowitz founded the Freelancers Union. This book covers contracts, rates, taxes, and client relationships in one place. Practical, not theoretical.",
        price:       "~$15",
        cta:         "Get the book",
        url:         "AFFILIATE_URL",
      },
    ],
  },
  {
    id:    "mindset",
    label: "Mindset & Worth",
    products: [
      {
        name:        "The War of Art",
        description: "Steven Pressfield on resistance — the force that keeps you undercharging, undervaluing, and playing small. Short, brutal, and clarifying. Read it in one sitting.",
        price:       "~$13",
        cta:         "Get the book",
        url:         "AFFILIATE_URL",
      },
      {
        name:        "You Are a Badass at Making Money",
        description: "Jen Sincero's follow-up to You Are a Badass, focused specifically on money blocks and worthiness. Accessible, direct, and surprisingly useful for creatives who struggle to name their rate.",
        price:       "~$14",
        cta:         "Get the book",
        url:         "AFFILIATE_URL",
      },
      {
        name:        "MasterClass — Any Business or Creativity Course",
        description: "Access to world-class instructors across filmmaking, business, negotiation, and more. One subscription, everything included. Worth it if you're serious about leveling up.",
        price:       "$120/yr",
        cta:         "Try MasterClass",
        url:         "AFFILIATE_URL",
        badge:       "25% commission",
      },
    ],
  },
  {
    id:    "business",
    label: "Business & Finance",
    products: [
      {
        name:        "FreshBooks",
        description: "The invoicing and accounting tool built for freelancers, not accountants. Time tracking, expense tracking, professional invoices, and tax prep in one place. I use it.",
        price:       "From $19/mo",
        cta:         "Try FreshBooks",
        url:         "AFFILIATE_URL",
        badge:       "Up to $200/referral",
      },
      {
        name:        "Squarespace",
        description: "If your portfolio site still looks like 2015, fix it. Squarespace is the fastest way to a professional online presence without a developer. Your rate and your site need to match.",
        price:       "From $16/mo",
        cta:         "Build your portfolio",
        url:         "AFFILIATE_URL",
        badge:       "$100–200 per signup",
      },
      {
        name:        "Skillshare — Business for Creatives",
        description: "Courses on pricing, client management, freelance business, and more. Taught by working creatives, not business school professors. First month free with this link.",
        price:       "$168/yr",
        cta:         "Start learning",
        url:         "AFFILIATE_URL",
      },
    ],
  },
  {
    id:    "software",
    label: "Software & Tools",
    products: [
      {
        name:        "Adobe Creative Cloud",
        description: "If you're not already on it, this is the industry standard for editors, colorists, and motion designers. Premiere, After Effects, Audition, and 20+ apps in one subscription.",
        price:       "From $54/mo",
        cta:         "Get Creative Cloud",
        url:         "AFFILIATE_URL",
        badge:       "85% of first month",
      },
      {
        name:        "DaVinci Resolve Studio",
        description: "The professional colorist's tool. The free version is already excellent — Studio unlocks noise reduction, collaboration features, and advanced delivery options worth the one-time cost.",
        price:       "$295 one-time",
        cta:         "Get Resolve Studio",
        url:         "AFFILIATE_URL",
      },
      {
        name:        "Frame.io",
        description: "Client review and collaboration without the endless email chains. Share cuts, collect frame-accurate feedback, and keep revisions organized. Now built into Adobe CC.",
        price:       "Included with CC",
        cta:         "Learn more",
        url:         "AFFILIATE_URL",
      },
    ],
  },
  {
    id:    "gear",
    label: "Gear",
    products: [
      {
        name:        "B&H Photo",
        description: "The professional's camera and gear store. Better selection than Amazon, knowledgeable staff, and no gray market nonsense. If you're buying production gear, buy it here.",
        price:       "Varies",
        cta:         "Shop B&H",
        url:         "AFFILIATE_URL",
      },
      {
        name:        "Adorama",
        description: "B&H's closest competitor and worth checking for price differences on major purchases. Strong rental program if you need gear without the capital commitment.",
        price:       "Varies",
        cta:         "Shop Adorama",
        url:         "AFFILIATE_URL",
      },
    ],
  },
];

// ==============================================
// PRODUCT CARD COMPONENT
// ==============================================
function ProductCard({ product }: { product: Product }) {
  return (
    <div style={{
      background:    "var(--surface)",
      border:        "1px solid var(--border)",
      padding:       "1.5rem",
      display:       "flex",
      flexDirection: "column",
      gap:           "0.75rem",
      position:      "relative",
    }}>
      {/* Badge — affiliate callout */}
      {product.badge && (
        <div style={{
          position:      "absolute",
          top:           "1rem",
          right:         "1rem",
          fontSize:      "0.6rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color:         "#000",
          background:    "var(--accent)",
          padding:       "0.2rem 0.5rem",
          fontWeight:    "bold",
        }}>
          {product.badge}
        </div>
      )}

      {/* Product name */}
      <div style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: "1rem", color: "var(--text)", paddingRight: product.badge ? "7rem" : 0 }}>
        {product.name}
      </div>

      {/* Derek's take */}
      <p style={{ fontFamily: "var(--serif)", fontSize: "0.88rem", color: "var(--text-dim)", lineHeight: 1.75, margin: 0, flex: 1 }}>
        {product.description}
      </p>

      {/* Price + CTA */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.25rem" }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: "0.82rem", color: "var(--text-dim)" }}>
          {product.price}
        </span>
        <a
          href={product.url === "AFFILIATE_URL" ? "#" : product.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background:    product.url === "AFFILIATE_URL" ? "var(--border)" : "var(--accent)",
            color:         product.url === "AFFILIATE_URL" ? "var(--text-dim)" : "#000",
            fontFamily:    "var(--mono)",
            fontSize:      "0.7rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            padding:       "0.5rem 1rem",
            textDecoration:"none",
            fontWeight:    "bold",
            cursor:        product.url === "AFFILIATE_URL" ? "not-allowed" : "pointer",
          }}
        >
          {product.url === "AFFILIATE_URL" ? "Coming soon" : product.cta}
        </a>
      </div>
    </div>
  );
}

// ==============================================
// PAGE
// ==============================================
export default function StorePage() {
  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "5rem 1.5rem 6rem" }}>

      {/* Header */}
      <div style={{ marginBottom: "3.5rem" }}>
        <a href="/" style={{ fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--accent)", textDecoration: "none" }}>
          ← The Rate Guide
        </a>
        <h1 style={{ fontFamily: "var(--mono)", fontSize: "2rem", marginTop: "1.5rem", lineHeight: 1.1 }}>
          The Store
        </h1>
        <p style={{ fontFamily: "var(--serif)", color: "var(--text-dim)", fontSize: "1rem", marginTop: "0.75rem", lineHeight: 1.75, maxWidth: "560px" }}>
          Everything here is hand-picked. Some links are affiliate links — meaning I earn a commission if you buy through them, at no extra cost to you. I only recommend things I&apos;d tell a friend about.
        </p>
      </div>

      {/* Categories */}
      <div style={{ display: "flex", flexDirection: "column", gap: "3.5rem" }}>
        {CATEGORIES.map((cat) => (
          <section key={cat.id}>
            {/* Category header */}
            <div style={{ borderTop: "2px solid var(--border)", paddingTop: "1.75rem", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)" }}>
                {cat.label}
              </div>
            </div>

            {/* Product grid */}
            <div style={{
              display:             "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap:                 "1rem",
            }}>
              {cat.products.map((product) => (
                <ProductCard key={product.name} product={product} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Disclosure footer */}
      <div style={{ marginTop: "4rem", borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
        <p style={{ fontSize: "0.72rem", color: "var(--text-dim)", lineHeight: 1.7 }}>
          Affiliate disclosure: The Rate Guide earns a commission on purchases made through links on this page. This helps keep the calculator free. Recommendations are independent of affiliate relationships.
        </p>
      </div>

    </div>
  );
}
