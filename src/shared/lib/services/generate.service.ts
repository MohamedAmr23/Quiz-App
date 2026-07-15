export interface GenerateQuestionsParams {
  technology: string;
  level: "easy" | "medium" | "hard";
  count: number;
}

export interface GeneratedQuestion {
  title: string;
  options: { text: string; isCorrect: boolean }[];
}

export interface GenerateQuestionsResult {
  questions: GeneratedQuestion[];
  model: string | null;
}

export async function generateQuestions(
  params: GenerateQuestionsParams
): Promise<GenerateQuestionsResult> {
  const res = await fetch("/api/generate-questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to generate questions.");
  }

  return {
    questions: data.questions,
    model: data.model ?? null,
  };
}