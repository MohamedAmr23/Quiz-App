import { axiosClient } from "@/shared/lib/apis/axiosClient";

export interface ApiGroup {
  _id: string;
  name: string;
  status: string;
  instructor: string;
  students: string[]; 
  max_students: number;
}

export interface CreateGroupPayload {
  name: string;
  students: string[];
}

export const groupsApi = {
  
  getAll: async (): Promise<ApiGroup[]> => {
    const response = await axiosClient.get<ApiGroup[]>("/group");
    return response.data;
  },

 
  create: async (data: CreateGroupPayload): Promise<ApiGroup> => {
    const response = await axiosClient.post<ApiGroup>("/group", data);
    return response.data;
  },

  update: async (id: string, data: CreateGroupPayload): Promise<ApiGroup> => {
    const response = await axiosClient.put<ApiGroup>(`/group/${id}`, data);
    return response.data;
  },


  delete: async (id: string): Promise<void> => {
    await axiosClient.delete(`/group/${id}`);
  },
};
