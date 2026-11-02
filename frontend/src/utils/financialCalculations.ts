// Reusable calculation functions for FinSight AI
// Full precision is kept in calculation; rounding is reserved for display.
// Missing inputs and zero denominators return explicit unavailable statuses with reasons.

export type CalculationResult =
  | { status: "available"; value: number }
  | { status: "unavailable"; reason: string }

/**
 * Calculates percentage growth from a prior value to a current value:
 * ((current - prior) / prior) * 100
 */
export function calculateGrowth(
  current: number | null | undefined,
  prior: number | null | undefined,
  metricName = "Metric",
): CalculationResult {
  if (current === null || current === undefined || isNaN(current)) {
    return {
      status: "unavailable",
      reason: `${metricName} data is missing for the selected year.`,
    }
  }
  if (prior === null || prior === undefined || isNaN(prior)) {
    return {
      status: "unavailable",
      reason: "Prior year comparison data is unavailable.",
    }
  }
  if (prior === 0) {
    return {
      status: "unavailable",
      reason: `Cannot calculate ${metricName} growth because prior year value is zero.`,
    }
  }
  return {
    status: "available",
    value: ((current - prior) / prior) * 100,
  }
}

/**
 * Revenue Growth (%): ((currentRevenue - priorRevenue) / priorRevenue) * 100
 */
export function calculateRevenueGrowth(
  currentRevenue: number | null | undefined,
  priorRevenue: number | null | undefined,
): CalculationResult {
  return calculateGrowth(currentRevenue, priorRevenue, "Revenue")
}

/**
 * Net Profit Margin (%): (netIncome / revenue) * 100
 */
export function calculateNetProfitMargin(
  netIncome: number | null | undefined,
  revenue: number | null | undefined,
): CalculationResult {
  if (netIncome === null || netIncome === undefined || isNaN(netIncome)) {
    return {
      status: "unavailable",
      reason: "Net income data is missing.",
    }
  }
  if (revenue === null || revenue === undefined || isNaN(revenue)) {
    return {
      status: "unavailable",
      reason: "Revenue data is missing.",
    }
  }
  if (revenue === 0) {
    return {
      status: "unavailable",
      reason: "Cannot calculate net profit margin because revenue is zero.",
    }
  }
  return {
    status: "available",
    value: (netIncome / revenue) * 100,
  }
}

/**
 * Current Ratio: currentAssets / currentLiabilities
 */
export function calculateCurrentRatio(
  currentAssets: number | null | undefined,
  currentLiabilities: number | null | undefined,
): CalculationResult {
  if (
    currentAssets === null ||
    currentAssets === undefined ||
    isNaN(currentAssets)
  ) {
    return {
      status: "unavailable",
      reason: "Current assets data is missing.",
    }
  }
  if (
    currentLiabilities === null ||
    currentLiabilities === undefined ||
    isNaN(currentLiabilities)
  ) {
    return {
      status: "unavailable",
      reason: "Current liabilities data is missing.",
    }
  }
  if (currentLiabilities === 0) {
    return {
      status: "unavailable",
      reason:
        "Cannot calculate current ratio because current liabilities are zero.",
    }
  }
  return {
    status: "available",
    value: currentAssets / currentLiabilities,
  }
}

/**
 * Debt-to-Equity Ratio: interestBearingDebt / yearEndEquity
 * Defined per prototype methodology as interest-bearing debt divided by year-end shareholders' equity.
 */
export function calculateDebtToEquity(
  debt: number | null | undefined,
  equity: number | null | undefined,
): CalculationResult {
  if (debt === null || debt === undefined || isNaN(debt)) {
    return {
      status: "unavailable",
      reason: "Interest-bearing debt data is missing.",
    }
  }
  if (equity === null || equity === undefined || isNaN(equity)) {
    return {
      status: "unavailable",
      reason: "Shareholders' equity data is missing.",
    }
  }
  if (equity === 0) {
    return {
      status: "unavailable",
      reason: "Cannot calculate Debt-to-Equity because equity is zero.",
    }
  }
  return {
    status: "available",
    value: debt / equity,
  }
}

/**
 * Return on Assets (ROA %):
 * netIncome / average opening and closing total assets * 100
 *
 * For FY2020: Opening total assets (FY2019) is not supplied, so ROA is marked unavailable.
 */
