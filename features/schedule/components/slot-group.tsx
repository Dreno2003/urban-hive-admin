"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { Icon } from "@/shared/components/ui/icon"
import { Separator } from "@/shared/components/ui/separator"
import { cn } from "@/shared/lib/utils"
import type { ScheduleSlot, SlotColor } from "../types"

const COLOR_STYLES: Record<SlotColor, { bg: string; text: string; row: string }> = {
  orange: { bg: "bg-[#FFF6ED]",  text: "text-[#F97316]", row: "bg-[#FFF6ED]"  },
  green:  { bg: "bg-[#EDFFF6]",  text: "text-[#22C55E]", row: "bg-[#EDFFF6]"  },
  blue:   { bg: "bg-[#EEF3FF]",  text: "text-[#2B7FFF]", row: "bg-[#EEF3FF]"  },
  purple: { bg: "bg-[#F3EEFF]",  text: "text-[#9B77FF]", row: "bg-[#F3EEFF]"  },
}

type SlotRowProps = {
  slot: ScheduleSlot
  isFirst: boolean
}

function SlotRow({ slot, isFirst }: SlotRowProps) {
  const style = COLOR_STYLES[slot.color]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "grid grid-cols-[100px_1fr] items-center px-4 py-2 cursor-pointer hover:brightness-95 transition-all",
            isFirst ? "rounded-t-xl" : "",
            style.row
          )}
        >
          <span className={cn("text-[13px] font-semibold", style.text)}>{slot.time}</span>
          <span className={cn("text-[13px] font-medium", style.text)}>{slot.clientName}</span>
        </div>
      </PopoverTrigger>

      <PopoverContent
        side="right"
        align="start"
        sideOffset={12}
        className="w-[260px] rounded-[24px] border-0 shadow-2xl bg-white p-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-gray-900">{slot.time}</span>
          <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors">
            View booking
            <Icon name="chevronRight" size={13} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-y-4 text-sm">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-gray-400">Client name</span>
            <div className="flex items-center gap-1 font-semibold text-gray-900">
              {slot.clientName}
              <Icon name="link2" size={13} className="text-gray-400" />
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-gray-400">Space</span>
            <div className="flex items-center gap-1 font-semibold text-gray-900">
              {slot.space}
              <Icon name="link2" size={13} className="text-gray-400" />
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-gray-400">Check in</span>
            <span className="font-semibold text-gray-900">{slot.checkIn}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-gray-400">Check out</span>
            <span className="font-semibold text-gray-900">{slot.checkOut}</span>
          </div>
        </div>

        <Separator className="my-3" />

        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-400">Onboarding guide</span>
          <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
            {slot.onboardingGuide}
            <Icon name="link2" size={13} className="text-gray-400" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

type SlotGroupProps = {
  slots: ScheduleSlot[]
}

export function SlotGroup({ slots }: SlotGroupProps) {
  if (!slots.length) return null
  const style = COLOR_STYLES[slots[0].color]

  return (
    <div className={cn("rounded-xl overflow-hidden", style.bg)}>
      {slots.map((slot, i) => (
        <SlotRow key={slot.id} slot={slot} isFirst={i === 0} />
      ))}
    </div>
  )
}
