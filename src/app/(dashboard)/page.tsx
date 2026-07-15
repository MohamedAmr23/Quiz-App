"use client";

import { useEffect, useState } from "react";
import Quizzes from "@/features/dashboard/components/Quizzes";
import TopStudents from "@/features/dashboard/components/TopStudents";
import StudentDashboard from "@/features/dashboard/components/Student/StudentDashboard";

export default function DashboardPage() {
  const [role, setRole] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userProfile") || "{}");
    setRole(user.role);
  }, []);

  if (!role) return null;

  return (
    <div>
      {role === "Student" && <StudentDashboard />}

      {role === "Instructor" && (
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Quizzes />
            <TopStudents />
          </div>
        </div>
      )}
    </div>
  );
}