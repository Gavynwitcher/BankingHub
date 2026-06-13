"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const promptCards = [
  "Summarize my cash position",
  "What changed this week?",
  "Show my top spending categories",
  "What bills are coming up?",
  "Find unusual transactions",
  "Explain my recent cash flow"
];

const dashboardStats = [
  { label: "Cash position", value: "$24.8k", detail: "Across linked accounts" },
  { label: "Weekly change", value: "+$1.2k", detail: "Net movement preview" },
  { label: "Upcoming bills", value: "7", detail: "Next 14 days" }
];

type Message = {
  role: "user" | "assistant";
  content: string;
};

function buildLocalResponse(prompt: string) {
  return `Agentic mode is ready to review "${prompt}". This read-only workspace is prepared for connected financial insights while transfers and account changes remain unavailable.`;
}

export function FinanceAiAssistant() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const latestUserMessage = useMemo(
    () => [...messages].reverse().find((message) => message.role === "user"),
    [messages]
  );
  const latestAssistantMessage = useMemo(
    () => [...messages].reverse().find((message) => message.role === "assistant"),
    [messages]
  );

  function submitPrompt(value: string) {
    const prompt = value.trim();
    if (!prompt) return;

    setMessages([
      { role: "user", content: prompt },
      { role: "assistant", content: buildLocalResponse(prompt) }
    ]);
    setInput("");
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.5fr]">
      <div className="grid gap-5">
        <Card className="rounded-[30px]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Badge tone="success">Agentic mode</Badge>
              <h2 className="mt-4 font-heading text-2xl font-semibold text-[var(--navy)]">
                Suggested prompts
              </h2>
            </div>
            <Badge tone="teal" className="leading-5 tracking-[0.12em]">
              Read-only financial insights. No transfers or account changes.
            </Badge>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {promptCards.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setInput(prompt)}
                className="rounded-[22px] border border-[var(--line)] bg-white/80 px-4 py-4 text-left text-sm font-semibold leading-6 text-[var(--navy)] transition hover:border-[var(--ocean)] hover:bg-white"
              >
                {prompt}
              </button>
            ))}
          </div>
        </Card>

        <div className="grid gap-3">
          {dashboardStats.map((stat) => (
            <Card key={stat.label} className="rounded-[24px] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                {stat.label}
              </p>
              <p className="mt-2 font-heading text-3xl font-semibold text-[var(--navy)]">{stat.value}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{stat.detail}</p>
            </Card>
          ))}
        </div>
      </div>

      <Card className="rounded-[30px] p-0">
        <div className="border-b border-[var(--line)] px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Badge tone="navy">Main chat area</Badge>
              <h2 className="mt-3 font-heading text-2xl font-semibold text-[var(--navy)]">
                Northline AI workspace
              </h2>
            </div>
            <span className="rounded-full border border-[var(--line)] bg-white px-3 py-1 text-xs font-semibold text-[var(--muted)]">
              Read-only preview
            </span>
          </div>
        </div>

        <div className="grid min-h-[32rem] gap-4 p-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[24px] border border-[var(--line)] bg-white/75 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              User message area
            </p>
            {latestUserMessage ? (
              <div className="mt-4 rounded-[20px] bg-[var(--navy)] px-4 py-4 text-sm leading-6 text-white">
                {latestUserMessage.content}
              </div>
            ) : (
              <div className="mt-4 flex min-h-[12rem] items-center justify-center rounded-[20px] border border-dashed border-[var(--line-strong)] bg-[rgba(248,251,253,0.72)] px-5 text-center">
                <div>
                  <p className="font-heading text-xl font-semibold text-[var(--navy)]">Empty state</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    Choose a suggested prompt or type a question to preview the message layout.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-[24px] border border-[var(--line)] bg-[rgba(248,251,253,0.82)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              AI response area
            </p>
            <div
              className={cn(
                "mt-4 min-h-[12rem] rounded-[20px] border px-4 py-4 text-sm leading-7",
                latestAssistantMessage
                  ? "border-[rgba(25,106,117,0.16)] bg-white text-[var(--navy)]"
                  : "border-dashed border-[var(--line-strong)] bg-white/70 text-[var(--muted)]"
              )}
            >
              {latestAssistantMessage ? (
                latestAssistantMessage.content
              ) : (
                <p>
                  Northline AI responses will appear here as connected insights become available.
                </p>
              )}
            </div>
          </div>
        </div>

        <form
          className="border-t border-[var(--line)] p-5"
          onSubmit={(event) => {
            event.preventDefault();
            submitPrompt(input);
          }}
        >
          <label className="sr-only" htmlFor="northline-ai-input">
            Message input
          </label>
          <div className="flex flex-col gap-3 rounded-[24px] border border-[var(--line)] bg-white p-3 sm:flex-row sm:items-end">
            <textarea
              id="northline-ai-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about cash flow, balances, spending, or upcoming obligations..."
              className="min-h-[84px] flex-1 resize-none rounded-[18px] border border-transparent bg-[rgba(248,251,253,0.88)] px-4 py-3 text-sm leading-6 text-[var(--navy)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--ocean)]"
            />
            <Button className="sm:min-w-[7.5rem]">Send</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
