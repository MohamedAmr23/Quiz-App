"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { toast } from "react-toastify";
import { joinQuiz } from "../../services/dashboard.service";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function JoinQuizModal({ open, onClose }: Props) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  if (!open) return null;

  const handleJoin = async () => {
    if (!code.trim()) {
      toast.error("Please enter a quiz code");
      return;
    }

    setLoading(true);

    try {
      const res = await joinQuiz({
        code: code.trim(),
      });

      console.log("JOIN RESPONSE:", res);

      const quizId =
        res?.data?.quiz || res?.data?.data?.quiz || res?.quiz || res?.data?.id;

      if (!quizId) {
        toast.error("Quiz id not found");
        return;
      }

      toast.success("Joined Successfully");

      setCode("");

      onClose();

      router.push(`/dashboard/quiz/${quizId}`);
    } catch (error: any) {
      console.log("JOIN ERROR:", error?.response?.data);

      toast.error(
        Array.isArray(error?.response?.data?.message)
          ? error.response.data.message[0]
          : error?.response?.data?.message || "Failed to join the quiz",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 h-screen">
      <div className="bg-white rounded-xl shadow-lg p-8 ">
        <h2 className="text-3xl font-bold text-center mb-4">Join Quiz</h2>

        <p className="text-center text-gray-600 mb-8">
          Input the code received for the quiz below to join
        </p>

        <div className="flex border rounded-md overflow-hidden">
          <span className="bg-[#F8E7D8] px-5 flex items-center font-semibold">
            Code
          </span>

          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter quiz code"
            className="flex-1 px-4 py-3 outline-none"
          />
        </div>

        <div className="flex justify-center gap-4 mt-10">
          <button
            disabled={loading}
            onClick={handleJoin}
            className="
            w-28 h-16 
            border rounded-lg 
            flex items-center justify-center 
            hover:bg-green-100
            disabled:opacity-50
            "
          >
            {loading ? "sending..." : <Check size={28} />}
          </button>

          <button
            onClick={() => {
              setCode("");
              onClose();
            }}
            className="
            w-28 h-16 
            border rounded-lg 
            flex items-center justify-center 
            hover:bg-red-100
            "
          >
            <X size={28} />
          </button>
        </div>
      </div>
    </div>
  );
}
