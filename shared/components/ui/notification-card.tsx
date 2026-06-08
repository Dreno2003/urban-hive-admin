"use client"

import * as React from "react"
import { cn } from "@/shared/lib/utils"
import { Icon } from "./icon"

export type NotificationType = "info" | "warning" | "error" | "success" | "neutral"
export type NotificationVariant = "dark" | "light"

export interface NotificationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: NotificationType
  variant?: NotificationVariant
  title?: string
  description?: string
  ctaText?: string
  onCtaClick?: () => void
  onClose?: () => void
  ctaButtonClassName?: string
}

const NotificationCard = React.forwardRef<HTMLDivElement, NotificationCardProps>(
  (
    {
      className,
      ctaButtonClassName,
      type = "info",
      variant = "dark",
      title,
      description,
      ctaText,
      onCtaClick,
      onClose,
      ...props
    },
    ref
  ) => {
    // Render status icon based on the type
    const renderIcon = () => {
      switch (type) {
        case "success":
          // Solid green circle with white check
          return (
            <Icon name="info" size={25} className="text-gray-500" />
          )
        case "error":
          // Solid red circle with white cross
          return (
            <Icon name="info" size={25} className="text-destructive" />

          )
        case "warning":
          // Yellow 8-point squircle star badge with white exclamation mark
          return (
            <Icon name="info" size={25} className="text-[#FEA904]" />

          )
        case "neutral":
          // Gray 8-point squircle star badge with white exclamation mark
          return (
            <Icon name="info" size={25} className="text-[#E5E5E5]" />

          )
        case "info":

          return (
            <>
              <Icon name="info" size={25} className="text-[#4196FF]" />
            </>
          )
        default:
          // Blue 8-point squircle star badge with white exclamation mark
          return (
            <>
              <Icon name="info" size={25} className="text-[#4196FF]" />
            </>
          )
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full max-w-[480px] gap-4 rounded-[20px] p-3 md:p-5 shadow-sm transition-all duration-200",
          variant === "dark"
            ? "bg-[#292929] text-white"
            : "bg-[#F4F5F7] text-gray-900",
          className
        )}
        {...props}
      >
        {/* Left Side Icon */}
        <div className="mt-0.5">{renderIcon()}</div>

        {/* Content Area */}
        <div className="flex flex-col gap-1.5 pr-6">
          {title && (
            <h4
              className={cn(
                "text-body-sm  md:text-base font-semibold tracking-tight",
                variant === "dark" ? "text-white" : "text-gray-900"
              )}
            >
              {title}
            </h4>
          )}
          {description && (
            <p
              className={cn(
                "text-sm font-normal leading-relaxed",
                variant === "dark" ? "text-[#777777]" : "text-gray-600"
              )}
            >
              {description}
            </p>
          )}
          {ctaText && (
            <button
              onClick={onCtaClick}
              className={cn(
                "w-fit text-left text-sm font-semibold underline underline-offset-4 hover:opacity-85 transition-opacity active:scale-[0.98] cursor-pointer mt-1",
                variant === "dark" ? "text-white" : "text-gray-900",
                ctaButtonClassName,
              )}
            >
              {ctaText}
            </button>
          )}
        </div>

        {/* Close Button on Top Right */}
        {onClose && (
          <button
            onClick={onClose}
            className={cn(
              "absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer",
              variant === "dark"
                ? "border-white/20 text-white hover:border-white/40 hover:bg-white/5"
                : "border-gray-900/10 text-gray-900 hover:border-gray-900/20 hover:bg-gray-900/5"
            )}
            aria-label="Close notification"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L9 9M9 1L1 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    )
  }
)

NotificationCard.displayName = "NotificationCard"

export { NotificationCard }
