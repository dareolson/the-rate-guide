# The Rate Guide — Build Log & Design Reference

Running record of every feature, design decision, and UX pattern built into therateguide.com.
Use this to onboard Claude in a new session, replicate patterns in future projects, or hand off to another dev.

---

## Stack

| Layer | Tool | Notes |
|---|---|---|
| Framework | Next.js (App Router) | Server + client components, static + dynamic routes |
| Styling | Inline styles only | No Tailwind, no CSS modules. Consistent with dareolson.com approach |
| Database | Supabase (Postgres) | Anonymous event logging only — no user accounts on this site |
| Hosting | Vercel | Auto-deploys from GitHub master branch |
| Email | Resend | Send-results email with dark HTML template |
| Analytics | Vercel Analytics | `track()` calls for custom events |
| External API | CMS Health Insurance Marketplace API | ZIP-based Silver plan premium lookup |

---

## Design System

### Colors (CSS variables, defined in globals.css)

| Variable | Value | Use |
|---|---|---|
| `--bg` | `#0e0e0e` | Page background |
| `--surface` | `#161616` | Card/panel backgrounds |
| `--border` | `#2a2a2a` | Borders, dividers |
| `--text` | `#e8e0d0` | Primary text (cream) |
| `--text-mid` | `#b0a898` | Secondary body text |
| `--text-dim` | `#706860` | Labels, placeholders, muted |
| `--accent` | `#d4920a` | Gold — CTAs, active states, highlights |

### Typography

| Variable | Font | Use |
|---|---|---|
| `--mono` | `"IBM Plex Mono"` | All labels, buttons, inputs, numbers |
| `--sans` | `"Inter"` | Body copy, explanatory text |

### Component Patterns

**Label** — uppercase mono, 0.78rem, `--text`, 0.07em letter-spacing. Used above every input group.

**RadioGroup** — flex row of buttons. Active state: accent border + accent text + `rgba(212,146,10,0.12)` background. Inactive: dim text + border color border.

**Section dividers** — numbered eyebrows (`01`, `02`, `03`) in accent color, full-width border line, uppercase label in `--text-dim`.

**Input fields** — `background: var(--surface)`, `border: 1px solid var(--border)`, `color: var(--text)`, mono font. No browser autocomplete (`autoComplete="off"`). Rate/number inputs use `step="50"`.

**Buttons** — primary CTA: accent background, black text, mono font, 0.2em letter-spacing, uppercase, bold. Disabled state: `opacity: 0.4`, `cursor: not-allowed`.

---

## Architecture

### File Structure

```
src/
  app/
    page.tsx                         — Server component. JSON-LD schemas + <Suspense><Calculator /></Suspense>
    Calculator.tsx                   — "use client". All interactive logic. ~2100 lines.
    layout.tsx                       — Global nav (sticky, frosted glass), Analytics, font loading
    methodology/
      page.tsx                       — Static page. SEO metadata + full formula explainer.
    guides/
      page.tsx                       — Rate Guides index. GUIDES array + FeaturedCard + GridCard. comingSoon flag.
    cinematographer-day-rate/
      page.tsx                       — SEO post. IATSE Local 600, No Film School data, 4 React charts.
    video-editor-day-rate/
      page.tsx                       — SEO post. Cutjamm 2025, IATSE Local 700, 4 React charts.
    colorist-day-rate/
      page.tsx                       — SEO post. IATSE Local 700, Mixing Light survey, DC Color rate card.
    store/
      page.tsx                       — Store index. Contract pack featured card.
      contract-pack/
        page.tsx                     — Product page. $9.99. Buy buttons live — links to Gumroad.
    api/
      health-insurance/
        route.ts                     — GET /api/health-insurance?zip=XXXXX → Silver plan avg premium
      send-results/
        route.ts                     — POST /api/send-results → Resend dark HTML email with calc results
  components/
    NavAuthLink.tsx                  — Auth-aware nav link (sign in / dashboard)
  lib/
    calculator.ts                    — All math, constants, discipline data, types
    supabase/
      client.ts                      — Supabase browser client
documents/
  contract-pack/                     — 6 .md + 6 .pdf files — upload to Gumroad to sell
```

