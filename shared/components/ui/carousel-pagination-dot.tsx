import React from 'react'
import { cn } from '@/shared/lib/utils'

export interface CarouselPaginationDotProps {
  total: number
  activeIndex: number
  onChangeIndex: (index: number) => void
  className?: string
}

export function CarouselPaginationDot({
  total,
  activeIndex,
  onChangeIndex,
  className,
}: CarouselPaginationDotProps) {
  if (total <= 1) return null

  return (
    <div className={cn("flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md", className)}>
      {Array.from({ length: total }).map((_, idx) => (
        <button
          key={idx}
          onClick={() => onChangeIndex(idx)}
          className={cn(
            "h-2 transition-all duration-300 rounded-full",
            idx === activeIndex 
              ? "w-6 bg-gray-600" 
              : "w-2 bg-gray-300 hover:bg-gray-400"
          )}
          aria-label={`Go to item ${idx + 1}`}
        />
      ))}
    </div>
  )
}
