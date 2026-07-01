"use client";
import Link from "next/link";
import { Mail, Check, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { forgetPassword } from "@/features/auth/lib/apis/auth.api";
import axios from "axios";
import { toast } from "react-toastify";

import { useRouter } from "next/navigation";
import {
  ForgetPasswordFormData,
  forgetPasswordSchema,
} from "@/features/auth/lib/schemas/auth.schemas";

export default function ForgetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordFormData>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const onSubmit = async (data: ForgetPasswordFormData) => {
    try {
      setLoading(true);

      const response = await forgetPassword(data);
      toast.success(response.data.message);

      router.push("/reset-password");
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
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
      <h1 className="mb-10 text-4xl font-bold text-[#BFD641]">
        Forgot password
      </h1>

      <div className="mb-8">
        <label className="mb-2 block text-sm text-white">Email address</label>

        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white"
            size={18}
          />

          <input
            type="email"
            placeholder="Type your email"
            className="w-full rounded-md border border-white bg-transparent py-3 pl-10 pr-4 text-white placeholder:text-gray-400 outline-none"
            {...register("email")}
          />
        </div>

        {errors.email && (
          <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-3 rounded-md bg-white px-6 py-3 font-medium text-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Sending...
          </>
        ) : (
          <>
            Send Email
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black">
              <Check size={14} className="text-white" />
            </span>
          </>
        )}
      </button>

      <p className="mt-24 text-right text-sm text-white">
        Login?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#BFD641] hover:underline"
        >
          click here
        </Link>
      </p>
    </form>
  );
}
