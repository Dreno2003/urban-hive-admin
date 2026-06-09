"use client"

import React from "react"
import { cn } from "@/shared/lib/utils"
import type { BookingsThisYearData } from "../types"

interface BookingsBarChartProps {
  data: BookingsThisYearData[]
  className?: string
}

export function BookingsBarChart({ data, className }: BookingsBarChartProps) {
  const max = Math.max(...data.map((d) => d.count), 1)

  return (
    <div className={cn("flex items-end gap-[5px] h-[80px]", className)}>
      {data.map(({ month, count }) => {
        const heightPct = (count / max) * 100
        return (
          <div key={month} className="flex flex-col items-center gap-1 flex-1">
            <div className="w-full flex items-end" style={{ height: 64 }}>
              <div
                className="w-full rounded-[3px] bg-gray-200 dark:bg-gray-700 transition-all duration-300"
                style={{ height: count === 0 ? 4 : `${Math.max(heightPct, 8)}%` }}
              />
            </div>
            <span className="text-[9px] text-gray-400 font-medium">{month}</span>
          </div>
        )
      })}
    </div>
  )
}
