import { Icon } from "@/shared/components/ui/icon";
import type { UserBooking } from "../types";
import type { Dictionary } from "@/i18n/get-dictionary";

interface PaymentBadgeProps {
  status: UserBooking["status"];
  dict?: Dictionary;
}

export function PaymentBadge({ status, dict }: PaymentBadgeProps) {
  const isPaid = status === "confirmed" || status === "completed";
  const settingsDict = dict ? (dict as any).settings || {} : {};

  if (isPaid) {
    return (
      <span className="inline-flex items-center justify-center h-[28px] px-3 gap-1.5 rounded-full bg-[#DCFCE7] text-[#00C950] text-xs font-medium whitespace-nowrap min-w-[64px]">
          <Icon name="check" size={12} className="" />
        {settingsDict.statusPaid || "Paid"}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center justify-center h-[28px] px-3 gap-1.5 rounded-full bg-[#FFCECE] text-[#FF3D3D] text-xs font-medium whitespace-nowrap min-w-[64px]">
          <Icon name="x" size={12} className="" />
        {settingsDict.statusCancelled || "Cancelled"}
      </span>
  );
}
