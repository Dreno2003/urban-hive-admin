import { Icon } from "@/shared/components/ui/icon"
import { RemoveButton } from "./remove-button"
import type { AddSpaceFormValues } from "./add-space-dialog"

const AMENITY_ICONS: Record<string, string> = {
  "Wi-Fi": "wifi2",
  "Air conditioning": "ac2",
  "Washing machine": "washingMachine2",
  "24/hr": "light",
  "Kitchen": "kitchen2",
}

type Props = {
  values: AddSpaceFormValues
  amenities: string[]
  images: (File | null)[]
  imagePreviews: (string | null)[]
  video: File | null
  spaceId: string
  onRemoveImage: (i: number) => void
  onRemoveVideo: () => void
}

function PreviewField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{label}</span>
      <span className="text-[14px] font-medium text-gray-900">{value || "—"}</span>
    </div>
  )
}

export function AddSpaceStep3({
  values, amenities, images, imagePreviews, video, spaceId, onRemoveImage, onRemoveVideo,
}: Props) {
  const filledImages = images.map((f, i) => ({ file: f, preview: imagePreviews[i] })).filter(x => x.file)

  return (
    <div className="flex flex-col gap-5">
      {/* Row: Space ID + Space type */}
      <div className="grid grid-cols-2 gap-4">
        <PreviewField label="Space ID" value={spaceId} />
        <PreviewField label="Space type" value={values.spaceType} />
      </div>

      {/* Row: Space name + Space location */}
      <div className="grid grid-cols-2 gap-4">
        <PreviewField label="Space name" value={values.name} />
        <PreviewField label="Space location" value={values.location} />
      </div>

      {/* Row: Space rate + Rate type */}
      <div className="grid grid-cols-2 gap-4">
        <PreviewField label="Space rate" value={values.amount ? `₦${values.amount}` : ""} />
        <PreviewField label="Space rate type" value={values.rateType} />
      </div>

      {/* Amenities */}
      {amenities.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Space amenities</span>
          <div className="flex flex-wrap gap-2">
            {amenities.map(a => (
              <span key={a} className="flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-medium border border-gray-200 bg-white text-gray-600">
                {/* @ts-ignore */}
                {AMENITY_ICONS[a] && <Icon name={AMENITY_ICONS[a]} className="size-[15px]" />}
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Capacity */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Space capacity</span>
        <div className="flex items-center gap-3">
          <span className="border rounded-full p-1 flex items-center gap-1.5 text-[13px] text-gray-700">
            <Icon name="bed2" size={15} className="text-icon-default" />
            {values.bedrooms} bedroom{values.bedrooms !== 1 ? "s" : ""}
          </span>
          <span className="border rounded-full p-1 flex items-center gap-1.5 text-[13px] text-gray-700">
            <Icon name="bath2" size={15} className="text-icon-default" />
            {values.bathrooms} bathroom{values.bathrooms !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Space description</span>
        <p className="text-[13px] text-gray-700 line-clamp-2">{values.description || "—"}</p>
      </div>

      {/* Images */}
      {filledImages.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Space images</span>
          <div className="flex gap-2 flex-wrap">
            {images.map((file, i) => {
              if (!file || !imagePreviews[i]) return null
              return (
                <div key={i} className="relative size-[60px] shrink-0">
                  <img src={imagePreviews[i]!} alt="" className="w-full h-full object-cover rounded-xl" />
                  <RemoveButton onClick={() => onRemoveImage(i)} ariaLabel="Remove image" />
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Video */}
      {video && (
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Space video</span>
          <div className="relative size-[60px] shrink-0">
            <div className="size-full rounded-xl bg-secondary flex items-center justify-center overflow-hidden">
              <span className="text-[10px] text-gray-500 font-medium text-center px-1 leading-tight">{video.name}</span>
            </div>
            <RemoveButton onClick={onRemoveVideo} ariaLabel="Remove video" />
          </div>
        </div>
      )}
    </div>
  )
}
