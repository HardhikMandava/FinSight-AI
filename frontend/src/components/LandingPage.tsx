import { financialData, SAMPLE_NOTICE } from "../data/financialData"
import { evaluateRisks } from "../utils/riskEvaluation"
import LogoMark from "./LogoMark"
import CinematicProductSequence from "./CinematicProductSequence"

type LandingPageProps = {
  onExplore: () => void
  isReducedMotion?: boolean
}

const heroMetrics = [
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

export default function LandingPage({
  onExplore,
  isReducedMotion = false,
}: LandingPageProps) {
  const riskSummary = evaluateRisks("FY2024").summary

  const scrollToWorkflow = () => {
    document.getElementById("product-story")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="landing-page">
      {/* Skip to Main Content for Accessibility */}
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

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

      <main id="main-content">
        {/* Hero Section */}
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
              FinSight AI connects reported statement rows, deterministic ratios,
              transparent risk screening rules, and grounded explanations into one
              traceable workspace.
            </p>
            <div className="hero-actions">
              <button
                className="button hero-primary"
                onClick={onExplore}
                type="button"
              >
                Explore demo workspace <ArrowIcon />
              </button>
              <button
                className="button hero-secondary"
                onClick={scrollToWorkflow}
                type="button"
              >
                See how it works
              </button>
            </div>
            <p className="hero-honesty">
              Fictional sample data (FY2020–FY2024). No account required. Files remain local in memory.
            </p>
          </div>

          {/* Right Column: Glassy Dimensional Workspace Preview */}
          <div
            className="product-stage"
            aria-label="Preview of the FinSight workspace"
          >
            <div className="stage-glow" />
            <div className="preview-window surface">
              <div className="preview-rail" aria-hidden="true">
                <span className="preview-logo" style={{ background: "transparent", padding: 0 }}>
                  <LogoMark />
                </span>
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
                  {heroMetrics.map((metric) => (
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

        {/* Section 6: Cinematic Apple-Style Scroll Product Presentation */}
        <CinematicProductSequence
          isReducedMotion={isReducedMotion}
          onExplore={onExplore}
        />

        {/* Core Capabilities Section */}
        <section className="capabilities-section" id="capabilities">
          <article className="capability-editorial capability-analysis">
            <div className="capability-copy">
              <span className="section-kicker">FINANCIAL ANALYSIS</span>
              <h2>
                Numbers with
                <br />a point of view.
              </h2>
              <p>
                Inspect five-year historical performance, compare fiscal periods,
                and review deterministic formulas directly alongside reported statement items.
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
              <p>−1.5 percentage points YoY</p>
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
                Every rule exposes its exact threshold, supporting figures, and evaluation status.
                Untriggered flags indicate condition absence, not an audited clean bill of health.
              </p>
            </div>
          </article>

          <article className="capability-editorial capability-evidence">
            <div className="capability-copy">
              <span className="section-kicker">
                GROUNDED ASSISTANCE
              </span>
              <h2>
                Answers that show
                <br />
                their working.
              </h2>
              <p>
                The demo assistant evaluates questions using structured Northstar data.
                Full PDF citations and text groundings require server-side extraction.
              </p>
            </div>
            <blockquote className="assistant-preview surface">
              <small>DEMO ASSISTANT</small>
              <p>
                Revenue increased by <mark>7.5%</mark>, from $480M in FY2023 to
                $516M in FY2024. Operating cash flow declined from $65M to $58M.
              </p>
              <footer>
                <span>Calculated from fictional dataset</span>
                <span>Verified citations planned with backend</span>
              </footer>
            </blockquote>
          </article>
        </section>

        {/* Traceability Lineage Section */}
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
            <article className="surface">
              <span>01</span>
              <div>
                <h3>Reported statement figures</h3>
                <p>
                  Line items extracted directly from source filings without alterations.
                </p>
              </div>
              <b>$516M</b>
            </article>
            <article className="surface">
              <span>02</span>
              <div>
                <h3>Deterministic formulas</h3>
                <p>
                  Mathematical ratios and percentage changes with visible definitions.
                </p>
              </div>
              <b>8.5%</b>
            </article>
            <article className="surface">
              <span>03</span>
              <div>
                <h3>Evidence & citations</h3>
                <p>
                  Page-level citations and bounding boxes are supported with backend extraction.
                </p>
              </div>
              <b>Planned</b>
            </article>
          </div>
        </section>

        {/* Prototype Scope Matrix */}
        <section className="scope-section" id="roadmap">
          <div className="scope-intro">
            <span className="section-kicker">HONEST PROTOTYPE SCOPE</span>
            <h2>Built to make document intelligence tangible.</h2>
          </div>
          <div className="scope-columns">
            <article className="surface scope-card-available">
              <span className="scope-badge badge-now">Available in this demo</span>
              <ul>
                <li>Five-year Northstar Manufacturing dataset (FY2020–FY2024)</li>
                <li>9 calculated financial ratios with missing-data handling</li>
                <li>7 rule-based screening flags with Watch & Elevated severities</li>
                <li>Local PDF selection, size checks, and simulated processing</li>
                <li>Interactive demo assistant answering financial queries</li>
              </ul>
            </article>
            <article className="surface scope-card-planned">
              <span className="scope-badge badge-roadmap">Requires backend integration</span>
              <ul>
                <li>Server-side PDF OCR parsing and table extraction</li>
                <li>Document-grounded language model reasoning</li>
                <li>Page-level bounding box highlights and citation anchors</li>
                <li>User accounts, persistent libraries, and multi-tenant workspaces</li>
              </ul>
            </article>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="landing-final">
          <span className="section-kicker">
            EXPLORE THE PROTOTYPE
          </span>
          <h2>See the full reasoning layer.</h2>
          <p>
            Inspect the five-year Northstar dataset across overview, analysis, risk screening,
            and the interactive demo assistant.
          </p>
          <button
            className="button hero-primary"
            onClick={onExplore}
            type="button"
          >
            Launch demo workspace <ArrowIcon />
          </button>
        </section>
      </main>

      {/* Landing Footer with Single Exact Disclosure */}
      <footer className="landing-footer">
        <div className="landing-footer-top">
          <div className="landing-brand">
            <LogoMark />
            <span>FinSight AI</span>
          </div>
          <p className="landing-tagline">
            Financial document intelligence prototype combining reported statement figures,
            deterministic ratios, and risk indicators.
          </p>
        </div>
        <div className="landing-footer-links">
          <button onClick={scrollToWorkflow} type="button">
            How it works
          </button>
          <a href="#capabilities">Capabilities</a>
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
