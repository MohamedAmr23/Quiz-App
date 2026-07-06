export type QuizDifficulty = "easy" | "medium" | "hard";

// "BE" in the API stands for the track a quiz belongs to.
// Swap/extend this list if the backend supports more tracks.
export type QuizType = "BE" | "FE" | "MO";

export interface Quiz {
  _id: string;
  code: string;
  title: string;
  description: string;
  status: "open" | "closed" | string;
  instructor: string;
  group: string;
  groupName?: string; // populated by the backend when available
  questions_number: number;
  questions: string[];
  schadule: string; // ISO date string (API spells it this way)
  duration: number; // minutes
  score_per_question: number;
  type: QuizType | string;
  difficulty: QuizDifficulty | string;
  enrolledCount?: number; // "No. of student's enrolled"
  personsInGroup?: number; // "No. of persons in group"
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuizPayload {
  title: string;
  description: string;
  group: string;
  questions_number: number;
  difficulty: QuizDifficulty;
  type: QuizType;
  schadule: string;
  duration: number;
  score_per_question: number;
}

export interface ApiListResponse<T> {
  data: T[];
  message?: string;
}

export interface ApiItemResponse<T> {
  data: T;
  message?: string;
}