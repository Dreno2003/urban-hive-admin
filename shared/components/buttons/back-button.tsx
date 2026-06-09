"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Icon } from "../ui/icon";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "../ui/button";
import { cn } from "@/shared/lib/utils";

interface BackButtonProps extends VariantProps<typeof buttonVariants> {
  onBack?: () => void;
  className?: string;
  label?: string;
  children?: React.ReactNode;
}

export function BackButton({ variant = "secondary", size, onBack, className, label, children }: BackButtonProps) {
  const router = useRouter();

  const handleBack = onBack ?? (() => router.back());

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleBack}
      className={cn("flex items-center gap-2 text-[14.5] font-medium transition-all cursor-pointer", variant === 'link' && "!no-underline" ,className)}
    >
      <Icon name="chevronLeft" size={20} className="text-secondary-foreground" />
      <span className="text-secondary-foreground">
        {children ?? label ?? "Back"}
      </span>
    </Button>
  );
}
