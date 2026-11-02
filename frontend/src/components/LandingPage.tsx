import { financialData, SAMPLE_NOTICE } from "../data/financialData"
import { evaluateRisks } from "../utils/riskEvaluation"
import LogoMark from "./LogoMark"

type LandingPageProps = {
  onExplore: () => void
}

const metrics = [
  { label: "Revenue", value: "$516M", detail: "+7.5% YoY", tone: "revenue" },
  {
    label: "Net income",
    value: "$43.86M",
    detail: "−8.6% YoY",
    tone: "profit",
  },
  {
    label: "Total assets",
    value: "$640M",
    detail: "+6.7% YoY",
    tone: "assets",
  },
  {
    label: "Operating cash flow",
    value: "$58M",
    detail: "−10.8% YoY",
    tone: "cash",
  },
]

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height="16"
      viewBox="0 0 24 24"
      width="16"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function MiniChart() {
  const years = Object.values(financialData)
  const max = Math.max(...years.map((item) => item.revenue))
  return (
    <div
      className="landing-chart"
      aria-label="Revenue from FY2020 to FY2024: 350, 390, 440, 480, and 516 million dollars"
      role="img"
    >
      {years.map((item, index) => (
        <div className="landing-chart-column" key={item.revenue}>
          <span className="landing-chart-value">${item.revenue}M</span>
          <span
            className="landing-chart-bar"
            style={{ height: `${Math.round((item.revenue / max) * 100)}%` }}
          />
          <span>FY{2020 + index}</span>
        </div>
      ))}
    </div>
  )
}

