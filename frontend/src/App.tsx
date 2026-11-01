import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import DocumentsPage, {
  type LocalDocument,
} from "./components/DocumentsPage"

type Period = "FY2024" | "FY2023"
type Metric = "revenue" | "income" | "cashFlow"
type Appearance = "dark" | "light" | "system"
type NavLayout = "sidebar" | "topbar"
type ActivePage = "overview" | "documents"
type IconName =
  | "overview"
  | "document"
  | "analysis"
  | "assistant"
  | "risk"
  | "settings"
  | "menu"
  | "close"
  | "arrowUp"
  | "arrowDown"
  | "minus"
  | "info"
  | "sun"
  | "moon"
  | "system"
  | "check"
  | "externalLink"

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
    externalLink: (
      <>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <path d="M15 3h6v6M10 14 21 3" />
      </>
    ),
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

const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function Button({ children, className = "", ...props }, ref) {
  return (
    <button className={`button ${className}`} ref={ref} type="button" {...props}>
      {children}
    </button>
  )
})

function Brand({ mini = false }: { mini?: boolean }) {
  return (
    <div className={`brand ${mini ? "brand-mini" : ""}`} title="FinSight AI">
      <div className="brand-mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      {!mini && <span>FinSight AI</span>}
    </div>
  )
}

/* ─── Desktop Layout 1: Sidebar ─────────────────────────────────────────────── */

function Sidebar({
  activePage,
  onNavigate,
  onSettings,
}: {
  activePage: ActivePage
  onNavigate: (page: ActivePage) => void
  onSettings: (trigger: HTMLButtonElement) => void
}) {
  return (
    <nav aria-label="Sidebar navigation" className="sidebar">
      <div className="sidebar-brand-wrap">
        <Brand mini />
      </div>
      <div className="sidebar-links">
        {navItems.map((item) => {
          const isActive = item.page !== undefined && item.page === activePage
          const isEnabled = item.page !== undefined
          return (
            <Button
              key={item.label}
              aria-current={isActive ? "page" : undefined}
              aria-disabled={!isEnabled}
              aria-label={item.label}
              className={`sidebar-button ${isActive ? "active" : ""} ${!isEnabled ? "unavailable" : ""}`}
              data-tooltip={item.label}
              onClick={
                isEnabled && !isActive ? () => onNavigate(item.page!) : undefined
              }
            >
              <Icon name={item.icon} size={18} />
            </Button>
          )
        })}
      </div>
      <div className="sidebar-bottom">
        <Button
          aria-label="Settings"
          className="sidebar-button sidebar-settings"
          data-tooltip="Settings"
          onClick={(event) => onSettings(event.currentTarget)}
        >
          <Icon name="settings" size={18} />
        </Button>
      </div>
    </nav>
  )
}

/* ─── Desktop Layout 2: Top Bar ─────────────────────────────────────────────── */

function TopBarNav({
  activePage,
  onNavigate,
  onSettings,
}: {
  activePage: ActivePage
  onNavigate: (page: ActivePage) => void
  onSettings: (trigger: HTMLButtonElement) => void
}) {
  return (
    <header className="topbar-nav" role="banner">
      <Brand />
      <nav aria-label="Primary navigation" className="top-nav">
        <span className="sr-only" id="coming-next-top">
          Coming next. This destination is not available in the prototype.
        </span>
        {navItems.map((item) => {
          const isActive = item.page !== undefined && item.page === activePage
          const isEnabled = item.page !== undefined
          return (
            <Button
              key={item.label}
              aria-current={isActive ? "page" : undefined}
              aria-describedby={!isEnabled ? "coming-next-top" : undefined}
              aria-disabled={!isEnabled}
              className={`top-nav-link ${isActive ? "active" : ""} ${!isEnabled ? "unavailable" : ""}`}
              data-tooltip={!isEnabled ? "Coming next" : undefined}
              onClick={
                isEnabled && !isActive ? () => onNavigate(item.page!) : undefined
              }
            >
              {item.label}
            </Button>
          )
        })}
      </nav>
      <div className="topbar-right">
        <Button
          className="settings-button"
          onClick={(event) => onSettings(event.currentTarget)}
        >
          <Icon name="settings" size={14} />
          <span>Settings</span>
        </Button>
      </div>
    </header>
  )
}

