"use client";

import Image from "next/image";
import editImg from "@/assets/icons/edit.svg";
import deleteImg from "@/assets/icons/delete.svg";

export interface Group {
  id: string;
  name: string;
  studentCount: number;
  students?: string[];
}

interface GroupCardProps {
  group: Group;
  onEdit: (group: Group) => void;
  onDelete: (group: Group) => void;
}

export default function GroupCard({ group, onEdit, onDelete }: GroupCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-sm hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200 group">
      <div>
        <h3 className="text-gray-900 font-semibold text-sm mb-1">
          Group : {group.name}
        </h3>
        <p className="text-gray-400 text-[11px] font-medium">
          No. of students : {group.studentCount}
        </p>
      </div>
      <div className="flex items-center gap-3">
  
        <button
          onClick={() => onEdit(group)}
          className=" text-[#222222] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
          title="Edit Group"
        >
          <Image src={editImg} alt="edit" width={24} height={24} />
        </button>


        <button
          onClick={() => onDelete(group)}
          className=" text-[#222222] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          title="Delete Group"
        >
          <Image src={deleteImg} alt="delete" width={20} height={20} />
        </button>
      </div>
    </div>
  );
}
