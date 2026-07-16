export type QuizDifficulty = "easy" | "medium" | "hard";


export type QuizType = "BE" | "FE" | "MO";

export interface Quiz {
  _id?: string;
  code: string;
  title: string;
  description: string;
  status: "open" | "closed" | string;
  instructor?: string;
  group: string;
  groupName?: string; 
  questions_number: number;
  questions?: string[];
  schadule: string; 
  duration: number;
  score_per_question: number;
  type: QuizType | string;
  difficulty: QuizDifficulty | string;
  enrolledCount?: number;
  personsInGroup?: number; 
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

export interface QuizParticipant {
  _id: string;
  student?: string;
  name?: string;
  score?: number;
  [key: string]: any;
}

export interface QuizResult {
  quiz: Quiz;
  participants: QuizParticipant[];
}

export interface QuestionOptions {
  A: string;
  B: string;
  C: string;
  D: string;
  _id?: string;
}

export interface Question {
  _id: string;
  title: string;
  description: string;
  options: QuestionOptions;
  answer: "A" | "B" | "C" | "D";
  status: "active" | "inactive" | string;
  difficulty: "easy" | "medium" | "hard" | string;
  points: number;
  type: "FE" | "BE" | "DO" | string;
}