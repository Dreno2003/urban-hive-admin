"use client"

import React, { useEffect } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { OnboardingGuide, GuideCategory } from "../types"

export interface AddEditGuideDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  guide?: OnboardingGuide | null
  onSubmit: (values: Omit<OnboardingGuide, "id" | "createdAt" | "theme"> & { id?: string }) => Promise<void>
  onDelete?: (id: string) => Promise<void>
}

const GUIDE_CATEGORIES: { value: GuideCategory; label: string }[] = [
  { value: "getting_started", label: "Getting started" },
  { value: "account_setup", label: "Account setup" },
  { value: "payments", label: "Payments" },
  { value: "compliance", label: "Compliance" },
  { value: "other", label: "Other" },
]

const guideSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title is too long")
    .required("Title is required"),
  fileUrl: Yup.string()
    .url("Must be a valid URL (e.g. https://docs.google.com/...)")
    .required("Link document is required"),
  category: Yup.string().required("Category is required"),
})

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
      category: "" as GuideCategory | "",
    },
    validationSchema: guideSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await onSubmit({
          id: guide?.id,
          title: values.title,
          fileUrl: values.fileUrl,
          category: values.category as GuideCategory,
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

  useEffect(() => {
    if (guide) {
      formik.setValues({
        title: guide.title,
        fileUrl: guide.fileUrl,
        category: guide.category ?? "",
      })
    } else {
      formik.resetForm()
    }
  }, [guide, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-[24px] p-8">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-[22px] font-bold text-gray-900 dark:text-gray-50 tracking-tight">
            {isEditing ? "Edit guide" : "Add guide"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-gray-600 dark:text-gray-400">
              Category
            </label>
            <Select
              value={formik.values.category}
              onValueChange={(val) => formik.setFieldValue("category", val)}
            >
              <SelectTrigger
                className="w-full h-11 rounded-xl bg-gray-100 dark:bg-gray-800 border-0 text-[14px] text-gray-500 data-[state=open]:ring-2 data-[state=open]:ring-primary/30"
              >
                <SelectValue placeholder="Select a document category" />
              </SelectTrigger>
              <SelectContent>
                {GUIDE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.category && formik.errors.category && (
              <p className="text-xs text-destructive">{formik.errors.category}</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-gray-600 dark:text-gray-400">
              Title
            </label>
            <Input
              name="title"
              placeholder="Enter a title for the guide"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && formik.errors.title}
              className="h-11 rounded-xl bg-gray-100 dark:bg-gray-800 border-0 text-[14px]"
            />
          </div>

          {/* Link document */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-gray-600 dark:text-gray-400">
              Link document
            </label>
            <Input
              name="fileUrl"
              placeholder="Add the link to the guide document"
              value={formik.values.fileUrl}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.fileUrl && formik.errors.fileUrl}
              className="h-11 rounded-xl bg-gray-100 dark:bg-gray-800 border-0 text-[14px]"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
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
                className="h-11 flex-1 rounded-xl text-[14px] font-semibold"
              >
                Delete
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 flex-1 rounded-xl text-[14px] font-semibold bg-gray-100 dark:bg-gray-800 border-0 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={formik.isSubmitting}
              className="h-11 flex-1 rounded-xl text-[14px] font-semibold text-white bg-primary hover:bg-primary/90"
            >
              {isEditing ? "Save changes" : "Add guide"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
