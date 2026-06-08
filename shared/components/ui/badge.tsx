import { cn } from "@/shared/lib/utils";
import { PropertyCardPillTransperentDegree } from "./property/property-card";
import { Icon } from "./icon";

export function Badge({
  iconName,
  title,
  onClick,
  transperentDegree = "sm",
  titleClassName,
  iconClassName,
  iconPosition = 'left',
  mainclassName
}: {
  title: string;
  onClick?: () => void
  iconName?: any;
  titleClassName?: string
  transperentDegree?: PropertyCardPillTransperentDegree
  iconClassName?: string
  iconPosition?: 'left' | 'right'
  mainclassName?: string
}) {
  return (
    <span
      onClick={() => onClick?.()}
      className={cn(
        "bg-[#ffffff91] cursor-pointer items-center px-3.5 backdrop-blur-xl border border-white text-secondary-foreground text-xs font-medium items-center justify-center gap-2 min-w-[57px] h-[40px] inline-flex rounded-full shadow-sm whitespace-nowrap",
        transperentDegree === "md" && "bg-[##FFFFFF80]",
        transperentDegree === "md" && "bg-[#FFFFFFE5]",
        transperentDegree === "xs" && "bg-gradient-to-r  from-[#e4dfdf2c]/60 to-gray-50/10 backdrop-blur-sm border-none shadow-none",
        transperentDegree === "lg" && "bg-transparent hover:ring-[#FFFFFF66] hover:bg-secondary transition-all  duration-300 ring ring-gray-200 shadow-none",
        transperentDegree === 'noFill' && 'px-0 bg-transparent border-none shadow-none',
        mainclassName
      )}
    >
      {/* {property.tags?.[0] ?? "Shortlet"} */}
      {iconPosition === 'left' && iconName && <Icon name={iconName} size={16} className={cn("text-gray-500 ", iconClassName)} />}
      <span className={cn('mt-px inline-block', titleClassName)}>{title}</span>
      {iconPosition === 'right' && iconName && <Icon name={iconName} size={16} className={cn("text-gray-500 ", iconClassName)} />}
    </span>
  );
}