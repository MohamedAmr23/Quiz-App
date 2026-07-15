export interface GenerateQuestionsParams {
  technology: string;
  level: "easy" | "medium" | "hard";
  count: number;
}

export interface GeneratedQuestion {
  title: string;
  options: { text: string; isCorrect: boolean }[];
}

export interface StreamCallbacks {
  onQuestions: (questions: GeneratedQuestion[], model: string) => void;
  onStatus: (message: string) => void;
  onError: (message: string, batchIndex: number) => void;
  onDone: (model: string) => void;
}

export async function generateQuestionsStream(
  params: GenerateQuestionsParams,
  callbacks: StreamCallbacks
): Promise<void> {
  const res = await fetch("/api/generate-questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok || !res.body) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error ?? "Failed to start generation.");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      try {
        const event = JSON.parse(line.slice(6));

        if (event.type === "questions") {
          callbacks.onQuestions(event.questions, event.model);
        } else if (event.type === "status") {
          callbacks.onStatus(event.message);
        } else if (event.type === "error") {
          callbacks.onError(event.message, event.batchIndex);
        } else if (event.type === "done") {
          callbacks.onDone(event.model);
        }
      } catch {
        continue;
      }
    }
  }
}