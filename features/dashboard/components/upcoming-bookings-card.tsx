"use client"

import React from "react"
import { InsetCard } from "@/shared/components/ui/inset-card"
import { Button } from "@/shared/components/ui/button"
import { Icon } from "@/shared/components/ui/icon"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { useUpcomingBookings } from "../hooks/use-upcoming-bookings"
import { cn } from "@/shared/lib/utils"

export interface UpcomingBookingsCardProps {
  className?: string
}

export function UpcomingBookingsCard({ className }: UpcomingBookingsCardProps) {
  const { data, isLoading, error, refetch } = useUpcomingBookings()

  const totalCount = data?.totalCount ?? 0
  const bookings = data?.bookings ?? []

  // Custom Header Title with badge count
  const titleNode = (
    <div className="flex items-center gap-2">
      <span className="text-[17px] font-bold text-gray-900 dark:text-white tracking-tight font-sans">
        Upcoming today
      </span>
      {!isLoading && (
        <span className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-semibold px-2 py-0.5 rounded-full min-w-[22px] h-[20px] text-center transition-all duration-300">
          {totalCount}
        </span>
      )}
    </div>
  )

  // Action button on the right (See schedule pill)
  const headerExtraNode = (
    <Button variant={'secondary-outline'} size={'sm'} className="text-xs text-foreground rounded-full">
      <span>See schedule</span>
      <Icon name="chevronRight" size={13} className="text-gray-500 dark:text-gray-400 mt-0.5" />
    </Button>
  )

  return (
    <InsetCard
      title={titleNode}
      headerExtra={headerExtraNode}
      hasInset={false}
      className={cn(" border border-gray-100 dark:border-gray-800", className)}
    >
      {/* Header divider */}
      <div className="border-t border-gray-100 dark:border-gray-800/80 my-1 mx-3.5" />

      {/* Body List */}
      <div className="flex flex-col gap-3.5 p-3.5 pt-2">
        {isLoading ? (
          // Skeleton Loader mimicking the list items structure
          Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="bg-[#F8F9FC] dark:bg-gray-900/40 rounded-[20px] p-4.5 px-6 flex items-center animate-pulse"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="w-[1.5px] h-9 bg-gray-200 dark:bg-gray-800 rounded-full shrink-0" />
                <div className="flex flex-col gap-2 w-full">
                  <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-gray-800" />
                  <Skeleton className="h-3.5 w-16 bg-gray-200 dark:bg-gray-800" />
                </div>
              </div>
            </div>
          ))
        ) : error ? (
          <div className="py-6 text-center flex flex-col items-center gap-2">
            <p className="text-sm text-red-500 dark:text-red-400 font-medium font-sans">
              Failed to load schedule.
            </p>
            <button
              onClick={() => refetch()}
              className="text-xs text-primary font-semibold hover:underline font-sans cursor-pointer"
            >
              Try again
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400 font-medium font-sans">
            No upcoming bookings today.
          </div>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-[#F8F9FC] dark:bg-gray-900/40 hover:bg-[#F1F2F6] dark:hover:bg-gray-800/50 rounded-[20px] p-4.5 px-6 flex items-center transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                {/* Left vertical border indicator */}
                <div
                  className={cn(
                    "w-[3px] h-9 rounded-full shrink-0 transition-colors duration-200",
                    booking.accentColor || "bg-gray-400 dark:bg-gray-600 group-hover:bg-primary"
                  )}
                />
                <div className="flex flex-col">
                  <span className="text-[15px] font-medium text-gray-900 dark:text-gray-100 tracking-tight font-sans">
                    {booking.clientName}
                  </span>
                  <span className="text-[13px] text-gray-500 dark:text-gray-400 font-sans mt-0.5">
                    {booking.time}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </InsetCard>
  )
}
