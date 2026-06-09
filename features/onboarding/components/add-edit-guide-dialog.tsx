"use client"

import React, { useEffect } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui/button"
import { cn } from "@/shared/lib/utils"
import { OnboardingGuide, GuideTheme } from "../types"

export interface AddEditGuideDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  guide?: OnboardingGuide | null // If present, we are editing; if null, we are adding.
  onSubmit: (values: Omit<OnboardingGuide, "id" | "createdAt"> & { id?: string }) => Promise<void>
  onDelete?: (id: string) => Promise<void>
}

const guideSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title is too long")
    .required("Title is required"),
  fileUrl: Yup.string()
    .url("Must be a valid URL (e.g. https://docs.google.com/...)")
    .required("File URL link is required"),
  theme: Yup.string()
    .oneOf(["blue", "yellow", "pink", "green"], "Invalid theme selected")
    .required("Theme is required"),
})

const THEME_OPTIONS: { value: GuideTheme; label: string; bgClass: string; activeRing: string }[] = [
  { value: "blue", label: "Blue", bgClass: "bg-blue-500", activeRing: "ring-[#2b7fff] dark:ring-blue-400" },
  { value: "yellow", label: "Yellow", bgClass: "bg-yellow-500", activeRing: "ring-[#ffc107] dark:ring-yellow-400" },
  { value: "pink", label: "Pink", bgClass: "bg-purple-500", activeRing: "ring-[#7c4dff] dark:ring-purple-400" },
  { value: "green", label: "Green", bgClass: "bg-green-500", activeRing: "ring-[#22c55e] dark:ring-green-400" },
]

export function AddEditGuideDialog({
  open,
  onOpenChange,
  guide,
  onSubmit,
  onDelete,
}: AddEditGuideDialogProps) {
  const isEditing = !!guide

  const formik = useFormik({
    initialValues: {
      title: "",
      fileUrl: "",
      theme: "blue" as GuideTheme,
    },
    validationSchema: guideSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await onSubmit({
          id: guide?.id,
          title: values.title,
          fileUrl: values.fileUrl,
          theme: values.theme,
        })
        resetForm()
        onOpenChange(false)
      } catch (err) {
        console.error("Submission failed", err)
      } finally {
        setSubmitting(false)
      }
    },
  })

  // Sync state when guide changes or is set for edit
  useEffect(() => {
    if (guide) {
      formik.setValues({
        title: guide.title,
        fileUrl: guide.fileUrl,
        theme: guide.theme,
      })
    } else {
      formik.resetForm()
    }
  }, [guide, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6 overflow-hidden rounded-[24px]">
        <DialogHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="text-[20px] font-bold text-gray-950 dark:text-gray-50 tracking-tight font-sans">
            {isEditing ? "Edit guide details" : "Add new guide"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-5.5 pt-4">
          {/* Guide Title Input */}
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-gray-700 dark:text-gray-300 ml-1">
              Guide Title
            </label>
            <Input
              name="title"
              placeholder="e.g. Manually onboarding a client"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && formik.errors.title}
              className="text-[14px]"
            />
          </div>

          {/* File Link / URL Input */}
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-gray-700 dark:text-gray-300 ml-1">
              File Link / URL
            </label>
            <Input
              name="fileUrl"
              placeholder="https://docs.google.com/document/..."
              value={formik.values.fileUrl}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.fileUrl && formik.errors.fileUrl}
              className="text-[14px]"
            />
          </div>

          {/* Color/Theme Selector */}
          <div className="space-y-2.5">
            <label className="text-[13px] font-bold text-gray-700 dark:text-gray-300 ml-1 block">
              Card Color Theme
            </label>
            <div className="flex gap-4.5 items-center pl-1">
              {THEME_OPTIONS.map((option) => {
                const isSelected = formik.values.theme === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => formik.setFieldValue("theme", option.value)}
                    title={option.label}
                    className={cn(
                      "size-8.5 rounded-full cursor-pointer transition-all duration-200 border-2 border-white dark:border-gray-900 relative flex items-center justify-center shadow-md",
                      option.bgClass,
                      isSelected && "ring-3 ring-offset-2 dark:ring-offset-gray-950 scale-110",
                      isSelected && option.activeRing
                    )}
                  >
                    {isSelected && (
                      <span className="w-1.5 h-1.5 bg-white rounded-full" />
                    )}
                  </button>
                )
              })}
            </div>
            {formik.touched.theme && formik.errors.theme && (
              <p className="text-xs text-destructive ml-1">
                {formik.errors.theme as string}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-between items-center pt-5 border-t border-gray-100 dark:border-gray-800 -mx-6 -mb-6 p-6 bg-gray-50/50 dark:bg-gray-900/30">
            <div>
              {isEditing && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={async () => {
                    if (confirm("Are you sure you want to delete this guide?")) {
                      await onDelete(guide.id)
                      onOpenChange(false)
                    }
                  }}
                  className="h-10 text-[14px] px-4 font-semibold shadow-sm hover:bg-destructive/90 transition-all duration-200"
                >
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-10 text-[14px] px-5 bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-900/60"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={formik.isSubmitting}
                className="h-10 text-[14px] px-6 text-white bg-primary hover:bg-primary-500 font-semibold shadow-sm transition-all duration-200"
              >
                {isEditing ? "Save changes" : "Add guide"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
