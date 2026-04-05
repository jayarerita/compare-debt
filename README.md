# Compare Debt vs. Invest

A personal finance web application that helps you compare the long-term financial outcome of paying off a mortgage early versus investing that extra money in the market.

**Live demo:** [jayarerita.github.io/compare-debt](https://jayarerita.github.io/compare-debt)

---

## Overview

Should you put extra cash toward your mortgage principal, or invest it? This tool runs both scenarios side-by-side over your chosen time horizon, accounting for:

- Loan interest accrual and amortization
- Investment returns, expense ratios, and dividends
- Flexible contribution splitting between loan and investment
- After-tax investment value (capital gains + NIIT)

The result is an interactive chart and a detailed month-by-month data table so you can see exactly when and by how much one strategy beats the other.

---

## Features

- **Real-time calculations** — chart and table update instantly as you adjust any input
- **Contribution allocator** — slide to split your monthly budget between extra loan principal and additional investment
- **Dividend scheduling** — choose monthly, quarterly, or annual dividend reinvestment
- **After-tax valuation** — investment balance shown both gross and net of 23.8% tax (20% long-term capital gains + 3.8% NIIT)
- **Loan payoff detection** — once the loan is paid off, all contributions automatically redirect to the investment
- **Responsive design** — works on mobile and desktop

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS |
| UI primitives | Radix UI (slider, radio group, label) |
| Charts | Recharts |
| Deployment | GitHub Pages (`gh-pages`) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install and run locally

```bash
git clone https://github.com/jayarerita/compare-debt.git
cd compare-debt
npm install
npm run dev
```

The dev server starts at `http://localhost:5173` with hot module reloading.

### Other scripts

| Command | Description |
|---|---|
| `npm run build` | Production build (output to `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run deploy` | Build and deploy to GitHub Pages |

---

## Inputs

### Loan

| Input | Description |
|---|---|
| Current loan balance | Outstanding principal remaining on your mortgage |
| Total loan amount | Original loan amount (used to calculate monthly payment) |
| Loan term | 15 or 30 years |
| Loan APR | Annual interest rate (slider, 0–15%) |

The required monthly payment is calculated automatically from the loan amount, APR, and term using the standard amortization formula:

```
M = P × [I(1 + I)^N] / [(1 + I)^N − 1]

P = principal, I = monthly rate (APR / 12), N = number of payments
```

### Investment

| Input | Description |
|---|---|
| Current investment balance | Starting portfolio value |
| Average annual return | Expected annual growth rate (%) |
| Expense ratio | Annual fund cost deducted from balance (%) |
| Estimated dividend | Annual dividend yield (%) |
| Dividend time frame | How often dividends are paid (monthly / quarterly / annually) |

### Contributions

| Input | Description |
|---|---|
| Monthly contribution | Total extra cash available each month |
| Contribution split (slider) | Percentage allocated to investment vs. extra loan principal |

### Time

| Input | Description |
|---|---|
| Time horizon | Number of years to project (minimum 2) |

---

## Outputs

### Line Chart

Plots three series over your time horizon:

- **Investment Balance** — gross portfolio value
- **Loan Balance** — remaining mortgage principal
- **Cash Investment Value** — portfolio value after estimated taxes (23.8%)

X-axis shows dates (MM/YYYY). Y-axis shows dollar amounts (abbreviated to thousands).

### Data Table

Month-by-month breakdown including:

- Date and month number
- Investment balance
- Loan balance
- Loan payment
- Investment payment
- Principal payment
- Out-of-pocket cost (total monthly outflow)
- After-tax investment value
- Net worth (investment balance − loan balance)

---

## Calculation Details

Each month the app:

1. Splits the monthly contribution per the slider position.
2. Calculates the required minimum loan payment.
3. Applies any extra principal to the loan balance. If the loan is fully paid off, all remaining funds go to investment.
4. Updates the investment balance:

```
New balance = balance
            + (balance × annual_return / 12)      // monthly return
            - (balance × expense_ratio / 12)       // monthly expenses
            + dividends                             // per schedule
            + monthly investment contribution
```

5. Computes the after-tax cash value: `balance × (1 − 0.238)`
6. Computes net worth: `investment balance − loan balance`
7. Stores all values for chart and table rendering.

**Tax assumption:** The 23.8% rate represents the combined federal long-term capital gains tax (20%) and Net Investment Income Tax (3.8%). State taxes are not included.

---

## Project Structure

```
compare-debt/
├── src/
│   ├── App.tsx                  # Main component: state, calculations, layout
│   ├── main.tsx                 # React entry point
│   ├── components/
│   │   ├── customUi/
│   │   │   ├── dividendRadio.tsx   # Dividend frequency selector
│   │   │   └── loanTermRadio.tsx   # Loan term selector (15/30 yr)
│   │   ├── data/
│   │   │   ├── lineChart.tsx       # Recharts line chart wrapper
│   │   │   └── dataTable.tsx       # Month-by-month table
│   │   └── ui/                     # Radix-based reusable primitives
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── slider.tsx
│   │       ├── radio-group.tsx
│   │       └── table.tsx
│   └── lib/
│       ├── customTypes.ts          # ChartData type definition
│       └── utils.ts                # cn() class name utility
├── public/
│   └── rocket_money.svg            # App logo
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

---

## Deployment

The app is deployed to GitHub Pages via the `gh-pages` package:

```bash
npm run deploy
```

This runs `npm run build` then publishes the `dist/` folder to the `gh-pages` branch of the repository. The homepage URL is configured in `package.json`.

---

## License

MIT
