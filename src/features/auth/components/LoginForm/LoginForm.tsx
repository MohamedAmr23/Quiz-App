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
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";
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
      const { accessToken, refreshToken, profile } = res.data?.data || {};

      if (typeof window !== "undefined") {
        if (accessToken) localStorage.setItem("accessToken", accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
        if (profile)
          localStorage.setItem("userProfile", JSON.stringify(profile));
      }

      toast.success(res.data?.message || "Logged in successfully!");
      router.push("/");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  }

  return (
    <div>
      <h1 className="text-[#c4ff61] text-3xl sm:text-4xl font-bold leading-tight mb-10">
        Continue your learning journey with QuizWiz!
      </h1>

      {/* Sign in / Sign up toggle */}
      <div className="grid grid-cols-2 gap-5 mb-10">
        <button
          type="button"
          className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-[#c4ff61] bg-[#161e2f] py-7 text-[#c4ff61]"
        >
          <CircleUserRound className="w-8 h-8" strokeWidth={1.5} />
          <span className="font-medium text-lg">Sign in</span>
        </button>
        <button
          type="button"
          onClick={() => router.push("/register")}
          className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#161e2f] py-7 text-white hover:border-white/30 transition-colors"
        >
          <UserPlus className="w-8 h-8" strokeWidth={1.5} />
          <span className="font-medium text-lg">Sign Up</span>
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7" noValidate>
        {/* Email */}
        <div>
          <label className="block text-white font-medium mb-3">
            Your email address
          </label>
          <div
            className={`flex items-center gap-3 rounded-xl border bg-transparent px-4 py-3.5 ${
              errors.email ? "border-red-400" : "border-white/15"
            }`}
          >
            <Mail
              className="w-5 h-5 text-white/60 shrink-0"
              strokeWidth={1.5}
            />
            <input
              type="email"
              placeholder="Type your email"
              {...register("email")}
              className="w-full min-w-0 bg-transparent text-white placeholder:text-white/40 outline-none"
            />
          </div>
          {errors.email && (
            <p className="text-red-400 text-sm mt-1.5">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-white font-medium mb-3">Password</label>
          <div
            className={`flex items-center gap-3 rounded-xl border bg-transparent px-4 py-3.5 ${
              errors.password ? "border-red-400" : "border-white/15"
            }`}
          >
            <Lock
              className="w-5 h-5 text-white/60 shrink-0"
              strokeWidth={1.5}
            />
            <input
              type="password"
              placeholder="Type your password"
              {...register("password")}
              className="w-full min-w-0 bg-transparent text-white placeholder:text-white/40 outline-none"
            />
          </div>
          {errors.password && (
            <p className="text-red-400 text-sm mt-1.5">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-1/4 flex items-center justify-center gap-2 rounded-xl bg-white text-[#0e1525] font-semibold py-4 text-lg hover:bg-white/90 transition-colors disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
            <CheckCircle2 className="w-5 h-5" strokeWidth={2} />
          </button>

          <p className="text-center w-3/4  text-white/60">
            Forgot password?{" "}
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="text-[#c4ff61] font-medium hover:underline"
            >
              click here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
