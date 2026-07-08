"use client";

import { Pencil, X } from "lucide-react";
import { Question } from "@/features/questions/lib/apis/questions.api";
import Modal from "@/shared/components/Modal";

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-red-100 text-red-700",
};

interface QuestionDetailsModalProps {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  question: Question | null;
}

export default function QuestionDetailsModal({
  open,
  onClose,
  onEdit,
  question,
}: QuestionDetailsModalProps) {
  if (!open || !question) return null;

  return (
    <Modal isOpen={open} onClose={onClose} title="Question details">
      {/* Header card */}
      <div className="bg-[#FFEDDF] -mx-8 -mt-6 px-8 py-6 mb-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-orange-300 bg-white text-lg font-bold text-orange-500 shrink-0">
            {question.type}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 truncate">
              {question.title}
            </h2>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                  DIFFICULTY_COLORS[question.difficulty] ??
                  "bg-gray-100 text-gray-500"
                }`}
              >
                {question.difficulty}
              </span>
              <span className="rounded-full bg-white/70 px-3 py-1 text-xs text-gray-500">
                {question.points} pt{question.points !== 1 ? "s" : ""}
              </span>
              <span className="rounded-full bg-white/70 px-3 py-1 text-xs text-gray-500 capitalize">
                {question.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <InfoCard title="Question">
        <p className="text-sm text-gray-700 leading-relaxed">
          {question.description}
        </p>
      </InfoCard>

      {/* Options */}
      <InfoCard title="Options">
        <div className="space-y-2 mt-1">
          {(["A", "B", "C", "D"] as const).map((key) => {
            const isCorrect = question.answer === key;
            return (
              <div
                key={key}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border transition-colors ${
                  isCorrect
                    ? "border-green-200 bg-green-50"
                    : "border-gray-100 bg-gray-50"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    isCorrect
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {key}
                </span>
                <span
                  className={`text-sm ${
                    isCorrect ? "text-green-700 font-medium" : "text-gray-600"
                  }`}
                >
                  {question.options[key]}
                </span>
                {isCorrect && (
                  <span className="ml-auto text-[10px] font-semibold text-green-600 uppercase tracking-wide">
                    Correct
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </InfoCard>

      {/* Footer actions */}
      <div className="flex justify-end gap-3 -mx-8 -mb-6 mt-6 px-8 py-4 border-t border-gray-100 bg-gray-50">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 rounded-full bg-[#1B1D29] px-5 py-2 text-sm font-medium text-white transition hover:bg-black"
        >
          <Pencil size={13} />
          Edit
        </button>
        <button
          onClick={onClose}
          className="flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
        >
          <X size={13} />
          Close
        </button>
      </div>
    </Modal>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-4">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
        {title}
      </p>
      {children}
    </div>
  );
}
