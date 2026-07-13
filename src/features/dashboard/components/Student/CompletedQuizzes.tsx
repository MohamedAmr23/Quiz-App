"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { MoveRight, Users } from "lucide-react";
import Link from "next/link";
import { axiosClient } from "@/shared/lib/apis/axiosClient";
import { getCompletedQuizes } from "../../services/dashboard.service";
import { Quiz } from "../../interfaces/dashboard.interface";
import axios from "axios";

interface Group {
  _id: string;
  name: string;
}

export default function ResultsTable() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [groupMap, setGroupMap] = useState<Record<string, string>>({});

 const getGroups = async () => {
  try {
    const { data } = await axiosClient.get("/group");

    const mappedGroups = data.reduce(
      (acc: Record<string, string>, group: Group) => {
        acc[group._id] = group.name;
        return acc;
      },
      {}
    );

    setGroupMap(mappedGroups);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data?.message);
    } else {
      console.log("Something went wrong");
    }
  }
};

  const fetchCompletedQuizzes = async () => {
    try {
      setIsLoading(true);

      const data = await getCompletedQuizes();

      setQuizzes(data);
    } catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    setError(error.response?.data?.message ?? error.message);
  } else {
    setError("Something went wrong");
  }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getGroups();
    fetchCompletedQuizzes();
  }, []);

  return (
    <div className="rounded-2xl border border-[#E9DDD1] bg-white p-3 shadow-sm sm:p-5 lg:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-[#333] sm:text-lg lg:text-xl">
          Completed Quizzes
        </h2>

        <Link
          href="/quizzes/results"
          className="group flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold"
        >
          <span className="text-black">Results</span>

          <MoveRight
            size={18}
            className="text-[#C5D86D] transition group-hover:translate-x-1 sm:size-5"
          />
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#EEE7DA] bg-white">
        <table className="min-w-[650px] w-full border-collapse">
          <thead className="bg-[#1B1D29]">
            <tr>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-white">
                Title
              </th>

              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-white">
                Group name
              </th>

              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-white">
                No. of persons in group
              </th>

              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-white">
                Date
              </th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-sm text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            )}

            {!isLoading && error && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-sm text-red-500"
                >
                  {error}
                </td>
              </tr>
            )}

            {!isLoading && !error && quizzes.length === 0 && (
              <tr>
                <td colSpan={4} className="py-10 text-center">
                  <Users size={32} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm text-gray-500">
                    No completed quizzes.
                  </p>
                </td>
              </tr>
            )}

            {!isLoading &&
              !error &&
              quizzes.map((quiz) => (
                <tr
                  key={quiz._id}
                  className="border-b border-[#EEE7DA] transition hover:bg-[#FAF9F6]"
                >
                  <td className="px-2 sm:px-4 py-3 sm:py-4 text-sm sm:text-base font-semibold text-black">
                    {quiz.title}
                  </td>

                  <td className="px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">
                    {groupMap[quiz.group] ?? "—"}
                  </td>

                  <td className="px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                    {quiz.participants ?? 0} persons
                  </td>

                  <td className="px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                    {formatDate(quiz.closed_at)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatDate(date?: string) {
  if (!date) return "—";

  try {
    return format(new Date(date), "dd / MM / yyyy");
  } catch {
    return date;
  }
}