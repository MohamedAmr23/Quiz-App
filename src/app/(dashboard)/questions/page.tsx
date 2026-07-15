"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import {
  Question,
  questionsApi,
} from "@/features/questions/lib/apis/questions.api";
import QuestionsTable from "@/features/questions/components/QuestionsTable";
import ConfirmationModal from "@/shared/components/ConfirmationModal/ConfirmationModal";
import AddQuestionModal from "@/features/questions/components/AddQuestionModal";
import QuestionDetailsModal from "@/features/questions/components/QuestionDetailsModal";

const DIFFICULTIES = ["easy", "medium", "hard"] as const;
const TYPES = ["FE", "BE", "DO"] as const;

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [difficulty, setDifficulty] = useState("");
  const [type, setType] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<Question | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editTarget, setEditTarget] = useState<Question | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewTarget, setViewTarget] = useState<Question | null>(null);

  const handleEdit = (q: Question) => setEditTarget(q);
  const handleAdd = () => setAddModalOpen(true);
  const handleView = (q: Question) => setViewTarget(q);

  // ── Fetch ──────────────────────────────────────────────
  async function fetchQuestions() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await questionsApi.getAll();
      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setQuestions(sorted);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch questions");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  // ── Frontend filter ────────────────────────────────────
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchDifficulty = !difficulty || q.difficulty === difficulty;
      const matchType = !type || q.type === type;
      return matchDifficulty && matchType;
    });
  }, [questions, difficulty, type]);

  // ── Delete ─────────────────────────────────────────────
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

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-xl font-bold text-white">Bank of Questions</h1>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Difficulty Filter */}
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#161e2f] px-3.5 py-2.5 text-sm text-white outline-none cursor-pointer"
          >
            <option value="">All Difficulties</option>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d} className="capitalize bg-[#161e2f]">
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#161e2f] px-3.5 py-2.5 text-sm text-white outline-none cursor-pointer"
          >
            <option value="">All Types</option>
            {TYPES.map((t) => (
              <option key={t} value={t} className="bg-[#161e2f]">
                {t}
              </option>
            ))}
          </select>

          {/* Add */}
          <button
            onClick={handleAdd}
            className="flex items-center cursor-pointer gap-2 rounded-xl bg-[#161e2f] px-4 py-2.5 text-sm font-semibold text-white transition-colors"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Add Question
          </button>
        </div>
      </div>

      {/* Table */}
      <QuestionsTable
        questions={filteredQuestions}
        isLoading={isLoading}
        error={error}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={(q) => setDeleteTarget(q)}
      />

      {/* Delete Modal */}
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

      {/* Add & Edit Modal */}
      {(addModalOpen || editTarget) && (
        <AddQuestionModal
          initialData={editTarget ?? undefined}
          onClose={() => {
            setAddModalOpen(false);
            setEditTarget(null);
          }}
          onCreated={(newQ) => {
            setQuestions((prev) => [newQ, ...prev]);
            setAddModalOpen(false);
          }}
          onUpdated={(updatedQ) => {
            setQuestions((prev) =>
              prev.map((q) => (q._id === updatedQ._id ? updatedQ : q))
            );
            setEditTarget(null);
          }}
        />
      )}

      {/* View Modal */}
      <QuestionDetailsModal
        open={!!viewTarget}
        onClose={() => setViewTarget(null)}
        onEdit={() => {
          setEditTarget(viewTarget);
          setViewTarget(null);
        }}
        question={viewTarget}
      />
    </div>
  );
}
