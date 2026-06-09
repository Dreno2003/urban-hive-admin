"use client"

import React, { useState } from "react"
import { DialogContainer } from "@/shared/components/dialogs/dialog-container"
import { Button } from "@/shared/components/ui/button"
import { Switch } from "@/shared/components/ui/switch"
import { NotificationCard } from "@/shared/components/ui/notification-card"
import { Textarea } from "@/shared/components/ui/textarea"
import { PasswordInput } from "@/shared/components/ui/password-input"
import { Icon } from "@/shared/components/ui/icon"
import { cn } from "@/shared/lib/utils"
import { Separator } from "@/shared/components/ui/separator"

const REFUND_PRESETS = ["25%", "50%", "75%", "100%"]

interface CancelBookingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm?: (reason: string, refundPercent: number | null, password: string) => Promise<void>
}

export function CancelBookingDialog({ open, onOpenChange, onConfirm }: CancelBookingDialogProps) {
  const [step, setStep] = useState<"details" | "password">("details")
  const [reason, setReason] = useState("")
  const [refundEnabled, setRefundEnabled] = useState(true)
  const [selectedPreset, setSelectedPreset] = useState("100%")
  const [customPercent, setCustomPercent] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const effectivePercent = refundEnabled
    ? selectedPreset === "custom" ? parseInt(customPercent) || 0 : parseInt(selectedPreset)
    : null

  const handleClose = (o: boolean) => {
    if (!o) { setStep("details"); setReason(""); setPassword(""); setSelectedPreset("100%"); setCustomPercent("") }
    onOpenChange(o)
  }

  const handleEnter = async () => {
    setLoading(true)
    try {
      await onConfirm?.(reason, effectivePercent, password)
      handleClose(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DialogContainer
      open={open}
      onOpenChange={handleClose}
      isShowTopSeparator={false}

      contentClassName="sm:max-w-[480px] px-0"
      className="pb-2 p-1"
      showClose={step === "details"}
    >
      {step === "details" ? (
         <div>
      
      
              {/* Icon + heading */}
              <div className="flex flex-col items-center text-center pt-2 pb-5">
                <div className="size-[80px] rounded-full bg-gray-100 flex items-center justify-center mb-1">
                  <Icon name="x2" size={40} className="text-[#6D7280]" />
                </div>
                <h2 className="text-[24px] font-bold t tracking-tight">Cancel booking?</h2>
                <p className="text-sm text-secondary-foreground mt-1">Are you sure you want to cancel this booking?</p>
              </div>
      
              {/* Reason textarea */}
              <div className="mb-4">
                <label className="text-[12px]   mb-1.5 block">Reason for cancelling</label>
                <Textarea
                  placeholder="Enter the reason for cancelling this booking"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="rounded-[18px] p-3 bg-gray-50 border-0 resize-none min-h-[100px] text-[13px] text-gray-700 placeholder:text-gray-400"
                />
              </div>
      
      <Separator className="my-3"/>
              {/* Refund toggle */}
              <div className="flex items-center gap-3 mb-3">
                <Switch checked={refundEnabled} onCheckedChange={setRefundEnabled} />
                <span className="text-[14px] font-semibold ">Refund client's payment</span>
              </div>
              {/* Refund percentage presets */}
              {refundEnabled && (
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  {REFUND_PRESETS.map((p) => (
                    <Button
                      variant={'secondary'}
                      key={p}
                      onClick={() => { setSelectedPreset(p); setCustomPercent("") }}
                      className={cn(
                        "h-[30px] px-2   rounded-full text-[12.5px] font-medium border transition-colors",
                        selectedPreset === p && selectedPreset !== "custom"
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                      )}
                    >
                      {p}
                    </Button>
                  ))}
                  <input
                    type="number"
                    min={1}
                    max={100}
                    placeholder="Enter a custom percentage?"
                    value={customPercent}
                    onFocus={() => setSelectedPreset("custom")}
                    onChange={(e) => { setCustomPercent(e.target.value); setSelectedPreset("custom") }}
                    className={cn(
                      "h-[30px] px-3.5 rounded-full text-[12.5px] border outline-none transition-colors w-[180px] placeholder:text-gray-400",
                      selectedPreset === "custom" ? "border-gray-900" : "border-gray-200"
                    )}
                  />
                </div>
              )}
      
              {/* Notification card */}
              <NotificationCard
                variant="dark"
                type="info"
                title="This will refund to client"
                description={
                  refundEnabled
                    ? `Cancelling this booking will refund the client.`
                    : "Cancelling this booking will not refund the client."
                }
                className="mb-5 !py-3 max-w-full"
              />
      
              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="secondary-outline"
                  onClick={() => onOpenChange(false)}
                  className="h2 rounded-full text-[14px]"
                  disabled={loading}
                >
                  No, don't cancel
                </Button>
                <Button
                  onClick={() => setStep('password')}
                  loading={loading}
                  className=" rounded-full text-[14px] bg-primary text-white hover:bg-primary/90"
                >
                  Yes, cancel bookingiii
                </Button>
              </div>
      
            </div>
      ) : (
        <>
          <button
            onClick={() => setStep("details")}
            className="flex items-center gap-1 text-[13px] font-medium text-gray-600 hover:text-gray-900 mb-6 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full px-3 py-1.5 w-fit"
          >
            <Icon name="chevronLeft" size={14} />
            Back
          </button>

          <h2 className="text-[22px] font-bold text-gray-900 tracking-tight mb-1">Enter your password</h2>
          <p className="text-sm text-gray-500 mb-6">Enter your password to complete this action</p>

          <div className="mb-6">
            <label className="text-[12px] text-gray-500 font-medium mb-1.5 block">Password</label>
            <PasswordInput
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isShowEndIcon
              className="rounded-full bg-gray-50 border-0 h-[48px] text-[14px]"
            />
          </div>

          <Button
            onClick={handleEnter}
            loading={loading}
            disabled={!password}
            className="w-full h-12 rounded-full text-[14px] bg-primary text-white hover:bg-primary/90"
          >
            Enter
          </Button>
        </>
      )}
    </DialogContainer>
  )
}












