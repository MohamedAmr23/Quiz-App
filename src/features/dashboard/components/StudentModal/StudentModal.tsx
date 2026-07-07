"use client";

import { X } from "lucide-react";
import { Student } from "../../interfaces/dashboard.interface";

interface StudentDetailsModalProps {
  open: boolean;
  onClose: () => void;
  student: Student | null;
}

export default function StudentDetailsModal({
  open,
  onClose,
  student,
}: StudentDetailsModalProps) {
  if (!open || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#EEE7DA] bg-[#FCFBF8] shadow-2xl sm:max-w-lg lg:max-w-xl">

        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/20 p-2 text-white transition-all duration-300 hover:rotate-90 hover:bg-white hover:text-[#8B6B4A]"
        >
          <X size={18} />
        </button>

        <div className="bg-radient-to-r from-[#8B6B4A] via-[#9D7B59] to-[#A27B5C] px-5 py-5 text-white sm:px-6 sm:py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#EEE7DA] bg-white text-xl font-bold text-[#8B6B4A] shadow-lg sm:h-16 sm:w-16 sm:text-2xl">
              {student.first_name[0]}
              {student.last_name[0]}
            </div>

            <div>
              <h2 className="text-xl font-bold sm:text-2xl">
                {student.first_name} {student.last_name}
              </h2>

              <p className="mt-2 w-fit rounded-full bg-white/20 px-3 py-1 text-xs sm:text-sm">
                {student.role}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 sm:gap-4 sm:p-6">
          <InfoCard title="First Name" value={student.first_name} />

          <InfoCard title="Last Name" value={student.last_name} />

          <InfoCard title="Email" value={student.email} />

          <InfoCard
            title="Status"
            value={
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  student.status === "active"
                    ? "bg-[#EEE7DA] text-[#8B6B4A]"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {student.status}
              </span>
            }
          />

          <InfoCard title="Role" value={student.role} />

          <InfoCard
            title="Average Score"
            value={
              <span className="text-base font-bold">
                {student.avg_score?.toFixed(0)}%
              </span>
            }
          />

          <InfoCard
            title="Group"
            value={student.group?.name ?? "-"}
          />

          <InfoCard
            title="Max Students"
            value={student.group?.max_students ?? "-"}
          />
        </div>

        <div className="flex justify-end border-t border-[#EEE7DA] bg-[#F8F5F1] px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-[#8B6B4A] px-5 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-[#A27B5C] active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  value,
}: {
  title: string;
  value: React.ReactNode;
}) {
  return (
    <div className="group rounded-xl border border-[#EEE7DA] bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#A27B5C] hover:shadow-lg">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#8B6B4A]">
        {title}
      </p>

      <div className="mt-2 break text-sm font-semibold text-[#444] transition-colors duration-300 group-hover:text-[#8B6B4A] sm:text-base">
        {value}
      </div>
    </div>
  );
}