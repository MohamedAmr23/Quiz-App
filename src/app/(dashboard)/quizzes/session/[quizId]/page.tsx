"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Clock, CheckCircle2, XCircle, Trophy } from "lucide-react";
import { axiosClient } from "@/shared/lib/apis/axiosClient";


interface QuestionOption {
  A: string;
  B: string;
  C: string;
  D: string;
  _id?: string;
}

interface Question {
  _id: string;
  title: string;
  options: QuestionOption;
}

interface QuizData {
  _id: string;
  code: string;
  title: string;
  description: string;
  status: string;
  questions_number: number;
  questions: Question[];
  schadule: string;
  duration: number;
  score_per_question: number;
  type: string;
  difficulty: string;
}

// Question in submit response includes the correct answer
interface SubmittedQuestion {
  _id: string;
  title: string;
  options: QuestionOption;
  answer: "A" | "B" | "C" | "D"; // correct answer revealed after submit
}

interface SubmitResponse {
  data: {
    score: number;
    questions: SubmittedQuestion[];
  };
  message: string;
}

type AnswerMap = Record<string, "A" | "B" | "C" | "D">;

export default function QuizSessionPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const router = useRouter();

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [answers, setAnswers] = useState<AnswerMap>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResponse, setSubmitResponse] = useState<SubmitResponse | null>(null);

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const submittedRef = useRef(false);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        setIsLoading(true);
        const { data } = await axiosClient.get<{ data: QuizData }>(
          `/quiz/without-answers/${quizId}`
        );
        setQuiz(data.data);
        setTimeLeft(data.data.duration * 60);
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })
            ?.response?.data?.message ?? "Couldn't load quiz. Please try again.";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    }
    if (quizId) fetchQuiz();
  }, [quizId]);

  // Countdown
  useEffect(() => {
    if (timeLeft === null || submitResponse) return;
    if (timeLeft <= 0) {
      if (!submittedRef.current) handleSubmit();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, submitResponse]);

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function selectAnswer(questionId: string, option: "A" | "B" | "C" | "D") {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  }

  async function handleSubmit() {
    if (!quiz || submittedRef.current) return;
    submittedRef.current = true;

    const payload = {
      answers: quiz.questions.map((q) => ({
        question: q._id,
        answer: answers[q._id] ?? "",
      })),
    };

    try {
      setIsSubmitting(true);
      const { data } = await axiosClient.post<SubmitResponse>(
        `/quiz/submit/${quizId}`,
        payload
      );
      setSubmitResponse(data);
    } catch (err: unknown) {
      submittedRef.current = false; // allow retry
      const msg =
        (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ?? "Couldn't submit quiz.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = quiz?.questions.length ?? 0;

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={28} className="animate-spin text-gray-300" />
      </div>
    );
  }

  // ── Error ──
  if (error && !quiz) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-8">
        <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-5 text-center">
          <XCircle size={28} className="mx-auto mb-2 text-red-400" />
          <p className="text-sm font-medium text-red-600">{error}</p>
        </div>
        <button
          onClick={() => router.push("/quizzes")}
          className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  if (!quiz) return null;

  // ── Result screen ──
  if (submitResponse) {
    const score = submitResponse.data.score;
    const maxScore = totalQuestions * quiz.score_per_question;
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const passed = percentage >= 50;
    const submittedQuestions = submitResponse.data.questions;

    return (
      <div className="min-h-screen px-8 py-8">
        <div className="mx-auto max-w-2xl">

          {/* Score card */}
          <div className={`mb-6 rounded-2xl p-8 text-center ${passed ? "bg-green-50" : "bg-red-50"}`}>
            <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${passed ? "bg-green-100" : "bg-red-100"}`}>
              <Trophy size={36} className={passed ? "text-green-600" : "text-red-500"} />
            </div>
            <h1 className="mb-1 text-2xl font-bold text-gray-900">
              {passed ? "Well done!" : "Keep practicing!"}
            </h1>
            <p className="mt-0.5 text-sm text-gray-500">{quiz.title}</p>

            <div className="mt-6 flex items-center justify-center gap-8">
              <div>
                <p className="text-3xl font-bold text-gray-900">{score}</p>
                <p className="text-xs text-gray-400">Your score</p>
              </div>
              <div className="h-10 w-px bg-gray-200" />
              <div>
                <p className="text-3xl font-bold text-gray-900">{maxScore}</p>
                <p className="text-xs text-gray-400">Total score</p>
              </div>
              <div className="h-10 w-px bg-gray-200" />
              <div>
                <p className={`text-3xl font-bold ${passed ? "text-green-600" : "text-red-500"}`}>
                  {percentage}%
                </p>
                <p className="text-xs text-gray-400">Percentage</p>
              </div>
            </div>
          </div>

          {/* Per-question review */}
          <h2 className="mb-3 text-sm font-medium text-gray-700">Question Review</h2>
          <div className="mb-6 space-y-3">
            {submittedQuestions.map((q, i) => {
              const studentAnswer = answers[q._id];
              const correctAnswer = q.answer; // ✅ from submit response
              const isCorrect = studentAnswer === correctAnswer;

              return (
                <div
                  key={q._id}
                  className={`rounded-2xl border p-4 ${isCorrect ? "border-green-100 bg-green-50" : "border-red-100 bg-red-50"}`}
                >
                  <div className="mb-3 flex items-start gap-2">
                    <span className={`mt-0.5 shrink-0 ${isCorrect ? "text-green-500" : "text-red-400"}`}>
                      {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                    </span>
                    <p className="text-sm font-medium text-gray-900">
                      Q{i + 1}: {q.title}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {(["A", "B", "C", "D"] as const).map((key) => {
                      const isCorrectOption = correctAnswer === key;
                      const isStudentWrongPick = studentAnswer === key && !isCorrectOption;

                      let cls = "flex items-center gap-2 rounded-xl border px-3 py-2 text-xs ";
                      if (isCorrectOption) {
                        cls += "border-green-200 bg-green-100 font-medium text-green-700";
                      } else if (isStudentWrongPick) {
                        cls += "border-red-200 bg-red-100 text-red-600";
                      } else {
                        cls += "border-gray-100 bg-white text-gray-500";
                      }

                      return (
                        <div key={key} className={cls}>
                          <span className="font-bold">{key}</span>
                          <span className="truncate">{q.options[key]}</span>
                          {isCorrectOption && (
                            <CheckCircle2 size={11} className="ml-auto shrink-0 text-green-500" />
                          )}
                          {isStudentWrongPick && (
                            <XCircle size={11} className="ml-auto shrink-0 text-red-400" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-2.5 flex items-center gap-4 text-[11px]">
                    <span className="text-gray-400">
                      Your answer:{" "}
                      <span className={`font-semibold ${isCorrect ? "text-green-600" : "text-red-500"}`}>
                        {studentAnswer ?? "Not answered"}
                      </span>
                    </span>
                    {!isCorrect && (
                      <span className="text-gray-400">
                        Correct answer:{" "}
                        <span className="font-semibold text-green-600">{correctAnswer}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => router.push("/quizzes")}
            className="w-full rounded-full bg-[#1B1D29] py-3 text-sm font-medium text-white transition hover:bg-black"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  // ── Quiz session screen ──
  return (
    <div className="min-h-screen px-8 py-8">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{quiz.title}</h1>
            <p className="text-xs text-gray-400">
              {quiz.type} · <span className="capitalize">{quiz.difficulty}</span> · {quiz.score_per_question} pts per question
            </p>
          </div>

          {timeLeft !== null && (
            <div className={`flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-sm font-semibold ${
              timeLeft < 60
                ? "border-red-200 bg-red-50 text-red-600"
                : "border-gray-200 bg-gray-50 text-gray-700"
            }`}>
              <Clock size={14} />
              {formatTime(timeLeft)}
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="mb-1.5 flex justify-between text-xs text-gray-400">
            <span>{answeredCount} of {totalQuestions} answered</span>
            <span>{totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-gray-100">
            <div
              className="h-1.5 rounded-full bg-[#1B1D29] transition-all duration-300"
              style={{ width: `${totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-5">
          {quiz.questions.map((q, i) => (
            <div key={q._id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-start gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[11px] font-bold text-gray-600">
                  {i + 1}
                </span>
                <p className="text-sm font-medium text-gray-900">{q.title}</p>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {(["A", "B", "C", "D"] as const).map((key) => {
                  const selected = answers[q._id] === key;
                  return (
                    <button
                      key={key}
                      onClick={() => selectAnswer(q._id, key)}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                        selected
                          ? "border-[#1B1D29] bg-[#1B1D29] text-white"
                          : "border-gray-100 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        selected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                      }`}>
                        {key}
                      </span>
                      {q.options[key]}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Submit button */}
        <div className="mt-6">
          {error && <p className="mb-3 text-xs text-red-500">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1B1D29] py-3 text-sm font-medium text-white transition hover:bg-black disabled:opacity-60"
          >
            {isSubmitting ? (
              <><Loader2 size={16} className="animate-spin" /> Submitting...</>
            ) : (
              `Submit Quiz (${answeredCount}/${totalQuestions} answered)`
            )}
          </button>
          {answeredCount < totalQuestions && (
            <p className="mt-2 text-center text-xs text-gray-400">
              Unanswered questions will count as wrong.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}