/* ─── Mobile Chrome & Drawer ─────────────────────────────────────────────────── */

function MobileTopBar({
  onMenu,
  onSettings,
}: {
  onMenu: () => void
  onSettings: (trigger: HTMLButtonElement) => void
}) {
  return (
    <header className="mobile-top-bar" role="banner">
      <Brand />
      <div className="mobile-top-actions">
        <Button
          aria-label="Settings"
          className="mobile-top-btn"
          onClick={(event) => onSettings(event.currentTarget)}
        >
          <Icon name="settings" size={16} />
        </Button>
        <Button
          aria-label="Open navigation menu"
          className="mobile-menu-btn"
          onClick={onMenu}
        >
          <Icon name="menu" size={16} />
          <span>Menu</span>
        </Button>
      </div>
    </header>
  )
}

function MobileDrawer({
  activePage,
  isOpen,
  onClose,
  onNavigate,
  onSettings,
}: {
  activePage: ActivePage
  isOpen: boolean
  onClose: () => void
  onNavigate: (page: ActivePage) => void
  onSettings: (trigger: HTMLButtonElement) => void
}) {
  const drawerRef = useRef<HTMLElement>(null)
  const prevFocusedRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      prevFocusedRef.current = document.activeElement as HTMLElement
      const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
        "button:not([disabled])"
      )
      focusable?.[0]?.focus()

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          event.preventDefault()
          onClose()
          return
        }
        if (event.key === "Tab" && focusable && focusable.length > 0) {
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
      }
      document.addEventListener("keydown", handleKeyDown)
      document.body.classList.add("drawer-open")
      return () => {
        document.removeEventListener("keydown", handleKeyDown)
        document.body.classList.remove("drawer-open")
        prevFocusedRef.current?.focus()
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="mobile-drawer-layer">
      <div className="mobile-drawer-backdrop" onClick={onClose} aria-hidden="true" />
      <aside
        aria-label="Mobile navigation drawer"
        aria-modal="true"
        className="mobile-drawer surface"
        ref={drawerRef}
        role="dialog"
      >
        <div className="mobile-drawer-header">
          <Brand />
          <Button
            aria-label="Close menu"
            className="close-button"
            onClick={onClose}
          >
            <Icon name="close" size={16} />
          </Button>
        </div>
        <nav aria-label="Mobile destinations" className="mobile-drawer-nav">
          {navItems.map((item) => {
            const isActive = item.page !== undefined && item.page === activePage
            const isEnabled = item.page !== undefined
            return (
              <Button
                key={item.label}
                aria-current={isActive ? "page" : undefined}
                aria-disabled={!isEnabled}
                className={`mobile-drawer-link ${isActive ? "active" : ""}`}
                onClick={
                  isEnabled
                    ? () => {
                        if (!isActive) onNavigate(item.page!)
                        onClose()
                      }
                    : undefined
                }
              >
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
                {!isEnabled && <small className="coming-next-badge">Coming next</small>}
              </Button>
            )
          })}
        </nav>
        <div className="mobile-drawer-footer">
          <Button
            className="mobile-drawer-link mobile-drawer-settings"
            onClick={(event) => {
              onSettings(event.currentTarget)
              onClose()
            }}
          >
            <Icon name="settings" size={18} />
            <span>Settings</span>
          </Button>
        </div>
      </aside>
    </div>
  )
}

/* ─── UI Widgets ────────────────────────────────────────────────────────────── */

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
        <span>Prior year unavailable</span>
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
      "(prefers-reduced-motion: reduce)"
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

/* ─── Financial Snapshot (Left Column) ──────────────────────────────────────── */