export function calculateROA(
  netIncome: number | null | undefined,
  currentAssets: number | null | undefined,
  priorAssets: number | null | undefined,
): CalculationResult {
  if (netIncome === null || netIncome === undefined || isNaN(netIncome)) {
    return {
      status: "unavailable",
      reason: "Net income data is missing.",
    }
  }
  if (
    currentAssets === null ||
    currentAssets === undefined ||
    isNaN(currentAssets)
  ) {
    return {
      status: "unavailable",
      reason: "Current year total assets data is missing.",
    }
  }
  if (priorAssets === null || priorAssets === undefined || isNaN(priorAssets)) {
    return {
      status: "unavailable",
      reason:
        "Prior year opening balance (FY2019) is not supplied to calculate average total assets.",
    }
  }
  const avgAssets = (currentAssets + priorAssets) / 2
  if (avgAssets === 0) {
    return {
      status: "unavailable",
      reason: "Cannot calculate ROA because average total assets are zero.",
    }
  }
  return {
    status: "available",
    value: (netIncome / avgAssets) * 100,
  }
}

/**
 * Return on Equity (ROE %):
 * netIncome / average opening and closing equity * 100
 *
 * For FY2020: Opening equity (FY2019) is not supplied, so ROE is marked unavailable.
 */
export function calculateROE(
  netIncome: number | null | undefined,
  currentEquity: number | null | undefined,
  priorEquity: number | null | undefined,
): CalculationResult {
  if (netIncome === null || netIncome === undefined || isNaN(netIncome)) {
    return {
      status: "unavailable",
      reason: "Net income data is missing.",
    }
  }
  if (
    currentEquity === null ||
    currentEquity === undefined ||
    isNaN(currentEquity)
  ) {
    return {
      status: "unavailable",
      reason: "Current year equity data is missing.",
    }
  }
  if (priorEquity === null || priorEquity === undefined || isNaN(priorEquity)) {
    return {
      status: "unavailable",
      reason:
        "Prior year opening balance (FY2019) is not supplied to calculate average equity.",
    }
  }
  const avgEquity = (currentEquity + priorEquity) / 2
  if (avgEquity === 0) {
    return {
      status: "unavailable",
      reason: "Cannot calculate ROE because average equity is zero.",
    }
  }
  return {
    status: "available",
    value: (netIncome / avgEquity) * 100,
  }
}

/**
 * Operating Cash Flow Growth (%): ((currentCF - priorCF) / priorCF) * 100
 */
export function calculateCashFlowGrowth(
  currentCF: number | null | undefined,
  priorCF: number | null | undefined,
): CalculationResult {
  return calculateGrowth(currentCF, priorCF, "Operating cash flow")
}

/**
 * Net Income Growth (%): ((currentNI - priorNI) / priorNI) * 100
 */
export function calculateNetIncomeGrowth(
  currentNI: number | null | undefined,
  priorNI: number | null | undefined,
): CalculationResult {
  return calculateGrowth(currentNI, priorNI, "Net income")
}

/**
 * Margin Change in percentage points: currentMargin - priorMargin
 */
export function calculateMarginChange(
  currentMargin: number | null | undefined,
  priorMargin: number | null | undefined,
): CalculationResult {
  if (
    currentMargin === null ||
    currentMargin === undefined ||
    isNaN(currentMargin)
  ) {
    return {
      status: "unavailable",
      reason: "Current margin is missing.",
    }
  }
  if (priorMargin === null || priorMargin === undefined || isNaN(priorMargin)) {
    return {
      status: "unavailable",
      reason: "Prior year comparison data is unavailable.",
    }
  }
  return {
    status: "available",
    value: currentMargin - priorMargin,
  }
}

/**
 * Prototype methodology disclosures
 */
export const METHODOLOGY_DISCLOSURES = {
  roa: "Return on Assets (ROA) is calculated as Net Income divided by the average of opening and closing Total Assets. For FY2020, opening balances (FY2019) are not supplied in the dataset and are treated as unavailable rather than estimated.",
  roe: "Return on Equity (ROE) is calculated as Net Income divided by the average of opening and closing Shareholders' Equity. For FY2020, opening balances (FY2019) are not supplied in the dataset and are treated as unavailable rather than estimated.",
  debtToEquity:
    "Debt-to-Equity is defined as interest-bearing debt divided by year-end shareholders' equity. Interest-bearing debt is reported separately from operating liabilities.",
  comparisons:
    "Year-over-year percentage changes compare the selected period with the immediately preceding fiscal year. For FY2020, growth rates are unavailable because FY2019 data is not supplied.",
}
