// ==============================================
// The Rate Guide — The Store
// Redesigned with cover art, editorial intros,
// and separate layouts for books vs. services.
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
interface Book {
  type:        "book";
  name:        string;
  author:      string;
  description: string;
  price:       string;
  url:         string;
  isbn:        string;    // used to fetch cover from Open Library by ISBN
  coverId?:    number;    // Open Library cover ID — used when ISBN lookup has no cover
  badge?:      string;
  affiliate:   boolean;   // hide if false — don't advertise for free
}

interface Service {
  type:        "service";
  name:        string;
  description: string;
  price:       string;
  cta:         string;
  url:         string;
  initial:     string;   // letter shown in brand icon
  color:       string;   // accent color for the icon border
  badge?:      string;
  affiliate:   boolean;   // hide if false — don't advertise for free
}

type Product = Book | Service;

interface Category {
  id:       string;
  label:    string;
  intro:    string;
  products: Product[];
}

// ==============================================
// STORE DATA
// ==============================================
const CATEGORIES: Category[] = [
  {
    id:    "negotiation",
    label: "Negotiation & Rates",
    intro: "Setting your rate is half math, half nerve. These books handle the nerve. Every one of them has a direct application to the moment you're sitting across from a client who says your number is too high.",
    products: [
      {
        type:        "book",
        name:        "Never Split the Difference",
        author:      "Chris Voss",
        description: "An FBI hostage negotiator's tactics applied to everyday negotiation. Anchoring, tactical empathy, the power of silence — this is the playbook for any rate conversation.",
        price:       "~$16",
        url:         "https://amzn.to/3Q1VFiG",
        isbn:        "9780062407801",
        affiliate:   true,
      },
      {
        type:        "book",
        name:        "Profit First",
        author:      "Mike Michalowicz",
        description: "Flips the formula: take profit before expenses, not after. Designed for irregular creative income. Simple, counterintuitive, and it works.",
        price:       "~$14",
        url:         "https://amzn.to/4sz4Y7a",
        isbn:        "9780735214149",
        affiliate:   true,
      },
      {
        type:        "book",
        name:        "The Freelancer's Bible",
        author:      "Sara Horowitz",
        description: "The founder of the Freelancers Union covers contracts, rates, taxes, and client relationships in one place. Practical and exhaustive.",
        price:       "~$15",
        url:         "https://amzn.to/4dTQtY5",
        isbn:        "9780761168720",
        coverId:     8174867,
        affiliate:   true,
      },
    ],
  },
  {
    id:    "mindset",
    label: "Mindset & Worth",
    intro: "The rate conversation starts before you're in the room. These books address why creatives undercharge — and what it costs them.",
    products: [
      {
        type:        "book",
        name:        "The War of Art",
        author:      "Steven Pressfield",
        description: "On resistance — the force that keeps you undercharging, playing small, and waiting for permission. Short, brutal, and clarifying. Read it in one sitting.",
        price:       "~$13",
        url:         "https://amzn.to/4tIFQf5",
        isbn:        "9781936891023",
        affiliate:   true,
      },
      {
        type:        "book",
        name:        "You Are a Badass at Making Money",
        author:      "Jen Sincero",
        description: "Focused specifically on money blocks and worthiness. Accessible and direct — surprisingly useful for creatives who struggle to name their rate without apologizing for it.",
        price:       "~$14",
        url:         "https://amzn.to/4myd8LR",
        isbn:        "9780735223974",
        coverId:     13240492,
        affiliate:   true,
      },
      {
        type:        "service",
        name:        "MasterClass",
        description: "World-class instructors across filmmaking, business, negotiation, and storytelling. One subscription. Worth it if you're investing in the craft side of leveling up.",
        price:       "$120/yr",
        cta:         "Try MasterClass",
        url:         "https://www.masterclass.com/",
        initial:     "M",
        color:       "#c99a12",
        badge:       "25% commission",
        affiliate:   false,
      },
    ],
  },
  {
    id:    "business",
    label: "Business & Finance",
    intro: "The administrative side of freelancing is where money gets lost. These tools handle invoicing, accounting, and the paper trail that protects you when clients get difficult.",
    products: [
      {
        type:        "service",
        name:        "FreshBooks",
        description: "Invoicing and accounting built for freelancers. Time tracking, expense logging, professional invoices, and tax prep. The tool that makes you look like you have a staff.",
        price:       "From $19/mo",
        cta:         "Try FreshBooks",
        url:         "https://www.freshbooks.com/",
        initial:     "F",
        color:       "#1a9b5b",
        badge:       "Up to $200/referral",
        affiliate:   false,
      },
      {
        type:        "service",
        name:        "Squarespace",
        description: "Your rate and your portfolio need to match. If your site still looks like 2015, Squarespace is the fastest path to a portfolio that justifies a senior rate.",
        price:       "From $16/mo",
        cta:         "Build your portfolio",
        url:         "https://www.squarespace.com/",
        initial:     "S",
        color:       "#888888",
        badge:       "$100–200 per signup",
        affiliate:   false,
      },
      {
        type:        "service",
        name:        "Skillshare",
        description: "Courses on pricing, client management, and freelance business taught by working creatives. First month free with this link.",
        price:       "$168/yr",
        cta:         "Start learning",
        url:         "https://www.skillshare.com/",
        initial:     "Sk",
        color:       "#00c4a0",
        affiliate:   false,
      },
    ],
  },
  {
    id:    "software",
    label: "Software & Tools",
    intro: "The industry-standard tools for editorial, color, and motion work. If you're billing at a senior rate, your toolkit should match.",
    products: [
      {
        type:        "service",
        name:        "Adobe Creative Cloud",
        description: "Premiere, After Effects, Audition, Photoshop, and 20+ apps. The industry standard for editors, colorists, and motion designers. Non-negotiable for most production work.",
        price:       "From $54/mo",
        cta:         "Get Creative Cloud",
        url:         "https://www.adobe.com/creativecloud.html",
        initial:     "Ai",
        color:       "#ff0000",
        badge:       "85% of first month",
        affiliate:   false,
      },
      {
        type:        "service",
        name:        "DaVinci Resolve Studio",
        description: "The free version is already excellent. Studio unlocks noise reduction, collaboration features, and advanced delivery options. One-time purchase that pays for itself on the first commercial job.",
        price:       "One-time license",
        cta:         "See price on Amazon",
        url:         "https://amzn.to/48NVE8h",
        initial:     "Bm",
        color:       "#e8c84a",
        affiliate:   true,
      },
      {
        type:        "service",
        name:        "Frame.io",
        description: "Client review without the email chains. Share cuts, collect frame-accurate feedback, and keep revisions organized. Now built directly into Adobe CC.",
        price:       "Included with CC",
        cta:         "Learn more",
        url:         "https://frame.io/",
        initial:     "Fr",
        color:       "#666eff",
        affiliate:   false,
      },
    ],
  },
  {
    id:    "gear",
    label: "Gear",
    intro: "When you're buying production equipment, buy it from people who understand what you're buying. These are the two stores worth your time.",
    products: [
      {
        type:        "service",
        name:        "B&H Photo",
        description: "The professional's camera and gear store. Better selection than Amazon, knowledgeable staff, and no gray market. If you're buying production gear, start here.",
        price:       "Varies",
        cta:         "Shop B&H",
        url:         "https://www.bhphotovideo.com/",
        initial:     "B&H",
        color:       "#eb0000",
        affiliate:   false,
      },
      {
        type:        "service",
        name:        "Adorama",
        description: "B&H's closest competitor and worth checking for price differences on major purchases. Strong rental program if you need gear without the capital commitment.",
        price:       "Varies",
        cta:         "Shop Adorama",
        url:         "https://www.adorama.com/",
        initial:     "Ad",
        color:       "#0077cc",
        affiliate:   false,
      },
    ],
  },
];

