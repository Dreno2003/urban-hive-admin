import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/shared/lib/utils"
import { Icon, Icons } from "./icon"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3.5",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        warning:
          "bg-[#FEF3C6] text-[#FE9A00] ",
        success:
          "bg-green-100  text-[#00C950]  ",

        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",


        'success-outline': '!border border-gray-200 bg-transparent rounded-md text-secondary-foreground',
        'default-outline': '!border border-gray-200 bg-transparent rounded-md text-secondary-foreground',
        // 'destructive-outline': ''
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  iconSize,
  iconName,
  iconClassName,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean, iconName?: keyof typeof Icons, iconSize?:number, iconClassName?:string }) {
  const Comp = asChild ? Slot.Root : "span"

  function IconColor() {
    switch (variant) {
      case "default":
        return "text-primary-foreground"
      case "secondary":
        return "text-secondary-foreground"
      case "warning":
        return "text-[#FE9A00]"
      case "success":
        return "text-[#00C950]"
      case "outline":
        return "text-foreground"
      case "ghost":
        return "text-muted-foreground"
      case "success-outline":
        return "text-[#00C950]"
      case "link":
        return "text-primary"
    }
  }

  return (
    <span
      // data-slot="badge"

      className={cn('inline-block !py-3 !w-auto', badgeVariants({ variant }), className)}
      {...props}
    >

      {iconName &&
        <Icon name={iconName} size={iconSize??18} className={cn(IconColor(), iconClassName)} />
      }
      {props.children}

    </span>



  )
}

export { Badge, badgeVariants }
