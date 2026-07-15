"use client";

import { useEffect, useState } from "react";
import { Loader2, MoveRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Quiz } from "../interfaces/dashboard.interface";
import { getQuizes } from "../services/dashboard.service";


import quiz1 from "@/assets/images/img (1).png";
import quiz2 from "@/assets/images/img (2).png";
import quiz3 from "@/assets/images/img (3).png";
import quiz4 from "@/assets/images/img.png";
import quiz5 from "@/assets/images/img (1).png";
import QuizzesModal from "./QuizzesModal/QuizzesModal";

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const quizImages = [quiz1, quiz2, quiz3, quiz4, quiz5];

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getQuizes();
        setQuizzes(data.slice(0, 5));

      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to load quizzes."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, []);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }


  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-600">
        {error}
      </div>
    );
  }


  if (quizzes.length === 0) {
    return (
      <div className="rounded-xl border border-[#E9DDD1] bg-white p-6 text-center text-gray-500">
        No quizzes available.
      </div>
    );
  }


  return (
    <div className="rounded-2xl border border-[#E9DDD1] bg-white p-4 sm:p-6 shadow-sm">


      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <h2 className="text-lg font-semibold text-[#333] sm:text-xl">
          Upcoming 5 Quizzes
        </h2>


        <Link
          href="/dashboard/quizzes"
          className="group flex items-center gap-2 text-sm font-semibold"
        >
          <span className="text-black">
            All quizzes
          </span>

          <MoveRight
            size={20}
            className="text-[#C5D86D] transition group-hover:translate-x-1"
          />
        </Link>

      </div>



      <div className="space-y-4">

        {quizzes.map((quiz, index) => (

          <div
            key={quiz._id}
            className="overflow-hidden rounded-xl border border-[#EEE7DA] bg-white transition hover:shadow-md"
          >

            <div className="flex flex-col md:flex-row md:items-center md:justify-between">


              <div className="flex items-stretch">


                <div className="flex w-30 items-center justify-center bg-[#FFEDDF]">

                  <Image
                    src={quizImages[index]}
                    alt={quiz.title}
                    width={80}
                    height={80}
                    className="object-cover"
                  />

                </div>



                <div className="px-4 py-4">

                  <h3 className="text-base font-semibold text-black sm:text-lg">
                    {quiz.title}
                  </h3>


                  <p className="mt-1 text-xs text-gray-500 sm:text-sm">

                    {new Date(quiz.schadule).toLocaleDateString("en-GB")}

                    <span className="mx-2">
                      |
                    </span>


                    {new Date(quiz.schadule).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )}

                  </p>



                  <p className="mt-2 text-xs text-gray-700 sm:text-sm">

                    <span className="font-semibold text-black">
                      No. of students enrolled:
                    </span>

                    {" "}
                    {quiz.participants}

                  </p>


                </div>

              </div>




              <div className="flex items-center justify-between gap-3 px-4 py-4 md:justify-end">


                <span
                  className={`text-sm font-semibold ${
                    quiz.status === "open"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >

                  {quiz.status === "open"
                    ? "Open"
                    : "Closed"}

                </span>



                <button
                  onClick={() => {
                    setSelectedQuiz(quiz);
                    setOpenModal(true);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C5D86D] transition hover:scale-105"
                >

                  <MoveRight
                    size={18}
                    strokeWidth={3}
                    className="text-white"
                  />

                </button>


              </div>


            </div>


          </div>

        ))}

      </div>




      <QuizzesModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        quiz={selectedQuiz}
      />


    </div>
  );
}