import {
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react"

const MAX_SIZE_BYTES = 20 * 1024 * 1024 // 20 MiB
const MAX_SIZE_LABEL = "20 MiB"

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KiB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MiB`
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

export type DocStatus = "idle" | "simulating" | "done"

export interface LocalDocument {
  id: string
  file: File
  name: string
  size: number
  addedAt: Date
  status: DocStatus
  progress: number
}

interface AddDocumentResult {
  ok: boolean
  error?: string
}

function UploadIcon() {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={28}
      viewBox="0 0 24 24"
      width={28}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m17 8-5-5-5 5M12 3v12" />
    </svg>
  )
}

function DocFileIcon() {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={20}
      viewBox="0 0 24 24"
      width={20}
    >
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" />
      <path d="M14 3v6h6M8 13h8M8 17h5" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={14}
      viewBox="0 0 24 24"
      width={14}
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

export default function DocumentsPage({
  documents,
  activeSimId,
  onAddDocument,
  onRemoveDocument,
  onStartSim,
  onCancelSim,
  onBack,
}: {
  documents: LocalDocument[]
  activeSimId: string | null
  onAddDocument: (file: File) => AddDocumentResult
  onRemoveDocument: (id: string) => void
  onStartSim: (id: string) => void
  onCancelSim: (id: string) => void
  onBack: () => void
}) {
  const [error, setError] = useState("")
  const [dragging, setDragging] = useState(false)
  const [announcement, setAnnouncement] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const validateAndAddFile = useCallback(
    (file: File) => {
      setError("")

      if (file.size === 0) {
        setError("That file is empty. Please choose a non-empty PDF.")
        return
      }

      const isPdfType = file.type === "application/pdf"
      const isPdfExt = file.name.toLowerCase().endsWith(".pdf")
      if (!isPdfType && !isPdfExt) {
        setError("Only PDF files are supported. Please select a .pdf file.")
        return
      }

      if (file.size > MAX_SIZE_BYTES) {
        setError(
          `That file is too large (${formatBytes(file.size)}). The maximum is ${MAX_SIZE_LABEL}.`,
        )
        return
      }

      const result = onAddDocument(file)
      if (!result.ok && result.error) {
        setError(result.error)
        return
      }

      setAnnouncement(
        `File added to your documents: ${file.name}, ${formatBytes(file.size)}.`,
      )
    },
    [onAddDocument],
  )

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      validateAndAddFile(file)
    }
    event.target.value = ""
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)
    const files = event.dataTransfer.files
    if (files.length === 0) return
    if (files.length > 1) {
      setError("Please drop one file at a time.")
      return
    }
    validateAndAddFile(files[0])
  }

  return (
    <div className="docs-page">
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        {announcement}
      </div>

      <header className="docs-page-header entrance entrance-1">
        <button
          className="button docs-back-button"
          onClick={onBack}
          type="button"
        >
          <ArrowLeftIcon />
          <span>Overview</span>
        </button>
        <div className="docs-page-title">
          <h1>Documents</h1>
          <p>Select a PDF to simulate processing. No file is sent anywhere.</p>
        </div>
      </header>

      {/* File selection dropzone */}
      <section
        aria-label="PDF selection area"
        className={`surface docs-dropzone entrance entrance-2 ${
          dragging ? "docs-dropzone-active" : ""
        }`}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="docs-drop-inner">
          <span className="docs-drop-icon" aria-hidden="true">
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
            Single PDF · max {MAX_SIZE_LABEL} · preliminary browser validation
            only.
          </p>
        </div>

        {error && (
          <p aria-live="assertive" className="docs-error" role="alert">
            {error}
          </p>
        )}
      </section>

      {/* Your documents list */}
      <section
        aria-label="Your documents"
        className="surface docs-list-panel entrance entrance-3"
      >
        <div className="docs-list-header">
          <div>
            <h2>Your documents</h2>
            <p className="docs-memory-notice">
              Files are held in memory for this session. They are not uploaded
              and are cleared when you refresh.
            </p>
          </div>
          {documents.length > 0 && (
            <span className="docs-count-badge">
              {documents.length}{" "}
              {documents.length === 1 ? "document" : "documents"}
            </span>
          )}
        </div>

        {documents.length === 0 ? (
          <div className="docs-empty-state">
            <p className="docs-empty-title">No documents in your list</p>
            <p className="docs-empty-sub">
              Select or drop a PDF file above to add it to your memory-only
              session.
            </p>
          </div>
        ) : (
          <div className="docs-entries-container" role="list">
            {documents.map((doc) => {
              const isSimulating = doc.status === "simulating"
              const isDone = doc.status === "done"
              const isAnotherSimRunning =
                activeSimId !== null && activeSimId !== doc.id

              return (
                <article
                  aria-label={`Document: ${doc.name}`}
                  className="docs-entry-card"
                  key={doc.id}
                  role="listitem"
                >
                  <div className="docs-entry-main">
                    <span className="docs-entry-icon" aria-hidden="true">
                      <DocFileIcon />
                    </span>
                    <div className="docs-entry-meta">
                      <h3 className="docs-entry-name" title={doc.name}>
                        {doc.name}
                      </h3>
                      <div className="docs-entry-submeta">
                        <span>{formatBytes(doc.size)}</span>
                        <span aria-hidden="true">·</span>
                        <span>Added {formatTime(doc.addedAt)}</span>
                      </div>
                    </div>

                    <div className="docs-entry-status-tag">
                      {doc.status === "idle" && (
                        <span className="status-badge status-idle">
                          Selected locally
                        </span>
                      )}

                      {isDone && (
                        <button
                          aria-disabled={isAnotherSimRunning}
                          className="button docs-action-btn docs-btn-simulate"
                          disabled={isAnotherSimRunning}
                          onClick={() => onStartSim(doc.id)}
                          type="button"
                        >
                          Retry simulation
                        </button>
                      )}
                      {doc.status === "simulating" && (
                        <span className="status-badge status-simulating">
                          Simulating
                        </span>
                      )}
                      {doc.status === "done" && (
                        <span className="status-badge status-done">
                          Demo complete
                        </span>
                      )}
                    </div>

                    <div className="docs-entry-actions">
                      {doc.status === "idle" && (
                        <button
                          aria-disabled={isAnotherSimRunning}
                          className="button docs-action-btn docs-btn-simulate"
                          disabled={isAnotherSimRunning}
                          onClick={() => onStartSim(doc.id)}
                          title={
                            isAnotherSimRunning
                              ? "Another simulation is currently in progress"
                              : undefined
                          }
                          type="button"
                        >
                          Simulate processing
                        </button>
                      )}

                      {isSimulating && (
                        <button
                          className="button docs-action-btn docs-btn-cancel"
                          onClick={() => onCancelSim(doc.id)}
                          type="button"
                        >
                          Cancel
                        </button>
                      )}

                      <button
                        aria-label={`Remove ${doc.name}`}
                        className="button docs-entry-remove-btn"
                        onClick={() => onRemoveDocument(doc.id)}
                        title="Remove file"
                        type="button"
                      >
                        <CloseIcon />
                      </button>
                    </div>
                  </div>

                  {/* Progress bar during simulation */}
                  {isSimulating && (
                    <div className="docs-entry-progress-wrap">
                      <div className="docs-progress-meta">
                        <span className="docs-progress-label">
                          Simulated progress
                        </span>
                        <span className="docs-progress-pct" aria-hidden="true">
                          {doc.progress}%
                        </span>
                      </div>
                      <div
                        aria-label={`Simulated progress for ${doc.name}: ${doc.progress}%`}
                        aria-valuemax={100}
                        aria-valuemin={0}
                        aria-valuenow={doc.progress}
                        className="docs-progress-track"
                        role="progressbar"
                      >
                        <div
                          className="docs-progress-bar-fill"
                          style={{ width: `${doc.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Completion note */}
                  {isDone && (
                    <div className="docs-entry-completion-note" role="status">
                      Demo complete — this file has not been uploaded or
                      analyzed.
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
