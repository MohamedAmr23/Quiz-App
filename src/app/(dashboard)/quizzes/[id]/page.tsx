"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, Clock, Pencil, Loader2, Trash2 } from "lucide-react";
import { getQuizById, updateQuiz, deleteQuiz } from "@/shared/lib/services/quiz.service";
import { Quiz } from "@/shared/lib/types/quiz";
import { format } from "date-fns";

export default function QuizDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // one editable field per property, instead of just title
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDuration, setEditDuration] = useState(0);
  const [editQuestionsNumber, setEditQuestionsNumber] = useState(0);
  const [editScorePerQuestion, setEditScorePerQuestion] = useState(0);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        const data = await getQuizById(id);
        setQuiz(data);
        resetEditState(data);
      } catch {
        setError("Couldn't load quiz details.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  function resetEditState(data: Quiz) {
    setEditTitle(data.title);
    setEditDescription(data.description ?? "");
    setEditDuration(data.duration);
    setEditQuestionsNumber(data.questions_number);
    setEditScorePerQuestion(data.score_per_question);
  }

  async function handleSave() {
    if (!quiz) return;
    try {
      setIsSaving(true);
      const updated = await updateQuiz(quiz._id, {
        title: editTitle,
        description: editDescription,
        duration: editDuration,
        score_per_question: editScorePerQuestion,
        // NOTE: questions_number intentionally omitted.
        // Sending it triggers a backend crash (500 — "Cannot read
        // properties of undefined (reading 'sort')") because the API
        // tries to re-select questions from the bank when this field
        // changes. Since questions_number is fixed at 1 everywhere in
        // this app, there's nothing to update here anyway.
      });
      setQuiz(updated);
      setIsEditing(false);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Couldn't update quiz.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!quiz) return;
    try {
      setIsDeleting(true);
      await deleteQuiz(quiz._id);
      router.push("/quizzes");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Couldn't delete quiz.");
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="px-8 py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!quiz) return null;

  return (
    <div className="px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <button onClick={() => router.push("/quizzes")} className="hover:text-gray-800">
          Quizzes
        </button>
        <span className="text-gray-300">›</span>
        <span className="font-medium text-gray-800">{quiz.title}</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

        {/* Title */}
        {isEditing ? (
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="mb-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-xl font-bold text-gray-900 outline-none focus:border-gray-400"
          />
        ) : (
          <h1 className="mb-2 text-xl font-bold capitalize text-gray-900">{quiz.title}</h1>
        )}

        {/* Date & Time (kept read-only — see note below) */}
        <div className="mb-5 flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {format(new Date(quiz.schadule), "dd / MM / yyyy")}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {format(new Date(quiz.schadule), "HH : mm")}
          </span>
        </div>

        {/* Info rows — now editable */}
        <div className="mb-4 space-y-3">
          <EditableRow
            label="Duration"
            isEditing={isEditing}
            value={editDuration}
            onChange={(v) => setEditDuration(Number(v))}
            display={`${quiz.duration} minutes`}
            type="number"
          />
          <EditableRow
            label="Number of questions"
            isEditing={isEditing}
            value={editQuestionsNumber}
            onChange={(v) => setEditQuestionsNumber(Number(v))}
            display={String(quiz.questions_number)}
            type="number"
          />
          <EditableRow
            label="Score per question"
            isEditing={isEditing}
            value={editScorePerQuestion}
            onChange={(v) => setEditScorePerQuestion(Number(v))}
            display={String(quiz.score_per_question)}
            type="number"
          />
        </div>

        {/* Description */}
        <div className="mb-4 overflow-hidden rounded-lg border border-gray-200">
          <p className="bg-[#FFEDDF] px-4 py-2 text-xs font-medium text-gray-500">Description</p>
          {isEditing ? (
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full bg-white px-4 py-3 text-sm text-gray-700 outline-none"
              rows={3}
            />
          ) : (
            <p className="bg-white px-4 py-3 text-sm leading-relaxed text-gray-700">
              {quiz.description || <span className="text-gray-400">No description provided.</span>}
            </p>
          )}
        </div>

        {/* Question bank */}
        <div className="mb-4">
          <InfoRow label="Question bank used" value="Bank one" />
        </div>

        {/* Randomize */}
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-[#1B1D29]">
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-sm text-gray-700">Randomize questions</span>
        </div>

        {/* Action buttons */}
        {isEditing ? (
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-full bg-[#1B1D29] px-6 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-60"
            >
              {isSaving && <Loader2 size={14} className="animate-spin" />}
              Save
            </button>
            <button
              onClick={() => { setIsEditing(false); resetEditState(quiz); }}
              className="rounded-full border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 rounded-full bg-[#1B1D29] px-6 py-2.5 text-sm font-semibold text-white hover:bg-black"
            >
              <Pencil size={14} />
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 rounded-full border border-red-200 px-6 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        )}

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      </div>

      {/* Delete confirmation modal (unchanged) */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h3 className="mb-2 text-base font-semibold text-gray-900">Delete quiz?</h3>
            <p className="mb-6 text-sm text-gray-500">
              Are you sure you want to delete <span className="font-medium text-gray-800">{quiz.title}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-full border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
              >
                {isDeleting && <Loader2 size={14} className="animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-stretch overflow-hidden rounded-lg border border-gray-200">
      <span className="flex w-48 shrink-0 items-center bg-[#FFEDDF] px-4 py-2.5 text-sm text-gray-600">
        {label}
      </span>
      <span className="flex flex-1 items-center bg-white px-4 py-2.5 text-sm font-medium text-gray-900">
        {value}
      </span>
    </div>
  );
}

function EditableRow({
  label,
  isEditing,
  value,
  onChange,
  display,
  type = "text",
}: {
  label: string;
  isEditing: boolean;
  value: string | number;
  onChange: (v: string) => void;
  display: string;
  type?: string;
}) {
  return (
    <div className="flex items-stretch overflow-hidden rounded-lg border border-gray-200">
      <span className="flex w-48 shrink-0 items-center bg-[#FFEDDF] px-4 py-2.5 text-sm text-gray-600">
        {label}
      </span>
      {isEditing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white px-4 py-2 text-sm font-medium text-gray-900 outline-none"
        />
      ) : (
        <span className="flex flex-1 items-center bg-white px-4 py-2.5 text-sm font-medium text-gray-900">
          {display}
        </span>
      )}
    </div>
  );
}