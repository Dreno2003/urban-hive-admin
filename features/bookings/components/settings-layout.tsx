"use client";

import React, { useState, useEffect } from "react";
import { NavigationHeader } from "@/shared/components/headers/navigation-header";
import { BackButton } from "@/shared/components/buttons/back-button";
import { Separator } from "@/shared/components/ui/separator";
import type { Dictionary } from "@/i18n/get-dictionary";
import { ChangePasswordDialog } from "./change-password-dialog";
import { ProfileTab } from "./profile-tab";
import { BookingsTab } from "./bookings-tab";
import { NotificationsTab } from "./notifications-tab";
import { SettingsTabsCapsule, type TabType } from "./settings-tabs-capsule";
import { useSearchParams } from "next/navigation";

interface SettingsLayoutProps {
  dict: Dictionary;
}

export function SettingsLayout({ dict }: SettingsLayoutProps) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as TabType;
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  useEffect(() => {
    if (tabParam === "bookings" || tabParam === "notifications" || tabParam === "profile") {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Settings translations
  const settingsDict = (dict as any).settings || {};

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Navigation Header */}
      <NavigationHeader containerWidthVariants="md" dict={dict} isShowCategoryTab={false} />

      <main className="flex-1 py-6 md:py-10">
        {/* Back button */}
        <div className="mb-6 container-wrapper">
          <BackButton className="px-0 py-0  leading-tight" variant="link" label={settingsDict.back || "Back"} />
        </div>
        <div className="container-wrapper space-y-6 md:space-y-10 ">

          {/* Settings title */}
          <div>

          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight ">
            {settingsDict.title || "Settings"}
          </h1>

          {/* Tabs capsule */}
          <SettingsTabsCapsule activeTab={activeTab} onTabChange={setActiveTab} dict={dict} />


          <Separator />
          {/* Tabs Content */}
          <div className="animate-in fade-in duration-300">
            {/* ── PROFILE TAB ──────────────────────────────────── */}
            {activeTab === "profile" && (
              <ProfileTab
              dict={dict}
              onChangePasswordClick={() => setIsPasswordDialogOpen(true)}
              />
            )}

            {/* ── BOOKINGS TAB ─────────────────────────────────── */}
            {activeTab === "bookings" && (
              <BookingsTab dict={dict} />
            )}
            {/* <Separator /> */}

            {/* ── NOTIFICATIONS TAB ────────────────────────────── */}
            {activeTab === "notifications" && (
              <NotificationsTab dict={dict} />
            )}
          </div>
        </div>
      </main>

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
        dict={dict}
      />
    </div>
  );
}