import { axiosClient } from "@/shared/lib/apis/axiosClient";

export const getQuizes = async () => {
  const { data } = await axiosClient.get("/quiz/incomming");
  return data;
};

export const getTopFiveStudents = async () => {
  const { data } = await axiosClient.get("/student");
  return data;
};