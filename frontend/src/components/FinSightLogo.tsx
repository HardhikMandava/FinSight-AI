import React from "react"

export function FinSightMark({
  size = 32,
  className = "",
}: {
  size?: number
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={`finsight-mark ${className}`}
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg
        fill="none"
        height={size}
        viewBox="0 0 36 36"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="finsight-amber-grad"
            x1="0%"
            x2="100%"
            y1="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#FFD29D" />
            <stop offset="45%" stopColor="#FFA64D" />
            <stop offset="100%" stopColor="#C46E18" />
          </linearGradient>
          <radialGradient
            id="lens-glow"
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop offset="0%" stopColor="#FFF3DF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FF9E40" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Amber Gradient Glass Container */}
        <rect
          fill="url(#finsight-amber-grad)"
          height="34"
          rx="10"
          stroke="rgba(255, 255, 255, 0.45)"
          strokeWidth="1.2"
          width="34"
          x="1"
          y="1"
        />

        {/* Micro-ruled Financial Ledger Lines */}
        <line
          stroke="#171412"
          strokeDasharray="1.5 2"
          strokeOpacity="0.32"
          strokeWidth="1"
          x1="8"
          x2="28"
          y1="11"
          y2="11"
        />
        <line
          stroke="#171412"
          strokeDasharray="1.5 2"
          strokeOpacity="0.32"
          strokeWidth="1"
          x1="8"
          x2="28"
          y1="18"
          y2="18"
        />
        <line
          stroke="#171412"
          strokeDasharray="1.5 2"
          strokeOpacity="0.32"
          strokeWidth="1"
          x1="8"
          x2="28"
          y1="25"
          y2="25"
        />

        {/* Stylized 'F' Body with Ledger Alignment */}
        {/* Vertical Stem */}
        <path
          d="M10 8.5C10 7.95 10.45 7.5 11 7.5H13C13.55 7.5 14 7.95 14 8.5V26.5C14 27.05 13.55 27.5 13 27.5H11C10.45 27.5 10 27.05 10 26.5V8.5Z"
          fill="#171412"
        />
        {/* Top Ledger Bar of F */}
        <path
          d="M13 8H24C24.55 8 25 8.45 25 9C25 9.55 24.55 10 24 10H13V8Z"
          fill="#171412"
        />
        {/* Middle Crossbar of F */}
        <path
          d="M13 16.5H20C20.55 16.5 21 17 21 17.5C21 18 20.55 18.5 20 18.5H13V16.5Z"
          fill="#171412"
        />

        {/* Focused Analysis Lens */}
        {/* Lens Glow */}
        <circle cx="21" cy="17.5" fill="url(#lens-glow)" r="7" />
        {/* Outer Ring */}
        <circle
          cx="21"
          cy="17.5"
          r="4.8"
          stroke="#171412"
          strokeWidth="1.8"
        />
        {/* Inner Glass Highlight */}
        <circle
          cx="21"
          cy="17.5"
          fill="#FFFFFF"
          fillOpacity="0.4"
          r="3.8"
        />
        {/* Lens Handle at 45-degree angle */}
        <path
          d="M24.5 21L27.5 24"
          stroke="#171412"
          strokeLinecap="round"
          strokeWidth="2"
        />
        {/* Focused Data Point / Spark inside lens */}
        <circle cx="21" cy="17.5" fill="#B8550A" r="1.3" />
      </svg>
    </div>
  )
}

export function Brand({
  showBadge = true,
  subtitle,
  onClick,
}: {
  showBadge?: boolean
  subtitle?: string
  onClick?: () => void
}) {
  const content = (
    <div className="brand-group">
      <FinSightMark size={32} />
      <div className="brand-text-column">
        <div className="brand-title-row">
          <span className="brand-name">FinSight AI</span>
          {showBadge && <span className="brand-badge">Glass Ledger</span>}
        </div>
        {subtitle && <span className="brand-subtitle">{subtitle}</span>}
      </div>
    </div>
  )

  if (onClick) {
    return (
      <button
        className="brand-button button"
        onClick={onClick}
        type="button"
      >
        {content}
      </button>
    )
  }

  return <div className="brand">{content}</div>
}
