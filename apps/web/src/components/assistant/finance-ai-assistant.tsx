"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
  id: string;
  role: "user" | "assistant";
  content: string;
};

type FinanceChatResponse = {
  answer?: string;
  error?: string;
};

function createMessage(role: Message["role"], content: string): Message {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content
  };
}

async function sendMessage(message: string) {
  const response = await fetch("/api/ai/finance-chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message
    })
  });

  const data = (await response.json()) as FinanceChatResponse;

  if (!response.ok) {
    throw new Error(data.error || "AI request failed");
  }

  return data;
}

export function FinanceAiAssistant() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const userMessages = useMemo(
    () => messages.filter((message) => message.role === "user"),
    [messages]
  );
  const assistantMessages = useMemo(
    () => messages.filter((message) => message.role === "assistant"),
    [messages]
  );

  async function submitPrompt(value: string) {
    const prompt = value.trim();
    if (!prompt || isLoading) return;

    setError("");
    setInput("");
    setIsLoading(true);
    setMessages((currentMessages) => [...currentMessages, createMessage("user", prompt)]);

    try {
      const response = await sendMessage(prompt);
      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage(
          "assistant",
          response.answer || "Northline AI did not return an answer for that request."
        )
      ]);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Northline AI could not prepare a preview response. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  const canSubmit = input.trim().length > 0 && !isLoading;

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
                onClick={() => {
                  setInput(prompt);
                  void submitPrompt(prompt);
                }}
                disabled={isLoading}
                className="rounded-[22px] border border-[var(--line)] bg-white/80 px-4 py-4 text-left text-sm font-semibold leading-6 text-[var(--navy)] transition hover:border-[var(--ocean)] hover:bg-white disabled:cursor-not-allowed disabled:opacity-55"
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
            {userMessages.length ? (
              <div className="mt-4 grid max-h-[24rem] gap-3 overflow-y-auto pr-1">
                {userMessages.map((message) => (
                  <div
                    key={message.id}
                    className="rounded-[20px] bg-[var(--navy)] px-4 py-4 text-sm leading-6 text-white"
                  >
                    {message.content}
                  </div>
                ))}
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
            <div className="mt-4 grid max-h-[24rem] min-h-[12rem] gap-3 overflow-y-auto pr-1">
              {assistantMessages.length ? (
                assistantMessages.map((message) => (
                  <div
                    key={message.id}
                    className="rounded-[20px] border border-[rgba(25,106,117,0.16)] bg-white px-4 py-4 text-sm leading-7 text-[var(--navy)]"
                  >
                    {message.content}
                  </div>
                ))
              ) : (
                <div className="rounded-[20px] border border-dashed border-[var(--line-strong)] bg-white/70 px-4 py-4 text-sm leading-7 text-[var(--muted)]">
                  <p>
                    Northline AI responses will appear here as connected insights become available.
                  </p>
                </div>
              )}

              {isLoading ? (
                <div className="rounded-[20px] border border-[rgba(25,106,117,0.16)] bg-white px-4 py-4 text-sm leading-7 text-[var(--muted)]">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--ocean)]" />
                    Preparing a read-only answer...
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {error ? (
          <div className="mx-5 mb-5 rounded-[20px] border border-[rgba(185,111,25,0.22)] bg-[rgba(255,250,237,0.92)] px-4 py-4 text-sm leading-6 text-[var(--navy)]">
            <p className="font-semibold text-[var(--warning)]">Something went wrong</p>
            <p className="mt-1">{error}</p>
          </div>
        ) : null}

        <form
          className="border-t border-[var(--line)] p-5"
          onSubmit={(event) => {
            event.preventDefault();
            void submitPrompt(input);
          }}
        >
          <label className="sr-only" htmlFor="northline-ai-input">
            Message input
          </label>
          <div className="flex flex-col gap-3 rounded-[24px] border border-[var(--line)] bg-white p-3 sm:flex-row sm:items-end">
            <textarea
              id="northline-ai-input"
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                if (error) setError("");
              }}
              placeholder="Ask about cash flow, balances, spending, or upcoming obligations..."
              className="min-h-[84px] flex-1 resize-none rounded-[18px] border border-transparent bg-[rgba(248,251,253,0.88)] px-4 py-3 text-sm leading-6 text-[var(--navy)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--ocean)] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isLoading}
            />
            <Button className="sm:min-w-[7.5rem]" disabled={!canSubmit}>
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
