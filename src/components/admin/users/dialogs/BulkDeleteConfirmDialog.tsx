"use client";

import React, { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface BulkDeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: string[];
  onSuccess: () => void;
}

export default function BulkDeleteConfirmDialog({
  isOpen,
  onClose,
  selectedIds,
  onSuccess,
}: BulkDeleteConfirmDialogProps) {
  const t = useTranslations("admin_users");
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.length === 0) return;
    try {
      setIsBulkDeleting(true);
      await Promise.all(selectedIds.map((id) => api.delete(`/user/${id}`)));
      toast.success(`${selectedIds.length} users deleted successfully`);
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error("Failed to delete some or all selected users");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            {t("confirm_bulk_deletion")}
          </DialogTitle>
          <DialogDescription className="pt-3">
            {t("delete_users_confirm", { count: selectedIds.length })}
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
            onClick={handleBulkDeleteConfirm}
            disabled={isBulkDeleting}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-bold shadow-sm shadow-red-500/20 transition-all active:scale-[0.98] flex items-center gap-2 disabled:opacity-70"
          >
            {isBulkDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("deleting")}
              </>
            ) : (
              t("delete_selected", { count: selectedIds.length })
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
