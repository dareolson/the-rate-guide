# CMS Health Insurance Marketplace API — Integration Notes

## Status: Built, waiting on API key

Everything is coded and pushed. The only thing blocking activation is the API key.

---

## What was built

**New API route:** `src/app/api/health-insurance/route.ts`
- Takes a ZIP code as a query param
- Calls CMS Marketplace API to resolve ZIP → county FIPS
- Fetches all Silver plans for that county (single adult, age 35)
- Returns average monthly and annual premium + county name + plan count
- 24-hour server-side cache so we're not hammering the API on every keystroke
- Falls back gracefully — if anything fails, caller uses static $7,400 default

**Calculator changes:** `src/lib/calculator.ts`
- Added optional `healthInsurance` field to `CalcInputs`
- `calculate()` uses it when present, falls back to `HEALTH_INSURANCE_ANNUAL` ($7,400) when not

**UI changes:** `src/app/page.tsx`
- ZIP code input field added to income calculator section
- Fires lookup on blur when 5-digit ZIP is entered
- Shows inline status: loading → county name + avg monthly cost → or error fallback
- Border color changes: gold on success, red on error
- Results breakdown note updates to cite the county when ZIP-based data was used

---

## To activate

### Step 1 — Paste the key locally
Edit `.env.local` in the project root (already created, gitignored):
```
CMS_MARKETPLACE_API_KEY=your_key_here
```

### Step 2 — Add to Vercel (for production)
Vercel dashboard → the-rate-guide project → Settings → Environment Variables
- Key: `CMS_MARKETPLACE_API_KEY`
- Value: your key
- Environments: Production + Preview

### Step 3 — Test it
Run `npm run dev`, open the calculator, expand "What should I charge to hit a goal?", enter a ZIP. Should show something like:
> Los Angeles County, CA — avg Silver plan $643/mo

---

## Where the key comes from
Applied at: `https://developer.cms.gov/marketplace-api/key-request.html`
- Form fields: name, email, company (optional), phone (for 2FA texts), app URL (optional), use case
- Keys are emailed after review — usually same day
- **Keys expire every 60 days** — CMS auto-emails a replacement before expiry

---

## What to do when the key arrives
1. Paste into `.env.local`
2. Add to Vercel env vars
3. Test a few ZIPs manually (try a CA zip, a TX zip, a rural zip)
4. Redeploy on Vercel (or it picks up automatically on next push)

---

## Known limitations of the CMS API
- Only covers federal exchange states (HealthCare.gov states)
- State-run exchanges (CA, NY, WA, CO, MA, MD, MN, CT, RI, VT, DC, ID, NV, NM, OR, PA, NJ, KY, ME) use separate platforms — the API may return no plans for those ZIPs
- If no Silver plans are found for a ZIP, the route returns a 500 and the UI falls back to the static average
- May be worth adding a note to the UI for state-exchange states explaining why no data was returned

---

## Next APIs queued up (from research session)
After CMS key is working, the next planned integrations were:
1. **Census Geocoder + BLS CPI** — city-level cost of living, free, no key needed
2. **FRED Regional Price Parities** — better COL comparison math, free key from fred.stlouisfed.org
3. **PostHog** — product analytics with session recording and funnels
4. **Claude API** — AI coaching layer as a premium tier differentiator
