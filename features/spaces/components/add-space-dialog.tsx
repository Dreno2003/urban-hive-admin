"use client"

import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { DialogContainer } from "@/shared/components/dialogs/dialog-container"
import { Button } from "@/shared/components/ui/button"
import { Separator } from "@/shared/components/ui/separator"
import { useCreateSpace } from "../hooks/use-spaces"
import { AddSpaceStep1 } from "./add-space-step1"
import { AddSpaceStep2 } from "./add-space-step2"
import { AddSpaceStep3 } from "./add-space-step3"
import type { SpaceType } from "../types"

export type AddSpaceFormValues = {
  spaceType: string
  name: string
  location: string
  description: string
  bedrooms: number
  bathrooms: number
  rateType: string
  amount: string
  rules: string
}

const step1Schema = Yup.object({
  spaceType: Yup.string().required("Space type is required"),
  name: Yup.string().required("Space name is required"),
  location: Yup.string().required("Space location is required"),
  description: Yup.string().required("Space description is required"),
})

const step2Schema = Yup.object({
  rateType: Yup.string().required("Rate type is required"),
  amount: Yup.string().required("Amount is required"),
})

const SCHEMAS = [step1Schema, step2Schema, Yup.object()]

const INITIAL_VALUES: AddSpaceFormValues = {
  spaceType: "",
  name: "",
  location: "",
  description: "",
  bedrooms: 1,
  bathrooms: 1,
  rateType: "",
  amount: "",
  rules: "",
}

export type AddSpaceDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddSpaceDialog({ open, onOpenChange }: AddSpaceDialogProps) {
  const [step, setStep] = useState(1)
  const [images, setImages] = useState<(File | null)[]>([null, null, null, null, null])
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([null, null, null, null, null])
  const [video, setVideo] = useState<File | null>(null)
  const [amenities, setAmenities] = useState<string[]>([])
  const [typeOpen, setTypeOpen] = useState(false)
  const [rateTypeOpen, setRateTypeOpen] = useState(false)
  const [spaceId] = useState(() => String(Math.floor(Math.random() * 90000) + 10000).padStart(5, "0"))

  const { mutateAsync: createSpace } = useCreateSpace()

  const formik = useFormik<AddSpaceFormValues>({
    initialValues: INITIAL_VALUES,
    validationSchema: SCHEMAS[step - 1],
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      if (step < 3) {
        setStep(s => s + 1)
        formik.setErrors({})
      } else {
        await createSpace({
          spaceType: values.spaceType as SpaceType,
          name: values.name,
          location: values.location,
          description: values.description,
          bedrooms: values.bedrooms,
          bathrooms: values.bathrooms,
          rateType: values.rateType,
          amount: values.amount,
          amenities,
          rules: values.rules,
          images,
          video,
        })
        handleClose()
      }
    },
  })

  const handleClose = () => {
    formik.resetForm()
    setStep(1)
    setImages([null, null, null, null, null])
    setImagePreviews([null, null, null, null, null])
    setVideo(null)
    setAmenities([])
    onOpenChange(false)
  }

  const handleImageChange = (i: number, file: File | null) => {
    setImages(prev => { const n = [...prev]; n[i] = file; return n })
    setImagePreviews(prev => {
      const n = [...prev]
      n[i] = file ? URL.createObjectURL(file) : null
      return n
    })
  }

  return (
    <DialogContainer
      open={open}
      onOpenChange={handleClose}
      isShowTopSeparator={false}
      contentClassName="max-h-[90vh] w-[33rem] px-0s flex flex-col"
      dialogTitle={
        <div>
          <span className="text-[24px] font-bold">Add space</span>
          <p className="text-[13px] text-secondary-foreground font-normal mt-0.5">{step} of 3 steps</p>
        </div>
      }
    >
      <Separator className="my-4" />
      <form
        onSubmit={formik.handleSubmit}
        noValidate
        className="custom-scrollbar flex flex-col gap-4 pb-2 overflow-y-auto max-h-[65vh] px-1.5"
      >
        {step === 1 && (
          <AddSpaceStep1
            formik={formik}
            images={images}
            imagePreviews={imagePreviews}
            video={video}
            onImageChange={handleImageChange}
            onVideoChange={setVideo}
            typeOpen={typeOpen}
            onTypeOpenChange={setTypeOpen}
          />
        )}

        {step === 2 && (
          <AddSpaceStep2
            formik={formik}
            amenities={amenities}
            onAmenitiesChange={setAmenities}
            rateTypeOpen={rateTypeOpen}
            onRateTypeOpenChange={setRateTypeOpen}
          />
        )}

        {step === 3 && (
          <AddSpaceStep3
            values={formik.values}
            amenities={amenities}
            images={images}
            imagePreviews={imagePreviews}
            video={video}
            spaceId={spaceId}
            onRemoveImage={(i) => handleImageChange(i, null)}
            onRemoveVideo={() => setVideo(null)}
          />
        )}

        <Separator />
        <div className="flex gap-3 mt-1">
          <Button type="button" variant="secondary-outline"
            onClick={step === 1 ? handleClose : () => setStep(s => s - 1)}
            className="flex-1 rounded-full text-[14px]">
            {step === 1 ? "Cancel" : "Back"}
          </Button>
          <Button type="submit" loading={formik.isSubmitting}
            className="flex-1 rounded-full text-[14px] bg-primary text-white hover:bg-primary/90">
            {step === 3 ? "Add space" : "Continue"}
          </Button>
        </div>
      </form>
    </DialogContainer>
  )
}
