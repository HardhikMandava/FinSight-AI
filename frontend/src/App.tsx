import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import DocumentsPage from "./components/DocumentsPage"

type Period = "FY2024" | "FY2023"
type Metric = "revenue" | "income" | "cashFlow"
type Appearance = "dark" | "light" | "system"
type ActivePage = "overview" | "documents"
type IconName = "overview" | "document" | "analysis" | "assistant" | "risk" | "settings" | "menu" | "close" | "arrowUp" | "arrowDown" | "minus" | "info" | "sun" | "moon" | "system" | "check"

const financialData = {
  FY2023: {
    revenue: 480,
    income: 48,
    assets: 600,
    cashFlow: 65,
    currentAssets: 180,
    currentLiabilities: 100,
    margin: 10,
  },
  FY2024: {
    revenue: 516,
    income: 43.86,
    assets: 640,
    cashFlow: 58,
    currentAssets: 190,
    currentLiabilities: 120,
    margin: 8.5,
  },
}

const metricOptions: { key: Metric; label: string }[] = [
  { key: "revenue", label: "Revenue" },
  { key: "income", label: "Net income" },
  { key: "cashFlow", label: "Cash flow" },
]

const navItems: { label: string; icon: IconName; page?: ActivePage }[] = [
  { label: "Overview", icon: "overview", page: "overview" },
  { label: "Documents", icon: "document", page: "documents" },
  { label: "Analysis", icon: "analysis" },
  { label: "Assistant", icon: "assistant" },
  { label: "Risks", icon: "risk" },
]

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    overview: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </>
    ),
    document: (
      <>
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" />
        <path d="M14 3v6h6M8 13h8M8 17h5" />
      </>
    ),
    analysis: (
      <>
        <path d="M4 20V11M10 20V5M16 20v-7M22 20H2" />
        <path d="m4 8 5-4 6 5 5-4" />
      </>
    ),
    assistant: (
      <path d="m12 3-1.2 4a5.3 5.3 0 0 1-3.6 3.6L3 12l4.2 1.4a5.3 5.3 0 0 1 3.6 3.6l1.2 4 1.2-4a5.3 5.3 0 0 1 3.6-3.6L21 12l-4.2-1.4A5.3 5.3 0 0 1 13.2 7Z" />
    ),
    risk: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="M12 8v5M12 17h.01" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V21h-4v-.08a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3v-4h.08a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3h4v.08a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.55 1H21v4h-.08a1.7 1.7 0 0 0-1.52 1Z" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    arrowUp: <path d="m18 15-6-6-6 6" />,
    arrowDown: <path d="m6 9 6 6 6-6" />,
    minus: <path d="M5 12h14" />,
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    ),
    moon: <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />,
    system: (
      <>
        <rect x="3" y="4" width="18" height="13" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
  }

  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      {paths[name]}
    </svg>
  )
}

const Button =
  forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    function Button({ children, className = "", ...props }, ref) {
      return (
        <button
          className={`button ${className}`}
          ref={ref}
          type="button"
          {...props}
        >
          {children}
        </button>
      )
    },
  )

