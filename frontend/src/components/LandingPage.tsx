import { FinSightMark } from "./FinSightLogo"
import { COMPANY_NAME, SAMPLE_NOTICE } from "../data/financialData"

interface LandingPageProps {
  onExploreDemo: () => void
}

export default function LandingPage({ onExploreDemo }: LandingPageProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="landing-page-wrap">
      {/* Floating Glass Navigation */}
      <header className="landing-nav-wrap">
        <nav aria-label="Landing page navigation" className="landing-nav-bar surface">
          <div className="landing-brand">
            <FinSightMark size={32} />
            <div className="landing-brand-text">
              <span className="landing-brand-name">FinSight AI</span>
              <span className="landing-brand-badge">Glass Ledger</span>
            </div>
          </div>

          <div className="landing-nav-links">
            <button
              className="button landing-nav-link"
              onClick={() => scrollToSection("workflow")}
              type="button"
            >
              How it works
            </button>
            <button
              className="button landing-nav-link"
              onClick={() => scrollToSection("capabilities")}
              type="button"
            >
              Capabilities
            </button>
            <button
              className="button landing-nav-link"
              onClick={() => scrollToSection("scope")}
              type="button"
            >
              Prototype scope
            </button>
          </div>

          <div className="landing-nav-actions">
            <button
              className="button landing-cta-btn primary-action-btn"
              onClick={onExploreDemo}
              type="button"
            >
              <span>Explore demo</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="landing-hero-section">
        <div className="landing-hero-container">
          <div className="landing-badge-pill">
            <span className="pill-dot" />
            <span>Interactive financial intelligence prototype</span>
          </div>

          <h1 className="landing-hero-title serif-display">
            Read the numbers.<br />
            See the reasoning.
          </h1>

          <p className="landing-hero-subtitle">
            FinSight combines reported figures, deterministic ratios, transparent risk screening rules,
            and document-grounded explanations into a dimensional financial workspace.
          </p>

          <aside className="landing-honest-pill" aria-label="Prototype parameters">
            <span>Fictional Northstar Manufacturing dataset</span>
            <span aria-hidden="true">·</span>
            <span>No account required</span>
            <span aria-hidden="true">·</span>
            <span>Files held in local browser memory only</span>
          </aside>

          <div className="landing-hero-actions">
            <button
              className="button landing-hero-primary-btn primary-action-btn"
              onClick={onExploreDemo}
              type="button"
            >
              <span>Explore demo</span>
              <svg aria-hidden="true" className="icon" fill="none" height={16} viewBox="0 0 24 24" width={16}>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            <button
              className="button landing-hero-secondary-btn"
              onClick={() => scrollToSection("workflow")}
              type="button"
            >
              <span>How it works</span>
              <svg aria-hidden="true" className="icon" fill="none" height={16} viewBox="0 0 24 24" width={16}>
                <path d="m19 9-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Product Preview Container */}
        <div className="landing-preview-wrap entrance entrance-2">
          <div className="landing-preview-card surface">
            <div className="preview-top-bar">
              <div className="preview-indicator-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className="preview-context-label">
                <span>{COMPANY_NAME}</span>
                <span className="dot-sep">·</span>
                <strong>FY2024 Executive Overview</strong>
                <span className="dot-sep">·</span>
                <span className="preview-tag">Glass Ledger Workspace</span>
              </div>
              <div className="preview-right-actions">
                <span className="sample-badge">Sample dataset</span>
              </div>
            </div>

            {/* Simulated Workspace Metrics */}
            <div className="preview-grid">
              <div className="preview-tiles-row">
                {/* Revenue */}
                <div className="preview-tile tile-revenue">
                  <div className="floating-preview-tag">Reported figure</div>
                  <span className="tile-label">Revenue</span>
                  <div className="tile-value tabular-nums">
                    <span className="tile-currency">$</span>516.0<span className="tile-unit">M</span>
                  </div>
                  <div className="comparison positive">
                    <span>+7.5% vs FY2023</span>
                  </div>
                </div>

                {/* Net Income */}
                <div className="preview-tile tile-profit">
                  <div className="floating-preview-tag">Reported figure</div>
                  <span className="tile-label">Net income</span>
                  <div className="tile-value tabular-nums">
                    <span className="tile-currency">$</span>43.86<span className="tile-unit">M</span>
                  </div>
                  <div className="comparison negative">
                    <span>−8.6% YoY · 8.5% margin</span>
                  </div>
                </div>

                {/* Total Assets */}
                <div className="preview-tile tile-assets">
                  <div className="floating-preview-tag">Reported figure</div>
                  <span className="tile-label">Total assets</span>
                  <div className="tile-value tabular-nums">
                    <span className="tile-currency">$</span>640.0<span className="tile-unit">M</span>
                  </div>
                  <div className="comparison neutral">
                    <span>Equity: $275.0M</span>
                  </div>
                </div>

                {/* Operating Cash Flow */}
                <div className="preview-tile tile-cashflow">
                  <div className="floating-preview-tag">Reported figure</div>
                  <span className="tile-label">Operating cash flow</span>
                  <div className="tile-value tabular-nums">
                    <span className="tile-currency">$</span>58.0<span className="tile-unit">M</span>
                  </div>
                  <div className="comparison negative">
                    <span>−10.8% vs FY2023</span>
                  </div>
                </div>
              </div>

              {/* Lower Preview Row: 5-Year Revenue Trend & Risk Summary */}
              <div className="preview-lower-split">
                <div className="preview-chart-box surface">
                  <div className="preview-chart-header">
                    <div>
                      <span className="preview-box-title">Five-year revenue trajectory ($M)</span>
                      <p className="preview-box-sub">Chronological trend FY2020 through FY2024</p>
                    </div>
                    <span className="floating-preview-tag alt">Deterministic ratio</span>
                  </div>

                  <div className="preview-mini-chart" aria-label="Five-year revenue chart">
                    <div className="mini-chart-bar-group">
                      <div className="mini-bar-col">
                        <div className="mini-bar" style={{ height: "68%" }} />
                        <span className="mini-bar-val">$350M</span>
                        <span className="mini-bar-lbl">FY20</span>
                      </div>
                      <div className="mini-bar-col">
                        <div className="mini-bar" style={{ height: "76%" }} />
                        <span className="mini-bar-val">$390M</span>
                        <span className="mini-bar-lbl">FY21</span>
                      </div>
                      <div className="mini-bar-col">
                        <div className="mini-bar" style={{ height: "85%" }} />
                        <span className="mini-bar-val">$440M</span>
                        <span className="mini-bar-lbl">FY22</span>
                      </div>
                      <div className="mini-bar-col">
                        <div className="mini-bar" style={{ height: "93%" }} />
                        <span className="mini-bar-val">$480M</span>
                        <span className="mini-bar-lbl">FY23</span>
                      </div>
                      <div className="mini-bar-col active-col">
                        <div className="mini-bar active-bar" style={{ height: "100%" }} />
                        <span className="mini-bar-val active-val">$516M</span>
                        <span className="mini-bar-lbl active-lbl">FY24</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="preview-indicators-box surface">
                  <div className="preview-box-header">
                    <span className="preview-box-title">Automated screening status</span>
                    <span className="floating-preview-tag">Rule-based checks</span>
                  </div>

                  <div className="preview-rule-strip">
                    <div className="preview-rule-count-row">
                      <span className="count-number">4</span>
                      <div className="count-text">
                        <strong>Triggered Watch Flags</strong>
                        <span>Margin decline, cash flow dip, current ratio shift, debt expansion</span>
                      </div>
                    </div>

                    <div className="preview-ratio-mini-list">
                      <div className="mini-ratio-row">
                        <span>Current ratio:</span>
                        <strong className="tabular-nums">1.58× (vs 1.80× FY23)</strong>
                      </div>
                      <div className="mini-ratio-row">
                        <span>Debt-to-equity:</span>
                        <strong className="tabular-nums">0.80× ($220M debt)</strong>
                      </div>
                      <div className="mini-ratio-row">
                        <span>Return on Assets:</span>
                        <strong className="tabular-nums">7.07% (vs 8.35% FY23)</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intended Workflow Section */}
      <section className="landing-section-block" id="workflow">
        <div className="section-inner-container">
          <div className="section-pre-title">Architecture & Process</div>
          <h2 className="section-main-title serif-display">Three-step financial intelligence workflow</h2>
          <p className="section-main-subtitle">
            How Glass Ledger combines reported financial statements with mathematical verification and document grounding.
          </p>

          <div className="workflow-steps-grid">
            <div className="workflow-step-card surface">
              <div className="step-num-badge">01</div>
              <h3 className="step-title">Select a report</h3>
              <p className="step-desc">
                Choose or drag-and-drop a local financial report PDF. In this demonstration, files are validated
                in local browser memory (format, zero-byte checks, 20 MiB ceiling) without server upload.
              </p>
              <div className="step-highlight-tag">Local browser security · Zero cloud leakage</div>
            </div>

            <div className="workflow-step-card surface">
              <div className="step-num-badge">02</div>
              <h3 className="step-title">Inspect the financials</h3>
              <p className="step-desc">
                Explore calculated ratios (ROA, ROE, net margin, current ratio, debt-to-equity) across five consecutive
                fiscal years with verified balance sheet reconciliations (Assets = Liabilities + Equity).
              </p>
              <div className="step-highlight-tag">Deterministic math · Strict zero-denominator guards</div>
            </div>

            <div className="workflow-step-card surface">
              <div className="step-num-badge">03</div>
              <h3 className="step-title">Question with context</h3>
              <p className="step-desc">
                Engage the Demo Assistant to explain metric movements, margin changes, and rule triggers.
                Answers are grounded strictly in reported figures without fabricated citations.
              </p>
              <div className="step-highlight-tag">Traceable reasoning · Grounded explanations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Feature Sections */}
      <section className="landing-section-block" id="capabilities">
        <div className="section-inner-container">
          <div className="section-pre-title">Core Capabilities</div>
          <h2 className="section-main-title serif-display">Precision financial analysis without black boxes</h2>
          <p className="section-main-subtitle">
            Designed for financial analysts, auditors, and executive decision-makers who demand verifiable calculations.
          </p>

          <div className="capabilities-editorial-grid">
            {/* Capability 1 */}
            <article className="capability-card surface">
              <div className="capability-badge badge-profitability">Analytical Workspace</div>
              <h3 className="capability-title">Standardized multi-period ratios</h3>
              <p className="capability-text">
                Evaluate profitability, liquidity, and leverage across chronological and paired-comparison views.
                Opening-balance dependencies (such as average total assets for ROA) are strictly checked so baseline
                periods remain explicitly unavailable rather than guessed.
              </p>
              <ul className="capability-list">
                <li>Return on Assets (ROA) and Return on Equity (ROE)</li>
                <li>Net profit margin and margin changes in basis points</li>
                <li>Working capital liquidity & interest-bearing debt to equity</li>
              </ul>
            </article>

            {/* Capability 2 */}
            <article className="capability-card surface">
              <div className="capability-badge badge-growth">Screening Engine</div>
              <h3 className="capability-title">Transparent deterministic risk rules</h3>
              <p className="capability-text">
                Seven automated screening checks evaluate operational cash flows, margin pressures, debt expansion,
                and working capital ratios. Rules assign clear Watch or Elevated severities based on explicit mathematical conditions.
              </p>
              <ul className="capability-list">
                <li>No arbitrary "credit scores" or black-box rankings</li>
                <li>Untriggered rules are labeled as not triggered, never falsely labeled "safe"</li>
                <li>Prior-year dependencies clearly disclosed for initial reporting periods</li>
              </ul>
            </article>

            {/* Capability 3 */}
            <article className="capability-card surface">
              <div className="capability-badge badge-cashflow">Grounding & Traceability</div>
              <h3 className="capability-title">Evidence-based analytical assistant</h3>
              <p className="capability-text">
                Ask targeted questions regarding financial trajectory, margin compression, and debt load.
                The assistant calculates exact percentages, explains spreads between cash flow and net income,
                and maintains complete fidelity to disclosed line items.
              </p>
              <ul className="capability-list">
                <li>Immediate calculation transparency on every response</li>
                <li>Clear disclosure that custom PDF citations require backend integration</li>
                <li>Session-only conversation state with zero remote logging</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* Traceability Section */}
      <section className="landing-section-block">
        <div className="section-inner-container">
          <div className="section-pre-title">Auditability & Rigor</div>
          <h2 className="section-main-title serif-display">The three tiers of financial traceability</h2>
          <p className="section-main-subtitle">
            Every indicator in FinSight can be traced back to its underlying accounting origin.
          </p>

          <div className="traceability-tiers-grid">
            <div className="tier-card surface">
              <div className="tier-header">
                <span className="tier-num">Tier 1</span>
                <span className="tier-tag">Reported figures</span>
              </div>
              <p className="tier-desc">
                Primary data extracted directly from audited statements: Revenue, Operating Cash Flow, Current Liabilities,
                and Interest-Bearing Debt.
              </p>
              <div className="tier-example">
                <code>FY2024 Revenue: $516.0M · Cash Flow: $58.0M</code>
              </div>
            </div>

            <div className="tier-card surface">
              <div className="tier-header">
                <span className="tier-num">Tier 2</span>
                <span className="tier-tag">Calculated ratios</span>
              </div>
              <p className="tier-desc">
                Deterministic mathematical formulas executed with full floating-point precision and rounded only for display presentation.
              </p>
              <div className="tier-example">
                <code>Current ratio = $190M / $120M = 1.5833× → 1.58×</code>
              </div>
            </div>

            <div className="tier-card surface">
              <div className="tier-header">
                <span className="tier-num">Tier 3</span>
                <span className="tier-tag">Supporting sources</span>
              </div>
              <p className="tier-desc">
                Transparent disclosure notes, methodology rules, and explicit unavailability notices when historical inputs are missing.
              </p>
              <div className="tier-example">
                <code>Methodology: ROA opening balance FY2019 unavailable</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Honest Prototype Scope Section */}
      <section className="landing-section-block" id="scope">
        <div className="section-inner-container">
          <div className="section-pre-title">Transparent Roadmap</div>
          <h2 className="section-main-title serif-display">Prototype scope & production boundaries</h2>
          <p className="section-main-subtitle">
            An honest breakdown of what is operational in this client demonstration versus what requires server infrastructure.
          </p>

          <div className="scope-comparison-grid">
            {/* Operational Now */}
            <div className="scope-column scope-available surface">
              <div className="scope-col-header">
                <span className="scope-col-status status-available">Operational in this prototype</span>
                <h3>Available now (Frontend client)</h3>
              </div>
              <ul className="scope-items-list">
                <li>
                  <strong>Five-year Northstar dataset:</strong> Full FY2020–FY2024 income statements, balance sheets, and cash flow figures.
                </li>
                <li>
                  <strong>Deterministic calculations:</strong> ROA, ROE, net profit margin, current ratio, debt-to-equity, and percentage changes.
                </li>
                <li>
                  <strong>Seven risk rules:</strong> Automated evaluation engine with Watch/Elevated severity assignments and period filters.
                </li>
                <li>
                  <strong>Local PDF workflow:</strong> Drag-and-drop, file picker, empty-file validation, size limits (20 MiB), and simulated processing.
                </li>
                <li>
                  <strong>Demo assistant:</strong> Grounded interactive Q&A answering financial and risk queries deterministically.
                </li>
                <li>
                  <strong>Visual & navigation controls:</strong> Floating glass navigation, sidebar vs topbar preference, light/dark themes, and Manrope typography.
                </li>
              </ul>
            </div>

            {/* Requires Backend */}
            <div className="scope-column scope-backend surface">
              <div className="scope-col-header">
                <span className="scope-col-status status-backend">Future integration scope</span>
                <h3>Requires backend integration</h3>
              </div>
              <ul className="scope-items-list">
                <li>
                  <strong>Production PDF parsing:</strong> Server-side OCR, structured table extraction, and multi-page document layout analysis.
                </li>
                <li>
                  <strong>Cloud storage:</strong> Secure encrypted document storage, retention management, and multi-session file persistence.
                </li>
                <li>
                  <strong>Verified source citations:</strong> Direct bounding-box PDF page links connected to generative language model responses.
                </li>
                <li>
                  <strong>Authentication & security:</strong> Role-based access control, enterprise SSO, organization boundaries, and audit logging.
                </li>
                <li>
                  <strong>Custom company ingestion:</strong> Processing multi-company SEC 10-K filings and custom private corporate financials.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final Focused CTA */}
      <section className="landing-final-cta-section">
        <div className="final-cta-box surface">
          <div className="final-cta-glow" aria-hidden="true" />
          <h2 className="final-cta-title serif-display">Experience the Glass Ledger workspace</h2>
          <p className="final-cta-text">
            Inspect the five-year Northstar Manufacturing dataset, test local document validation,
            explore deterministic financial ratios, and evaluate automated risk flags.
          </p>
          <div className="final-cta-actions">
            <button
              className="button final-explore-btn primary-action-btn"
              onClick={onExploreDemo}
              type="button"
            >
              <span>Explore demo workspace</span>
              <svg aria-hidden="true" className="icon" fill="none" height={16} viewBox="0 0 24 24" width={16}>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Useful Landing Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-container">
          <div className="footer-top-row">
            <div className="footer-brand-col">
              <div className="landing-brand">
                <FinSightMark size={28} />
                <div className="landing-brand-text">
                  <span className="landing-brand-name">FinSight AI</span>
                  <span className="landing-brand-badge">Glass Ledger</span>
                </div>
              </div>
              <p className="footer-brand-desc">
                Financial document intelligence prototype combining reported financial statements,
                deterministic ratios, automated risk screening, and grounded query assistance.
              </p>
            </div>

            <div className="footer-links-col">
              <h4>Navigation</h4>
              <ul>
                <li><button className="footer-link-btn" onClick={() => scrollToSection("workflow")}>How it works</button></li>
                <li><button className="footer-link-btn" onClick={() => scrollToSection("capabilities")}>Capabilities</button></li>
                <li><button className="footer-link-btn" onClick={() => scrollToSection("scope")}>Prototype scope</button></li>
                <li><button className="footer-link-btn" onClick={onExploreDemo}>Explore demo</button></li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h4>Workspace</h4>
              <ul>
                <li><button className="footer-link-btn" onClick={onExploreDemo}>Overview dashboard</button></li>
                <li><button className="footer-link-btn" onClick={onExploreDemo}>Financial analysis</button></li>
                <li><button className="footer-link-btn" onClick={onExploreDemo}>Risk indicators</button></li>
                <li><button className="footer-link-btn" onClick={onExploreDemo}>Local documents</button></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom-row">
            <p className="footer-copy">© 2026 FinSight AI. Conceptual financial intelligence prototype.</p>
            <p className="footer-sample-disclosure">{SAMPLE_NOTICE}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
