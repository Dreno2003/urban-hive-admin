"use client"

import React, { useState } from "react"
import { cn } from "@/shared/lib/utils"
import type { BookingsThisYearData } from "../types"

export function BookingsBarChart({ data }: { data: BookingsThisYearData[] }) {
  const [hovered, setHovered] = useState<number | null>(null)
  const max = Math.max(...data.map((d) => d.count), 1)

  return (
    <div className="flex items-end gap-[5px]" style={{ height: 90 }}>
      {data.map(({ month, count }, i) => {
        const heightPct = Math.max((count / max) * 100, count === 0 ? 3 : 8)
        const isHovered = hovered === i

        return (
          <div
            key={month}
            className="relative flex flex-col items-center gap-1 flex-1 cursor-default"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Tooltip */}
            {isHovered && (
              <div className="absolute bottom-[calc(100%-8px)] z-10 whitespace-nowrap bg-gray-900 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-lg shadow-lg pointer-events-none -translate-x-1/2 left-1/2">
                {month} – {count} bookings
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-t-gray-900" />
              </div>
            )}

            {/* Bar */}
            <div className="w-full flex items-end" style={{ height: 68 }}>
              <div
                className={cn(
                  "w-full rounded-[3px] transition-colors duration-150",
                  isHovered
                    ? "bg-gray-700 dark:bg-gray-300"
                    : "bg-gray-300 dark:bg-gray-600"
                )}
                style={{ height: `${heightPct}%` }}
              />
            </div>
            <span className="text-[9px] text-gray-400 font-medium">{month}</span>
          </div>
        )
      })}
    </div>
  )
}
