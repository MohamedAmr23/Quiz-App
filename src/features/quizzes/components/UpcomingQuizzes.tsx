"use client";

import { Quiz } from "@/shared/lib/types/quiz";
import { format } from "date-fns";
import { MonitorSmartphone } from "lucide-react";
import Link from "next/link";

interface UpcomingQuizzesProps {
  quizzes: Quiz[];
  isLoading: boolean;
  error: string | null;
}

export default function UpcomingQuizzes({ quizzes, isLoading, error }: UpcomingQuizzesProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-gray-900">Upcoming quizzes</h2>

      {isLoading && (
        <div className="space-y-3">
          <div className="h-24 animate-pulse rounded-xl bg-gray-50" />
          <div className="h-24 animate-pulse rounded-xl bg-gray-50" />
        </div>
      )}

      {!isLoading && error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {!isLoading && !error && quizzes.length === 0 && (
        <p className="text-sm text-gray-400">No upcoming quizzes yet.</p>
      )}

      {!isLoading && !error && quizzes.length > 0 && (
        <div className="space-y-3">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="flex items-center gap-4 rounded-xl bg-orange-50/60 p-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white text-gray-700 shadow-sm">
                <MonitorSmartphone size={22} strokeWidth={1.5} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">{quiz.title}</p>
                <p className="mt-0.5 text-xs text-gray-500">{formatSchedule(quiz.schadule)}</p>
                <p className="mt-1 text-xs text-gray-500">No. of student&apos;s enrolled: {quiz.enrolledCount ?? "—"}</p>
              </div>
              <Link href={`/quizzes/${quiz._id}`} className="shrink-0 text-sm font-medium text-green-600 hover:text-green-700">Open</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatSchedule(iso: string) {
  try {
    return format(new Date(iso), "dd/MM/yyyy | hh:mm a");
  } catch {
    return iso;
  }
}