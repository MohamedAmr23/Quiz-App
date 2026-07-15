import { axiosClient } from "@/shared/lib/apis/axiosClient";
import {
  ApiItemResponse,
  ApiListResponse,
  CreateQuizPayload,
  Quiz,
  QuizResult,
} from "@/shared/lib/types/quiz";

export async function createQuiz(payload: CreateQuizPayload): Promise<Quiz> {
  const res = await axiosClient.post<ApiItemResponse<Quiz>>("/quiz", payload);
  return res.data.data;
}

export async function getUpcomingQuizzes(): Promise<Quiz[]> {
  const res = await axiosClient.get<ApiListResponse<Quiz> | Quiz[]>("/quiz/incomming");
  const body = res.data as any;
  return Array.isArray(body) ? body : body.data ?? [];
}

export async function getCompletedQuizzes(): Promise<Quiz[]> {
  const res = await axiosClient.get<ApiListResponse<Quiz> | Quiz[]>("/quiz/completed");
  const body = res.data as any;
  return Array.isArray(body) ? body : body.data ?? [];
}

export async function getQuizById(id: string): Promise<Quiz> {
  const res = await axiosClient.get<Quiz>(`/quiz/${id}`);
  return res.data;
}

export async function updateQuiz(id: string, payload: Partial<CreateQuizPayload>): Promise<Quiz> {
  const res = await axiosClient.put<ApiItemResponse<Quiz>>(`/quiz/${id}`, payload);
  return res.data.data;
}

export async function deleteQuiz(id: string): Promise<void> {
  await axiosClient.delete(`/quiz/${id}`);
}

export async function getAllResults(): Promise<QuizResult[]> {
  const res = await axiosClient.get<ApiListResponse<QuizResult> | QuizResult[]>("/quiz/result");
  const body = res.data as any;
  return Array.isArray(body) ? body : body.data ?? [];
}