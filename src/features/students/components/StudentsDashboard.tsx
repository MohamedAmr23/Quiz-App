"use client";

import React, { useState, useEffect, useMemo } from "react";
import StudentCard from "./StudentCard";
import { studentsApi, ApiStudent } from "../lib/apis/students.api";
import { groupsApi, ApiGroup } from "@/features/groups/lib/apis/groups.api";
import { Search, Users, User } from "lucide-react";
import { toast } from "react-toastify";
import Pagination from "@/shared/components/Pagination";
import DeleteModal from "@/shared/components/DeleteModal";
import Modal from "@/shared/components/Modal";

const ITEMS_PER_PAGE = 10;

export default function StudentsDashboard() {
  const [students, setStudents] = useState<ApiStudent[]>([]);
  const [groups, setGroups] = useState<ApiGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);


  const [selectedStudent, setSelectedStudent] = useState<ApiStudent | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);


  const loadData = async () => {
    try {
      setIsLoading(true);
      const [fetchedStudents, fetchedGroups] = await Promise.all([
        studentsApi.getAll(),
        groupsApi.getAll().catch(() => [] as ApiGroup[]),
      ]);
      setStudents(fetchedStudents);
      setGroups(fetchedGroups);
      setApiError(null);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to load data";
      setApiError(msg);
      toast.error(msg);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);


  const handleOpenDelete = (student: ApiStudent) => {
    setSelectedStudent(student);
    setIsDeleteOpen(true);
  };

  const handleOpenView = (student: ApiStudent) => {
    setSelectedStudent(student);
    setIsViewOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedStudent) return;
    try {
      await studentsApi.delete(selectedStudent._id);
      toast.success("Student deleted successfully!");
      setIsDeleteOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete student");
      console.error(err);
    }
  };

  const handleRemoveFromGroup = async (student: ApiStudent) => {
    if (selectedGroupId === "all") return;
    const activeGroup = groups.find((g) => g._id === selectedGroupId);
    const groupName = activeGroup ? activeGroup.name : "group";

    try {
      await studentsApi.deleteFromGroup(student._id, selectedGroupId);
      toast.success(`Removed ${student.first_name} ${student.last_name} from ${groupName}`);
      loadData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to remove student from group");
      console.error(err);
    }
  };


  const filteredStudents = useMemo(() => {
    let result = students;


    if (selectedGroupId !== "all") {
      const activeGroup = groups.find((g) => g._id === selectedGroupId);
      if (activeGroup && activeGroup.students) {
        result = result.filter((student) => activeGroup.students.includes(student._id));
      } else {
        result = [];
      }
    }


    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (student) =>
          student.first_name.toLowerCase().includes(query) ||
          student.last_name.toLowerCase().includes(query) ||
          student.email.toLowerCase().includes(query)
      );
    }

    return result;
  }, [students, groups, selectedGroupId, searchQuery]);


  const rankMap = useMemo(() => {
    const sorted = [...students]
      .filter((s) => s.avg_score !== undefined)
      .sort((a, b) => (b.avg_score ?? 0) - (a.avg_score ?? 0));

    const map = new Map<string, number>();
    sorted.forEach((student, index) => {
      map.set(student._id, index + 1);
    });
    return map;
  }, [students]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / ITEMS_PER_PAGE));

  const paginatedStudents = useMemo(() => {
    const page = currentPage > totalPages ? 1 : currentPage;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredStudents, currentPage, totalPages]);

  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Students</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-gray-100">
          <div className="space-y-4 flex-1">
            <h2 className="text-sm font-medium text-gray-900">Students list</h2>

            {!isLoading && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSelectedGroupId("all");
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${selectedGroupId === "all"
                      ? "bg-[#1B1D29] border-[#1B1D29] text-white shadow-sm"
                      : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  All
                </button>
                {groups.map((group) => (
                  <button
                    key={group._id}
                    onClick={() => {
                      setSelectedGroupId(group._id);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${selectedGroupId === group._id
                        ? "bg-[#1B1D29] border-[#1B1D29] text-white shadow-sm"
                        : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                  >
                    {group.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative w-full md:w-64 self-end md:self-center">
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800 placeholder-gray-400 transition-all"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div className="space-y-1.5">
                    <div className="h-3.5 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-150 rounded w-16"></div>
                  </div>
                </div>
                <div className="w-7 h-7 bg-gray-150 rounded-full"></div>
              </div>
            ))}
          </div>
        ) : apiError ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-red-500">
            <p className="font-semibold">{apiError}</p>
            <button
              onClick={loadData}
              className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : paginatedStudents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {paginatedStudents.map((student) => (
              <StudentCard
                key={student._id}
                student={student}
                rank={rankMap.get(student._id)}
                onViewDetails={handleOpenView}
                onDelete={handleOpenDelete}
                onRemoveFromGroup={selectedGroupId !== "all" ? handleRemoveFromGroup : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-3 bg-gray-50 rounded-2xl text-gray-400 mb-3 border border-gray-100">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-gray-700">No students found</h3>
            <p className="text-sm text-gray-400 mt-1 max-w-xs">
              {selectedGroupId !== "all"
                ? "This group doesn't have any students assigned to it yet."
                : "Try searching for something else or add a student to get started."}
            </p>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>


      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Student"
        description={
          selectedStudent ? (
            <span>
              Are you sure you want to delete{" "}
              <strong>
                {selectedStudent.first_name} {selectedStudent.last_name}
              </strong>
              ? This action cannot be undone.
            </span>
          ) : (
            ""
          )
        }
      />


      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Student Details"
      >
        {selectedStudent && (
          <div className="space-y-6 text-gray-700">

            <p className="-mt-3 text-xs text-gray-400 font-medium">
              View student personal information and assigned group details below
            </p>


            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-gray-800 font-bold text-[15px]">
                <User className="w-5 h-5 text-gray-500" />
                <span>Personal Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs">
                <div>
                  <span className="text-gray-400 font-bold block mb-1">Full Name</span>
                  <span className="text-gray-800 font-extrabold text-[13px]">
                    {selectedStudent.first_name} {selectedStudent.last_name}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold block mb-1">Email</span>
                  <span className="text-gray-800 font-extrabold text-[13px] break-all">
                    {selectedStudent.email}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold block mb-1">Role</span>
                  <span className="text-gray-800 font-extrabold text-[13px]">
                    {selectedStudent.role || "Student"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold block mb-1">Average Score</span>
                  <span className="text-gray-800 font-extrabold text-[13px]">
                    {selectedStudent.avg_score !== undefined ? `${selectedStudent.avg_score}%` : "Not graded yet"}
                  </span>
                </div>
              </div>
            </div>

            {/* Group Information Card */}
            <div className="bg-[#eefcf3] border border-emerald-100/50 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-[15px]">
                <Users className="w-5 h-5 text-emerald-600" />
                <span>Group Information</span>
              </div>

              <div className="text-xs">
                <span className="text-emerald-600/70 font-bold block mb-1">Group Name</span>
                <span className="text-emerald-950 font-extrabold text-[13px]">
                  {selectedStudent.group ? selectedStudent.group.name : "Not Assigned"}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsViewOpen(false)}
                className="px-5 py-2 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
