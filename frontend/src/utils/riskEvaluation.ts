import {
  type Period,
  type PeriodFinancials,
  financialData,
  getPriorPeriod,
} from "../data/financialData"
import {
  calculateCurrentRatio,
  calculateMarginChange,
} from "./financialCalculations"

export type RuleSeverity = "Watch" | "Elevated"
export type RuleStatus = "triggered" | "not_triggered" | "not_assessable"

export interface RiskRule {
  id: string
  title: string
  severity: RuleSeverity
  status: RuleStatus
  period: Period
  condition: string
  supportingValues: string
  explanation: string
}

export interface RiskEvaluationSummary {
  triggered: number
  notTriggered: number
  notAssessable: number
  total: number
}

export interface RiskEvaluationResult {
  period: Period
  rules: RiskRule[]
  summary: RiskEvaluationSummary
}

export function evaluateRisks(
  period: Period,
  dataset: Record<Period, PeriodFinancials> = financialData,
): RiskEvaluationResult {
  const current = dataset[period]
  const priorPeriod = getPriorPeriod(period)
  const prior = priorPeriod ? dataset[priorPeriod] : undefined

  const rules: RiskRule[] = []

  // Rule 1: Declining net profit margin (Watch)
  if (!prior || !priorPeriod) {
    rules.push({
      id: "declining-margin",
      title: "Declining net profit margin",
      severity: "Watch",
      status: "not_assessable",
      period,
      condition: "Current net profit margin is lower than prior margin.",
      supportingValues: `Current margin: ${current.margin.toFixed(1)}% | Prior margin: Unavailable`,
      explanation: `Not assessable — prior year comparison data is unavailable for ${period}.`,
    })
  } else {
    const marginDiffResult = calculateMarginChange(current.margin, prior.margin)
    const isTriggered = current.margin < prior.margin
    const diff =
      marginDiffResult.status === "available"
        ? Math.abs(marginDiffResult.value).toFixed(1)
        : Math.abs(current.margin - prior.margin).toFixed(1)

    rules.push({
      id: "declining-margin",
      title: "Declining net profit margin",
      severity: "Watch",
      status: isTriggered ? "triggered" : "not_triggered",
      period,
      condition: "Current net profit margin is lower than prior margin.",
      supportingValues: `${period}: ${current.margin.toFixed(1)}% | ${priorPeriod}: ${prior.margin.toFixed(1)}% (${
        isTriggered ? `−${diff} pp` : `+${diff} pp`
      })`,
      explanation: isTriggered
        ? `Net profit margin decreased from ${prior.margin.toFixed(1)}% in ${priorPeriod} to ${current.margin.toFixed(1)}% in ${period}, representing a ${diff} percentage-point decline.`
        : `Net profit margin did not decline; it remained at or above the ${priorPeriod} margin.`,
    })
  }

  // Rule 2: Declining operating cash flow (Watch)
  if (!prior || !priorPeriod) {
    rules.push({
      id: "declining-cash-flow",
      title: "Declining operating cash flow",
      severity: "Watch",
      status: "not_assessable",
      period,
      condition: "Operating cash flow is lower than the prior year.",
      supportingValues: `Current cash flow: $${current.cashFlow}M | Prior cash flow: Unavailable`,
      explanation: `Not assessable — prior year comparison data is unavailable for ${period}.`,
    })
  } else {
    const isTriggered = current.cashFlow < prior.cashFlow
    const pctChange = (
      ((current.cashFlow - prior.cashFlow) / prior.cashFlow) *
      100
    ).toFixed(1)

    rules.push({
      id: "declining-cash-flow",
      title: "Declining operating cash flow",
      severity: "Watch",
      status: isTriggered ? "triggered" : "not_triggered",
      period,
      condition: "Operating cash flow is lower than the prior year.",
      supportingValues: `${period}: $${current.cashFlow}M | ${priorPeriod}: $${prior.cashFlow}M (${pctChange}%)`,
      explanation: isTriggered
        ? `Operating cash flow fell from $${prior.cashFlow}M in ${priorPeriod} to $${current.cashFlow}M in ${period}, approximately a ${Math.abs(Number(pctChange))}% decline.`
        : `Operating cash flow did not decline compared to ${priorPeriod}.`,
    })
  }

  // Rule 3: Declining current ratio (Watch)
  if (!prior || !priorPeriod) {
    rules.push({
      id: "declining-current-ratio",
      title: "Declining current ratio",
      severity: "Watch",
      status: "not_assessable",
      period,
      condition: "Current ratio is lower than the prior year.",
      supportingValues: `Current ratio: ${(current.currentAssets / current.currentLiabilities).toFixed(2)}× | Prior ratio: Unavailable`,
      explanation: `Not assessable — prior year comparison data is unavailable for ${period}.`,
    })
  } else {
    const currentRatio = current.currentAssets / current.currentLiabilities
    const priorRatio = prior.currentAssets / prior.currentLiabilities
    const isTriggered = currentRatio < priorRatio

    rules.push({
      id: "declining-current-ratio",
      title: "Declining current ratio",
      severity: "Watch",
      status: isTriggered ? "triggered" : "not_triggered",
      period,
      condition: "Current ratio is lower than the prior year.",
      supportingValues: `${period}: ${currentRatio.toFixed(2)}× | ${priorPeriod}: ${priorRatio.toFixed(2)}×`,
      explanation: isTriggered
        ? `The current ratio decreased from ${priorRatio.toFixed(2)}× in ${priorPeriod} to ${currentRatio.toFixed(2)}× in ${period}. Note that a declining ratio alone does not establish financial distress.`
        : `The current ratio did not decline compared to ${priorPeriod}.`,
    })
  }

  // Rule 4: Current ratio below 1.0× (Elevated)
  const currentRatio = calculateCurrentRatio(
    current.currentAssets,
    current.currentLiabilities,
  )
  if (currentRatio.status === "available") {
    const isTriggered = currentRatio.value < 1.0
    rules.push({
      id: "current-ratio-below-one",
      title: "Current ratio below 1.0×",
      severity: "Elevated",
      status: isTriggered ? "triggered" : "not_triggered",
      period,
      condition:
        "Current assets divided by current liabilities is less than 1.0×.",
      supportingValues: `Current assets: $${current.currentAssets}M | Current liabilities: $${current.currentLiabilities}M (${currentRatio.value.toFixed(2)}×)`,
      explanation: isTriggered
        ? `Short-term obligations exceed short-term liquid assets (${currentRatio.value.toFixed(2)}× < 1.00×).`
        : `Current assets ($${current.currentAssets}M) exceed current liabilities ($${current.currentLiabilities}M) with a ratio of ${currentRatio.value.toFixed(2)}×. This screening flag was not triggered.`,
    })
  } else {
    rules.push({
      id: "current-ratio-below-one",
      title: "Current ratio below 1.0×",
      severity: "Elevated",
      status: "not_assessable",
      period,
      condition:
        "Current assets divided by current liabilities is less than 1.0×.",
      supportingValues: "Data unavailable",
      explanation: currentRatio.reason,
    })
  }

  // Rule 5: Negative operating cash flow (Elevated)
  const isNegativeCashFlow = current.cashFlow < 0
  rules.push({
    id: "negative-operating-cash-flow",
    title: "Negative operating cash flow",
    severity: "Elevated",
    status: isNegativeCashFlow ? "triggered" : "not_triggered",
    period,
    condition: "Operating cash flow is less than 0.",
    supportingValues: `Operating cash flow: $${current.cashFlow}M`,
    explanation: isNegativeCashFlow
      ? `Operating cash flow is negative at $${current.cashFlow}M, indicating operating activities consumed cash.`
      : `Operating cash flow is positive at $${current.cashFlow}M. This screening flag was not triggered.`,
  })

  // Rule 6: Declining revenue (Watch)
  if (!prior || !priorPeriod) {
    rules.push({
      id: "declining-revenue",
      title: "Declining revenue",
      severity: "Watch",
      status: "not_assessable",
      period,
      condition: "Revenue is lower than the prior year.",
      supportingValues: `Current revenue: $${current.revenue}M | Prior revenue: Unavailable`,
      explanation: `Not assessable — prior year comparison data is unavailable for ${period}.`,
    })
  } else {
    const isTriggered = current.revenue < prior.revenue
    const pctChange = (
      ((current.revenue - prior.revenue) / prior.revenue) *
      100
    ).toFixed(1)

    rules.push({
      id: "declining-revenue",
      title: "Declining revenue",
      severity: "Watch",
      status: isTriggered ? "triggered" : "not_triggered",
      period,
      condition: "Revenue is lower than the prior year.",
      supportingValues: `${period}: $${current.revenue}M | ${priorPeriod}: $${prior.revenue}M (${
        Number(pctChange) >= 0 ? `+${pctChange}%` : `${pctChange}%`
      })`,
      explanation: isTriggered
        ? `Revenue decreased from $${prior.revenue}M to $${current.revenue}M (${pctChange}%).`
        : `Revenue increased from $${prior.revenue}M to $${current.revenue}M (+${pctChange}%). This screening flag was not triggered.`,
    })
  }

  // Rule 7: Increasing debt (Watch)
  // Assessed from FY2021 onward: interest-bearing debt exceeds the previous year's value.
  if (!prior || !priorPeriod) {
    rules.push({
      id: "increasing-debt",
      title: "Increasing debt",
      severity: "Watch",
      status: "not_assessable",
      period,
      condition: "Interest-bearing debt exceeds the previous year's value.",
      supportingValues: `Current debt: $${current.interestBearingDebt}M | Prior debt: Unavailable`,
      explanation: `Not assessable — prior year comparison data is unavailable for ${period}.`,
    })
  } else {
    const isTriggered = current.interestBearingDebt > prior.interestBearingDebt
    const debtDiff = current.interestBearingDebt - prior.interestBearingDebt

    rules.push({
      id: "increasing-debt",
      title: "Increasing debt",
      severity: "Watch",
      status: isTriggered ? "triggered" : "not_triggered",
      period,
      condition: "Interest-bearing debt exceeds the previous year's value.",
      supportingValues: `${period}: $${current.interestBearingDebt}M | ${priorPeriod}: $${prior.interestBearingDebt}M (${
        isTriggered ? `+$${debtDiff}M` : `-$${Math.abs(debtDiff)}M`
      })`,
      explanation: isTriggered
        ? `Interest-bearing debt increased from $${prior.interestBearingDebt}M in ${priorPeriod} to $${current.interestBearingDebt}M in ${period} (+$${debtDiff}M). Note that debt growth alone does not establish financial distress.`
        : `Interest-bearing debt did not exceed the previous year's balance of $${prior.interestBearingDebt}M. This screening flag was not triggered.`,
    })
  }

  const summary: RiskEvaluationSummary = {
    triggered: rules.filter((r) => r.status === "triggered").length,
    notTriggered: rules.filter((r) => r.status === "not_triggered").length,
    notAssessable: rules.filter((r) => r.status === "not_assessable").length,
    total: rules.length,
  }

  return { period, rules, summary }
}
