"use client"

import React, { useState } from "react"
import { toast } from "sonner"
import { Icon } from "@/shared/components/ui/icon"
import { Button } from "@/shared/components/ui/button"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { OnboardingGuide, GuideTheme } from "../types"
import { OnboardingGuideCard } from "./onboarding-guide-card"
import { AddEditGuideDialog } from "./add-edit-guide-dialog"
import {
  useOnboardingGuides,
  useSaveOnboardingGuide,
  useDeleteOnboardingGuide,
} from "../hooks/use-onboarding-guides"
import { cn } from "@/shared/lib/utils"

const SKELETON_COLORS: GuideTheme[] = ["blue", "yellow", "pink", "green"]

const SKELETON_THEME_CLASSES: Record<GuideTheme, { outerBg: string; outerBorder: string }> = {
  blue: { outerBg: "bg-[#f2f6ff]/60 dark:bg-blue-950/10", outerBorder: "border border-[#e1ebfe]/60 dark:border-blue-900/20" },
  yellow: { outerBg: "bg-[#fffbf0]/60 dark:bg-yellow-950/10", outerBorder: "border border-[#fef2d0]/60 dark:border-yellow-900/20" },
  pink: { outerBg: "bg-[#fdf3ff]/60 dark:bg-purple-950/10", outerBorder: "border border-[#fbe4fe]/60 dark:border-purple-900/20" },
  green: { outerBg: "bg-[#f4fbf7]/60 dark:bg-green-950/10", outerBorder: "border border-[#e6f7ee]/60 dark:border-green-900/20" },
}

export default function OnboardingContent() {
  const { data: guides = [], isLoading, error, refetch } = useOnboardingGuides()
  const saveMutation = useSaveOnboardingGuide()
  const deleteMutation = useDeleteOnboardingGuide()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [activeGuide, setActiveGuide] = useState<OnboardingGuide | null>(null)

  const handleAddClick = () => {
    setActiveGuide(null)
    setDialogOpen(true)
  }

  const handleEditClick = (guide: OnboardingGuide) => {
    setActiveGuide(guide)
    setDialogOpen(true)
  }

  const handleFormSubmit = async (
    values: Omit<OnboardingGuide, "id" | "createdAt"> & { id?: string }
  ) => {
    const isEdit = !!values.id
    const guideToSave: OnboardingGuide = {
      id: values.id ?? Math.random().toString(36).substring(2, 9),
      title: values.title,
      fileUrl: values.fileUrl,
      theme: values.theme,
      createdAt: activeGuide?.createdAt ?? new Date().toISOString(),
    }

    await saveMutation.mutateAsync(guideToSave)
    toast.success(isEdit ? "Guide updated successfully!" : "Guide created successfully!")
  }

  const handleGuideDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id)
    toast.success("Guide deleted successfully!")
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
      {/* Brand-Themed Banner Header */}
      <section
        className="relative pt-[116px] pb-16 px-8 md:px-12 flex flex-col justify-end shrink-0"
        style={{
          background: `linear-gradient(135deg, rgba(104, 39, 73, 0.95) 0%, rgba(78, 29, 55, 0.9) 50%, rgba(46, 17, 32, 0.95) 100%), url('/images/landing-page-images/home-img.jpg') center/cover no-repeat`,
        }}
      >
        <div className="max-w-[1400px] w-full mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-1.5">
            <h1 className="text-white text-[25px] sm:text-[30px] font-bold tracking-tight">
              Onboarding guide
            </h1>
            <p className="text-white/70 text-sm md:text-[15px] font-medium font-sans">
              Clients onboarding and management checklist
            </p>
          </div>

          <Button
            onClick={handleAddClick}
            className="h-10 px-5 gap-1.5 font-semibold bg-white hover:bg-white/95 text-primary-500 rounded-full transition-all duration-200 self-start sm:self-center shadow-md cursor-pointer border border-white/20 shrink-0"
          >
            <Icon name="plus" size={16} />
            <span>Add guide</span>
          </Button>
        </div>
      </section>

      {/* Main Grid Viewport */}
      <div className="flex-1 w-full max-w-[1400px] mx-auto px-8 md:px-12 py-8 relative z-10 -mt-[4.5rem]">
        {isLoading ? (
          /* High-Fidelity Skeletons matching Card theme distribution */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => {
              const color = SKELETON_COLORS[idx % 4]
              const theme = SKELETON_THEME_CLASSES[color]
              return (
                <div
                  key={idx}
                  className={cn(
                    "rounded-[28px] p-2 flex flex-col gap-2 animate-pulse",
                    theme.outerBg,
                    theme.outerBorder
                  )}
                >
                  <div className="flex justify-between items-center px-4 pt-3 pb-1">
                    <Skeleton className="h-4.5 w-28 bg-gray-200 dark:bg-gray-800" />
                    <Skeleton className="h-4.5 w-16 bg-gray-200 dark:bg-gray-800" />
                  </div>
                  <div className="bg-white dark:bg-gray-950 rounded-[22px] px-6 py-[22px] flex justify-between items-center shadow-sm border border-gray-50 dark:border-gray-900/50">
                    <Skeleton className="h-6 w-[55%] bg-gray-200 dark:bg-gray-800" />
                    <Skeleton className="h-5.5 w-20 bg-gray-200 dark:bg-gray-800" />
                  </div>
                </div>
              )
            })}
          </div>
        ) : error ? (
          /* Error State displaying friendly feedback and retry action */
          <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-850 rounded-[28px] p-12 text-center flex flex-col items-center justify-center gap-4.5 shadow-sm max-w-xl mx-auto mt-6">
            <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-red-500">
              <Icon name="info" size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Failed to load onboarding guides
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                An error occurred while fetching checklist records. Please try again.
              </p>
            </div>
            <Button
              onClick={() => refetch()}
              className="h-10 px-5 gap-1 bg-primary text-white rounded-full font-semibold"
            >
              Try again
            </Button>
          </div>
        ) : guides.length === 0 ? (
          /* Empty State encouraging admin to add guidelines */
          <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-850 rounded-[28px] p-16 text-center flex flex-col items-center justify-center gap-4.5 shadow-sm max-w-xl mx-auto mt-6">
            <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-950/20 flex items-center justify-center text-primary-300">
              <Icon name="presentationGraph" size={36} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 font-sans tracking-tight">
                No guides added yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                Get started by creating onboarding checklists and reference files for your workspaces.
              </p>
            </div>
            <Button
              onClick={handleAddClick}
              className="h-10 px-5 gap-1.5 bg-primary hover:bg-primary-500 text-white rounded-full font-semibold shadow-sm transition-all duration-200 cursor-pointer"
            >
              <Icon name="plus" size={16} />
              <span>Add your first guide</span>
            </Button>
          </div>
        ) : (
          /* Interactive Grid rendering matching guide cards */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guides.map((guide) => (
              <OnboardingGuideCard
                key={guide.id}
                guide={guide}
                onEdit={handleEditClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Dialog Manager */}
      <AddEditGuideDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        guide={activeGuide}
        onSubmit={handleFormSubmit}
        onDelete={handleGuideDelete}
      />
    </div>
  )
}
