"use client";

import { useEffect, useState, useCallback } from "react";
import { Trophy, Flame, BookOpen, Target, TrendingUp, Clock, ChevronRight, Star, Zap, Award } from "lucide-react";
import Link from "next/link";
import {
  getCompletedQuizzes,
  getUpcomingQuizzes,
} from "@/shared/lib/services/quiz.service";
import { Quiz } from "@/shared/lib/types/quiz";

// ── Types ──────────────────────────────────────────────────────────────────────

interface StudentStats {
  totalCompleted: number;
  totalUpcoming: number;
  avgScore: number;
  bestScore: number;
  totalPoints: number;
  recentQuizzes: Quiz[];
  upcomingQuizzes: Quiz[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function getGreeting(name: string) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  return `${greeting}, ${name.split(" ")[0]} 👋`;
}

function getMotivationalMessage(avgScore: number, completed: number) {
  if (completed === 0) return "Ready to take your first quiz? Let's go!";
  if (avgScore >= 90) return "You're on fire! Outstanding performance. 🔥";
  if (avgScore >= 75) return "Great work! You're above the curve. Keep it up.";
  if (avgScore >= 60) return "Solid progress! A little more practice and you'll ace it.";
  return "Every attempt makes you stronger. Keep going! 💪";
}

function getLevel(totalPoints: number): { level: number; title: string; nextAt: number } {
  const thresholds = [0, 50, 150, 350, 700, 1200, 2000];
  const titles = ["Beginner", "Explorer", "Learner", "Achiever", "Expert", "Master", "Legend"];
  let level = 0;
  for (let i = 0; i < thresholds.length; i++) {
    if (totalPoints >= thresholds[i]) level = i;
  }
  return {
    level: level + 1,
    title: titles[level],
    nextAt: thresholds[Math.min(level + 1, thresholds.length - 1)],
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Mini bar chart ─────────────────────────────────────────────────────────────

function ScoreBar({ score, max, label }: { score: number; max: number; label: string }) {
  const pct = Math.round((score / max) * 100);
  const color =
    pct >= 80 ? "bg-emerald-400" : pct >= 60 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 truncate text-xs text-gray-500">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-right text-xs font-semibold text-gray-700">{pct}%</span>
    </div>
  );
}

// ── Stat card ──────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accent: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
      <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-10 ${accent}`} />
      <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${accent} bg-opacity-10`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs font-medium text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

// ── Main student dashboard ─────────────────────────────────────────────────────

export default function StudentDashboard() {
  const [userName, setUserName] = useState("Student");
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [completedData, upcomingData] = await Promise.all([
        getCompletedQuizzes(),
        getUpcomingQuizzes(),
      ]);

      const completed: Quiz[] = completedData ?? [];
      const upcoming: Quiz[] = upcomingData ?? [];

      const totalPoints = completed.reduce(
        (sum, q) => sum + (q.score_per_question ?? 0) * (q.questions_number ?? 0),
        0
      );
      const scores = completed.map(
        (q) => ((q.score_per_question ?? 0) / (q.questions_number ?? 1)) * 100
      );
      const avgScore = scores.length
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;
      const bestScore = scores.length ? Math.round(Math.max(...scores)) : 0;

      setStats({
        totalCompleted: completed.length,
        totalUpcoming: upcoming.length,
        avgScore,
        bestScore,
        totalPoints,
        recentQuizzes: completed.slice(-5).reverse(),
        upcomingQuizzes: upcoming.slice(0, 4),
      });
    } catch {
      // silently fail — still show the shell
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const profile = localStorage.getItem("userProfile");
    if (profile) {
      const user = JSON.parse(profile);
      setUserName(user.name ?? user.username ?? "Student");
    }
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1B1D29] border-t-transparent" />
      </div>
    );
  }

  const s = stats;
  const level = getLevel(s?.totalPoints ?? 0);
  const levelPct = s
    ? Math.min(100, Math.round((s.totalPoints / level.nextAt) * 100))
    : 0;
  const maxScore = Math.max(
    ...(s?.recentQuizzes.map((q) => q.questions_number * q.score_per_question) ?? [1])
  );

  return (
    <div className="space-y-6 px-6 py-6">

      {/* ── Greeting banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-[#1B1D29] px-7 py-6 text-white shadow-lg">
        {/* Decorative blobs */}
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white opacity-[0.04]" />
        <div className="absolute -bottom-8 right-24 h-32 w-32 rounded-full bg-violet-400 opacity-10" />
        <div className="absolute bottom-4 right-8 h-16 w-16 rounded-full bg-amber-300 opacity-10" />

        <div className="relative flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold tracking-tight">{getGreeting(userName)}</h1>
            <p className="mt-1 text-sm text-white/60">
              {getMotivationalMessage(s?.avgScore ?? 0, s?.totalCompleted ?? 0)}
            </p>
          </div>

          {/* Level badge */}
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
              <Award size={14} className="text-amber-300" />
              <span className="text-xs font-semibold text-amber-300">{level.title}</span>
              <span className="text-xs text-white/40">Lv.{level.level}</span>
            </div>
            <div className="w-36">
              <div className="mb-1 flex justify-between text-[10px] text-white/40">
                <span>{s?.totalPoints ?? 0} pts</span>
                <span>{level.nextAt} pts</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-amber-300 transition-all duration-700"
                  style={{ width: `${levelPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon={<Trophy size={18} className="text-amber-500" />}
          label="Quizzes completed"
          value={s?.totalCompleted ?? 0}
          accent="bg-amber-400"
        />
        <StatCard
          icon={<Target size={18} className="text-violet-500" />}
          label="Average score"
          value={`${s?.avgScore ?? 0}%`}
          sub={s && s.avgScore >= 60 ? "Above pass threshold" : "Keep pushing!"}
          accent="bg-violet-400"
        />
        <StatCard
          icon={<Flame size={18} className="text-rose-500" />}
          label="Best score"
          value={`${s?.bestScore ?? 0}%`}
          accent="bg-rose-400"
        />
        <StatCard
          icon={<Zap size={18} className="text-emerald-500" />}
          label="Upcoming quizzes"
          value={s?.totalUpcoming ?? 0}
          sub="Ready to join"
          accent="bg-emerald-400"
        />
      </div>

      {/* ── Two column section ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Recent performance */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-[#1B1D29]" />
              <h2 className="text-sm font-semibold text-gray-900">Recent Performance</h2>
            </div>
            <Link
              href="/quizzes"
              className="flex items-center gap-0.5 text-xs text-gray-400 hover:text-gray-700"
            >
              View all <ChevronRight size={12} />
            </Link>
          </div>

          {s?.recentQuizzes.length ? (
            <div className="space-y-3">
              {s.recentQuizzes.map((q) => (
                <ScoreBar
                  key={q._id}
                  label={q.title}
                  score={q.score_per_question}
                  max={maxScore || 1}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-10 text-center">
              <BookOpen size={28} className="mb-2 text-gray-200" />
              <p className="text-sm text-gray-400">No quizzes completed yet.</p>
              <p className="text-xs text-gray-300 mt-1">Join a quiz to see your performance here.</p>
            </div>
          )}
        </div>

        {/* Upcoming quizzes */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#1B1D29]" />
              <h2 className="text-sm font-semibold text-gray-900">Upcoming Quizzes</h2>
            </div>
            <Link
              href="/quizzes"
              className="flex items-center gap-0.5 text-xs text-gray-400 hover:text-gray-700"
            >
              View all <ChevronRight size={12} />
            </Link>
          </div>

          {s?.upcomingQuizzes.length ? (
            <div className="space-y-3">
              {s.upcomingQuizzes.map((q, i) => {
                const colors = [
                  "bg-violet-50 text-violet-700 border-violet-100",
                  "bg-amber-50 text-amber-700 border-amber-100",
                  "bg-emerald-50 text-emerald-700 border-emerald-100",
                  "bg-rose-50 text-rose-700 border-rose-100",
                ];
                const dotColors = ["bg-violet-400", "bg-amber-400", "bg-emerald-400", "bg-rose-400"];
                return (
                  <div
                    key={q._id}
                    className={`flex items-center gap-3 rounded-xl border p-3 ${colors[i % 4]}`}
                  >
                    <div className={`h-2 w-2 shrink-0 rounded-full ${dotColors[i % 4]}`} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{q.title}</p>
                      <p className="text-xs opacity-60 mt-0.5">
                        {q.schadule ? formatDate(q.schadule) : "Scheduled"}
                        {" · "}
                        {q.questions_number} question{q.questions_number !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-white/60 px-2 py-0.5 text-[10px] font-semibold capitalize">
                      {q.status ?? "Open"}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center py-10 text-center">
              <Clock size={28} className="mb-2 text-gray-200" />
              <p className="text-sm text-gray-400">No upcoming quizzes right now.</p>
              <p className="text-xs text-gray-300 mt-1">Check back later or ask your instructor.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Quick tips ── */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Star size={16} className="text-amber-400" />
          <h2 className="text-sm font-semibold text-gray-900">Tips to score higher</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { emoji: "⏱️", title: "Manage your time", body: "Don't spend too long on one question. Flag it and come back." },
            { emoji: "📖", title: "Review past quizzes", body: "Check your wrong answers in Results to spot weak areas." },
            { emoji: "🎯", title: "Read carefully", body: "Re-read every question once before picking your answer." },
          ].map((tip) => (
            <div key={tip.title} className="rounded-xl bg-gray-50 p-4">
              <p className="mb-1.5 text-xl">{tip.emoji}</p>
              <p className="text-xs font-semibold text-gray-800">{tip.title}</p>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">{tip.body}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}