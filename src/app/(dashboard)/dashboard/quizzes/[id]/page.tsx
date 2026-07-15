"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, Clock, Pencil, Loader2, Trash2, Lock, Code2, Star, Hash, Hourglass, AlignLeft, Archive } from "lucide-react";
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
    // ✅ TypeScript fix: guard against undefined _id before calling updateQuiz
    if (!quiz?._id) return;
    try {
      setIsSaving(true);
      const updated = await updateQuiz(quiz._id, {
        title: editTitle,
        description: editDescription,
        duration: editDuration,
        score_per_question: editScorePerQuestion,
      });
      setQuiz(updated);
      setIsEditing(false);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Couldn't update quiz.";
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    // ✅ TypeScript fix: guard against undefined _id before calling deleteQuiz
    if (!quiz?._id) return;
    try {
      setIsDeleting(true);
      await deleteQuiz(quiz._id);
      router.push("/dashboard/quizzes");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Couldn't delete quiz.";
      setError(msg);
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin text-gray-300" />
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="px-8 py-8">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (!quiz) return null;

  return (
    <div className="px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-5 flex items-center gap-2 text-xs text-gray-400">
        <button
          onClick={() => router.push("/dashboard/quizzes")}
          className="hover:text-gray-700"
        >
          Quizzes
        </button>
        <span className="text-gray-200">›</span>
        <span className="font-medium text-gray-700">{quiz.title}</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

        {/* Header row: title + code + status */}
        <div className="mb-2 flex items-start justify-between gap-3">
          {isEditing ? (
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-lg font-semibold text-gray-900 outline-none focus:border-gray-400"
            />
          ) : (
            <h1 className="text-lg font-semibold capitalize text-gray-900">
              {quiz.title}
            </h1>
          )}
          <div className="flex shrink-0 items-center gap-2">
            <StatusBadge status={quiz.status} />
            <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-[11px] text-gray-400">
              {quiz.code}
            </span>
          </div>
        </div>

        {/* Date & time */}
        <div className="mb-5 flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} />
            {format(new Date(quiz.schadule), "dd / MM / yyyy")}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} />
            {format(new Date(quiz.schadule), "HH : mm")}
          </span>
        </div>

        {/* Info rows */}
        <div className="mb-4 space-y-2">
          <EditableRow
            label="Duration"
            icon={<Hourglass size={13} />}
            isEditing={isEditing}
            value={editDuration}
            onChange={(v) => setEditDuration(Number(v))}
            display={`${quiz.duration} minutes`}
            type="number"
          />
          <EditableRow
            label="No. of questions"
            icon={<Hash size={13} />}
            isEditing={isEditing}
            value={editQuestionsNumber}
            onChange={(v) => setEditQuestionsNumber(Number(v))}
            display={String(quiz.questions_number)}
            type="number"
          />
          <EditableRow
            label="Score / question"
            icon={<Star size={13} />}
            isEditing={isEditing}
            value={editScorePerQuestion}
            onChange={(v) => setEditScorePerQuestion(Number(v))}
            display={`${quiz.score_per_question} pts`}
            type="number"
          />
          <InfoRow label="Difficulty" icon={<Hash size={13} />}>
            <DifficultyBadge difficulty={quiz.difficulty} />
          </InfoRow>
          <InfoRow label="Type" icon={<Code2 size={13} />}>
            <span className="font-mono text-xs">{quiz.type}</span>
          </InfoRow>
        </div>

        {/* Description */}
        <div className="mb-4 overflow-hidden rounded-xl border border-gray-100">
          <div className="flex items-center gap-1.5 bg-[#FFF5ED] px-4 py-2 text-xs font-medium text-[#92510A]">
            <AlignLeft size={12} />
            Description
          </div>
          {isEditing ? (
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full bg-white px-4 py-3 text-sm text-gray-700 outline-none"
              rows={3}
            />
          ) : (
            <p className="bg-white px-4 py-3 text-sm leading-relaxed text-gray-600">
              {quiz.description || (
                <span className="text-gray-400">No description provided.</span>
              )}
            </p>
          )}
        </div>

        {/* Question bank */}
        <div className="mb-4">
          <InfoRow label="Question bank" icon={<Archive size={13} />}>
            <span className="text-sm">Bank one</span>
          </InfoRow>
        </div>

        {/* Randomize */}
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#1B1D29]">
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-sm text-gray-700">Randomize questions</span>
        </div>

        {/* Actions */}
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-full bg-[#1B1D29] px-5 py-2 text-sm font-medium text-white transition hover:bg-black disabled:opacity-60"
            >
              {isSaving && <Loader2 size={13} className="animate-spin" />}
              Save
            </button>
            <button
              onClick={() => { setIsEditing(false); resetEditState(quiz); }}
              className="rounded-full border border-gray-200 px-5 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 rounded-full bg-[#1B1D29] px-5 py-2 text-sm font-medium text-white transition hover:bg-black"
            >
              <Pencil size={13} />
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 rounded-full border border-red-100 px-5 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
            >
              <Trash2 size={13} />
              Delete
            </button>
          </div>
        )}

        {error && (
          <p className="mt-3 text-xs text-red-500">{error}</p>
        )}
      </div>

      {/* Delete confirm modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <Trash2 size={22} className="text-red-400" />
            </div>
            <h3 className="mb-1 text-base font-semibold text-gray-900">
              Delete quiz?
            </h3>
            <p className="mb-6 text-sm text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-800">{quiz.title}</span>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-full border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-red-500 py-2.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-60"
              >
                {isDeleting && <Loader2 size={13} className="animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ── */

function InfoRow({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex overflow-hidden rounded-xl border border-gray-100">
      <span className="flex w-44 shrink-0 items-center gap-1.5 bg-[#FFF5ED] px-4 py-2.5 text-xs text-[#92510A]">
        {icon}
        {label}
      </span>
      <span className="flex flex-1 items-center bg-white px-4 py-2.5 text-sm font-medium text-gray-900">
        {children}
      </span>
    </div>
  );
}

function EditableRow({
  label,
  icon,
  isEditing,
  value,
  onChange,
  display,
  type = "text",
}: {
  label: string;
  icon: React.ReactNode;
  isEditing: boolean;
  value: string | number;
  onChange: (v: string) => void;
  display: string;
  type?: string;
}) {
  return (
    <div className="flex overflow-hidden rounded-xl border border-gray-100">
      <span className="flex w-44 shrink-0 items-center gap-1.5 bg-[#FFF5ED] px-4 py-2.5 text-xs text-[#92510A]">
        {icon}
        {label}
      </span>
      {isEditing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white px-4 py-2 text-sm font-medium text-gray-900 outline-none focus:bg-gray-50"
        />
      ) : (
        <span className="flex flex-1 items-center bg-white px-4 py-2.5 text-sm font-medium text-gray-900">
          {display}
        </span>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    closed:    "bg-red-50 text-red-500",
    open:      "bg-green-50 text-green-600",
    scheduled: "bg-yellow-50 text-yellow-600",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${map[status] ?? "bg-gray-50 text-gray-500"}`}>
      {status === "closed" && <Lock size={9} />}
      {status}
    </span>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const map: Record<string, string> = {
    easy:   "bg-green-50 text-green-600",
    medium: "bg-amber-50 text-amber-600",
    hard:   "bg-red-50 text-red-500",
  };
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${map[difficulty] ?? "bg-gray-50 text-gray-500"}`}>
      {difficulty}
    </span>
  );
}