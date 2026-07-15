import { NextRequest } from "next/server";
import axios from "axios";
import https from "https";

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

  // Server-Sent Events stream
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

        send({
          type: "status",
          message: `Generating batch ${i + 1} of ${batches}...`,
        });

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
          send({
            type: "error",
            message: err.message ?? "Batch failed. Skipping.",
            batchIndex: i,
          });
        }

        if (i < batches - 1) {
          await sleep(1500);
        }
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

  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
    keepAlive: false,
  });

  const prompt = `Generate exactly ${count} multiple choice questions about "${technology}" at ${level} difficulty.

OUTPUT RULES:
- Start your response with [ and end with ]
- No text before [, no text after ]
- No markdown, no code fences, no explanation

Each question:
{"title":"Question?","options":[{"text":"A","isCorrect":false},{"text":"B","isCorrect":true},{"text":"C","isCorrect":false},{"text":"D","isCorrect":false}]}

Example:
[
  {"title":"Example?","options":[{"text":"Wrong","isCorrect":false},{"text":"Correct","isCorrect":true},{"text":"Wrong","isCorrect":false},{"text":"Wrong","isCorrect":false}]}
]`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openrouter/free",
        messages: [
          {
            role: "system",
            content:
              "You are a JSON quiz generator. Your entire response must be a valid JSON array starting with [ and ending with ]. Never add text outside the array.",
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
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "QuizApp",
          Connection: "close",
        },
        timeout: 90000,
        httpsAgent,
      }
    );

    const modelUsed: string = response.data?.model ?? "openrouter/free";
    const raw: string = response.data?.choices?.[0]?.message?.content ?? "";
    const finishReason: string = response.data?.choices?.[0]?.finish_reason ?? "";

    console.log(`Model: ${modelUsed} | finish: ${finishReason}`);
    console.log(`Raw: ${raw.slice(0, 200)}`);

    if (!raw.trim()) {
      if (attempt < MAX_RETRIES) {
        await sleep(1000 * attempt);
        return generateBatch(apiKey, technology, level, count, attempt + 1);
      }
      throw new Error("Model returned empty response.");
    }

    const parsed = parseResponse(raw);

    if (!parsed || parsed.length === 0) {
      if (attempt < MAX_RETRIES) {
        await sleep(1000 * attempt);
        return generateBatch(apiKey, technology, level, count, attempt + 1);
      }
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
      if (attempt < MAX_RETRIES) {
        await sleep(1000 * attempt);
        return generateBatch(apiKey, technology, level, count, attempt + 1);
      }
      throw new Error("Questions had invalid format.");
    }

    return { questions: valid, modelUsed };
  } catch (err: any) {
    if (err.response?.status === 429) {
      if (attempt < MAX_RETRIES) {
        const wait = attempt * 4000;
        console.log(`429 rate limit, waiting ${wait}ms...`);
        await sleep(wait);
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

  let text = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  text = text.replace(/\]\s*,\s*"\s*}/g, "]}");
  text = text.replace(/\]\s*,\s*"\s*,/g, "],");
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
    } catch {
      // fall through to recovery
    }
  }

  return recoverPartialJson(jsonString);
}

function recoverPartialJson(text: string): any[] | null {
  const results: any[] = [];
  const objectRegex =
    /\{[^{}]*"title"\s*:\s*"[^"]+"\s*,[^{}]*"options"\s*:\s*\[[^\]]+\][^{}]*\}/g;
  const matches = text.match(objectRegex);

  if (matches) {
    for (const match of matches) {
      try {
        const fixed = match
          .replace(/,\s*}/g, "}")
          .replace(/,\s*]/g, "]")
          .replace(/\]\s*,\s*"\s*}/g, "]}");
        const obj = JSON.parse(fixed);
        if (obj?.title && Array.isArray(obj?.options)) results.push(obj);
      } catch {
        continue;
      }
    }
  }

  return results.length > 0 ? results : null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}




// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";
// import https from "https";

// const BATCH_SIZE = 3; // Smaller batches = less tokens = less truncation

// export async function POST(req: NextRequest) {
//   try {
//     const { technology, level, count } = await req.json();

//     const apiKey = process.env.OPENROUTER_API_KEY;
//     if (!apiKey) {
//       return NextResponse.json(
//         { error: "OPENROUTER_API_KEY is not set in .env.local" },
//         { status: 500 }
//       );
//     }

//     const batches = Math.ceil(count / BATCH_SIZE);
//     const allQuestions: any[] = [];
//     let modelUsed = "openrouter/free";

