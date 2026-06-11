import { Icon } from "@/shared/components/ui/icon"

type MediaSlotProps = {
  file: File | null
  preview?: string
  onAdd: () => void
  onRemove: () => void
}

export function MediaSlot({ file, preview, onAdd, onRemove }: MediaSlotProps) {
  return (
    <div className="relative size-[60px] shrink-0">
      <button
        type="button"
        onClick={onAdd}
        className="size-full rounded-xl border border-dashed border-gray-200 bg-secondary flex items-center justify-center hover:bg-gray-200 transition-colors overflow-hidden"
      >
        {file && preview ? (
          <img src={preview} alt="" className="w-full h-full object-cover rounded-xl" />
        ) : file ? (
          <span className="text-[10px] text-gray-500 font-medium text-center px-1 leading-tight">Video</span>
        ) : (
          <span className="text-2xl text-gray-400 leading-none">+</span>
        )}
      </button>
      {file && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          className="absolute border -top-1 -right-1 size-4 rounded-full bg-secondary-foreground text-white flex items-center justify-center hover:bg-gray-900 transition-colors"
          aria-label="Remove"
        >
          <Icon name="x" size={9} />
        </button>
      )}
    </div>
  )
}
