"use client"

import React from "react"
import { Icon } from "@/shared/components/ui/icon"
import { cn } from "@/shared/lib/utils"
import { OnboardingGuide, GuideTheme } from "../types"

export interface OnboardingGuideCardProps {
  guide: OnboardingGuide
  onEdit: (guide: OnboardingGuide) => void
  className?: string
}

interface ThemeConfig {
  outerBg: string
  outerBorder: string
  headerText: string
  editText: string
}

const THEME_CONFIGS: Record<GuideTheme, ThemeConfig> = {
  blue: {
    outerBg: "bg-[#f2f6ff] dark:bg-blue-950/20",
    outerBorder: "border border-[#e1ebfe] dark:border-blue-900/40",
    headerText: "text-blue-600 dark:text-blue-400",
    editText: "text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100",
  },
  yellow: {
    outerBg: "bg-[#fffbf0] dark:bg-yellow-950/20",
    outerBorder: "border border-[#fef2d0] dark:border-yellow-900/40",
    headerText: "text-yellow-700 dark:text-yellow-400",
    editText: "text-yellow-800 hover:text-yellow-900 dark:text-yellow-300 dark:hover:text-yellow-100",
  },
  pink: {
    outerBg: "bg-[#fdf3ff] dark:bg-purple-950/20",
    outerBorder: "border border-[#fbe4fe] dark:border-purple-900/40",
    headerText: "text-purple-600 dark:text-purple-400",
    editText: "text-purple-700 hover:text-purple-900 dark:text-purple-300 dark:hover:text-purple-100",
  },
  green: {
    outerBg: "bg-[#f4fbf7] dark:bg-green-950/20",
    outerBorder: "border border-[#e6f7ee] dark:border-green-900/40",
    headerText: "text-green-600 dark:text-green-400",
    editText: "text-green-700 hover:text-green-900 dark:text-green-300 dark:hover:text-green-100",
  },
}

export function OnboardingGuideCard({
  guide,
  onEdit,
  className,
}: OnboardingGuideCardProps) {
  const theme = THEME_CONFIGS[guide.theme] ?? THEME_CONFIGS.blue

  return (
    <div
      className={cn(
        "rounded-[28px] p-2 flex flex-col gap-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
        theme.outerBg,
        theme.outerBorder,
        className
      )}
    >
      {/* Outer Card Header */}
      <div className="flex justify-between items-center px-4 pt-3 pb-1 select-none">
        <span className={cn("text-[13px] font-semibold tracking-tight uppercase opacity-80", theme.headerText)}>
          Onboarding guide
        </span>
        <button
          onClick={() => onEdit(guide)}
          className={cn(
            "text-[13px] font-semibold cursor-pointer underline-offset-4 hover:underline transition-all duration-200",
            theme.editText
          )}
        >
          Edit guide
        </button>
      </div>

      {/* Inner Card (White Container) */}
      <div className="bg-white dark:bg-gray-950 rounded-[22px] px-6 py-[22px] flex justify-between items-center shadow-[0_2px_8px_rgba(0,0,0,0.01)] border border-gray-50 dark:border-gray-900/50">
        <h3 className="text-[17px] sm:text-[18px] font-semibold text-gray-800 dark:text-gray-200 tracking-tight font-sans max-w-[70%] leading-snug">
          {guide.title}
        </h3>
        
        <a
          href={guide.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-gray-500 hover:text-primary-300 dark:text-gray-400 dark:hover:text-primary-300 transition-colors duration-200 group/link shrink-0 cursor-pointer"
        >
          <span className="text-[14px] font-semibold group-hover/link:underline">Open file</span>
          <Icon
            name="share"
            size={16}
            className="text-gray-400 group-hover/link:text-primary-300 mt-0.5 transition-colors duration-200"
          />
        </a>
      </div>
    </div>
  )
}
