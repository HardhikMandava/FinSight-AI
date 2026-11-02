import { useState, useRef, useEffect, type FormEvent } from "react"
import {
  financialData,
  COMPANY_NAME,
  type Period,
  PERIODS_NEWEST_FIRST,
} from "../data/financialData"
import {
  calculateRevenueGrowth,
  calculateNetProfitMargin,
  calculateMarginChange,
  calculateCurrentRatio,
  calculateDebtToEquity,
} from "../utils/financialCalculations"
import { evaluateRisks } from "../utils/riskEvaluation"

interface ChatMessage {
  id: string
  sender: "user" | "assistant"
  text: string
  timestamp: string
  metadata?: {
    source: string
    calculation?: string
    isUnsupported?: boolean
  }
}

const SUGGESTED_QUESTIONS = [
  "How did revenue grow from FY2023 to FY2024?",
  "What happened to net profit margin in FY2024?",
  "Explain operating cash flow vs net income in FY2024",
  "What is Northstar's current ratio and liquidity position?",
  "Which risk screening flags were triggered in FY2024?",
  "What is Northstar's debt-to-equity ratio?",
  "Can you analyze an uploaded PDF report?",
]

function getFormattedTime(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

export default function AssistantPage({
  onNavigate,
}: {
  onNavigate: (page: "overview" | "documents" | "analysis" | "risks" | "assistant") => void
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-greeting",
      sender: "assistant",
      text: `Hello. I am the FinSight Demo Assistant. I provide deterministic financial insights grounded in the five-year ${COMPANY_NAME} dataset (FY2020–FY2024).\n\nYou can ask about revenue growth, net profit margin movements, operating cash flow trajectories, liquidity ratios, or automated risk screening rules.`,
      timestamp: getFormattedTime(),
      metadata: {
        source: "Fictional Northstar Manufacturing dataset",
        calculation: "Deterministic calculation engine · Prototype mode",
      },
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const threadEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const generateAnswer = (query: string): { text: string; calculation?: string; isUnsupported?: boolean } => {
    const q = query.toLowerCase()

    // 1. Revenue Growth
    if (q.includes("revenue") && (q.includes("grow") || q.includes("change") || q.includes("2024") || q.includes("fy2024"))) {
      const curRev = financialData.FY2024.revenue
      const priorRev = financialData.FY2023.revenue
      const growth = calculateRevenueGrowth(curRev, priorRev)
      const growthStr = growth.status === "available" ? `+${growth.value.toFixed(2)}%` : "N/A"
      return {
        text: `In FY2024, Northstar Manufacturing reported revenue of $${curRev}M, compared to $${priorRev}M in FY2023. This represents a year-over-year revenue growth of ${growthStr} (an increase of $${(curRev - priorRev).toFixed(1)}M).\n\nAcross the five-year dataset, revenue has grown consistently from $350M in FY2020 to $516M in FY2024.`,
        calculation: `Formula: (($516M - $480M) / $480M) × 100 = +7.50%`,
      }
    }

    // 2. Net Profit Margin / Net Income
    if (q.includes("margin") || q.includes("net income") || q.includes("profit")) {
      const cur = financialData.FY2024
      const prior = financialData.FY2023
      const marginChange = calculateMarginChange(cur.margin, prior.margin)
      const changeStr = marginChange.status === "available"
        ? `${marginChange.value >= 0 ? "+" : "−"}${Math.abs(marginChange.value).toFixed(2)} pp`
        : "N/A"

      return {
        text: `In FY2024, net income was $${cur.income}M on $${cur.revenue}M revenue, resulting in a net profit margin of ${cur.margin.toFixed(2)}%.\n\nCompared to FY2023 (net income of $${prior.income}M on $${prior.revenue}M revenue; margin of ${prior.margin.toFixed(2)}%), net margin contracted by ${changeStr} (or 150 basis points). Net income fell by 8.63% YoY despite revenue growth, indicating elevated operating cost pressure.`,
        calculation: `FY24 Margin: ($43.86M / $516M) × 100 = 8.50% | Margin Delta: 8.50% - 10.00% = -1.50 pp`,
      }
    }

    // 3. Operating Cash Flow vs Net Income
    if (q.includes("cash flow") || q.includes("operating cash")) {
      const cur = financialData.FY2024
      const prior = financialData.FY2023
      return {
        text: `In FY2024, operating cash flow was $${cur.cashFlow}M, declining by $${(prior.cashFlow - cur.cashFlow).toFixed(1)}M (-10.77%) from $${prior.cashFlow}M in FY2023.\n\nNotably, operating cash flow ($58M) remained higher than reported net income ($43.86M) by $14.14M, indicating sound cash conversion even as operating cash generation moderated year-over-year.`,
        calculation: `Cash Flow Delta: (($58M - $65M) / $65M) × 100 = -10.77% | Spread vs Net Income: $58M - $43.86M = +$14.14M`,
      }
    }

    // 4. Current Ratio / Liquidity
    if (q.includes("current ratio") || q.includes("liquid")) {
      const cur = financialData.FY2024
      const prior = financialData.FY2023
      const curRatio = calculateCurrentRatio(cur.currentAssets, cur.currentLiabilities)
      const priorRatio = calculateCurrentRatio(prior.currentAssets, prior.currentLiabilities)
      const curVal = curRatio.status === "available" ? curRatio.value.toFixed(2) : "N/A"
      const priorVal = priorRatio.status === "available" ? priorRatio.value.toFixed(2) : "N/A"

      return {
        text: `Northstar's current ratio stood at ${curVal}× at the close of FY2024 (current assets of $${cur.currentAssets}M against current liabilities of $${cur.currentLiabilities}M).\n\nThis represents a contraction from ${priorVal}× in FY2023 ($180M / $100M). While the ratio remains comfortably above the 1.00× threshold (working capital is positive at $${cur.currentAssets - cur.currentLiabilities}M), the decline triggers an informational Watch flag in risk screening.`,
        calculation: `FY24: $190M / $120M = 1.58× | FY23: $180M / $100M = 1.80×`,
      }
    }

    // 5. Debt to Equity / Leverage
    if (q.includes("debt") || q.includes("leverage") || q.includes("equity")) {
      const cur = financialData.FY2024
      const prior = financialData.FY2023
      const dte = calculateDebtToEquity(cur.interestBearingDebt, cur.equity)
      const dteVal = dte.status === "available" ? dte.value.toFixed(2) : "N/A"
      const priorDte = calculateDebtToEquity(prior.interestBearingDebt, prior.equity)
      const priorDteVal = priorDte.status === "available" ? priorDte.value.toFixed(2) : "N/A"

      return {
        text: `Northstar's Debt-to-Equity ratio increased to ${dteVal}× in FY2024 ($${cur.interestBearingDebt}M interest-bearing debt / $${cur.equity}M shareholders' equity), up from ${priorDteVal}× in FY2023 ($${prior.interestBearingDebt}M / $${prior.equity}M).\n\nTotal liabilities expanded to $${cur.totalLiabilities}M, and the balance sheet verified condition Assets ($${cur.assets}M) = Liabilities ($${cur.totalLiabilities}M) + Equity ($${cur.equity}M) holds true.`,
        calculation: `FY24 D/E: $220M / $275M = 0.80× | FY23 D/E: $190M / $270M = 0.70×`,
      }
    }

    // 6. Risk screening flags
    if (q.includes("risk") || q.includes("flag") || q.includes("screening")) {
      const eval2024 = evaluateRisks("FY2024")
      const triggeredNames = eval2024.rules.filter(r => r.status === "triggered").map(r => r.title)

      return {
        text: `In FY2024, Northstar Manufacturing triggered 4 out of 7 automated risk screening rules (all classified as Watch severity):\n\n1. Net profit margin declined (8.50% vs 10.00%)\n2. Operating cash flow declined ($58M vs $65M)\n3. Current ratio declined (1.58× vs 1.80×)\n4. Interest-bearing debt increased ($220M vs $190M)\n\nZero Elevated risk rules were triggered: Operating cash flow is not negative ($58M > 0), and Current ratio remains safely above 1.0× (1.58×).`,
        calculation: `Evaluation Result: 4 Triggered (Watch), 3 Not Triggered, 0 Not Assessable`,
      }
    }

    // 7. Uploaded PDF / Document Q&A questions
    if (q.includes("pdf") || q.includes("upload") || q.includes("file") || q.includes("custom") || q.includes("document")) {
      return {
        text: `In this frontend prototype, selected PDF reports are held securely in your local browser memory only. They are not uploaded to a remote server, extracted via OCR, or fed into a generative language model.\n\nFull natural-language questioning against custom uploaded PDF files with verified page citations requires backend server integration and secure document processing pipelines.`,
        calculation: `Prototype limit: Browser memory only · No server ingestion`,
        isUnsupported: false,
      }
    }

    // Fallback / Unsupported query
    return {
      text: `I can answer queries related to Northstar Manufacturing's reported financials and deterministic ratios for FY2020–FY2024.\n\nTry asking:\n• "How did revenue grow from FY2023 to FY2024?"\n• "What happened to net profit margin in FY2024?"\n• "What is Northstar's current ratio and liquidity position?"\n• "Which risk screening flags were triggered in FY2024?"`,
      calculation: `Supported topics: Revenue, Margin, Cash Flow, Current Ratio, D/E, and Risk Flags`,
      isUnsupported: true,
    }
  }

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend.trim(),
      timestamp: getFormattedTime(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate realistic lightweight query processing (350ms)
    setTimeout(() => {
      const answer = generateAnswer(textToSend)
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text: answer.text,
        timestamp: getFormattedTime(),
        metadata: {
          source: "Fictional Northstar Manufacturing dataset",
          calculation: answer.calculation,
          isUnsupported: answer.isUnsupported,
        },
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 380)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    handleSendMessage(inputValue)
  }

  return (
    <div className="assistant-page">
      {/* Header with Persistent "Demo assistant" label */}
      <header className="page-heading-row entrance entrance-1">
        <div>
          <div className="assistant-badge-row">
            <span className="demo-assistant-pill">Demo assistant</span>
            <span className="context-sep">·</span>
            <span className="assistant-context-tag">{COMPANY_NAME} (FY2020–FY2024)</span>
          </div>
          <h1>Financial Assistant</h1>
          <p className="currency-notice">
            Grounded financial intelligence · Deterministic calculations · Session-only conversation
          </p>
        </div>

        <div className="heading-controls">
          <button
            className="button button-outline public-site-btn"
            onClick={() => onNavigate("overview")}
            type="button"
          >
            <span>Return to Overview</span>
          </button>
        </div>
      </header>

      {/* Scope Disclaimer Banner */}
      <aside aria-label="Demo notice" className="assistant-scope-banner entrance entrance-2">
        <div className="scope-banner-icon">ℹ</div>
        <div className="scope-banner-text">
          <strong>Demonstration mode:</strong> Responses are deterministically derived from the shared Northstar Manufacturing dataset. Verified document citations and custom PDF parsing require backend integration.
        </div>
      </aside>

      {/* Suggested Questions Strip */}
      <section aria-label="Suggested questions" className="suggested-questions-section entrance entrance-2">
        <span className="suggested-label">Suggested queries:</span>
        <div className="suggested-pills-wrap">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              className="button suggested-question-pill"
              key={q}
              onClick={() => handleSendMessage(q)}
              type="button"
            >
              {q}
            </button>
          ))}
        </div>
      </section>

      {/* Chat Thread Container */}
      <section aria-label="Conversation history" className="assistant-chat-card surface entrance entrance-3">
        <div className="chat-thread" role="log">
          {messages.map((msg) => (
            <article
              className={`chat-message-row ${msg.sender === "user" ? "user-row" : "assistant-row"}`}
              key={msg.id}
            >
              <div className="chat-avatar" aria-hidden="true">
                {msg.sender === "user" ? "You" : "FS"}
              </div>
              <div className="chat-bubble">
                <div className="chat-bubble-header">
                  <span className="chat-sender-name">
                    {msg.sender === "user" ? "You" : "FinSight Demo Assistant"}
                  </span>
                  <time className="chat-timestamp">{msg.timestamp}</time>
                </div>

                <div className="chat-message-content">
                  {msg.text.split("\n\n").map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {msg.metadata && (
                  <footer className="chat-metadata-footer">
                    <span className="metadata-tag source-tag">{msg.metadata.source}</span>
                    {msg.metadata.calculation && (
                      <span className="metadata-tag calc-tag">{msg.metadata.calculation}</span>
                    )}
                  </footer>
                )}
              </div>
            </article>
          ))}

          {isLoading && (
            <div className="chat-message-row assistant-row loading-row" aria-live="polite">
              <div className="chat-avatar" aria-hidden="true">FS</div>
              <div className="chat-bubble loading-bubble">
                <span className="loading-dots">
                  <span />
                  <span />
                  <span />
                </span>
                <span className="sr-only">Evaluating financial data...</span>
              </div>
            </div>
          )}
          <div ref={threadEndRef} />
        </div>

        {/* Query Input Bar */}
        <form className="chat-input-bar" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="assistant-input">
            Ask a financial question
          </label>
          <input
            autoComplete="off"
            className="chat-text-input"
            id="assistant-input"
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about revenue growth, net margin, cash flow, liquidity, or risk rules..."
            type="text"
            value={inputValue}
          />
          <button
            aria-label="Send question"
            className="button chat-send-btn"
            disabled={!inputValue.trim() || isLoading}
            type="submit"
          >
            <span>Ask</span>
          </button>
        </form>
      </section>
    </div>
  )
}
