"use client";

import React, { useState, useEffect } from "react";
import { Group } from "./GroupCard";
import Modal from "@/shared/components/Modal";
import PeachFormRow from "@/shared/components/FormRow";
import { studentsApi, ApiStudent } from "@/features/students/lib/apis/students.api";
import FormRow from "@/shared/components/FormRow";

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; studentCount: number; students: string[] }) => void;
  initialData?: Group | null;
}

export default function GroupModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: GroupModalProps) {
  const [name, setName] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [studentsList, setStudentsList] = useState<ApiStudent[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState("");

  // Fetch available students when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLoadingStudents(true);
      studentsApi.getAllWithoutGroup()
        .then((data) => {
          setStudentsList(data);
        })
        .catch((err) => {
          console.error("Failed to load students", err);
        })
        .finally(() => {
          setIsLoadingStudents(false);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSelectedStudents(initialData.students || []);
    } else {
      setName("");
      setSelectedStudents([]);
    }
    setIsDropdownOpen(false);
    setError("");
  }, [initialData, isOpen]);

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Group name is required");
      return;
    }
    onSubmit({
      name: name.trim(),
      studentCount: selectedStudents.length,
      students: selectedStudents,
    });
    onClose();
  };

  // Generate label summary text for selected students
  const getSelectedSummary = () => {
    if (selectedStudents.length === 0) {
      return "Select students...";
    }
    
    // Find matching students in list
    const matchedNames = selectedStudents
      .map((id) => studentsList.find((s) => s._id === id))
      .filter((s): s is ApiStudent => !!s)
      .map((s) => `${s.first_name} ${s.last_name}`);

    if (matchedNames.length === 0) {
      return `${selectedStudents.length} student${selectedStudents.length > 1 ? "s" : ""} selected`;
    }

    if (matchedNames.length === 1) {
      return matchedNames[0];
    }

    return `${selectedStudents.length} students selected (${matchedNames.slice(0, 2).join(", ")}${matchedNames.length > 2 ? "..." : ""})`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      formId="group-form"
      title={initialData ? "Update Group" : "Set up a new Group"}
    >
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <FormRow label="Group Name">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter group name"
          className="flex-1 px-4 py-3.5 bg-white text-sm text-gray-800 focus:outline-none placeholder-gray-400"
          autoFocus
        />
      </FormRow>

      <FormRow label="List Students">
        <div
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex-1 px-4 py-3.5 bg-white text-sm text-gray-800 flex items-center justify-between cursor-pointer select-none"
        >
          <span className={selectedStudents.length === 0 ? "text-gray-400" : "text-gray-800 font-medium"}>
            {getSelectedSummary()}
          </span>

          <svg
            className={`w-5 h-5 text-gray-800 stroke-current font-bold transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
              }`}
            fill="none"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>

        {isDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute left-[140px] right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto p-2.5 space-y-1">
              {isLoadingStudents ? (
                <div className="text-center py-4 text-xs text-gray-400">
                  Loading students...
                </div>
              ) : studentsList.length === 0 ? (
                <div className="text-center py-4 text-xs text-gray-400">
                  No students available
                </div>
              ) : (
                studentsList.map((student) => {
                  const isChecked = selectedStudents.includes(student._id);
                  return (
                    <label
                      key={student._id}
                      className="flex items-center gap-2.5 px-2.5 py-2 hover:bg-gray-50 rounded-lg cursor-pointer text-sm text-gray-700 select-none transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleStudentToggle(student._id)}
                        className="w-4 h-4 rounded text-black border-gray-300 focus:ring-black cursor-pointer"
                      />
                      <span>
                        {student.first_name} {student.last_name}
                      </span>
                    </label>
                  );
                })
              )}
            </div>
          </>
        )}
      </FormRow>
    </Modal>
  );
}