function FinancialSnapshot({
  period,
  current,
  hasComparison,
  comparison,
}: {
  period: Period
  current: typeof financialData.FY2024
  hasComparison: boolean
  comparison: (value: number, prior: number) => number
}) {
  const previous = financialData.FY2023

  const tiles = [
    {
      label: "Revenue",
      value: current.revenue,
      change: hasComparison ? comparison(current.revenue, previous.revenue) : undefined,
      neutral: false,
      color: "tile-lavender",
    },
    {
      label: "Net income",
      value: current.income,
      change: hasComparison ? comparison(current.income, previous.income) : undefined,
      neutral: false,
      color: "tile-blue",
    },
    {
      label: "Total assets",
      value: current.assets,
      change: hasComparison ? comparison(current.assets, previous.assets) : undefined,
      neutral: true,
      color: "tile-peach",
    },
    {
      label: "Operating cash flow",
      value: current.cashFlow,
      change: hasComparison ? comparison(current.cashFlow, previous.cashFlow) : undefined,
      neutral: false,
      color: "tile-neutral",
    },
  ]

  return (
    <div className="snapshot-panel surface">
      <div className="snapshot-heading">
        <h2>Financial snapshot</h2>
        <p>{period}</p>
      </div>
      {tiles.map((tile, i) => (
        <div className={`metric-tile ${tile.color} entrance entrance-${i + 1}`} key={tile.label}>
          <div className="tile-label">{tile.label}</div>
          <div className="tile-value">
            <span className="tile-currency">$</span>
            <AnimatedNumber value={tile.value} />
            <span className="tile-unit">M</span>
          </div>
          <Comparison change={tile.change} neutral={tile.neutral} />
        </div>
      ))}
    </div>
  )
}

/* ─── Performance Chart (Newest Year FY2024 on LEFT) ────────────────────────── */

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

  // Explicit ordering: FY2024 on the LEFT, FY2023 on the RIGHT
  const values = [
    { year: "FY2024" as const, value: financialData.FY2024[metric], isCurrent: true },
    { year: "FY2023" as const, value: financialData.FY2023[metric], isCurrent: false },
  ]
  const selectedLabel =
    metricOptions.find((item) => item.key === metric)?.label ?? ""
  const chartMax =
    Math.ceil(Math.max(...values.map((item) => item.value)) / 100) * 100 || 100
  const baseline = 156
  const chartHeight = 112
  const xPositions = [190, 390]
  const ticks = [0, chartMax / 2, chartMax]

  const showTooltip = (item: (typeof values)[number], x: number, y: number) => {
    setTooltip({
      left: (x / 560) * 100,
      top: (y / 190) * 100,
      title: `${item.year} · ${selectedLabel}`,
      value: `$${item.value.toLocaleString("en-US", { maximumFractionDigits: 2 })}M`,
    })
  }

  return (
    <div className="perf-panel surface">
      <div className="panel-header">
        <div>
          <h2>Financial performance</h2>
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
          aria-label={`${selectedLabel}: FY2024 ${values[0].value} million dollars and FY2023 ${values[1].value} million dollars`}
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
            const barClass = item.isCurrent ? "bar-current" : "bar-prior"
            return (
              <g
                className={`chart-series series-${item.isCurrent ? "current" : "prior"}`}
                key={`${metric}-${item.year}`}
              >
                <rect
                  aria-label={`${item.year} ${selectedLabel}: ${item.value} million dollars`}
                  className={`performance-bar ${barClass}`}
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
                <text className="year-text" textAnchor="middle" x={x} y={180}>
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
    </div>
  )
}

/* ─── Financial Indicators (Lower Left) ──────────────────────────────────────── */

function FinancialIndicators({ period }: { period: Period }) {
  const current = financialData[period]
  const currentRatio = current.currentAssets / current.currentLiabilities
  const isCurrent = period === "FY2024"

  return (
    <div className="indicators-panel surface">
      <h2>Financial indicators</h2>
      <div className="indicator-row">
        <span className="indicator-label">Net profit margin</span>
        <span className={`indicator-value ${isCurrent ? "negative" : ""}`}>
          {current.margin.toFixed(1)}%
        </span>
        {isCurrent && (
          <span className="indicator-note">vs 10.0% prior year</span>
        )}
      </div>
      <div className="indicator-row">
        <span className="indicator-label">Current ratio</span>
        <span className="indicator-value">{currentRatio.toFixed(2)}×</span>
      </div>
      <div className="indicator-row">
        <span className="indicator-label">Revenue growth</span>
        {isCurrent ? (
          <span className="indicator-value positive">+7.5%</span>
        ) : (
          <span className="indicator-value muted">—</span>
        )}
        {!isCurrent && (
          <span className="indicator-note">Prior year unavailable</span>
        )}
      </div>
      <div className="indicator-row">
        <span className="indicator-label">Leverage</span>
        <span className="indicator-value muted">Unavailable</span>
        <span className="indicator-note">Debt data not supplied</span>
      </div>
    </div>
  )
}

