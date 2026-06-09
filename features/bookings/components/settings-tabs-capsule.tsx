"use client";

import React from "react";
import { Icon } from "@/shared/components/ui/icon";
import type { Dictionary } from "@/i18n/get-dictionary";

export type TabType = "profile" | "bookings" | "notifications";

interface SettingsTabsCapsuleProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  dict: Dictionary;
}

export function SettingsTabsCapsule({ activeTab, onTabChange, dict }: SettingsTabsCapsuleProps) {
  const settingsDict = (dict as any).settings || {};

  return (
    <div className="flex bg-secondary rounded-full p-1 w-fit 50">
      <button
        onClick={() => onTabChange("profile")}
        className={`rounded-full px-3 md:px-4  py-2.5 text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${activeTab === "profile"
          ? "bg-white text-gray-900 "
          : "text-gray-500 hover:text-gray-700"
          }`}
      >
        <Icon
          name="user2"
          size={16}
          className={activeTab === "profile" ? "text-primary" : "text-gray-400"}
        />
        {settingsDict.profileTab || "Profile"}
      </button>
      <button
        onClick={() => onTabChange("bookings")}
        className={`rounded-full px-3 md:px-4 py-2.5 text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${activeTab === "bookings"
          ? "bg-white text-gray-900 "
          : "text-gray-500 hover:text-gray-700"
          }`}
      >
        <Icon
          name="calendar"
          size={16}
          className={activeTab === "bookings" ? "text-primary" : "text-gray-400"}
        />
        {settingsDict.bookingsTab || "Bookings"}
      </button>
      <button
        onClick={() => onTabChange("notifications")}
        className={`rounded-full px-3 md:px-4 py-2.5 text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${activeTab === "notifications"
          ? "bg-white text-gray-900 "
          : "text-gray-500 hover:text-gray-700"
          }`}
      >
        <Icon
          name="bell3"
          size={16}
          className={activeTab === "notifications" ? "text-primary" : "text-gray-400"}
        />
        {settingsDict.notificationsTab || "Notifications"}
      </button>
    </div>
  );
}
