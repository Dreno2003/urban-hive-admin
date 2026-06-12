"use client"

import React, { useState } from "react"
import { cn } from "@/shared/lib/utils"
import type { PaymentsMonthlyData } from "../types"

export function PaymentsBarChart({ data }: { data: PaymentsMonthlyData[] }) {
  const [hovered, setHovered] = useState<number | null>(null)
  const max = Math.max(...data.map((d) => d.amount), 1)

  return (
    <div className="flex items-end gap-[5px]" style={{ height: 90 }}>
      {data.map(({ month, amount, formattedAmount }, i) => {
        const heightPct = Math.max((amount / max) * 100, amount === 0 ? 3 : 8)
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
                {month} – {formattedAmount} paid
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-t-gray-900" />
              </div>
            )}

            {/* Bar */}
            <div className="w-full flex items-end" style={{ height: 68 }}>
              <div
                className={cn(
                  "w-full rounded-[3px] transition-colors duration-150",
                  isHovered
                    ? "bg-[#3A4D62] dark:bg-gray-300"
                    : "bg-[#7E8D9F]/30 dark:bg-gray-700"
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
