"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const modes = {
  insight: {
    label: "Insight mode",
    badge: "Read-only insight",
    title: "Ask for financial context.",
    description:
      "Use Northline AI to summarize balances, spending patterns, cash flow movement, and upcoming obligations.",
    placeholder: "Ask about cash flow, balances, spending, or upcoming obligations...",
    checkpoints: ["Summarize balances", "Explain spending", "Review upcoming bills"]
  },
  agent: {
    label: "Agent mode",
    badge: "Read-only agent",
    title: "Coordinate the next financial review.",
    description:
      "Agent mode is shaped for multi-step, read-only review: gather context, identify pressure points, and prepare next-step options.",
    placeholder: "Ask Agent Mode to review cash flow pressure, obligations, or account movement...",
    checkpoints: ["Gather account context", "Flag cash pressure", "Prepare next-step options"]
  }
};

type ModeKey = keyof typeof modes;

export function AgentModePanel() {
  const [mode, setMode] = useState<ModeKey>("agent");
  const activeMode = modes[mode];

  return (
    <Card className="rounded-[30px]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge tone={mode === "agent" ? "success" : "teal"}>{activeMode.badge}</Badge>
          <h2 className="mt-4 font-heading text-3xl font-semibold text-[var(--navy)]">
            {activeMode.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            {activeMode.description}
          </p>
        </div>

        <div className="flex max-w-[26rem] flex-col items-start gap-3">
          <Badge tone="teal" className="leading-5 tracking-[0.12em]">
            Read-only financial insights. No transfers or account changes.
          </Badge>
          <div className="grid grid-cols-2 rounded-[18px] border border-[var(--line)] bg-white/80 p-1 text-sm font-semibold">
            {(Object.keys(modes) as ModeKey[]).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={mode === key}
                onClick={() => setMode(key)}
                className={cn(
                  "rounded-[14px] px-4 py-2 transition",
                  mode === key
                    ? "bg-[var(--navy)] text-white shadow-[0_12px_24px_rgba(11,31,51,0.16)]"
                    : "text-[var(--muted)] hover:text-[var(--navy)]"
                )}
              >
                {modes[key].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[24px] border border-[var(--line)] bg-white/80 p-4">
        <label className="sr-only" htmlFor="northline-ai-question">
          Ask Northline AI
        </label>
        <textarea
          id="northline-ai-question"
          disabled
          placeholder={activeMode.placeholder}
          className="min-h-[160px] w-full resize-none rounded-[20px] border border-[var(--line)] bg-white px-4 py-4 text-sm leading-6 text-[var(--navy)] outline-none placeholder:text-[var(--muted)] disabled:cursor-not-allowed"
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {activeMode.checkpoints.map((checkpoint) => (
              <span
                key={checkpoint}
                className="rounded-full border border-[var(--line)] bg-white px-3 py-1 text-xs font-semibold text-[var(--navy)]"
              >
                {checkpoint}
              </span>
            ))}
          </div>
          <button
            type="button"
            disabled
            className="inline-flex cursor-not-allowed items-center justify-center rounded-2xl bg-[var(--navy)] px-5 py-3 text-sm font-semibold text-white opacity-55"
          >
            Ask
          </button>
        </div>
      </div>
    </Card>
  );
}
