"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";

import { calculatePaginationRange } from "../lib/pagination";

type Props = {
  currentPage: number;
  totalPages: number;
};

export default function PaginationControls({ currentPage, totalPages }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handlePageChange = (event: React.MouseEvent, page: number) => {
    if (page < 1 || page > totalPages) return;

    event.preventDefault();

    startTransition(() => {
      router.push(createPageURL(page), { scroll: false });
    });
  };

  const pageNumbers = calculatePaginationRange({ totalPages, currentPage });

  return (
    <Pagination className={isPending ? "pointer-events-none opacity-50" : ""}>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) => handlePageChange(e, currentPage - 1)}
            className={currentPage <= 1 ? "text-muted-foreground pointer-events-none" : undefined}
          />
        </PaginationItem>

        {/* Page Number Buttons */}
        {pageNumbers.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={(e) => handlePageChange(e, page)}
              isActive={page === currentPage}
              className={currentPage === page ? "pointer-events-none" : undefined}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            onClick={(e) => handlePageChange(e, currentPage + 1)}
            className={currentPage >= totalPages ? "text-muted-foreground pointer-events-none" : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