function Surface({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return <section className={`surface ${className}`}>{children}</section>
}

function Brand() {
  return (
    <div className="brand">
      <div className="brand-mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <span>FinSight AI</span>
    </div>
  )
}

function DesktopNavigation({
  activePage,
  onNavigate,
  onSettings,
}: {
  activePage: ActivePage
  onNavigate: (page: ActivePage) => void
  onSettings: (trigger: HTMLButtonElement) => void
}) {
  return (
    <nav aria-label="Primary navigation" className="floating-nav glass-strong">
      <Brand />
      <div className="nav-links">
        {navItems.map((item) => {
          const isActive = item.page !== undefined && item.page === activePage
          const isEnabled = item.page !== undefined
          return (
            <Button
              aria-current={isActive ? "page" : undefined}
              aria-describedby={
                !isEnabled ? "coming-next-description" : undefined
              }
              aria-disabled={!isEnabled}
              className={`nav-link ${isActive ? "active" : ""} ${!isEnabled ? "unavailable" : ""}`}
              data-tooltip={!isEnabled ? "Coming next" : undefined}
              key={item.label}
              onClick={
                isEnabled && !isActive
                  ? () => onNavigate(item.page!)
                  : undefined
              }
            >
              {item.label}
            </Button>
          )
        })}
      </div>
      <Button
        className="settings-button"
        onClick={(event) => onSettings(event.currentTarget)}
      >
        <Icon name="settings" size={15} />
        Settings
      </Button>
      <span className="sr-only" id="coming-next-description">
        Coming next. This destination is not available in the prototype.
      </span>
    </nav>
  )
}

function MobileNavigation({
  activePage,
  menuOpen,
  onMenu,
  onNavigate,
  onSettings,
}: {
  activePage: ActivePage
  menuOpen: boolean
  onMenu: () => void
  onNavigate: (page: ActivePage) => void
  onSettings: (trigger: HTMLButtonElement) => void
}) {
  return (
    <div className="mobile-nav-wrap">
      <div className="mobile-nav glass-strong">
        <Brand />
        <Button
          aria-expanded={menuOpen}
          className="menu-button"
          onClick={onMenu}
        >
          <Icon name={menuOpen ? "close" : "menu"} size={17} />
          Menu
        </Button>
      </div>
      {menuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="mobile-menu glass-strong"
        >
          {navItems.map((item) => {
            const isActive = item.page !== undefined && item.page === activePage
            const isEnabled = item.page !== undefined
            return (
              <Button
                aria-current={isActive ? "page" : undefined}
                aria-disabled={!isEnabled}
                className={`mobile-link ${isActive ? "active" : ""}`}
                key={item.label}
                onClick={
                  isEnabled && !isActive
                    ? () => {
                        onNavigate(item.page!)
                        onMenu()
                      }
                    : undefined
                }
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
                {!isEnabled && <small>Coming next</small>}
              </Button>
            )
          })}
          <Button
            className="mobile-link mobile-settings"
            onClick={(event) => onSettings(event.currentTarget)}
          >
            <Icon name="settings" size={16} />
            <span>Settings</span>
          </Button>
        </nav>
      )}
    </div>
  )
}

function SlidingSelector<T extends string>({
  ariaLabel,
  className,
  onChange,
  options,
  value,
}: {
  ariaLabel: string
  className: string
  onChange: (value: T) => void
  options: { key: T; label: string }[]
  value: T
}) {
  const activeIndex = options.findIndex((option) => option.key === value)
  return (
    <div
      aria-label={ariaLabel}
      className={`segmented ${className}`}
      role="group"
      style={{ "--active-index": activeIndex } as CSSProperties}
    >
      <span className="segment-slider" aria-hidden="true" />
      {options.map((option) => (
        <Button
          aria-pressed={value === option.key}
          className="segment-button"
          key={option.key}
          onClick={() => onChange(option.key)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}

function Comparison({
  change,
  neutral,
}: {
  change?: number
  neutral?: boolean
}) {
  if (change === undefined) {
    return (
      <div className="comparison muted">
        <Icon name="minus" size={13} />
        Prior year unavailable
      </div>
    )
  }
  const positive = change >= 0
  return (
    <div
      className={`comparison ${
        neutral ? "neutral" : positive ? "positive" : "negative"
      }`}
    >
      <Icon name={positive ? "arrowUp" : "arrowDown"} size={13} />
      <span>
        {positive ? "+" : "−"}
        {Math.abs(change).toFixed(1)}% vs FY2023
      </span>
    </div>
  )
}

function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    if (reducedMotion) {
      setDisplayValue(value)
      return
    }

    const duration = 620
    let animationFrame = 0
    let startTime: number | null = null

    const animate = (time: number) => {
      if (startTime === null) startTime = time
      const progress = Math.min((time - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(value * eased)
      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(animate)
      } else {
        setDisplayValue(value)
      }
    }

    setDisplayValue(0)
    animationFrame = window.requestAnimationFrame(animate)
    return () => window.cancelAnimationFrame(animationFrame)
  }, [value])

  const hasDecimals = !Number.isInteger(value)
  return (
    <span
      aria-label={value.toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })}
      className="animated-number"
    >
      {displayValue.toLocaleString("en-US", {
        minimumFractionDigits: hasDecimals ? 2 : 0,
        maximumFractionDigits: hasDecimals ? 2 : 0,
      })}
    </span>
  )
}

function MetricCell({
  animateValue = false,
  change,
  label,
  neutral,
  value,
}: {
  animateValue?: boolean
  change?: number
  label: string
  neutral?: boolean
  value: number
}) {
  return (
    <div className="metric-cell">
      <div className="metric-label">{label}</div>
      <div
        className={`metric-value ${animateValue ? "revenue-value" : ""}`}
        key={animateValue ? value : undefined}
      >
        <span>$</span>
        <AnimatedNumber value={value} />
        <small>M</small>
      </div>
      <Comparison change={change} neutral={neutral} />
    </div>
  )
}

function InfoTip({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <span className="info-tip">
      <Button
        aria-expanded={open}
        aria-label={`About ${label}`}
        className="info-button"
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((value) => !value)}
        onFocus={() => setOpen(true)}
      >
        <Icon name="info" size={13} />
      </Button>
      {open && (
        <span className="info-popover" role="tooltip">
          {children}
        </span>
      )}
    </span>
  )
}

