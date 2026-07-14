"use client";

import { useState } from "react";
import { Sparkles, Loader2, Copy, CheckCheck, RefreshCw } from "lucide-react";

interface GeneratedQuestion {
  title: string;
  description: string;
  options: { A: string; B: string; C: string; D: string };
  answer: "A" | "B" | "C" | "D";
  explanation: string;
}

const TECHNOLOGIES = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js",
  "Express.js", "Python", "CSS", "HTML", "SQL",
  "MongoDB", "REST APIs", "GraphQL", "Docker", "Git",
];

const LEVELS = [
  { value: "easy", label: "Easy", desc: "Beginner friendly, basic concepts" },
  { value: "medium", label: "Medium", desc: "Intermediate, requires some experience" },
  { value: "hard", label: "Hard", desc: "Advanced, deep knowledge required" },
];

export default function GenerateQuestionPage() {
  const [technology, setTechnology] = useState("");
  const [customTech, setCustomTech] = useState("");
  const [level, setLevel] = useState("");
  const [count, setCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  const selectedTech = technology === "custom" ? customTech : technology;

  async function handleGenerate() {
    if (!selectedTech.trim()) {
      setError("Please select or enter a technology.");
      return;
    }
    if (!level) {
      setError("Please select a difficulty level.");
      return;
    }

    setError(null);
    setIsLoading(true);
    setQuestions([]);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Generate ${count} multiple-choice quiz question${count > 1 ? "s" : ""} about ${selectedTech} at ${level} difficulty level.

Return ONLY a valid JSON array with no extra text, markdown, or explanation. Each object must have exactly this shape:
{
  "title": "short topic label",
  "description": "the full question text",
  "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
  "answer": "A" | "B" | "C" | "D",
  "explanation": "why the answer is correct"
}`,
            },
          ],
        }),
      });

      const data = await response.json();
      const text = data.content?.[0]?.text ?? "";

      // strip markdown fences if present
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed: GeneratedQuestion[] = JSON.parse(clean);
      setQuestions(Array.isArray(parsed) ? parsed : [parsed]);
    } catch {
      setError("Failed to generate questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleCopy(index: number, q: GeneratedQuestion) {
    navigator.clipboard.writeText(
      `Q: ${q.description}\nA) ${q.options.A}\nB) ${q.options.B}\nC) ${q.options.C}\nD) ${q.options.D}\nAnswer: ${q.answer}\nExplanation: ${q.explanation}`
    );
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="min-h-screen px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-blue-100">
            <Sparkles size={20} className="text-purple-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Generate Question
            </h1>
            <p className="text-xs text-gray-400">
              AI-powered quiz question generator
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* ── Left: controls ── */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="mb-5 text-sm font-medium text-gray-700">
              Configuration
            </p>

            {/* Technology */}
            <div className="mb-5">
              <label className="mb-2 block text-xs font-medium text-gray-600">
                Technology / Topic
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TECHNOLOGIES.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => { setTechnology(tech); setCustomTech(""); }}
                    className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition ${
                      technology === tech
                        ? "border-purple-300 bg-purple-50 text-purple-700"
                        : "border-gray-100 text-gray-600 hover:border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {tech}
                  </button>
                ))}
                <button
                  onClick={() => setTechnology("custom")}
                  className={`col-span-2 rounded-lg border px-3 py-2 text-left text-xs font-medium transition ${
                    technology === "custom"
                      ? "border-purple-300 bg-purple-50 text-purple-700"
                      : "border-gray-100 text-gray-600 hover:border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  ✏️ Other (type below)
                </button>
              </div>

              {technology === "custom" && (
                <input
                  type="text"
                  value={customTech}
                  onChange={(e) => setCustomTech(e.target.value)}
                  placeholder="e.g. Redis, Kubernetes..."
                  className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-purple-300"
                />
              )}
            </div>

            {/* Difficulty level */}
            <div className="mb-5">
              <label className="mb-2 block text-xs font-medium text-gray-600">
                Difficulty Level
              </label>
              <div className="space-y-2">
                {LEVELS.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLevel(l.value)}
                    className={`w-full rounded-xl border p-3 text-left transition ${
                      level === l.value
                        ? "border-purple-300 bg-purple-50"
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <p className={`text-sm font-medium ${
                      level === l.value ? "text-purple-700" : "text-gray-700"
                    }`}>
                      {l.label}
                    </p>
                    <p className="text-[11px] text-gray-400">{l.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Number of questions */}
            <div className="mb-6">
              <label className="mb-2 block text-xs font-medium text-gray-600">
                Number of questions
              </label>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setCount(n)}
                    className={`h-9 w-9 rounded-lg border text-sm font-medium transition ${
                      count === n
                        ? "border-purple-300 bg-purple-50 text-purple-700"
                        : "border-gray-100 text-gray-600 hover:border-gray-200"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="mb-3 text-xs text-red-500">{error}</p>}

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Right: results ── */}
        <div className="lg:col-span-2">
          {/* Empty state */}
          {!isLoading && questions.length === 0 && (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-blue-100">
                <Sparkles size={28} className="text-purple-500" />
              </div>
              <p className="text-sm font-medium text-gray-600">
                Your questions will appear here
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Select a technology and difficulty, then click Generate
              </p>
            </div>
          )}

          {/* Loading skeleton */}
          {isLoading && (
            <div className="space-y-4">
              {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="mb-4 h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                  <div className="mb-2 h-3 w-full animate-pulse rounded bg-gray-100" />
                  <div className="mb-4 h-3 w-2/3 animate-pulse rounded bg-gray-100" />
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-8 animate-pulse rounded-lg bg-gray-100" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Questions */}
          {!isLoading && questions.length > 0 && (
            <div className="space-y-4">
              {/* Regenerate bar */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {questions.length} question{questions.length > 1 ? "s" : ""} generated for{" "}
                  <span className="font-medium text-gray-900">{selectedTech}</span>
                  {" "}·{" "}
                  <span className="capitalize">{level}</span>
                </p>
                <button
                  onClick={handleGenerate}
                  className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  <RefreshCw size={12} />
                  Regenerate
                </button>
              </div>

              {questions.map((q, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  {/* Question header */}
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[11px] font-bold text-purple-600">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                          {q.title}
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-gray-900">
                          {q.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(i, q)}
                      className="flex shrink-0 items-center gap-1 rounded-lg border border-gray-100 px-2 py-1 text-[11px] text-gray-400 transition hover:border-gray-200 hover:text-gray-600"
                    >
                      {copied === i ? (
                        <CheckCheck size={12} className="text-green-500" />
                      ) : (
                        <Copy size={12} />
                      )}
                      {copied === i ? "Copied" : "Copy"}
                    </button>
                  </div>

                  {/* Options */}
                  <div className="mb-4 grid grid-cols-2 gap-2">
                    {(["A", "B", "C", "D"] as const).map((key) => (
                      <div
                        key={key}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs ${
                          q.answer === key
                            ? "border-green-200 bg-green-50 font-medium text-green-700"
                            : "border-gray-100 text-gray-600"
                        }`}
                      >
                        <span className="font-bold">{key}</span>
                        <span>{q.options[key]}</span>
                      </div>
                    ))}
                  </div>

                  {/* Explanation */}
                  <div className="rounded-xl bg-blue-50 px-4 py-3">
                    <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-400">
                      Explanation
                    </p>
                    <p className="text-xs leading-relaxed text-blue-700">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}