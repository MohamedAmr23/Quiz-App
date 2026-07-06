import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { ApiStudent } from "../lib/apis/students.api";

import user1 from "@/assets/icons/user1.png";
import user2 from "@/assets/icons/user2.png";
import user3 from "@/assets/icons/user3.png";
import user4 from "@/assets/icons/user4.png";

const AVATARS = [user1, user2, user3, user4];

interface StudentCardProps {
  student: ApiStudent;
  onViewDetails?: (student: ApiStudent) => void;
  onDelete?: (student: ApiStudent) => void;
  onRemoveFromGroup?: (student: ApiStudent) => void;
}

export default function StudentCard({
  student,
  onViewDetails,
  onDelete,
  onRemoveFromGroup,
}: StudentCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const score = student.avg_score;

  const getAvatar = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AVATARS.length;
    return AVATARS[index];
  };

  const avatarSrc = getAvatar(student._id);

  return (
    <div className={`flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:shadow-sm hover:border-gray-250 transition-all duration-200 group relative ${isMenuOpen ? "z-30" : "z-10"}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-55 flex items-center justify-center relative border border-gray-100">
          <Image
            src={avatarSrc}
            alt={`${student.first_name} ${student.last_name}`}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <h4 className="text-gray-800 font-bold text-[14px] leading-tight">
              {student.first_name} {student.last_name}
            </h4>
            {student.status && (
              <span className={`px-1.5 py-0.5 text-[9px] font-extrabold rounded-full leading-none capitalize ${
                student.status === "active"
                  ? "bg-green-50 text-green-600 border border-green-100"
                  : "bg-gray-50 text-gray-500 border border-gray-100"
              }`}>
                {student.status}
              </span>
            )}
          </div>
          <p className="text-gray-400 text-[11px] font-semibold tracking-wide truncate max-w-[150px]" title={student.email}>
            {student.email}
          </p>
        </div>
      </div>

      <div className="relative shrink-0 z-20">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-7 h-7 flex items-center justify-center bg-black hover:bg-gray-800 text-white rounded-full transition-all cursor-pointer active:scale-90"
          title="Actions Menu"
        >
          <ChevronDown
            size={12}
            strokeWidth={3}
            className={`transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsMenuOpen(false)}
            />
            
            <div className="absolute right-0 top-8 bg-white border border-gray-150 rounded-xl shadow-xl z-20 py-1.5 w-44 text-xs font-semibold text-gray-700 space-y-0.5">
              <button
                onClick={() => {
                  onViewDetails?.(student);
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-800 transition-colors cursor-pointer"
              >
                View Details
              </button>

              <button
                onClick={() => {
                  onDelete?.(student);
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 transition-colors cursor-pointer"
              >
                Delete Student
              </button>

              {onRemoveFromGroup && (
                <button
                  onClick={() => {
                    onRemoveFromGroup?.(student);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 transition-colors cursor-pointer border-t border-gray-50 mt-0.5 pt-2"
                >
                  Remove From Group
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
