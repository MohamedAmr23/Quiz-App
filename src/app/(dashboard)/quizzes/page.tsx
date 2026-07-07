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
    // refresh the upcoming list so the new quiz shows up right away
    loadUpcoming();
  }

  return (
    <div className="px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Quizzes</h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:border-gray-300 hover:shadow"
        >
          <Plus size={16} />
          New quiz
        </button>
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