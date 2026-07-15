"use client";

import { useEffect, useState, useMemo } from "react";
import { Plus, Pencil, Trash2, Loader2, BookOpen } from "lucide-react";
import { axiosClient } from "@/shared/lib/apis/axiosClient";
import { toast } from "react-toastify";
import AddQuestionModal from "@/features/questions/components/AddQuestionModal";
import ConfirmationModal from "@/shared/components/ConfirmationModal/ConfirmationModal";
import {
  Question,
  questionsApi,
} from "@/features/questions/lib/apis/questions.api";

type TypeFilter = "ALL" | "FE" | "BE" | "DO";
type DiffFilter = "ALL" | "easy" | "medium" | "hard";

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [diffFilter, setDiffFilter] = useState<DiffFilter>("ALL");

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Question | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Question | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;

    setIsDeleting(true);

    try {
      await questionsApi.delete(deleteTarget._id);

      toast.success("Question deleted successfully!");

      setQuestions((prev) => prev.filter((q) => q._id !== deleteTarget._id));

      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete question");
    } finally {
      setIsDeleting(false);
    }
  }

  useEffect(() => {
    async function fetch() {
      try {
        setIsLoading(true);
        const { data } = await axiosClient.get<Question[]>("/question");
        setQuestions(data);
      } catch {
        setError("Couldn't load questions.");
      } finally {
        setIsLoading(false);
      }
    }
    fetch();
  }, []);

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      const typeOk = typeFilter === "ALL" || q.type === typeFilter;
      const diffOk = diffFilter === "ALL" || q.difficulty === diffFilter;
      return typeOk && diffOk;
    });
  }, [questions, typeFilter, diffFilter]);

  // stats
  const fe = questions.filter((q) => q.type === "FE").length;
  const be = questions.filter((q) => q.type === "BE").length;
  const doCount = questions.filter((q) => q.type === "DO").length;

  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Question bank</h1>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 rounded-full bg-[#1B1D29] px-4 py-2 text-sm font-medium text-white transition hover:bg-black"
        >
          <Plus size={15} />
          New question
        </button>
      </div>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-4 gap-3">
        {[
          { label: "Total questions", value: questions.length },
          { label: "Frontend (FE)", value: fe },
          { label: "Backend (BE)", value: be },
          { label: "DevOps (DO)", value: doCount },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-gray-50 px-4 py-3">
            <p className="text-[11px] text-gray-400">{s.label}</p>
            <p className="mt-0.5 text-xl font-semibold text-gray-900">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {(["ALL", "FE", "BE", "DO"] as TypeFilter[]).map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              typeFilter === t
                ? "border-[#1B1D29] bg-[#1B1D29] text-white"
                : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            {t === "ALL" ? "All types" : t}
          </button>
        ))}
        <span className="ml-auto flex items-center gap-2">
          {(["ALL", "easy", "medium", "hard"] as DiffFilter[]).map((d) => (
            <button
              key={d}
              onClick={() => setDiffFilter(d)}
              className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition ${
                diffFilter === d
                  ? "border-[#1B1D29] bg-[#1B1D29] text-white"
                  : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {d === "ALL" ? "All levels" : d}
            </button>
          ))}
        </span>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-gray-300" />
        </div>
      )}

      {/* Error */}
      {!isLoading && error && <p className="text-sm text-red-500">{error}</p>}

      {/* Empty */}
      {!isLoading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BookOpen size={36} className="mb-3 text-gray-200" />
          <p className="text-sm text-gray-400">
            No questions match your filters.
          </p>
        </div>
      )}

      {/* Grid */}
      {!isLoading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((q) => (
            <QuestionCard
              key={q._id}
              question={q}
              onEdit={(q) => setEditTarget(q)}
              onDelete={(q) => setDeleteTarget(q)}
            />
          ))}
        </div>
      )}
      {(addModalOpen || editTarget) && (
        <AddQuestionModal
          initialData={editTarget ?? undefined}
          onClose={() => {
            setAddModalOpen(false);
            setEditTarget(null);
          }}
          onCreated={(newQuestion) => {
            setQuestions((prev) => [newQuestion, ...prev]);
            setAddModalOpen(false);
          }}
          onUpdated={(updatedQuestion) => {
            setQuestions((prev) =>
              prev.map((q) =>
                q._id === updatedQuestion._id ? updatedQuestion : q
              )
            );

            setEditTarget(null);
          }}
        />
      )}

      <ConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Question?"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
}
interface QuestionCardProps {
  question: Question;
  onEdit: (question: Question) => void;
  onDelete: (question: Question) => void;
}

function QuestionCard({ question: q, onEdit, onDelete }: QuestionCardProps) {
  const optionKeys = ["A", "B", "C", "D"] as const;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-gray-200">
      {/* Top row */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-gray-900">{q.title}</p>
        <div className="flex shrink-0 items-center gap-1.5">
          <TypeBadge type={q.type} />
          <DiffBadge difficulty={q.difficulty} />
        </div>
      </div>

      {/* Description */}
      <p className="mb-3 text-xs leading-relaxed text-gray-500">
        {q.description}
      </p>

      {/* Options */}
      <div className="mb-3 grid grid-cols-2 gap-1.5">
        {optionKeys.map((key) => (
          <div
            key={key}
            className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs ${
              q.answer === key
                ? "border-green-200 bg-green-50 font-medium text-green-700"
                : "border-gray-100 text-gray-500"
            }`}
          >
            <span className="font-semibold">{key}</span>
            <span className="truncate">{q.options[key]}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-2.5">
        <span className="flex items-center gap-1 text-[11px] text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          {q.points} {q.points === 1 ? "pt" : "pts"}
        </span>
        <div className="flex gap-1.5">
          <button
            onClick={() => onEdit(q)}
            aria-label="Edit question"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-100 text-gray-400 transition hover:border-gray-300 hover:text-gray-700"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(q)}
            aria-label="Delete question"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-100 text-gray-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    FE: "bg-blue-50 text-blue-600",
    BE: "bg-purple-50 text-purple-600",
    DO: "bg-amber-50 text-amber-600",
  };
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
        map[type] ?? "bg-gray-50 text-gray-500"
      }`}
    >
      {type}
    </span>
  );
}

function DiffBadge({ difficulty }: { difficulty: string }) {
  const map: Record<string, string> = {
    easy: "bg-green-50 text-green-600",
    medium: "bg-amber-50 text-amber-600",
    hard: "bg-red-50 text-red-500",
  };
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[10px] font-medium capitalize ${
        map[difficulty] ?? "bg-gray-50 text-gray-500"
      }`}
    >
      {difficulty}
    </span>
  );
}
