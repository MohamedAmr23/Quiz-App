"use client";
import { useEffect, useState } from "react";
import { Quiz } from "../interfaces/dashboard.interface";
import { getQuizes } from "../services/dashboard.service";
import { MoveRight } from "lucide-react";
import Link from "next/link";
export default function Quizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getQuizes();
        setQuizzes(data.slice(0, 5));
      } catch (error) {
        console.log(error);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="rounded-2xl border border-[#E9DDD1] bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#333]">
          Upcoming 5 Quizzes
        </h2>

       <Link
  href="/all-students"
  className="group flex items-center gap-2 text-sm font-semibold text-[#8B6B4A] transition-all duration-300 hover:text-[#A27B5C]"
>
  <span className=" font-bold border-b border-transparent transition-all duration-300 group-hover:border-[#A27B5C]">
     All Quizes
  </span>

  <MoveRight
    size={18}
    className="transition-transform duration-300 group-hover:translate-x-1"
  />
</Link>
      </div>

      <div className="space-y-4">
        {quizzes.map((quiz) => (
          <div
            key={quiz._id}
            className="flex items-center justify-between rounded-xl border p-4 transition hover:shadow-md"
          >
            <div>
              <h3 className="font-semibold text-black">{quiz.title}</h3>

              <p className="mt-2 text-sm text-gray-500">
                <span className="font-semibold text-black">Schedule:</span>{" "}
                {new Date(quiz.schadule).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                at{" "}
                {new Date(quiz.schadule).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>

              <p className="mt-2 text-sm font-medium text-gray-700">
                             <span className="font-semibold text-black">  Enrolled:</span>{" "}

                {quiz.participants} students
              </p>
            </div>

            <p className=" text-sm text-gray-500">
              <span
                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                  quiz.status === "open"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {quiz.status === "open" ? "Open" : "Closed"}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
