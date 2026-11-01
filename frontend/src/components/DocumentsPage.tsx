import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type ChangeEvent,
} from "react"

// ─── Constants ──────────────────────────────────────────────────────────────

const MAX_SIZE_BYTES = 20 * 1024 * 1024 // 20 MB
const MAX_SIZE_LABEL = "20 MB"
const SIMULATION_STEPS = 12
const STEP_INTERVAL_MS = 380

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

// ─── Types ───────────────────────────────────────────────────────────────────

type SimStatus = "idle" | "running" | "done"

// ─── Sub-components ──────────────────────────────────────────────────────────

function DocIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" />
      <path d="M14 3v6h6M8 13h8M8 17h5" />
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={32}
      viewBox="0 0 24 24"
      width={32}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m17 8-5-5-5 5M12 3v12" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={15}
      viewBox="0 0 24 24"
      width={15}
    >
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}

function ArrowLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={15}
      viewBox="0 0 24 24"
      width={15}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DocumentsPage({
  onBack,
}: {
  onBack: () => void
}) {
  // State
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string>("")
  const [dragging, setDragging] = useState(false)
  const [simStatus, setSimStatus] = useState<SimStatus>("idle")
  const [simProgress, setSimProgress] = useState(0)
  const [announcement, setAnnouncement] = useState("")

  // Refs
  const inputRef = useRef<HTMLInputElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const errorRef = useRef<HTMLParagraphElement>(null)

  // Clean up timer on unmount or file removal
  function clearSim() {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => {
    return () => clearSim()
  }, [])

  // Validate and accept a File object
  const acceptFile = useCallback((candidate: File) => {
    setError("")
    setSimStatus("idle")
    setSimProgress(0)
    clearSim()

    if (candidate.size === 0) {
      setError("That file is empty. Please choose a non-empty PDF.")
      return
    }
    if (candidate.type !== "application/pdf") {
      setError(
        "Only PDF files are supported. Please select a .pdf file."
      )
      return
    }
    if (candidate.size > MAX_SIZE_BYTES) {
      setError(
        `That file is too large (${formatBytes(candidate.size)}). The maximum is ${MAX_SIZE_LABEL}.`
      )
      return
    }

    setFile(candidate)
    setAnnouncement(`File selected: ${candidate.name}, ${formatBytes(candidate.size)}.`)
  }, [])

  // File input change
  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const picked = event.target.files?.[0]
    if (picked) acceptFile(picked)
    // Reset so the same file can be re-selected after removal
    event.target.value = ""
  }

  // Drag events
  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragging(true)
  }
  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragging(false)
  }
  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragging(false)
    const items = event.dataTransfer.files
    if (items.length === 0) return
    if (items.length > 1) {
      setError("Please drop one file at a time.")
      return
    }
    acceptFile(items[0])
  }

  // Remove selected file
  function removeFile() {
    clearSim()
    setFile(null)
    setError("")
    setSimStatus("idle")
    setSimProgress(0)
    setAnnouncement("File removed.")
  }

  // Simulate processing
  function startSimulation() {
    if (!file || simStatus === "running") return
    setSimStatus("running")
    setSimProgress(0)
    setAnnouncement("Simulated processing started.")

    let step = 0
    intervalRef.current = setInterval(() => {
      step += 1
      const pct = Math.round((step / SIMULATION_STEPS) * 100)
      setSimProgress(pct)
      if (step >= SIMULATION_STEPS) {
        clearSim()
        setSimStatus("done")
        setSimProgress(100)
        setAnnouncement(
          "Simulation complete. Demo complete — this file has not been uploaded or analyzed."
        )
      }
    }, STEP_INTERVAL_MS)
  }

  const progressPct = simStatus === "done" ? 100 : simProgress

  return (
    <div className="docs-page">
      {/* Live region for screen-reader announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        {announcement}
      </div>

      {/* Page header */}
      <header className="docs-page-header entrance entrance-1">
        <button
          className="button docs-back-button"
          onClick={onBack}
          type="button"
        >
          <ArrowLeftIcon />
          Overview
        </button>
        <div className="docs-page-title">
          <h1>Documents</h1>
          <p>Select a PDF to simulate processing. No file is sent anywhere.</p>
        </div>
      </header>

      {/* Drop zone / file selection */}
      {!file && (
        <section
          aria-label="File selection area"
          className={`surface docs-dropzone entrance entrance-2${dragging ? " docs-dropzone-active" : ""}`}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="docs-drop-inner">
            <span className="docs-drop-icon">
              <UploadIcon />
            </span>
            <p className="docs-drop-label">Drag a PDF here, or</p>
            <input
              accept="application/pdf,.pdf"
              aria-label="Choose a PDF file"
              className="sr-only"
              id="docs-file-input"
              onChange={handleInputChange}
              ref={inputRef}
              tabIndex={-1}
              type="file"
            />
            <button
              className="button docs-choose-button"
              onClick={() => inputRef.current?.click()}
              type="button"
            >
              Choose PDF
            </button>
            <p className="docs-drop-hint">
              Single PDF · max {MAX_SIZE_LABEL} · selection is kept in memory only — refreshing clears it.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <p
              aria-live="assertive"
              className="docs-error"
              id="docs-error"
              ref={errorRef}
              role="alert"
            >
              {error}
            </p>
          )}
        </section>
      )}

      {/* Selected file card */}
      {file && (
        <section
          aria-label="Selected file"
          className="surface docs-file-card entrance entrance-2"
        >
          <div className="docs-file-info">
            <span className="docs-file-icon" aria-hidden="true">
              <DocIcon size={22} />
            </span>
            <div className="docs-file-meta">
              <span className="docs-file-name">{file.name}</span>
              <span className="docs-file-size">{formatBytes(file.size)}</span>
            </div>
            <button
              aria-label="Remove file and choose another"
              className="button docs-remove-button"
              onClick={removeFile}
              type="button"
            >
              <CloseIcon />
            </button>
          </div>

          <p className="docs-memory-note">
            This file is held in memory only. Refreshing the page will clear it.
          </p>

          {/* Action */}
          {simStatus === "idle" && (
            <button
              className="button docs-simulate-button"
              onClick={startSimulation}
              type="button"
            >
              Simulate processing
            </button>
          )}

          {/* Progress bar */}
          {(simStatus === "running" || simStatus === "done") && (
            <div className="docs-progress-wrap">
              <div className="docs-progress-header">
                <span className="docs-progress-label">Simulated progress</span>
                <span className="docs-progress-pct" aria-hidden="true">
                  {progressPct}%
                </span>
              </div>
              <div
                aria-label={`Simulated progress: ${progressPct}%`}
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={progressPct}
                className="docs-progress-bar-track"
                role="progressbar"
              >
                <div
                  className="docs-progress-bar-fill"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              {simStatus === "done" && (
                <p className="docs-done-note" role="status">
                  Demo complete — this file has not been uploaded or analyzed.
                </p>
              )}
              {simStatus === "done" && (
                <button
                  className="button docs-reset-button"
                  onClick={removeFile}
                  type="button"
                >
                  Remove file and start over
                </button>
              )}
            </div>
          )}
        </section>
      )}

    </div>
  )
}
