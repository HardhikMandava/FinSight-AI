import { useEffect, useRef, useState } from "react"
import { financialData, PERIODS_CHRONOLOGICAL } from "../data/financialData"
import LogoMark from "./LogoMark"

interface CinematicProductSequenceProps {
  onExplore: () => void
  isReducedMotion?: boolean
}

export default function CinematicProductSequence({
  onExplore,
  isReducedMotion = false,
}: CinematicProductSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile viewport (< 768px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Native scroll progress calculation (no scroll hijacking or wheel interception)
  useEffect(() => {
    if (isReducedMotion || isMobile) return

    let rafId: number | null = null

    const handleScroll = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        const el = containerRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        // Sticky stage is positioned at top: 88px under the floating header
        const stickyTop = 88
        const totalScrollable = rect.height - window.innerHeight + stickyTop
        if (totalScrollable <= 0) return
        const currentScroll = stickyTop - rect.top
        const rawProgress = currentScroll / totalScrollable
        const clamped = Math.max(0, Math.min(1, rawProgress))
        setScrollProgress(clamped)
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [isReducedMotion, isMobile])

  // Normalized progress phases:
  // Scene 1: 0.00 - 0.22 (The Report)
  // Scene 2: 0.22 - 0.48 (The Figures)
  // Scene 3: 0.48 - 0.75 (The Analysis)
  // Scene 4: 0.75 - 1.00 (The Product Preview)
  const p = scrollProgress

  // Scene 1 progress [0, 1]
  const p1 = Math.min(1, p / 0.22)
  // Scene 2 progress [0, 1]
  const p2 = Math.max(0, Math.min(1, (p - 0.22) / 0.26))
  // Scene 3 progress [0, 1]
  const p3 = Math.max(0, Math.min(1, (p - 0.48) / 0.27))
  // Scene 4 progress [0, 1]
  const p4 = Math.max(0, Math.min(1, (p - 0.75) / 0.25))

  // Headings based on active scene
  let currentScene = 1
  if (p >= 0.75) currentScene = 4
  else if (p >= 0.48) currentScene = 3
  else if (p >= 0.22) currentScene = 2

  const headings = [
    {
      step: "01",
      title: "Start with the report.",
      subtitle: "Authentic financial statements provide the primary ground truth.",
    },
    {
      step: "02",
      title: "Bring the numbers into focus.",
      subtitle: "Reported rows highlight and separate into structured financial metrics.",
    },
    {
      step: "03",
      title: "See the financial story.",
      subtitle: "Multi-year trajectories and deterministic ratios reveal the real picture.",
    },
    {
      step: "04",
      title: "A complete reasoning workspace.",
      subtitle: "Trace every metric back to reported statement rows and verifiable formulas.",
    },
  ]

  const activeHeading = headings[currentScene - 1]

  // If reduced motion is active or on mobile, render the clean static presentation
  if (isReducedMotion || isMobile) {
    return (
      <section
        aria-label="Product Presentation"
        className="cinematic-static-section"
        id="product-story"
      >
        <div className="section-kicker">INTERACTIVE WALKTHROUGH</div>
        <div className="cinematic-static-header">
          <h2>From source report to verified reasoning.</h2>
          <p>
            Experience how FinSight AI transforms dense financial filings into
            clear, traceable indicators.
          </p>
        </div>

        <div className="cinematic-static-grid">
          {/* Card 1 */}
          <article className="static-story-card surface">
            <div className="story-step-badge">01 · THE REPORT</div>
            <h3>Start with the report</h3>
            <p>
              Source figures are read from financial statements without
              altering reported balances.
            </p>
            <div className="static-mini-report">
              <div className="report-row highlight">
                <span>Revenue</span>
                <strong>$516M</strong>
              </div>
              <div className="report-row highlight">
                <span>Net Income</span>
                <strong>$43.86M</strong>
              </div>
              <div className="report-row highlight">
                <span>Operating Cash Flow</span>
                <strong>$58M</strong>
              </div>
            </div>
          </article>

          {/* Card 2 */}
          <article className="static-story-card surface">
            <div className="story-step-badge">02 · THE FIGURES</div>
            <h3>Bring numbers into focus</h3>
            <p>
              Key statement lines separate into structured metric cards with YoY
              comparisons.
            </p>
            <div className="static-metrics-group">
              <div className="static-metric-pill pill-rev">
                <span>Revenue</span>
                <strong>$516M</strong>
                <small>+7.5% YoY</small>
              </div>
              <div className="static-metric-pill pill-inc">
                <span>Net Income</span>
                <strong>$43.86M</strong>
                <small>−8.6% YoY</small>
              </div>
              <div className="static-metric-pill pill-cf">
                <span>Cash Flow</span>
                <strong>$58M</strong>
                <small>−10.8% YoY</small>
              </div>
            </div>
          </article>

          {/* Card 3 */}
          <article className="static-story-card surface">
            <div className="story-step-badge">03 · THE ANALYSIS</div>
            <h3>See the financial story</h3>
            <p>
              Five-year charts and deterministic ratio evaluations reveal trends
              and margin compression.
            </p>
            <div className="static-chart-preview">
              <div className="static-bar-track">
                {PERIODS_CHRONOLOGICAL.map((period) => {
                  const d = financialData[period]
                  return (
                    <div className="static-bar-col" key={period}>
                      <div
                        className="static-bar-fill"
                        style={{ height: `${(d.revenue / 516) * 100}%` }}
                      />
                      <span>{period}</span>
                    </div>
                  )
                })}
              </div>
              <div className="static-ratio-chip">
                <span>Net Margin</span>
                <strong>8.5%</strong>
                <small>43.86 ÷ 516</small>
              </div>
            </div>
          </article>

          {/* Card 4 */}
          <article className="static-story-card surface card-final-preview">
            <div className="story-step-badge">04 · THE PRODUCT</div>
            <h3>A complete reasoning workspace</h3>
            <p>
              Explore Northstar Manufacturing’s 5-year financials with full
              transparency.
            </p>
            <div className="static-cta-wrap">
              <span className="sample-badge">Illustrative demo · Fictional data</span>
              <button
                className="button hero-primary"
                onClick={onExplore}
                type="button"
              >
                Explore demo workspace →
              </button>
            </div>
          </article>
        </div>
      </section>
    )
  }

  // Dynamic continuous transformations for Desktop Scroll Sequence
  // Report transform: Scene 1 rotates from 12deg to 0deg, scales from 0.88 to 1.0
  const reportRotateX = (1 - p1) * 12
  const reportScale = 0.88 + p1 * 0.12
  const reportOpacity = p2 > 0.5 ? Math.max(0, 1 - (p2 - 0.5) * 2.2) : 1
  const reportBlur = p2 > 0.3 ? (p2 - 0.3) * 6 : 0

  // Floating metric pills: emerge in Scene 2, dock in Scene 3
  const metricsOpacity = Math.max(0, Math.min(1, (p - 0.18) / 0.15))
  const metricsLiftY = (1 - p2) * 40 // floats up

  // Chart reveal: reveals in Scene 3
  const chartHeightScale = Math.min(1, p3 * 1.25)
  const dashboardOpacity = Math.max(0, Math.min(1, (p - 0.42) / 0.18))
  const finalProductScale = 0.94 + p4 * 0.06

  return (
    <section
      aria-label="Cinematic product walkthrough"
      className="cinematic-scroll-container"
      id="product-story"
      ref={containerRef}
    >
      {/* Keyboard Skip Link */}
      <a className="skip-story-link" href="#capabilities">
        Skip product story to capabilities
      </a>

      {/* Screen Reader Semantic Announcement */}
      <div className="sr-only" aria-live="polite">
        Current scene: {activeHeading.title} {activeHeading.subtitle}
      </div>

      {/* Sticky Viewport Stage (Occupies available viewport below nav) */}
      <div className="cinematic-sticky-stage" aria-hidden="true">
        {/* Stage Environmental Ambient Glow */}
        <div className="stage-glow" />

        {/* Narrative Stage Header */}
        <div className="cinematic-stage-header">
          <span className="stage-scene-kicker">
            STEP {activeHeading.step} OF 04
          </span>
          <h2 className="stage-scene-title">{activeHeading.title}</h2>
          <p className="stage-scene-subtitle">{activeHeading.subtitle}</p>
        </div>

        {/* Dynamic Composition Canvas */}
        <div className="cinematic-canvas-viewport">
          {/* LAYER 1: The Source Financial Report Document */}
          <div
            className="cinematic-report-sheet surface"
            style={{
              transform: `perspective(1000px) rotateX(${reportRotateX}deg) scale(${reportScale})`,
              opacity: reportOpacity,
              filter: reportBlur > 0 ? `blur(${reportBlur}px)` : "none",
            }}
          >
            <div className="report-sheet-header">
              <div className="report-company-brand">
                <LogoMark />
                <div>
                  <strong>Northstar Manufacturing Corporation</strong>
                  <small>Form 10-K Extract · FY2024</small>
                </div>
              </div>
              <span className="report-date-tag">Reported figures</span>
            </div>

            <div className="report-statement-body">
              <div className="report-table-caption">
                Consolidated Statements of Income & Cash Flows (USD millions)
              </div>
              <table className="report-mini-table">
                <thead>
                  <tr>
                    <th>Line item</th>
                    <th className="num-col">FY2023</th>
                    <th className="num-col">FY2024</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={p >= 0.2 ? "row-highlighted row-rev" : ""}>
                    <td>Total revenue</td>
                    <td className="num-col">480.00</td>
                    <td className="num-col font-bold">516.00</td>
                  </tr>
                  <tr className={p >= 0.2 ? "row-highlighted row-inc" : ""}>
                    <td>Net income</td>
                    <td className="num-col">48.00</td>
                    <td className="num-col font-bold">43.86</td>
                  </tr>
                  <tr className={p >= 0.2 ? "row-highlighted row-cf" : ""}>
                    <td>Operating cash flow</td>
                    <td className="num-col">65.00</td>
                    <td className="num-col font-bold">58.00</td>
                  </tr>
                  <tr>
                    <td>Total assets</td>
                    <td className="num-col">600.00</td>
                    <td className="num-col">640.00</td>
                  </tr>
                  <tr>
                    <td>Current assets</td>
                    <td className="num-col">180.00</td>
                    <td className="num-col">190.00</td>
                  </tr>
                  <tr>
                    <td>Current liabilities</td>
                    <td className="num-col">100.00</td>
                    <td className="num-col">120.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {p < 0.35 && (
              <div className="report-watermark-tag">
                Fictional Northstar Statement Dataset
              </div>
            )}
          </div>

          {/* LAYER 2: Floating Extracted Metrics (Scene 2 & 3) */}
          <div
            className="cinematic-floating-metrics-layer"
            style={{
              opacity: metricsOpacity,
              transform: `translateY(${metricsLiftY}px)`,
            }}
          >
            <div
              className={`cinematic-metric-pill metric-pill-rev ${
                p >= 0.45 ? "docked-style" : ""
              }`}
            >
              <span className="pill-dot" />
              <div className="pill-text">
                <small>REVENUE</small>
                <strong>$516.00M</strong>
              </div>
              <span className="pill-tag pill-tag-positive">+7.5% YoY</span>
            </div>

            <div
              className={`cinematic-metric-pill metric-pill-inc ${
                p >= 0.45 ? "docked-style" : ""
              }`}
            >
              <span className="pill-dot dot-violet" />
              <div className="pill-text">
                <small>NET INCOME</small>
                <strong>$43.86M</strong>
              </div>
              <span className="pill-tag pill-tag-negative">−8.6% YoY</span>
            </div>

            <div
              className={`cinematic-metric-pill metric-pill-cf ${
                p >= 0.45 ? "docked-style" : ""
              }`}
            >
              <span className="pill-dot dot-cyan" />
              <div className="pill-text">
                <small>OPERATING CASH FLOW</small>
                <strong>$58.00M</strong>
              </div>
              <span className="pill-tag pill-tag-negative">−10.8% YoY</span>
            </div>
          </div>

          {/* LAYER 3: Interactive Dashboard Application Preview (Scene 3 & 4) */}
          <div
            className="cinematic-dashboard-preview surface"
            style={{
              opacity: dashboardOpacity,
              transform: `scale(${finalProductScale})`,
              pointerEvents: p >= 0.72 ? "auto" : "none",
            }}
          >
            {/* Top Bar Preview */}
            <div className="preview-top-strip">
              <div className="preview-brand-group">
                <LogoMark />
                <span>FinSight AI</span>
                <span className="preview-badge">Overview</span>
              </div>
              <div className="preview-period-pill">
                <span>Northstar</span>
                <strong>FY2024</strong>
              </div>
            </div>

            {/* Dashboard Content Grid */}
            <div className="preview-content-grid">
              {/* 5-Year Sample Revenue Chart */}
              <div className="preview-chart-box surface">
                <div className="chart-box-header">
                  <strong>Five-year revenue trajectory</strong>
                  <span className="chart-unit">USD millions</span>
                </div>
                <div className="cinematic-mini-chart">
                  {PERIODS_CHRONOLOGICAL.map((period) => {
                    const d = financialData[period]
                    return (
                      <div className="chart-col" key={period}>
                        <span className="chart-bar-val">${d.revenue}M</span>
                        <div className="chart-bar-slot">
                          <div
                            className="chart-bar-fill"
                            style={{
                              height: `${(d.revenue / 516) * 100 * chartHeightScale}%`,
                            }}
                          />
                        </div>
                        <span className="chart-bar-lbl">{period}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Verified Financial Ratios Panel */}
              <div className="preview-ratios-box surface">
                <div className="ratios-box-header">
                  <strong>Calculated ratios</strong>
                  <span className="formula-tag">Deterministic formulas</span>
                </div>
                <div className="preview-ratio-row">
                  <div>
                    <span className="r-label">Net profit margin</span>
                    <small>43.86 ÷ 516.00</small>
                  </div>
                  <strong className="r-val tabular-nums">8.50%</strong>
                </div>
                <div className="preview-ratio-row">
                  <div>
                    <span className="r-label">Current ratio</span>
                    <small>190.00 ÷ 120.00</small>
                  </div>
                  <strong className="r-val tabular-nums">1.58×</strong>
                </div>
                <div className="preview-ratio-row">
                  <div>
                    <span className="r-label">Return on assets (ROA)</span>
                    <small>43.86 ÷ 620.00 avg</small>
                  </div>
                  <strong className="r-val tabular-nums">7.07%</strong>
                </div>
              </div>
            </div>

            {/* Scene 4: Working Call to Action Footer */}
            <div
              className="preview-footer-action-bar"
              style={{
                opacity: p >= 0.72 ? 1 : 0.35,
                transition: "opacity 200ms ease",
              }}
            >
              <div className="preview-footer-meta">
                <span className="sample-disclosure-pill">
                  Illustrative demo · Fictional data
                </span>
                <span className="verified-notice">
                  Calculated from reported Northstar figures
                </span>
              </div>
              <button
                className="button hero-primary preview-cta-btn"
                onClick={onExplore}
                tabIndex={p >= 0.7 ? 0 : -1}
                type="button"
              >
                Explore demo workspace →
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Progress Indicator Bar at Bottom of Stage */}
        <div className="stage-progress-bar-wrap">
          <div
            className="stage-progress-bar-fill"
            style={{ width: `${Math.round(p * 100)}%` }}
          />
        </div>
      </div>
    </section>
  )
}
