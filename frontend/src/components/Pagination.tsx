interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  onPrevious,
  onNext,
  hasNextPage,
  hasPreviousPage,
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      // Calculate range around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust range if near beginning or end
      if (currentPage <= 3) {
        endPage = 4;
      }
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push('...');
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push('...');
      }

      // Show last page
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();

  return (
    <nav
      className="flex items-center justify-between px-4 py-3 sm:px-6 border-t border-gray-200"
      aria-label="Pagination"
    >
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={onPrevious}
          disabled={!hasPreviousPage}
          className="
            relative inline-flex items-center px-4 py-2 text-sm font-medium
            text-gray-700 bg-white border border-gray-300 rounded-md
            hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            transition-colors duration-200
          "
          aria-label="Previous page"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={!hasNextPage}
          className="
            relative inline-flex items-center px-4 py-2 text-sm font-medium
            text-gray-700 bg-white border border-gray-300 rounded-md
            hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            transition-colors duration-200
          "
          aria-label="Next page"
        >
          Next
        </button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={onPrevious}
              disabled={!hasPreviousPage}
              className="
                relative inline-flex items-center px-2 py-2 text-sm font-medium
                text-gray-500 bg-white border border-gray-300 rounded-l-md
                hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
                focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500
                transition-colors duration-200
              "
              aria-label="Previous page"
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {pageNumbers.map((pageNum, index) => {
              if (pageNum === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="
                      relative inline-flex items-center px-4 py-2 text-sm font-medium
                      text-gray-700 bg-white border border-gray-300
                    "
                  >
                    ...
                  </span>
                );
              }

              const page = pageNum as number;
              const isCurrentPage = page === currentPage;

              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`
                    relative inline-flex items-center px-4 py-2 text-sm font-medium
                    border focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500
                    transition-colors duration-200
                    ${
                      isCurrentPage
                        ? 'z-10 bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                  `}
                  aria-label={`Page ${page}`}
                  aria-current={isCurrentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={onNext}
              disabled={!hasNextPage}
              className="
                relative inline-flex items-center px-2 py-2 text-sm font-medium
                text-gray-500 bg-white border border-gray-300 rounded-r-md
                hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
                focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500
                transition-colors duration-200
              "
              aria-label="Next page"
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </nav>
  );
}
