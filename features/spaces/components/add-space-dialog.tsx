"use client"

import { useState, useRef } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { DialogContainer } from "@/shared/components/dialogs/dialog-container"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { cn } from "@/shared/lib/utils"
import type { SpaceType } from "../types"
import { Separator } from "@/shared/components/ui/separator"
import { Icon } from "@/shared/components/ui/icon"

const SPACE_TYPES: SpaceType[] = ["Office", "Shortlet", "Boardroom", "Hot desk"]

const step1Schema = Yup.object({
  spaceType: Yup.string().required("Space type is required"),
  name: Yup.string().required("Space name is required"),
  location: Yup.string().required("Space location is required"),
  description: Yup.string().required("Space description is required"),
})

const step2Schema = Yup.object({
  rate: Yup.string().required("Rate is required"),
  capacity: Yup.number().min(1).required("Capacity is required"),
  amenities: Yup.string(),
})

const step3Schema = Yup.object({
  availability: Yup.string().required("Availability status is required"),
  availableDate: Yup.string().required("Available date is required"),
})

const SCHEMAS = [step1Schema, step2Schema, step3Schema]

const INITIAL_VALUES = {
  spaceType: "",
  name: "",
  location: "",
  description: "",
  rate: "",
  capacity: "",
  amenities: "",
  availability: "Available",
  availableDate: "",
}

type FormValues = typeof INITIAL_VALUES

type ImageSlot = File | null

function ImageUploadSlot({ file, onClick }: { file: ImageSlot; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="size-[60px] rounded-2xl bg-secondary flex items-center justify-center hover:bg-gray-200 transition-colors overflow-hidden shrink-0"
    >
      {file ? (
        <img src={URL.createObjectURL(file)} alt="upload" className="w-full h-full object-cover" />
      ) : (
        <span className="text-2xl text-gray-400 leading-none">+</span>
      )}
    </button>
  )
}

export type AddSpaceDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddSpaceDialog({ open, onOpenChange }: AddSpaceDialogProps) {
  const [step, setStep] = useState(1)
  const [images, setImages] = useState<ImageSlot[]>([null, null, null, null, null])
  const [video, setVideo] = useState<File | null>(null)
  const imageRefs = useRef<(HTMLInputElement | null)[]>([])
  const videoRef = useRef<HTMLInputElement>(null)
  const [typeOpen, setTypeOpen] = useState(false)

  const formik = useFormik<FormValues>({
    initialValues: INITIAL_VALUES,
    validationSchema: SCHEMAS[step - 1],
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async () => {
      if (step < 3) {
        setStep(s => s + 1)
        formik.setErrors({})
      } else {
        // TODO: submit
        handleClose()
      }
    },
  })

  const handleClose = () => {
    formik.resetForm()
    setStep(1)
    setImages([null, null, null, null, null])
    setVideo(null)
    onOpenChange(false)
  }

  const handleImageChange = (i: number, file: File | null) => {
    setImages(prev => { const next = [...prev]; next[i] = file; return next })
  }

  const err = (field: keyof FormValues) => formik.touched[field] ? formik.errors[field] : undefined

  return (
    <DialogContainer
      open={open}
      onOpenChange={handleClose}
      isShowTopSeparator={false}

      contentClassName="max-h-[90vh] px-0 flex flex-col w-[500px]"
      dialogTitle={
        <div>
          <span className="text-[24px] font-bold">Add space</span>
          <p className="text-[13px] text-secondary-foreground font-normal mt-0.5">{step} of 3 steps</p>
        </div>
      }
    >

      <Separator className="my-4"/>
      <form onSubmit={formik.handleSubmit} noValidate className="custom-scrollbar flex flex-col gap-4  pb-2 overflow-y-auto max-h-[65vh] pr-1">

        {/* ── Step 1 ── */}
        {step === 1 && (
          <>
            {/* Space type dropdown */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-gray-500">Space type</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setTypeOpen(o => !o)}
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
                      <button
                        key={type}
                        type="button"
                        className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-secondary transition-colors"
                        onClick={() => { formik.setFieldValue("spaceType", type); setTypeOpen(false) }}
                      >
                        {type}
                      </button>
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
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-gray-500">Add images</label>
              <div className="flex gap-2">
                {images.map((file, i) => (
                  <div key={i}>
                    <input
                      type="file"
                      accept="image/*"
                      ref={el => { imageRefs.current[i] = el }}
                      className="hidden"
                      onChange={e => handleImageChange(i, e.target.files?.[0] ?? null)}
                    />
                    <ImageUploadSlot file={file} onClick={() => imageRefs.current[i]?.click()} />
                  </div>
                ))}
              </div>
            </div>

            {/* Video */}
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-gray-500">Add video</label>
              <input type="file" accept="video/*" ref={videoRef} className="hidden"
                onChange={e => setVideo(e.target.files?.[0] ?? null)} />
              <button
                type="button"
                onClick={() => videoRef.current?.click()}
                className="size-[60px] rounded-2xl bg-secondary flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                {video ? (
                  <span className="text-[10px] text-gray-600 px-1 text-center truncate">{video.name}</span>
                ) : (
                  <span className="text-2xl text-gray-400 leading-none">+</span>
                )}
              </button>
            </div>
          </>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-gray-500">Rate</label>
              <Input name="rate" placeholder="e.g. ₦8,000/day" value={formik.values.rate}
                onChange={formik.handleChange} onBlur={formik.handleBlur} error={err("rate")} className="h-[46px]" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-gray-500">Capacity</label>
              <Input name="capacity" type="number" placeholder="Max number of people" value={formik.values.capacity}
                onChange={formik.handleChange} onBlur={formik.handleBlur} error={err("capacity")} className="h-[46px]" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-gray-500">Amenities</label>
              <textarea
                name="amenities"
                placeholder="List available amenities"
                value={formik.values.amenities}
                onChange={formik.handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-2xl bg-secondary text-[13px] text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </>
        )}

        {/* ── Step 3 ── */}
        {step === 3 && (
          <>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-gray-500">Availability status</label>
              <div className="flex gap-3">
                {(["Available", "Occupied"] as const).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => formik.setFieldValue("availability", s)}
                    className={cn(
                      "flex-1 h-[46px] rounded-2xl text-[13px] font-medium border transition-colors",
                      formik.values.availability === s
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 bg-secondary text-gray-500"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-gray-500">Available date</label>
              <Input name="availableDate" type="date" value={formik.values.availableDate}
                onChange={formik.handleChange} onBlur={formik.handleBlur} error={err("availableDate")} className="h-[46px]" />
            </div>
          </>
        )}

        {/* Actions */}
        <Separator/>
        <div className="flex gap-3 mt-2">
          <Button type="button" variant="secondary-outline" onClick={step === 1 ? handleClose : () => setStep(s => s - 1)}
            className="flex-1 rounded-full text-[14px]">
            {step === 1 ? "Cancel" : "Back"}
          </Button>
          <Button type="submit" loading={formik.isSubmitting}
            className="flex-1 rounded-full text-[14px] bg-primary text-white hover:bg-primary/90">
            {step === 3 ? "Submit" : "Continue"}
          </Button>
        </div>
      </form>
    </DialogContainer>
  )
}