### Server vs Client Split

`page.tsx` is a server component — renders the JSON-LD schemas as real HTML in the initial response (good for SEO). It has no interactivity. `Calculator.tsx` is the full client component wrapped in `<Suspense>`.

This split allows the homepage to build as a static page (`○ Static` in Next.js build output) while the calculator hydrates on the client.

---

## Calculator Logic (src/lib/calculator.ts)

### Formula

```
take_home          = user input
health_insurance   = ZIP lookup (CMS API) ?? manual entry ?? HEALTH_INSURANCE_ANNUAL (static fallback)
subtotal_1         = take_home + health_insurance
se_tax             = subtotal_1 * 0.153          // 15.3% self-employment tax
subtotal_2         = subtotal_1 + se_tax
profit             = subtotal_2 * 0.20           // optional 20% margin (toggle)
total_gross        = subtotal_2 + profit
day_rate           = total_gross / billable_days
half_day_rate      = day_rate * 0.60
hourly_rate        = day_rate / 10
kit_fee            = 300                         // optional toggle, listed separately
```

### Rate Floors (market minimums by discipline + experience)

Stored in `RATE_FLOORS` constant. Disciplines: Camera Operator, Cinematographer / DP, Video Editor, Colorist, Motion Designer, Producer, Gaffer, Grip, Sound Mixer, Production Designer, Photographer.

Location multipliers: Major Market 1.3x, Mid Market 1.0x, Small Market 0.85x.

### Key Constants

| Constant | Value | Notes |
|---|---|---|
| `HEALTH_INSURANCE_ANNUAL` | 7200 | Static fallback if no ZIP lookup |
| `SE_TAX_RATE` | 0.153 | IRS self-employment tax |
| `PROFIT_RATE` | 0.20 | Default profit margin |
| `DEFAULT_BILLABLE_DAYS` | 150 | Slider default |
| `KIT_FEE` | 300 | Industry standard kit fee |

---

## Features Built

### Calculator Core
- Discipline dropdown (required — gates Calculate button until selected)
- Experience level radio (Emerging / Mid / Senior / Expert)
- Location tier radio (Major / Mid / Small market)
- Desired take-home input (number, raw string to avoid leading-zero issues)
- Billable days input (number, step=50)
- Kit fee toggle
- Profit margin toggle
- Calculate My Rate button — disabled + `opacity: 0.4` until discipline is selected; shows hint text below button

### Market Range Panel
- Shows rate floor/ceiling for selected discipline + experience + location
- Conditionally renders only after discipline is selected
- Includes current rate input (step=50) with gap analysis