// ==============================================
// BOOK CARD
// Portrait card with Open Library cover art
// ==============================================
function BookCard({ product }: { product: Book }) {
  // Open Library cover API — free, no key required.
  // Prefer coverId (b/id lookup) when provided — more reliable than ISBN lookup.
  const coverUrl = product.coverId
    ? `https://covers.openlibrary.org/b/id/${product.coverId}-L.jpg`
    : `https://covers.openlibrary.org/b/isbn/${product.isbn}-L.jpg`;

  return (
    <div style={{
      background:    "var(--surface)",
      border:        "1px solid var(--border)",
      borderRadius:  "4px",
      display:       "flex",
      flexDirection: "column",
      position:      "relative",
      transition:    "border-color 0.2s",
      overflow:      "hidden",
    }}>
      {product.badge && (
        <div style={{
          position:      "absolute",
          top:           "0.75rem",
          right:         "0.75rem",
          fontSize:      "0.58rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color:         "#000",
          background:    "var(--accent)",
          padding:       "0.2rem 0.5rem",
          fontWeight:    "bold",
          zIndex:        1,
        }}>
          {product.badge}
        </div>
      )}

      {/* Cover image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={coverUrl}
        alt={`${product.name} cover`}
        style={{
          width:      "100%",
          aspectRatio: "2 / 3",
          objectFit:  "cover",
          display:    "block",
          background: "var(--border)",
        }}
      />

      {/* Content */}
      <div style={{ padding: "1.75rem 2rem", display: "flex", flexDirection: "column", gap: "0.6rem", flex: 1 }}>
        <div>
          <div style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: "0.95rem", color: "var(--text)", lineHeight: 1.3, marginBottom: "0.2rem" }}>
            {product.name}
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--accent)", letterSpacing: "0.05em" }}>
            {product.author}
          </div>
        </div>

        <p style={{ fontFamily: "var(--serif)", fontSize: "0.82rem", color: "var(--text-dim)", lineHeight: 1.7, margin: 0, flex: 1 }}>
          {product.description}
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.25rem" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", color: "var(--text-dim)" }}>
            {product.price}
          </span>
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background:    "var(--accent)",
              color:         "#000",
              fontFamily:    "var(--mono)",
              fontSize:      "0.65rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding:       "0.5rem 1rem",
              textDecoration:"none",
              fontWeight:    "bold",
              whiteSpace:    "nowrap",
            }}
          >
            Get the book →
          </a>
        </div>
      </div>
    </div>
  );
}

// ==============================================
// SERVICE CARD
// Wider horizontal card with brand initial icon
// ==============================================
function ServiceCard({ product }: { product: Service }) {
  return (
    <div style={{
      background:    "var(--surface)",
      border:        "1px solid var(--border)",
      borderRadius:  "4px",
      padding:       "1.75rem 2rem",
      display:       "flex",
      gap:           "1.25rem",
      alignItems:    "flex-start",
      position:      "relative",
    }}>
      {product.badge && (
        <div style={{
          position:      "absolute",
          top:           "0.75rem",
          right:         "0.75rem",
          fontSize:      "0.58rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color:         "#000",
          background:    "var(--accent)",
          padding:       "0.2rem 0.5rem",
          fontWeight:    "bold",
        }}>
          {product.badge}
        </div>
      )}

      {/* Brand icon */}
      <div style={{
        width:          "3rem",
        height:         "3rem",
        flexShrink:     0,
        background:     "var(--bg)",
        border:         `1px solid ${product.color}`,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        fontFamily:     "var(--mono)",
        fontSize:       product.initial.length > 2 ? "0.6rem" : "0.85rem",
        fontWeight:     "bold",
        color:          product.color,
        letterSpacing:  "0.02em",
      }}>
        {product.initial}
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem", minWidth: 0 }}>
        <div style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: "0.95rem", color: "var(--text)", paddingRight: product.badge ? "6rem" : 0 }}>
          {product.name}
        </div>

        <p style={{ fontFamily: "var(--serif)", fontSize: "0.82rem", color: "var(--text-dim)", lineHeight: 1.7, margin: 0 }}>
          {product.description}
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.25rem" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", color: "var(--text-dim)" }}>
            {product.price}
          </span>
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background:    "var(--accent)",
              color:         "#000",
              fontFamily:    "var(--mono)",
              fontSize:      "0.65rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding:       "0.5rem 1rem",
              textDecoration:"none",
              fontWeight:    "bold",
              whiteSpace:    "nowrap",
            }}
          >
            {product.cta} →
          </a>
        </div>
      </div>
    </div>
  );
}

// ==============================================
// ORIGINAL PRODUCTS SECTION
// The Rate Guide's own products — shown above affiliates
// ==============================================
function OriginalProductCard() {
  return (
    <a
      href="/store/contract-pack"
      style={{
        display:       "block",
        textDecoration: "none",
        background:    "var(--surface)",
        border:        "1px solid var(--accent)",
        borderRadius:  "4px",
        padding:       "2rem 2.5rem",
        position:      "relative",
        overflow:      "hidden",
      }}
    >
      {/* Badge */}
      <div style={{
        position:      "absolute",
        top:           "1rem",
        right:         "1rem",
        background:    "var(--accent)",
        color:         "#000",
        fontFamily:    "var(--mono)",
        fontSize:      "0.58rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        fontWeight:    "bold",
        padding:       "0.25rem 0.6rem",
      }}>
        Original
      </div>

      <div style={{
        fontFamily:    "var(--mono)",
        fontSize:      "0.65rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color:         "var(--accent)",
        marginBottom:  "0.6rem",
      }}>
        The Rate Guide
      </div>

      <h2 style={{
        fontFamily:  "var(--mono)",
        fontSize:    "clamp(1.2rem, 3vw, 1.6rem)",
        lineHeight:  1.2,
        color:       "var(--text)",
        margin:      "0 0 0.75rem",
      }}>
        The Freelancer&apos;s Contract Pack
      </h2>

      <p style={{
        fontFamily: "var(--serif)",
        fontSize:   "0.9rem",
        color:      "var(--text-dim)",
        lineHeight: 1.75,
        margin:     "0 0 1.5rem",
        maxWidth:   "540px",
      }}>
        Six documents: five production contract templates plus a plain English guide that explains every term and every situation — written for freelancers who have never used a contract before.
        Every clause annotated. Built for cinematographers, editors, colorists, motion designers, and producers.
      </p>

      <div style={{
        display:     "flex",
        gap:         "2.5rem",
        alignItems:  "center",
        flexWrap:    "wrap",
      }}>
        <div style={{
          fontFamily: "var(--mono)",
          fontSize:   "1.75rem",
          fontWeight: "bold",
          color:      "var(--text)",
        }}>
          $9.99
        </div>

        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          {["Plain English Guide", "Services Agreement", "Quote Sheet", "Change Order", "Invoice", "Email Templates"].map((item) => (
            <div key={item} style={{
              fontFamily:    "var(--mono)",
              fontSize:      "0.65rem",
              color:         "var(--text-dim)",
              letterSpacing: "0.05em",
            }}>
              &#x2192; {item}
            </div>
          ))}
        </div>
      </div>

      <div style={{
        marginTop:     "1.5rem",
        fontFamily:    "var(--mono)",
        fontSize:      "0.72rem",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color:         "var(--accent)",
        fontWeight:    "bold",
      }}>
        See what&apos;s included →
      </div>
    </a>
  );
}

