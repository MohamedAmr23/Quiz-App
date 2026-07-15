"use client";

import { useState } from "react";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { axiosClient } from "@/shared/lib/apis/axiosClient";


interface JoinQuizModalProps {
  onClose: () => void;
}

interface JoinSuccessData {
  title?: string;
  quiz?: { title?: string };
  message?: string;
}

export default function JoinQuizModal({ onClose }: JoinQuizModalProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<JoinSuccessData | null>(null);

  async function handleJoin() {
    if (!code.trim()) {
      setError("Please enter a quiz code.");
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await axiosClient.post<JoinSuccessData>("/quiz/join", {
        code: code.trim(),
      });
      setSuccess(data);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Invalid code or quiz not available.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    const quizTitle = success.title ?? success.quiz?.title ?? null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 size={32} className="text-green-500" />
          </div>

          <h2 className="text-base font-semibold text-gray-900">
            Quiz joined successfully
          </h2>

          {quizTitle && (
            <p className="mt-1.5 text-sm font-medium text-gray-500">
              {quizTitle}
            </p>
          )}

          <p className="mt-3 text-xs text-gray-400">
            Your instructor will start the quiz shortly. Good luck!
          </p>

          <button
            onClick={onClose}
            className="mt-6 w-full rounded-full bg-green-600 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Join Quiz</h2>
            <p className="mt-0.5 text-xs text-gray-400">
              Input the code received for the quiz below to join
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-100 text-gray-400 hover:bg-gray-50"
          >
            <X size={15} />
          </button>
        </div>

        <div className="px-6 py-5">
          <input
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            placeholder="Code"
            maxLength={10}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 font-mono text-base font-semibold tracking-widest text-gray-900 outline-none placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-300 focus:border-gray-400"
          />

          {error && (
            <p className="mt-2 text-xs text-red-500">{error}</p>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 border-t border-gray-100 px-6 py-4">
          <button
            onClick={handleJoin}
            disabled={isLoading || !code.trim()}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1B1D29] text-white transition hover:bg-black disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            )}
          </button>
          <button
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-50"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}