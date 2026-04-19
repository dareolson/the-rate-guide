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
    page.tsx               — Server component. Renders JSON-LD structured data + <Suspense><Calculator /></Suspense>
    Calculator.tsx         — "use client". All interactive logic. ~2100 lines.
    methodology/
      page.tsx             — Static page. SEO metadata + full formula explainer.
    api/
      health-insurance/
        route.ts           — GET /api/health-insurance?zip=XXXXX → Silver plan avg premium
      send-results/
        route.ts           — POST /api/send-results → Resend email with calc results
  lib/
    calculator.ts          — All math, constants, discipline data, types
    supabase/
      client.ts            — Supabase browser client
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

---

## Backlog / Suggestions

Priority order based on impact:

1. **More rate guide posts** — colorist, motion designer, producer, gaffer, sound mixer. Each is a standalone SEO page. Same research + write pattern. I can do these one at a time, no input needed from Derek.

2. **Rate Guides index page** (`/guides`) — once 3+ posts exist, a landing page listing all posts with discipline thumbnails. Nav link points there instead of directly to one post.

3. **Email capture** — "Email me my results" opt-in with list-building prompt. Users who calculate are self-identified freelancers. List feeds future product launches (Clientward, etc.).

4. **Supabase dashboard** — Read `calc_events` table to see which disciplines are most popular, what take-home goals people enter, whether users hit the Calculate button. Data should inform what to build next.

5. **More disciplines** — Writers, photographers, web designers, brand strategists all search for rate calculators. Expanding the discipline list widens SEO surface.

6. **Mobile audit** — Radio button groups and number inputs on small screens need a real look. Most organic search traffic lands on mobile first.

7. **Share your rate card** — Client-facing URL (`?client=1`) exists but there's no obvious "share this" prompt after calculating. A visible copy-link button in the results panel would increase return visits and word-of-mouth.

---

## Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `CMS_MARKETPLACE_API_KEY` | Vercel | CMS Health Insurance Marketplace API |
| `RESEND_API_KEY` | Vercel | Resend email sending |
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel + `.env.local` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel + `.env.local` | Supabase anon key |

---

## Deployment

- Hosted on Vercel, connected to `dareolson/the-rate-guide` GitHub repo
- Auto-deploys on push to `master`
- After adding/changing env vars in Vercel dashboard, a manual redeploy is required for them to take effect
