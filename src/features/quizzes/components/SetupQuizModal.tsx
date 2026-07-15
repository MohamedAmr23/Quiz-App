"use client";

import {
  X,
  Check,
  Loader2,
  Calendar,
  Clock,
  Copy,
  CheckCheck,
} from "lucide-react";
import { createQuiz } from "@/shared/lib/services/quiz.service";
import { CreateQuizPayload, Quiz, QuizType } from "@/shared/lib/types/quiz";
import { useEffect, useState } from "react";
import { groupsApi } from "@/features/groups/lib/apis/groups.api";

interface SetupQuizModalProps {
  onClose: () => void;
  onCreated: (quiz: Quiz) => void;
}

const DURATION_OPTIONS = [10, 15, 20, 30, 45, 60, 90, 120];
const QUESTIONS_OPTIONS = [1 , 2 , 3, 4, 5, 10, 15, 20];
const SCORE_OPTIONS = [1, 2, 3, 4, 5, 10];
const DIFFICULTY_OPTIONS = ["easy", "medium", "hard", "entry"];
const TYPE_OPTIONS: { value: QuizType; label: string }[] = [
  { value: "BE", label: "BE" },
  { value: "FE", label: "FE" },
  { value: "MO", label: "MO" },
];

const initialForm = {
  title: "",
  description: "",
  group: "",
  questions_number: 1,
  difficulty: "entry" as string,
  type: "FE" as QuizType,
  scheduleDate: "",
  scheduleTime: "",
  duration: 10,
  score_per_question: 1,
};

type Group = { id: string; name: string };

