"use client";

import { useState } from "react";
import {
  X, Loader2, ArrowRight, ArrowLeft,
  CheckCircle2, XCircle, Clock,
  BookOpen, Target, BarChart3,
} from "lucide-react";
import { axiosClient } from "@/shared/lib/apis/axiosClient";

// ── Types ──────────────────────────────────────────────────────────────────────

interface JoinQuizModalProps {
  onClose: () => void;
}

interface QuizOption {
  A: string; B: string; C: string; D: string; _id: string;
}

interface QuizQuestion {
  _id: string; title: string; options: QuizOption;
}

interface QuizData {
  _id: string; title: string; description: string;
  duration: number; questions_number: number;
  score_per_question: number; difficulty: string;
  questions: QuizQuestion[];
}

interface JoinResponse {
  message?: string;
  data?: { _id?: string; quiz?: string | { _id?: string } };
}

interface SubmitQuestion {
  _id: string; title: string; options: QuizOption; answer: string;
}

interface SubmitResult {
  score: number; questions: SubmitQuestion[];
}

interface SubmitResponse {
  data: SubmitResult; message?: string;
}

type Step = "code" | "quiz" | "result";
type OptionKey = "A" | "B" | "C" | "D";
const OPTION_KEYS: OptionKey[] = ["A", "B", "C", "D"];

function getQuizId(joinData: JoinResponse): string | null {
  const q = joinData?.data?.quiz;
  return typeof q === "string" ? q : (q as { _id?: string })?._id ?? null;
}

// ── QuizPage ──────────────────────────────────────────────────────────────────

