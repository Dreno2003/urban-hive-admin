import { Icon } from "@/shared/components/ui/icon"
import { cn } from "@/shared/lib/utils"

type RemoveButtonProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  ariaLabel?: string
}

export function RemoveButton({ onClick, className, ariaLabel = "Remove" }: RemoveButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick(e)
      }}
      className={cn(
        "absolute border -top-1 -right-1 size-4 rounded-full bg-secondary-foreground text-white flex items-center justify-center hover:bg-gray-900 transition-colors cursor-pointer border-white",
        className
      )}
      aria-label={ariaLabel}
    >
      <Icon name="x" size={9} />
    </button>
  )
}
