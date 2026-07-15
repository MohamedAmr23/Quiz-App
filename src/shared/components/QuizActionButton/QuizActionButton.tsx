"use client";

import { AlarmClock } from "lucide-react";
import { useRouter } from "next/navigation";

interface QuizActionProps {
  role: string;
}

export default function QuizAction({ role }: QuizActionProps) {
  const router = useRouter();

  const isStudent = role === "Student";

  const handleClick = () => {
    if (isStudent) {
      router.push("/dashboard/quizzes");
    } else {
      router.push("/dashboard/quizzes");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="
        flex items-center gap-3
        rounded-xl
        border border-gray-200
        px-4 py-2
        hover:bg-[#FFF5EC]
        transition
      "
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFEDDF]">
        <AlarmClock className="h-5 w-5 text-black" />
      </div>

      <span className="font-semibold text-sm text-gray-800">
        {isStudent ? "Join Quiz" : "New Quiz"}
      </span>
    </button>
  );
}