type ChartTooltip = {
  left: number
  top: number
  title: string
  value: string
} | null

function PerformanceChart({
  metric,
  onMetric,
}: {
  metric: Metric
  onMetric: (metric: Metric) => void
}) {
  const [tooltip, setTooltip] = useState<ChartTooltip>(null)
  const values = [
    { year: "FY2023", value: financialData.FY2023[metric] },
    { year: "FY2024", value: financialData.FY2024[metric] },
  ]
  const selectedLabel =
    metricOptions.find((item) => item.key === metric)?.label ?? ""
  const chartMax =
    Math.ceil(Math.max(...values.map((item) => item.value)) / 100) * 100 || 100
  const baseline = 156
  const chartHeight = 112
  const xPositions = [190, 390]
  const ticks = [0, chartMax / 2, chartMax]

  const showTooltip = (item: typeof values[number], x: number, y: number) => {
    setTooltip({
      left: (x / 560) * 100,
      top: (y / 190) * 100,
      title: `${item.year} · ${selectedLabel}`,
      value: `$${item.value.toLocaleString("en-US", { maximumFractionDigits: 2 })}M`,
    })
  }

  return (
    <Surface className="performance-panel">
      <div className="panel-toolbar">
        <div>
          <h2>Performance</h2>
          <p>USD millions · zero baseline</p>
        </div>
        <SlidingSelector
          ariaLabel="Performance metric"
          className="metric-selector"
          onChange={onMetric}
          options={metricOptions}
          value={metric}
        />
      </div>
      <div className="performance-chart">
        <svg
          aria-label={`${selectedLabel}: FY2023 ${values[0].value} million dollars and FY2024 ${values[1].value} million dollars`}
          className="chart-svg"
          role="img"
          viewBox="0 0 560 190"
        >
          {ticks.map((tick) => {
            const y = baseline - (tick / chartMax) * chartHeight
            return (
              <g key={tick}>
                <line className="grid-line" x1="62" x2="520" y1={y} y2={y} />
                <text className="axis-text" textAnchor="end" x="50" y={y + 4}>
                  {tick}
                </text>
              </g>
            )
          })}
          {values.map((item, index) => {
            const height = (item.value / chartMax) * chartHeight
            const x = xPositions[index]
            const y = baseline - height
            return (
              <g
                className={`chart-series series-${index + 1}`}
                key={`${metric}-${item.year}`}
              >
                <rect
                  aria-label={`${item.year} ${selectedLabel}: ${item.value} million dollars`}
                  className={`performance-bar bar-${index + 1}`}
                  height={height}
                  onBlur={() => setTooltip(null)}
                  onFocus={() => showTooltip(item, x, y)}
                  onMouseEnter={() => showTooltip(item, x, y)}
                  onMouseLeave={() => setTooltip(null)}
                  rx="12"
                  tabIndex={0}
                  width="82"
                  x={x - 41}
                  y={y}
                />
                <text className="bar-value" textAnchor="middle" x={x} y={y - 8}>
                  $
                  {item.value.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}
                  M
                </text>
                <text className="year-text" textAnchor="middle" x={x} y="180">
                  {item.year}
                </text>
              </g>
            )
          })}
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
    </Surface>
  )
}

