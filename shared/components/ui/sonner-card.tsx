"use client"

import * as React from "react"
import { toast } from "sonner"
import { CheckCircle2, Info, XCircle, X } from "lucide-react"
import { cn } from "@/shared/lib/utils"

type SonnerCardVariant = "success" | "info" | "failed"

interface SonnerCardProps {
  id: string | number
  message: string
  variant?: SonnerCardVariant
}

const variantConfig: Record<SonnerCardVariant, { icon: React.ReactNode; iconClass: string }> = {
  success: { icon: <CheckCircle2 className="size-5 shrink-0" />, iconClass: "text-green-400" },
  info:    { icon: <Info className="size-5 shrink-0" />,         iconClass: "text-blue-400" },
  failed:  { icon: <XCircle className="size-5 shrink-0" />,      iconClass: "text-red-400" },
}

export function SonnerCard({ id, message, variant = "success" }: SonnerCardProps) {
  const { icon, iconClass } = variantConfig[variant]

  return (
    <div className="flex items-center gap-3 w-full min-w-[320px] max-w-[480px] bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg">
      <span className={cn(iconClass)}>{icon}</span>
      <p className="flex-1 text-sm font-medium leading-snug">{message}</p>
      <button
        onClick={() => toast.dismiss(id)}
        aria-label="Dismiss"
        className="shrink-0 text-gray-400 hover:text-white transition-colors"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}

// Convenience helpers
export const sonnerCard = {
  success: (message: string) =>
    toast.custom((id) => <SonnerCard id={id} message={message} variant="success" />),
  info: (message: string) =>
    toast.custom((id) => <SonnerCard id={id} message={message} variant="info" />),
  failed: (message: string) =>
    toast.custom((id) => <SonnerCard id={id} message={message} variant="failed" />),
}
