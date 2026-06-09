"use client";

import React, { useState, useMemo } from "react";
import { Icon } from "@/shared/components/ui/icon";
import { Input } from "@/shared/components/ui/input";
import { Pagination } from "@/shared/components/ui/pagination";
import { formatDate } from "@/shared/helper/format-date";
import { formatCurrency } from "@/shared/helper/format-currency";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { UserBooking } from "../types";
import { useUserBookings } from "../hooks/use-settings";
import { PaymentBadge } from "./payment-status-badge";
import { BookingDetailDialog } from "./booking-detail-dialog";
import {
  BookingsFilterPopover,
  type BookingFilters,
} from "./bookings-filter-popover";

// ─── Constants ────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 3;

const EMPTY_FILTERS: BookingFilters = {
  statuses: [],
  spaceTypes: [],
  dateFrom: "",
  dateTo: "",
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function BookingsTabSkeleton() {
  return (
    <div className="animate-pulse space-y-3 border rounded-[24px] p-4">
      <div className="flex items-center justify-between px-2">
        <div className="h-4 w-24 bg-gray-100 rounded" />
        <div className="flex gap-2">
          <div className="h-[52px] w-40 bg-gray-100 rounded-full" />
          <div className="h-[52px] w-24 bg-gray-100 rounded-full" />
        </div>
      </div>
      <div className="border border-gray-100 rounded-xl overflow-hidden">
        <div className="h-10 bg-gray-50 border-b border-gray-100" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-14 border-b border-gray-100 last:border-0 px-4 flex items-center gap-4"
          >
            <div className="h-3 w-1/3 bg-gray-100 rounded" />
            <div className="h-3 w-1/6 bg-gray-100 rounded" />
            <div className="h-3 w-1/6 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function BookingsEmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="size-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-100">
        <Icon name="calendar" size={26} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-xs">{description}</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface BookingsTabProps {
  dict: Dictionary;
}

export function BookingsTab({ dict }: BookingsTabProps) {
  const { data: bookings, isLoading } = useUserBookings();
  const settingsDict = (dict as any).settings || {};

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<BookingFilters>(EMPTY_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<UserBooking | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!bookings) return [];
    return bookings.filter((b) => {
      // search
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        b.title.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q);

      // status multi-select
      const matchesStatus =
        filters.statuses.length === 0 || filters.statuses.includes(b.status);

      // date range
      const checkInDate = new Date(b.checkIn);
      const matchesFrom =
        !filters.dateFrom || checkInDate >= new Date(filters.dateFrom);
      const matchesTo =
        !filters.dateTo || checkInDate <= new Date(filters.dateTo);

      return matchesSearch && matchesStatus && matchesFrom && matchesTo;
    });
  }, [bookings, searchQuery, filters]);

  // ── Pagination ─────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFiltersChange = (next: BookingFilters) => {
    setFilters(next);
    setCurrentPage(1);
  };

  const handleView = (booking: UserBooking) => {
    setSelectedBooking(booking);
    setIsDetailOpen(true);
  };

  // ── Early returns ──────────────────────────────────────────────────────────
  if (isLoading) return <BookingsTabSkeleton />;

  if (!bookings || bookings.length === 0) {
    return (
      <BookingsEmptyState
        title={settingsDict.noBookingsTitle || "No bookings found"}
        description={
          settingsDict.noBookingsDesc ||
          "Your office and shortlet bookings will appear here."
        }
      />
    );
  }

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    filters.statuses.length > 0 ||
    filters.spaceTypes.length > 0 ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "";

  return (
    <>
      <div className="border overflow-hidden rounded-[24px] py-4">
        {/* ── Header row ────────────────────────────────────────────────────── */}
        <div className="px-4 md:px-6 flex items-center justify-between mb-4 gap-3 flex-wrap">
          <h2 className="text-body-lg font-bold text-foreground">
            {hasActiveFilters
              ? (settingsDict.showingResults || "Showing {count} result(s)").replace("{count}", filtered.length.toString())
              : settingsDict.allBookings || "All bookings"}
          </h2>

          <div className="flex items-center gap-2">
            {/* Search — uses the shared Input with built-in icon slot */}
            <Input
              type="text"
              placeholder={settingsDict.searchBooking || "Search booking"}
              value={searchQuery}
              onChange={handleSearch}
              icon={<Icon name="search" size={14} className="text-secondary-foreground" />}
              className="md:w-[232px] h-[36px] "
            />

            {/* Filter popover */}
            <BookingsFilterPopover value={filters} onChange={handleFiltersChange} dict={dict} />
          </div>
        </div>

        {/* ── Table ─────────────────────────────────────────────────────────── */}
        <div className="overflow-hidden">
          <div className="w-full overflow-auto">
            <table className="w-full min-w-[540px] text-sm">
              <thead>
                <tr className="bg-secondary border-b border-gray-100">
                  <th className="text-left text-body-base font-medium text-foreground px-4 md:px-6 py-3 md:py-4.5 w-[30%]">
                    {settingsDict.tableSpace || "Space"}
                  </th>
                  <th className="text-left text-body-base font-medium text-foreground px-4 md:px-6 py-3 md:py-4.5 w-[18%]">
                    {settingsDict.tableAmount || "Amount"}
                  </th>
                  <th className="text-left text-body-base font-medium text-foreground px-4 md:px-6 py-3 md:py-4.5 w-[18%]">
                    {settingsDict.tableDate || "Date"}
                  </th>
                  <th className="text-left text-body-base font-medium text-foreground px-4 md:px-6 py-3 md:py-4.5 w-[22%]">
                    {settingsDict.tablePaymentStatus || "Payment status"}
                  </th>
                  <th className="text-left text-body-base font-medium text-foreground px-4 md:px-6 py-3 md:py-4.5 w-[12%]">
                    {settingsDict.tableAction || "Action"}
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-14 text-center text-body-base text-gray-400"
                    >
                      {settingsDict.noBookingsMatch || "No bookings match your search."}
                    </td>
                  </tr>
                ) : (
                  paginated.map((booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-gray-50/50 *:!text-sm md:*:!text-body-base *:!text-secondary-foreground transition-colors"
                    >
                      <td className="px-4 md:px-6 py-4 font-medium text-gray-800">
                        {booking.title}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-gray-700">
                        {formatCurrency(booking.price, booking.currency)}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-gray-600">
                        {formatDate(booking.checkIn)}
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <PaymentBadge status={booking.status} dict={dict} />
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleView(booking)}
                          className={` cursor-pointer hover:underline underline-offset-2 transition-colors ${booking.status === "cancelled"
                            ? "text-destructive"
                            : "text-primary"
                            }`}
                        >
                          {settingsDict.viewAction || "View"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ──────────────────────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="border-t border-gray-100 px-4 md:px-6 py-3 bg-white">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                variant="default"
              // variant="compact"
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Booking Detail Dialog ──────────────────────────────────────────────── */}
      <BookingDetailDialog
        booking={selectedBooking}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        dict={dict}
      />
    </>
  );
}
