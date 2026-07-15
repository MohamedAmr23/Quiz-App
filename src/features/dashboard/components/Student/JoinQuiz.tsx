"use client";

import { useState } from "react";
import { AlarmClock } from "lucide-react";
import JoinQuizModal from "./JoinQuizModal";

export default function JoinQuiz() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="w-full sm:w-47 sm:h-36 rounded-2xl border border-gray-200 p-5 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all hover:-translate-y-1 hover:border-[#E9DDD1] hover:shadow-md"
      >
        <AlarmClock className="h-12 w-12 text-black" />
        <h2 className="text-base font-bold">Join Quiz</h2>
      </div>

      <JoinQuizModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}