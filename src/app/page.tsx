// Server component — no "use client" directive.
// Renders static header and structured data as real HTML for SEO,
// then drops in the client Calculator wrapped in Suspense.

import { Suspense } from "react";
import Calculator from "./Calculator";
import {
  HEALTH_INSURANCE_ANNUAL,
  SE_TAX_RATE,
  RATE_FLOORS,
} from "@/lib/calculator";

// ==============================================
// STRUCTURED DATA (JSON-LD)
// Two schemas:
//   1. WebApplication — tells Google this is a tool
//   2. FAQPage — targets "People Also Ask" results
// ==============================================
function StructuredData() {
  const appSchema = {
    "@context":            "https://schema.org",
    "@type":               "WebApplication",
    "name":                "The Rate Guide — Freelance Day Rate Calculator",
    "url":                 "https://therateguide.com",
    "description":         "Free day rate calculator for creative freelancers. Enter your take-home goal and calculate the day rate you need to cover self-employment tax, health insurance, and profit margin — then see where you fall in the market.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem":     "Web",
    "offers": {
      "@type":         "Offer",
      "price":         "0",
      "priceCurrency": "USD",
    },
    "audience": {
      "@type":        "Audience",
      "audienceType": "Creative freelancers — cinematographers, DPs, video editors, colorists, motion designers, producers, camera operators",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type":    "FAQPage",
    "mainEntity": [
      {
        "@type":          "Question",
        "name":           "How do I calculate my freelance day rate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":  `Start with your annual take-home goal, add health insurance (~$${HEALTH_INSURANCE_ANNUAL.toLocaleString()}/year for an individual), then add self-employment tax (${Math.round(SE_TAX_RATE * 100 * 10) / 10}%), and an optional 20% profit margin. Divide the total by your estimated billable days (typically 100–175/year). This gives the day rate you need to break even and build a sustainable business.`,
        },
      },
      {
        "@type":          "Question",
        "name":           "How much should a freelance cinematographer or DP charge per day?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":  `Freelance cinematographer (DP) day rates typically range from $${RATE_FLOORS["Cinematographer / DP"]["Emerging"]}–$${RATE_FLOORS["Cinematographer / DP"]["Mid"]}/day for emerging to mid-level, and $${RATE_FLOORS["Cinematographer / DP"]["Senior"]}–$${RATE_FLOORS["Cinematographer / DP"]["Expert"]}/day for senior and expert DPs. Rates increase by roughly 30% in major markets like New York or Los Angeles.`,
        },
      },
      {
        "@type":          "Question",
        "name":           "What is a fair day rate for a freelance video editor?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":  `Freelance video editor day rates generally range from $${RATE_FLOORS["Video Editor"]["Emerging"]}–$${RATE_FLOORS["Video Editor"]["Mid"]}/day for emerging to mid-level editors, up to $${RATE_FLOORS["Video Editor"]["Senior"]}–$${RATE_FLOORS["Video Editor"]["Expert"]}/day for senior and expert editors. Major markets like LA and NYC command a 30% premium.`,
        },
      },
      {
        "@type":          "Question",
        "name":           "How much does a freelance colorist charge per day?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":  `Freelance colorist day rates range from $${RATE_FLOORS["Colorist"]["Emerging"]}/day for emerging colorists up to $${RATE_FLOORS["Colorist"]["Expert"]}/day for expert colorists. Colorists who own a DaVinci Resolve Studio suite or work in specialized genres typically command higher rates.`,
        },
      },
      {
        "@type":          "Question",
        "name":           "What should a freelance motion designer charge per day?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":  `Freelance motion designer day rates range from $${RATE_FLOORS["Motion Designer"]["Emerging"]}/day for emerging designers to $${RATE_FLOORS["Motion Designer"]["Expert"]}/day for expert motion designers. Rates depend on software specialization, client type, and market.`,
        },
      },
      {
        "@type":          "Question",
        "name":           "Why do freelancers need to charge more than salaried employees?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":  `Freelancers pay both the employee and employer halves of Social Security and Medicare taxes — a ${Math.round(SE_TAX_RATE * 100 * 10) / 10}% self-employment tax that salaried workers split with their employer. Freelancers also pay their own health insurance (often $600–$1,800/month), have no paid time off, and must cover slow periods with revenue from billable days. These costs must be built into the day rate to break even.`,
        },
      },
      {
        "@type":          "Question",
        "name":           "How many billable days per year does a freelancer actually work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":  "Most full-time freelancers bill between 100 and 175 days per year. The rest goes to unpaid admin, business development, travel, invoicing, taxes, and seasonal slowdowns. 150 days is a realistic estimate for an established freelancer.",
        },
      },
      {
        "@type":          "Question",
        "name":           "How does location affect freelance day rates?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":  "Major markets like New York, Los Angeles, and Chicago typically pay 25–35% more than national baseline rates due to higher cost of living and denser production markets. Mid-sized markets approximate the national baseline. Smaller markets run 10–20% below.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}

// ==============================================
// PAGE
// Server-rendered shell. Static content here is
// immediately in the HTML response — no JS needed.
// Calculator is client-only and loads inside Suspense.
// ==============================================
export default function Page() {
  return (
    <>
      <StructuredData />
      <Suspense>
        <Calculator />
      </Suspense>
    </>
  );
}
