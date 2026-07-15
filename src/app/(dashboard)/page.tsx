"use client";

import { useEffect, useState } from "react";

import Quizzes from "@/features/dashboard/components/Quizzes";
import CompletedQuizzes from "@/features/dashboard/components/Student/CompletedQuizzes";
import JoinQuiz from "@/features/dashboard/components/Student/JoinQuiz";
import TopStudents from "@/features/dashboard/components/TopStudents";

export default function DashboardPage() {
  const [role, setRole] = useState("");

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("userProfile") || "{}"
    );

    setRole(user.role);
  }, []);

  if (!role) return null;

  return (
    <div className="px-6 py-6 space-y-6">

      {role === "Student" && (
        <>
          <JoinQuiz />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Quizzes />
            <CompletedQuizzes />
          </div>
        </>
      )}

      {role === "Instructor" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">  
                <Quizzes />

          <TopStudents />
        </div>
      )}

    </div>
  );
}