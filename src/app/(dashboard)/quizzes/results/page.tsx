"use client";

import { useEffect, useState } from "react";
import ResultsTable from "@/shared/components/ResultsTable";
import { Quiz } from "@/shared/lib/types/quiz";
import { axiosClient } from "@/shared/lib/apis/axiosClient";


interface RawQuizEntry {
  quiz: {
    code: string;
    title: string;
    description: string;
    status: string;
    group: string;
    questions_number: number;
    score_per_question: number;
    duration: number;
    type: string;
    difficulty: string;
    schadule: string;
    createdAt?: string;
    updatedAt?: string;
    closed_at?: string;
  };
  participants: unknown[];
}

export default function ResultsPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        setIsLoading(true);
        setError(null);

        const { data } = await axiosClient.get<RawQuizEntry[]>("/quiz/result");

        const mapped: Quiz[] = data.map((entry) => ({
          code: entry.quiz.code,
          title: entry.quiz.title,
          description: entry.quiz.description,
          status: entry.quiz.status,
          group: entry.quiz.group,
          questions_number: entry.quiz.questions_number,
          score_per_question: entry.quiz.score_per_question,
           questions: [],
          duration: entry.quiz.duration,
          type: entry.quiz.type,
          difficulty: entry.quiz.difficulty,
          schadule: entry.quiz.schadule,
        }));

        setQuizzes(mapped);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch quiz results");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuizzes();
  }, []);

  return (
    <div className="p-6">
      <ResultsTable quizzes={quizzes} isLoading={isLoading} error={error} />
    </div>
  );
}