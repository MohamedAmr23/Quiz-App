"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CircleUserRound,
  UserPlus,
  IdCard,
  Mail,
  Lock,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";
import { axiosClient } from "@/shared/lib/apis/axiosClient";


const ROLES = ["Instructor", "Student"];

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "",
  });
  const [roleOpen, setRoleOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(field: keyof typeof formData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosClient.post("/auth/register", formData);
      toast.success(res.data?.message || "Account created successfully!");
      router.push("/login");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-[#c4ff61] text-3xl sm:text-4xl font-bold leading-tight mb-10">
        Create your account and start using QuizWiz!
      </h1>

      {/* Sign in / Sign up toggle */}
      <div className="grid grid-cols-2 gap-5 mb-10">
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#161e2f] py-7 text-white hover:border-white/30 transition-colors"
        >
          <CircleUserRound className="w-8 h-8" strokeWidth={1.5} />
          <span className="font-medium text-lg">Sign in</span>
        </button>
        <button
          type="button"
          className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-[#c4ff61] bg-[#161e2f] py-7 text-[#c4ff61]"
        >
          <UserPlus className="w-8 h-8" strokeWidth={1.5} />
          <span className="font-medium text-lg">Sign Up</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-7">
        {/* First / last name */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-white font-medium mb-3">
              Your first name
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-transparent px-4 py-3.5">
              <IdCard className="w-5 h-5 text-white/60 shrink-0" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Type your first name"
                value={formData.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
                required
                className="w-full min-w-0 bg-transparent text-white placeholder:text-white/40 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-white font-medium mb-3">
              Your last name
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-transparent px-4 py-3.5">
              <IdCard className="w-5 h-5 text-white/60 shrink-0" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Type your last name"
                value={formData.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
                required
                className="w-full min-w-0 bg-transparent text-white placeholder:text-white/40 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-white font-medium mb-3">
            Your email address
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-transparent px-4 py-3.5">
            <Mail className="w-5 h-5 text-white/60 shrink-0" strokeWidth={1.5} />
            <input
              type="email"
              placeholder="Type your email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              className="w-full min-w-0 bg-transparent text-white placeholder:text-white/40 outline-none"
            />
          </div>
        </div>

        {/* Role */}
        <div className="relative">
          <label className="block text-white font-medium mb-3">Your role</label>
          <button
            type="button"
            onClick={() => setRoleOpen((o) => !o)}
            className="w-full flex items-center gap-3 rounded-xl border border-white/15 bg-transparent px-4 py-3.5 text-left"
          >
            <Mail className="w-5 h-5 text-white/60 shrink-0" strokeWidth={1.5} />
            <span
              className={`flex-1 ${formData.role ? "text-white" : "text-white/40"}`}
            >
              {formData.role || "Choose your role"}
            </span>
            <ChevronDown className="w-5 h-5 text-white/60" strokeWidth={1.5} />
          </button>
          {roleOpen && (
            <div className="absolute z-10 mt-2 w-full rounded-xl border border-white/15 bg-[#161e2f] overflow-hidden shadow-xl">
              {ROLES.map((role) => (
                <button
                  type="button"
                  key={role}
                  onClick={() => {
                    handleChange("role", role);
                    setRoleOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-colors"
                >
                  {role}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-white font-medium mb-3">Password</label>
          <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-transparent px-4 py-3.5">
            <Lock className="w-5 h-5 text-white/60 shrink-0" strokeWidth={1.5} />
            <input
              type="password"
              placeholder="Type your password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              required
              minLength={8}
              className="w-full min-w-0 bg-transparent text-white placeholder:text-white/40 outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-white text-[#0e1525] font-semibold py-4 text-lg hover:bg-white/90 transition-colors disabled:opacity-60"
        >
          {loading ? "Signing up..." : "Sign Up"}
          <CheckCircle2 className="w-5 h-5" strokeWidth={2} />
        </button>
      </form>
    </div>
  );
}