/* ─── Sample Documents (Lower Right) ────────────────────────────────────────── */

function SampleDocuments({
  onNavigate,
}: {
  onNavigate: (page: ActivePage) => void
}) {
  const rows = [
    { name: "Northstar_Annual_Report_FY2024.pdf", year: "FY2024" },
    { name: "Northstar_Annual_Report_FY2023.pdf", year: "FY2023" },
  ]

  return (
    <div className="docs-sample-panel surface">
      <h2>Sample documents</h2>
      {rows.map((row) => (
        <div className="sample-doc-row" key={row.name}>
          <span className="sample-doc-name">{row.name}</span>
          <span className="sample-doc-year">{row.year}</span>
          <span className="sample-doc-status">Sample record</span>
        </div>
      ))}
      <div className="sample-docs-footer">
        <p>Illustrative records only; no PDF files are attached.</p>
        <button
          className="open-docs-link"
          onClick={() => onNavigate("documents")}
          type="button"
        >
          <Icon name="externalLink" size={13} />
          <span>Open Documents</span>
        </button>
      </div>
    </div>
  )
}

/* ─── Settings Panel with Appearance and Layout Preferences ─────────────────── */

function SettingsPanel({
  appearance,
  navLayout,
  onAppearance,
  onNavLayout,
  onClose,
}: {
  appearance: Appearance
  navLayout: NavLayout
  onAppearance: (appearance: Appearance) => void
  onNavLayout: (layout: NavLayout) => void
  onClose: () => void
}) {
  const panelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    const focusable = panel.querySelectorAll<HTMLElement>(
      "button:not([disabled])"
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

  const appearanceOptions: {
    key: Appearance
    label: string
    icon: IconName
    detail: string
  }[] = [
    { key: "light", label: "Light", icon: "sun", detail: "Lavender workspace" },
    { key: "dark", label: "Dark", icon: "moon", detail: "Graphite workspace" },
    {
      key: "system",
      label: "System",
      icon: "system",
      detail: "Match this device",
    },
  ]

  const layoutOptions: {
    key: NavLayout
    label: string
    icon: IconName
    detail: string
  }[] = [
    {
      key: "sidebar",
      label: "Sidebar",
      icon: "overview",
      detail: "Compact vertical icon rail (default)",
    },
    {
      key: "topbar",
      label: "Top bar",
      icon: "menu",
      detail: "Horizontal labeled navigation",
    },
  ]

  return (
    <div className="settings-layer">
      <div className="settings-backdrop" onClick={onClose} aria-hidden="true" />
      <aside
        aria-labelledby="settings-title"
        aria-modal="true"
        className="settings-panel surface"
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

        {/* Appearance Preference */}
        <div className="settings-section">
          <h3>Appearance</h3>
          <p>Choose the interface appearance for this browser.</p>
          <div
            aria-label="Appearance preference"
            className="appearance-options"
            role="radiogroup"
          >
            {appearanceOptions.map((option) => (
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

        {/* Layout Preference */}
        <div className="settings-section">
          <h3>Layout</h3>
          <p>Choose desktop navigation position.</p>
          <div
            aria-label="Navigation position"
            className="appearance-options"
            role="radiogroup"
          >
            {layoutOptions.map((option) => (
              <Button
                aria-checked={navLayout === option.key}
                className={`appearance-option ${
                  navLayout === option.key ? "selected" : ""
                }`}
                key={option.key}
                onClick={() => onNavLayout(option.key)}
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
                  {navLayout === option.key && <Icon name="check" size={13} />}
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

/* ─── State Persistence Keys ────────────────────────────────────────────────── */

const APPEARANCE_KEY = "finsight-appearance"
const REDESIGN_KEY = "finsight-lavender-v2"
const NAV_LAYOUT_KEY = "finsight-nav-layout"

function getInitialAppearance(): Appearance {
  try {
    if (!window.localStorage.getItem(REDESIGN_KEY)) {
      window.localStorage.setItem(REDESIGN_KEY, "applied")
      window.localStorage.setItem(APPEARANCE_KEY, "light")
      return "light"
    }
    const stored = window.localStorage.getItem(APPEARANCE_KEY)
    if (stored === "dark" || stored === "light" || stored === "system")
      return stored
  } catch {
    // Privacy-restricted environments
  }
  return "light"
}

function getInitialNavLayout(): NavLayout {
  try {
    const stored = window.localStorage.getItem(NAV_LAYOUT_KEY)
    if (stored === "sidebar" || stored === "topbar") return stored
  } catch {
    // Privacy-restricted environments
  }
  return "sidebar"
}

/* ─── Main App Component ─────────────────────────────────────────────────────── */

export default function App() {
  const [period, setPeriod] = useState<Period>("FY2024")
  const [metric, setMetric] = useState<Metric>("revenue")
  const [appearance, setAppearance] = useState<Appearance>(getInitialAppearance)
  const [navLayout, setNavLayout] = useState<NavLayout>(getInitialNavLayout)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activePage, setActivePage] = useState<ActivePage>("overview")
  const settingsTriggerRef = useRef<HTMLButtonElement>(null)

  // Document list state kept in shared state above page
  const [documents, setDocuments] = useState<LocalDocument[]>([])
  const [activeSimId, setActiveSimId] = useState<string | null>(null)
  const simIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Appearance theme listener
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
      // Storage fallback
    }
    return () => media.removeEventListener("change", applyTheme)
  }, [appearance])

  // Body panel open lock
  useEffect(() => {
    document.body.classList.toggle("panel-open", settingsOpen)
    return () => document.body.classList.remove("panel-open")
  }, [settingsOpen])

  // Clean up simulation timer on unmount
  useEffect(() => {
    return () => {
      if (simIntervalRef.current) {
        clearInterval(simIntervalRef.current)
        simIntervalRef.current = null
      }
    }
  }, [])

  // When leaving Documents page, safely cancel active simulation and reset entry to "idle" ("Selected locally")
  useEffect(() => {
    if (activePage !== "documents" && activeSimId) {
      if (simIntervalRef.current) {
        clearInterval(simIntervalRef.current)
        simIntervalRef.current = null
      }
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === activeSimId ? { ...doc, status: "idle", progress: 0 } : doc
        )
      )
      setActiveSimId(null)
    }
  }, [activePage, activeSimId])

  const handleNavLayoutChange = (layout: NavLayout) => {
    setNavLayout(layout)
    try {
      window.localStorage.setItem(NAV_LAYOUT_KEY, layout)
    } catch {
      // Storage fallback
    }
  }

  const openSettings = (trigger: HTMLButtonElement) => {
    settingsTriggerRef.current = trigger
    setSettingsOpen(true)
  }

  const closeSettings = () => {
    setSettingsOpen(false)
    window.requestAnimationFrame(() => settingsTriggerRef.current?.focus())
  }

  // Document management handlers
  const handleAddDocument = (file: File): { ok: boolean; error?: string } => {
    const isDuplicate = documents.some(
      (d) =>
        d.file.name === file.name &&
        d.file.size === file.size &&
        d.file.lastModified === file.lastModified
    )
    if (isDuplicate) {
      return { ok: false, error: "This file is already in your list." }
    }

    const newDoc: LocalDocument = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      file,
      name: file.name,
      size: file.size,
      addedAt: new Date(),
      status: "idle",
      progress: 0,
    }

    setDocuments((prev) => [newDoc, ...prev])
    return { ok: true }
  }

  const handleRemoveDocument = (id: string) => {
    if (activeSimId === id) {
      if (simIntervalRef.current) {
        clearInterval(simIntervalRef.current)
        simIntervalRef.current = null
      }
      setActiveSimId(null)
    }
    setDocuments((prev) => prev.filter((d) => d.id !== id))
  }

  const handleStartSim = (id: string) => {
    if (activeSimId) return // Allow only one simulation at a time
    setActiveSimId(id)
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "simulating", progress: 0 } : d))
    )

    const STEPS = 12
    const INTERVAL = 380
    let step = 0

    simIntervalRef.current = setInterval(() => {
      step++
      const pct = Math.round((step / STEPS) * 100)
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? { ...d, progress: pct } : d))
      )
      if (step >= STEPS) {
        if (simIntervalRef.current) {
          clearInterval(simIntervalRef.current)
          simIntervalRef.current = null
        }
        setActiveSimId(null)
        setDocuments((prev) =>
          prev.map((d) =>
            d.id === id ? { ...d, status: "done", progress: 100 } : d
          )
        )
      }
    }, INTERVAL)
  }

  const handleCancelSim = (id: string) => {
    if (activeSimId === id) {
      if (simIntervalRef.current) {
        clearInterval(simIntervalRef.current)
        simIntervalRef.current = null
      }
      setActiveSimId(null)
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === id ? { ...d, status: "idle", progress: 0 } : d
        )
      )
    }
  }

  const current = financialData[period]
  const previous = financialData.FY2023
  const comparison = (value: number, prior: number) =>
    ((value - prior) / prior) * 100
  const hasComparison = period === "FY2024"

  return (
    <div
      className={`app-shell ${
        navLayout === "sidebar" ? "layout-sidebar" : "layout-topbar"
      }`}
    >
      {/* Desktop Layout 1: Sidebar (Rendered ONLY when navLayout is sidebar) */}
      {navLayout === "sidebar" && (
        <Sidebar
          activePage={activePage}
          onNavigate={setActivePage}
          onSettings={openSettings}
        />
      )}

      <div className="main-area">
        {/* Desktop Layout 2: Top Bar (Rendered ONLY when navLayout is topbar) */}
        {navLayout === "topbar" && (
          <TopBarNav
            activePage={activePage}
            onNavigate={setActivePage}
            onSettings={openSettings}
          />
        )}

        {/* Mobile Top Bar (Visible ONLY on mobile screens <= 880px) */}
        <MobileTopBar
          onMenu={() => setMenuOpen(true)}
          onSettings={openSettings}
        />

        {/* Accessible Mobile Drawer */}
        <MobileDrawer
          activePage={activePage}
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          onNavigate={setActivePage}
          onSettings={openSettings}
        />

        <main className="page-content">
          {activePage === "documents" ? (
            <DocumentsPage
              activeSimId={activeSimId}
              documents={documents}
              onAddDocument={handleAddDocument}
              onBack={() => setActivePage("overview")}
              onCancelSim={handleCancelSim}
              onRemoveDocument={handleRemoveDocument}
              onStartSim={handleStartSim}
            />
          ) : (
            <>
              <div className="page-heading-row entrance entrance-1">
                <div>
                  <h1>Dashboard</h1>
                  <p>Northstar Manufacturing · USD millions</p>
                </div>
                <div className="heading-controls">
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
              </div>
              <p className="sample-notice entrance entrance-1">
                Fictional sample data. No document has been analyzed.
              </p>

              <div className="dashboard-grid entrance entrance-2">
                <aside className="snapshot-col">
                  <FinancialSnapshot
                    comparison={comparison}
                    current={current}
                    hasComparison={hasComparison}
                    period={period}
                  />
                </aside>
                <div className="charts-col">
                  <PerformanceChart metric={metric} onMetric={setMetric} />
                  <div className="lower-row entrance entrance-3">
                    <FinancialIndicators period={period} />
                    <SampleDocuments onNavigate={setActivePage} />
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {settingsOpen && (
        <SettingsPanel
          appearance={appearance}
          navLayout={navLayout}
          onAppearance={setAppearance}
          onClose={closeSettings}
          onNavLayout={handleNavLayoutChange}
        />
      )}
    </div>
  )
}
