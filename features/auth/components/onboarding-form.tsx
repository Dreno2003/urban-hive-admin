"use client"

import React from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Logo } from "@/shared/components/ui/logo"
import { PasswordInput } from "@/shared/components/ui/password-input"
import { Button } from "@/shared/components/ui/button"

// Validation schema
const setPasswordSchema = Yup.object({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
})

export function OnboardingForm() {
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: setPasswordSchema,
    onSubmit: async (values) => {
      // Simulate API submission
      await new Promise((resolve) => setTimeout(resolve, 1200))
      alert("Password configured successfully! Welcome to the workspace.")
    },
  })

  return (
    <div className="w-full max-w-[457px] bg-card rounded-[32px] p-8 md:p-10 ring-5 ring-white/20 relative z-10 transition-transform duration-300 ease-out">
      <div className="animate-in fade-in duration-300">
        {/* Colored Logo in top-left */}
        <Logo variant="color" className="w-[69px] h-[48px] mb-8 block" />

        <h1 className="text-[28px] font-bold text-foreground tracking-tight leading-tight">
          Welcome, Frieda
        </h1>
        <p className="text-body-base text-secondary-foreground font-medium mt-1 mb-8">
          Please set up your password to access the workspace.
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
              Password
            </label>
            <PasswordInput
              name="password"
              placeholder="Enter your password"
              isShowEndIcon={true}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && formik.errors.password}
              className="bg-secondary border-transparent focus-visible:ring-ring"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
              Confirm password
            </label>
            <PasswordInput
              name="confirmPassword"
              placeholder="Enter your password"
              isShowEndIcon={true}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && formik.errors.confirmPassword}
              className="bg-secondary border-transparent focus-visible:ring-ring"
            />
          </div>

          <Button
            type="submit"
            variant="default"
            size="default"
            loading={formik.isSubmitting}
            className="w-full h-[52px] hover:bg-primary-500 text-white text-[15px] tracking-wide rounded-full flex items-center justify-center transition-all duration-200 mt-8 shadow-sm shadow-primary/10 active:scale-[0.99]"
          >
            Set password
          </Button>
        </form>
      </div>
    </div>
  )
}
