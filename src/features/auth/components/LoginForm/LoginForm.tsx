"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CircleUserRound,
  UserPlus,
  Mail,
  Lock,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { axiosClient } from "@/shared/lib/apis/axiosClient";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  async function onSubmit(data: LoginFormValues) {
    try {
      const res = await axiosClient.post("/auth/login", data);

      const { accessToken, refreshToken, profile } =
        res.data?.data || {};

      if (typeof window !== "undefined") {
        if (accessToken)
          localStorage.setItem("accessToken", accessToken);

        if (refreshToken)
          localStorage.setItem("refreshToken", refreshToken);

        if (profile)
          localStorage.setItem(
            "userProfile",
            JSON.stringify(profile)
          );
      }

      toast.success(
        res.data?.message || "Logged in successfully!"
      );

      router.push("/dashboard");
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        toast.error(
          err.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <div className="w-full">
      <h1 className="mb-8 text-2xl font-bold leading-tight text-[#c4ff61] sm:text-3xl lg:text-4xl">
        Continue your learning journey with QuizWiz!
      </h1>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        <button
          type="button"
          className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-[#c4ff61] bg-[#161e2f] py-5 text-[#c4ff61] sm:py-7"
        >
          <CircleUserRound
            className="h-7 w-7 sm:h-8 sm:w-8"
            strokeWidth={1.5}
          />
          <span className="text-base font-medium sm:text-lg">
            Sign in
          </span>
        </button>

        <button
          type="button"
          onClick={() => router.push("/register")}
          className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#161e2f] py-5 text-white transition-colors hover:border-white/30 sm:py-7"
        >
          <UserPlus
            className="h-7 w-7 sm:h-8 sm:w-8"
            strokeWidth={1.5}
          />
          <span className="text-base font-medium sm:text-lg">
            Sign Up
          </span>
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 sm:space-y-7"
        noValidate
      >
        <div>
          <label className="mb-3 block font-medium text-white">
            Your email address
          </label>

          <div
            className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 ${
              errors.email
                ? "border-red-400"
                : "border-white/15"
            }`}
          >
            <Mail
              className="h-5 w-5 shrink-0 text-white/60"
              strokeWidth={1.5}
            />

            <input
              type="email"
              placeholder="Type your email"
              {...register("email")}
              className="
                w-full min-w-0
                bg-transparent
                text-white
                outline-none
                placeholder:text-white/40
                autofill:bg-transparent
                autofill:text-white
              "
            />
          </div>

          {errors.email && (
            <p className="mt-1.5 text-sm text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>


        <div>
          <label className="mb-3 block font-medium text-white">
            Password
          </label>

          <div
            className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 ${
              errors.password
                ? "border-red-400"
                : "border-white/15"
            }`}
          >
            <Lock
              className="h-5 w-5 shrink-0 text-white/60"
              strokeWidth={1.5}
            />

            <input
              type="password"
              placeholder="Type your password"
              {...register("password")}
              className="
                w-full min-w-0
                bg-transparent
                text-white
                outline-none
                placeholder:text-white/40
                autofill:bg-transparent
                autofill:text-white
              "
            />
          </div>

          {errors.password && (
            <p className="mt-1.5 text-sm text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>


        <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              flex w-full items-center justify-center gap-2
              rounded-xl bg-white
              py-4
              text-lg font-semibold text-[#0e1525]
              transition hover:bg-white/90
              disabled:opacity-60
              sm:w-1/3
            "
          >
            {isSubmitting ? "Signing in..." : "Sign In"}

            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black">
              <Check size={14} className="text-white" />
            </span>
          </button>


          <p className="w-full text-center text-white/60 sm:w-2/3">
            Forgot password?{" "}
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="font-medium text-[#c4ff61] hover:underline"
            >
              click here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}