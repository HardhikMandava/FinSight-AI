import { FormEvent, useEffect, useRef, useState } from "react"
import { financialData } from "../data/financialData"
import { evaluateRisks } from "../utils/riskEvaluation"
import {
  calculateCurrentRatio,
  calculateRevenueGrowth,
} from "../utils/financialCalculations"

type Message = {
  id: number
  role: "user" | "assistant"
  content: string
  meta?: string
}

const questions = [
  "How did revenue change in FY2024?",
  "Why did net profit margin change?",
  "What happened to operating cash flow?",
  "Which risk indicators were triggered?",
]

function answerQuestion(question: string): string {
  const query = question.toLowerCase()
  const current = financialData.FY2024
  const prior = financialData.FY2023

  if (query.includes("revenue")) {
    const growth = calculateRevenueGrowth(current.revenue, prior.revenue)
    return `Demonstration answer: Revenue increased from $${prior.revenue}M in FY2023 to $${current.revenue}M in FY2024. That is a ${
      growth.status === "available" ? growth.value.toFixed(1) : "—"
    }% year-over-year increase.`
  }
  if (query.includes("margin") || query.includes("profit")) {
    return `Demonstration answer: Net profit margin declined from ${prior.margin.toFixed(1)}% in FY2023 to ${current.margin.toFixed(1)}% in FY2024, a change of ${(current.margin - prior.margin).toFixed(1)} percentage points. This result reflects net income of $${current.income}M divided by revenue of $${current.revenue}M. The sample data does not provide enough detail to state a cause.`
  }
  if (query.includes("cash")) {
    const change = ((current.cashFlow - prior.cashFlow) / prior.cashFlow) * 100
    return `Demonstration answer: Operating cash flow decreased from $${prior.cashFlow}M in FY2023 to $${current.cashFlow}M in FY2024, a ${Math.abs(change).toFixed(1)}% decline. The demo identifies the movement but does not infer why it occurred.`
  }
  if (query.includes("current ratio") || query.includes("liquidity")) {
    const ratio = calculateCurrentRatio(
      current.currentAssets,
      current.currentLiabilities,
    )
    return `Demonstration answer: The FY2024 current ratio is ${
      ratio.status === "available" ? ratio.value.toFixed(2) : "unavailable"
    }×, calculated as $${current.currentAssets}M of current assets divided by $${current.currentLiabilities}M of current liabilities. It declined from ${(prior.currentAssets / prior.currentLiabilities).toFixed(2)}× in FY2023.`
  }
  if (query.includes("risk") || query.includes("trigger")) {
    const rules = evaluateRisks("FY2024").rules.filter(
      (rule) => rule.status === "triggered",
    )
    return `Demonstration answer: ${rules.length} of 7 sample indicators are triggered for FY2024: ${rules.map((rule) => rule.title.toLowerCase()).join(", ")}. These are project-defined screening rules, not an official credit rating or a conclusion that the company is unsafe.`
  }
  return "This prototype can explain FY2024 revenue growth, net profit margin, operating cash flow, the current ratio, and triggered sample risk indicators. It does not read selected PDFs or answer open-ended document questions yet."
}

function SendIcon() {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height="17"
      viewBox="0 0 24 24"
      width="17"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  )
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Ask about Northstar Manufacturing’s FY2024 performance or the sample risk indicators. I’ll answer from the shared fictional dataset.",
      meta: "Demonstration only · No document access",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const nextId = useRef(2)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const ask = (question: string) => {
    const clean = question.trim()
    if (!clean || loading) return
    const userMessage: Message = {
      id: nextId.current++,
      role: "user",
      content: clean,
    }
    setMessages((current) => [...current, userMessage])
    setInput("")
    setLoading(true)
    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: nextId.current++,
          role: "assistant",
          content: answerQuestion(clean),
          meta: "Calculated from fictional sample data · Verified document citations require backend integration",
        },
      ])
      setLoading(false)
    }, 520)
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    ask(input)
  }

  return (
    <div className="assistant-page">
      <header className="assistant-heading entrance entrance-1">
        <div>
          <span className="assistant-label">
            <i /> Demo assistant
          </span>
          <h1>Ask the financials.</h1>
          <p>Deterministic explanations from the Northstar sample dataset.</p>
        </div>
        <div className="assistant-scope">
          <strong>Dataset scope</strong>
          <span>FY2020–FY2024 · USD millions</span>
        </div>
      </header>

      <div className="assistant-layout entrance entrance-2">
        <aside className="assistant-prompts surface">
          <div>
            <span>START WITH A QUESTION</span>
            <p>Suggested prompts are supported by the current demonstration.</p>
          </div>
          {questions.map((question) => (
            <button
              disabled={loading}
              key={question}
              onClick={() => ask(question)}
              type="button"
            >
              <span>{question}</span>
              <b>↗</b>
            </button>
          ))}
          <div className="assistant-limit">
            <strong>No PDF access</strong>
            <p>
              Selected local files are not read, uploaded, or connected to these
              answers.
            </p>
          </div>
        </aside>

        <section
          className="conversation surface"
          aria-label="Demo assistant conversation"
        >
          <div className="conversation-top">
            <div>
              <i />
              <span>FinSight reasoning layer</span>
            </div>
            <span>Current session</span>
          </div>
          <div className="message-list" aria-live="polite">
            {messages.map((message) => (
              <article className={`message ${message.role}`} key={message.id}>
                <span className="message-author">
                  {message.role === "assistant" ? "FIN" : "YOU"}
                </span>
                <div>
                  <p>{message.content}</p>
                  {message.meta && <small>{message.meta}</small>}
                </div>
              </article>
            ))}
            {loading && (
              <article className="message assistant loading-message">
                <span className="message-author">FIN</span>
                <div>
                  <p>
                    <i />
                    <i />
                    <i />
                    <span className="sr-only">
                      Preparing demonstration answer
                    </span>
                  </p>
                </div>
              </article>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form className="assistant-composer" onSubmit={submit}>
            <label className="sr-only" htmlFor="assistant-question">
              Ask a question about the sample dataset
            </label>
            <input
              id="assistant-question"
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about revenue, margins, cash flow, liquidity, or risks…"
              value={input}
            />
            <button
              aria-label="Send question"
              disabled={!input.trim() || loading}
              type="submit"
            >
              <SendIcon />
            </button>
          </form>
          <p className="composer-note">
            Answers are demonstrations, not financial advice. Verified citations
            are not yet available.
          </p>
        </section>
      </div>
    </div>
  )
}
