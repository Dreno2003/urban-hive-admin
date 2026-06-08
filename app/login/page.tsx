import React from "react"
import { LoginForm } from "@/features/auth/components/login-form"

export default function LoginPage() {
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

      <LoginForm />
    </div>
  )
}
