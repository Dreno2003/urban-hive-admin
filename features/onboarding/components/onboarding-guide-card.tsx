"use client"

import React from "react"
import { Icon } from "@/shared/components/ui/icon"
import { InsetCard } from "@/shared/components/ui/inset-card"
import { cn } from "@/shared/lib/utils"
import { OnboardingGuide } from "../types"
import { THEME_CONFIGS } from "../constants/theme.contants"

export interface OnboardingGuideCardProps {
  guide: OnboardingGuide
  index: number
  onEdit: (guide: OnboardingGuide) => void
  className?: string
}

const CYCLE = Object.keys(THEME_CONFIGS) as (keyof typeof THEME_CONFIGS)[]

export function OnboardingGuideCard({ guide, index, onEdit, className }: OnboardingGuideCardProps) {
  const theme = THEME_CONFIGS[CYCLE[index % CYCLE.length]]

  return (
    <InsetCard
      title={
        <span className="text-sm font-medium tracking-tight text-secondary-foreground">
          Onboarding guide
        </span>
      }
      headerExtra={
        <button
          onClick={() => onEdit(guide)}
          className="text-[12px] font-medium cursor-pointer underline-offset-4 hover:underline transition-all duration-200"
        >
          Edit guide
        </button>
      }
      className={cn("transition-all duration-300", theme.outerBg, theme.outerBorder, className)}
      insetClassName="bg-white dark:bg-gray-950 border border-gray-50 dark:border-gray-900/50 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex-row justify-between items-center min-h-0 py-[22px] px-6"
    >
      <h3 className="text-[17px] sm:text-[20px] font-medium dark:text-gray-200 tracking-tight font-sans max-w-[70%] leading-snug">
        {guide.title}
      </h3>
      <a
        href={guide.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-gray-500 hover:text-primary-300 dark:text-gray-400 dark:hover:text-primary-300 transition-colors duration-200 group/link shrink-0 cursor-pointer"
      >
        <span className="text-[14px] group-hover/link:underline">Open file</span>
        <Icon name="exportSquareOutline" size={16} className="text-secondary-foreground group-hover/link:text-primary-300 mt-0.5 transition-colors duration-200" />
      </a>
    </InsetCard>
  )
}
