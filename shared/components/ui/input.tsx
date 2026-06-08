import * as React from "react"
import { cn } from "@/shared/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  endIcon?: React.ReactNode
  onClickEndIcon?: () => void
  error?: string | boolean | any
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon,error, endIcon, onClickEndIcon, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        <div className="relative flex items-center w-full">
          {icon && (
            <div className="absolute left-3 text-muted-foreground pointer-events-none">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-[44x] hs-[s12qww]  w-full rounded-[32px] bg-secondary px-[16px] py-[12px] text-xs md:text-[15px] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-ssm",
              icon && "pl-10",
              endIcon && "pr-10",
              error && "ring-2 ring-destructive/50 bg-red-50/30",
              className
            )}
            ref={ref}
            {...props}
          />
           {endIcon && (
            <div
             className="cursor-pointer absolute right-3 "
             onClick={onClickEndIcon}
             >
              {endIcon}
            </div>
          )}
        </div>
        {error && typeof error === "string" && (
          <p className="mt-2 text-xs font-medium text-destructive ml-3 animate-in fade-in slide-in-from-top-1 duration-200">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
