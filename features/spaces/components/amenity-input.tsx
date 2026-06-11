import { useState } from "react"
import { Icon } from "@/shared/components/ui/icon"
import { cn } from "@/shared/lib/utils"

const AMENITY_SUGGESTIONS = [{ label: 'Wi-Fi', icon: 'wifi2' }, { label: 'Air conditioning', icon: 'ac2' }, { label: 'Washing machine', icon: 'washingMachine2' }, { label: '24/hr', icon: 'light' }, { label: 'Kitchen', icon: 'kitchen2' }]
// const AMENITY_SUGGESTIONS = ["Wi-Fi", "Air conditioning", "Washing machine", "Kitchen", "24/hr"]

type AmenityInputProps = {
  value: string[]
  onChange: (amenities: string[]) => void
}

export function AmenityInput({ value, onChange }: AmenityInputProps) {
  const [input, setInput] = useState("")

  const add = (amenity: string) => {
    const trimmed = amenity.trim()
    if (!trimmed || value.includes(trimmed)) return
    onChange([...value, trimmed])
    setInput("")
  }

  const remove = (amenity: string) => onChange(value.filter(a => a !== amenity))

  return (
    <div className="space-y-2">
      <div className="min-h-[44px] px-3 py-2 rounded-full bg-secondary flex flex-wrap items-center gap-1.5">
        {value.map(a => (
          <span key={a} className="flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2.5 py-0.5 text-[12px] font-medium text-gray-700">
            {a}
            <button type="button" onClick={() => remove(a)} className="text-gray-400 hover:text-gray-700">
              <Icon name="x" size={10} />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(input) } }}
          placeholder={value.length === 0 ? "Enter the amenities e.g wifi" : ""}
          className="flex-1 min-w-[120px] bg-transparent text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {AMENITY_SUGGESTIONS.map(s => {
          const added = value.includes(s.label)
          return (
            <button
              key={s.label}
              type="button"
              disabled={added}
              onClick={() => add(s.label)}
              className={cn(
                "flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-medium border transition-colors",
                added
                  ? "bg-secondary border-gray-200 text-gray-300 cursor-not-allowed"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-secondary"
              )}
            >

              {/* @ts-ignore */}
              <Icon name={s.icon} className='size-[15px]' />
              {/* <span className="size-2 rounded-full bg-gray-300 inline-block" /> */}
              {s.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
