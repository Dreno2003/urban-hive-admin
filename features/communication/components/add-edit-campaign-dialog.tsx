"use client"

import React, { useEffect } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { DialogContainer } from "@/shared/components/dialogs/dialog-container"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import { Button } from "@/shared/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { Separator } from "@/shared/components/ui/separator"
import { Trash } from "lucide-react"
import { DeleteConfirmDialog } from "@/shared/components/dialogs/delete-confirm-dialog"
import { sonnerCard } from "@/shared/components/ui/sonner-card"
import type { Campaign, CampaignCategory } from "../types"
import { cn } from "@/shared/lib/utils"

export interface AddEditCampaignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaign?: Campaign | null
  onSubmit: (values: Omit<Campaign, "id" | "createdAt"> & { id?: string }) => Promise<void>
  onDelete?: (id: string) => Promise<void>
}

const campaignSchema = Yup.object().shape({
  title: Yup.string().min(3, "Title must be at least 3 characters").max(120).required("Title is required"),
  category: Yup.string().required("Category is required"),
  audience: Yup.string().required("Audience is required"),
  description: Yup.string().min(10, "Content must be at least 10 characters").required("Content is required"),
  status: Yup.string().oneOf(["live", "draft"]).required(),
})

export function AddEditCampaignDialog({ open, onOpenChange, campaign, onSubmit, onDelete }: AddEditCampaignDialogProps) {
  const isEditing = !!campaign
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)

  const formik = useFormik({
    initialValues: {
      title: "",
      category: "" as CampaignCategory | "",
      audience: "",
      description: "",
      status: "draft" as "live" | "draft",
    },
    validationSchema: campaignSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await onSubmit({
          id: campaign?.id,
          title: values.title,
          category: values.category as CampaignCategory,
          audience: values.audience,
          description: values.description,
          status: values.status,
        })
        resetForm()
        onOpenChange(false)
      } catch (err) {
        console.error("Campaign submission failed", err)
      } finally {
        setSubmitting(false)
      }
    },
  })

  useEffect(() => {
    if (campaign) {
      formik.setValues({
        title: campaign.title,
        category: campaign.category,
        audience: campaign.audience,
        description: campaign.description,
        status: campaign.status,
      })
    } else {
      formik.resetForm()
    }
  }, [campaign, open])

  // Helpers to submit with specific status
  const handleSaveDraft = () => {
    formik.setFieldValue("status", "draft")
    // Wait for state update before submitting
    setTimeout(() => {
      formik.handleSubmit()
    }, 0)
  }

  const handlePublish = () => {
    formik.setFieldValue("status", "live")
    setTimeout(() => {
      formik.handleSubmit()
    }, 0)
  }

  return (
    <>
      <DialogContainer
        dialogTitle={isEditing ? "Edit campaign" : "New campaign"}
        className="pb-1 !px-3"
        open={open}
        onOpenChange={onOpenChange}
      >
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 pt-1">
          {/* Category & Audience Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Category</label>
              <Select
                value={formik.values.category}
                onValueChange={(val) => formik.setFieldValue("category", val)}
              >
                <SelectTrigger className="w-full !h-[44px] rounded-full bg-gray-100 dark:bg-gray-800 border-0 px-5 text-[14px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Newsletter">Newsletter</SelectItem>
                  <SelectItem value="Announcement">Announcement</SelectItem>
                  <SelectItem value="Promo">Promo</SelectItem>
                  <SelectItem value="Alert">Alert</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.category && formik.errors.category && (
                <p className="text-xs text-destructive ml-3">{formik.errors.category}</p>
              )}
            </div>

            {/* Audience */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Target Audience</label>
              <Select
                value={formik.values.audience}
                onValueChange={(val) => formik.setFieldValue("audience", val)}
              >
                <SelectTrigger className="w-full !h-[44px] rounded-full bg-gray-100 dark:bg-gray-800 border-0 px-5 text-[14px]">
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All members">All members</SelectItem>
                  <SelectItem value="Workspace operators">Workspace operators</SelectItem>
                  <SelectItem value="Super-users">Super-users</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.audience && formik.errors.audience && (
                <p className="text-xs text-destructive ml-3">{formik.errors.audience}</p>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Title</label>
            <Input
              name="title"
              placeholder="Enter a title for the campaign"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && formik.errors.title}
              className="rounded-full bg-gray-100 dark:bg-gray-800 border-0 px-5 text-[14px]"
            />
          </div>

          {/* Description/Content */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Content</label>
            <Textarea
              name="description"
              placeholder="Enter the campaign content/description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={cn(
                "rounded-[20px] bg-gray-100 dark:bg-gray-800 border-0 px-5 py-3 text-[14px] min-h-[120px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                formik.touched.description && formik.errors.description && "ring-2 ring-destructive/50 bg-red-50/10"
              )}
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-xs font-medium text-destructive ml-3 animate-in fade-in slide-in-from-top-1 duration-200">
                {formik.errors.description}
              </p>
            )}
          </div>

          <Separator className="bg-gray-100 dark:bg-gray-800" />

          {/* Actions */}
          <div className="flex justify-center flex-col gap-3 pt-2">
            {isEditing && onDelete && (
              <Button
                type="button"
                variant="link"
                onClick={() => {
                  onOpenChange(false)
                  setDeleteDialogOpen(true)
                }}
                className="h-12 flex-1 hover:no-underline rounded-full text-[14px] text-destructive hover:text-destructive/90"
              >
                <Trash className="size-4 mr-1.5" />
                Delete campaign
              </Button>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="secondary-outline"
                onClick={() => onOpenChange(false)}
                className="h-12 flex-1 rounded-full text-[14px] dark:bg-gray-800 dark:border-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleSaveDraft}
                loading={formik.isSubmitting && formik.values.status === "draft"}
                disabled={formik.isSubmitting}
                className="h-12 flex-1 rounded-full text-[14px] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750"
              >
                Save as draft
              </Button>
              <Button
                type="button"
                onClick={handlePublish}
                loading={formik.isSubmitting && formik.values.status === "live"}
                disabled={formik.isSubmitting}
                className="h-12 flex-1 rounded-full text-[14px] text-white bg-primary hover:bg-primary/90"
              >
                Publish campaign
              </Button>
            </div>
          </div>
        </form>
      </DialogContainer>

      {isEditing && onDelete && campaign && (
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          itemName={campaign.title}
          onConfirm={async () => {
            try {
              await onDelete(campaign.id)
              setDeleteDialogOpen(false)
              onOpenChange(false)
              sonnerCard.success("Campaign has been deleted successfully")
            } catch {
              sonnerCard.failed("Failed to delete campaign. Please try again.")
            }
          }}
        />
      )}
    </>
  )
}
