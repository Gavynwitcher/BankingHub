import type { Metadata } from "next";
import { FinanceAiAssistant } from "@/components/assistant/finance-ai-assistant";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Northline AI",
  description:
    "Ask Northline AI questions about cash flow, balances, spending, and upcoming obligations.",
  path: "/ai-assistant",
  keywords: [
    "Northline AI",
    "finance AI assistant",
    "cash flow assistant",
    "spending insights"
  ]
});

export default function AiAssistantPage() {
  return (
    <>
      <PageHero
        eyebrow="Read-only financial insights"
        title="Northline AI"
        description="Ask questions about your cash flow, balances, spending, and upcoming obligations."
        primaryCta={{ href: "/dashboard-demo", label: "View dashboard demo" }}
        secondaryCta={{ href: "/security", label: "Review safety model" }}
      />

      <section className="page-section pt-0">
        <Container>
          <FinanceAiAssistant />

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
