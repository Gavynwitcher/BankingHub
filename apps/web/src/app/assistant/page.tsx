import type { Metadata } from "next";
import { AgentModePanel } from "@/components/assistant/agent-mode-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Northline AI",
  description:
    "Ask Northline AI questions about cash flow, balances, spending, and upcoming obligations.",
  path: "/assistant",
  keywords: [
    "Northline AI",
    "cash flow assistant",
    "financial insights assistant",
    "spending analysis"
  ]
});

const insightAreas = [
  {
    title: "Cash flow",
    description: "Review inflows, outflows, timing pressure, and monthly movement in plain language."
  },
  {
    title: "Balances",
    description: "Ask about connected-account balances and available funds without changing accounts."
  },
  {
    title: "Spending",
    description: "Understand categories, merchant patterns, and unusual activity across recent transactions."
  },
  {
    title: "Obligations",
    description: "Look ahead to upcoming bills, recurring payments, debt minimums, and other commitments."
  }
];

const prompts = [
  "What changed in my cash flow this month?",
  "Which upcoming obligations should I prepare for?",
  "Where is my spending running above normal?",
  "How much cushion do I have after bills?"
];

export default function AssistantPage() {
  return (
    <>
      <PageHero
        eyebrow="Read-only assistant"
        title="Northline AI"
        description="Ask questions about your cash flow, balances, spending, and upcoming obligations."
        primaryCta={{ href: "/dashboard-demo", label: "View dashboard demo" }}
        secondaryCta={{ href: "/security", label: "Review safety model" }}
      />

      <section className="page-section pt-0">
        <Container>
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <AgentModePanel />

            <Card className="rounded-[30px]">
              <Badge tone="muted">Example questions</Badge>
              <div className="mt-5 grid gap-3">
                {prompts.map((prompt) => (
                  <div
                    key={prompt}
                    className="rounded-[20px] border border-[var(--line)] bg-white/75 px-4 py-3 text-sm leading-6 text-[var(--navy)]"
                  >
                    {prompt}
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button href="/features" variant="secondary">
                  Explore Northline features
                </Button>
              </div>
            </Card>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {insightAreas.map((area) => (
              <Card key={area.title} className="rounded-[26px] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                  {area.title}
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--navy)]">{area.description}</p>
              </Card>
            ))}
          </div>

          <Card className="mt-5 rounded-[30px] border-[rgba(200,164,90,0.28)] bg-[rgba(255,250,237,0.92)]">
            <Badge tone="gold">Disclaimer</Badge>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-[var(--navy)]">
              Northline AI provides educational financial insights only. It does not provide legal,
              tax, investment, accounting, or lending advice.
            </p>
          </Card>
        </Container>
      </section>
    </>
  );
}
