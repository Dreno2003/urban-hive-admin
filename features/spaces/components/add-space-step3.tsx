import { Input } from "@/shared/components/ui/input"
import { cn } from "@/shared/lib/utils"
import type { FormikProps } from "formik"
import type { AddSpaceFormValues } from "./add-space-dialog"

type Props = {
  formik: FormikProps<AddSpaceFormValues>
}

export function AddSpaceStep3({ formik }: Props) {
  const err = (field: keyof AddSpaceFormValues) => formik.touched[field] ? formik.errors[field] : undefined

  return (
    <>
      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-gray-500">Availability status</label>
        <div className="flex gap-3">
          {(["Available", "Occupied"] as const).map(s => (
            <button key={s} type="button"
              onClick={() => formik.setFieldValue("availability", s)}
              className={cn(
                "flex-1 h-[46px] rounded-2xl text-[13px] font-medium border transition-colors",
                formik.values.availability === s
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-gray-200 bg-secondary text-gray-500"
              )}
            >{s}</button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-gray-500">Available date</label>
        <Input name="availableDate" type="date" value={formik.values.availableDate}
          onChange={formik.handleChange} onBlur={formik.handleBlur} error={err("availableDate")} className="h-[46px]" />
      </div>
    </>
  )
}
