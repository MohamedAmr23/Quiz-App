export type Status = "active" | "inactive";

export interface Quiz {
  _id: string;
  code: string;
  title: string;
  description: string;
  status: "open" | "closed";
  instructor: string;
  group: string;
  questions_number: number;
  questions: string[];
  schadule: string;
  duration: number;
  score_per_question: number;
  type: "FE" | "BE" | "DO";
  difficulty: "easy" | "medium" | "hard";
  updatedAt: string;
  createdAt: string;
  closed_at: string;
  participants: number;
  __v: number;
}
export interface Student {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  role: string;
  avg_score?: number;
  group?: {
    _id: string;
    name: string;
    status: string;
    instructor: string;
    students: string[];
    max_students: number;
  };
}