//     console.log(`Generating ${count} questions in ${batches} batches of max ${BATCH_SIZE}...`);

//     for (let i = 0; i < batches; i++) {
//       const batchCount = Math.min(BATCH_SIZE, count - i * BATCH_SIZE);
//       console.log(`Batch ${i + 1}/${batches}: generating ${batchCount} questions...`);

//       const result = await generateBatch(apiKey, technology, level, batchCount);
//       modelUsed = result.modelUsed;
//       allQuestions.push(...result.questions);

//       if (i < batches - 1) {
//         await sleep(1500);
//       }
//     }

//     if (allQuestions.length === 0) {
//       return NextResponse.json(
//         { error: "No questions generated. Try again." },
//         { status: 422 }
//       );
//     }

//     console.log(`Total questions generated: ${allQuestions.length}`);
//     return NextResponse.json({ questions: allQuestions, model: modelUsed });

//   } catch (err: any) {
//     console.error("Route error:", err.message);

//     if (err.code === "ENOTFOUND" || err.code === "ECONNREFUSED" || err.code === "ECONNRESET") {
//       return NextResponse.json(
//         { error: "Network error reaching OpenRouter. Try again." },
//         { status: 503 }
//       );
//     }

//     if (err.code === "ECONNABORTED") {
//       return NextResponse.json(
//         { error: "Request timed out. Try again." },
//         { status: 408 }
//       );
//     }

//     if (axios.isAxiosError(err)) {
//       const status = err.response?.status ?? 500;
//       const message =
//         err.response?.data?.error?.message ??
//         err.response?.data?.error ??
//         err.message;
//       return NextResponse.json({ error: `OpenRouter: ${message}` }, { status });
//     }

//     return NextResponse.json(
//       { error: err.message ?? "Something went wrong." },
//       { status: 500 }
//     );
//   }
// }

// async function generateBatch(
//   apiKey: string,
//   technology: string,
//   level: string,
//   count: number,
//   attempt = 1
// ): Promise<{ questions: any[]; modelUsed: string }> {
//   const MAX_RETRIES = 4;

//   const httpsAgent = new https.Agent({
//     rejectUnauthorized: false,
//     keepAlive: false,
//   });

//   const prompt = `Generate exactly ${count} multiple choice questions about "${technology}" at ${level} difficulty.

// OUTPUT RULES:
// - Start your response with [ and end with ]
// - No text before [
// - No text after ]
// - No markdown, no code fences, no explanation

// Each question object:
// {"title":"Question?","options":[{"text":"A","isCorrect":false},{"text":"B","isCorrect":true},{"text":"C","isCorrect":false},{"text":"D","isCorrect":false}]}

// Full example for ${count} question(s):
// [
//   {"title":"Example question?","options":[{"text":"Wrong","isCorrect":false},{"text":"Correct","isCorrect":true},{"text":"Wrong","isCorrect":false},{"text":"Wrong","isCorrect":false}]}
// ]`;

