import { useState, type ReactNode } from "react"
import {
  type Period,
  PERIODS_NEWEST_FIRST,
  PERIODS_CHRONOLOGICAL,
  financialData,
  getPriorPeriod,
  COMPANY_NAME,
  CURRENCY_LABEL,
} from "../data/financialData"
import {
  calculateRevenueGrowth,
  calculateNetProfitMargin,
  calculateCurrentRatio,
  calculateDebtToEquity,
  calculateROA,
  calculateROE,
  calculateCashFlowGrowth,
  calculateNetIncomeGrowth,
  calculateMarginChange,
  METHODOLOGY_DISCLOSURES,
  type CalculationResult,
} from "../utils/financialCalculations"

type StatementTab = "income" | "balance" | "cashFlow"
type ChartMetric = "revenue" | "income" | "cashFlow"
type ChartMode = "comparison" | "trend"

interface AnalysisPageProps {
  onNavigate: (page: "overview" | "documents" | "analysis" | "risks" | "assistant") => void
  selectedPeriod: Period
  onPeriodChange: (period: Period) => void
}

function ArrowUpIcon() {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={13}
      viewBox="0 0 24 24"
      width={13}
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  )
}

function ArrowDownIcon() {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={13}
      viewBox="0 0 24 24"
      width={13}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={14}
      viewBox="0 0 24 24"
      width={14}
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={13}
      viewBox="0 0 24 24"
      width={13}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={13}
      viewBox="0 0 24 24"
      width={13}
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  )
}

