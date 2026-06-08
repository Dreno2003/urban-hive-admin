"use client";
import { Icon } from "@/shared/components/ui/icon";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

export const UserProfileDropdownMenu = () => {
  const profile: any = null; // Stubbed since features/settings is removed

  const getInitials = () => {
    const first = profile?.firstName ? profile.firstName.charAt(0) : "F";
    const last = profile?.lastName ? profile.lastName.charAt(0) : "O";
    return (first + last).toUpperCase();
  };

  const firstName = profile?.firstName || "Frieda";

  return (
    <div>
      {/* Profile Dropdown */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"secondary"} className=" w-fit px-2 py-7">
            {/* // className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-[#F5F5F7] border border-gray-100 transition-all hover:bg-gray-100 cursor-pointer shadow-sm"> */}
            <div className="h-8 w-8 rounded-full bg-[#F57200] flex items-center justify-center text-white text-[11px] font-bold ring-2 ring-orange-400 overflow-hidden shrink-0">
              {profile?.avatar ? (
                <img src={profile.avatar} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                getInitials()
              )}
            </div>
            <span className="text-sm font-medium text-gray-900">{firstName}</span>
            <Icon
              name="chevronDown"
              size={20}
              className="text-gray-400 ml-0.5"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={12}
          className="w-[280px]   border border-gray-100 p-2 shadow6 rounded-[24px]   animate-in fade-in zooms-in-95 duration-200"
        >
          <div>
            <Link href="/favorites" className="flex items-center gap-4 p-3 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors group">
              <div className="h-10 w-10 rounded-full bg-[#F2F2F7] flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
                <Icon name="heart2" size={20} className="text-[#1A1A1A]" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-medium text-gray-900 leading-tight">
                  Favorites
                </span>
                <span className="text-[13px] text-gray-500 leading-tight">
                  All your favorited items
                </span>
              </div>
            </Link>

            <div className="h-px w-full bg-gray-100" />

            <Link href="/settings" className="flex items-center gap-4 p-3 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors mt-1 group">
              <div className="h-10 w-10 rounded-full bg-[#F2F2F7] flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
                <Icon name="settings2" size={20} className="text-foreground" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-medium text-gray-900 leading-tight">
                  Settings
                </span>
                <span className="text-[13px] text-gray-500 leading-tight">
                  Manage your account
                </span>
              </div>
            </Link>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
