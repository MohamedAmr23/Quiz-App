"use client";

import { X, User, Users } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 sm:p-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-xl overflow-hidden border border-gray-100">

        <div className="bg-[#FCFAF8] border-b border-[#EEE7DA] p-3 sm:p-4">

          <button
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full p-1.5 hover:bg-gray-100 transition"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3 sm:gap-4">

            <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 text-xl font-bold shrink-0">
              {student.first_name?.[0]}
              {student.last_name?.[0]}
            </div>

            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                {student.first_name} {student.last_name}
              </h2>

              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Student Details
              </p>
            </div>

          </div>
        </div>


        <div className="p-4 sm:p-6 space-y-5 max-h-[70vh] overflow-y-auto">


          <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 sm:p-5">

            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-gray-500" />

              <h3 className="text-sm sm:text-base font-bold text-gray-800">
                Personal Information
              </h3>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

              <InfoCard
                title="First Name"
                value={student.first_name}
              />

              <InfoCard
                title="Last Name"
                value={student.last_name}
              />

              <InfoCard
                title="Email"
                value={student.email}
              />

              <InfoCard
                title="Role"
                value={student.role}
              />

              <InfoCard
                title="Average Score"
                value={
                  student.avg_score !== undefined
                    ? `${student.avg_score.toFixed(0)}%`
                    : "Not graded"
                }
              />

              <InfoCard
                title="Status"
                value={
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Active
                  </span>
                }
              />

            </div>

          </div>



          <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 sm:p-5">

            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-emerald-600" />

              <h3 className="text-sm sm:text-base font-bold text-emerald-800">
                Group Information
              </h3>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

              <InfoCard
                title="Group Name"
                value={student.group?.name ?? "-"}
              />

              <InfoCard
                title="Max Students"
                value={student.group?.max_students ?? "-"}
              />

            </div>

          </div>


        </div>



        <div className="flex justify-end border-t border-gray-gray-100 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4">

          <button
            onClick={onClose}
            className="rounded-xl bg-black px-6 py-2 text-sm font-semibold text-white transition hover:scale-105 active:scale-95"
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
    <div className="rounded-xl bg-white border border-gray-100 p-3">

      <p className="text-[11px] font-semibold uppercase text-gray-400">
        {title}
      </p>

      <div className="mt-2 text-sm font-bold text-gray-800 break-words">
        {value}
      </div>

    </div>
  );
}