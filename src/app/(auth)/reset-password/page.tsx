"use client";
import { Mail, LockKeyhole, KeyRound, Check, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { resetPassword } from "@/features/auth/lib/apis/auth.api";
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from "@/features/auth/lib/schemas/auth.schemas";
import { toast } from "react-toastify";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      otp: "",
      password: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setLoading(true);

      const response = await resetPassword(data);

      toast.success(response.data.message);

      router.push("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className=" flex items-center justify-center px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
        <h2 className="mb-8 text-4xl font-bold text-[#BFD641]">
          Reset Password
        </h2>

        <div className="mb-5">
          <label className="mb-2 block text-sm text-white">Email Address</label>

          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white"
              size={18}
            />

            <input
              type="email"
              placeholder="Type your email"
              {...register("email")}
              className="w-full rounded-md border border-white bg-transparent py-3 pl-10 pr-4 text-white placeholder:text-gray-400 outline-none"
            />
          </div>

          <p className="mt-1 text-sm text-red-500">{errors.email?.message}</p>
        </div>

        <div className="mb-5">
          <label className="mb-2 block text-sm text-white">OTP</label>

          <div className="relative">
            <KeyRound
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white"
              size={18}
            />

            <input
              type="text"
              placeholder="Enter OTP"
              {...register("otp")}
                autoComplete="one-time-code"

              className="w-full rounded-md border border-white bg-transparent py-3 pl-10 pr-4 text-white placeholder:text-gray-400 outline-none"
            />
          </div>

          <p className="mt-1 text-sm text-red-500">{errors.otp?.message}</p>
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="mb-2 block text-sm text-white">New Password</label>

          <div className="relative">
            <LockKeyhole
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white"
              size={18}
            />

            <input
              type="password"
              placeholder="Type your password"
              {...register("password")} 
                           autoComplete="current-password"

              className="w-full rounded-md border border-white bg-transparent py-3 pl-10 pr-4 text-white placeholder:text-gray-400 outline-none"
            />
          </div>

          <p className="mt-1 text-sm text-red-500">
            {errors.password?.message}
          </p>
        </div>

        {/* Confirm Password */}
        {/* <div className="mb-8">
        <label className="mb-2 block text-sm text-white">
          Confirm Password
        </label>

        <div className="relative">
          <LockKeyhole
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white"
            size={18}
          />

          <input
            type="password"
            placeholder="Confirm password"
            {...register("confirmPassword")}
            className="w-full rounded-md border border-white bg-transparent py-3 pl-10 pr-4 text-white placeholder:text-gray-400 outline-none"
          />
        </div>

        <p className="mt-1 text-sm text-red-500">
          {errors.confirmPassword?.message}
        </p>
      </div> */}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-3 rounded-md bg-white px-5 py-3 font-semibold text-black disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Loading...
            </>
          ) : (
            <>
              Reset Password
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black">
                <Check size={14} className="text-white" />
              </span>
            </>
          )}
        </button>
      
      </form>
    </div>
  );
}
