"use client";

import React, { useMemo } from "react";
import { Icon } from "@/shared/components/ui/icon";
import { cn } from "@/shared/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Optional i18n labels. Falls back to English when omitted. */
  labels?: {
    previous?: string;
    next?: string;
  };
  /**
   * Visual variant:
   * - "default" – full-width with top border (used in search/listing pages)
   * - "compact" – inline, no border (used inside table cards)
   */
  variant?: "default" | "compact";
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  labels,
  variant = "default",
}: PaginationProps) {
  const previousLabel = labels?.previous ?? "Previous";
  const nextLabel = labels?.next ?? "Next";

  /**
   * Builds the page-number array with ellipsis gaps.
   *
   * • ≤ 7 pages  → show all
   * • > 7 pages  → smart window around current page with "…" gaps
   */
  const pages = useMemo<(number | "...")[]>(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const result: (number | "...")[] = [];

    // Always show first page
    result.push(1);

    if (currentPage > 3) {
      result.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    // Extra numbers near the left edge
    if (currentPage <= 3) {
      for (let i = 2; i <= 3; i++) {
        if (!result.includes(i)) result.push(i);
      }
    }

    // Extra numbers near the right edge
    if (currentPage >= totalPages - 2) {
      for (let i = totalPages - 2; i < totalPages; i++) {
        if (!result.includes(i)) result.push(i);
      }
    } else {
      for (let i = start; i <= end; i++) {
        if (!result.includes(i)) result.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      result.push("...");
    }

    if (!result.includes(totalPages)) result.push(totalPages);

    return result;
  }, [currentPage, totalPages]);

  const isDefault = variant === "default";
  const isCompact = variant === "compact";

  return (
    <div
      className={cn(
        "flex items-center justify-between w-full",
        isDefault && "py-6 md:py-8 border-t border-gray-100 mt-8",
        isCompact && "px-1 pt-4 mt-1",
      )}
    >
      {/* Previous */}
      <button
        type="button"
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "flex items-center gap-1 transition-all group cursor-pointer",
          isDefault && "gap-1.5 md:gap-3 text-sm font-semibold",
          isCompact && "gap-1 text-xs font-medium",
          currentPage === 1
            ? "opacity-40 cursor-not-allowed"
            : isDefault
              ? "text-gray-900 hover:text-primary-500"
              : "text-gray-600 hover:text-foreground",
        )}
      >
        <Icon
          name="chevronLeft"
          size={isDefault ? 16 : 13}
          className={cn(
            "transition-transform",
            isDefault ? "text-gray-500" : "text-gray-500",
            currentPage > 1 && "group-hover:-translate-x-0.5",
          )}
        />
        {isDefault ? (
          <span className="hidden md:inline">{previousLabel}</span>
        ) : (
          <span>{previousLabel}</span>
        )}
      </button>

      {/* Page numbers */}
      <div
        className={cn(
          "flex items-center",
          isDefault ? "gap-1 md:gap-2" : "gap-0.5",
        )}
      >
        {pages.map((page, idx) =>
          page === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className={cn(
                "flex items-center justify-center text-gray-400 select-none font-medium",
                isDefault ? "w-8 h-8 md:w-10 md:h-10" : "w-7 h-7 text-xs",
              )}
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page as number)}
              className={cn(
                "flex items-center justify-center rounded-full transition-all cursor-pointer",
                isDefault
                  ? "w-8 h-8 md:w-10 md:h-10 text-sm"
                  : "w-7 h-7 text-xs",
                currentPage === page
                  ? isDefault
                    ? "bg-gray-50 text-gray-900 font-bold ring-1 ring-inset ring-gray-100"
                    : "bg-gray-100  font-semibold"
                  : isDefault
                    ? "text-gray-500 font-semibold hover:bg-gray-50 hover:text-gray-900"
                    : "text-gray-600 font-semibold hover:bg-gray-100",
              )}
            >
              {page}
            </button>
          ),
        )}
      </div>

      {/* Next */}
      <button
        type="button"
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        className={cn(
          "flex items-center transition-all group cursor-pointer",
          isDefault && "gap-1.5 md:gap-3 text-sm font-semibold",
          isCompact && "gap-1 text-xs font-medium",
          currentPage === totalPages
            ? "opacity-40 cursor-not-allowed"
            : isDefault
              ? "text-gray-900 hover:text-primary-500"
              : "text-gray-600 hover:text-foreground",
        )}
      >
        {isDefault ? (
          <span className="hidden md:inline">{nextLabel}</span>
        ) : (
          <span>{nextLabel}</span>
        )}
        <Icon
          name="chevronRight"
          size={isDefault ? 16 : 13}
          className={cn(
            "transition-transform",
            isDefault ? "text-gray-500" : "text-gray-500",
            currentPage < totalPages && "group-hover:translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}
