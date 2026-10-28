"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn, getImageUrl } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { User } from "@/types";

interface ViewUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function ViewUserDialog({ isOpen, onClose, user }: ViewUserDialogProps) {
  const t = useTranslations("admin_users");

  const getInitials = (name: string) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "??";
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md dark:bg-[#1e293b] dark:text-white border-none">
        <DialogHeader>
          <DialogTitle>{t("user_profile")}</DialogTitle>
        </DialogHeader>
        {user && (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              {user.image || (user as any).avatar || (user as any).profilePic || (user as any).profileImage ? (
                <img
                  src={getImageUrl(user.image || (user as any).avatar || (user as any).profilePic || (user as any).profileImage)}
                  alt={user.name}
                  className="h-16 w-16 rounded-full object-cover border border-slate-100"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold border border-blue-100">
                  {getInitials(user.name)}
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{user.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">{t("role")}</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{user.role}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">{t("status")}</p>
                <span className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wide",
                    user.status.toLowerCase() === "active" && "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
                    user.status.toLowerCase() === "pending" && "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
                    user.status.toLowerCase() === "suspended" && "bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400"
                  )}>
                    {t(user.status.toLowerCase() as any) || user.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">{t("user_id")}</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{user._id}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">{t("joined_date")}</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <button 
            onClick={onClose}
            className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors w-full"
          >
            {t("close")}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
