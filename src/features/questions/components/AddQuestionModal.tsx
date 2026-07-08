"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import {
  questionsApi,
  QuestionPayload,
  Question,
} from "@/features/questions/lib/apis/questions.api";
import Modal from "@/shared/components/Modal";

const DIFFICULTY_OPTIONS = ["easy", "medium", "hard"] as const;
const TYPE_OPTIONS = ["FE", "BE", "DO"] as const;
const ANSWER_OPTIONS = ["A", "B", "C", "D"] as const;

const emptyForm: QuestionPayload = {
  title: "",
  description: "",
  options: { A: "", B: "", C: "", D: "" },
  answer: "A",
  difficulty: "easy",
  type: "FE",
  points: 1,
};

interface AddQuestionModalProps {
  onClose: () => void;
  onCreated?: (question: Question) => void;
  onUpdated?: (question: Question) => void;
  initialData?: Question;
}

export default function AddQuestionModal({
  onClose,
  onCreated,
  onUpdated,
  initialData,
}: AddQuestionModalProps) {
  const isEdit = !!initialData;

  const [form, setForm] = useState<QuestionPayload>(
    initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          options: {
            A: initialData.options.A,
            B: initialData.options.B,
            C: initialData.options.C,
            D: initialData.options.D,
          },
          answer: initialData.answer,
          difficulty: initialData.difficulty,
          type: initialData.type,
          points: initialData.points,
        }
      : emptyForm
  );

  const [error, setError] = useState<string | null>(null);

  function updateOption(key: "A" | "B" | "C" | "D", value: string) {
    setForm((prev) => ({
      ...prev,
      options: { ...prev.options, [key]: value },
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!form.description.trim()) {
      setError("Description is required.");
      return;
    }
    if (
      !form.options.A.trim() ||
      !form.options.B.trim() ||
      !form.options.C.trim() ||
      !form.options.D.trim()
    ) {
      setError("All four options are required.");
      return;
    }

    try {
      if (isEdit && initialData) {
        const updated = await questionsApi.edit(initialData._id, form);
        toast.success("Question updated successfully!");
        onUpdated?.(updated);
      } else {
        const created = await questionsApi.add(form);
        toast.success("Question created successfully!");
        onCreated?.(created);
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Something went wrong. Try again."
      );
    }
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      onSubmit={handleSubmit}
      formId="question-form"
      title={isEdit ? "Edit question" : "Add new question"}
    >
      {/* Title */}
      <div className="flex items-stretch overflow-hidden rounded-lg border border-gray-200">
        <span className="flex items-center bg-[#FFEDDF] px-4 py-3 text-sm text-gray-500 shrink-0">
          Title
        </span>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          placeholder="Enter question title"
          className="flex-1 bg-white px-4 py-3 text-sm outline-none text-gray-900 placeholder-gray-400"
        />
      </div>

      {/* Description */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <p className="bg-[#FFEDDF] px-4 py-2 text-xs font-medium text-gray-500">
          Description
        </p>
        <textarea
          value={form.description}
          onChange={(e) =>
            setForm((p) => ({ ...p, description: e.target.value }))
          }
          rows={2}
          placeholder="Enter the question text"
          className="w-full bg-white px-4 py-3 text-sm outline-none text-gray-900 placeholder-gray-400 resize-none"
        />
      </div>

      {/* Options */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <p className="bg-[#FFEDDF] px-4 py-2 text-xs font-medium text-gray-500">
          Options
        </p>
        <div className="divide-y divide-gray-100">
          {ANSWER_OPTIONS.map((key) => (
            <div key={key} className="flex items-center">
              <span className="flex items-center justify-center w-10 bg-gray-50 py-3 text-xs font-bold text-gray-400 border-r border-gray-100 shrink-0">
                {key}
              </span>
              <input
                type="text"
                value={form.options[key]}
                onChange={(e) => updateOption(key, e.target.value)}
                placeholder={`Option ${key}`}
                className="flex-1 bg-white px-4 py-3 text-sm outline-none text-gray-900 placeholder-gray-400"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Answer / Difficulty / Type */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-stretch overflow-hidden rounded-lg border border-gray-200">
          <span className="flex items-center bg-[#FFEDDF] px-4 py-3 text-xs text-gray-500 shrink-0">
            Correct answer
          </span>
          <select
            value={form.answer}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                answer: e.target.value as QuestionPayload["answer"],
              }))
            }
            className="flex-1 bg-white px-3 text-sm font-medium outline-none text-gray-900"
          >
            {ANSWER_OPTIONS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-stretch overflow-hidden rounded-lg border border-gray-200">
          <span className="flex items-center bg-[#FFEDDF] px-4 py-3 text-xs text-gray-500 shrink-0">
            Difficulty
          </span>
          <select
            value={form.difficulty}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                difficulty: e.target.value as QuestionPayload["difficulty"],
              }))
            }
            className="flex-1 bg-white px-3 text-sm font-medium outline-none text-gray-900"
          >
            {DIFFICULTY_OPTIONS.map((d) => (
              <option key={d} value={d} className="capitalize">
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-stretch overflow-hidden rounded-lg border border-gray-200">
          <span className="flex items-center bg-[#FFEDDF] px-4 py-3 text-xs text-gray-500 shrink-0">
            Type
          </span>
          <select
            value={form.type}
            onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
            className="flex-1 bg-white px-3 text-sm font-medium outline-none text-gray-900"
          >
            {TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </Modal>
  );
}
