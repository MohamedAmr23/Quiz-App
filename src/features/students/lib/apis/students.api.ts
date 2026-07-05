import { axiosClient } from "@/shared/lib/apis/axiosClient";

export interface ApiStudent {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
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
};
