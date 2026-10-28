"use client";

import React, { useState, useRef } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface AddConsultantDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  consultancyTypes: any[];
  onSuccess: () => void;
}

const initialFormData = {
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
};

export default function AddConsultantDialog({
  isOpen,
  onOpenChange,
  consultancyTypes,
  onSuccess,
}: AddConsultantDialogProps) {
  const t = useTranslations("admin_users");

  const [formData, setFormData] = useState(initialFormData);
  const [addSelectedFile, setAddSelectedFile] = useState<File | null>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);

  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);
  const [otp, setOtp] = useState("");

  const resetForm = () => {
    setFormData(initialFormData);
    setAddSelectedFile(null);
    setOtp("");
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      resetForm();
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSigningUp(true);
      const payload: any = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
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

      const formDataObj = new FormData();
      formDataObj.append("data", JSON.stringify(payload));
      if (addSelectedFile) {
        formDataObj.append("image", addSelectedFile);
      }

      const response = await api.post("/user", formDataObj);

      if (response.data.success) {
        toast.success("Consultant created");
        handleOpenChange(false);
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to sign up consultant");
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsVerifying(true);
      const response = await api.post("/auth/verify-email", {
        email: formData.email,
        oneTimeCode: Number(otp),
      });

      if (response.data.success) {
        toast.success("Email verified successfully! Consultant added.");
        setIsOtpOpen(false);
        setOtp("");
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP or verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setResendingOtp(true);
      const response = await api.post("/auth/resend-otp", {
        email: formData.email,
      });
      if (response.data.success) {
        toast.success("OTP resent successfully to your email.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendingOtp(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <button className="bg-[#FE6D2C] hover:bg-[#E85D20] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-[#FE6D2C]/20 transition-transform active:scale-95">
            {t("add_consultant")}
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto dark:bg-[#1e293b] dark:text-white border-none">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{t("add_consultant")}</DialogTitle>
            <DialogDescription className="dark:text-slate-400"></DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSignup} className="space-y-4 mt-2">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t("profile_picture")}</label>
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-400 overflow-hidden cursor-pointer"
                  onClick={() => addFileInputRef.current?.click()}
                >
                  {addSelectedFile ? (
                    <img src={URL.createObjectURL(addSelectedFile)} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Plus className="w-6 h-6" />
                  )}
                </div>
                <button 
                  type="button" 
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400" 
                  onClick={() => addFileInputRef.current?.click()}
                >
                  {t("upload_image")}
                </button>
                <input 
                  type="file" 
                  ref={addFileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => setAddSelectedFile(e.target.files?.[0] || null)} 
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
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {t("password")} <span className="text-red-500">*</span>
                </label>
                <Input 
                  placeholder="••••••••" 
                  type="password" 
                  className="bg-slate-50 dark:bg-slate-800" 
                  required
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
                  {t("per_minute_rate")} <span className="text-red-500">*</span>
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
            </div>
            <div className="space-y-1 pt-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t("bio_about")}</label>
              <textarea 
                className="w-full h-24 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
                placeholder="Brief description about the consultant..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => handleOpenChange(false)}
                className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                {t("cancel")}
              </button>
              <button 
                type="submit"
                disabled={isSigningUp}
                className="bg-[#FE6D2C] hover:bg-[#E85D20] text-white px-6 py-2 rounded-xl font-bold shadow-sm shadow-[#FE6D2C]/20 transition-transform active:scale-95 flex items-center gap-2"
              >
                {isSigningUp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("signing_up")}
                  </>
                ) : (
                  t("signup_consultant")
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* OTP Verification Dialog */}
      <Dialog open={isOtpOpen} onOpenChange={setIsOtpOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{t("email_verification")}</DialogTitle>
            <DialogDescription>
              We&apos;ve sent an OTP to <span className="font-bold text-slate-900">{formData.email}</span>. Please enter it below to verify the consultant account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleVerifyOtp} className="space-y-6 py-4">
            <div className="space-y-2 text-center">
              <Input
                type="text"
                maxLength={6}
                placeholder="000000"
                className="text-center text-3xl font-black tracking-[1em] h-16 bg-slate-50 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:tracking-normal placeholder:text-slate-300"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <p className="text-sm text-slate-500">Enter the 6-digit code</p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-[#FE6D2C] hover:bg-[#E85D20] text-white py-3 rounded-2xl font-bold shadow-lg shadow-[#FE6D2C]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t("verify_complete")}
                  </>
                ) : (
                  t("verify_complete")
                )}
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendingOtp}
                className="w-full text-sm font-bold text-blue-600 hover:text-blue-700 py-2 disabled:opacity-50"
              >
                {resendingOtp ? t("sending") : t("resend_otp")}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
