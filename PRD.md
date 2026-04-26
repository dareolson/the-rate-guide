# The Rate Guide — Product Requirements Document

**URL:** therateguide.com
**Status:** Live / Active development
**Owner:** Derek Olson

---

## What It Is

A free day rate calculator for creative freelancers in film, video, and motion. Users enter their income goal, location, experience level, and discipline — the calculator works backwards through self-employment tax, health insurance, and profit margin to output the day rate they actually need to charge.

Alongside the calculator: a growing library of research-backed rate guides per discipline, a store with a $9.99 contract pack, and an affiliate product shelf.

---

## Who It's For

Freelance creatives who undercharge because they've never done the math: cinematographers, video editors, colorists, motion designers, producers, gaffers, sound mixers, camera operators. Primarily US-based. Mix of emerging freelancers setting their first rate and mid-career people validating whether they're leaving money on the table.

---

## Problems It Solves

1. Most freelancers guess at their rate based on what other people charge, not what they need to earn
2. Self-employment tax (15.3%) and health insurance are invisible costs that most rate guides ignore
3. No single resource connects "what do I need to take home" to "what do I need to quote"

---

## Core Features

### Calculator
- Inputs: discipline, experience level, market size, desired take-home, billable days, optional kit fee and profit margin
- Health insurance: ZIP-based lookup via CMS Marketplace API with manual fallback for state-run exchanges
- Outputs: day rate, half-day rate, hourly rate with full line-item breakdown
- Market range panel: rate floor/ceiling by discipline + experience + location
- Shareable URL (`?d=...&e=...`) and client-facing read-only view (`?client=1`)
- Saved scenarios via localStorage
- Email results via Resend

### Rate Guides
- SEO blog posts per discipline with real survey data and inline React charts
- Live: cinematographer, video editor, colorist, motion designer, producer
- Coming soon: gaffer, sound mixer, camera operator

### Store
- Contract Pack — $9.99 on Gumroad (6 documents: services agreement, quote sheet, change order, invoice, email templates, plain English guide)
- Affiliate products (books, software, services)

### Community
- Discord linked in nav

---

## Business Model

| Revenue stream | Status |
|---|---|
| Contract Pack ($9.99) | Live on Gumroad |
| Affiliate commissions | Live (store page) |
| Email list | Capturing — no campaigns yet |
| Pro tier / saved rate history | Backlog |

---

## Tech Stack

Next.js (App Router) · Supabase · Vercel · Resend · Cloudflare Turnstile · CMS Marketplace API · Vercel Analytics

---

## Open Backlog

Priority order:

1. Remaining discipline guides — gaffer, sound mixer, camera operator
2. Mobile audit — radio groups and inputs untested on small screens
3. "Share your rate card" prompt — `?client=1` URL exists but no copy-link affordance in results panel
4. Supabase RLS policy audit — anon key is client-side; RLS must be enabled on all tables
5. Upstash Redis rate limiting — current in-memory Map doesn't survive cold starts or multiple instances
6. Rotate `RESEND_API_KEY` — Vercel flagged it as "Needs Attention"
7. Email campaigns — list is growing, no sends yet
8. Pro tier — saved rate history across sessions, requires auth
