# URWorthy — Rate Calculator Logic & Copy

## Purpose
A transparent, education-first rate calculator for creative freelancers.
The goal is not just to output a number — it is to show the math and explain *why*
so freelancers understand their true worth and stop undercharging.

---

## Inputs

| Field | Type | Options / Notes |
|---|---|---|
| Discipline | Dropdown | Camera Operator, Cinematographer/DP, Video Editor, Colorist, Motion Designer, Producer (more to be added) |
| Experience Level | Radio | Emerging (0–3 yrs), Mid (4–7 yrs), Senior (8–14 yrs), Expert (15+ yrs) |
| Location Tier | Radio | Major Market (NYC, LA, Chicago), Mid Market (Austin, Atlanta, Denver), Small Market (everywhere else) |
| Desired Annual Take-Home | Number input | What you want in your pocket after taxes and expenses |
| Estimated Billable Days/Year | Slider | Default: 150. Range: 50–220. |
| Do you carry a kit? | Toggle | Yes / No — adds kit fee to day rate |

---

## The Formula

### Step 1 — Start with take-home goal
```
take_home = user input
```

### Step 2 — Add health insurance
```
health_insurance = 7400  // annual, based on 2026 ACA marketplace average (~$617/mo)
// Note: subsidies expired end of 2025 for many income levels
```

### Step 3 — Add self-employment tax
```
// Freelancers pay both employer + employee sides of SS and Medicare
se_tax_rate = 0.153
subtotal_1 = take_home + health_insurance
se_tax = subtotal_1 * se_tax_rate
```

### Step 4 — Add profit margin (default 20%, optional/removable)
```
profit_rate = 0.20
subtotal_2 = subtotal_1 + se_tax
profit = subtotal_2 * profit_rate
total_gross_needed = subtotal_2 + profit
```

### Step 5 — Divide by billable days
```
day_rate = total_gross_needed / billable_days
half_day_rate = day_rate * 0.60
hourly_rate = day_rate / 10  // assumes 10-hour day
```

### Step 6 — Add kit fee (if applicable, optional/removable)
```
kit_fee = 300  // industry standard $200–$500/day, default $300
// Kit fee is added on top of labor day rate, listed separately
```

---

## Output Display — Copy & Structure

### Header
```
Your Fair Day Rate: $[day_rate]
```
Subhead:
```
Here's exactly how we got there — and why every line matters.
```

---

### Line Items with Explanations

**Take-Home Goal**
```
$[take_home]/year
"This is what you want in your pocket after everything. 
You deserve to name this number without apology."
```

**Health Insurance**
```
+ $7,400/year ($617/month)
"Salaried employees get this as a benefit. You pay for it yourself.
Most freelancers forget to factor this in — don't be most freelancers."
```

**Self-Employment Tax**
```
+ $[se_tax]/year
"When you work for a company, they cover half your Social Security 
and Medicare taxes. When you're freelance, you pay both sides. 
That's an extra 15.3% on top of your income tax."
```

**Profit Margin**
```
+ $[profit]/year (20%)
"This isn't greed. This is what covers your slow months, your 
equipment repairs, your continued education, and your ability 
to grow. No margin means one bad month wipes you out."
```

**Billable Days**
```
÷ [billable_days] days/year
"[billable_days] days sounds like a lot. That's roughly 
[billable_days / 52] days per week on average — the rest is 
spent on unpaid admin, marketing, travel, chasing invoices, 
and the slow seasons every freelancer knows too well."
```

---

### Results Block
```
──────────────────────────────────
Total you need to earn:  $[total_gross_needed]
÷ [billable_days] billable days
──────────────────────────────────
Day Rate:      $[day_rate]
Half-Day:      $[half_day_rate]
Hourly:        $[hourly_rate]
Kit Fee:       $[kit_fee]/day  ← listed separately if applicable
──────────────────────────────────
```

---

### Floor Rate Warning (for platform use)
If the user's calculated day rate falls below discipline minimums, show:

```
"Hold on. Based on your inputs, your fair rate is $[day_rate]/day. 
We won't let you list below this. Here's what you spent to get 
to this point in your career — your rate should reflect that."
```
*(The "what you spent" section is a future feature — prompts user to 
input years of experience, education costs, gear investment, etc.)*

---

## Discipline-Specific Rate Floors (Non-Negotiable Minimums)
*Based on 2024–2025 market data. To be updated annually.*

| Discipline | Emerging | Mid | Senior | Expert |
|---|---|---|---|---|
| Camera Operator | $400/day | $600/day | $800/day | $1,000/day |
| Cinematographer/DP | $500/day | $800/day | $1,200/day | $1,500/day |
| Video Editor | $350/day | $550/day | $750/day | $1,000/day |
| Colorist | $400/day | $600/day | $900/day | $1,200/day |
| Motion Designer | $350/day | $600/day | $850/day | $1,100/day |
| Producer | $400/day | $650/day | $900/day | $1,200/day |

*Major market multiplier: 1.3x*
*Small market multiplier: 0.85x*

---

## Optional Toggles (Phase 2)
- Remove profit margin
- Remove kit fee
- Adjust health insurance amount manually
- Add equipment depreciation
- Add business expenses (software, insurance, accountant)

---

## Data Sources
- BLS Occupational Employment & Wage Statistics (May 2024)
- BLS CPI Inflation Calculator
- Kaiser Family Foundation / Healthcare.gov 2025–2026 premium data
- No Film School Cinematography Rate Survey (2,000+ respondents)
- Assemble / Ambient Skies crew rate guides 2024–2025
- Self-employment tax rate: IRS Schedule SE
