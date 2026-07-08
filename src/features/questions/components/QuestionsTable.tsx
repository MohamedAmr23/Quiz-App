"use client";

import { useState } from "react";
import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Question } from "../lib/apis/questions.api";

const DIFFICULTY_STYLES: Record<string, string> = {
  easy: "bg-green-50 text-green-600",
  medium: "bg-amber-50 text-amber-600",
  hard: "bg-red-50 text-red-500",
};

const PAGE_SIZE = 8;

interface QuestionsTableProps {
  questions: Question[];
  isLoading: boolean;
  error: string | null;
  onView: (question: Question) => void;
  onEdit: (question: Question) => void;
  onDelete: (question: Question) => void;
}

export default function QuestionsTable({
  questions,
  isLoading,
  error,
  onView,
  onEdit,
  onDelete,
}: QuestionsTableProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(questions.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = questions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="overflow-x-auto">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-900">Questions List</h2>
        </div>
        <table className="w-full min-w-[700px] text-left">
          <thead className="bg-[#1B1D29]">
            <tr>
              {[
                "#",
                "Question Title",
                "Description",
                "Type",
                "Difficulty",
                "Points",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className={`px-3 py-3 text-[10px] font-medium uppercase tracking-widest whitespace-nowrap ${
                    h === "#" || h === "Question Title"
                      ? "text-white"
                      : "text-white/60"
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {/* Loading skeleton */}
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 7 }).map((__, j) => (
                    <td key={j} className="px-4 py-3.5">
                      <div className="h-3.5 w-full animate-pulse rounded-full bg-white/5" />
                    </td>
                  ))}
                </tr>
              ))}

            {/* Error */}
            {!isLoading && error && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-sm text-red-400"
                >
                  {error}
                </td>
              </tr>
            )}

            {/* Empty */}
            {!isLoading && !error && questions.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-14 text-center text-sm text-white/30"
                >
                  No questions found.
                </td>
              </tr>
            )}

            {/* Rows */}
            {!isLoading &&
              !error &&
              paginated.map((q, idx) => (
                <tr key={q._id} className="transition hover:bg-gray-50">
                  <td className="px-3 py-3 text-sm text-gray-500">
                    {(currentPage - 1) * PAGE_SIZE + idx + 1}
                  </td>
                  <td className="px-3 py-3 text-sm font-medium text-gray-900">
                    {q.title}
                  </td>
                  <td className="px-4 py-3.5 max-w-[220px]">
                    <span className="text-xs text-gray-400 line-clamp-2">
                      {q.description}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600">
                      {q.type}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[11px] font-medium capitalize ${
                        DIFFICULTY_STYLES[q.difficulty] ??
                        "bg-white/5 text-white/50"
                      }`}
                    >
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-white/50">
                    {q.points} pt{q.points !== 1 ? "s" : ""}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <ActionBtn
                        label="View"
                        color="text-blue-500 hover:bg-blue-50"
                        icon={<Eye className="w-4 h-4" strokeWidth={1.5} />}
                        onClick={() => onView(q)}
                      />
                      <ActionBtn
                        label="Edit"
                        color="text-amber-500 hover:bg-amber-50"
                        icon={<Pencil className="w-4 h-4" strokeWidth={1.5} />}
                        onClick={() => onEdit(q)}
                      />
                      <ActionBtn
                        label="Delete"
                        color="text-red-500 hover:bg-red-50"
                        icon={<Trash2 className="w-4 h-4" strokeWidth={1.5} />}
                        onClick={() => onDelete(q)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isLoading && !error && questions.length > PAGE_SIZE && (
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
          <p className=" text-white/30">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, questions.length)} of{" "}
            {questions.length}
          </p>
          <div className="flex items-center gap-1">
            <PaginationBtn
              disabled={currentPage === 1}
              onClick={() => setPage((p) => p - 1)}
              icon={<ChevronLeft className="w-4 h-4" />}
            />
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-7 w-7 rounded-lg text-xs font-medium transition-colors ${
                  p === currentPage
                    ? "bg-[#1B1D29] text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}
            <PaginationBtn
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => p + 1)}
              icon={<ChevronRight className="w-4 h-4" />}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ActionBtn({
  icon,
  label,
  color,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={`rounded-lg p-1.5 transition-colors ${color}`}
    >
      {icon}
    </button>
  );
}

function PaginationBtn({
  icon,
  disabled,
  onClick,
}: {
  icon: React.ReactNode;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="h-7 w-7 flex items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
    >
      {icon}
    </button>
  );
}
