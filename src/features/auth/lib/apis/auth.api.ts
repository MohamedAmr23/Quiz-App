import { axiosClient } from "@/shared/lib/apis/axiosClient";
import { ResetPasswordFormData } from "../schemas/auth.schemas";

export const forgetPassword = (data: { email: string }) => {
  return axiosClient.post("/auth/forgot-password", data);
};
export const resetPassword = (data: ResetPasswordFormData) => {
  return axiosClient.post("/auth/reset-password", data);
};