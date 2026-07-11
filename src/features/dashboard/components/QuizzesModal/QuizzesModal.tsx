"use client";

import { X, Users } from "lucide-react";
import { Quiz } from "../../interfaces/dashboard.interface";

interface QuizDetailsModalProps {
  open: boolean;
  onClose: () => void;
  quiz: Quiz | null;
}

export default function QuizzesModal({
  open,
  onClose,
  quiz,
}: QuizDetailsModalProps) {
  if (!open || !quiz) return null;

  const initials = quiz.title
    ?.split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl border border-gray-100">

        <div className="flex items-center gap-4 border-b border-gray-100 bg-[#FCFAF8] p-4">

          <button
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full p-1.5 hover:bg-gray-100 transition"
          >
            <X size={18} />
          </button>


          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-lg font-bold shrink-0">
            {initials}
          </div>


          <div className="min-w-0">
            <h2 className="text-lg font-bold text-gray-800 truncate">
              {quiz.title}
            </h2>

            <p className="text-sm text-gray-500">
              Quiz Details
            </p>
          </div>

        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">

          <InfoCard
            title="Title"
            value={quiz.title}
          />


          <InfoCard
            title="Status"
            value={
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  quiz.status === "open"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {quiz.status === "open" ? "Open" : "Closed"}
              </span>
            }
          />


          <InfoCard
            title="Schedule"
            value={new Date(quiz.schadule).toLocaleDateString("en-GB")}
          />


          <InfoCard
            title="Time"
            value={new Date(quiz.schadule).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          />


          <InfoCard
            title="Students Enrolled"
            value={
              <div className="flex items-center gap-2">
                <Users size={16} />
                {quiz.participants}
              </div>
            }
          />

        </div>


        <div className="flex justify-end border-t border-gray-100 bg-gray-50 px-4 py-3">

          <button
            onClick={onClose}
            className="rounded-xl bg-black px-5 py-2 text-sm font-semibold text-white hover:scale-105 transition"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
}



function InfoCard({
  title,
  value,
}: {
  title: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">

      <p className="text-xs font-semibold text-gray-400 uppercase">
        {title}
      </p>

      <div className="mt-2 text-sm font-bold text-gray-800 break-words">
        {value}
      </div>

    </div>
  );
}