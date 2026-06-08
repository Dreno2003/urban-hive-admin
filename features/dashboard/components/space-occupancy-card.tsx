"use client"

import React from "react"
import { useSpaceOccupancy } from "../hooks/use-space-occupancy"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { cn } from "@/shared/lib/utils"

export interface SpaceOccupancyCardProps {
  className?: string
}

export function SpaceOccupancyCard({ className }: SpaceOccupancyCardProps) {
  const { data, isLoading, error, refetch } = useSpaceOccupancy()

  const occupancyItems = data ?? []

  return (
    <div className={cn("flex flex-col gap-4 w-full", className)}>
      {isLoading ? (
        // Skeleton Loader matching mockup cards
        Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-850 rounded-[24px] p-5 px-6 flex items-center justify-between shadow-sm animate-pulse"
          >
            <div className="flex flex-col gap-3">
              <Skeleton className="h-4 w-20 bg-gray-200 dark:bg-gray-800" />
              <div className="flex gap-[3px]">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[4.5px] h-[15px] rounded-full bg-gray-200 dark:bg-gray-800"
                  />
                ))}
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <Skeleton className="h-6 w-4 bg-gray-200 dark:bg-gray-800" />
              <Skeleton className="h-4 w-12 bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        ))
      ) : error ? (
        <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-850 rounded-[24px] p-6 text-center shadow-sm flex flex-col items-center gap-2">
          <p className="text-sm text-red-500 dark:text-red-400 font-medium font-sans">
            Failed to load space utilization data.
          </p>
          <button
            onClick={() => refetch()}
            className="text-xs text-primary font-semibold hover:underline font-sans cursor-pointer"
          >
            Try again
          </button>
        </div>
      ) : occupancyItems.length === 0 ? (
        <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-850 rounded-[24px] p-8 text-center shadow-sm text-sm text-gray-500 dark:text-gray-400 font-medium font-sans">
          No space occupancy metrics available.
        </div>
      ) : (
        occupancyItems.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800/80 rounded-[24px] p-5 px-6 flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer"
          >
            {/* Left side: Category & Segmented Bar */}
            <div className="flex flex-col gap-2">
              <span className="text-[13.5px] font-medium text-gray-500 dark:text-gray-400 font-sans group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                {item.name}
              </span>
              <div className="flex gap-[3.5px]">
                {/* Dynamically build segments representing occupied vs free slots */}
                {Array.from({ length: item.capacity }).map((_, i) => {
                  const isOccupied = i < item.occupied
                  return (
                    <div
                      key={i}
                      className={cn(
                        "w-[4.5px] h-[15px] rounded-full transition-all duration-500",
                        isOccupied
                          ? "bg-yellow-400 dark:bg-yellow-500 shadow-[0_0_6px_rgba(250,204,21,0.2)] group-hover:scale-y-110"
                          : "bg-yellow-400/20 dark:bg-yellow-500/10 group-hover:scale-y-95"
                      )}
                    />
                  )
                })}
              </div>
            </div>

            {/* Right side: Numbers */}
            <div className="flex items-baseline font-sans text-gray-900 dark:text-white select-none">
              <span className="text-[25px] font-bold tracking-tight leading-none">
                {item.occupied}
              </span>
              <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400 leading-none">
                /{item.capacity}
              </span>
              <span className="text-[13px] font-medium text-gray-400 dark:text-gray-500 leading-none ml-2">
                · {item.free} free
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
