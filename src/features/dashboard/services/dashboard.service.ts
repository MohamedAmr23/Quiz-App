import { axiosClient } from "@/shared/lib/apis/axiosClient";

export const getQuizes = async () => {
  const { data } = await axiosClient.get("/quiz/incomming");
  return data;
};

export const getTopFiveStudents = async () => {
  const { data } = await axiosClient.get("/student");
  return data;
};

export const getCompletedQuizes= async () =>{
  const { data } = await axiosClient.get("/quiz/completed");
  return data;

}
export const getGroups = async () => {
  const { data } = await axiosClient.get("/group");
  return data;
};
export const joinQuiz = async (data: {code:string}) => {

  const response = await axiosClient.post(
    "/quiz/join",
    data
  );

  return response.data;

};