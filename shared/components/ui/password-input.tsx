import * as React from "react"
import { Input, type InputProps } from "@/shared/components/ui/input"
import { Icon } from "@/shared/components/ui/icon"

export interface PasswordInputProps extends Omit<InputProps, "type" | "endIcon" | "onClickEndIcon"> {
  isShowEndIcon?: boolean
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, icon, isShowEndIcon, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev)
    }

    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={className}
          ref={ref}
          icon={icon ?? <Icon name="lock" size={18} className="text-icon-default" />}
          endIcon={
            isShowEndIcon && (

              <Icon
                name={showPassword ? "eyeOff" : "eye"}
                size={18}
                onClick={togglePasswordVisibility}
                className="text-icon-default transition-colors select-none"
              />)
          }
          onClickEndIcon={togglePasswordVisibility}
          {...props}
        />
      </div>
    )
  }
)

PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
