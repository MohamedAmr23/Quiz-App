"use client";

import { Loader2, MoveRight } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Student } from "../interfaces/dashboard.interface";
import { getTopFiveStudents } from "../services/dashboard.service";
import StudentDetailsModal from "./StudentModal/StudentModal";

import avatar1 from "@/assets/images/user img (1).png";
import avatar2 from "@/assets/images/user img (2).png";
import avatar3 from "@/assets/images/user img (3).png";
import avatar4 from "@/assets/images/user img (4).png";
import avatar5 from "@/assets/images/user img.png";

export default function TopStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5];

  const handleOpenModal = (student: Student) => {
    setSelectedStudent(student);
    setOpenModal(true);
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getTopFiveStudents();

        const topStudents = data
          .filter((student: Student) => student.avg_score !== undefined)
          .sort(
            (a: Student, b: Student) =>
              (b.avg_score ?? 0) - (a.avg_score ?? 0)
          )
          .slice(0, 5);

        setStudents(topStudents);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load students.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
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

  if (students.length === 0) {
    return (
      <div className="rounded-xl border border-[#E9DDD1] bg-white p-6 text-center text-gray-500">
        No students found.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#EEE7DA] bg-white p-4 sm:p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-[#333] sm:text-xl">
          Top 5 Students
        </h2>

        <Link
          href="/students"
          className="group flex items-center gap-2 text-sm font-semibold"
        >
          <span className="text-black">All Students</span>

          <MoveRight
            size={20}
            className="text-[#C5D86D] transition group-hover:translate-x-1"
          />
        </Link>
      </div>

<div className="space-y-4">
  {students.map((student, index) => (
    <div
      key={student._id}
      className="overflow-hidden rounded-xl border border-[#EEE7DA] bg-white transition hover:shadow-md"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center">
          <Image
            src={avatars[index]}
            alt={`${student.first_name} ${student.last_name}`}
            width={90}
            height={90}
            className="h-24 w-24 shrink-0 object-cover"
          />

          <div className="px-4 py-4">
            <h3 className="text-base font-semibold sm:text-lg">
              {student.first_name} {student.last_name}
            </h3>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Class rank: {index + 1}
              {index === 0
                ? "st"
                : index === 1
                ? "nd"
                : index === 2
                ? "rd"
                : "th"}{" "}
              | Average score: {student.avg_score?.toFixed(0)}%
            </p>
          </div>
        </div>

        <div className="px-4 py-4 flex justify-end">
          <button
            onClick={() => handleOpenModal(student)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition hover:scale-105"
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

      <StudentDetailsModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        student={selectedStudent}
      />
    </div>
  );
}