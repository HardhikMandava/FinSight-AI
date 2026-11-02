// Shared fictional dataset for Northstar Manufacturing
// All monetary values are in USD millions ($M).
// Five annual reporting periods: FY2020–FY2024.
// Prototype demonstration figures: Assets = Liabilities + Equity in all 5 years.

export type Period = "FY2024" | "FY2023" | "FY2022" | "FY2021" | "FY2020"

export const PERIODS_NEWEST_FIRST: Period[] = [
  "FY2024",
  "FY2023",
  "FY2022",
  "FY2021",
  "FY2020",
]

export const PERIODS_CHRONOLOGICAL: Period[] = [
  "FY2020",
  "FY2021",
  "FY2022",
  "FY2023",
  "FY2024",
]

export interface PeriodFinancials {
  revenue: number
  income: number // Net income
  assets: number // Total assets
  cashFlow: number // Operating cash flow
  currentAssets: number
  currentLiabilities: number
  totalLiabilities: number
  equity: number // Shareholders' equity
  interestBearingDebt: number
  margin: number // Net profit margin % (net income / revenue * 100)
}

export const financialData: Record<Period, PeriodFinancials> = {
  FY2020: {
    revenue: 350,
    income: 28,
    assets: 460,
    cashFlow: 38,
    currentAssets: 130,
    currentLiabilities: 80,
    totalLiabilities: 260,
    equity: 200,
    interestBearingDebt: 150,
    margin: (28 / 350) * 100, // 8.0%
  },
  FY2021: {
    revenue: 390,
    income: 35.1,
    assets: 500,
    cashFlow: 46,
    currentAssets: 145,
    currentLiabilities: 85,
    totalLiabilities: 280,
    equity: 220,
    interestBearingDebt: 160,
    margin: (35.1 / 390) * 100, // 9.0%
  },
  FY2022: {
    revenue: 440,
    income: 44,
    assets: 550,
    cashFlow: 55,
    currentAssets: 165,
    currentLiabilities: 90,
    totalLiabilities: 305,
    equity: 245,
    interestBearingDebt: 175,
    margin: (44 / 440) * 100, // 10.0%
  },
  FY2023: {
    revenue: 480,
    income: 48,
    assets: 600,
    cashFlow: 65,
    currentAssets: 180,
    currentLiabilities: 100,
    totalLiabilities: 330,
    equity: 270,
    interestBearingDebt: 190,
    margin: (48 / 480) * 100, // 10.0%
  },
  FY2024: {
    revenue: 516,
    income: 43.86,
    assets: 640,
    cashFlow: 58,
    currentAssets: 190,
    currentLiabilities: 120,
    totalLiabilities: 365,
    equity: 275,
    interestBearingDebt: 220,
    margin: (43.86 / 516) * 100, // 8.5%
  },
}

/**
 * Returns the immediately preceding period, or undefined if no earlier period exists.
 */
export function getPriorPeriod(period: Period): Period | undefined {
  const map: Record<Period, Period | undefined> = {
    FY2024: "FY2023",
    FY2023: "FY2022",
    FY2022: "FY2021",
    FY2021: "FY2020",
    FY2020: undefined,
  }
  return map[period]
}

export const COMPANY_NAME = "Northstar Manufacturing"
export const SAMPLE_NOTICE =
  "Fictional sample data · FY2020–FY2024 · Not derived from selected files."
export const CURRENCY_LABEL = "USD millions"
