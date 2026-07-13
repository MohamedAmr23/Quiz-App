"use client";

import { useRouter } from "next/navigation";
import { AlarmClock } from "lucide-react";

export default function JoinQuiz() {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/join-quiz")}
      className="w-full sm:w-47 sm:h-36 rounded-2xl border border-gray-200 p-5 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all hover:-translate-y-1 hover:border-[#E9DDD1] hover:shadow-md"
    >
      <AlarmClock className="h-12 w-12 text-black" />
      <h2 className="text-base font-bold">Join Quiz</h2>
    </div>
  );
}