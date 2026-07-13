"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isStudent } from "@/shared/lib/utils/auth"; // adjust path

interface QuickActionsProps {
  onNewQuiz: () => void;
  onJoinQuiz?: () => void;
}

export default function QuickActions({ onNewQuiz, onJoinQuiz }: QuickActionsProps) {
  const [student, setStudent] = useState(false);

  useEffect(() => {
    setStudent(isStudent());
  }, []);

  if (student) {
    return (
      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={onJoinQuiz}
          className="group flex flex-col items-start rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:border-gray-200 hover:bg-gray-50"
        >
          <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
          </span>
          <p className="text-sm font-medium text-gray-900">Join a quiz</p>
          <p className="mt-1 text-xs text-gray-500">
            Enter a quiz code to join an active session.
          </p>
          <span className="mt-4 self-end text-gray-300 transition group-hover:text-gray-400">→</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* New Quiz */}
      <button
        onClick={onNewQuiz}
        className="group flex flex-col items-start rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:border-gray-200 hover:bg-gray-50"
      >
        <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
          </svg>
        </span>
        <p className="text-sm font-medium text-gray-900">Set up a new quiz</p>
        <p className="mt-1 text-xs text-gray-500">Create questions, set a timer, and schedule for your group.</p>
        <span className="mt-4 self-end text-gray-300 transition group-hover:text-gray-400">→</span>
      </button>

      {/* Question Bank */}
      <Link
        href="/quizzes/bank"
        className="group flex flex-col items-start rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:border-gray-200 hover:bg-gray-50"
      >
        <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
            <rect width="20" height="5" x="2" y="3" rx="1"/><rect width="20" height="5" x="2" y="10" rx="1"/><rect width="20" height="5" x="2" y="17" rx="1"/>
          </svg>
        </span>
        <p className="text-sm font-medium text-gray-900">Question bank</p>
        <p className="mt-1 text-xs text-gray-500">Browse and reuse saved questions across all your quizzes.</p>
        <span className="mt-4 self-end text-gray-300 transition group-hover:text-gray-400">→</span>
      </Link>

      {/* All Quizzes */}
      <Link
        href="/quizzes/allquizzes"
        className="group flex flex-col items-start rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:border-gray-200 hover:bg-gray-50"
      >
        <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
            <rect width="6" height="4" x="9" y="3" rx="1"/><path d="m9 12 2 2 4-4"/>
          </svg>
        </span>
        <p className="text-sm font-medium text-gray-900">All quizzes</p>
        <p className="mt-1 text-xs text-gray-500">Browse every quiz across all groups and statuses.</p>
        <span className="mt-4 self-end text-gray-300 transition group-hover:text-gray-400">→</span>
      </Link>
    </div>
  );
}