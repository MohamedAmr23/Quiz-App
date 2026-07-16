"use client";

import { Quiz } from "@/shared/lib/types/quiz";
import { format, isToday, isTomorrow, differenceInDays } from "date-fns";
import { Laptop } from "lucide-react";
import Link from "next/link";

interface UpcomingQuizzesProps {
  quizzes: Quiz[];
  isLoading: boolean;
  error: string | null;
}

const iconColors = [
  { bg: "bg-blue-50", text: "text-blue-600" },
  { bg: "bg-green-50", text: "text-green-600" },
  { bg: "bg-purple-50", text: "text-purple-600" },
  { bg: "bg-amber-50", text: "text-amber-600" },
];

export default function UpcomingQuizzes({
  quizzes = [],
  isLoading,
  error,
}: UpcomingQuizzesProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-900">Upcoming quizzes</h2>
        <Link
          href="/quizzes"
          className="text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          View all
        </Link>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-50" />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {!isLoading && !error && quizzes.length === 0 && (
        <p className="text-sm text-gray-400">No upcoming quizzes yet.</p>
      )}

      {!isLoading && !error && quizzes.length > 0 && (
        <div className="space-y-2">
          {quizzes.map((quiz, i) => {
            const color = iconColors[i % iconColors.length];
            const urgency = getUrgencyLabel(quiz.schadule);

            return (
              <div
                key={quiz._id}
                className="flex items-start sm:items-center gap-3 rounded-xl border border-gray-100 p-3 transition hover:border-gray-200 hover:bg-gray-50"
              >
                {/* Icon */}
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${color.bg}`}
                >
                  <Laptop size={18} strokeWidth={1.5} className={color.text} />
                </span>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {quiz.title}
                    </p>
                    {urgency && (
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${urgency.className}`}
                      >
                        {urgency.label}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-1 text-[11px] text-gray-400">
                    <span>{formatSchedule(quiz.schadule)}</span>
                    <span className="hidden sm:inline">·</span>
                    <span className="hidden sm:inline">{quiz.enrolledCount ?? 0} enrolled</span>
                    <span>·</span>
                    <span>{quiz.questions_number} questions</span>
                  </div>
                </div>

                {/* Open button */}
                <Link
                  href={`/quizzes/${quiz._id}`}
                  className="shrink-0 rounded-full border border-blue-200 px-2.5 sm:px-3 py-1 text-xs font-medium text-blue-600 transition hover:bg-blue-50 whitespace-nowrap"
                >
                  Open
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getUrgencyLabel(iso: string) {
  try {
    const date = new Date(iso);
    if (isToday(date))
      return { label: "Today", className: "bg-red-50 text-red-500" };
    if (isTomorrow(date))
      return { label: "Tomorrow", className: "bg-amber-50 text-amber-600" };
    const days = differenceInDays(date, new Date());
    if (days <= 7)
      return { label: `In ${days}d`, className: "bg-yellow-50 text-yellow-600" };
    return null;
  } catch {
    return null;
  }
}

function formatSchedule(iso: string) {
  try {
    return format(new Date(iso), "dd/MM/yyyy | hh:mm a");
  } catch {
    return iso;
  }
}