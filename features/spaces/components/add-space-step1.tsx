import { useRef } from "react"
import { Input } from "@/shared/components/ui/input"
import { Icon } from "@/shared/components/ui/icon"
import { MediaSlot } from "./media-slot"
import { cn } from "@/shared/lib/utils"
import type { FormikProps } from "formik"
import type { AddSpaceFormValues } from "./add-space-dialog"
import type { SpaceType } from "../types"

const SPACE_TYPES: SpaceType[] = ["Office", "Shortlet", "Boardroom", "Hot desk"]

type Props = {
  formik: FormikProps<AddSpaceFormValues>
  images: (File | null)[]
  imagePreviews: (string | null)[]
  video: File | null
  onImageChange: (i: number, file: File | null) => void
  onVideoChange: (file: File | null) => void
  typeOpen: boolean
  onTypeOpenChange: (open: boolean) => void
}

export function AddSpaceStep1({
  formik, images, imagePreviews, video,
  onImageChange, onVideoChange, typeOpen, onTypeOpenChange,
}: Props) {
  const imageRefs = useRef<(HTMLInputElement | null)[]>([])
  const videoRef = useRef<HTMLInputElement>(null)
  const err = (field: keyof AddSpaceFormValues) => formik.touched[field] ? formik.errors[field] : undefined

  return (
    <>
      {/* Space type */}
      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-gray-500">Space type</label>
        <div className="relative">
          <button
            type="button"
            onClick={() => onTypeOpenChange(!typeOpen)}
            className={cn(
              "w-full h-[44px] px-4 rounded-full bg-secondary text-left text-[13px] flex items-center justify-between",
              formik.values.spaceType ? "text-gray-900" : "text-gray-400"
            )}
          >
            {formik.values.spaceType || "Choose a space type"}
            <Icon name="chevronDown" className="text-secondary-foreground size-4" />
          </button>
          {typeOpen && (
            <div className="absolute z-20 top-full mt-1 w-full bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
              {SPACE_TYPES.map(type => (
                <button key={type} type="button"
                  className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-secondary transition-colors"
                  onClick={() => { formik.setFieldValue("spaceType", type); onTypeOpenChange(false) }}
                >{type}</button>
              ))}
            </div>
          )}
        </div>
        {err("spaceType") && <p className="text-red-500 text-xs">{err("spaceType")}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-gray-500">Space name</label>
        <Input name="name" placeholder="Enter the space name" value={formik.values.name}
          onChange={formik.handleChange} onBlur={formik.handleBlur} error={err("name")} className="h-[46px]" />
      </div>

      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-gray-500">Space location</label>
        <Input name="location" placeholder="Enter the space address" value={formik.values.location}
          onChange={formik.handleChange} onBlur={formik.handleBlur} error={err("location")} className="h-[46px]" />
      </div>

      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-gray-500">Space description</label>
        <textarea
          name="description"
          placeholder="Enter space description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          rows={4}
          className="w-full px-4 py-3 rounded-2xl bg-secondary text-[13px] text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        {err("description") && <p className="text-red-500 text-xs">{err("description")}</p>}
      </div>

      {/* Images */}
      <div className="space-y-2.5">
        <label className="inline-block text-[13px] font-medium text-gray-500">Add images</label>
        <div className="flex gap-2 flex-wrap">
          {images.map((file, i) => (
            <div key={i}>
              <input type="file" accept="image/*" className="hidden"
                ref={el => { imageRefs.current[i] = el }}
                onChange={e => onImageChange(i, e.target.files?.[0] ?? null)}
              />
              <MediaSlot
                file={file}
                preview={imagePreviews[i] ?? undefined}
                onAdd={() => imageRefs.current[i]?.click()}
                onRemove={() => onImageChange(i, null)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Video */}
      <div className="space-y-3">
        <label className="text-[13px] font-medium text-gray-500">Add video</label>
        <input type="file" accept="video/*" ref={videoRef} className="hidden"
          onChange={e => onVideoChange(e.target.files?.[0] ?? null)} />
        <MediaSlot
          file={video}
          onAdd={() => videoRef.current?.click()}
          onRemove={() => onVideoChange(null)}
        />
      </div>
    </>
  )
}