//   try {
//     const response = await axios.post(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         model: "openrouter/free",
//         messages: [
//           {
//             role: "system",
//             content:
//               "You are a JSON quiz generator. Your entire response must be a single valid JSON array starting with [ and ending with ]. Never add text outside the array.",
//           },
//           {
//             role: "user",
//             content: prompt,
//           },
//         ],
//         temperature: 0.3,
//         max_tokens: 8096, // High enough for 3 detailed questions
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${apiKey}`,
//           "Content-Type": "application/json",
//           "HTTP-Referer": "http://localhost:3000",
//           "X-Title": "QuizApp",
//           Connection: "close",
//         },
//         timeout: 90000,
//         httpsAgent,
//       }
//     );

//     const modelUsed: string = response.data?.model ?? "openrouter/free";
//     const raw: string = response.data?.choices?.[0]?.message?.content ?? "";
//     const finishReason: string = response.data?.choices?.[0]?.finish_reason ?? "";

//     console.log(`Model: ${modelUsed} | finish_reason: ${finishReason}`);
//     console.log(`Raw (first 300): ${raw.slice(0, 300)}`);

//     // Empty response — retry
//     if (!raw.trim()) {
//       if (attempt < MAX_RETRIES) {
//         console.log(`Empty response, retry ${attempt + 1}...`);
//         await sleep(1000 * attempt);
//         return generateBatch(apiKey, technology, level, count, attempt + 1);
//       }
//       throw new Error("Model kept returning empty responses.");
//     }

//     const parsed = parseResponse(raw, finishReason === "length");

//     if (!parsed || parsed.length === 0) {
//       if (attempt < MAX_RETRIES) {
//         console.log(`Parse failed, retry ${attempt + 1}...`);
//         await sleep(1000 * attempt);
//         return generateBatch(apiKey, technology, level, count, attempt + 1);
//       }
//       throw new Error("Could not parse questions after retries.");
//     }

//     const valid = parsed.filter(
//       (q: any) =>
//         q?.title &&
//         Array.isArray(q?.options) &&
//         q.options.length === 4 &&
//         q.options.some((o: any) => o.isCorrect === true)
//     );

//     if (valid.length === 0) {
//       if (attempt < MAX_RETRIES) {
//         console.log(`No valid questions, retry ${attempt + 1}...`);
//         await sleep(1000 * attempt);
//         return generateBatch(apiKey, technology, level, count, attempt + 1);
//       }
//       throw new Error("Questions had invalid format after retries.");
//     }

//     console.log(`Batch success: ${valid.length} valid questions`);
//     return { questions: valid, modelUsed };

//   } catch (err: any) {
//     // 429 rate limit — wait longer and retry
//     if (err.response?.status === 429) {
//       if (attempt < MAX_RETRIES) {
//         const waitTime = attempt * 4000; // 4s, 8s, 12s, 16s
//         console.log(`Rate limited (429), waiting ${waitTime}ms then retrying...`);
//         await sleep(waitTime);
//         return generateBatch(apiKey, technology, level, count, attempt + 1);
//       }
//       throw new Error("Rate limited by OpenRouter after multiple retries. Wait a moment and try again.");
//     }

//     // 503 / 502 — model unavailable, retry
//     if (err.response?.status === 503 || err.response?.status === 502) {
//       if (attempt < MAX_RETRIES) {
//         console.log(`Model unavailable (${err.response.status}), retry ${attempt + 1}...`);
//         await sleep(2000 * attempt);
//         return generateBatch(apiKey, technology, level, count, attempt + 1);
//       }
//     }

//     throw err;
//   }
// }

// function parseResponse(raw: string, wasTruncated: boolean): any[] | null {
//   if (!raw) return null;

//   let text = raw
//     .replace(/```json/gi, "")
//     .replace(/```/g, "")
//     .trim();

//   // Fix stray quote bug from some models: `],"}` → `]}`
//   text = text.replace(/\]\s*,\s*"\s*}/g, "]}");
//   text = text.replace(/\]\s*,\s*"\s*,/g, "],");

//   // Remove trailing commas
//   text = text.replace(/,\s*}/g, "}");
//   text = text.replace(/,\s*]/g, "]");

//   const firstBracket = text.indexOf("[");
//   if (firstBracket === -1) return null;

//   let jsonString = text.slice(firstBracket);

//   // Try full parse first
//   const lastBracket = jsonString.lastIndexOf("]");
//   if (lastBracket !== -1) {
//     const full = jsonString.slice(0, lastBracket + 1);
//     try {
//       const parsed = JSON.parse(full);
//       if (Array.isArray(parsed)) return parsed;
//     } catch {
//       // fall through to truncation recovery
//     }
//   }

//   // If truncated or full parse failed — recover complete questions
//   // Find the last complete question object by finding last `}]` or `}`
//   // Strategy: trim to last complete `}` then close the array
//   if (wasTruncated || true) {
//     const recovered = recoverPartialJson(jsonString);
//     if (recovered) return recovered;
//   }

//   return null;
// }

// function recoverPartialJson(text: string): any[] | null {
//   // Find all complete question objects by splitting on },{ boundary
//   // We look for every complete {...} block that has title and options

//   const results: any[] = [];

//   // Match each complete JSON object in the array
//   const objectRegex = /\{[^{}]*"title"\s*:\s*"[^"]+"\s*,[^{}]*"options"\s*:\s*\[[^\]]+\][^{}]*\}/g;
//   const matches = text.match(objectRegex);

//   if (matches && matches.length > 0) {
//     for (const match of matches) {
//       try {
//         // Fix trailing commas inside the object
//         const fixed = match
//           .replace(/,\s*}/g, "}")
//           .replace(/,\s*]/g, "]")
//           .replace(/\]\s*,\s*"\s*}/g, "]}");
//         const obj = JSON.parse(fixed);
//         if (obj?.title && Array.isArray(obj?.options)) {
//           results.push(obj);
//         }
//       } catch {
//         continue;
//       }
//     }
//   }

//   return results.length > 0 ? results : null;
// }

// function sleep(ms: number): Promise<void> {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }



