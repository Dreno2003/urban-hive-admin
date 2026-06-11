import * as React from "react"
import { cn } from "@/shared/lib/utils"

export interface InsetCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The title or label shown in the header of the card (e.g., "Active clients").
   */
  title: React.ReactNode

  /**
   * Optional elements to display on the right side of the header.
   */
  headerExtra?: React.ReactNode

  /**
   * The content inside the inset container (e.g. metrics, charts, lists).
   */
  children: React.ReactNode

  /**
   * Custom styling for the outer card wrapper.
   */
  className?: string

  /**
   * Custom styling for the inner inset container.
   */
  insetClassName?: string

  /**
   * Custom styling for the header row.
   */
  headerClassName?: string

  /**
   * Custom styling for the title text/element.
   */
  titleClassName?: string

  /**
   * If false, renders children directly without the gray panel container styling.
   * @default true
   */
  hasInset?: boolean
}

const InsetCard = React.forwardRef<HTMLDivElement, InsetCardProps>(
  (
    {
      title,
      headerExtra,
      children,
      className,
      insetClassName,
      headerClassName,
      titleClassName,
      hasInset = true,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white dark:bg-gray-950  dark:border-gray-800 rounded-[28px] p-s5 p-1  transition-all duration-200",
          className
        )}
        {...props}
      >
        <div className="flex flex-col gasp-4">
          {/* Header Area */}

          <div
            className={cn(
              "flex items-center p-2.5 justify-between ",
              headerClassName
            )}
          >
            {typeof title === "string" ? (
              <h4
                className={cn(
                  "text-[15px] font-medium  text-secondary-foreground dark:text-gray-400 tracking-tight",
                  titleClassName
                )}
              >
                {title}
              </h4>
            ) : (
              title
            )}
            {headerExtra && <div className="flex items-center">{headerExtra}</div>}
          </div>

          {/* Inset Body Area */}
          {hasInset ? (
            <div
              className={cn(
                "bg-secondary dark:bg-gray-900/60 rounded-[25px] p-4 flex flex-col justify-center min-h-[131px]",
                // "bg-secondary dark:bg-gray-900/60 rounded-[25px] p-4 flex flex-col justify-center min-h-[140px]",
                insetClassName
              )}
            >
              {children}
            </div>
          ) : (
            <div className={cn("px-1", insetClassName)}>{children}</div>
          )}
        </div>
      </div>
    )
  }
)

InsetCard.displayName = "InsetCard"

/* ──────────────────────────────────────────────────────────────────────────
   METRIC SUB-COMPONENT FOR CONVENIENCE
   ────────────────────────────────────────────────────────────────────────── */

export interface InsetCardMetricProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The primary large metric value (e.g. "12", "$4,250", etc.).
   */
  value: React.ReactNode

  /**
   * Optional trend message (e.g. "↑ 2 this week", "-15% vs last month").
   */
  trend?: React.ReactNode

  /**
   * Determines color scheme of the trend:
   * - "up": Green (success)
   * - "down": Red (destructive)
   * - "neutral": Muted Gray
   * @default "neutral"
   */
  trendType?: "up" | "down" | "neutral"

  /**
   * Optional icon to show alongside the trend (like an arrow).
   */
  trendIcon?: React.ReactNode

  /**
   * Custom styling for the value text.
   */
  valueClassName?: string

  /**
   * Custom styling for the trend indicator.
   */
  trendClassName?: string
}

const InsetCardMetric = ({
  value,
  trend,
  trendType = "neutral",
  trendIcon,
  className,
  valueClassName,
  trendClassName,
  ...props
}: InsetCardMetricProps) => {
  const trendColor = {
    up: "text-[#00913a] dark:text-[#1bcb67]",
    down: "text-red-600 dark:text-red-400",
    neutral: "text-gray-500 dark:text-gray-400",
  }[trendType]

  return (
    <div className={cn("flex flex-col gap-2 ", className)} {...props}>
      <div
        className={cn(
          "text-[30px] font-bold tracking-tight text-gray-900 dark:text-white leading-none",
          valueClassName
        )}
      >
        {value}
      </div>
      {trend && (
        <div
          className={cn(
            "text-sm font-medium  flex items-center gap-1.5",
            trendColor,
            trendClassName
          )}
        >
          {trendIcon && <span className="flex-shrink-0">{trendIcon}</span>}
          <span>{trend}</span>
        </div>
      )}
    </div>
  )
}

InsetCardMetric.displayName = "InsetCard.Metric"

// Attach the Metric sub-component to InsetCard
const InsetCardWithSubComponents = InsetCard as typeof InsetCard & {
  Metric: typeof InsetCardMetric
}
InsetCardWithSubComponents.Metric = InsetCardMetric

export { InsetCardWithSubComponents as InsetCard }
