"use client";

import React, { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { User } from "@/types";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSuccess: () => void;
}

export default function DeleteConfirmDialog({
  isOpen,
  onClose,
  user,
  onSuccess,
}: DeleteConfirmDialogProps) {
  const t = useTranslations("admin_users");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!user) return;
    try {
      setIsDeleting(true);
      const response = await api.delete(`/user/${user._id}`);
      if (response.data.success) {
        toast.success("User deleted successfully");
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            {t("confirm_deletion")}
          </DialogTitle>
          <DialogDescription className="pt-3">
            {t("delete_user_confirm")} <strong>{user?.name}</strong>? This action cannot be undone and will permanently remove this user from the system.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 mt-4">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
          >
            {t("cancel")}
          </button>
          <button 
            type="button"
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-bold shadow-sm shadow-red-500/20 transition-all active:scale-[0.98] flex items-center gap-2 disabled:opacity-70"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("deleting")}
              </>
            ) : (
              t("delete_user")
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
