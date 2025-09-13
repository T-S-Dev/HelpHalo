type PaginationRangeArgs = {
  totalPages: number;
  currentPage: number;
  maxPagesToShow?: number;
};

export const calculatePaginationRange = ({
  totalPages,
  currentPage,
  maxPagesToShow = 5,
}: PaginationRangeArgs): number[] => {
  let startPage: number, endPage: number;

  if (totalPages <= maxPagesToShow) {
    // If total pages are 5 or less, show all of them
    startPage = 1;
    endPage = totalPages;
  } else {
    // If total pages are more than 5, calculate a sliding window
    const maxPagesBeforeCurrent = Math.floor(maxPagesToShow / 2);
    const maxPagesAfterCurrent = Math.ceil(maxPagesToShow / 2) - 1;

    if (currentPage <= maxPagesBeforeCurrent) {
      // Case: We are near the beginning
      startPage = 1;
      endPage = maxPagesToShow;
    } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
      // Case: We are near the end
      startPage = totalPages - maxPagesToShow + 1;
      endPage = totalPages;
    } else {
      // Case: We are in the middle
      startPage = currentPage - maxPagesBeforeCurrent;
      endPage = currentPage + maxPagesAfterCurrent;
    }
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
};
