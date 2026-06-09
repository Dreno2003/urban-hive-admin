import React, { useState } from "react";
import { DialogContainer } from "@/shared/components/dialogs/dialog-container";
import { DialogTitle } from "@/shared/components/ui/dialog";
import { Separator } from "@/shared/components/ui/separator";
import { Button } from "@/shared/components/ui/button";
import { formatDate } from "@/shared/helper/format-date";
import { formatCurrency } from "@/shared/helper/format-currency";
import { PaymentBadge } from "./payment-status-badge";
import type { UserBooking } from "../types";
import { ExternalLink, Clock } from "lucide-react";
import { ReportSpaceDialog } from "@/features/space/components/report-space-dialog";
import type { Dictionary } from "@/i18n/get-dictionary";
import { CancelBookingDialog } from "./cancel-booking-dialog";

interface BookingDetailDialogProps {
  booking: UserBooking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dict: Dictionary;
}

export function BookingDetailDialog({
  booking,
  open,
  onOpenChange,
  dict,
}: BookingDetailDialogProps) {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const settingsDict = (dict as any).settings || {};

  if (!booking) return null;

  return (
    <>
      <DialogContainer open={open} onOpenChange={onOpenChange} className="!py-6">
        <DialogTitle className="text-xl font-bold text-foreground mb-3">
          {settingsDict.bookingDetailsTitle || "Booking details"}
        </DialogTitle>

        <Separator className="mb-4 bg-gray-50" />

        <div className="flex flex-col gap-4">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-3 md:gap-5 ">
            <div>
              <p className="text-xs text-gray-500 mb-1">{settingsDict.spaceLabel || "Space"}</p>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-body-base font-medium text-foreground underline underline-offset-2 decoration-gray-400">
                  {booking.title}
                </span>
                <ExternalLink className="w-3.5 shrink-0 h-3.5 text-gray-400" />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">{settingsDict.spaceTypeLabel || "Space type"}</p>
              <p className="text-body-base font-medium text-foreground">
                {booking.title.toLowerCase().includes("boardroom") ? (settingsDict.typeBoardroom || "Boardroom") : (settingsDict.typeWorkspace || "Workspace")}
              </p>
            </div>
          </div>

          <Separator className="bg-gray-50" />

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">{settingsDict.checkInLabel || "Check in"}</p>
              <p className="text-body-base font-medium text-foreground">{formatDate(booking.checkIn)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">{settingsDict.checkOutLabel || "Check out"}</p>
              <p className="text-body-base font-medium text-foreground">{formatDate(booking.checkOut)}</p>
            </div>
          </div>

          <Separator className="bg-gray-50" />

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">{settingsDict.durationLabel || "Duration"}</p>
              <p className="text-body-base font-medium text-foreground">2 hrs/ day</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">{settingsDict.amountPaidLabel || "Amount paid"}</p>
              <div className="flex items-center gap-2">
                <span className="text-body-base font-medium text-foreground">
                  {formatCurrency(booking.price, booking.currency)}
                </span>
                <PaymentBadge status={booking.status} dict={dict} />
              </div>
            </div>
          </div>

          <Separator className="bg-gray-50" />

          {/* Row 4 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">{settingsDict.cancellationPeriodLabel || "Cancellation period"}</p>
              <div className="flex items-center gap-2">
                <span className="text-body-base font-medium text-foreground">1 hour</span>
                <span className="inline-flex items-center gap-1 h-[24px] px-2 rounded-full bg-[#FFF9CC] text-[#EAB308] text-xs font-medium">
                  <Clock className="w-3 h-3" />
                  58:56
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">{settingsDict.datePaidLabel || "Date paid"}</p>
              <p className="text-body-base font-medium text-foreground">{formatDate(booking.checkIn)}</p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={() => { onOpenChange(false); setIsReportOpen(true); }}
            className="text-primary font-bold text-sm hover:underline cursor-pointer"
          >
            {settingsDict.reportProperty || "Report this property"}
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <Button variant="secondary-outline" className="text-body-sm  w-full">
            {settingsDict.downloadInvoice || "Download invoice"}
          </Button>
          <Button
            className="w-full text-body-sm text-white"
            onClick={() => {
              onOpenChange(false);
              setIsCancelOpen(true);
            }}
          >
            {settingsDict.cancelBooking || "Cancel booking"}
          </Button>
        </div>
      </DialogContainer>

      <ReportSpaceDialog
        open={isReportOpen}
        onOpenChange={setIsReportOpen}
        dict={dict}
        spaceId={booking.id}
      />

      <CancelBookingDialog
        open={isCancelOpen}
        onOpenChange={setIsCancelOpen}
        dict={dict}
        bookingId={booking.id}
      />
    </>
  );
}
