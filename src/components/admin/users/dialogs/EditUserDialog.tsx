"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/axios";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { User } from "@/types";

interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  role: "USER" | "CONSULTANT";
  consultancyTypes: any[];
  onSuccess: () => void;
}

export default function EditUserDialog({
  isOpen,
  onClose,
  user,
  role,
  consultancyTypes,
  onSuccess,
}: EditUserDialogProps) {
  const t = useTranslations("admin_users");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CONSULTANT",
    phoneNumber: "",
    professionalDetails: "",
    specialization: "",
    subSpeciality: "",
    experience: "",
    bio: "",
    consultancyType: "",
    perMinuteRate: "",
  });

  const [editSelectedFile, setEditSelectedFile] = useState<File | null>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        role: user.role || (role === "USER" ? "USER" : "CONSULTANT"),
        phoneNumber: (user as any).phoneNumber || "",
        professionalDetails: (user as any).professionalDetails || "",
        specialization: (user as any).specialization || "",
        subSpeciality: (user as any).subSpeciality || "",
        experience: (user as any).experience?.toString() || "",
        bio: (user as any).bio || "",
        consultancyType: (user as any).consultancyType?._id || (user as any).consultancyType || "",
        perMinuteRate: (user as any).perMinuteRate?.toString() || "",
      });
      setEditSelectedFile(null);
    }
  }, [user, isOpen, role]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setIsUpdating(true);
      const payload: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        phoneNumber: formData.phoneNumber,
        professionalDetails: formData.professionalDetails,
        specialization: formData.specialization,
        subSpeciality: formData.subSpeciality,
        experience: formData.experience,
        bio: formData.bio,
        consultancyType: formData.consultancyType,
        perMinuteRate: formData.perMinuteRate ? Number(formData.perMinuteRate) : undefined,
      };
      if (formData.password) {
        payload.password = formData.password;
      }

      const formDataObj = new FormData();
      formDataObj.append("data", JSON.stringify(payload));
      if (editSelectedFile) {
        formDataObj.append("image", editSelectedFile);
      }

      const response = await api.patch(`/user/${user._id}`, formDataObj);

      if (response.data.success) {
        toast.success("User updated successfully");
        setEditSelectedFile(null);
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update user");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto dark:bg-[#1e293b] dark:text-white border-none">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {role === "USER" ? t("edit_customer") : t("edit_consultant")}
          </DialogTitle>
          <DialogDescription className="dark:text-slate-400"></DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEdit} className="space-y-4 mt-2">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t("profile_picture")}</label>
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-400 overflow-hidden cursor-pointer"
                onClick={() => editFileInputRef.current?.click()}
              >
                {editSelectedFile ? (
                  <img src={URL.createObjectURL(editSelectedFile)} alt="Preview" className="w-full h-full object-cover" />
                ) : (user?.image || (user as any)?.avatar) ? (
                  <img src={getImageUrl(user?.image || (user as any)?.avatar)} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Plus className="w-6 h-6" />
                )}
              </div>
              <button 
                type="button" 
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400" 
                onClick={() => editFileInputRef.current?.click()}
              >
                {t("change_image")}
              </button>
              <input 
                type="file" 
                ref={editFileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => setEditSelectedFile(e.target.files?.[0] || null)} 
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {t("full_name")} <span className="text-red-500">*</span>
              </label>
              <Input 
                placeholder="John Doe" 
                className="bg-slate-50 dark:bg-slate-800" 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {t("email_address")} <span className="text-red-500">*</span>
              </label>
              <Input 
                placeholder="john@example.com" 
                type="email" 
                className="bg-slate-50 dark:bg-slate-800" 
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t("password")}</label>
              <Input 
                placeholder={t("leave_blank")} 
                type="password" 
                className="bg-slate-50 dark:bg-slate-800"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t("phone_number")}</label>
              <Input 
                placeholder="+1 (555) 000-0000" 
                className="bg-slate-50 dark:bg-slate-800" 
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
            </div>
            {role === "CONSULTANT" && (
              <>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t("professional_details")}</label>
                  <Input 
                    placeholder="E.g. Certified Accountant" 
                    className="bg-slate-50 dark:bg-slate-800" 
                    value={formData.professionalDetails}
                    onChange={(e) => setFormData({ ...formData, professionalDetails: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t("specialization")}</label>
                  <Input 
                    placeholder="Tax Consulting" 
                    className="bg-slate-50 dark:bg-slate-800" 
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t("sub_speciality")}</label>
                  <Input 
                    placeholder="Corporate Tax" 
                    className="bg-slate-50 dark:bg-slate-800" 
                    value={formData.subSpeciality}
                    onChange={(e) => setFormData({ ...formData, subSpeciality: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t("years_of_experience")}</label>
                  <Input 
                    placeholder="10" 
                    type="number" 
                    className="bg-slate-50 dark:bg-slate-800" 
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {t("consultancy_type")} <span className="text-red-500">*</span>
                  </label>
                  <Select 
                    required
                    value={formData.consultancyType}
                    onValueChange={(value) => setFormData({ ...formData, consultancyType: value })}
                  >
                    <SelectTrigger className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/20 outline-none">
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                      {consultancyTypes.map((type) => (
                        <SelectItem key={type._id} value={type._id}>
                          <span className="capitalize">{type.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Per Minute Rate ($) <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    placeholder="10" 
                    type="number" 
                    step="0.01" 
                    className="bg-slate-50 dark:bg-slate-800" 
                    required
                    value={formData.perMinuteRate}
                    onChange={(e) => setFormData({ ...formData, perMinuteRate: e.target.value })}
                  />
                </div>
              </>
            )}
          </div>
          <div className="space-y-1 pt-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Bio/About</label>
            <textarea 
              className="w-full h-24 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
              placeholder="Brief description about the user..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isUpdating}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold shadow-sm shadow-emerald-500/20 transition-transform active:scale-95 flex items-center gap-2"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
