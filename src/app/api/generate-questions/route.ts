import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import https from "https";

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export async function POST(req: NextRequest) {
  try {
    const { technology, level, count } = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY is not set in .env.local" },
        { status: 500 }
      );
    }

    const prompt = `Generate ${count} multiple choice questions about "${technology}" at ${level} difficulty level.

Return ONLY a JSON array. No explanation, no markdown, no code blocks. Raw JSON only.

Format:
[{"title":"Question text?","options":[{"text":"Wrong","isCorrect":false},{"text":"Correct","isCorrect":true},{"text":"Wrong","isCorrect":false},{"text":"Wrong","isCorrect":false}]}]

Rules:
- Exactly ${count} questions
- Exactly 4 options per question
- Exactly 1 isCorrect: true per question
- Raw JSON array only, nothing else`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openrouter/free",
        messages: [
          {
            role: "system",
            content: "You are a quiz generator. You only respond with valid JSON arrays. No explanation, no markdown, no code blocks. Only raw JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4096,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "QuizApp",
        },
        // timeout: 60000,
        httpsAgent,
      }
    );

    // Capture which model was actually used
    const modelUsed: string = response.data?.model ?? "openrouter/free";
    const raw: string = response.data?.choices?.[0]?.message?.content ?? "";

    console.log("Model used:", modelUsed);

    if (!raw) {
      return NextResponse.json({ error: "Empty response from model. Try again." }, { status: 422 });
    }

    const cleaned = raw.replace(/```json|```/g, "").trim();
    const match = cleaned.match(/\[[\s\S]*\]/);

    if (!match) {
      return NextResponse.json(
        { error: `Model returned unexpected content: ${raw.slice(0, 200)}` },
        { status: 422 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(match[0]);
    } catch {
      return NextResponse.json({ error: "Couldn't parse questions JSON. Try again." }, { status: 422 });
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return NextResponse.json({ error: "No questions generated. Try again." }, { status: 422 });
    }

    return NextResponse.json({ questions: parsed, model: modelUsed });

  } catch (err: any) {
    console.error("Route error:", err.message);

    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 500;
      const message =
        err.response?.data?.error?.message ??
        err.response?.data?.error ??
        err.message;
      return NextResponse.json({ error: `OpenRouter: ${message}` }, { status });
    }

    return NextResponse.json(
      { error: err.message ?? "Something went wrong." },
      { status: 500 }
    );
  }
}