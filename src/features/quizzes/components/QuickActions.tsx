"use client";

import { Target, Archive } from "lucide-react";

interface QuickActionsProps {
  onNewQuiz: () => void;
}

export default function QuickActions({ onNewQuiz }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={onNewQuiz}
        className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-white py-10 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-800">
          <Target size={26} strokeWidth={1.5} />
        </span>
        <span className="text-sm font-semibold text-gray-900">
          Set up a new quiz
        </span>
      </button>

      <button className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-white py-10 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-800">
          <Archive size={26} strokeWidth={1.5} />
        </span>
        <span className="text-sm font-semibold text-gray-900">
          Question Bank
        </span>
      </button>
    </div>
  );
}