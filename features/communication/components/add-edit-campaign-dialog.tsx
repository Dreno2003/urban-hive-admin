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
import type { Campaign, CampaignCategory, SendViaChannel } from "../types"
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
  category: Yup.string().required("Campaign type is required"),
  sendVia: Yup.string().required("Send channel is required"),
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
      sendVia: "Email only" as SendViaChannel,
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
          sendVia: values.sendVia as SendViaChannel,
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
        sendVia: campaign.sendVia || "Email only",
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
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5 pt-2">
          {/* Campaign type */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Campaign type</label>
            <Select
              value={formik.values.category}
              onValueChange={(val) => formik.setFieldValue("category", val)}
            >
              <SelectTrigger className="w-full !h-[44px] rounded-full bg-gray-100 dark:bg-gray-800 border-0 px-5 text-[14px]">
                <SelectValue placeholder="Choose a campaign type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Newsletter">Newsletter</SelectItem>
                <SelectItem value="Promotional offer">Promotional offer</SelectItem>
                <SelectItem value="Holiday message">Holiday message</SelectItem>
                <SelectItem value="Satisfaction survey">Satisfaction survey</SelectItem>
              </SelectContent>
            </Select>
            {formik.touched.category && formik.errors.category && (
              <p className="text-xs text-destructive ml-3">{formik.errors.category}</p>
            )}
          </div>

          {/* Campaign title */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Campaign title</label>
            <Input
              name="title"
              placeholder="Enter a campaign title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && formik.errors.title}
              className="rounded-full bg-gray-100 dark:bg-gray-800 border-0 px-5 text-[14px]"
            />
          </div>

          {/* Campaign content */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Campaign content</label>
            <Textarea
              name="description"
              placeholder="Enter space description"
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

          {/* Send via */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Send via</label>
            <Select
              value={formik.values.sendVia}
              onValueChange={(val) => formik.setFieldValue("sendVia", val)}
            >
              <SelectTrigger className="w-full !h-[44px] rounded-full bg-gray-100 dark:bg-gray-800 border-0 px-5 text-[14px]">
                <SelectValue placeholder="Email only" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Email only">Email only</SelectItem>
                <SelectItem value="Whatsapp only">Whatsapp only</SelectItem>
                <SelectItem value="Email and whatsapp">Email and whatsapp</SelectItem>
              </SelectContent>
            </Select>
            {formik.touched.sendVia && formik.errors.sendVia && (
              <p className="text-xs text-destructive ml-3">{formik.errors.sendVia}</p>
            )}
          </div>

          <Separator className="bg-gray-100 dark:bg-gray-800" />

          {/* Actions */}
          <div className="flex justify-center flex-col gap-3 pt-2">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleSaveDraft}
                loading={formik.isSubmitting && formik.values.status === "draft"}
                disabled={formik.isSubmitting}
                className="h-12 flex-1 rounded-full text-[14px] border-0 text-gray-700 dark:text-gray-300 bg-[#F2F2F7] dark:bg-gray-800 hover:bg-gray-150 dark:hover:bg-gray-750 font-medium transition-colors"
              >
                Save as draft
              </Button>
              <Button
                type="button"
                onClick={handlePublish}
                loading={formik.isSubmitting && formik.values.status === "live"}
                disabled={formik.isSubmitting}
                className="h-12 flex-1 rounded-full text-[14px] text-white bg-primary hover:bg-primary/90 font-semibold transition-colors"
              >
                Send campaign
              </Button>
            </div>

            {isEditing && onDelete && (
              <Button
                type="button"
                variant="link"
                onClick={() => {
                  onOpenChange(false)
                  setDeleteDialogOpen(true)
                }}
                className="h-10 hover:no-underline rounded-full text-[13px] text-destructive hover:text-destructive/90 mt-1"
              >
                <Trash className="size-3.5 mr-1.5" />
                Delete campaign
              </Button>
            )}
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
