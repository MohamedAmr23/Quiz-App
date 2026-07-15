
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

  // Show pages in groups of 3
  const groupSize = 3;
  const startPage = Math.floor((currentPage - 1) / groupSize) * groupSize + 1;
  
  // Calculate which page numbers to show in this group
  const pagesToShow = [];
  for (let i = 0; i < groupSize; i++) {
    const pageNum = startPage + i;
    if (pageNum <= totalPages) {
      pagesToShow.push(pageNum);
    }
  }

  const hasLeftDots = startPage > 1;
  const hasRightDots = startPage + groupSize - 1 < totalPages;

  return (
    <div className="flex items-center justify-center gap-1.5 pt-6 border-t border-gray-50 text-sm font-medium text-gray-500 select-none">
      {/* Left dots button: click to go to the previous group */}
      {hasLeftDots ? (
        <button
          onClick={() => onPageChange(startPage - 1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-all cursor-pointer font-bold"
          title="Previous pages"
        >
          ...
        </button>
      ) : (
        <span className="w-8 h-8 flex items-center justify-center text-gray-300">...</span>
      )}

      {/* Dynamic Page numbers list */}
      {pagesToShow.map((page) => {
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

      {/* Right dots button: click to go to the next group */}
      {hasRightDots ? (
        <button
          onClick={() => onPageChange(startPage + groupSize)}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-all cursor-pointer font-bold"
          title="Next pages"
        >
          ...
        </button>
      ) : (
        <span className="w-8 h-8 flex items-center justify-center text-gray-300">...</span>
      )}
    </div>
  );
}
