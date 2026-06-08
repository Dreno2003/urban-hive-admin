"use client"

import * as React from "react"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"

import { cn } from "@/shared/lib/utils"
import { Icon } from "@/shared/components/ui/icon"
import { Button } from "@/shared/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  const isRangeSelected = React.useMemo(() => {
    if (props.mode !== "range" || !props.selected) return false
    const sel = props.selected as { from?: Date; to?: Date }
    return !!(sel.from && sel.to && sel.from.getTime() !== sel.to.getTime())
  }, [props.mode, props.selected])

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        formatWeekdayName: (date) =>
          date.toLocaleString(locale?.code, { weekday: "short" }).slice(0, 1).toUpperCase(),
        ...formatters,
      }}

      classNames={{
        root: cn("w-full", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          "size-10 p-0 select-none bg-[#F5F5F5] rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          "size-10 p-0 select-none bg-[#F5F5F5] rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-10 w-full items-center justify-center px-10 text-base font-bold text-navy-900",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-10 w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-md",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 bg-popover opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "font-bold select-none text-base text-navy-900",
          defaultClassNames.caption_label
        ),
        month_grid: "w-full border-separate border-spacing-x-0 border-spacing-y-2 table-fixed",
        weekdays: cn("", defaultClassNames.weekdays),
        weekday: cn(
          "h-8 sm:h-10 text-[13px] font-bold text-navy-900 uppercase select-none text-center align-middle",
          defaultClassNames.weekday
        ),
        week: cn("", defaultClassNames.week),
        day: cn(
          "group/day relative h-8 sm:h-10 p-0 text-center select-none align-middle",
          defaultClassNames.day
        ),
        range_start: cn(
          isRangeSelected && "after:absolute after:h-8 sm:after:h-10 after:top-1/2 after:-translate-y-1/2 after:left-[calc(50%-16px)] sm:after:left-[calc(50%-20px)] after:bg-gray-50 after:rounded-l-full",
          isRangeSelected && "[&:not(.rdp-range_end)]:after:right-0",
          isRangeSelected && "[&.rdp-range_end]:after:right-[calc(50%-16px)] sm:[&.rdp-range_end]:after:right-[calc(50%-20px)] [&.rdp-range_end]:after:rounded-r-full",
          isRangeSelected && "last:after:rounded-r-full",
          defaultClassNames.range_start
        ),
        range_middle: cn(
          isRangeSelected && "after:absolute after:h-8 sm:after:h-10 after:top-1/2 after:-translate-y-1/2 after:left-0 after:right-0 after:bg-gray-50",
          isRangeSelected && "first:after:rounded-l-full last:after:rounded-r-full",
          defaultClassNames.range_middle
        ),
        range_end: cn(
          isRangeSelected && "after:absolute after:h-8 sm:after:h-10 after:top-1/2 after:-translate-y-1/2 after:right-[calc(50%-16px)] sm:after:right-[calc(50%-20px)] after:bg-gray-50 after:rounded-r-full",
          isRangeSelected && "[&:not(.rdp-range_start)]:after:left-0",
          isRangeSelected && "first:after:rounded-l-full",
          defaultClassNames.range_end
        ),
        today: cn(
          "text-navy-900 font-bold",
          defaultClassNames.today
        ),
        outside: cn(
          "text-gray-300 opacity-50",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-gray-300 opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <Icon name="chevronLeft" size={12} className="text-navy-900" />
            )
          }

          if (orientation === "right") {
            return (
              <Icon name="chevronRight" size={12} className="text-navy-900" />
            )
          }

          return (
            <Icon name="chevronDown" size={12} className="text-navy-900" />
          )
        },
        DayButton: ({ ...props }) => (
          <CalendarDayButton locale={locale} {...props} />
        ),
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  const isSelected = modifiers.selected;
  const isRangeStart = modifiers.range_start;
  const isRangeEnd = modifiers.range_end;
  const isRangeMiddle = modifiers.range_middle;

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      className={cn(
        "relative mx-auto z-10 h-8 w-8 sm:h-10 sm:w-10 aspect-square flex-shrink-0 rounded-full flex items-center justify-center text-sm font-medium transition-all hover:bg-gray-100",
        isSelected && !isRangeMiddle && "bg-navy-900! text-white! hover:bg-navy-900/90!",
        isRangeMiddle && "bg-transparent text-navy-900 hover:bg-gray-200",
        !isSelected && "text-navy-900",
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }

