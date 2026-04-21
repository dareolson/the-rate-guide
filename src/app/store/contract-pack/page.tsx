// ==============================================
// THE RATE GUIDE — Freelancer's Contract Pack
// Product landing page — $9.99 digital download
// ==============================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Freelancer's Contract Pack — 5 Production Documents",
  description:
    "Five ready-to-use documents for creative freelancers: services agreement, quote sheet, change order, invoice, and email templates. Every clause annotated. $9.99.",
  alternates: { canonical: "/store/contract-pack" },
  openGraph: {
    title: "Freelancer's Contract Pack — The Rate Guide",
    description:
      "Stop losing money to scope creep, late payments, and no-kill-fee cancellations. Five production-industry contract templates, fully annotated.",
    url: "https://therateguide.com/store/contract-pack",
    images: [{ url: "/contract-pack-banner.png", width: 1280, height: 720 }],
  },
};

// ==============================================
// DATA
// ==============================================

const DOCUMENTS = [
  {
    number: "00",
    title:  "The Plain English Guide",
    desc:   "Read this first. A plain-language walkthrough of all five documents — what each one is, when you use it with a client, what the terms mean, and why they matter. Written at a level that assumes you've never used a contract before. About 10 pages. No legal jargon.",
    clauses: [
      "What a kill fee is and why every working freelancer needs one",
      "The difference between a quote and a contract",
      "How getting paid actually works at a production company",
      "What \"Net 30\" means and why it matters for your cash flow",
      "The one question to ask every corporate client before you invoice",
    ],
  },
  {
    number: "01",
    title:  "Freelance Services Agreement",
    desc:   "The full contract. Covers scope, payment, kill fees, IP ownership, reel rights, indie contractor status, indemnification, and change orders. Every major clause annotated with what it protects you from.",
    clauses: [
      "Kill fee structure (3 tiers based on how far along the work is)",
      "Work-for-hire vs. license — three options with production context",
      "Reel and portfolio rights clause you will not give up",
      "Revision definition — what counts as a revision and what doesn't",
      "Liability cap at total compensation received",
    ],
  },
  {
    number: "02",
    title:  "Project Quote / Rate Sheet",
    desc:   "A professional estimate template that sets scope before the contract. Line-item pricing for day rate, project rate, or hybrid billing. Equipment fees, optional add-ons, and a built-in expiration date.",
    clauses: [
      "Scope inclusions and exclusions — listed side by side",
      "Three billing model formats (day rate / project / hybrid)",
      "Optional add-on menu clients can choose from",
      "Client feedback deadlines built into the project timeline",
      "Quote expiration — 14 days, always",
    ],
  },
  {
    number: "03",
    title:  "Change Order Form",
    desc:   "One page that stops scope creep cold. Documents what changed, the time and budget impact, and gets client authorization before you start the new work. Designed to be signed before the work begins — not after.",
    clauses: [
      "Original scope baseline (linked back to the signed contract)",
      "Impact assessment: time, delivery date, and budget",
      "Three payment options for change order amounts",
      "Explicit statement that no further out-of-scope work proceeds without a new CO",
    ],
  },
  {
    number: "04",
    title:  "Invoice Template",
    desc:   "A professional invoice that gets you paid. Line items for services, equipment, and expenses. PO number field for corporate clients. Late fee clause reference. Step-by-step notes on getting invoices processed faster.",
    clauses: [
      "PO number field — the thing that actually gets corporate clients to pay",
      "Line items with day/hour rate and total calculations",
      "Deposit credit line (shows balance due, not just total)",
      "Two payment method slots — prioritized by your preference",
      "Late fee reference language tied to the signed contract",
    ],
  },
  {
    number: "05",
    title:  "Email Templates (5 Situations)",
    desc:   "Five emails every freelancer will need to send. Written in plain, professional language — no apologizing, no hedging, no groveling. Copy, customize, and send.",
    clauses: [
      "Rate introduction — states your number in the first email, not the third",
      "Rate increase announcement — notice + holdback offer, no justification required",
      "Late payment follow-up — four sentences with teeth",
      "Scope creep pushback — \"happy to help, here's the Change Order\" format",
      "Deposit request / project confirmation — with a deadline that protects your calendar",
    ],
  },
];

const WORTH_IT = [
  {
    stat:  "1",
    label: "cancelled project",
    desc:  "A kill fee clause pays for this pack 50 times over on the first cancelled project. Without it, you get nothing.",
  },
  {
    stat:  "1",
    label: "unpaid invoice",
    desc:  "The late fee clause and invoice follow-up templates give you the language to collect without a lawyer.",
  },
  {
    stat:  "1",
    label: "scope creep situation",
    desc:  "The Change Order form turns a passive 'I guess I'll do it' into a documented, paid work authorization.",
  },
];

