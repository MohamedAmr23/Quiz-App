import { NextRequest } from "next/server";
import axios from "axios";

const BATCH_SIZE = 5;

export async function POST(req: NextRequest) {
  const { technology, level, count } = await req.json();

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "OPENROUTER_API_KEY is not set." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const batches = Math.ceil(count / BATCH_SIZE);

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(
          new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`)
        );
      };

      let modelUsed = "openrouter/free";

      for (let i = 0; i < batches; i++) {
        const batchCount = Math.min(BATCH_SIZE, count - i * BATCH_SIZE);

        send({ type: "status", message: `Generating batch ${i + 1} of ${batches}...` });

        try {
          const result = await generateBatch(apiKey, technology, level, batchCount);
          modelUsed = result.modelUsed;
          send({
            type: "questions",
            questions: result.questions,
            model: modelUsed,
            batchIndex: i,
            totalBatches: batches,
          });
        } catch (err: any) {
          send({ type: "error", message: err.message ?? "Batch failed.", batchIndex: i });
        }

        if (i < batches - 1) await sleep(1500);
      }

      send({ type: "done", model: modelUsed });
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

async function generateBatch(
  apiKey: string,
  technology: string,
  level: string,
  count: number,
  attempt = 1
): Promise<{ questions: any[]; modelUsed: string }> {
  const MAX_RETRIES = 4;

  const prompt = `Generate exactly ${count} multiple choice questions about "${technology}" at ${level} difficulty.

OUTPUT RULES:
- Start your response with [ and end with ]
- No text before [, no text after ]
- No markdown, no code fences, no explanation

Each question:
{"title":"Question?","options":[{"text":"A","isCorrect":false},{"text":"B","isCorrect":true},{"text":"C","isCorrect":false},{"text":"D","isCorrect":false}]}`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openrouter/free",
        messages: [
          {
            role: "system",
            content: "You are a JSON quiz generator. Output only a valid JSON array starting with [ and ending with ]. No markdown, no explanation.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 8096,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://quiz-app-lvkc.vercel.app",
          "X-Title": "QuizApp",
        },
        timeout: 90000,
      }
    );

    const modelUsed: string = response.data?.model ?? "openrouter/free";
    const raw: string = response.data?.choices?.[0]?.message?.content ?? "";

    console.log(`Model: ${modelUsed}`);
    console.log(`Raw: ${raw.slice(0, 200)}`);

    if (!raw.trim()) {
      if (attempt < MAX_RETRIES) { await sleep(1000 * attempt); return generateBatch(apiKey, technology, level, count, attempt + 1); }
      throw new Error("Model returned empty response.");
    }

    const parsed = parseResponse(raw);
    if (!parsed || parsed.length === 0) {
      if (attempt < MAX_RETRIES) { await sleep(1000 * attempt); return generateBatch(apiKey, technology, level, count, attempt + 1); }
      throw new Error("Could not parse questions.");
    }

    const valid = parsed.filter(
      (q: any) =>
        q?.title &&
        Array.isArray(q?.options) &&
        q.options.length === 4 &&
        q.options.some((o: any) => o.isCorrect === true)
    );

    if (valid.length === 0) {
      if (attempt < MAX_RETRIES) { await sleep(1000 * attempt); return generateBatch(apiKey, technology, level, count, attempt + 1); }
      throw new Error("Questions had invalid format.");
    }

    return { questions: valid, modelUsed };

  } catch (err: any) {
    if (err.response?.status === 429) {
      if (attempt < MAX_RETRIES) {
        await sleep(attempt * 4000);
        return generateBatch(apiKey, technology, level, count, attempt + 1);
      }
      throw new Error("Rate limited. Wait a moment and try again.");
    }
    if (err.response?.status === 503 || err.response?.status === 502) {
      if (attempt < MAX_RETRIES) {
        await sleep(2000 * attempt);
        return generateBatch(apiKey, technology, level, count, attempt + 1);
      }
    }
    throw err;
  }
}

function parseResponse(raw: string): any[] | null {
  if (!raw) return null;

  let text = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  text = text.replace(/\]\s*,\s*"\s*}/g, "]}");
  text = text.replace(/,\s*}/g, "}");
  text = text.replace(/,\s*]/g, "]");

  const firstBracket = text.indexOf("[");
  if (firstBracket === -1) return null;

  const jsonString = text.slice(firstBracket);
  const lastBracket = jsonString.lastIndexOf("]");

  if (lastBracket !== -1) {
    try {
      const parsed = JSON.parse(jsonString.slice(0, lastBracket + 1));
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch { /* fall through */ }
  }

  // Recovery
  const results: any[] = [];
  const objectRegex = /\{[^{}]*"title"\s*:\s*"[^"]+"\s*,[^{}]*"options"\s*:\s*\[[^\]]+\][^{}]*\}/g;
  const matches = text.match(objectRegex);
  if (matches) {
    for (const match of matches) {
      try {
        const obj = JSON.parse(match.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]"));
        if (obj?.title && Array.isArray(obj?.options)) results.push(obj);
      } catch { continue; }
    }
  }
  return results.length > 0 ? results : null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}