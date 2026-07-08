"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Loader2, ClipboardList } from "lucide-react";
import { axiosClient } from "@/shared/lib/apis/axiosClient";

interface Quiz {
  _id: string;
  code: string;
  title: string;
  description: string;
  status: string;
  group: string;
  questions_number: number;
  questions: string[];
  schadule: string;
  duration: number;
  score_per_question: number;
  type: string;
  difficulty: string;
}

type StatusFilter = "ALL" | "open" | "closed";
type DiffFilter = "ALL" | "easy" | "medium" | "hard";

export default function AllQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [diffFilter, setDiffFilter] = useState<DiffFilter>("ALL");

  useEffect(() => {
    async function fetchAll() {
      try {
        setIsLoading(true);
        const { data } = await axiosClient.get<Quiz[]>("/quiz");
        setQuizzes(data);
      } catch {
        setError("Couldn't load quizzes.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchAll();
  }, []);

  const filtered = useMemo(
    () =>
      quizzes.filter((q) => {
        const statusOk = statusFilter === "ALL" || q.status === statusFilter;
        const diffOk = diffFilter === "ALL" || q.difficulty === diffFilter;
        return statusOk && diffOk;
      }),
    [quizzes, statusFilter, diffFilter]
  );

  const openCount = quizzes.filter((q) => q.status === "open").length;
  const closedCount = quizzes.filter((q) => q.status === "closed").length;
  const avgQ =
    quizzes.length > 0
      ? Math.round(
          quizzes.reduce((s, q) => s + q.questions_number, 0) / quizzes.length
        )
      : 0;

  return (
    <div className="px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-5 flex items-center gap-2 text-xs text-gray-400">
        <Link href="/quizzes" className="hover:text-gray-700">
          Quizzes
        </Link>
        <span className="text-gray-200">›</span>
        <span className="font-medium text-gray-700">All quizzes</span>
      </div>

      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">All quizzes</h1>
      </div>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-4 gap-3">
        {[
          { label: "Total", value: quizzes.length, color: "" },
          { label: "Open", value: openCount, color: "text-green-600" },
          { label: "Closed", value: closedCount, color: "text-red-500" },
          { label: "Avg. questions", value: avgQ, color: "" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-gray-50 px-4 py-3">
            <p className="text-[11px] text-gray-400">{s.label}</p>
            <p className={`mt-0.5 text-xl font-semibold ${s.color || "text-gray-900"}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {(["ALL", "open", "closed"] as StatusFilter[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition ${
              statusFilter === s
                ? "border-[#1B1D29] bg-[#1B1D29] text-white"
                : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            {s === "ALL" ? "All statuses" : s}
          </button>
        ))}
        <span className="ml-auto flex items-center gap-2">
          {(["ALL", "easy", "medium", "hard"] as DiffFilter[]).map((d) => (
            <button
              key={d}
              onClick={() => setDiffFilter(d)}
              className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition ${
                diffFilter === d
                  ? "border-[#1B1D29] bg-[#1B1D29] text-white"
                  : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {d === "ALL" ? "All levels" : d}
            </button>
          ))}
        </span>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-gray-300" />
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Empty */}
      {!isLoading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ClipboardList size={36} className="mb-3 text-gray-200" />
          <p className="text-sm text-gray-400">No quizzes match your filters.</p>
        </div>
      )}

      {/* Grid */}
      {!isLoading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((quiz) => (
            <QuizCard key={quiz.code} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
}

function QuizCard({ quiz }: { quiz: Quiz }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-gray-200">
      {/* Top */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-gray-900">{quiz.title}</p>
        <div className="flex shrink-0 items-center gap-1.5">
          <StatusBadge status={quiz.status} />
          <DiffBadge difficulty={quiz.difficulty} />
          <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-400">
            {quiz.code}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="mb-3 text-xs text-gray-400">
        {quiz.description || <span className="italic">No description</span>}
      </p>

      {/* Meta */}
      <div className="mb-3 grid grid-cols-2 gap-1.5">
        {[
          { icon: "📄", label: `${quiz.questions_number} ${quiz.questions_number === 1 ? "question" : "questions"}` },
          { icon: "⭐", label: `${quiz.score_per_question} pts / question` },
          { icon: "⏱", label: `${quiz.duration} min` },
          { icon: "💻", label: quiz.type },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1.5 text-xs text-gray-500"
          >
            <span>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-2.5">
        <span className="text-[11px] text-gray-400">
          📅 {formatDate(quiz.schadule)}
        </span>
        <Link
          href={`/quizzes/${quiz._id}`}
          className="rounded-full border border-blue-200 px-3 py-1 text-xs font-medium text-blue-600 transition hover:bg-blue-50"
        >
          Open →
        </Link>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    open: "bg-green-50 text-green-600",
    closed: "bg-red-50 text-red-500",
    scheduled: "bg-yellow-50 text-yellow-600",
  };
  return (
    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium capitalize ${map[status] ?? "bg-gray-50 text-gray-500"}`}>
      {status}
    </span>
  );
}

function DiffBadge({ difficulty }: { difficulty: string }) {
  const map: Record<string, string> = {
    easy: "bg-green-50 text-green-600",
    medium: "bg-amber-50 text-amber-600",
    hard: "bg-red-50 text-red-500",
  };
  return (
    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium capitalize ${map[difficulty] ?? "bg-gray-50 text-gray-500"}`}>
      {difficulty}
    </span>
  );
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  try {
    return format(new Date(iso), "dd/MM/yyyy");
  } catch {
    return iso;
  }
}