import { Input } from "@/shared/components/ui/input"
import { Icon } from "@/shared/components/ui/icon"
import { AmenityInput } from "./amenity-input"
import { cn } from "@/shared/lib/utils"
import type { FormikProps } from "formik"
import type { AddSpaceFormValues } from "./add-space-dialog"

const RATE_TYPES = ["day", "night", "hour", "week", "month"]

type Props = {
  formik: FormikProps<AddSpaceFormValues>
  amenities: string[]
  onAmenitiesChange: (amenities: string[]) => void
  rateTypeOpen: boolean
  onRateTypeOpenChange: (open: boolean) => void
}

function Counter({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-3">
      <button type="button" onClick={() => onChange(Math.max(0, value - 1))}
        className="size-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-secondary transition-colors text-gray-600">
        <Icon name="minus" size={12} />
      </button>
      <span className="text-[15px] font-semibold w-4 text-center">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)}
        className="size-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-secondary transition-colors text-gray-600">
        <Icon name="plus" size={12} />
      </button>
    </div>
  )
}

export function AddSpaceStep2({ formik, amenities, onAmenitiesChange, rateTypeOpen, onRateTypeOpenChange }: Props) {
  const err = (field: keyof AddSpaceFormValues) => formik.touched[field] ? formik.errors[field] : undefined

  return (
    <>
      {/* Bedrooms / Bathrooms */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[13px] font-medium text-gray-500">Bedrooms</label>
          <Counter value={formik.values.bedrooms} onChange={v => formik.setFieldValue("bedrooms", v)} />
        </div>
        <div className="space-y-2">
          <label className="text-[13px] font-medium text-gray-500">Bathrooms</label>
          <Counter value={formik.values.bathrooms} onChange={v => formik.setFieldValue("bathrooms", v)} />
        </div>
      </div>

      {/* Rate type / Amount */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-gray-500">Rate type</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => onRateTypeOpenChange(!rateTypeOpen)}
              className={cn(
                "w-full h-[44px] px-4 rounded-full bg-secondary text-left text-[13px] flex items-center justify-between",
                formik.values.rateType ? "text-gray-900" : "text-gray-400"
              )}
            >
              {formik.values.rateType ? `Per ${formik.values.rateType}` : "Select a rate type"}
              <Icon name="chevronDown" className="text-secondary-foreground size-4" />
            </button>
            {rateTypeOpen && (
              <div className="absolute z-20 top-full mt-1 w-full bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
                {RATE_TYPES.map(r => (
                  <button key={r} type="button"
                    className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-secondary transition-colors capitalize"
                    onClick={() => { formik.setFieldValue("rateType", r); onRateTypeOpenChange(false) }}
                  >Per {r}</button>
                ))}
              </div>
            )}
          </div>
          {err("rateType") && <p className="text-red-500 text-xs">{err("rateType")}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-gray-500">Amount</label>
          <Input name="amount" placeholder="₦0.00" value={formik.values.amount}
            onChange={formik.handleChange} onBlur={formik.handleBlur} error={err("amount")} className="h-[44px]" />
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-gray-500">Space amenities</label>
        <AmenityInput value={amenities} onChange={onAmenitiesChange} />
      </div>

      {/* Space rules */}
      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-gray-500">Space rules</label>
        <textarea
          name="rules"
          placeholder="Enter space rules"
          value={formik.values.rules}
          onChange={formik.handleChange}
          rows={4}
          className="w-full px-4 py-3 rounded-2xl bg-secondary text-[13px] text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
    </>
  )
}
