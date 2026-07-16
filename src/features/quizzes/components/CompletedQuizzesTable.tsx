"use client";

import Link from "next/link";
import { Users } from "lucide-react";
import { Quiz } from "@/shared/lib/types/quiz";
import { format } from "date-fns";

interface CompletedQuizzesTableProps {
  quizzes: Quiz[];
  isLoading: boolean;
  error: string | null;
}

export default function CompletedQuizzesTable({
  quizzes = [],
  isLoading,
  error,
}: CompletedQuizzesTableProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-900">Completed quizzes</h2>
        <Link
          href="/quizzes/results"
          className="flex items-center gap-1 rounded-full border border-blue-200 px-3 py-1 text-xs font-medium text-blue-600 transition hover:bg-blue-50"
        >
          Results
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </Link>
      </div>

      {/* ── Mobile: card list ── */}
      <div className="flex flex-col gap-3 sm:hidden">
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-50" />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <p className="py-4 text-sm text-red-500">{error}</p>
        )}

        {!isLoading && !error && quizzes.length === 0 && (
          <div className="py-10 text-center">
            <Users size={28} className="mx-auto mb-2 text-gray-200" />
            <p className="text-sm text-gray-400">No completed quizzes yet.</p>
          </div>
        )}

        {!isLoading &&
          !error &&
          quizzes.length > 0 &&
          quizzes.map((quiz) => (
            <div
              key={quiz.code ?? quiz._id}
              className="rounded-xl border border-gray-100 bg-gray-50 p-3"
            >
              <p className="mb-2 text-sm font-medium text-gray-900">
                {quiz.title}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Users size={11} className="text-purple-400" />
                  {truncateId(quiz.groupName ?? quiz.group)}
                </span>
                <span>
                  {quiz.personsInGroup
                    ? `${quiz.personsInGroup} persons`
                    : "0 persons"}
                </span>
                <span>{formatDate(quiz.schadule)}</span>
              </div>
            </div>
          ))}
      </div>

      {/* ── Desktop: table ── */}
      <div className="hidden overflow-hidden rounded-xl border border-gray-100 sm:block">
        <table className="w-full text-left">
          <thead className="bg-[#1B1D29]">
            <tr>
              <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wide text-white">
                Title
              </th>
              <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wide text-white/70">
                Group
              </th>
              <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wide text-white/70">
                Participants
              </th>
              <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wide text-white/70">
                Date
              </th>
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
                <td colSpan={4} className="px-4 py-4 text-sm text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {!isLoading && !error && quizzes.length === 0 && (
              <tr>
                <td colSpan={4} className="py-10 text-center">
                  <Users size={28} className="mx-auto mb-2 text-gray-200" />
                  <p className="text-sm text-gray-400">No completed quizzes yet.</p>
                </td>
              </tr>
            )}

            {!isLoading &&
              !error &&
              quizzes.length > 0 &&
              quizzes.map((quiz) => (
                <tr
                  key={quiz.code ?? quiz._id}
                  className="transition hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {quiz.title}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-50">
                        <Users size={12} className="text-purple-500" />
                      </span>
                      <span className="font-mono text-xs text-gray-400">
                        {truncateId(quiz.groupName ?? quiz.group)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {quiz.personsInGroup
                      ? `${quiz.personsInGroup} persons`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
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

function formatDate(iso: string) {
  try {
    return format(new Date(iso), "dd/MM/yyyy");
  } catch {
    return iso;
  }
}

function truncateId(id?: string) {
  if (!id) return "—";
  if (id.length <= 12) return id;
  return `${id.slice(0, 8)}…${id.slice(-4)}`;
}