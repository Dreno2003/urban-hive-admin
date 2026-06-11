"use client"

import { useState, useRef, useCallback } from "react"
import { Icon } from "@/shared/components/ui/icon"
import { Separator } from "@/shared/components/ui/separator"
import { cn } from "@/shared/lib/utils"
import type { ScheduleSlot, SlotColor } from "../types"
import { Button } from "@/shared/components/ui/button"

const COLOR_STYLES: Record<SlotColor, { bg: string; text: string; row: string; line: string }> = {
  orange: { bg: "bg-[#FFF6ED]", text: "text-[#F97316]", row: "bg-[#FFF6ED]", line: "bg-[#F97316]" },
  green: { bg: "bg-[#EDFFF6]", text: "text-[#22C55E]", row: "bg-[#EDFFF6]", line: "bg-[#22C55E]" },
  blue: { bg: "bg-[#EEF3FF]", text: "text-[#2B7FFF]", row: "bg-[#EEF3FF]", line: "bg-[#2B7FFF]" },
  purple: { bg: "bg-[#F3EEFF]", text: "text-[#9B77FF]", row: "bg-[#F3EEFF]", line: "bg-[#9B77FF]" },
}

type SlotRowProps = {
  slot: ScheduleSlot
  isActive: boolean
  isFirst: boolean
  hoverBackgroundColor?: string
  onClick: (slot: ScheduleSlot | null, y?: number) => void
}

function SlotRow({ slot, isFirst, isActive, onClick, hoverBackgroundColor }: SlotRowProps) {
  const style = COLOR_STYLES[slot.color]
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={ref}
      onMouseEnter={() => {
        const rect = ref.current?.getBoundingClientRect()
        onClick(slot, rect ? rect.top : 0)
      }}
      onMouseLeave={() => onClick(null)}
      className={cn(
        "flex relative group gap-3 items-center px-6 py-2 cursor-pointer hover:bsrightness-95 transition-all",
        isFirst ? "rounded-t-xl" : "",
        style.row
      )}
    >
      <div className={cn("opacity-30 absolute transition-all duration-300 z-2 t hidden group-hover:block w-[30%] max-w-[45%] h-5.5 px-3 left-3 shadow-md rounded-full", hoverBackgroundColor, isActive && 'block')} />
      <span className={cn("text-[13px] relaive z-10 font-semibold", style.text)}>{slot.time}</span>
      <span className={cn("text-[13px]  relaive z-10  font-medium", style.text)}>{slot.clientName}</span>
    </div>
  )
}

type SlotDetailProps = {
  slot: ScheduleSlot
  y: number
  onMouseEnter: () => void
  onMouseLeave: () => void
}

function SlotDetail({ slot, y, onMouseEnter, onMouseLeave }: SlotDetailProps) {
  return (
    <>
      <div
        className="fixed z-50 w-[385px] rounded-[26px] shadow-2xl bg-white p-5"
        style={{ top: y, left: "40%" }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="flex items-center justify-between mb-5">
          <span className="text-2xl font-bold text-gray-900">{slot.time}</span>
          <Button size={'sm'} variant={'secondary-outline'} className="flex items-center gap-1 text-xs   rounded-full px-3 py-1  border transition-colors">
            View booking
            <Icon name="chevronRight" size={13} />
          </Button>
        </div>

        <div className="space-y-3 gsrid-cols-2 dsivide-y gap-sy-6 text-sm">

          <Separator className="my-4" />

          <div className="grid grid-cols-2">

            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-gray-400">Client name</span>
              <div className="flex items-center cursor-pointer hover:underline underline-ofsfset-4 cursor-pointer gap-1 font-medium text-gray-900">
                {slot.clientName}
                <Icon name="exportSquareOutline" size={13} className="text-gray-400" />
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-gray-400">Space</span>
              <div className="flex hover:underline cursor-pointer items-center gap-1 font-medium text-gray-900">
                {slot.space}
                <Icon name="exportSquareOutline" size={13} className="text-gray-400" />
              </div>
            </div>

          </div>
          <Separator className="my-4" />

          <div className="grid grid-cols-2 justify-between w-full">


            <div className="flex flex-1 w-full flex-col gap-0.5">
              <span className="text-xs block text-gray-400">Check in</span>
              <span className="font-semibold block text-gray-900">{slot.checkIn}</span>
            </div>

            <div className="flex flex-1 w-full items-ensd flex-col gap-0.5">
              <span className="text-xs text-left block text-gray-400">Check out</span>
              <span className="font-semibold block text-gray-900">{slot.checkOut}</span>
            </div>

          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-400">Onboarding guide</span>
          <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
            {slot.onboardingGuide}
            <Icon name="exportSquareOutline" size={13} className="text-gray-400" />
          </div>
        </div>
      </div>
    </>
  )
}

type SlotGroupProps = {
  slots: ScheduleSlot[]
}

export function SlotGroup({ slots }: SlotGroupProps) {
  if (!slots.length) return null
  const style = COLOR_STYLES[slots[0].color]

  const [active, setActive] = useState<{ slot: ScheduleSlot; y: number } | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setActive(null), 100)
  }

  const handleClick = useCallback((slot: ScheduleSlot | null, y?: number) => {
    if (slot && y != null) {
      cancelClose()
      setActive({ slot, y })
    } else {
      scheduleClose()
    }
  }, [])

  return (
    <>
      <div className={cn("rounded-xl relative overflow-hidden pl-3", style.bg)}>
        <div className={cn("absolute z-10 left-3 top-0 bottom-0 w-[3px]", style.line)} />
        {slots.map((slot, i) => (

          <SlotRow isActive={active?.slot.id === slot.id} hoverBackgroundColor={style.line} key={slot.id} slot={slot} isFirst={i === 0} onClick={handleClick} />
        ))}
      </div>

      {active && (
        <SlotDetail slot={active.slot} y={active.y} onMouseEnter={cancelClose} onMouseLeave={scheduleClose} />
      )}
    </>
  )
}
