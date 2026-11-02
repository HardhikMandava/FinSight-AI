import { useState } from "react"
import {
  type Period,
  PERIODS_NEWEST_FIRST,
  COMPANY_NAME,
  CURRENCY_LABEL,
} from "../data/financialData"
import {
  evaluateRisks,
  type RiskRule,
  type RuleStatus,
} from "../utils/riskEvaluation"

interface RisksPageProps {
  onNavigate: (page: "overview" | "documents" | "analysis" | "risks" | "assistant") => void
  selectedPeriod: Period
  onPeriodChange: (period: Period) => void
}

type FilterOption = "all" | "triggered" | "not_triggered" | "not_assessable"

function ArrowLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={14}
      viewBox="0 0 24 24"
      width={14}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function AlertTriangleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={16}
      viewBox="0 0 24 24"
      width={16}
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={16}
      viewBox="0 0 24 24"
      width={16}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function HelpCircleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={16}
      viewBox="0 0 24 24"
      width={16}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
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

export default function RisksPage({
  onNavigate,
  selectedPeriod,
  onPeriodChange,
}: RisksPageProps) {
  const [filter, setFilter] = useState<FilterOption>("all")

  // Dynamically evaluate rules from shared 5-year data for selected period
  const evaluation = evaluateRisks(selectedPeriod)
  const { rules, summary } = evaluation

  const filteredRules = rules.filter((rule) => {
    if (filter === "all") return true
    return rule.status === filter
  })

  return (
    <div className="risks-page">
      {/* Header */}
      <header className="page-heading-row entrance entrance-1">
        <div>
          <button
            className="button text-back-btn"
            onClick={() => onNavigate("analysis")}
            type="button"
          >
            <ArrowLeftIcon />
            <span>Financial analysis</span>
          </button>
          <h1>Risk Indicators</h1>
          <p className="risks-subtitle">
            Demonstration screening rules applied to {COMPANY_NAME} dataset.
          </p>
          <p className="risks-scope-note">
            Screening flags are informational indicators, not audited risk
            findings or investment recommendations. No overall health score is
            assigned.
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

      {/* Summary Counts Strip */}
      <section
        aria-labelledby="summary-strip-title"
        className="risks-summary-strip entrance entrance-2"
      >
        <h2 className="sr-only" id="summary-strip-title">
          Risk Rule Evaluation Summary
        </h2>
        <div className="summary-pill surface pill-triggered">
          <div className="summary-icon">
            <AlertTriangleIcon />
          </div>
          <div className="summary-content">
            <span className="summary-label">Triggered flags</span>
            <strong className="summary-count tabular-nums">
              {summary.triggered}
            </strong>
          </div>
        </div>

        <div className="summary-pill surface pill-not-triggered">
          <div className="summary-icon">
            <CheckCircleIcon />
          </div>
          <div className="summary-content">
            <span className="summary-label">Not triggered</span>
            <strong className="summary-count tabular-nums">
              {summary.notTriggered}
            </strong>
          </div>
        </div>

        <div className="summary-pill surface pill-not-assessable">
          <div className="summary-icon">
            <HelpCircleIcon />
          </div>
          <div className="summary-content">
            <span className="summary-label">Not assessable</span>
            <strong className="summary-count tabular-nums">
              {summary.notAssessable}
            </strong>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <nav
        aria-label="Risk rule filter tabs"
        className="filter-tabs-row entrance entrance-3"
      >
        <div className="sliding-selector floating-pill-selector" role="tablist">
          <button
            aria-selected={filter === "all"}
            className={`segment-button ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
            role="tab"
            type="button"
          >
            All ({summary.total})
          </button>
          <button
            aria-selected={filter === "triggered"}
            className={`segment-button ${
              filter === "triggered" ? "active" : ""
            }`}
            onClick={() => setFilter("triggered")}
            role="tab"
            type="button"
          >
            Triggered ({summary.triggered})
          </button>
          <button
            aria-selected={filter === "not_triggered"}
            className={`segment-button ${
              filter === "not_triggered" ? "active" : ""
            }`}
            onClick={() => setFilter("not_triggered")}
            role="tab"
            type="button"
          >
            Not triggered ({summary.notTriggered})
          </button>
          <button
            aria-selected={filter === "not_assessable"}
            className={`segment-button ${
              filter === "not_assessable" ? "active" : ""
            }`}
            onClick={() => setFilter("not_assessable")}
            role="tab"
            type="button"
          >
            Not assessable ({summary.notAssessable})
          </button>
        </div>
      </nav>

      {/* Rules List */}
      <main
        aria-label="Evaluated Risk Rules"
        className="rules-list entrance entrance-4"
      >
        {filteredRules.length === 0 ? (
          <div className="empty-rules surface">
            <p>
              No screening rules match the selected filter for {selectedPeriod}.
            </p>
          </div>
        ) : (
          filteredRules.map((rule) => <RiskCard key={rule.id} rule={rule} />)
        )}
      </main>

      {/* Methodology and Scope Disclosure */}
      <footer className="methodology-section surface entrance entrance-4">
        <div className="methodology-header">
          <InfoIcon />
          <h3>Rule Evaluation Methodology & Prototype Constraints</h3>
        </div>
        <p className="methodology-text">
          FinSight AI evaluates seven project-defined demonstration rules using
          reported statement figures from the shared {CURRENCY_LABEL} dataset.
          Rules with year-over-year conditions compare the selected period with
          its immediately preceding year. For FY2020, comparisons cannot be
          computed because FY2019 baseline figures are not supplied, so
          comparative rules are designated as not assessable rather than
          assumed.
        </p>
        <p className="methodology-text">
          Screening flags identify specific mathematical conditions (such as
          declining margins, negative cash flow, or debt expansion). In
          particular, increasing debt alone does not establish financial
          distress. These indicators do not constitute an official credit
          rating, risk audit, or investment opinion.
        </p>
        <div className="methodology-footer-action">
          <button
            className="button button-primary"
            onClick={() => onNavigate("analysis")}
            type="button"
          >
            <span>View Full Financial Analysis</span>
          </button>
        </div>
      </footer>
    </div>
  )
}

function RiskCard({ rule }: { rule: RiskRule }) {
  const statusLabels: Record<RuleStatus, { label: string; className: string }> =
    {
      triggered: { label: "Triggered", className: "badge-triggered" },
      not_triggered: {
        label: "Not Triggered",
        className: "badge-not-triggered",
      },
      not_assessable: {
        label: "Not Assessable",
        className: "badge-not-assessable",
      },
    }

  const { label, className } = statusLabels[rule.status]

  return (
    <article
      aria-labelledby={`rule-title-${rule.id}`}
      className={`rule-card surface card-${rule.status}`}
    >
      <div className="rule-card-header">
        <div className="rule-title-group">
          <h3 id={`rule-title-${rule.id}`}>{rule.title}</h3>
          <span
            className={`severity-tag severity-${rule.severity.toLowerCase()}`}
          >
            {rule.severity}
          </span>
        </div>
        <span className={`status-badge ${className}`}>{label}</span>
      </div>

      <div className="rule-condition">
        <strong>Condition:</strong>
        <span>{rule.condition}</span>
      </div>

      <div className="rule-supporting">
        <strong>Supporting figures:</strong>
        <span className="tabular-nums">{rule.supportingValues}</span>
      </div>

      <p className="rule-explanation">{rule.explanation}</p>
    </article>
  )
}
