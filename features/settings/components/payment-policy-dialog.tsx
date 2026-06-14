"use client"

import React, { useEffect } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { DialogContainer } from "@/shared/components/dialogs/dialog-container"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PaymentPolicy {
  id: string
  title: string
  description: string
  enabled: boolean
}

interface PaymentPolicyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Pass a policy to edit; omit for add mode */
  policy?: PaymentPolicy | null
  onSubmit: (values: { title: string; description: string }) => void
}

// ─── Validation ───────────────────────────────────────────────────────────────

const policySchema = Yup.object({
  title: Yup.string().required("Policy title is required"),
  description: Yup.string().required("Policy description is required"),
})

// ─── Component ────────────────────────────────────────────────────────────────

export function PaymentPolicyDialog({
  open,
  onOpenChange,
  policy,
  onSubmit,
}: PaymentPolicyDialogProps) {
  const isEditing = !!policy

  const formik = useFormik({
    initialValues: {
      title: policy?.title ?? "",
      description: policy?.description ?? "",
    },
    enableReinitialize: true,
    validationSchema: policySchema,
    onSubmit: (values, { resetForm }) => {
      onSubmit(values)
      resetForm()
      onOpenChange(false)
    },
  })

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      formik.resetForm()
    }
    onOpenChange(isOpen)
  }

  // Keep form values in sync when the policy prop changes
  useEffect(() => {
    if (open) {
      formik.resetForm({
        values: {
          title: policy?.title ?? "",
          description: policy?.description ?? "",
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, policy])

  return (
    <DialogContainer
      open={open}
      onOpenChange={handleClose}
      dialogTitle={isEditing ? "Edit payment policy" : "Add payment policy"}
      isShowTopSeparator
      contentClassName="sm:max-w-[560px] px-0"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-5 mt-4">
        {/* Title */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1.5 ml-1">
            Payment policy title
          </label>
          <Input
            name="title"
            type="text"
            placeholder="Enter a policy title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && formik.errors.title}
            className="bg-secondary border-transparent focus-visible:ring-ring h-[44px]"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1.5 ml-1">
            Payment policy description
          </label>
          <Textarea
            name="description"
            placeholder="Enter a description for the payment policy"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows={5}
            className="bg-secondary border-transparent focus-visible:ring-ring resize-none rounded-2xl text-sm px-4 py-3"
          />
          {formik.touched.description && formik.errors.description && (
            <p className="mt-2 text-xs font-medium text-destructive ml-3 animate-in fade-in duration-200">
              {formik.errors.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleClose(false)}
            className="rounded-full h-11 text-sm bg-secondary hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border-0 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="rounded-full h-11 text-sm bg-primary text-white hover:bg-primary-600 transition-colors cursor-pointer"
          >
            {isEditing ? "Save changes" : "Create payment policy"}
          </Button>
        </div>
      </form>
    </DialogContainer>
  )
}
