"use client";

import { useState } from "react";
import {
  Sparkles,
  Loader2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Brain,
  Cpu,
  AlertCircle,
} from "lucide-react";
import {
  generateQuestionsStream,
  GeneratedQuestion,
} from "@/shared/lib/services/generate.service";

const TECHNOLOGIES = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js",
  "Python", "Django", "FastAPI", "SQL", "MongoDB",
  "CSS", "HTML", "Git", "Docker", "REST APIs",
  "Data Structures", "Algorithms", "System Design",
];

const LEVELS = [
  { value: "easy", label: "Easy", color: "bg-green-100 text-green-700 border-green-200" },
  { value: "medium", label: "Medium", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { value: "hard", label: "Hard", color: "bg-red-100 text-red-700 border-red-200" },
];

const COUNTS = [5, 10, 15, 20];

export default function GenerateQuestionsPage() {
  const [technology, setTechnology] = useState("");
  const [customTech, setCustomTech] = useState("");
  const [level, setLevel] = useState<"easy" | "medium" | "hard">("medium");
  const [count, setCount] = useState(10);

  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [usedModel, setUsedModel] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [allCopied, setAllCopied] = useState(false);

  const selectedTech = technology === "__custom__" ? customTech : technology;

  async function handleGenerate() {
    if (!selectedTech.trim()) {
      setErrors(["Please select or enter a technology."]);
      return;
    }

    // Reset state
    setQuestions([]);
    setErrors([]);
    setUsedModel(null);
    setIsDone(false);
    setExpandedIndex(null);
    setStatusMessage("Starting...");
    setIsGenerating(true);

    try {
      await generateQuestionsStream(
        { technology: selectedTech.trim(), level, count },
        {
          onStatus: (msg) => setStatusMessage(msg),

          onQuestions: (newQuestions, model) => {
            setUsedModel(model);
            setQuestions((prev) => {
              const updated = [...prev, ...newQuestions];
              // Auto-expand the first question of each batch
              if (prev.length === 0 && newQuestions.length > 0) {
                setExpandedIndex(0);
              }
              return updated;
            });
            setStatusMessage("");
          },

          onError: (msg, batchIndex) => {
            setErrors((prev) => [...prev, `Batch ${batchIndex + 1}: ${msg}`]);
          },

          onDone: (model) => {
            setUsedModel(model);
            setIsDone(true);
            setStatusMessage("");
            setIsGenerating(false);
          },
        }
      );
    } catch (err: any) {
      setErrors([err.message ?? "Something went wrong."]);
      setIsGenerating(false);
      setStatusMessage("");
    }
  }

  function copyQuestion(q: GeneratedQuestion, index: number) {
    const text = `Q: ${q.title}\n${q.options
      .map((o, i) => `${String.fromCharCode(65 + i)}. ${o.text}${o.isCorrect ? " ✓" : ""}`)
      .join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  function copyAll() {
    const text = questions
      .map(
        (q, i) =>
          `${i + 1}. ${q.title}\n${q.options
            .map((o, j) => `   ${String.fromCharCode(65 + j)}. ${o.text}${o.isCorrect ? " ✓" : ""}`)
            .join("\n")}`
      )
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFEDDF]">
          <Sparkles className="h-5 w-5 text-orange-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Generate Questions</h1>
          <p className="text-sm text-gray-500">
            Use AI to instantly generate multiple choice questions for your quizzes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* ── Left: Config ── */}
        <div className="space-y-5">

          {/* Technology */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-gray-700">Technology / Topic</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {TECHNOLOGIES.map((tech) => (
                <button
                  key={tech}
                  onClick={() => setTechnology(tech)}
                  disabled={isGenerating}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    technology === tech
                      ? "border-[#1B1D29] bg-[#1B1D29] text-white"
                      : "border-gray-200 text-gray-600 hover:border-gray-400"
                  } disabled:opacity-50`}
                >
                  {tech}
                </button>
              ))}
              <button
                onClick={() => setTechnology("__custom__")}
                disabled={isGenerating}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  technology === "__custom__"
                    ? "border-[#1B1D29] bg-[#1B1D29] text-white"
                    : "border-dashed border-gray-300 text-gray-500 hover:border-gray-400"
                } disabled:opacity-50`}
              >
                + Custom
              </button>
            </div>
            {technology === "__custom__" && (
              <input
                type="text"
                value={customTech}
                onChange={(e) => setCustomTech(e.target.value)}
                placeholder="e.g. GraphQL, Kubernetes, Vue.js..."
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-400"
              />
            )}
          </div>

          {/* Difficulty */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-gray-700">Difficulty Level</h2>
            <div className="flex gap-3">
              {LEVELS.map((l) => (
                <button
                  key={l.value}
                  onClick={() => setLevel(l.value as any)}
                  disabled={isGenerating}
                  className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition ${
                    level === l.value
                      ? l.color + " border-current"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  } disabled:opacity-50`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-gray-700">Number of Questions</h2>
            <div className="flex gap-3">
              {COUNTS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCount(c)}
                  disabled={isGenerating}
                  className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition ${
                    count === c
                      ? "border-[#1B1D29] bg-[#1B1D29] text-white"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  } disabled:opacity-50`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Model info */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                <Cpu size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">
                  Powered by OpenRouter Free Router
                </p>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Uses <span className="font-medium">openrouter/free</span> — automatically
                  picks the best available free model. Questions appear as each batch
                  of 5 is ready.
                </p>
                {usedModel && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-2">
                    <Brain size={14} className="text-blue-600 shrink-0" />
                    <p className="text-xs text-blue-800">
                      Model: <span className="font-bold">{usedModel}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1B1D29] py-4 text-sm font-semibold text-white hover:bg-black disabled:opacity-60 transition shadow-sm"
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {statusMessage || "Generating..."}
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate {count} Questions
              </>
            )}
          </button>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="space-y-2">
              {errors.map((err, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3"
                >
                  <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{err}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Results ── */}
        <div>
          {/* Empty state */}
          {!isGenerating && questions.length === 0 && errors.length === 0 && (
            <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFEDDF]">
                <Brain size={28} className="text-orange-400" />
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-1">No questions yet</p>
              <p className="text-xs text-gray-400">
                Configure your settings on the left and click Generate
              </p>
            </div>
          )}

          {/* Questions */}
          {questions.length > 0 && (
            <div>
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-gray-900">
                      {questions.length} of {count} questions
                    </p>
                    {isGenerating && (
                      <span className="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-600">
                        <Loader2 size={10} className="animate-spin" />
                        {statusMessage || "Loading more..."}
                      </span>
                    )}
                    {isDone && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-600">
                        Done
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {selectedTech} · {level}
                  </p>
                </div>
                <button
                  onClick={copyAll}
                  className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 shadow-sm"
                >
                  {allCopied ? (
                    <><Check size={12} className="text-green-500" /> Copied!</>
                  ) : (
                    <><Copy size={12} /> Copy all</>
                  )}
                </button>
              </div>

              <div className="space-y-2">
                {questions.map((q, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-gray-100 bg-white overflow-hidden shadow-sm animate-fadeIn"
                  >
                    <div
                      className="flex cursor-pointer items-start justify-between px-4 py-3 hover:bg-gray-50"
                      onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                    >
                      <p className="flex-1 pr-4 text-sm font-medium text-gray-900">
                        <span className="mr-2 text-xs font-bold text-gray-400">{i + 1}.</span>
                        {q.title}
                      </p>
                      <div className="flex items-center gap-2 shrink-0 mt-0.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); copyQuestion(q, i); }}
                          className="text-gray-300 hover:text-gray-600 transition-colors"
                        >
                          {copiedIndex === i ? (
                            <Check size={14} className="text-green-500" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                        {expandedIndex === i ? (
                          <ChevronUp size={16} className="text-gray-400" />
                        ) : (
                          <ChevronDown size={16} className="text-gray-400" />
                        )}
                      </div>
                    </div>

                    {expandedIndex === i && (
                      <div className="border-t border-gray-100 px-4 py-3 space-y-2 bg-gray-50/50">
                        {q.options.map((opt, j) => (
                          <div
                            key={j}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                              opt.isCorrect
                                ? "bg-green-50 border border-green-200 text-green-800"
                                : "bg-white border border-gray-100 text-gray-700"
                            }`}
                          >
                            <span
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                opt.isCorrect
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {String.fromCharCode(65 + j)}
                            </span>
                            <span className="flex-1">{opt.text}</span>
                            {opt.isCorrect && (
                              <span className="text-xs font-semibold text-green-600">Correct</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading skeleton for next batch */}
                {isGenerating && (
                  <div className="space-y-2 mt-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="rounded-xl border border-gray-100 bg-white p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-3 w-6 animate-pulse rounded bg-gray-100" />
                          <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Loading state before first batch arrives */}
          {isGenerating && questions.length === 0 && (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-100 bg-white p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-3 w-6 animate-pulse rounded bg-gray-100" />
                    <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100" />
                  </div>
                  <div className="space-y-2 pl-4">
                    {[0, 1, 2, 3].map((j) => (
                      <div key={j} className="h-2.5 w-full animate-pulse rounded bg-gray-50" />
                    ))}
                  </div>
                </div>
              ))}
              <p className="text-center text-xs text-gray-400 py-2">
                {statusMessage || "Warming up AI model..."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}