export default function LandingPage({ onExplore }: LandingPageProps) {
  const riskSummary = evaluateRisks("FY2024").summary

  const scrollToWorkflow = () => {
    document.getElementById("workflow")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="landing-page">
      <header className="landing-nav">
        <button
          aria-label="FinSight AI home"
          className="landing-brand"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          type="button"
        >
          <LogoMark />
          <span>
            FinSight <strong>AI</strong>
          </span>
        </button>
        <nav aria-label="Public navigation">
          <button onClick={scrollToWorkflow} type="button">
            How it works
          </button>
          <a href="#capabilities">Capabilities</a>
          <a href="#roadmap">Prototype scope</a>
        </nav>
        <button
          className="button landing-nav-cta"
          onClick={onExplore}
          type="button"
        >
          Explore demo <ArrowIcon />
        </button>
      </header>

      <main>
        <section className="landing-hero">
          <div className="hero-copy">
            <span className="eyebrow">
              <i /> Financial document intelligence, made legible
            </span>
            <h1>
              Read the numbers.
              <br />
              <em>See the reasoning.</em>
            </h1>
            <p>
              FinSight brings reported figures, deterministic ratios, risk
              rules, and document-grounded explanations into one traceable
              workspace.
            </p>
            <div className="hero-actions">
              <button
                className="button hero-primary"
                onClick={onExplore}
                type="button"
              >
                Explore the prototype <ArrowIcon />
              </button>
              <button
                className="button hero-secondary"
                onClick={scrollToWorkflow}
                type="button"
              >
                How it works
              </button>
            </div>
            <p className="hero-honesty">
              Fictional sample data. No account required. No files uploaded.
            </p>
          </div>

          <div
            className="product-stage"
            aria-label="Preview of the FinSight overview"
          >
            <div className="stage-glow" />
            <div className="preview-window surface">
              <div className="preview-rail" aria-hidden="true">
                <span className="preview-logo">F</span>
                {[0, 1, 2, 3, 4].map((item) => (
                  <i className={item === 0 ? "active" : ""} key={item} />
                ))}
              </div>
              <div className="preview-content">
                <div className="preview-head">
                  <div>
                    <small>OVERVIEW</small>
                    <strong>Northstar Manufacturing</strong>
                  </div>
                  <span>FY2024</span>
                </div>
                <div className="preview-metrics">
                  {metrics.map((metric) => (
                    <article
                      className={`preview-metric ${metric.tone}`}
                      key={metric.label}
                    >
                      <small>{metric.label}</small>
                      <strong>{metric.value}</strong>
                      <span>{metric.detail}</span>
                    </article>
                  ))}
                </div>
                <div className="preview-lower">
                  <article className="preview-chart-card">
                    <div>
                      <strong>Revenue trajectory</strong>
                      <span>USD millions</span>
                    </div>
                    <MiniChart />
                  </article>
                  <article className="preview-risk-card">
                    <small>RULE SCREENING</small>
                    <strong>
                      {riskSummary.triggered}
                      <span> / 7</span>
                    </strong>
                    <p>indicators triggered</p>
                    <div>
                      <i />
                      <span>
                        Margin, cash flow, liquidity and debt changes remain
                        visible.
                      </span>
                    </div>
                  </article>
                </div>
              </div>
            </div>
            <div className="floating-proof proof-source">
              <span>01</span>
              <div>
                <strong>Reported figure</strong>
                <small>Revenue · FY2024</small>
              </div>
            </div>
            <div className="floating-proof proof-formula">
              <span>fx</span>
              <div>
                <strong>Deterministic ratio</strong>
                <small>43.86 ÷ 516 = 8.5%</small>
              </div>
            </div>
          </div>
        </section>

        <section className="workflow-section" id="workflow">
          <div className="section-kicker">THE INTENDED WORKFLOW</div>
          <div className="workflow-heading">
            <h2>
              From report to reasoning,
              <br />
              without losing the trail.
            </h2>
            <p>
              Each layer stays distinct, so users can tell what was reported,
              what was calculated, and what was explained.
            </p>
          </div>
          <div className="workflow-steps">
            {[
              [
                "01",
                "Select a report",
                "Choose a PDF and preview the processing experience. In this prototype, files remain only in browser memory.",
              ],
              [
                "02",
                "Inspect the financials",
                "Move from reported figures to five-year trends, period comparisons, and formulas you can verify.",
              ],
              [
                "03",
                "Question with context",
                "Explore deterministic demo answers today; verified source citations are planned with backend integration.",
              ],
            ].map(([number, title, copy]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="capabilities-section" id="capabilities">
          <article className="capability-editorial capability-analysis">
            <div className="capability-copy">
              <span className="section-kicker">FINANCIAL ANALYSIS</span>
              <h2>
                Numbers with
                <br />a point of view.
              </h2>
              <p>
                Compare periods, inspect five-year movement, and understand
                exactly how each ratio is calculated.
              </p>
              <button
                className="button text-link"
                onClick={onExplore}
                type="button"
              >
                Open analysis <ArrowIcon />
              </button>
            </div>
            <div className="ratio-composition surface">
              <div className="ratio-orbit">
                <span>8.5%</span>
                <small>NET MARGIN</small>
              </div>
              <div className="ratio-detail">
                <span>FY2023</span>
                <strong>10.0%</strong>
              </div>
              <div className="ratio-detail current">
                <span>FY2024</span>
                <strong>8.5%</strong>
              </div>
              <p>−1.5 percentage points</p>
            </div>
          </article>

          <article className="capability-editorial capability-risk">
            <div className="rule-list-visual">
              <div>
                <i className="watch" />
                <span>
                  <strong>Cash flow declined</strong>
                  <small>Watch · Triggered</small>
                </span>
                <b>−10.8%</b>
              </div>
              <div>
                <i className="watch" />
                <span>
                  <strong>Current ratio declined</strong>
                  <small>Watch · Triggered</small>
                </span>
                <b>1.58×</b>
              </div>
              <div>
                <i className="clear" />
                <span>
                  <strong>Negative cash flow</strong>
                  <small>Elevated · Not triggered</small>
                </span>
                <b>$58M</b>
              </div>
            </div>
            <div className="capability-copy">
              <span className="section-kicker">TRANSPARENT RISK RULES</span>
              <h2>
                Flags, not
                <br />
                black boxes.
              </h2>
              <p>
                Every indicator exposes its threshold, supporting figures, and
                state. No invented causes and no opaque health score.
              </p>
            </div>
          </article>

          <article className="capability-editorial capability-evidence">
            <div className="capability-copy">
              <span className="section-kicker">
                EVIDENCE-BASED EXPLANATIONS
              </span>
              <h2>
                Answers that show
                <br />
                their working.
              </h2>
              <p>
                The demo assistant responds from the sample dataset. Future
                integration will ground explanations in actual documents with
                verified citations.
              </p>
            </div>
            <blockquote className="assistant-preview surface">
              <small>DEMO ASSISTANT</small>
              <p>
                Revenue increased by <mark>7.5%</mark>, from $480M in FY2023 to
                $516M in FY2024.
              </p>
              <footer>
                <span>Calculated from sample data</span>
                <span>Verified citations planned</span>
              </footer>
            </blockquote>
          </article>
        </section>

        <section className="trace-section">
          <div>
            <span className="section-kicker">TRACEABILITY BY DESIGN</span>
            <h2>
              Three layers.
              <br />
              One clear lineage.
            </h2>
          </div>
          <div className="trace-stack">
            <article>
              <span>01</span>
              <div>
                <h3>Reported figures</h3>
                <p>
                  The financial statement values as presented in the source
                  material.
                </p>
              </div>
              <b>$516M</b>
            </article>
            <article>
              <span>02</span>
              <div>
                <h3>Calculated ratios</h3>
                <p>
                  Deterministic formulas applied to reported figures with
                  visible definitions.
                </p>
              </div>
              <b>8.5%</b>
            </article>
            <article>
              <span>03</span>
              <div>
                <h3>Supporting sources</h3>
                <p>
                  Page-level evidence is part of the planned extraction and
                  citation workflow.
                </p>
              </div>
              <b>Planned</b>
            </article>
          </div>
        </section>

        <section className="scope-section" id="roadmap">
          <div className="scope-intro">
            <span className="section-kicker">HONEST PROTOTYPE SCOPE</span>
            <h2>Built to make the intended experience tangible.</h2>
          </div>
          <div className="scope-columns">
            <article>
              <span>Available now</span>
              <ul>
                <li>Five-year fictional financial dataset</li>
                <li>Deterministic ratios and risk rules</li>
                <li>Local file selection and simulated progress</li>
                <li>Predefined, data-grounded demo answers</li>
              </ul>
            </article>
            <article>
              <span>Requires backend integration</span>
              <ul>
                <li>PDF upload, storage, and extraction</li>
                <li>Document-grounded language models</li>
                <li>Verified page-level source citations</li>
                <li>Authentication and persistent workspaces</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="landing-final">
          <span className="section-kicker">
            EXPLORE NORTHSTAR MANUFACTURING
          </span>
          <h2>See the full reasoning layer.</h2>
          <p>
            Preview the intended workflow using a transparent, fictional
            five-year dataset.
          </p>
          <button
            className="button hero-primary"
            onClick={onExplore}
            type="button"
          >
            Explore the prototype <ArrowIcon />
          </button>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-brand">
          <LogoMark />
          <span>FinSight AI</span>
        </div>
        <p>Financial document intelligence, designed for clarity.</p>
        <div>
          <button onClick={scrollToWorkflow} type="button">
            How it works
          </button>
          <a href="#roadmap">Prototype scope</a>
          <button onClick={onExplore} type="button">
            Open demo
          </button>
        </div>
        <p className="landing-disclosure">{SAMPLE_NOTICE}</p>
      </footer>
    </div>
  )
}
