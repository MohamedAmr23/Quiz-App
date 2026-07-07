"use client";

import { format } from "date-fns";
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
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Quiz Results</h2>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full min-w-[1400px] text-left text-sm">
          <thead className="bg-[#1B1D29] text-white">
            <tr>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Group</th>
              <th className="px-4 py-3 font-medium">Questions</th>
              <th className="px-4 py-3 font-medium">Score / Question</th>
              <th className="px-4 py-3 font-medium">Duration (min)</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Difficulty</th>
              <th className="px-4 py-3 font-medium">Schedule</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && (
              <tr>
                <td colSpan={12} className="px-4 py-3">
                  <div className="h-4 w-full animate-pulse rounded bg-gray-50" />
                </td>
              </tr>
            )}

            {!isLoading && error && (
              <tr>
                <td colSpan={12} className="px-4 py-4 text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {!isLoading && !error && quizzes.length === 0 && (
              <tr>
                <td colSpan={12} className="px-4 py-4 text-gray-400">
                  No results yet.
                </td>
              </tr>
            )}

            {!isLoading &&
              !error &&
              quizzes.length > 0 &&
              quizzes.map((quiz) => (
                <tr key={quiz.code} className="text-gray-700 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{quiz.code}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{quiz.title}</td>
                  <td className="px-4 py-3 text-gray-500">{quiz.description || "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={quiz.status} />
                  </td>
                  <td className="px-4 py-3">{quiz.group}</td>
                  <td className="px-4 py-3">{quiz.questions_number}</td>
                  <td className="px-4 py-3">{quiz.score_per_question}</td>
                  <td className="px-4 py-3">{quiz.duration}</td>
                  <td className="px-4 py-3">{quiz.type}</td>
                  <td className="px-4 py-3 capitalize">{quiz.difficulty}</td>
                  <td className="px-4 py-3">{formatDate(quiz.schadule)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    closed: "bg-red-50 text-red-600",
    open: "bg-green-50 text-green-600",
    scheduled: "bg-yellow-50 text-yellow-700",
  };

  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${
        styles[status] ?? "bg-gray-50 text-gray-600"
      }`}
    >
      {status}
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