function WhatChanged({ period }: { period: Period }) {
  const current = financialData[period]
  const currentRatio = current.currentAssets / current.currentLiabilities
  const isCurrent = period === "FY2024"

  return (
    <Surface className="insights-panel">
      <div className="insights-heading">
        <h2>What changed</h2>
        <span>{period}</span>
      </div>
      <div className="insight-lines">
        {isCurrent ? (
          <>
            <p>
              <strong className="positive">+7.5%</strong> Revenue increased.
            </p>
            <p>
              <strong className="negative">−1.5 pp</strong> Net profit margin
              fell.
            </p>
            <p>
              <strong className="negative">−10.8%</strong> Operating cash flow
              decreased.
            </p>
          </>
        ) : (
          <p className="prior-note">
            <Icon name="minus" size={14} />
            Prior-year comparisons are unavailable for FY2023.
          </p>
        )}
      </div>
      <div className="ratio-row">
        <div>
          <span>
            Current ratio
            <InfoTip label="current ratio">
              Current assets divided by current liabilities.
            </InfoTip>
          </span>
          <strong>{currentRatio.toFixed(2)}×</strong>
        </div>
        <div>
          <span>Leverage</span>
          <strong className="unavailable">Unavailable</strong>
          <small>Debt data not supplied</small>
        </div>
      </div>
      <div className="margin-compact">
        <div className="margin-copy">
          <span>Net profit margin</span>
          <small>10.0% → 8.5%</small>
        </div>
        <div className="margin-bars" aria-label="Net profit margin comparison">
          <span>
            <i className="margin-prior" />
            FY23
          </span>
          <span>
            <i className="margin-current" />
            FY24
          </span>
        </div>
      </div>
    </Surface>
  )
}

function Documents() {
  const rows = [
    ["Northstar_Annual_Report_FY2024.pdf", "FY2024"],
    ["Northstar_Annual_Report_FY2023.pdf", "FY2023"],
  ]
  return (
    <Surface className="documents-panel">
      <div className="documents-header">
        <h2>Sample documents</h2>
        <p>Illustrative records only; no PDF files are attached.</p>
      </div>
      <div className="documents-list">
        {rows.map(([document, year]) => (
          <div className="document-row" key={document}>
            <span className="document-name">{document}</span>
            <span className="document-year">{year}</span>
            <span className="status">Sample record</span>
          </div>
        ))}
      </div>
    </Surface>
  )
}

function SettingsPanel({
  appearance,
  onAppearance,
  onClose,
}: {
  appearance: Appearance
  onAppearance: (appearance: Appearance) => void
  onClose: () => void
}) {
  const panelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    const focusable = panel.querySelectorAll<HTMLElement>(
      "button:not([disabled])",
    )
    focusable[0]?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== "Tab" || focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    panel.addEventListener("keydown", handleKeyDown)
    return () => panel.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  const options: {
    key: Appearance
    label: string
    icon: IconName
    detail: string
  }[] = [
    { key: "dark", label: "Dark", icon: "moon", detail: "Graphite workspace" },
    { key: "light", label: "Light", icon: "sun", detail: "Silver and white" },
    {
      key: "system",
      label: "System",
      icon: "system",
      detail: "Match this device",
    },
  ]

  return (
    <div className="settings-layer">
      <div className="settings-backdrop" onClick={onClose} />
      <aside
        aria-labelledby="settings-title"
        aria-modal="true"
        className="settings-panel glass-strong"
        ref={panelRef}
        role="dialog"
      >
        <div className="settings-header">
          <div>
            <span>Preferences</span>
            <h2 id="settings-title">Settings</h2>
          </div>
          <Button
            aria-label="Close settings"
            className="close-button"
            onClick={onClose}
          >
            <Icon name="close" />
          </Button>
        </div>
        <div className="settings-section">
          <h3>Appearance</h3>
          <p>Choose the interface appearance for this browser.</p>
          <div
            aria-label="Appearance preference"
            className="appearance-options"
            role="radiogroup"
          >
            {options.map((option) => (
              <Button
                aria-checked={appearance === option.key}
                className={`appearance-option ${
                  appearance === option.key ? "selected" : ""
                }`}
                key={option.key}
                onClick={() => onAppearance(option.key)}
                role="radio"
              >
                <span className="appearance-icon">
                  <Icon name={option.icon} />
                </span>
                <span className="appearance-copy">
                  <strong>{option.label}</strong>
                  <small>{option.detail}</small>
                </span>
                <span className="radio-mark">
                  {appearance === option.key && <Icon name="check" size={13} />}
                </span>
              </Button>
            ))}
          </div>
        </div>
        <p className="settings-footnote">Saved locally on this device.</p>
      </aside>
    </div>
  )
}

const APPEARANCE_KEY = "finsight-appearance"
const REDESIGN_KEY = "finsight-smoked-glass-v1"

