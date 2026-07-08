"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import QuickActions from "@/features/quizzes/components/QuickActions";
import UpcomingQuizzes from "@/features/quizzes/components/UpcomingQuizzes";
import CompletedQuizzesTable from "@/features/quizzes/components/CompletedQuizzesTable";
import SetupQuizModal from "@/features/quizzes/components/SetupQuizModal";
import {
  getCompletedQuizzes,
  getUpcomingQuizzes,
} from "@/shared/lib/services/quiz.service";
import { Quiz } from "@/shared/lib/types/quiz";

export default function QuizzesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [upcoming, setUpcoming] = useState<Quiz[]>([]);
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const [upcomingError, setUpcomingError] = useState<string | null>(null);

  const [completed, setCompleted] = useState<Quiz[]>([]);
  const [completedLoading, setCompletedLoading] = useState(true);
  const [completedError, setCompletedError] = useState<string | null>(null);

  const loadUpcoming = useCallback(async () => {
    setUpcomingLoading(true);
    setUpcomingError(null);
    try {
      const data = await getUpcomingQuizzes();
      setUpcoming(data);
    } catch {
      setUpcomingError("Couldn't load upcoming quizzes.");
    } finally {
      setUpcomingLoading(false);
    }
  }, []);

  const loadCompleted = useCallback(async () => {
    setCompletedLoading(true);
    setCompletedError(null);
    try {
      const data = await getCompletedQuizzes();
      setCompleted(data);
    } catch {
      setCompletedError("Couldn't load completed quizzes.");
    } finally {
      setCompletedLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUpcoming();
    loadCompleted();
  }, [loadUpcoming, loadCompleted]);

  function handleQuizCreated() {
    setIsModalOpen(false);
    loadUpcoming();
  }

  // summary stats derived from completed quizzes
  const totalCompleted = completed.length;
  const avgQuestions =
    completed.length > 0
      ? Math.round(
          completed.reduce((sum, q) => sum + q.questions_number, 0) /
            completed.length
        )
      : 0;
  const avgScore =
    completed.length > 0
      ? Math.round(
          completed.reduce((sum, q) => sum + q.score_per_question, 0) /
            completed.length
        )
      : 0;

  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Quizzes</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-full bg-[#1B1D29] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#2a2d3e]"
        >
          <Plus size={15} />
          New quiz
        </button>
      </div>

      {/* Stats row */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {[
          { label: "Total completed", value: totalCompleted },
          { label: "Avg. questions", value: avgQuestions },
          { label: "Avg. score / question", value: `${avgScore} pts` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
          >
            <p className="text-xs text-gray-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <QuickActions onNewQuiz={() => setIsModalOpen(true)} />

        <UpcomingQuizzes
          quizzes={upcoming}
          isLoading={upcomingLoading}
          error={upcomingError}
        />

        <div className="lg:col-span-2">
          <CompletedQuizzesTable
            quizzes={completed}
            isLoading={completedLoading}
            error={completedError}
          />
        </div>
      </div>

      {isModalOpen && (
        <SetupQuizModal
          onClose={() => setIsModalOpen(false)}
          onCreated={handleQuizCreated}
        />
      )}
    </div>
  );
}