import { axiosClient } from "@/shared/lib/apis/axiosClient";

export interface ApiStudentGroup {
  _id: string;
  name: string;
  status?: string;
  instructor?: string;
  students?: string[];
  max_students?: number;
}

export interface ApiStudent {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  status?: string;
  role?: string;
  group?: ApiStudentGroup | null;
  avg_score?: number;
}

export const studentsApi = {
  
  getAll: async (): Promise<ApiStudent[]> => {
    const response = await axiosClient.get<ApiStudent[]>("/student");
    return response.data;
  },

 
  getAllWithoutGroup: async (): Promise<ApiStudent[]> => {
    try {
      const response = await axiosClient.get<ApiStudent[]>("/student/without-group");
      return response.data;
    } catch (error) {
  
      const response = await axiosClient.get<ApiStudent[]>("/student");
      return response.data;
    }
  },

  delete: async (id: string): Promise<void> => {
    await axiosClient.delete(`/student/${id}`);
  },

  deleteFromGroup: async (studentId: string, groupId: string): Promise<void> => {
    await axiosClient.delete(`/student/${studentId}/${groupId}`);
  },
};
