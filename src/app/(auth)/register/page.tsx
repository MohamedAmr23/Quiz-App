"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CircleUserRound,
  UserPlus,
  IdCard,
  Mail,
  Lock,
  ChevronDown,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";
import { axiosClient } from "@/shared/lib/apis/axiosClient";

const ROLES = ["Instructor", "Student"] as const;

const registerSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be at most 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  role: z.enum(ROLES, { message: "Please choose a role" }),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [roleOpen, setRoleOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const selectedRole = watch("role");

  async function onSubmit(data: RegisterFormValues) {
    try {
      const res = await axiosClient.post("/auth/register", data);
      toast.success(res.data?.message || "Account created successfully!");
      router.push("/login");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  }

  return (
    <div className="w-full">
      {/* Title */}
      <h1 className="text-[#c4ff61] text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-6 sm:mb-10">
        Create your account and start using QuizWiz!
      </h1>

      {/* Sign in / Sign up toggle */}
      <div className="grid grid-cols-2 gap-3 sm:gap-5 mb-6 sm:mb-10">
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#161e2f] py-4 sm:py-7 text-white hover:border-white/30 transition-colors"
        >
          <CircleUserRound className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={1.5} />
          <span className="font-medium text-sm sm:text-lg">Sign in</span>
        </button>
        <button
          type="button"
          className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-[#c4ff61] bg-[#161e2f] py-4 sm:py-7 text-[#c4ff61]"
        >
          <UserPlus className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={1.5} />
          <span className="font-medium text-sm sm:text-lg">Sign Up</span>
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-7" noValidate>

        {/* First / Last name — stacks on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label className="block text-white font-medium mb-2 sm:mb-3 text-sm sm:text-base">
              Your first name
            </label>
            <div
              className={`flex items-center gap-3 rounded-xl border bg-transparent px-3 sm:px-4 py-3 sm:py-3.5 ${
                errors.first_name ? "border-red-400" : "border-white/15"
              }`}
            >
              <IdCard className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 shrink-0" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="First name"
                {...register("first_name")}
                className="w-full min-w-0 bg-transparent text-white placeholder:text-white/40 outline-none text-sm sm:text-base"
              />
            </div>
            {errors.first_name && (
              <p className="text-red-400 text-xs sm:text-sm mt-1.5">
                {errors.first_name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-white font-medium mb-2 sm:mb-3 text-sm sm:text-base">
              Your last name
            </label>
            <div
              className={`flex items-center gap-3 rounded-xl border bg-transparent px-3 sm:px-4 py-3 sm:py-3.5 ${
                errors.last_name ? "border-red-400" : "border-white/15"
              }`}
            >
              <IdCard className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 shrink-0" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Last name"
                {...register("last_name")}
                className="w-full min-w-0 bg-transparent text-white placeholder:text-white/40 outline-none text-sm sm:text-base"
              />
            </div>
            {errors.last_name && (
              <p className="text-red-400 text-xs sm:text-sm mt-1.5">
                {errors.last_name.message}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-white font-medium mb-2 sm:mb-3 text-sm sm:text-base">
            Your email address
          </label>
          <div
            className={`flex items-center gap-3 rounded-xl border bg-transparent px-3 sm:px-4 py-3 sm:py-3.5 ${
              errors.email ? "border-red-400" : "border-white/15"
            }`}
          >
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 shrink-0" strokeWidth={1.5} />
            <input
              type="email"
              placeholder="Type your email"
              {...register("email")}
              className="w-full min-w-0 bg-transparent text-white placeholder:text-white/40 outline-none text-sm sm:text-base"
            />
          </div>
          {errors.email && (
            <p className="text-red-400 text-xs sm:text-sm mt-1.5">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Role */}
        <div className="relative">
          <label className="block text-white font-medium mb-2 sm:mb-3 text-sm sm:text-base">
            Your role
          </label>
          <button
            type="button"
            onClick={() => setRoleOpen((o) => !o)}
            className={`w-full flex items-center gap-3 rounded-xl border bg-transparent px-3 sm:px-4 py-3 sm:py-3.5 text-left ${
              errors.role ? "border-red-400" : "border-white/15"
            }`}
          >
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 shrink-0" strokeWidth={1.5} />
            <span
              className={`flex-1 text-sm sm:text-base ${
                selectedRole ? "text-white" : "text-white/40"
              }`}
            >
              {selectedRole || "Choose your role"}
            </span>
            <ChevronDown
              className={`w-4 h-4 sm:w-5 sm:h-5 text-white/60 transition-transform ${
                roleOpen ? "rotate-180" : ""
              }`}
              strokeWidth={1.5}
            />
          </button>
          {roleOpen && (
            <div className="absolute z-10 mt-2 w-full rounded-xl border border-white/15 bg-[#161e2f] overflow-hidden shadow-xl">
              {ROLES.map((role) => (
                <button
                  type="button"
                  key={role}
                  onClick={() => {
                    setValue("role", role, { shouldValidate: true });
                    setRoleOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-white text-sm sm:text-base hover:bg-white/10 transition-colors flex items-center justify-between"
                >
                  {role}
                  {selectedRole === role && (
                    <Check size={14} className="text-[#c4ff61]" />
                  )}
                </button>
              ))}
            </div>
          )}
          {errors.role && (
            <p className="text-red-400 text-xs sm:text-sm mt-1.5">
              {errors.role.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-white font-medium mb-2 sm:mb-3 text-sm sm:text-base">
            Password
          </label>
          <div
            className={`flex items-center gap-3 rounded-xl border bg-transparent px-3 sm:px-4 py-3 sm:py-3.5 ${
              errors.password ? "border-red-400" : "border-white/15"
            }`}
          >
            <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 shrink-0" strokeWidth={1.5} />
            <input
              type="password"
              placeholder="Type your password"
              {...register("password")}
              className="w-full min-w-0 bg-transparent text-white placeholder:text-white/40 outline-none text-sm sm:text-base"
            />
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs sm:text-sm mt-1.5">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-white text-[#0e1525] font-semibold py-3 sm:py-4 text-base sm:text-lg hover:bg-white/90 transition-colors disabled:opacity-60"
        >
          {isSubmitting ? "Signing up..." : "Sign Up"}
          <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-black">
            <Check size={12} className="text-white sm:hidden" />
            <Check size={14} className="text-white hidden sm:block" />
          </span>
        </button>
      </form>
    </div>
  );
}