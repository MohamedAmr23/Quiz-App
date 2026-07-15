import { z } from "zod";

export const forgetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
});

export type ForgetPasswordFormData = z.infer<
  typeof forgetPasswordSchema
>;


export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email"),

    otp: z
      .string()
      .min(4, "OTP is required")
      .max(6, "OTP must be 4 to 6 digits")
      .regex(/^\d+$/, "OTP must contain numbers only"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Password must contain uppercase, lowercase and a number"
      ),

    confirmPassword: z
      .string()
      .min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type ResetPasswordFormData = z.infer<
  typeof resetPasswordSchema
>;