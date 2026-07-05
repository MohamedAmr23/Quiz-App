"use client";

import React, { useState, useMemo, useEffect } from "react";
import GroupCard, { Group } from "./GroupCard";
import GroupModal from "./GroupModal";
import DeleteModal from "@/shared/components/DeleteModal";
import { groupsApi } from "../lib/apis/groups.api";
import { toast } from "react-toastify";
import { Plus, Search, Users } from "lucide-react";

const ITEMS_PER_PAGE = 6;

export default function GroupsDashboard() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);


  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingGroup, setDeletingGroup] = useState<Group | null>(null);


  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      const data = await groupsApi.getAll();
      const mappedGroups: Group[] = data.map((g) => ({
        id: g._id,
        name: g.name,
        studentCount: g.students ? g.students.length : 0,
        students: g.students || [],
      }));
      setGroups(mappedGroups);
      setApiError(null);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to load groups";
      setApiError(msg);
      toast.error(msg);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);


  const filteredGroups = useMemo(() => {
    return groups.filter((group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [groups, searchQuery]);

  
  const totalPages = Math.max(1, Math.ceil(filteredGroups.length / ITEMS_PER_PAGE));

  const paginatedGroups = useMemo(() => {
    const page = currentPage > totalPages ? 1 : currentPage;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredGroups.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredGroups, currentPage, totalPages]);


  const handleOpenAddModal = () => {
    setEditingGroup(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (group: Group) => {
    setEditingGroup(group);
    setIsFormOpen(true);
  };

  const handleOpenDeleteModal = (group: Group) => {
    setDeletingGroup(group);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data: { name: string; studentCount: number; students: string[] }) => {
    try {
      if (editingGroup) {
        
        await groupsApi.update(editingGroup.id, {
          name: data.name,
          students: data.students,
        });
        toast.success("Group updated successfully!");
      } else {
        
        await groupsApi.create({
          name: data.name,
          students: data.students,
        });
        toast.success("Group created successfully!");
        setCurrentPage(1); 
      }
      fetchGroups();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to save group";
      toast.error(msg);
      console.error(err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingGroup) {
      try {
        await groupsApi.delete(deletingGroup.id);
        toast.success("Group deleted successfully!");
        setIsDeleteOpen(false);
        setDeletingGroup(null);
        fetchGroups();
      } catch (err: any) {
        const msg = err?.response?.data?.message || "Failed to delete group";
        toast.error(msg);
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-end">
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 rounded-full text-[15px] font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <div className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center">
            <Plus size={14} strokeWidth={3} />
          </div>
          Add Group
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Groups list</h2>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800 placeholder-gray-400 transition-all"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-xl animate-pulse">
                <div className="space-y-2.5">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3.5 bg-gray-100 rounded w-24"></div>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg"></div>
                  <div className="w-8 h-8 bg-gray-100 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        ) : apiError ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-red-500">
            <p className="font-semibold">{apiError}</p>
            <button
              onClick={fetchGroups}
              className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : paginatedGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-6">
            {paginatedGroups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-3 bg-gray-50 rounded-2xl text-gray-400 mb-3 border border-gray-100">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-gray-700">No groups found</h3>
            <p className="text-sm text-gray-400 mt-1 max-w-xs">
              Try searching for something else or add a new group to get started.
            </p>
          </div>
        )}

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 pt-6 border-t border-gray-50 text-sm font-medium text-gray-500">
            <span>...</span>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              const isActive = currentPage === page;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer ${isActive
                      ? "bg-black text-white font-semibold"
                      : "hover:bg-gray-100 hover:text-gray-800"
                    }`}
                >
                  {page}
                </button>
              );
            })}
            <span>...</span>
          </div>
        )}
      </div>

      {/* Modals */}
      <GroupModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingGroup}
      />

      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Group"
        description={
          <>
            Are you sure you want to delete the group{" "}
            <span className="font-semibold text-gray-700">"{deletingGroup?.name}"</span>?
            This action cannot be undone.
          </>
        }
      />
    </div>
  );
}
