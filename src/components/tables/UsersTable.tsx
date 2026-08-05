"use client";

import React, { useState, useMemo } from "react";
import { Search, Eye, Trash2, Plus, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import api from "@/lib/axios";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/utils";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  image?: string;
  stats?: {
    avgRating: number;
    totalReviews: number;
  };
}

interface PaginationData {
  total: number;
  limit: number;
  page: number;
  totalPage: number;
}

export default function UsersTable({ role }: { role: "USER" | "CONSULTANT" }) {

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const itemsPerPage = 10;

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  
  // Selected user for row actions
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Signup & OTP State
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);
  const [otp, setOtp] = useState("");
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
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (searchQuery) {
        params.searchTerm = searchQuery;
      }
      
      params.role = role;

      const response = await api.get("/user", { params });
      if (response.data.success) {
        setUsers(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, [currentPage, searchQuery]);

  // Change page handler
  const handlePageChange = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.totalPage) {
      setCurrentPage(page);
    }
  };

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Handlers for actions
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSigningUp(true);
      const response = await api.post("/user", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        // Backend might support more fields, but user only provided these 4
      });

      if (response.data.success) {
        toast.success("Consultant created");
        setIsAddOpen(false);
        fetchUsers();
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
        oneTimeCode: Number(otp)
      });

      if (response.data.success) {
        toast.success("Email verified successfully! Consultant added.");
        setIsOtpOpen(false);
        setOtp("");
        fetchUsers();
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
        email: formData.email
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

  const handleDeleteConfirm = async () => {
    if (selectedUser) {
      try {
        setIsDeleting(true);
        const response = await api.delete(`/user/${selectedUser._id}`);
        if (response.data.success) {
          toast.success("User deleted successfully");
          fetchUsers();
          setIsDeleteOpen(false);
          setSelectedUser(null);
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete user");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.length > 0) {
      try {
        setIsBulkDeleting(true);
        // Assuming no dedicated bulk delete endpoint exists, we run requests in parallel.
        await Promise.all(selectedIds.map(id => api.delete(`/user/${id}`)));
        toast.success(`${selectedIds.length} users deleted successfully`);
        fetchUsers();
        setIsBulkDeleteOpen(false);
        setSelectedIds([]);
      } catch (error: any) {
        toast.error("Failed to delete some or all selected users");
      } finally {
        setIsBulkDeleting(false);
      }
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(users.map((u) => u._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((prevId) => prevId !== id) : [...prev, id]
    );
  };

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
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{role === "USER" ? "Customers" : "Consultants"}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm">
            Manage {role === "USER" ? "customers" : "consultants"} and their statuses
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Bulk Delete Button */}
          {selectedIds.length > 0 && (
            <button 
              onClick={() => setIsBulkDeleteOpen(true)}
              className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2.5 rounded-xl text-sm font-bold transition-transform active:scale-95 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete ({selectedIds.length})
            </button>
          )}

          {/* Add Consultant Dialog */}
          {role === "CONSULTANT" && (
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <button className="bg-[#FE6D2C] hover:bg-[#E85D20] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-[#FE6D2C]/20 transition-transform active:scale-95">
              Add Consultant
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto dark:bg-[#1e293b] dark:text-white border-none">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Add Consultant</DialogTitle>
              <DialogDescription className="dark:text-slate-400">Add a new consultant to the system.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSignup} className="space-y-4 mt-2">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Profile Picture</label>
                <div className="flex items-center gap-4">
                   <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                     <Plus className="w-6 h-6" />
                   </div>
                   <button type="button" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Upload Image</button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Full Name <span className="text-red-500">*</span></label>
                  <Input 
                    placeholder="John Doe" 
                    className="bg-slate-50" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Email Address <span className="text-red-500">*</span></label>
                  <Input 
                    placeholder="john@example.com" 
                    type="email" 
                    className="bg-slate-50" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Password <span className="text-red-500">*</span></label>
                  <Input 
                    placeholder="••••••••" 
                    type="password" 
                    className="bg-slate-50" 
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                  <Input 
                    placeholder="+1 (555) 000-0000" 
                    className="bg-slate-50" 
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Professional Details</label>
                  <Input 
                    placeholder="E.g. Certified Accountant" 
                    className="bg-slate-50" 
                    value={formData.professionalDetails}
                    onChange={(e) => setFormData({ ...formData, professionalDetails: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Specialization</label>
                  <Input 
                    placeholder="Tax Consulting" 
                    className="bg-slate-50" 
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Sub-speciality</label>
                  <Input 
                    placeholder="Corporate Tax" 
                    className="bg-slate-50" 
                    value={formData.subSpeciality}
                    onChange={(e) => setFormData({ ...formData, subSpeciality: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Years of Experience</label>
                  <Input 
                    placeholder="10" 
                    type="number" 
                    className="bg-slate-50" 
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Role</label>
                  <Input value="CONSULTANT" readOnly className="bg-slate-100 cursor-not-allowed font-bold text-slate-500" />
                </div>
              </div>
              <div className="space-y-1 pt-2">
                <label className="text-sm font-semibold text-slate-700">Bio/About</label>
                <textarea 
                  className="w-full h-24 p-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="Brief description about the consultant..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSigningUp}
                  className="bg-[#FE6D2C] hover:bg-[#E85D20] text-white px-6 py-2 rounded-xl font-bold shadow-sm shadow-[#FE6D2C]/20 transition-transform active:scale-95 flex items-center gap-2"
                >
                  {isSigningUp ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing up...
                    </>
                  ) : (
                    "Signup Consultant"
                  )}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        )}
        </div>

        {/* OTP Verification Dialog */}
        <Dialog open={isOtpOpen} onOpenChange={setIsOtpOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Email Verification</DialogTitle>
              <DialogDescription>
                We've sent an OTP to <span className="font-bold text-slate-900">{formData.email}</span>. Please enter it below to verify the consultant account.
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
                      Verifying...
                    </>
                  ) : (
                    "Verify & Complete Signup"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendingOtp}
                  className="w-full text-sm font-bold text-blue-600 hover:text-blue-700 py-2 disabled:opacity-50"
                >
                  {resendingOtp ? "Sending..." : "Didn't receive code? Resend OTP"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <Input
                    placeholder="Search by name, email, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-700 rounded-xl text-[13px] text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-blue-100 dark:focus-visible:ring-blue-900"
                />
            </div>
        </div>

        <div className="overflow-x-auto w-full min-h-[400px]">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-[#FAFAFA] dark:bg-slate-800/50">
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    checked={users.length > 0 && selectedIds.length === users.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">USER</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">STATUS</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">JOIN DATE</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                      <p className="text-sm text-slate-500 font-medium">Loading users...</p>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm font-medium">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className={cn("hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors", selectedIds.includes(user._id) && "bg-blue-50/50 dark:bg-blue-900/20")}>
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        checked={selectedIds.includes(user._id)}
                        onChange={() => handleSelectRow(user._id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {user.image ? (
                          <img
                            src={getImageUrl(user.image) || user.image}
                            alt={user.name}
                            className="h-9 w-9 rounded-full object-cover border border-slate-100 dark:border-slate-700"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-bold border border-blue-100 dark:border-blue-800/50">
                            {getInitials(user.name)}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-slate-800 dark:text-white">{user.name}</span>
                          <span className="text-[13px] text-slate-400 dark:text-slate-500 font-medium">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-bold uppercase tracking-wide",
                          user.status.toLowerCase() === "active" && "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
                          user.status.toLowerCase() === "pending" && "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
                          user.status.toLowerCase() === "suspended" && "bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400"
                        )}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[13px] text-slate-500 font-medium">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 text-slate-400">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setIsViewOpen(true);
                          }}
                          className="p-1 hover:bg-blue-50 rounded-md hover:text-blue-500 transition-colors"
                          aria-label="View User"
                        >
                          <Eye className="w-4 h-4 text-blue-500" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setIsDeleteOpen(true);
                          }}
                          className="p-1 hover:bg-red-50 rounded-md hover:text-red-500 transition-colors"
                          aria-label="Delete User"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination section */}
        {pagination && pagination.totalPage > 0 && (
          <div className="px-6 py-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">
              Showing <strong className="text-slate-700 dark:text-slate-300">{(pagination.page - 1) * pagination.limit + 1}</strong> to <strong className="text-slate-700 dark:text-slate-300">{Math.min(pagination.page * pagination.limit, pagination.total)}</strong> of <strong className="text-slate-700 dark:text-slate-300">{pagination.total}</strong> results
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-[13px] font-bold text-slate-500 dark:text-slate-400 border border-transparent rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              
              {Array.from({ length: pagination.totalPage }).map((_, index) => {
                const pageNum = index + 1;
                return (
                  <button 
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={cn(
                      "h-8 w-8 min-w-[32px] flex items-center justify-center text-[13px] font-bold rounded-lg transition-colors",
                      currentPage === pageNum 
                        ? "text-white bg-[#FE6D2C]" 
                        : "text-slate-600 border border-slate-200 hover:bg-slate-50"
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPage}
                className="px-3 py-1.5 text-[13px] font-bold text-slate-500 border border-transparent rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- Action Dialogs --- */}

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-md dark:bg-[#1e293b] dark:text-white border-none">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                {selectedUser.image ? (
                  <img
                    src={getImageUrl(selectedUser.image) || selectedUser.image}
                    alt={selectedUser.name}
                    className="h-16 w-16 rounded-full object-cover border border-slate-100"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold border border-blue-100">
                    {getInitials(selectedUser.name)}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedUser.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Role</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedUser.role}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Status</p>
                  <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wide",
                      selectedUser.status.toLowerCase() === "active" && "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
                      selectedUser.status.toLowerCase() === "pending" && "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
                      selectedUser.status.toLowerCase() === "suspended" && "bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400"
                    )}>
                      {selectedUser.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">User ID</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{selectedUser._id}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Joined Date</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <button 
              onClick={() => setIsViewOpen(false)}
              className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors w-full"
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
               <AlertCircle className="w-5 h-5" />
               Confirm Deletion
            </DialogTitle>
            <DialogDescription className="pt-3">
              Are you sure you want to delete the user <strong>{selectedUser?.name}</strong>? This action cannot be undone and will permanently remove this user from the system.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <button 
              onClick={() => setIsDeleteOpen(false)}
              className="px-4 py-2 font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-bold shadow-sm shadow-red-500/20 transition-all active:scale-[0.98] flex items-center gap-2 disabled:opacity-70"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete User"
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
               <AlertCircle className="w-5 h-5" />
               Confirm Bulk Deletion
            </DialogTitle>
            <DialogDescription className="pt-3">
              Are you sure you want to delete <strong>{selectedIds.length}</strong> selected users? This action cannot be undone and will permanently remove them from the system.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <button 
              onClick={() => setIsBulkDeleteOpen(false)}
              className="px-4 py-2 font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleBulkDeleteConfirm}
              disabled={isBulkDeleting}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-bold shadow-sm shadow-red-500/20 transition-all active:scale-[0.98] flex items-center gap-2 disabled:opacity-70"
            >
              {isBulkDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                `Delete ${selectedIds.length} Users`
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
