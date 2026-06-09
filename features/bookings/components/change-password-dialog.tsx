"use client";

import React from "react";
import { DialogContainer } from "@/shared/components/dialogs/dialog-container";
import { Button } from "@/shared/components/ui/button";
import { Icon } from "@/shared/components/ui/icon";
import { cn } from "@/shared/lib/utils";
import type { Dictionary } from "@/i18n/get-dictionary";
import { useProfile, useSendPasswordResetEmail } from "../hooks/use-settings";
import { toast } from "sonner";
import { Separator } from "@/shared/components/ui/separator";

export interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dict: Dictionary;
  className?: string;
}

const COOLDOWN_KEY = "urban_hive_reset_password_cooldown_expiry";
const COOLDOWN_DURATION_MS = 60000;

export function ChangePasswordDialog({
  open,
  onOpenChange,
  dict,
  className,
}: ChangePasswordDialogProps) {
  const [state, setState] = React.useState<"sending" | "success" | "error">("sending");
  const [cooldownSeconds, setCooldownSeconds] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState("");

  const { data: profile } = useProfile();
  const { mutateAsync: sendResetEmail, isPending } = useSendPasswordResetEmail();

  const settingsDict = (dict as any).settings || {};

  // Cooldown countdown timer effect
  React.useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const interval = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownSeconds]);

  // Main logic on dialog open / email address change
  React.useEffect(() => {
    if (!open) return;

    const expiryStr = localStorage.getItem(COOLDOWN_KEY);
    const expiry = expiryStr ? parseInt(expiryStr, 10) : 0;
    const now = Date.now();

    if (expiry > now) {
      const remaining = Math.ceil((expiry - now) / 1000);
      setCooldownSeconds(remaining);
      setState("success");
      return;
    }

    // Cooldown not active: reset state and trigger sending state
    setState("sending");
    setErrorMessage("");
    setCooldownSeconds(0);

    const email = profile?.email || "friedaodagboyi@gmail.com";

    // Small delay to prevent network request spamming from accidental clicks
    const delayTimeout = setTimeout(async () => {
      try {
        await sendResetEmail(email);
        const newExpiry = Date.now() + COOLDOWN_DURATION_MS;
        localStorage.setItem(COOLDOWN_KEY, String(newExpiry));
        setCooldownSeconds(60);
        setState("success");
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to send password reset link");
        setState("error");
      }
    }, 1000);

    return () => {
      clearTimeout(delayTimeout);
    };
  }, [open, profile?.email, sendResetEmail]);

  // Resend handler
  const handleResend = async () => {
    const email = profile?.email || "friedaodagboyi@gmail.com";
    try {
      await sendResetEmail(email);
      const newExpiry = Date.now() + COOLDOWN_DURATION_MS;
      localStorage.setItem(COOLDOWN_KEY, String(newExpiry));
      setCooldownSeconds(60);
      toast.success("Password reset email sent successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to resend email");
    }
  };

  return (
    <DialogContainer
      open={open}
      onOpenChange={onOpenChange}
      contentClassName="!max-w-xl "
      className={cn("px-4 py-4 w-full  mx-auto", className)}
      showClose={state !== "sending"}
    >
      <div className="flex flex-col items-center justify-center text-center">
        {/* ─── SENDING STATE ─────────────────────────────────────── */}
        {/* {state === "sending" && (
          <div className="space-y-6 w-full py-4 animate-in fade-in duration-200">
            <div className="relative size-16 md:size-20 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Icon name="loader" size={28} className="text-primary animate-spin" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                {settingsDict.sendingResetLink || "Sending password reset link..."}
              </h2>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                {settingsDict.preparingResetLink || "We are preparing to send a password reset link to your email."}
              </p>
            </div>
            <div className="pt-2">
              <Button
                variant="secondary"
                onClick={() => onOpenChange(false)}
                className="w-full max-w-[280px] rounded-full h-[48px] font-semibold text-foreground bg-gray-50 hover:bg-gray-100 border border-gray-200"
              >
                {settingsDict.cancel || "Cancel"}
              </Button>
            </div>
          </div>
        )} */}

        {/* ─── SUCCESS STATE ─────────────────────────────────────── */}
        {/* {state === "success" && ( */}
        <div className="space-y-4 w-full animate-in fade-in duration-300">
          <div className="relative size-[83px]  bg-secondary rounded-full flex items-center justify-center mx-auto">
            <Icon name="mail2" size={46} className="text-primdary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              {settingsDict.checkEmailTitle || "Check your email"}
            </h2>
            <p className="text-body-base leading-relaxed text-secondary-foreground mx-auto">
              {settingsDict.checkEmailDesc || "Check your email, a password reset link has been sent to your email."}
            </p>
          </div>
          <Separator />
          <div className="">
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full  rounded-full bg-primary hover:bg-primary/95 text-white font-semibold h-[48px]"
            >
              {settingsDict.okay || "Okay"}
            </Button>

            {/* Cooldown Footer */}
            <div className="flex items-center justify-center min-h-12 mt-2">
              {cooldownSeconds > 0 ? (
                <span className="text-xs text-gray-500 font-medium select-none">
                  {settingsDict.resendEmailIn
                    ? settingsDict.resendEmailIn.replace("{seconds}", String(cooldownSeconds))
                    : `Resend email in ${cooldownSeconds}s`}
                </span>
              ) : (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={handleResend}
                  className="text-xs text-primary hover:underline font-semibold transition-all disabled:opacity-50 select-none cursor-pointer"
                >
                  {isPending
                    ? (settingsDict.resending || "Resending...")
                    : (settingsDict.resendEmail || "Resend email")}
                </button>
              )}
            </div>
          </div>
        </div>
        {/* )} */}

        {/* ─── ERROR STATE ───────────────────────────────────────── */}
        {state === "error" && (
          <div className="space-y-6 w-full py-4 animate-in fade-in duration-200">
            <div className="relative size-16 md:size-20 bg-red-50 rounded-full flex items-center justify-center mx-auto border border-red-100">
              <Icon name="alertCircle" size={32} className="text-red-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                {settingsDict.failedToSendResetLink || "Failed to send link"}
              </h2>
              <p className="text-sm text-red-500 max-w-xs mx-auto">
                {errorMessage}
              </p>
            </div>
            <div className="flex flex-col gap-3 pt-2 max-w-[280px] mx-auto w-full">
              <Button
                onClick={() => {
                  setState("sending");
                  const email = profile?.email || "friedaodagboyi@gmail.com";
                  sendResetEmail(email)
                    .then(() => {
                      const newExpiry = Date.now() + COOLDOWN_DURATION_MS;
                      localStorage.setItem(COOLDOWN_KEY, String(newExpiry));
                      setCooldownSeconds(60);
                      setState("success");
                    })
                    .catch((err: any) => {
                      setErrorMessage(err.message || "Failed to send password reset link");
                      setState("error");
                    });
                }}
                className="w-full rounded-full bg-primary hover:bg-primary/95 text-white font-semibold h-[48px]"
              >
                {settingsDict.retry || "Retry"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => onOpenChange(false)}
                className="w-full rounded-full h-[48px] font-semibold text-foreground bg-gray-50 hover:bg-gray-100 border border-gray-200"
              >
                {settingsDict.cancel || "Cancel"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </DialogContainer>
  );
}