// ==============================================
// PAGE
// ==============================================
export default function StorePage() {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "5rem 1.5rem 6rem" }}>

      {/* Header */}
      <div style={{ marginBottom: "4rem" }}>
        <a href="/" style={{ fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--accent)", textDecoration: "none" }}>
          ← The Rate Guide
        </a>
        <h1 style={{ fontFamily: "var(--mono)", fontSize: "clamp(1.8rem, 5vw, 2.5rem)", marginTop: "1.5rem", lineHeight: 1.1 }}>
          The Store
        </h1>
        <p style={{ fontFamily: "var(--serif)", color: "var(--text-dim)", fontSize: "1rem", marginTop: "0.75rem", lineHeight: 1.75, maxWidth: "560px" }}>
          Everything here is hand-picked. Some links are affiliate links — I earn a small commission if you buy, at no extra cost to you. I only list things I&apos;d recommend to a working professional.
        </p>
      </div>

      {/* Original Products — The Rate Guide's own */}
      <div style={{ marginBottom: "4.5rem" }}>
        <div style={{
          borderTop:    "2px solid var(--accent)",
          paddingTop:   "2rem",
          marginBottom: "1.5rem",
        }}>
          <div style={{
            fontFamily:    "var(--mono)",
            fontSize:      "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color:         "var(--accent)",
          }}>
            Made by The Rate Guide
          </div>
        </div>
        <OriginalProductCard />
      </div>

      {/* Categories */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4.5rem" }}>
        {CATEGORIES.map((cat) => {
          // Only show products with confirmed affiliate links
          const books    = cat.products.filter((p): p is Book    => p.type === "book"    && p.affiliate);
          const services = cat.products.filter((p): p is Service => p.type === "service" && p.affiliate);

          // Hide entire category if nothing is live yet
          if (books.length === 0 && services.length === 0) return null;

          return (
            <section key={cat.id}>
              {/* Category header */}
              <div style={{ borderTop: "2px solid var(--accent-2)", paddingTop: "2rem", marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--mono)", marginBottom: "0.6rem" }}>
                  {cat.label}
                </div>
                <p style={{ fontFamily: "var(--serif)", fontSize: "0.9rem", color: "var(--text-dim)", lineHeight: 1.75, margin: 0, maxWidth: "620px" }}>
                  {cat.intro}
                </p>
              </div>

              {/* Book grid — portrait cards, 3 columns */}
              {books.length > 0 && (
                <div style={{
                  display:             "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap:                 "1.25rem",
                  marginBottom:        services.length > 0 ? "1.25rem" : 0,
                }}>
                  {books.map((p) => <BookCard key={p.name} product={p} />)}
                </div>
              )}

              {/* Service grid — horizontal cards, 2 columns */}
              {services.length > 0 && (
                <div style={{
                  display:             "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                  gap:                 "1rem",
                }}>
                  {services.map((p) => <ServiceCard key={p.name} product={p} />)}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Disclosure footer */}
      <div style={{ marginTop: "4.5rem", borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
        <p style={{ fontSize: "0.72rem", color: "var(--text-dim)", lineHeight: 1.7, margin: 0 }}>
          <strong style={{ color: "var(--text)" }}>Affiliate disclosure:</strong> The Rate Guide earns a commission on purchases made through links on this page. This helps keep the calculator free. Recommendations are independent of affiliate relationships — if something isn&apos;t worth recommending, it isn&apos;t here.
        </p>
      </div>

    </div>
  );
}
