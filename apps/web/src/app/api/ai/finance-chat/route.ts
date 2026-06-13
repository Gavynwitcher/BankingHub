import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `
You are Northline AI, a read-only financial insight assistant.

Rules:
- Only answer using financial data provided by the backend.
- Never invent balances, transactions, dates, accounts, categories, bills, income, or financial trends.
- If data is missing, say the data is missing.
- Do not estimate, assume, or fill gaps.
- Do not provide legal, tax, investment, accounting, or lending advice.
- Do not tell users to buy, sell, or hold securities.
- Do not move money, initiate payments, approve loans, or change account settings.
- Keep answers clear, practical, and easy to understand.

You must never invent financial facts. If the provided data does not contain the answer, say that the data is missing.
`;

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "Northline AI is not configured yet." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const message = body?.message;

    if (!message || typeof message !== "string") {
      return Response.json({ error: "Message is required." }, { status: 400 });
    }

    if (message.length > 1000) {
      return Response.json({ error: "Message is too long." }, { status: 400 });
    }

    // TODO: Replace this mock data with real database/Plaid data.
    // Do not accept financial data from the frontend.
    const financialContext = {
      accounts: [],
      transactions: [],
      upcomingBills: [],
      metadata: {
        dateRange: "No financial data connected yet",
        accountsUsed: 0,
        transactionsUsed: 0,
        billsUsed: 0
      }
    };

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: `
User question:
${message}

Financial data available:
${JSON.stringify(financialContext, null, 2)}

Return a helpful answer. If the data is missing, clearly say that.
          `
        }
      ]
    });

    return Response.json({
      answer: response.output_text,
      confidence: "low",
      dataUsed: {
        accountsUsed: financialContext.metadata.accountsUsed,
        transactionsUsed: financialContext.metadata.transactionsUsed,
        billsUsed: financialContext.metadata.billsUsed,
        dateRange: financialContext.metadata.dateRange
      },
      missingData: ["Connected account data is not available in this starter route."],
      alerts: [],
      disclaimer:
        "Northline AI provides educational financial insights only and does not provide legal, tax, investment, accounting, or lending advice."
    });
  } catch (error) {
    console.error("Northline AI error:", error);

    return Response.json(
      {
        error: "Northline AI could not complete that request. Please try again."
      },
      { status: 500 }
    );
  }
}
