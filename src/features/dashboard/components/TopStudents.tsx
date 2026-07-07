"use client";

import { MoveRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Student } from "../interfaces/dashboard.interface";
import { getTopFiveStudents } from "../services/dashboard.service";
import StudentDetailsModal from "./StudentModal/StudentModal";
import Link from "next/link";
export default function TopStudents() {
  const [students, setStudents] = useState<Student[]>([]);
const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
const [openModal, setOpenModal] = useState(false);

const handleOpenModal = (student: Student) => {
  setSelectedStudent(student);
  setOpenModal(true);
};
  const avatarColors = [
    "bg-green-100 text-[#799351]",
    "bg-blue-100 text-blue-600",
    "bg-purple-100 text-purple-600",
    "bg-yellow-100 text-yellow-600",
    "bg-pink-100 text-pink-600",
  ];

  const getAvatarColor = (index: number) => {
    return avatarColors[index % avatarColors.length];
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getTopFiveStudents();

        const topStudents = data
          .filter((student: Student) => student.avg_score !== undefined)
          .sort(
            (a: Student, b: Student) =>
              (b.avg_score ?? 0) - (a.avg_score ?? 0)
          )
          .slice(0, 5);

        setStudents(topStudents);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="rounded-2xl border border-[#EEE7DA] bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#333]">
          Top 5 Students
        </h2>

       <Link
  href="/all-students"
  className="group flex items-center gap-2 text-sm font-semibold text-[#8B6B4A] transition-all duration-300 hover:text-[#A27B5C]"
>
  <span className=" font-bold border-b border-transparent transition-all duration-300 group-hover:border-[#A27B5C]">
     All Students
  </span>

  <MoveRight
    size={18}
    className="transition-transform duration-300 group-hover:translate-x-1"
  />
</Link>
      </div>

      <div className="space-y-3">
        {students.map((student, index) => (
          <div
            key={student._id}
            className="flex items-center justify-between rounded-xl border p-3 transition hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full font-bold ${getAvatarColor(
                  index
                )}`}
              >
                {student.first_name[0]}
                {student.last_name[0]}
              </div>

              <div>
                <h3 className="font-semibold">
                  {student.first_name} {student.last_name}
                </h3>

                <p className="text-sm text-gray-500">
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

           <MoveRight
  size={30}
  className="cursor-pointer  text-[#8B6B4A]    "
  onClick={() => handleOpenModal(student)}
/>
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