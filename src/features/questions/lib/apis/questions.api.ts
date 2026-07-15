import { axiosClient } from "@/shared/lib/apis/axiosClient";

export interface QuestionOption {
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
  options: QuestionOption;
  answer: "A" | "B" | "C" | "D";
  status: string;
  instructor: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionPayload {
  title: string;
  description: string;
  options: Omit<QuestionOption, "_id">;
  answer: "A" | "B" | "C" | "D";
  difficulty: "easy" | "medium" | "hard";
  points: number;
  type: string;
}
export interface SearchParams {
  difficulty?: "easy" | "medium" | "hard";
  type?: string;
}
export interface ApiResponse<T> {
  data: T;
  message: string;
}

export const questionsApi = {
  getAll: async (): Promise<Question[]> => {
    const res = await axiosClient.get<Question[]>("/question", {
      params: {
        sort: "-createdAt",
      },
    });
    return res.data;
  },

  getById: async (id: string): Promise<Question> => {
    const res = await axiosClient.get<Question>(`/question/${id}`);
    return res.data;
  },

  add: async (payload: QuestionPayload): Promise<Question> => {
    const res = await axiosClient.post<ApiResponse<Question>>(
      "/question",
      payload
    );

    return res.data.data;
  },

  edit: async (id: string, payload: QuestionPayload): Promise<Question> => {
    const res = await axiosClient.put<ApiResponse<Question>>(
      `/question/${id}`,
      payload
    );

    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosClient.delete(`/question/${id}`);
  },
  search: async (params: SearchParams): Promise<Question[]> => {
    const res = await axiosClient.get<Question[]>("/question/search", {
      params, // axios هيبعتها query params تلقائي
    });
    return res.data;
  },
};