export default function SetupQuizModal({ onClose, onCreated }: SetupQuizModalProps) {
  const [form, setForm] = useState(initialForm);
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupInput, setGroupInput] = useState(""); // text input for filtering
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdQuiz, setCreatedQuiz] = useState<Quiz | null>(null);
  const [copied, setCopied] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleCopy(code: string) {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleClose() {
    if (createdQuiz) onCreated(createdQuiz);
    else onClose();
  }

  useEffect(() => {
    async function fetchGroups() {
      try {
        const data = await groupsApi.getAll();
        setGroups(data.map((g: { _id: string; name: string }) => ({ id: g._id, name: g.name })));
      } catch (err) {
        console.error(err);
      }
    }
    fetchGroups();
  }, []);

  // filtered groups based on text input
  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(groupInput.toLowerCase())
  );

  function selectGroup(group: Group) {
    update("group", group.id);
    setGroupInput(group.name);
    setShowDropdown(false);
  }

  async function handleSubmit() {
    setError(null);
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.group.trim()) { setError("Group is required."); return; }
    if (!form.scheduleDate || !form.scheduleTime) { setError("Schedule date and time are required."); return; }

    const scheduleISO = new Date(`${form.scheduleDate}T${form.scheduleTime}`).toISOString();

    const payload: CreateQuizPayload = {
      title: form.title.trim(),
      description: form.description.trim(),
      group: form.group.trim(),
      questions_number: Number(form.questions_number),
      difficulty: form.difficulty as "easy" | "medium" | "hard" ,
      type: form.type,
      schadule: scheduleISO,
      duration: Number(form.duration),
      score_per_question: Number(form.score_per_question),
    };

    try {
      setIsSubmitting(true);
      const quiz = await createQuiz(payload);
      setCreatedQuiz(quiz);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Couldn't create the quiz. Try again.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Success screen ──
  if (createdQuiz) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white px-8 py-10 text-center shadow-2xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#1B1D29]">
            <Check size={28} className="text-white" strokeWidth={3} />
          </div>
          <p className="mb-5 text-base font-semibold text-gray-900">
            Quiz was successfully created
          </p>
          <div className="mb-6 flex items-center justify-center gap-3 rounded-full border border-gray-200 px-5 py-2.5">
            <span className="text-sm font-medium text-gray-500">CODE:</span>
            <span className="text-sm font-bold tracking-widest text-gray-900">
              {createdQuiz.code}
            </span>
            <button
              onClick={() => handleCopy(createdQuiz.code)}
              className="text-gray-400 transition-colors hover:text-gray-700"
            >
              {copied ? (
                <CheckCheck size={16} className="text-green-500" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </div>
          <button
            onClick={handleClose}
            className="w-full rounded-full bg-[#C9F462] py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-[#b8e050]"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // ── Form screen ──
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-8 py-5">
          <h2 className="text-lg font-semibold text-gray-900">Set up a new quiz</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            </button>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-5 px-8 py-6">
          <p className="text-sm font-medium text-gray-500">Details</p>

          {/* Title */}
          <div className="flex items-stretch overflow-hidden rounded-lg border border-gray-200">
            <span className="flex shrink-0 items-center bg-[#FFEDDF] px-4 py-3 text-sm text-gray-500">
              Title:
            </span>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className="flex-1 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder-gray-400"
              placeholder="Enter quiz title"
            />
          </div>

          {/* Duration / No. of questions / Score per question */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-stretch overflow-hidden rounded-lg border border-gray-200">
              <span className="flex shrink-0 items-center bg-[#FFEDDF] px-4 py-3 text-xs text-gray-500">
                Duration <span className="ml-1 text-gray-400">(min)</span>
              </span>
              <select
                value={form.duration}
                onChange={(e) => update("duration", Number(e.target.value))}
                className="flex-1 bg-white px-3 text-sm font-medium text-gray-900 outline-none"
              >
                {DURATION_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="flex items-stretch overflow-hidden rounded-lg border border-gray-200">
              <span className="flex shrink-0 items-center bg-[#FFEDDF] px-4 py-3 text-xs text-gray-500">
                No. of questions
              </span>
              <select
                value={form.questions_number}
                onChange={(e) => update("questions_number", Number(e.target.value))}
                // disabled
                className="flex-1 bg-white px-3 text-sm font-medium text-gray-900 outline-none disabled:cursor-not-allowed disabled:opacity-70"
              >
                {QUESTIONS_OPTIONS.map((q) => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>

            <div className="flex items-stretch overflow-hidden rounded-lg border border-gray-200">
              <span className="flex shrink-0 items-center bg-[#FFEDDF] px-4 py-3 text-xs text-gray-500">
                Score / question
              </span>
              <select
                value={form.score_per_question}
                onChange={(e) => update("score_per_question", Number(e.target.value))}
                className="flex-1 bg-white px-3 text-sm font-medium text-gray-900 outline-none"
              >
                {SCORE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <p className="bg-[#FFEDDF] px-4 py-2 text-xs font-medium text-gray-500">
              Description
            </p>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              className="w-full resize-none bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder-gray-400"
              placeholder="Enter description (optional)"
            />
          </div>

          {/* Schedule */}
          <div className="flex items-stretch overflow-hidden rounded-lg border border-gray-200">
            <span className="flex shrink-0 items-center bg-[#FFEDDF] px-4 py-3 text-sm text-gray-500">
              Schedule
            </span>
            <div className="flex flex-1 items-center gap-2 bg-white px-4 py-3">
              <Calendar size={16} className="text-gray-400" />
              <input
                type="date"
                value={form.scheduleDate}
                onChange={(e) => update("scheduleDate", e.target.value)}
                className="bg-transparent text-sm text-gray-900 outline-none"
              />
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-3">
              <Clock size={16} className="text-gray-400" />
              <input
                type="time"
                value={form.scheduleTime}
                onChange={(e) => update("scheduleTime", e.target.value)}
                className="bg-transparent text-sm text-gray-900 outline-none"
              />
            </div>
          </div>

          {/* Difficulty / Category type / Group name */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-stretch overflow-hidden rounded-lg border border-gray-200">
              <span className="flex shrink-0 items-center bg-[#FFEDDF] px-4 py-3 text-xs text-gray-500">
                Difficulty level
              </span>
              <select
                value={form.difficulty}
                onChange={(e) => update("difficulty", e.target.value)}
                className="flex-1 bg-white px-3 text-sm font-medium capitalize text-gray-900 outline-none"
              >
                {DIFFICULTY_OPTIONS.map((d) => (
                  <option key={d} value={d} className="capitalize">{d}</option>
                ))}
              </select>
            </div>

            <div className="flex items-stretch overflow-hidden rounded-lg border border-gray-200">
              <span className="flex shrink-0 items-center bg-[#FFEDDF] px-4 py-3 text-xs text-gray-500">
                Category type
              </span>
              <select
                value={form.type}
                onChange={(e) => update("type", e.target.value as QuizType)}
                className="flex-1 bg-white px-3 text-sm font-medium text-gray-900 outline-none"
              >
                {TYPE_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* ── Group — searchable text input ── */}
            <div className="relative">
              <div className="flex items-stretch overflow-hidden rounded-lg border border-gray-200">
                <span className="flex shrink-0 items-center bg-[#FFEDDF] px-4 py-3 text-xs text-gray-500">
                  Group
                </span>
                <input
                  type="text"
                  value={groupInput}
                  onChange={(e) => {
                    setGroupInput(e.target.value);
                    update("group", ""); // clear selection when typing
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  placeholder="Search group..."
                  className="flex-1 bg-white px-3 text-sm font-medium text-gray-900 outline-none placeholder-gray-400"
                />
              </div>

              {/* Dropdown */}
              {showDropdown && filteredGroups.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-y-auto rounded-xl border border-gray-100 bg-white shadow-lg">
                  {filteredGroups.map((group) => (
                    <button
                      key={group.id}
                      type="button"
                      onMouseDown={() => selectGroup(group)}
                      className={`w-full px-4 py-2.5 text-left text-sm transition hover:bg-gray-50 ${
                        form.group === group.id
                          ? "bg-blue-50 font-medium text-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      {group.name}
                    </button>
                  ))}
                </div>
              )}

              {showDropdown && groupInput.length > 0 && filteredGroups.length === 0 && (
                <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-lg">
                  <p className="text-xs text-gray-400">No groups found.</p>
                </div>
              )}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}