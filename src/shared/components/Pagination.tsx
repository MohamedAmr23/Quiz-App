import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 pt-6 border-t border-gray-50 text-sm font-medium text-gray-500">
      <span>...</span>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
        const isActive = currentPage === page;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
              isActive
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
  );
}