### Results Panel
- Animated count-up on day rate (700ms ease-out cubic)
- Line-item breakdown: take-home, health insurance, SE tax, profit, total gross, billable days
- Day rate, half-day rate, hourly rate output
- Kit fee displayed separately if enabled
- MIT Living Wage comparison (note: MIT figures are pre-tax; our results are post-tax take-home — these are comparable because we're showing what you need to earn to clear that take-home)
- "Below floor" warning when calculated rate is under market minimum

### Health Insurance ZIP Lookup
- GET `/api/health-insurance?zip=XXXXX`
- Resolves ZIP → county FIPS via CMS counties API
- Fetches Silver plan premiums for age 35 single adult
- Tries current year, falls back to prior year if no data
- Returns average monthly + annual premium, plan count, state, county
- State-run exchange ZIPs (CA, NY, WA, etc.) return `{ error: "state-exchange", state }` — UI handles with manual entry option
- Status states: `idle` | `loading` | `ok` | `error` | `state-exchange`
- Manual entry UI: two toggle buttons ("Use national avg" / "Enter my premium") + number input (step=50)
- Env var: `CMS_MARKETPLACE_API_KEY` in Vercel

### Email Results
- POST `/api/send-results`
- Dark HTML email template via Resend
- Sends day rate, half-day, hourly, breakdown line items
- Env var: `RESEND_API_KEY` in Vercel

### URL State / Shareable Links
- Calculator inputs encoded into URL params (`?d=...&e=...&l=...&th=...&bd=...`)
- Client rate card URL: `?client=1` renders a separate read-only view for sharing with clients
- URL params decoded on load, pre-fill the form

### Saved Scenarios
- localStorage persistence via `useSavedScenarios` hook
- User can save/remove multiple rate scenarios
- Shown in a panel below results

### Anonymous Event Logging
- On every calculate: inserts row into Supabase `calc_events` table
- Fields: discipline, experience, location, day_rate, below_floor, has_kit, billable_days

### SEO
- JSON-LD structured data: `WebApplication` + `FAQPage` schemas in server component
- FAQPage answers pull live from `RATE_FLOORS` and `SE_TAX_RATE` constants
- Methodology page: `/methodology` with keyword-rich metadata, 10-section formula explainer, anchor-linked table of contents
- Homepage `<h1>` visible in HTML (not just styled divs) for crawler readability

### UX Details
- `autoComplete="off"` on all numeric/text inputs; `autoComplete="email"` on email field only
- `step="50"` on current rate + gap analysis inputs
- Discipline select border highlights in accent gold when no discipline is selected yet
- All user-facing copy follows stop-slop rules: no em dashes, no adverbs, no binary contrasts, no passive voice, no throat-clearing

---

## Sessions Log

### 2026-04-17 / 2026-04-18

**Features added:**
- Health insurance ZIP lookup (CMS Marketplace API)
- State-run exchange detection + manual premium entry UI
- Manual premium input: toggle between national average and custom entry, step=50
- `autoComplete="off"` on all inputs
- `step="50"` on rate inputs
- Discipline select required — gates Calculate button; accent border + hint text when unselected
- Server/client component split (page.tsx server, Calculator.tsx client) for static build + SEO
- JSON-LD structured data (WebApplication + FAQPage) in server component
- Methodology page full rewrite with stop-slop rules
- Email template stop-slop pass
- All calculator copy stop-slop pass

**Bugs fixed:**
- CMS API key not propagating — required Vercel redeploy after adding env var
- State-run exchange ZIPs returning no data — handled with `state-exchange` status + manual fallback
- Git conflict on Calculator.tsx (home machine pushed while session was in progress) — resolved with `git pull --rebase`
- TypeScript build error on `resend` module — fixed with `npm install resend`
- Calculate button grayed out — home machine commit defaulted discipline to `""` which triggered `!inputs.discipline` gate; fixed with visual affordances (accent border, hint text)

### 2026-04-19

**Features added:**
- `/cinematographer-day-rate` — SEO blog post, ~1,400 words, research-backed
  - Data: No Film School survey (2,000+ respondents), IATSE Local 600 rate cards, Assemble, Ambient Skies
  - 4 inline React chart components: rate range bars, production type table, union rates table, market multiplier bars
  - Hero image via Unsplash (`next/image`), gradient overlay, photo credit
  - CTA links to calculator pre-filled with `?d=Cinematographer+%2F+DP`
  - Enabled Unsplash remote images in `next.config.ts`
- `/video-editor-day-rate` — SEO blog post, ~1,500 words, research-backed
  - Data: Cutjamm 2025 salary survey (201 respondents), IATSE Local 700 2024-27 Majors Agreement, ZipRecruiter April 2026, Creative COW practitioner forum
  - 4 inline React chart components: rate range bars, production type table, union rates table, pricing model breakdown chart
  - Covers day rate vs. hourly vs. project rate debate with real numbers
  - Post house markup section (2.5–4x markup data from Creative COW)
  - CTA links to calculator pre-filled with `?d=Video+Editor`
- "Rate Guides" link added to global nav (`layout.tsx`) pointing to cinematographer post
  - When more posts exist, this should become a `/guides` index page or dropdown

**Content strategy note:**
Both posts follow the same template: hero image + eyebrow + H1 + intro with data hook + TOC + sections with H2/H3 + inline React charts + callout blocks + CTA box + sources. Reuse this pattern for every new discipline post.

### 2026-04-20 / 2026-04-21

**Features added:**
- `/colorist-day-rate` — SEO blog post, written by Derek at home
  - Data: IATSE Local 700, Mixing Light pay transparency survey, colorbox.net, dayrates.org, DC Color rate card
  - CTA links to calculator pre-filled with `?d=Colorist`
- `/guides` — Rate Guides index page
  - GUIDES array with `comingSoon?: boolean` field on Guide type
  - 8 entries: 3 live (Cinematographer, Video Editor, Colorist), 5 coming-soon (Motion Designer, Producer, Camera Operator, Sound Mixer, Gaffer)
  - FeaturedCard + GridCard components — both handle comingSoon: dimmed, non-clickable, "Coming Soon" badge
  - To activate a card when a post is ready: remove `comingSoon: true` from the GUIDES entry
  - Nav link updated from `/cinematographer-day-rate` to `/guides`
- `/store/contract-pack` — Freelancer's Contract Pack product page
  - Price: $9.99
  - Gumroad URL preserved as `GUMROAD_URL` constant: `"https://daredevil484.gumroad.com/l/ktqssh"`
  - Buy buttons live — `<a>` tags pointing at `GUMROAD_URL`, product uploaded and active on Gumroad
- `/store` — Featured contract pack with gold border + "Original" badge; links to /store/contract-pack
- Community nav button — gold outlined button added to global nav (layout.tsx)
  - `href="#"` placeholder — wire up real Discord invite URL when ready
  - Styled: accent color, 1px accent border, mono font, uppercase, borderRadius 3px

**Copy changes:**
- Removed "actually" from all store copy (/store and /store/contract-pack)

**Email / DNS:**
- Resend fully verified and working as of 2026-04-21
- Resend requires SPF record on `send` subdomain (host=`send`, not `@`)
- Resend requires MX record on `send` subdomain — must be added via Namecheap Advanced DNS tab (not Mail Settings, which only handles root domain)
- MX priority value: `10`

**Email capture discovery:**
- EmailCapture component already fully built in Calculator.tsx (line ~823)
- Already rendered in results panel (line ~1126): `<EmailCapture results={results} inputs={inputs} currentRate={currentRate} />`
- Inserts to Supabase `email_captures` table (email, discipline, experience, location, day_rate, current_rate)
- Fires `/api/send-results` as fire-and-forget after insert
- Shows success state "Check your inbox"
- Tracks with Vercel Analytics `track("email_capture", ...)`
- `email_captures` table defined in `supabase-schema.sql` — verify it exists in Supabase dashboard before testing

**Contract pack documents (in `documents/contract-pack/`):**
- `00-plain-english-guide.md`
- `01-freelance-services-agreement.md`
- `02-project-quote-sheet.md`
- `03-change-order-form.md`
- `04-invoice-template.md`
- `05-email-templates.md`
- All 6 docs have PDF counterparts — uploaded to Gumroad, live at $9.99

---

---

## 2026-04-21 — Contract Pack Launch

### Word Doc Export
- Installed pandoc via Homebrew
- Created `/tmp/make-reference.py` — generates a styled `reference.docx` (Calibri, navy/amber palette, clean heading hierarchy)
- Converted all 6 markdown sources to `.docx` via pandoc + reference doc, output to `documents/contract-pack/docx/`
- Fixed dollar-sign/backtick parsing issue in pandoc markdown (`\$` escaping in contract and email template sources)

### Packaging
- Added "protect your originals" warning section to `00-plain-english-guide.md`
- Created `documents/contract-pack/package-zip.sh` — builds `Freelancers-Contract-Pack.zip` with:
  - `READ ME FIRST — Plain English Guide.pdf` at root
  - `contracts/` folder (5 editable Word docs)
  - `originals — do not edit/` folder (same 5 files as safety net)
- Run `bash documents/contract-pack/package-zip.sh` to rebuild zip after any changes

### Gumroad
- Contract Pack published at $9.99: `daredevil484.gumroad.com/l/therateguidecontractpack`
- Zip uploaded as the delivery file

### Email CTA
- Added Contract Pack soft sell block to rate results email (`/api/send-results/route.ts`)
- Appears between the methodology link and footer
- Links directly to Gumroad listing

---

## 2026-04-24

### Housekeeping
- Confirmed Discord invite URL (`https://discord.gg/72uq9Bsh`) wired into Community nav button — removed from backlog
- Confirmed `email_captures` table exists in Supabase (3 rows, all test entries from Derek)
- Added `TURNSTILE_SECRET_KEY` and `NEXT_PUBLIC_TURNSTILE_SITE_KEY` to env var table in BUILDLOG
- Added Resend API key rotation to backlog (key stored in plaintext — Vercel flagged it as "Needs Attention")

### Motion Designer Rate Guide
- `/motion-designer-day-rate` — SEO blog post, ~2,000 words, research-backed
  - Data: School of Motion 2024 State of the Industry survey, ZipRecruiter April 2026, IATSE Local 839 (Animation Guild) 2024–27 Majors Agreement, Motionographer community
  - 4 inline React chart components: rate range bars by experience, specialization bars (2D → Houdini FX), production type table, IATSE Local 839 union rate table
  - Key differentiator from other posts: 2D vs 3D rate split, render time billing, styleframes as a billable deliverable
  - CTA links to calculator pre-filled with `?d=Motion+Designer`
  - `comingSoon` flag removed from `/guides` — card is now live and clickable

### Email Capture Bug Fix
- **Root cause:** Cloudflare Turnstile siteverify URL was `v1` — that endpoint only accepts GET (405 on POST). Correct URL is `v0`.
- **Investigation path:**
  - Added status-specific error messages to client (429 = rate limit, 403 = security check failed)
  - Added `console.error` logging of Turnstile error codes and HTTP status to Vercel function logs
  - Added `cache: no-store` to fetch (Next.js App Router caches fetch by default)
  - Confirmed via curl that `challenges.cloudflare.com/turnstile/v1/siteverify` returns `Allow: GET` — wrong version
  - `v0` endpoint accepts JSON POST and returns proper error JSON
- Email capture now working end-to-end

### Email Template — Contract Pack
- Banner image (`public/contract-pack-banner.png`) added above contract pack section, wrapped in Gumroad link
- Eyebrow label changed from cream to gold
- Price (`$9.99`) now visible in section heading
- Body copy expanded to name all six documents
- Soft text link replaced with full gold CTA button matching the day rate hero style

---

## 2026-04-25

### Housekeeping
- Added `PRD.md` to repo root — product overview, problem statement, feature list, business model, tech stack, and open backlog
- Rotated `RESEND_API_KEY` — generated new key in Resend, updated in Vercel as Sensitive (Production + Preview only), revoked old key, redeployed. Removed from backlog.
  - Sensitive variables cannot target Development in Vercel — Development env left without the key (not needed locally)

---

## 2026-04-22 — Security Pass

Addressed all open security issues identified by a systematic review of the codebase.

### Input Validation — `/api/send-results`
- Route was accepting raw unvalidated JSON — anyone could POST arbitrary email addresses and abuse Resend as a relay
- Added `isValidPayload()` type guard: validates email format (regex), all string fields non-empty, `dayRate` is a positive number under 100,000, `currentRate` is null or a non-negative number
- Replaced loose `if (!email || !dayRate)` check — new validator covers all fields and types

### Rate Limiting — `/api/send-results`
- Added IP-based rate limiter: 5 requests per IP per 60-second window
- Module-level `Map` — functional within a single serverless instance, resets on cold start
- Note: for cross-instance rate limiting, replace with Upstash Redis + `@upstash/ratelimit` (backlog item)

### Security Headers — `next.config.ts`
- Added to all routes via `headers()` config:
  - `X-Frame-Options: DENY` — prevents clickjacking
  - `X-Content-Type-Options: nosniff` — prevents MIME sniffing
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Unsubscribe Link
- Email footer unsubscribe was linking to homepage (not a real unsubscribe — CAN-SPAM violation)
- Fixed to `mailto:hello@therateguide.com?subject=Unsubscribe`

### .gitignore
- Added `documents/contract-pack/*.zip` — generated artifact, belongs on Gumroad not in git

### Cloudflare Turnstile (Bot Protection) — `Calculator.tsx` + `/api/send-results`
- Added Turnstile widget to `EmailCapture` component — renders invisible/managed challenge before form submit
- Turnstile script loaded via `<Script>` in `layout.tsx`
- `EmailCapture` renders a `<div ref={turnstileRef}>` that Turnstile mounts into; token stored in state
- Submit button disabled until token is present
- Token sent to `/api/send-results` as `turnstileToken` field
- API verifies token against `https://challenges.cloudflare.com/turnstile/v1/siteverify` using `TURNSTILE_SECRET_KEY` env var
- If `TURNSTILE_SECRET_KEY` is not set, verification is skipped (safe for local dev)
- Returns 403 if bot check fails
- Supabase insert moved server-side to `/api/send-results` (after rate limit + Turnstile pass) — removed client-side insert from `Calculator.tsx`
- New fields passed to API: `takeHome`, `billableDays` (stored in `email_captures` table)

### Unit Tests — `src/lib/calculator.test.ts`
- Added Vitest test suite for all exported functions in `calculator.ts`
- Run with: `npm test`
- Covers: `federalEffectiveRate`, `calculate`, `currentEarnings`, `marketRange`, `realityCheck`, `fmt`
- Tests bracket boundaries, edge cases, and output shape
- 377 lines — comprehensive coverage of the core math

---

## Backlog / Suggestions

> ~~**Security:** Rotate `RESEND_API_KEY`~~ — Done 2026-04-25. New key saved as Sensitive in Vercel (Production + Preview), old key revoked.

> **Security:** Upgrade to Upstash Redis rate limiting — current in-memory `Map` resets on cold start and doesn't work across multiple serverless instances. Install `@upstash/ratelimit` + `@upstash/redis`, add two env vars from Upstash dashboard, replace ~15 lines in both API routes. ~30 min.

> **Security:** Verify Supabase RLS policies — the anon key is exposed client-side (normal for Supabase), but Row-Level Security must be enabled on `profiles`, `rate_history`, and `email_captures` tables or any authenticated user can read/write other users' data. Check Supabase dashboard → Authentication → Policies.

> **Security:** Tighten Content-Security-Policy — current CSP uses `'unsafe-inline'` for scripts (required for Next.js inline scripts). Long-term fix is to use nonce-based CSP. Not urgent but worth revisiting when there's time.

Priority order based on impact:

1. ~~**Motion designer rate guide**~~ — Done. `/motion-designer-day-rate` live. Covers rate ranges by experience + specialization (2D/3D/Houdini), production type table, IATSE Local 839 union context, billing models, and six motion-design-specific pricing mistakes. `comingSoon` flag removed from `/guides`.

2. ~~**Wire Discord invite URL**~~ — Done. `https://discord.gg/72uq9Bsh` wired into Community nav button in `layout.tsx`.

3. **Verify `email_captures` table in Supabase** — Check Supabase dashboard > Table Editor. If missing, run the CREATE TABLE block from supabase-schema.sql in the SQL Editor.

4. **More rate guide posts** — gaffer, sound mixer, camera operator remaining. Producer done 2026-04-25. Cards in /guides already exist as coming-soon — remove `comingSoon: true` to activate each one.

5. **Supabase dashboard** — Read `calc_events` table to see which disciplines are most popular, what take-home goals people enter, whether users hit the Calculate button. Data should inform what to build next.

6. **More disciplines** — Writers, photographers, web designers, brand strategists all search for rate calculators. Expanding the discipline list widens SEO surface.

7. **Mobile audit** — Radio button groups and number inputs on small screens need a real look. Most organic search traffic lands on mobile first.

8. **Share your rate card** — Client-facing URL (`?client=1`) exists but there's no obvious "share this" prompt after calculating. A visible copy-link button in the results panel would increase return visits and word-of-mouth.

---

## Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `CMS_MARKETPLACE_API_KEY` | Vercel | CMS Health Insurance Marketplace API |
| `RESEND_API_KEY` | Vercel | Resend email sending |
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel + `.env.local` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel + `.env.local` | Supabase anon key |
| `TURNSTILE_SECRET_KEY` | Vercel | Cloudflare Turnstile bot protection (email capture) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Vercel + `.env.local` | Cloudflare Turnstile site key (client-side widget) |

---

## Deployment

- Hosted on Vercel, connected to `dareolson/the-rate-guide` GitHub repo
- Auto-deploys on push to `master`
- After adding/changing env vars in Vercel dashboard, a manual redeploy is required for them to take effect
