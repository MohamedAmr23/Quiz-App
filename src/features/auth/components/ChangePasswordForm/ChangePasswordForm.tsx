"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import { axiosClient } from "@/shared/lib/apis/axiosClient";

const changePasswordSchema = z
  .object({
    password: z.string().min(1, "Current password is required"),
    password_new: z
      .string()
      .min(1, "New password is required")
      .min(8, "New password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    password_confirm: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.password_new === data.password_confirm, {
    message: "Passwords do not match",
    path: ["password_confirm"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onBlur",
  });

  async function onSubmit(data: ChangePasswordFormValues) {
    try {
      const res = await axiosClient.post("/auth/change-password", {
        password: data.password,
        password_new: data.password_new,
      });

      toast.success(res.data?.message || "Password changed successfully!");

      // clear storage and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userProfile");
      }

      router.push("/login");
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
        Change your password
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7" noValidate>
        {/* Current Password */}
        <div>
          <label className="block text-white font-medium mb-3">
            Current password
          </label>
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
              placeholder="Type your current password"
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

        {/* New Password */}
        <div>
          <label className="block text-white font-medium mb-3">
            New password
          </label>
          <div
            className={`flex items-center gap-3 rounded-xl border bg-transparent px-4 py-3.5 ${
              errors.password_new ? "border-red-400" : "border-white/15"
            }`}
          >
            <Lock
              className="w-5 h-5 text-white/60 shrink-0"
              strokeWidth={1.5}
            />
            <input
              type="password"
              placeholder="Type your new password"
              {...register("password_new")}
              className="w-full min-w-0 bg-transparent text-white placeholder:text-white/40 outline-none"
            />
          </div>
          {errors.password_new && (
            <p className="text-red-400 text-sm mt-1.5">
              {errors.password_new.message}
            </p>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-white font-medium mb-3">
            Confirm new password
          </label>
          <div
            className={`flex items-center gap-3 rounded-xl border bg-transparent px-4 py-3.5 ${
              errors.password_confirm ? "border-red-400" : "border-white/15"
            }`}
          >
            <Lock
              className="w-5 h-5 text-white/60 shrink-0"
              strokeWidth={1.5}
            />
            <input
              type="password"
              placeholder="Confirm your new password"
              {...register("password_confirm")}
              className="w-full min-w-0 bg-transparent text-white placeholder:text-white/40 outline-none"
            />
          </div>
          {errors.password_confirm && (
            <p className="text-red-400 text-sm mt-1.5">
              {errors.password_confirm.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-white text-[#0e1525] font-semibold py-4 text-lg hover:bg-white/90 transition-colors disabled:opacity-60"
        >
          {isSubmitting ? "Changing..." : "Change Password"}
          <CheckCircle2 className="w-5 h-5" strokeWidth={2} />
        </button>
      </form>
    </div>
  );
}