// ==============================================
// COMPONENTS
// ==============================================

function DocumentCard({ doc, index }: { doc: typeof DOCUMENTS[0]; index: number }) {
  return (
    <div style={{
      background:   "var(--surface)",
      border:       "1px solid var(--border)",
      borderRadius: "4px",
      padding:      "1.75rem 2rem",
      display:      "flex",
      gap:          "1.5rem",
      alignItems:   "flex-start",
    }}>
      {/* Number */}
      <div style={{
        fontFamily:    "var(--mono)",
        fontSize:      "2rem",
        fontWeight:    "bold",
        color:         "var(--border)",
        lineHeight:    1,
        flexShrink:    0,
        width:         "2.5rem",
        paddingTop:    "0.15rem",
      }}>
        {doc.number}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <h3 style={{
          fontFamily: "var(--mono)",
          fontSize:   "0.9rem",
          fontWeight: "bold",
          color:      "var(--text)",
          margin:     "0 0 0.6rem",
        }}>
          {doc.title}
        </h3>

        <p style={{
          fontFamily: "var(--serif)",
          fontSize:   "0.85rem",
          color:      "var(--text-dim)",
          lineHeight: 1.7,
          margin:     "0 0 1rem",
        }}>
          {doc.desc}
        </p>

        <ul style={{
          margin:     0,
          padding:    0,
          listStyle:  "none",
          display:    "flex",
          flexDirection: "column",
          gap:        "0.35rem",
        }}>
          {doc.clauses.map((clause, i) => (
            <li key={i} style={{
              fontFamily: "var(--mono)",
              fontSize:   "0.72rem",
              color:      "var(--text-dim)",
              paddingLeft: "1rem",
              position:   "relative",
            }}>
              <span style={{
                position: "absolute",
                left: 0,
                color: "var(--accent)",
              }}>
                &#x2192;
              </span>
              {clause}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ValueCard({ stat, label, desc }: typeof WORTH_IT[0]) {
  return (
    <div style={{
      background:   "var(--surface)",
      border:       "1px solid var(--border)",
      borderRadius: "4px",
      padding:      "1.5rem",
    }}>
      <div style={{
        fontFamily:    "var(--mono)",
        fontSize:      "0.65rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color:         "var(--accent)",
        marginBottom:  "0.4rem",
      }}>
        {stat} {label}
      </div>
      <p style={{
        fontFamily: "var(--serif)",
        fontSize:   "0.82rem",
        color:      "var(--text-dim)",
        lineHeight: 1.7,
        margin:     0,
      }}>
        {desc}
      </p>
    </div>
  );
}

// ==============================================
// PAGE
// ==============================================

export default function ContractPackPage() {
  // Replace this URL with the actual Gumroad product URL when listed
  const GUMROAD_URL = "https://daredevil484.gumroad.com/l/ktqssh";

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto", padding: "5rem 1.5rem 6rem" }}>

      {/* Breadcrumb */}
      <div style={{ marginBottom: "2.5rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <a href="/store" style={{
          fontFamily:    "var(--mono)",
          fontSize:      "0.7rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color:         "var(--accent)",
          textDecoration: "none",
        }}>
          The Store
        </a>
        <span style={{ color: "var(--border)", fontFamily: "var(--mono)", fontSize: "0.7rem" }}>
          /
        </span>
        <span style={{
          fontFamily: "var(--mono)",
          fontSize:   "0.7rem",
          color:      "var(--text-dim)",
        }}>
          Contract Pack
        </span>
      </div>

      {/* Hero */}
      <div style={{ marginBottom: "3.5rem" }}>
        <div style={{
          fontFamily:    "var(--mono)",
          fontSize:      "0.65rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color:         "var(--accent)",
          marginBottom:  "1rem",
        }}>
          The Rate Guide Original
        </div>

        <h1 style={{
          fontFamily: "var(--mono)",
          fontSize:   "clamp(1.6rem, 5vw, 2.4rem)",
          lineHeight: 1.1,
          margin:     "0 0 1.25rem",
        }}>
          The Freelancer&apos;s<br />Contract Pack
        </h1>

        <p style={{
          fontFamily: "var(--serif)",
          fontSize:   "1.05rem",
          color:      "var(--text-dim)",
          lineHeight: 1.8,
          margin:     "0 0 2rem",
          maxWidth:   "580px",
        }}>
          Five production-industry contract templates plus a plain English guide that
          explains every document, every term, and when to use each one with a client.
          Every clause annotated with what it protects you from. Built for cinematographers,
          editors, colorists, motion designers, and producers.
        </p>

        {/* CTA Block */}
        <div style={{
          background:   "var(--surface)",
          border:       "1px solid var(--accent)",
          borderRadius: "4px",
          padding:      "1.75rem 2rem",
          display:      "flex",
          justifyContent: "space-between",
          alignItems:   "center",
          gap:          "1.5rem",
          flexWrap:     "wrap",
        }}>
          <div>
            <div style={{
              fontFamily: "var(--mono)",
              fontSize:   "2rem",
              fontWeight: "bold",
              color:      "var(--text)",
              lineHeight: 1,
            }}>
              $9.99
            </div>
            <div style={{
              fontFamily: "var(--mono)",
              fontSize:   "0.7rem",
              color:      "var(--text-dim)",
              marginTop:  "0.3rem",
            }}>
              6 documents. Instant download. Yours forever.
            </div>
          </div>

          <a
            href={GUMROAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background:    "var(--accent)",
              color:         "#000",
              fontFamily:    "var(--mono)",
              fontSize:      "0.8rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding:       "0.9rem 1.75rem",
              textDecoration: "none",
              fontWeight:    "bold",
              whiteSpace:    "nowrap",
              borderRadius:  "4px",
            }}
          >
            Get the Pack →
          </a>
        </div>

        {/* Trust line */}
        <p style={{
          fontFamily: "var(--mono)",
          fontSize:   "0.68rem",
          color:      "var(--text-dim)",
          margin:     "0.75rem 0 0",
          letterSpacing: "0.03em",
        }}>
          Delivered as PDF + editable Word documents. No subscription. No upsells.
          Review with your attorney before first use.
        </p>
      </div>

      {/* What's inside */}
      <section style={{ marginBottom: "4rem" }}>
        <div style={{
          borderTop:    "2px solid var(--accent-2)",
          paddingTop:   "2rem",
          marginBottom: "1.5rem",
        }}>
          <div style={{
            fontFamily:    "var(--mono)",
            fontSize:      "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color:         "var(--accent)",
            marginBottom:  "0.6rem",
          }}>
            What&apos;s Included
          </div>
          <p style={{
            fontFamily: "var(--serif)",
            fontSize:   "0.9rem",
            color:      "var(--text-dim)",
            lineHeight: 1.75,
            margin:     0,
            maxWidth:   "560px",
          }}>
            Six documents. Start with the Plain English Guide — it explains every term and every situation
            in language that assumes you have never used a contract before. Then use the five templates on
            your actual jobs. Each template has bracketed decision notes and annotations on every major clause.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {DOCUMENTS.map((doc, i) => (
            <DocumentCard key={doc.number} doc={doc} index={i} />
          ))}
        </div>
      </section>

      {/* Why it's worth it */}
      <section style={{ marginBottom: "4rem" }}>
        <div style={{
          borderTop:    "2px solid var(--accent-2)",
          paddingTop:   "2rem",
          marginBottom: "1.5rem",
        }}>
          <div style={{
            fontFamily:    "var(--mono)",
            fontSize:      "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color:         "var(--accent)",
            marginBottom:  "0.6rem",
          }}>
            Why $9.99
          </div>
          <p style={{
            fontFamily: "var(--serif)",
            fontSize:   "0.9rem",
            color:      "var(--text-dim)",
            lineHeight: 1.75,
            margin:     0,
            maxWidth:   "560px",
          }}>
            This pack pays for itself the first time you use it. Pick whichever scenario applies to you.
          </p>
        </div>

        <div style={{
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap:                 "1rem",
        }}>
          {WORTH_IT.map((item) => (
            <ValueCard key={item.label} {...item} />
          ))}
        </div>
      </section>

      {/* What makes it different */}
      <section style={{ marginBottom: "4rem" }}>
        <div style={{
          borderTop:    "2px solid var(--accent-2)",
          paddingTop:   "2rem",
          marginBottom: "1.5rem",
        }}>
          <div style={{
            fontFamily:    "var(--mono)",
            fontSize:      "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color:         "var(--accent)",
            marginBottom:  "0.6rem",
          }}>
            Not Generic Boilerplate
          </div>
        </div>

        <div style={{
          display:      "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap:          "1px",
          background:   "var(--border)",
          border:       "1px solid var(--border)",
          borderRadius: "4px",
          overflow:     "hidden",
        }}>
          {[
            {
              label: "Production-specific language",
              desc:  "Kill fees, reel rights, raw footage ownership, work-for-hire vs. licensing — the concepts that actually come up in production work, not generic freelance scenarios.",
            },
            {
              label: "Annotated, not naked",
              desc:  "Every major clause has a one-line explanation of what it protects you from and a decision note for the choices that matter. Read the annotations once, then delete them before sending.",
            },
            {
              label: "Decision guidance built in",
              desc:  "Net 15 vs. Net 30, 25% vs. 50% deposit, work-for-hire vs. license — the templates surface the options and tell you which one fits which situation.",
            },
            {
              label: "Designed for all disciplines",
              desc:  "DPs, editors, colorists, motion designers, producers. The language is role-neutral where it should be, and the examples cover all five disciplines.",
            },
            {
              label: "Written by people who use it",
              desc:  "Informed by real production disputes, real client conversations, and California entertainment law. Not a generic LegalZoom template.",
            },
            {
              label: "Attorney-review recommended",
              desc:  "Every document includes a note: have a local attorney review before first use. This is a starting point, not a finished legal product. We're upfront about that.",
            },
          ].map(({ label, desc }) => (
            <div key={label} style={{
              background:   "var(--surface)",
              padding:      "1.25rem 1.5rem",
            }}>
              <div style={{
                fontFamily:  "var(--mono)",
                fontSize:    "0.75rem",
                fontWeight:  "bold",
                color:       "var(--text)",
                marginBottom: "0.4rem",
              }}>
                {label}
              </div>
              <p style={{
                fontFamily: "var(--serif)",
                fontSize:   "0.8rem",
                color:      "var(--text-dim)",
                lineHeight: 1.7,
                margin:     0,
              }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ marginBottom: "4rem" }}>
        <div style={{
          borderTop:    "2px solid var(--accent-2)",
          paddingTop:   "2rem",
          marginBottom: "1.5rem",
        }}>
          <div style={{
            fontFamily:    "var(--mono)",
            fontSize:      "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color:         "var(--accent)",
            marginBottom:  "0.6rem",
          }}>
            Questions
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {[
            {
              q: "Is this legal advice?",
              a: "No. These are templates — a starting point, not finished legal documents. Every document in the pack includes a note recommending attorney review before first use. What you're paying for is a strong, production-industry-informed foundation that your attorney can review and adapt, instead of starting from a blank page.",
            },
            {
              q: "What state is this written for?",
              a: "No specific state. The templates are written to be jurisdiction-neutral — no state-specific assumptions. You'll fill in your own state in the governing law clause. If you're in California, your attorney should review the independent contractor classification language against current AB5 standards.",
            },
            {
              q: "What format will I receive?",
              a: "PDF versions of all five documents, plus editable Word files so you can customize and save your own versions for each client.",
            },
            {
              q: "Can I use these for commercial and narrative work?",
              a: "Yes. The agreements are written to cover both. The IP / copyright section has specific options for commercial work (work-for-hire) versus narrative and artistic work (license or assignment on payment). Decision notes explain which applies to which situation.",
            },
            {
              q: "I already have a contract. Do I need this?",
              a: "Maybe not the full pack. But most freelancer contracts are missing at least one of these: a kill fee structure, a change order process, reel rights language, or a liability cap. If your contract is missing any of those, it's worth reading the annotations here to see what you'd be adding.",
            },
          ].map(({ q, a }) => (
            <div key={q}>
              <div style={{
                fontFamily:  "var(--mono)",
                fontSize:    "0.82rem",
                fontWeight:  "bold",
                color:       "var(--text)",
                marginBottom: "0.5rem",
              }}>
                {q}
              </div>
              <p style={{
                fontFamily: "var(--serif)",
                fontSize:   "0.85rem",
                color:      "var(--text-dim)",
                lineHeight: 1.75,
                margin:     0,
              }}>
                {a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <div style={{
        background:   "var(--surface)",
        border:       "1px solid var(--accent)",
        borderRadius: "4px",
        padding:      "2.5rem 2rem",
        textAlign:    "center",
      }}>
        <div style={{
          fontFamily:    "var(--mono)",
          fontSize:      "0.65rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color:         "var(--accent)",
          marginBottom:  "1rem",
        }}>
          Ready to work protected
        </div>

        <div style={{
          fontFamily: "var(--mono)",
          fontSize:   "clamp(1.4rem, 4vw, 2rem)",
          fontWeight: "bold",
          lineHeight: 1.2,
          marginBottom: "1.5rem",
        }}>
          Stop giving away work.<br />
          Start running a business.
        </div>

        <a
          href={GUMROAD_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display:       "inline-block",
            background:    "var(--accent)",
            color:         "#000",
            fontFamily:    "var(--mono)",
            fontSize:      "0.8rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding:       "1rem 2.5rem",
            textDecoration: "none",
            fontWeight:    "bold",
            borderRadius:  "4px",
          }}
        >
          Get the Pack — $9.99 →
        </a>

        <p style={{
          fontFamily:  "var(--mono)",
          fontSize:    "0.68rem",
          color:       "var(--text-dim)",
          margin:      "1rem 0 0",
        }}>
          Instant download. No subscription.
        </p>
      </div>

    </div>
  );
}
