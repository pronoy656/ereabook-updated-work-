"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Eye, Trash2, Loader2, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn, getImageUrl } from "@/lib/utils";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { getSocket } from "@/lib/socket";
import { User, PaginationData } from "@/types";
import {
  AddConsultantDialog,
  EditUserDialog,
  ViewUserDialog,
  DeleteConfirmDialog,
  BulkDeleteConfirmDialog,
} from "./dialogs";

export default function UsersTable({ role }: { role: "USER" | "CONSULTANT" }) {
  const router = useRouter();
  const t = useTranslations("admin_users");

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const itemsPerPage = 10;

  // Dialog states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [consultancyTypes, setConsultancyTypes] = useState<any[]>([]);

  useEffect(() => {
    if (role === "CONSULTANT") {
      const fetchTypes = async () => {
        try {
          const res = await api.get("/consultancy-type?activeOnly=true");
          if (res.data?.success) {
            setConsultancyTypes(res.data.data);
          }
        } catch (err) {
          console.error("Failed to fetch consultancy types", err);
        }
      };
      fetchTypes();
    }
  }, [role]);

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
      if (response.data?.success) {
        setUsers(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchQuery]);

  // Reset pagination when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Change page handler
  const handlePageChange = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.totalPage) {
      setCurrentPage(page);
    }
  };

  // Real-time status update via Socket.IO
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleStatusChanged = (payload: { consultantId: string; activeStatus: boolean }) => {
      if (!payload?.consultantId) return;
      const targetId = String(payload.consultantId);
      setUsers((prev) =>
        prev.map((u) =>
          String(u._id) === targetId ? { ...u, activeStatus: payload.activeStatus } : u
        )
      );
    };

    socket.on("consultant:status-changed", handleStatusChanged);
    return () => {
      socket.off("consultant:status-changed", handleStatusChanged);
    };
  }, []);

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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {role === "USER" ? t("customers") : t("consultants")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm">
            {role === "USER" ? t("manage_customers") : t("manage_consultants")}
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
              {t("delete")} ({selectedIds.length})
            </button>
          )}

          {/* Add Consultant Dialog */}
          {role === "CONSULTANT" && (
            <AddConsultantDialog
              isOpen={isAddOpen}
              onOpenChange={setIsAddOpen}
              consultancyTypes={consultancyTypes}
              onSuccess={fetchUsers}
            />
          )}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <Input
              placeholder={t("search_placeholder")}
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
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("user")}</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("status")}</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("join_date")}</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                      <p className="text-sm text-slate-500 font-medium">{t("loading_users")}</p>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm font-medium">
                    {t("no_users_found")}
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr 
                    key={user._id} 
                    className={cn(
                      "hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors", 
                      selectedIds.includes(user._id) && "bg-blue-50/50 dark:bg-blue-900/20"
                    )}
                  >
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
                        <div className="relative shrink-0">
                          {user.image || (user as any).avatar || (user as any).profilePic || (user as any).profileImage ? (
                            <img
                              src={getImageUrl(user.image || (user as any).avatar || (user as any).profilePic || (user as any).profileImage)}
                              alt={user.name}
                              className="h-9 w-9 rounded-full object-cover border border-slate-100 dark:border-slate-700"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-bold border border-blue-100 dark:border-blue-800/50">
                              {getInitials(user.name)}
                            </div>
                          )}
                          {role === "CONSULTANT" && user.activeStatus !== undefined && (
                            <span 
                              className={cn(
                                "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800",
                                user.activeStatus ? "bg-emerald-500" : "bg-slate-400"
                              )} 
                              title={user.activeStatus ? "Online" : "Offline"}
                            />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] font-bold text-slate-800 dark:text-white">{user.name}</span>
                            {role === "CONSULTANT" && user.activeStatus !== undefined && (
                              <span className={cn(
                                "text-[10px] font-bold px-1.5 py-0.2 rounded-full border",
                                user.activeStatus 
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800" 
                                  : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                              )}>
                                {user.activeStatus ? "Online" : "Offline"}
                              </span>
                            )}
                          </div>
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
                        {t(user.status.toLowerCase() as any) || user.status}
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
                            setIsEditOpen(true);
                          }}
                          className="p-1 hover:bg-emerald-50 rounded-md hover:text-emerald-500 transition-colors"
                          aria-label="Edit User"
                        >
                          <Pencil className="w-4 h-4 text-emerald-500" />
                        </button>
                        <button
                          onClick={() => {
                            if (role === "CONSULTANT") {
                              router.push(`/admin/users/consultants/${user._id}`);
                            } else {
                              setSelectedUser(user);
                              setIsViewOpen(true);
                            }
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
              {t("showing")} <strong className="text-slate-700 dark:text-slate-300">{(pagination.page - 1) * pagination.limit + 1}</strong> {t("to")} <strong className="text-slate-700 dark:text-slate-300">{Math.min(pagination.page * pagination.limit, pagination.total)}</strong> {t("of")} <strong className="text-slate-700 dark:text-slate-300">{pagination.total}</strong> {t("results")}
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-[13px] font-bold text-slate-500 dark:text-slate-400 border border-transparent rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                {t("previous")}
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
                {t("next")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- Extracted Modular Sub-Dialogs --- */}

      {/* Edit User Dialog */}
      <EditUserDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={selectedUser}
        role={role}
        consultancyTypes={consultancyTypes}
        onSuccess={fetchUsers}
      />

      {/* View User Dialog */}
      <ViewUserDialog
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        user={selectedUser}
      />

      {/* Single Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSuccess={fetchUsers}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <BulkDeleteConfirmDialog
        isOpen={isBulkDeleteOpen}
        onClose={() => {
          setIsBulkDeleteOpen(false);
          setSelectedIds([]);
        }}
        selectedIds={selectedIds}
        onSuccess={fetchUsers}
      />

    </div>
  );
}