export default function AnalysisPage({
  onNavigate,
  selectedPeriod,
  onPeriodChange,
}: AnalysisPageProps) {
  const [statementTab, setStatementTab] = useState<StatementTab>("income")
  const [chartMetric, setChartMetric] = useState<ChartMetric>("revenue")
  const [chartMode, setChartMode] = useState<ChartMode>("comparison")
  const [tooltip, setTooltip] = useState<{
    left: number
    top: number
    title: string
    value: string
  } | null>(null)

  const current = financialData[selectedPeriod]
  const priorPeriod = getPriorPeriod(selectedPeriod)
  const prior = priorPeriod ? financialData[priorPeriod] : undefined

  // Calculations for Selected Period
  const revGrowthResult = calculateRevenueGrowth(
    current.revenue,
    prior?.revenue,
  )
  const marginResult = calculateNetProfitMargin(current.income, current.revenue)
  const marginChangeResult = calculateMarginChange(
    current.margin,
    prior?.margin,
  )
  const currentRatioResult = calculateCurrentRatio(
    current.currentAssets,
    current.currentLiabilities,
  )
  const debtToEquityResult = calculateDebtToEquity(
    current.interestBearingDebt,
    current.equity,
  )
  const roaResult = calculateROA(current.income, current.assets, prior?.assets)
  const roeResult = calculateROE(current.income, current.equity, prior?.equity)
  const cfGrowthResult = calculateCashFlowGrowth(
    current.cashFlow,
    prior?.cashFlow,
  )
  const niGrowthResult = calculateNetIncomeGrowth(
    current.income,
    prior?.income,
  )

  const metricLabels: Record<ChartMetric, string> = {
    revenue: "Revenue",
    income: "Net income",
    cashFlow: "Operating cash flow",
  }
  const selectedChartLabel = metricLabels[chartMetric]

  // Chart Setup: Comparison Mode vs 5-Year Trend
  let chartBars: {
    year: Period
    value: number
    isCurrent: boolean
    label: string
  }[] = []

  if (chartMode === "comparison") {
    // Selected year on LEFT, previous year on RIGHT
    if (priorPeriod && prior) {
      chartBars = [
        {
          year: selectedPeriod,
          value: current[chartMetric],
          isCurrent: true,
          label: `${selectedPeriod} (Selected)`,
        },
        {
          year: priorPeriod,
          value: prior[chartMetric],
          isCurrent: false,
          label: `${priorPeriod} (Prior year)`,
        },
      ]
    } else {
      chartBars = [
        {
          year: selectedPeriod,
          value: current[chartMetric],
          isCurrent: true,
          label: `${selectedPeriod} (Selected)`,
        },
      ]
    }
  } else {
    // 5-Year Trend: Chronological order FY2020 through FY2024
    chartBars = PERIODS_CHRONOLOGICAL.map((p) => ({
      year: p,
      value: financialData[p][chartMetric],
      isCurrent: p === selectedPeriod,
      label: p === selectedPeriod ? `${p} (Selected)` : p,
    }))
  }

  const chartMax =
    Math.ceil(Math.max(...chartBars.map((b) => b.value)) / 100) * 100 || 100
  const baseline = 160
  const chartHeight = 115
  const ticks = [0, chartMax / 2, chartMax]

  const showTooltip = (
    item: typeof chartBars[number],
    x: number,
    y: number,
  ) => {
    setTooltip({
      left: (x / 620) * 100,
      top: (y / 210) * 100,
      title: `${item.year} · ${selectedChartLabel}`,
      value: `$${item.value.toLocaleString("en-US", { maximumFractionDigits: 2 })}M`,
    })
  }

  const renderChartBars = () => {
    if (chartMode === "comparison") {
      if (chartBars.length === 2) {
        const xPositions = [220, 440]
        return chartBars.map((item, index) => {
          const x = xPositions[index]
          const height = (item.value / chartMax) * chartHeight
          const y = baseline - height
          const barClass = item.isCurrent ? "bar-current" : "bar-prior"
          return (
            <g
              className={`chart-series ${
                item.isCurrent ? "series-current" : "series-prior"
              }`}
              key={item.year}
            >
              <rect
                aria-label={`${item.year} ${selectedChartLabel}: $${item.value}M`}
                className={`performance-bar ${barClass}`}
                height={height}
                onBlur={() => setTooltip(null)}
                onFocus={() => showTooltip(item, x, y)}
                onMouseEnter={() => showTooltip(item, x, y)}
                onMouseLeave={() => setTooltip(null)}
                rx="10"
                tabIndex={0}
                width="84"
                x={x - 42}
                y={y}
              />
              <text
                className="bar-value tabular-nums"
                textAnchor="middle"
                x={x}
                y={y - 8}
              >
                ${item.value.toFixed(1)}M
              </text>
              <text className="year-text" textAnchor="middle" x={x} y={192}>
                {item.year}
              </text>
            </g>
          )
        })
      }

      // FY2020 single bar on left, unavailable placeholder on right
      const item = chartBars[0]
      const x = 220
      const height = (item.value / chartMax) * chartHeight
      const y = baseline - height
      return (
        <>
          <g className="chart-series series-current" key={item.year}>
            <rect
              aria-label={`${item.year} ${selectedChartLabel}: $${item.value}M`}
              className="performance-bar bar-current"
              height={height}
              onBlur={() => setTooltip(null)}
              onFocus={() => showTooltip(item, x, y)}
              onMouseEnter={() => showTooltip(item, x, y)}
              onMouseLeave={() => setTooltip(null)}
              rx="10"
              tabIndex={0}
              width="84"
              x={x - 42}
              y={y}
            />
            <text
              className="bar-value tabular-nums"
              textAnchor="middle"
              x={x}
              y={y - 8}
            >
              ${item.value.toFixed(1)}M
            </text>
            <text className="year-text" textAnchor="middle" x={x} y={192}>
              {item.year}
            </text>
          </g>
          <g
            className="chart-series series-prior-unavailable"
            key="unavailable-prior"
          >
            <rect
              className="unavailable-bar-placeholder"
              height="90"
              rx="10"
              strokeDasharray="4 4"
              width="84"
              x="398"
              y="70"
            />
            <text className="axis-text" textAnchor="middle" x="440" y="118">
              Prior year (FY2019)
            </text>
            <text
              className="axis-text muted"
              textAnchor="middle"
              x="440"
              y="134"
            >
              Data unavailable
            </text>
            <text
              className="year-text muted"
              textAnchor="middle"
              x="440"
              y="192"
            >
              FY2019
            </text>
          </g>
        </>
      )
    }

    // 5-Year Trend: 5 chronological bars
    const xPositions = [120, 220, 320, 420, 520]
    return chartBars.map((item, index) => {
      const x = xPositions[index]
      const height = (item.value / chartMax) * chartHeight
      const y = baseline - height
      const barClass = item.isCurrent ? "bar-current" : "bar-prior"
      return (
        <g
          className={`chart-series ${
            item.isCurrent ? "series-current" : "series-prior"
          }`}
          key={item.year}
        >
          <rect
            aria-label={`${item.year} ${selectedChartLabel}: $${item.value}M`}
            className={`performance-bar ${barClass}`}
            height={height}
            onBlur={() => setTooltip(null)}
            onFocus={() => showTooltip(item, x, y)}
            onMouseEnter={() => showTooltip(item, x, y)}
            onMouseLeave={() => setTooltip(null)}
            rx="8"
            tabIndex={0}
            width="54"
            x={x - 27}
            y={y}
          />
          <text
            className="bar-value tabular-nums"
            textAnchor="middle"
            x={x}
            y={y - 8}
          >
            ${item.value.toFixed(1)}M
          </text>
          <text className="year-text" textAnchor="middle" x={x} y={192}>
            {item.year}
          </text>
        </g>
      )
    })
  }

  return (
    <div className="analysis-page">
      {/* Header */}
      <header className="page-heading-row entrance entrance-1">
        <div>
          <div className="analysis-context-strip">
            <span className="context-company">{COMPANY_NAME}</span>
            <span className="context-sep">·</span>
            <span className="context-period">
              Selected: <strong>{selectedPeriod}</strong>
            </span>
            {priorPeriod && (
              <>
                <span className="context-sep">·</span>
                <span className="context-prior">Prior: {priorPeriod}</span>
              </>
            )}
            <span className="context-sep">·</span>
            <span className="context-units">Units: {CURRENCY_LABEL} ($M)</span>
          </div>
          <h1>Financial Analysis</h1>
          <p className="currency-notice">
            Executive financial workspace · Multi-year performance, ratios, and
            statement extracts
          </p>
        </div>
        <div className="heading-controls">
          <div
            aria-label="Reporting period"
            className="sliding-selector floating-pill-selector"
            role="radiogroup"
          >
            {PERIODS_NEWEST_FIRST.map((p) => (
              <button
                aria-checked={selectedPeriod === p}
                className={`segment-button ${
                  selectedPeriod === p ? "active" : ""
                }`}
                key={p}
                onClick={() => onPeriodChange(p)}
                role="radio"
                type="button"
              >
                {p}
              </button>
            ))}
          </div>
          <span className="sample-badge">Sample dataset</span>
        </div>
      </header>

      {/* Section 1: Key Ratios */}
      <section
        aria-labelledby="key-ratios-title"
        className="analysis-section entrance entrance-2"
      >
        <div className="section-header-row">
          <div>
            <h2 id="key-ratios-title">Key financial ratios</h2>
            <p className="section-subtitle">
              Calculated dynamically from the five-year dataset for{" "}
              {selectedPeriod}
              {priorPeriod ? ` vs ${priorPeriod}` : " (prior year unavailable)"}
              .
            </p>
          </div>
        </div>

        <div className="ratios-grid">
          {/* Revenue Growth - Growth (Amber) */}
          <RatioCard
            category="growth"
            categoryLabel="Growth"
            formula="(Current Rev − Prior Rev) / Prior Rev × 100"
            label="Revenue growth"
            period={selectedPeriod}
            result={revGrowthResult}
            subtext={
              prior
                ? `Revenue: $${current.revenue}M vs $${prior.revenue}M in ${priorPeriod}`
                : "Baseline observation (FY2019 unavailable)"
            }
            suffix="%"
            trend={
              revGrowthResult.status === "available"
                ? revGrowthResult.value >= 0
                  ? "positive"
                  : "negative"
                : "neutral"
            }
          />

          {/* Net Profit Margin - Profitability (Violet) */}
          <RatioCard
            category="profitability"
            categoryLabel="Profitability"
            formula="Net income / Revenue × 100"
            label="Net profit margin"
            period={selectedPeriod}
            result={marginResult}
            subtext={
              marginChangeResult.status === "available"
                ? `${marginChangeResult.value >= 0 ? "+" : "−"}${Math.abs(
                    marginChangeResult.value,
                  ).toFixed(1)} pp vs ${priorPeriod}`
                : "Prior period comparison unavailable"
            }
            suffix="%"
            trend={
              marginChangeResult.status === "available"
                ? marginChangeResult.value >= 0
                  ? "positive"
                  : "negative"
                : "neutral"
            }
          />

          {/* Return on Assets (ROA) - Profitability (Violet) */}
          <RatioCard
            category="profitability"
            categoryLabel="Profitability"
            formula="Net income / Average total assets × 100"
            label="Return on assets (ROA)"
            period={selectedPeriod}
            result={roaResult}
            subtext={
              prior
                ? `Avg assets: $${((prior.assets + current.assets) / 2).toFixed(
                    1,
                  )}M (${priorPeriod}–${selectedPeriod})`
                : "Opening assets (FY2019) unavailable"
            }
            suffix="%"
            trend="neutral"
          />

          {/* Return on Equity (ROE) - Profitability (Violet) */}
          <RatioCard
            category="profitability"
            categoryLabel="Profitability"
            formula="Net income / Average equity × 100"
            label="Return on equity (ROE)"
            period={selectedPeriod}
            result={roeResult}
            subtext={
              prior
                ? `Avg equity: $${((prior.equity + current.equity) / 2).toFixed(
                    1,
                  )}M (${priorPeriod}–${selectedPeriod})`
                : "Opening equity (FY2019) unavailable"
            }
            suffix="%"
            trend="neutral"
          />

          {/* Current Ratio - Liquidity (Cyan) */}
          <RatioCard
            category="liquidity"
            categoryLabel="Liquidity"
            formula="Current assets / Current liabilities"
            label="Current ratio"
            period={selectedPeriod}
            result={currentRatioResult}
            subtext={
              prior
                ? `Prior year: ${(
                    prior.currentAssets / prior.currentLiabilities
                  ).toFixed(2)}× in ${priorPeriod}`
                : "Prior year comparison unavailable"
            }
            suffix="×"
            trend={
              prior && currentRatioResult.status === "available"
                ? currentRatioResult.value >=
                  prior.currentAssets / prior.currentLiabilities
                  ? "positive"
                  : "negative"
                : "neutral"
            }
          />

          {/* Debt-to-Equity - Leverage (Rose) */}
          <RatioCard
            category="leverage"
            categoryLabel="Leverage"
            formula="Interest-bearing debt / Year-end equity"
            label="Debt-to-equity"
            period={selectedPeriod}
            result={debtToEquityResult}
            subtext={
              prior
                ? `Prior year: ${(
                    prior.interestBearingDebt / prior.equity
                  ).toFixed(2)}× in ${priorPeriod}`
                : `Year-end equity: $${current.equity}M`
            }
            suffix="×"
            trend="neutral"
          />

          {/* Net Income Growth - Growth / Profitability */}
          <RatioCard
            category="growth"
            categoryLabel="Growth"
            formula="(Current NI − Prior NI) / Prior NI × 100"
            label="Net income growth"
            period={selectedPeriod}
            result={niGrowthResult}
            subtext={
              prior
                ? `Net income: $${current.income}M vs $${prior.income}M in ${priorPeriod}`
                : "Prior year baseline unavailable"
            }
            suffix="%"
            trend={
              niGrowthResult.status === "available"
                ? niGrowthResult.value >= 0
                  ? "positive"
                  : "negative"
                : "neutral"
            }
          />

          {/* Operating Cash Flow Growth - Growth / Liquidity */}
          <RatioCard
            category="liquidity"
            categoryLabel="Cash flow"
            formula="(Current CF − Prior CF) / Prior CF × 100"
            label="Operating cash flow growth"
            period={selectedPeriod}
            result={cfGrowthResult}
            subtext={
              prior
                ? `Cash flow: $${current.cashFlow}M vs $${prior.cashFlow}M in ${priorPeriod}`
                : "Prior year baseline unavailable"
            }
            suffix="%"
            trend={
              cfGrowthResult.status === "available"
                ? cfGrowthResult.value >= 0
                  ? "positive"
                  : "negative"
                : "neutral"
            }
          />

          {/* Margin Change - Profitability */}
          <RatioCard
            category="profitability"
            categoryLabel="Profitability"
            formula="Current Net Margin − Prior Net Margin"
            label="Margin change"
            period={selectedPeriod}
            result={marginChangeResult}
            subtext={
              prior
                ? `${current.margin.toFixed(1)}% vs ${prior.margin.toFixed(1)}% in ${priorPeriod}`
                : "Prior year baseline unavailable"
            }
            suffix=" pp"
            trend={
              marginChangeResult.status === "available"
                ? marginChangeResult.value >= 0
                  ? "positive"
                  : "negative"
                : "neutral"
            }
          />
        </div>

        {/* Prototype Methodology Disclosure */}
        <div className="methodology-banner surface">
          <div className="methodology-header">
            <InfoIcon />
            <strong>Prototype calculation methodology</strong>
          </div>
          <p className="methodology-text">
            {METHODOLOGY_DISCLOSURES.roa} {METHODOLOGY_DISCLOSURES.comparisons}
          </p>
        </div>
      </section>

      {/* Section 2: Statement Extracts (5-Year Table) */}
      <section
        aria-labelledby="statements-title"
        className="analysis-section entrance entrance-3"
      >
        <div className="section-header-row">
          <div>
            <h2 id="statements-title">Financial statement extracts</h2>
            <p className="section-subtitle">
              Partial extracts · Figures in USD millions · Desktop columns
              ordered newest first
            </p>
          </div>

          <div
            aria-label="Statement selection"
            className="sliding-selector floating-pill-selector"
            role="tablist"
          >
            <button
              aria-selected={statementTab === "income"}
              className={`segment-button tab-income ${
                statementTab === "income" ? "active" : ""
              }`}
              onClick={() => setStatementTab("income")}
              role="tab"
              type="button"
            >
              Income statement
            </button>
            <button
              aria-selected={statementTab === "balance"}
              className={`segment-button tab-balance ${
                statementTab === "balance" ? "active" : ""
              }`}
              onClick={() => setStatementTab("balance")}
              role="tab"
              type="button"
            >
              Balance sheet
            </button>
            <button
              aria-selected={statementTab === "cashFlow"}
              className={`segment-button tab-cashFlow ${
                statementTab === "cashFlow" ? "active" : ""
              }`}
              onClick={() => setStatementTab("cashFlow")}
              role="tab"
              type="button"
            >
              Cash flow
            </button>
          </div>
        </div>

        {/* Scrollable Table Container */}
        <div className="table-wrapper surface">
          <div className="table-scroll-container">
            <table className="financial-table">
              <caption className="sr-only">
                {statementTab === "income"
                  ? "Income Statement Partial Extract (FY2020–FY2024)"
                  : statementTab === "balance"
                    ? "Balance Sheet Partial Extract (FY2020–FY2024)"
                    : "Cash Flow Partial Extract (FY2020–FY2024)"}
              </caption>
              <thead>
                <tr>
                  <th scope="col">Line Item</th>
                  {PERIODS_NEWEST_FIRST.map((p) => (
                    <th
                      className={`text-right ${
                        p === selectedPeriod ? "selected-col-head" : ""
                      }`}
                      key={p}
                      scope="col"
                    >
                      {p}
                      {p === selectedPeriod && (
                        <span className="col-selected-badge">Selected</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {statementTab === "income" && (
                  <>
                    <tr>
                      <th scope="row">Revenue ($M)</th>
                      {PERIODS_NEWEST_FIRST.map((p) => (
                        <td
                          className={`text-right tabular-nums ${
                            p === selectedPeriod ? "selected-col-cell" : ""
                          }`}
                          key={p}
                        >
                          ${financialData[p].revenue.toFixed(2)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <th scope="row">Net Income ($M)</th>
                      {PERIODS_NEWEST_FIRST.map((p) => (
                        <td
                          className={`text-right tabular-nums ${
                            p === selectedPeriod ? "selected-col-cell" : ""
                          }`}
                          key={p}
                        >
                          ${financialData[p].income.toFixed(2)}
                        </td>
                      ))}
                    </tr>
                    <tr className="subtotal-row">
                      <th scope="row">Net Profit Margin (%)</th>
                      {PERIODS_NEWEST_FIRST.map((p) => (
                        <td
                          className={`text-right tabular-nums ${
                            p === selectedPeriod ? "selected-col-cell" : ""
                          }`}
                          key={p}
                        >
                          {financialData[p].margin.toFixed(1)}%
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <th scope="row">YoY Revenue Growth (%)</th>
                      {PERIODS_NEWEST_FIRST.map((p) => {
                        const prev = getPriorPeriod(p)
                        if (!prev) {
                          return (
                            <td
                              className={`text-right tabular-nums muted ${
                                p === selectedPeriod ? "selected-col-cell" : ""
                              }`}
                              key={p}
                            >
                              —
                            </td>
                          )
                        }
                        const g = calculateRevenueGrowth(
                          financialData[p].revenue,
                          financialData[prev].revenue,
                        )
                        return (
                          <td
                            className={`text-right tabular-nums ${
                              g.status === "available" && g.value >= 0
                                ? "positive"
                                : "negative"
                            } ${
                              p === selectedPeriod ? "selected-col-cell" : ""
                            }`}
                            key={p}
                          >
                            {g.status === "available"
                              ? `${
                                  g.value >= 0 ? "+" : ""
                                }${g.value.toFixed(1)}%`
                              : "—"}
                          </td>
                        )
                      })}
                    </tr>
                  </>
                )}

                {statementTab === "balance" && (
                  <>
                    <tr>
                      <th scope="row">Current Assets ($M)</th>
                      {PERIODS_NEWEST_FIRST.map((p) => (
                        <td
                          className={`text-right tabular-nums ${
                            p === selectedPeriod ? "selected-col-cell" : ""
                          }`}
                          key={p}
                        >
                          ${financialData[p].currentAssets.toFixed(2)}
                        </td>
                      ))}
                    </tr>
                    <tr className="subtotal-row">
                      <th scope="row">Total Assets ($M)</th>
                      {PERIODS_NEWEST_FIRST.map((p) => (
                        <td
                          className={`text-right tabular-nums ${
                            p === selectedPeriod ? "selected-col-cell" : ""
                          }`}
                          key={p}
                        >
                          ${financialData[p].assets.toFixed(2)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <th scope="row">Current Liabilities ($M)</th>
                      {PERIODS_NEWEST_FIRST.map((p) => (
                        <td
                          className={`text-right tabular-nums ${
                            p === selectedPeriod ? "selected-col-cell" : ""
                          }`}
                          key={p}
                        >
                          ${financialData[p].currentLiabilities.toFixed(2)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <th scope="row">Total Liabilities ($M)</th>
                      {PERIODS_NEWEST_FIRST.map((p) => (
                        <td
                          className={`text-right tabular-nums ${
                            p === selectedPeriod ? "selected-col-cell" : ""
                          }`}
                          key={p}
                        >
                          ${financialData[p].totalLiabilities.toFixed(2)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <th scope="row">Shareholders' Equity ($M)</th>
                      {PERIODS_NEWEST_FIRST.map((p) => (
                        <td
                          className={`text-right tabular-nums ${
                            p === selectedPeriod ? "selected-col-cell" : ""
                          }`}
                          key={p}
                        >
                          ${financialData[p].equity.toFixed(2)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <th scope="row">Interest-Bearing Debt ($M)</th>
                      {PERIODS_NEWEST_FIRST.map((p) => (
                        <td
                          className={`text-right tabular-nums ${
                            p === selectedPeriod ? "selected-col-cell" : ""
                          }`}
                          key={p}
                        >
                          ${financialData[p].interestBearingDebt.toFixed(2)}
                        </td>
                      ))}
                    </tr>
                    <tr className="verification-row">
                      <th scope="row">
                        <span className="verify-pill">
                          <CheckIcon /> Balance Check: Assets = Liab + Equity
                        </span>
                      </th>
                      {PERIODS_NEWEST_FIRST.map((p) => {
                        const sum =
                          financialData[p].totalLiabilities +
                          financialData[p].equity
                        const matches = sum === financialData[p].assets
                        return (
                          <td
                            className={`text-right tabular-nums verification-cell ${
                              p === selectedPeriod ? "selected-col-cell" : ""
                            }`}
                            key={p}
                          >
                            {matches
                              ? `$${sum.toFixed(2)} (Balanced)`
                              : "Discrepancy"}
                          </td>
                        )
                      })}
                    </tr>
                  </>
                )}

                {statementTab === "cashFlow" && (
                  <>
                    <tr>
                      <th scope="row">Operating Cash Flow ($M)</th>
                      {PERIODS_NEWEST_FIRST.map((p) => (
                        <td
                          className={`text-right tabular-nums ${
                            p === selectedPeriod ? "selected-col-cell" : ""
                          }`}
                          key={p}
                        >
                          ${financialData[p].cashFlow.toFixed(2)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <th scope="row">YoY Cash Flow Growth (%)</th>
                      {PERIODS_NEWEST_FIRST.map((p) => {
                        const prev = getPriorPeriod(p)
                        if (!prev) {
                          return (
                            <td
                              className={`text-right tabular-nums muted ${
                                p === selectedPeriod ? "selected-col-cell" : ""
                              }`}
                              key={p}
                            >
                              —
                            </td>
                          )
                        }
                        const g = calculateCashFlowGrowth(
                          financialData[p].cashFlow,
                          financialData[prev].cashFlow,
                        )
                        return (
                          <td
                            className={`text-right tabular-nums ${
                              g.status === "available" && g.value >= 0
                                ? "positive"
                                : "negative"
                            } ${
                              p === selectedPeriod ? "selected-col-cell" : ""
                            }`}
                            key={p}
                          >
                            {g.status === "available"
                              ? `${
                                  g.value >= 0 ? "+" : ""
                                }${g.value.toFixed(1)}%`
                              : "—"}
                          </td>
                        )
                      })}
                    </tr>
                    <tr className="subtotal-row">
                      <th scope="row">Operating Cash Flow to Net Income</th>
                      {PERIODS_NEWEST_FIRST.map((p) => {
                        const ratio =
                          financialData[p].cashFlow / financialData[p].income
                        return (
                          <td
                            className={`text-right tabular-nums ${
                              p === selectedPeriod ? "selected-col-cell" : ""
                            }`}
                            key={p}
                          >
                            {ratio.toFixed(2)}×
                          </td>
                        )
                      })}
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
          <div className="table-caption-footer">
            <small>
              Note: Demonstration data represents partial line-item extracts for
              prototype evaluation. No expenses or investing/financing
              activities are inferred.
            </small>
          </div>
        </div>
      </section>

      {/* Section 3: Performance & Trend Chart */}
      <section
        aria-labelledby="chart-section-title"
        className="analysis-section entrance entrance-4"
      >
        <div className="section-header-row">
          <div>
            <h2 id="chart-section-title">Visual financial metrics</h2>
            <p className="section-subtitle">
              {chartMode === "comparison"
                ? `Year comparison: ${selectedPeriod} on the LEFT${
                    priorPeriod
                      ? `, ${priorPeriod} on the RIGHT`
                      : " (baseline observation)"
                  }`
                : "5-year trend (FY2020–FY2024): Chronological left-to-right order"}
            </p>
          </div>

          <div className="chart-controls-group">
            {/* View Mode Toggle: Year comparison vs 5-Year Trend */}
            <div
              aria-label="Chart mode"
              className="sliding-selector floating-pill-selector"
              role="radiogroup"
            >
              <button
                aria-checked={chartMode === "comparison"}
                className={`segment-button ${
                  chartMode === "comparison" ? "active" : ""
                }`}
                onClick={() => setChartMode("comparison")}
                role="radio"
                type="button"
              >
                Year comparison
              </button>
              <button
                aria-checked={chartMode === "trend"}
                className={`segment-button ${
                  chartMode === "trend" ? "active" : ""
                }`}
                onClick={() => setChartMode("trend")}
                role="radio"
                type="button"
              >
                5-year trend
              </button>
            </div>

            {/* Metric Selector */}
            <div
              aria-label="Metric to chart"
              className="sliding-selector floating-pill-selector"
              role="radiogroup"
            >
              {(["revenue", "income", "cashFlow"] as ChartMetric[]).map((m) => (
                <button
                  aria-checked={chartMetric === m}
                  className={`segment-button ${
                    chartMetric === m ? "active" : ""
                  }`}
                  key={m}
                  onClick={() => setChartMetric(m)}
                  role="radio"
                  type="button"
                >
                  {metricLabels[m]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className={`chart-card surface chart-metric-${chartMetric}`}
          data-metric={chartMetric}
        >
          <div className="chart-svg-wrap">
            <svg
              aria-label={`${selectedChartLabel} chart: ${chartBars.map((b) => `${b.year} $${b.value}M`).join(", ")}`}
              className="chart-svg"
              role="img"
              viewBox="0 0 620 210"
            >
              {/* Grid Lines and Zero Baseline */}
              {ticks.map((tick) => {
                const y = baseline - (tick / chartMax) * chartHeight
                return (
                  <g key={tick}>
                    <line
                      className="grid-line"
                      x1="60"
                      x2="590"
                      y1={y}
                      y2={y}
                    />
                    <text
                      className="axis-text tabular-nums"
                      textAnchor="end"
                      x="50"
                      y={y + 4}
                    >
                      ${tick}M
                    </text>
                  </g>
                )
              })}

              {/* Render Bars */}
              {renderChartBars()}
            </svg>

            {tooltip && (
              <div
                className="chart-tooltip"
                role="tooltip"
                style={{ left: `${tooltip.left}%`, top: `${tooltip.top}%` }}
              >
                <span>{tooltip.title}</span>
                <strong>{tooltip.value}</strong>
              </div>
            )}
          </div>

          <div className="chart-card-footer">
            <span className="chart-footer-note">
              {chartMode === "comparison"
                ? `Showing ${selectedChartLabel} for ${selectedPeriod} (left)${
                    priorPeriod ? ` alongside ${priorPeriod} (right)` : ""
                  }.`
                : `Chronological 5-year trend from FY2020 through FY2024. All 5 observations use zero baseline.`}
            </span>
            <button
              className="button button-primary action-link-btn"
              onClick={() => onNavigate("risks")}
              type="button"
            >
              <span>Evaluate in Risk Screening</span>
              <ArrowRightIcon />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function RatioCard({
  category,
  categoryLabel,
  label,
  period,
  result,
  subtext,
  suffix,
  formula,
  trend,
}: {
  category: "profitability" | "liquidity" | "leverage" | "growth"
  categoryLabel: string
  label: string
  period: Period
  result: CalculationResult
  subtext: string
  suffix: string
  formula: string
  trend: "positive" | "negative" | "neutral"
}) {
  const isAvailable = result.status === "available"

  return (
    <article
      aria-labelledby={`ratio-${label}`}
      className={`ratio-card surface ratio-card-${category}`}
    >
      <div className="ratio-header">
        <div className="ratio-header-top">
          <span className={`ratio-cat-badge badge-${category}`}>
            {categoryLabel}
          </span>
          <span className="formula-tag" title={formula}>
            {formula}
          </span>
        </div>
        <h3 id={`ratio-${label}`}>{label}</h3>
      </div>

      <div className="ratio-value-row">
        {isAvailable ? (
          <div className="ratio-primary-value tabular-nums">
            <strong>
              {suffix === "×"
                ? result.value.toFixed(2)
                : result.value.toFixed(1)}
            </strong>
            <span className="ratio-unit">{suffix}</span>
          </div>
        ) : (
          <div className="ratio-unavailable-badge">
            <span className="unavailable-pill">Not assessable</span>
          </div>
        )}

        {isAvailable && trend !== "neutral" && (
          <span className={`ratio-dir-badge ${trend}`}>
            {trend === "positive" ? <ArrowUpIcon /> : <ArrowDownIcon />}
            <span>{trend === "positive" ? "Favorable" : "Unfavorable"}</span>
          </span>
        )}
      </div>

      <p className="ratio-subtext">{isAvailable ? subtext : result.reason}</p>
    </article>
  )
}
