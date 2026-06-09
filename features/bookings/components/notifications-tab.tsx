"use client";

import React from "react";
import { Separator } from "@/shared/components/ui/separator";
import type { Dictionary } from "@/i18n/get-dictionary";
import { useNotificationSettings, useUpdateNotificationSettings } from "../hooks/use-settings";
import { toast } from "sonner";

interface NotificationsTabProps {
  dict: Dictionary;
}

export function NotificationsTab({ dict }: NotificationsTabProps) {
  const { data: settings, isLoading } = useNotificationSettings();
  const { mutate: updateSettings } = useUpdateNotificationSettings();

  const settingsDict = (dict as any).settings || {};

  const handleToggle = (key: "bookingUpdates" | "propertyAlerts" | "promotions") => {
    if (!settings) return;
    const newValue = !settings[key];
    updateSettings(
      { [key]: newValue },
      {
        onError: (err: any) => {
          toast.error(err.message || "Failed to update notification settings");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6 bg-white">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start justify-between gap-4 p-3 animate-pulse">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-100 rounded w-1/4" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
              </div>
              <div className="h-6.5 w-14 bg-gray-100 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const bookingUpdatesValue = settings?.bookingUpdates ?? true;
  const propertyAlertsValue = settings?.propertyAlerts ?? true;
  const promotionsValue = settings?.promotions ?? false;

  return (
    <div className="space-y-6 bg-white max-w-2xl">
      <div className="space-y-4">
        {/* Booking Updates Toggle */}
        <div className="flex items-start justify-between gap-4 p-3 rounded-2xl transition-colors">
          <div className="space-y-1">
            <h4 className="text-foreground font-medium text-sm md:text-base">
              {settingsDict.bookingUpdates || "Booking Updates"}
            </h4>
            <p className="text-xs md:text-sm text-secondary-foreground max-w-[570px]">
              {settingsDict.bookingUpdatesDesc ||
                "Get notified about activity related to your stays, office spaces, and boardroom reservations."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleToggle("bookingUpdates")}
            className={`relative inline-flex h-6.5 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0 ${bookingUpdatesValue ? "bg-[#00C950]" : "bg-secondary"
              }`}
          >
            <span
              className={`pointer-events-none mt-[2px] inline-block h-5 w-[34px] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${bookingUpdatesValue ? "translate-x-4.5" : "translate-x-0"
                }`}
            />
          </button>
        </div>

        <Separator className="" />

        {/* Property Alerts Toggle */}
        <div className="flex items-start justify-between gap-4 p-3 rounded-2xl transition-colors">
          <div className="space-y-1">
            <h4 className="text-foreground font-medium text-sm md:text-base">
              {settingsDict.propertyAlerts || "Property Alerts"}
            </h4>
            <p className="text-xs md:text-sm text-secondary-foreground max-w-[570px]">
              {settingsDict.propertyAlertsDesc || "Get updates about listings you care about."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleToggle("propertyAlerts")}
            className={`relative inline-flex h-6.5 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0 ${propertyAlertsValue ? "bg-[#00C950]" : "bg-secondary"
              }`}
          >
            <span
              className={`pointer-events-none mt-[2px] inline-block h-5 w-[34px] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${propertyAlertsValue ? "translate-x-4.5" : "translate-x-0"
                }`}
            />
          </button>
        </div>

        <Separator className="" />

        {/* Promotions Toggle */}
        <div className="flex items-start justify-between gap-4 p-3 rounded-2xl transition-colors">
          <div className="space-y-1">
            <h4 className="text-foreground font-medium text-sm md:text-base">
              {settingsDict.promotions || "Promotions"}
            </h4>
            <p className="text-xs md:text-sm text-secondary-foreground max-w-[570px]">
              {settingsDict.promotionsDesc || "Receive occasional offers and recommendations."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleToggle("promotions")}
            className={`relative inline-flex h-6.5 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0 ${promotionsValue ? "bg-[#00C950]" : "bg-secondary"
              }`}
          >
            <span
              className={`pointer-events-none mt-[2px] inline-block h-5 w-[34px] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${promotionsValue ? "translate-x-4.5" : "translate-x-0"
                }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
