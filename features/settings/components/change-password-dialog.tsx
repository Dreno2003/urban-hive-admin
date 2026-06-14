"use client"

import React from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { DialogContainer } from "@/shared/components/dialogs/dialog-container"
import { Button } from "@/shared/components/ui/button"
import { PasswordInput } from "@/shared/components/ui/password-input"
import { useChangePassword } from "../hooks/use-settings"
import { toast } from "sonner"

interface ChangePasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const changePasswordSchema = Yup.object({
  currentPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Current password is required"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your new password"),
})

export function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
  const { mutateAsync: changePassword, isPending } = useChangePassword()

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: changePasswordSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        })
        toast.success("Password changed successfully")
        resetForm()
        onOpenChange(false)
      } catch (err: any) {
        toast.error(err.message || "Failed to change password")
      }
    },
  })

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      formik.resetForm()
    }
    onOpenChange(isOpen)
  }

  return (
    <DialogContainer
      open={open}
      onOpenChange={handleClose}
      dialogTitle="Change password"
      isShowTopSeparator={true}
      contentClassName="sm:max-w-[480px]"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-5 mt-4">
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1.5 ml-1">
            Current password
          </label>
          <PasswordInput
            name="currentPassword"
            placeholder="Enter your current password"
            isShowEndIcon={true}
            value={formik.values.currentPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.currentPassword && formik.errors.currentPassword}
            className="bg-secondary border-transparent focus-visible:ring-ring h-[44px]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1.5 ml-1">
            New password
          </label>
          <PasswordInput
            name="newPassword"
            placeholder="Enter your new password"
            isShowEndIcon={true}
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.newPassword && formik.errors.newPassword}
            className="bg-secondary border-transparent focus-visible:ring-ring h-[44px]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1.5 ml-1">
            Confirm new password
          </label>
          <PasswordInput
            name="confirmPassword"
            placeholder="Confirm your new password"
            isShowEndIcon={true}
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.confirmPassword && formik.errors.confirmPassword}
            className="bg-secondary border-transparent focus-visible:ring-ring h-[44px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 mt-6">
          <Button
            type="button"
            variant="secondary-outline"
            onClick={() => handleClose(false)}
            className="rounded-full h-11 text-sm cursor-pointer"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isPending}
            className="rounded-full h-11 text-sm bg-primary text-white hover:bg-primary-600 transition-colors cursor-pointer"
          >
            Change password
          </Button>
        </div>
      </form>
    </DialogContainer>
  )
}
