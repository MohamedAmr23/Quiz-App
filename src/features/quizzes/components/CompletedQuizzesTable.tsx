"use client";

import { Quiz } from "@/shared/lib/types/quiz";
import { format } from "date-fns";

interface CompletedQuizzesTableProps {
  quizzes: Quiz[];
  isLoading: boolean;
  error: string | null;
}

export default function CompletedQuizzesTable({ quizzes, isLoading, error }: CompletedQuizzesTableProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Completed Quizzes</h2>
        <a href="/results" className="text-sm font-medium text-green-600 hover:text-green-700">
          Results
        </a>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#1B1D29] text-white">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Group name</th>
              <th className="px-4 py-3 font-medium">No. of persons in group</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && (
              <tr>
                <td colSpan={4} className="px-4 py-3">
                  <div className="h-4 w-full animate-pulse rounded bg-gray-50" />
                </td>
              </tr>
            )}

            {!isLoading && error && (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-red-500">{error}</td>
              </tr>
            )}

            {!isLoading && !error && quizzes.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-gray-400">No completed quizzes yet.</td>
              </tr>
            )}

            {!isLoading && !error && quizzes.length > 0 && quizzes.map((quiz) => (
              <tr key={quiz._id} className="text-gray-700">
                <td className="px-4 py-3">{quiz.title}</td>
                <td className="px-4 py-3">{quiz.groupName ?? quiz.group}</td>
                <td className="px-4 py-3">
                  {quiz.personsInGroup ? `${quiz.personsInGroup} persons` : "—"}
                </td>
                <td className="px-4 py-3">{formatDate(quiz.schadule)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return format(new Date(iso), "dd/MM/yyyy");
  } catch {
    return iso;
  }
}