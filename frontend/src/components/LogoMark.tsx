export default function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span className={`brand-mark ${className}`} aria-hidden="true">
      <svg fill="none" viewBox="0 0 32 32">
        <path className="logo-frame" d="M8.5 6.5h15v5h-10v4h8v5h-8v5h-5v-19Z" />
        <path className="logo-signal" d="M18.5 11.5h5v9h-5z" />
        <circle className="logo-focus" cx="23.5" cy="23.5" r="3" />
      </svg>
    </span>
  )
}
