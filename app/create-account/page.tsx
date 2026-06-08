"use client"

import React from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Logo } from "@/shared/components/ui/logo"
import { Input } from "@/shared/components/ui/input"
import { PasswordInput } from "@/shared/components/ui/password-input"
import { Button } from "@/shared/components/ui/button"
import { Icon } from "@/shared/components/ui/icon"

// Validation schema
const loginSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
})

export default function LoginPage() {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      // Simulate API submission
      await new Promise((resolve) => setTimeout(resolve, 1200))
      alert("Successfully logged in! (Redirecting to portal...)")
    },
  })

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-6 relative overflow-hidden bg-primary-600">
      {/* Repeating Maroon Pattern Background */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none z-0"
        style={{
          backgroundImage: "url('/images/landing-page-images/maroon-pattern.svg')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden
      />

      {/* Center Auth Card */}
      <div className="w-full max-w-[457px]  bg-card rounded-[32px] p-8 md:p-10 ring-5 ring-white/20 relative z-10  transition-transform duration-300 ease-out">
        <div className="animate-in fade-in duration-300">
          {/* Colored Logo in top-left */}
          <Logo variant="color" className="w-[69px] h-[48px] mb-8 block" />

          <h1 className="text-[28px] font-bold text-foreground tracking-tight leading-tight">
            Welcome, Admin
          </h1>
          <p className="text-body-base text-secondary-foreground font-medium mt-1 mb-8">
            Enter your details to login.
          </p>

          <form onSubmit={formik.handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                Email
              </label>
              <Input
                name="email"
                type="email"
                placeholder="Enter your email"
                icon={<Icon name="mail" size={18} className="text-icon-default" />}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && formik.errors.email}
                className="bg-secondary border-transparent focus-visible:ring-ring"
              />
            </div>

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
              <button
                type="button"
                className="text-xs font-bold text-primary-500 hover:opacity-80 transition-opacity float-right mt-2 select-none cursor-pointer"
                onClick={() => alert("Password reset simulation")}
              >
                Forgot password?
              </button>
              <div className="clear-both" />
            </div>

            <Button
              type="submit"
              variant="default"
              size="default"
              loading={formik.isSubmitting}
              className="w-full h-[52px]  hover:bg-primary-500 text-white  text-[15px] tracking-wide rounded-full flex items-center justify-center transition-all duration-200 mt-8 shadow-sm shadow-primary/10 active:scale-[0.99]"
            >
              Log in
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