function QuizPage({
  quiz, answers, currentQ,
  onAnswer, onNext, onPrev, onSubmit,
  isSubmitting, error,
}: {
  quiz: QuizData;
  answers: Record<string, string>;
  currentQ: number;
  onAnswer: (qId: string, letter: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  error: string | null;
}) {
  const question = quiz.questions[currentQ];
  const total = quiz.questions.length;
  const isLast = currentQ === total - 1;
  const answeredCount = Object.keys(answers).length;
  const progress = ((currentQ + 1) / total) * 100;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#F7F8FA]">
      {/* Top bar */}
      <header className="flex items-center gap-4 border-b border-gray-200 bg-white px-6 py-3 shadow-sm">
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold text-[#1B1D29]">{quiz.title}</span>
          <div className="mt-0.5 flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Clock size={11} /> {quiz.duration} min</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Target size={11} /> {quiz.score_per_question} pts / Q</span>
            <span>·</span>
            <span className="capitalize">{quiz.difficulty}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="rounded-lg bg-[#1B1D29]/5 px-3 py-1.5 text-xs font-semibold text-[#1B1D29]">
            {currentQ + 1} / {total}
          </span>
          <span className="text-xs text-gray-400">{answeredCount} answered</span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 w-full bg-gray-200">
        <div
          className="h-full bg-[#1B1D29] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question dots */}
      <div className="flex items-center justify-center gap-1.5 border-b border-gray-100 bg-white px-6 py-2.5">
        {quiz.questions.map((q, i) => (
          <div
            key={q._id}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentQ
                ? "w-6 bg-[#1B1D29]"
                : answers[q._id]
                ? "w-2 bg-[#1B1D29]/50"
                : "w-2 bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Question card */}
      <div className="flex flex-1 items-start justify-center overflow-y-auto px-4 py-8">
        <div className="w-full max-w-2xl">
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-full bg-[#1B1D29] px-3 py-1 text-xs font-semibold text-white">
              Question {currentQ + 1}
            </span>
            {answers[question._id] && (
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                Answered
              </span>
            )}
          </div>

          <h2 className="mb-7 text-xl font-semibold leading-relaxed text-[#1B1D29]">
            {question.title}
          </h2>

          <div className="flex flex-col gap-3">
            {OPTION_KEYS.map((letter) => {
              const selected = answers[question._id] === letter;
              return (
                <button
                  key={letter}
                  onClick={() => onAnswer(question._id, letter)}
                  className={`group flex w-full items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left transition-all duration-150 ${
                    selected
                      ? "border-[#1B1D29] bg-[#1B1D29] shadow-md"
                      : "border-gray-200 bg-white hover:border-[#1B1D29]/30 hover:bg-[#1B1D29]/[0.02]"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-colors ${
                      selected
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-500 group-hover:bg-[#1B1D29]/10 group-hover:text-[#1B1D29]"
                    }`}
                  >
                    {letter}
                  </span>
                  <span
                    className={`text-sm font-medium leading-snug transition-colors ${
                      selected ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {question.options[letter]}
                  </span>
                  {selected && (
                    <CheckCircle2 size={18} className="ml-auto shrink-0 text-white/80" />
                  )}
                </button>
              );
            })}
          </div>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          )}
        </div>
      </div>

      {/* Footer nav */}
      <footer className="border-t border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <button
            onClick={onPrev}
            disabled={currentQ === 0}
            className="flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-30"
          >
            <ArrowLeft size={15} /> Previous
          </button>

          {isLast ? (
            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-[#1B1D29] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
              {isSubmitting ? "Submitting…" : "Submit Quiz"}
            </button>
          ) : (
            <button
              onClick={onNext}
              className="flex items-center gap-2 rounded-xl bg-[#1B1D29] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
            >
              Next <ArrowRight size={15} />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

// ── ResultPage ────────────────────────────────────────────────────────────────

function ResultPage({
  quiz, result, studentAnswers, onClose,
}: {
  quiz: QuizData;
  result: SubmitResult;
  studentAnswers: Record<string, string>;
  onClose: () => void;
}) {
  const maxScore = quiz.questions_number * quiz.score_per_question;
  const pct = Math.round((result.score / maxScore) * 100);
  const correctCount = result.questions.filter((q) => studentAnswers[q._id] === q.answer).length;
  const wrongCount = result.questions.filter((q) => studentAnswers[q._id] && studentAnswers[q._id] !== q.answer).length;
  const skippedCount = result.questions.filter((q) => !studentAnswers[q._id]).length;
  const passed = pct >= 60;

  const [activeTab, setActiveTab] = useState<"all" | "correct" | "wrong">("all");

  const filtered = result.questions.filter((q) => {
    if (activeTab === "correct") return studentAnswers[q._id] === q.answer;
    if (activeTab === "wrong") return studentAnswers[q._id] !== q.answer;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#F7F8FA]">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1B1D29]">
            <BarChart3 size={17} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1B1D29]">Results — {quiz.title}</p>
            <p className="text-xs text-gray-400 capitalize">{quiz.difficulty} · {quiz.score_per_question} pts / question</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50"
        >
          <X size={15} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-4 py-8">

          {/* Score hero */}
          <div className={`relative mb-6 overflow-hidden rounded-3xl p-6 ${passed ? "bg-[#1B1D29]" : "bg-[#2D1B1B]"}`}>
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white opacity-5" />
            <div className="absolute -bottom-12 -left-4 h-32 w-32 rounded-full bg-white opacity-5" />
            <div className="relative flex items-center gap-5">
              {/* SVG circle score */}
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <circle
                    cx="48" cy="48" r="40" fill="none"
                    stroke={passed ? "#4ade80" : "#f87171"}
                    strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - pct / 100)}`}
                  />
                </svg>
                <span className="text-2xl font-bold text-white">{pct}%</span>
              </div>
              <div>
                <p className={`text-xs font-semibold uppercase tracking-widest ${passed ? "text-green-400" : "text-red-400"}`}>
                  {passed ? "✓ Passed" : "✗ Not passed"}
                </p>
                <p className="mt-1 text-3xl font-bold text-white">
                  {result.score} <span className="text-lg font-normal text-white/50">/ {maxScore}</span>
                </p>
                <p className="mt-1 text-sm text-white/60">
                  {passed ? "Well done! You cleared the 60% passing threshold." : "You need 60% to pass. Keep practicing."}
                </p>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="mb-6 grid grid-cols-3 gap-3">
            {[
              { label: "Correct", count: correctCount, icon: <CheckCircle2 size={22} className="text-green-500" />, tab: "correct" as const, active: "border-green-400 bg-green-50", hover: "hover:border-green-200" },
              { label: "Wrong", count: wrongCount, icon: <XCircle size={22} className="text-red-500" />, tab: "wrong" as const, active: "border-red-400 bg-red-50", hover: "hover:border-red-200" },
              { label: "Skipped", count: skippedCount, icon: <BookOpen size={22} className="text-gray-400" />, tab: null, active: "", hover: "" },
            ].map(({ label, count, icon, tab, active, hover }) => (
              <button
                key={label}
                onClick={() => tab && setActiveTab(activeTab === tab ? "all" : tab)}
                className={`flex flex-col items-center rounded-2xl border-2 p-4 transition-all ${
                  tab && activeTab === tab ? active : `border-gray-100 bg-white ${hover}`
                } ${tab ? "cursor-pointer" : "cursor-default"}`}
              >
                <div className="mb-1.5">{icon}</div>
                <span className="text-2xl font-bold text-gray-900">{count}</span>
                <span className="text-xs text-gray-500">{label}</span>
              </button>
            ))}
          </div>

          {/* Accuracy bar */}
          <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Accuracy</span>
              <span className="text-xs font-bold text-gray-700">{correctCount}/{result.questions.length} correct</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="flex h-full overflow-hidden rounded-full">
                <div className="h-full bg-green-400 transition-all duration-700" style={{ width: `${(correctCount / result.questions.length) * 100}%` }} />
                <div className="h-full bg-red-400 transition-all duration-700" style={{ width: `${(wrongCount / result.questions.length) * 100}%` }} />
              </div>
            </div>
            <div className="mt-2 flex gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-green-400" /> Correct</span>
              <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-red-400" /> Wrong</span>
              <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-gray-200" /> Skipped</span>
            </div>
          </div>

          {/* Filter tabs + review */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-[#1B1D29]">Answer Review</p>
            <div className="flex rounded-xl border border-gray-200 bg-white p-1 text-xs">
              {(["all", "correct", "wrong"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-3 py-1.5 font-medium capitalize transition-all ${
                    activeTab === tab ? "bg-[#1B1D29] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {filtered.map((q) => {
              const studentAns = studentAnswers[q._id] ?? null;
              const correctAns = q.answer as OptionKey;
              const isCorrect = studentAns === correctAns;
              const isSkipped = !studentAns;
              const qIndex = result.questions.indexOf(q);

              return (
                <div
                  key={q._id}
                  className={`rounded-2xl border-2 bg-white p-5 ${
                    isCorrect ? "border-green-200" : isSkipped ? "border-gray-100" : "border-red-200"
                  }`}
                >
                  <div className="mb-4 flex items-start gap-3">
                    <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isCorrect ? "bg-green-100 text-green-700" : isSkipped ? "bg-gray-100 text-gray-500" : "bg-red-100 text-red-700"
                    }`}>
                      {qIndex + 1}
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-gray-800">{q.title}</p>
                    <div className="ml-auto shrink-0">
                      {isCorrect ? <CheckCircle2 size={18} className="text-green-500" /> : isSkipped ? <div className="h-4 w-4 rounded-full border-2 border-gray-300" /> : <XCircle size={18} className="text-red-500" />}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {OPTION_KEYS.map((letter) => {
                      const isThisCorrect = letter === correctAns;
                      const isThisWrongStudent = letter === studentAns && !isCorrect;
                      const isThisRightStudent = letter === studentAns && isCorrect;

                      return (
                        <div
                          key={letter}
                          className={`flex items-center gap-3 rounded-xl px-4 py-2.5 ${
                            isThisCorrect ? "bg-green-50 ring-1 ring-green-300"
                            : isThisWrongStudent ? "bg-red-50 ring-1 ring-red-300"
                            : "bg-gray-50"
                          }`}
                        >
                          <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                            isThisCorrect ? "bg-green-200 text-green-800"
                            : isThisWrongStudent ? "bg-red-200 text-red-800"
                            : "bg-gray-200 text-gray-500"
                          }`}>
                            {letter}
                          </span>
                          <span className={`text-sm ${
                            isThisCorrect ? "font-semibold text-green-800"
                            : isThisWrongStudent ? "font-medium text-red-700"
                            : "text-gray-400"
                          }`}>
                            {q.options[letter]}
                          </span>
                          <div className="ml-auto flex items-center gap-1.5 shrink-0">
                            {isThisCorrect && !isThisRightStudent && (
                              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">Correct answer</span>
                            )}
                            {isThisWrongStudent && (
                              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">Your answer</span>
                            )}
                            {isThisRightStudent && (
                              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">Your answer ✓</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="flex flex-col items-center py-12 text-center text-gray-400">
                <CheckCircle2 size={32} className="mb-2 opacity-30" />
                <p className="text-sm">No questions in this category</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-2xl">
          <button onClick={onClose} className="w-full rounded-xl bg-[#1B1D29] py-3 text-sm font-semibold text-white transition hover:bg-black">
            Done
          </button>
        </div>
      </footer>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function JoinQuizModal({ onClose }: JoinQuizModalProps) {
  const [step, setStep] = useState<Step>("code");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);

  async function handleJoin() {
    if (!code.trim()) { setError("Please enter a quiz code."); return; }
    try {
      setIsLoading(true); setError(null);
      const { data: joinData } = await axiosClient.post<JoinResponse>("/quiz/join", { code: code.trim() });
      const id = getQuizId(joinData);
      if (!id) throw new Error("Quiz ID not found in join response.");
      setQuizId(id);
      const { data: qData } = await axiosClient.get<{ data: QuizData }>(`/quiz/without-answers/${id}`);
      setQuiz(qData.data);
      setCurrentQ(0); setAnswers({});
      setStep("quiz");
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Invalid code or quiz not available.");
    } finally { setIsLoading(false); }
  }

  async function handleSubmit() {
    if (!quiz || !quizId) return;
    try {
      setIsSubmitting(true); setError(null);
      const payload = quiz.questions.map((q) => ({ question: q._id, answer: answers[q._id] ?? "" }));
      const { data: res } = await axiosClient.post<SubmitResponse>(`/quiz/submit/${quizId}`, { answers: payload });
      setResult(res.data); setStep("result");
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to submit quiz.");
    } finally { setIsSubmitting(false); }
  }

  /* ── Code entry modal ── */
  if (step === "code") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Join Quiz</h2>
              <p className="mt-0.5 text-xs text-gray-400">Input the code received for the quiz below to join</p>
            </div>
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-100 text-gray-400 hover:bg-gray-50">
              <X size={15} />
            </button>
          </div>
          <div className="px-6 py-5">
            <input
              value={code}
              onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(null); }}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              placeholder="Enter quiz code"
              maxLength={10}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 font-mono text-base font-semibold tracking-widest text-gray-900 outline-none placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-300 focus:border-gray-400"
            />
            {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
          </div>
          <div className="flex items-center justify-center gap-4 border-t border-gray-100 px-6 py-4">
            <button
              onClick={handleJoin}
              disabled={isLoading || !code.trim()}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1B1D29] text-white transition hover:bg-black disabled:opacity-50"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              )}
            </button>
            <button onClick={onClose} className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-50">
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "quiz" && quiz) {
    return (
      <QuizPage
        quiz={quiz} answers={answers} currentQ={currentQ}
        onAnswer={(qId, letter) => setAnswers((prev) => ({ ...prev, [qId]: letter }))}
        onNext={() => setCurrentQ((q) => Math.min(quiz.questions.length - 1, q + 1))}
        onPrev={() => setCurrentQ((q) => Math.max(0, q - 1))}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting} error={error}
      />
    );
  }

  if (step === "result" && result && quiz) {
    return <ResultPage quiz={quiz} result={result} studentAnswers={answers} onClose={onClose} />;
  }

  return null;
}