function getInitialAppearance(): Appearance {
  try {
    if (!window.localStorage.getItem(REDESIGN_KEY)) {
      window.localStorage.setItem(REDESIGN_KEY, "applied")
      window.localStorage.setItem(APPEARANCE_KEY, "dark")
      return "dark"
    }
    const stored = window.localStorage.getItem(APPEARANCE_KEY)
    if (stored === "dark" || stored === "light" || stored === "system")
      return stored
  } catch {
    // Storage can be unavailable in privacy-restricted environments.
  }
  return "dark"
}

export default function App() {
  const [period, setPeriod] = useState<Period>("FY2024")
  const [metric, setMetric] = useState<Metric>("revenue")
  const [appearance, setAppearance] = useState<Appearance>(getInitialAppearance)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activePage, setActivePage] = useState<ActivePage>("overview")
  const settingsTriggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const applyTheme = () => {
      const effective =
        appearance === "system"
          ? media.matches
            ? "dark"
            : "light"
          : appearance
      document.documentElement.dataset.theme = effective
    }
    applyTheme()
    media.addEventListener("change", applyTheme)
    try {
      window.localStorage.setItem(APPEARANCE_KEY, appearance)
    } catch {
      // The active preference still applies for this session.
    }
    return () => media.removeEventListener("change", applyTheme)
  }, [appearance])

  useEffect(() => {
    document.body.classList.toggle("panel-open", settingsOpen)
    return () => document.body.classList.remove("panel-open")
  }, [settingsOpen])

  const openSettings = (trigger: HTMLButtonElement) => {
    settingsTriggerRef.current = trigger
    setSettingsOpen(true)
  }
  const closeSettings = () => {
    setSettingsOpen(false)
    window.requestAnimationFrame(() => settingsTriggerRef.current?.focus())
  }

  const current = financialData[period]
  const previous = financialData.FY2023
  const comparison = (value: number, prior: number) =>
    ((value - prior) / prior) * 100
  const hasComparison = period === "FY2024"

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <DesktopNavigation
        activePage={activePage}
        onNavigate={setActivePage}
        onSettings={openSettings}
      />
      <MobileNavigation
        activePage={activePage}
        menuOpen={menuOpen}
        onMenu={() => setMenuOpen((value) => !value)}
        onNavigate={setActivePage}
        onSettings={openSettings}
      />

      <main className="content">
        {activePage === "documents" ? (
          <DocumentsPage onBack={() => setActivePage("overview")} />
        ) : (
          <>
            <header className="page-header entrance entrance-1">
              <div className="company-context">
                <h1>Northstar Manufacturing</h1>
                <p>
                  Financial overview <span aria-hidden="true">·</span> USD millions
                </p>
              </div>
              <div className="header-controls">
                <SlidingSelector
                  ariaLabel="Reporting period"
                  className="period-selector"
                  onChange={setPeriod}
                  options={[
                    { key: "FY2024", label: "FY2024" },
                    { key: "FY2023", label: "FY2023" },
                  ]}
                  value={period}
                />
                <span className="sample-badge">Sample data</span>
              </div>
              <p className="sample-note">
                Fictional company and figures. No document has been analyzed.
              </p>
            </header>

            <Surface className="metric-strip entrance entrance-2">
              <MetricCell
                animateValue
                change={
                  hasComparison
                    ? comparison(current.revenue, previous.revenue)
                    : undefined
                }
                label="Revenue"
                value={current.revenue}
              />
              <MetricCell
                change={
                  hasComparison
                    ? comparison(current.income, previous.income)
                    : undefined
                }
                label="Net income"
                value={current.income}
              />
              <MetricCell
                change={
                  hasComparison
                    ? comparison(current.assets, previous.assets)
                    : undefined
                }
                label="Total assets"
                neutral
                value={current.assets}
              />
              <MetricCell
                change={
                  hasComparison
                    ? comparison(current.cashFlow, previous.cashFlow)
                    : undefined
                }
                label="Operating cash flow"
                value={current.cashFlow}
              />
            </Surface>

            <div className="main-grid entrance entrance-3">
              <PerformanceChart metric={metric} onMetric={setMetric} />
              <WhatChanged period={period} />
            </div>

            <div className="entrance entrance-4">
              <Documents />
            </div>
          </>
        )}
      </main>

      {settingsOpen && (
        <SettingsPanel
          appearance={appearance}
          onAppearance={setAppearance}
          onClose={closeSettings}
        />
      )}
    </div>
  )
}
