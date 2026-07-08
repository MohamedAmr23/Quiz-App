"use client";

import { format } from "date-fns";
import { Users } from "lucide-react";
import { Quiz } from "@/shared/lib/types/quiz";

interface ResultsTableProps {
  quizzes: Quiz[];
  isLoading: boolean;
  error: string | null;
}

export default function ResultsTable({
  quizzes = [],
  isLoading,
  error,
}: ResultsTableProps) {
  const avgQuestions =
    quizzes.length > 0
      ? Math.round(quizzes.reduce((s, q) => s + q.questions_number, 0) / quizzes.length)
      : 0;
  const avgScore =
    quizzes.length > 0
      ? Math.round(quizzes.reduce((s, q) => s + q.score_per_question, 0) / quizzes.length)
      : 0;
  const avgDuration =
    quizzes.length > 0
      ? Math.round(quizzes.reduce((s, q) => s + q.duration, 0) / quizzes.length)
      : 0;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-900">Quiz results</h2>
      </div>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-4 gap-3">
        {[
          { label: "Total quizzes", value: quizzes.length },
          { label: "Avg. questions", value: avgQuestions },
          { label: "Avg. score / q", value: `${avgScore} pts` },
          { label: "Avg. duration", value: `${avgDuration} min` },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-gray-50 px-3 py-2.5">
            <p className="text-[11px] text-gray-400">{s.label}</p>
            <p className="mt-0.5 text-lg font-semibold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full min-w-[1000px] text-left">
          <thead className="bg-[#1B1D29]">
            <tr>
              {["Code", "Title", "Description", "Status", "Group", "Questions", "Score / Q", "Duration", "Type", "Difficulty", "Schedule"].map(
                (h, i) => (
                  <th
                    key={h}
                    className={`px-3 py-3 text-[10px] font-medium uppercase tracking-widest whitespace-nowrap ${
                      i < 2 ? "text-white" : "text-white/60"
                    }`}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && (
              <tr>
                <td colSpan={11} className="px-4 py-3">
                  <div className="h-4 w-full animate-pulse rounded bg-gray-50" />
                </td>
              </tr>
            )}

            {!isLoading && error && (
              <tr>
                <td colSpan={11} className="px-4 py-4 text-sm text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {!isLoading && !error && quizzes.length === 0 && (
              <tr>
                <td colSpan={11} className="py-12 text-center">
                  <Users size={32} className="mx-auto mb-2 text-gray-200" />
                  <p className="text-sm text-gray-400">No results yet.</p>
                </td>
              </tr>
            )}

            {!isLoading &&
              !error &&
              quizzes.length > 0 &&
              quizzes.map((quiz) => (
                <tr key={quiz.code} className="transition hover:bg-gray-50">
                  <td className="px-3 py-3">
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-gray-500">
                      {quiz.code}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-sm font-medium text-gray-900">
                    {quiz.title}
                  </td>
                  <td className="max-w-[120px] truncate px-3 py-3 text-xs text-gray-400">
                    {quiz.description || "—"}
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge status={quiz.status} />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-purple-50">
                        <Users size={10} className="text-purple-500" />
                      </span>
                      <span className="font-mono text-[11px] text-gray-400">
                        {truncateId(quiz.group)}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-500">
                    {quiz.questions_number}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-500">
                    {quiz.score_per_question} pts
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-500">
                    {quiz.duration} min
                  </td>
                  <td className="px-3 py-3 text-xs font-mono text-gray-500">
                    {quiz.type}
                  </td>
                  <td className="px-3 py-3">
                    <DifficultyBadge difficulty={quiz.difficulty} />
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-400">
                    {formatDate(quiz.schadule)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { className: string; icon: string }> = {
    closed: { className: "bg-red-50 text-red-500", icon: "🔒" },
    open:   { className: "bg-green-50 text-green-600", icon: "🟢" },
    scheduled: { className: "bg-yellow-50 text-yellow-600", icon: "🕐" },
  };
  const s = map[status] ?? { className: "bg-gray-50 text-gray-500", icon: "" };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${s.className}`}>
      {status}
    </span>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const map: Record<string, string> = {
    easy:   "bg-green-50 text-green-600",
    medium: "bg-amber-50 text-amber-600",
    hard:   "bg-red-50 text-red-500",
  };
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-[11px] font-medium capitalize ${map[difficulty] ?? "bg-gray-50 text-gray-500"}`}>
      {difficulty}
    </span>
  );
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  try {
    return format(new Date(iso), "dd/MM/yyyy HH:mm");
  } catch {
    return iso;
  }
}

function truncateId(id?: string) {
  if (!id) return "—";
  if (id.length <= 10) return id;
  return `${id.slice(0, 6)}…${id.slice(-4)}`;
}