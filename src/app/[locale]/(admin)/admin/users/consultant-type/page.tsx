"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface ConsultancyType {
  _id: string;
  name: string;
  status: string;
  consultantCount: number;
}

export default function ConsultantTypePage() {
  const t = useTranslations("admin_users");
  const [types, setTypes] = useState<ConsultancyType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const [editingType, setEditingType] = useState<ConsultancyType | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTypes = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/consultancy-type');
      if (res.data?.success) {
        setTypes(res.data.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch types");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleAddType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;
    
    try {
      setIsAdding(true);
      const res = await api.post('/consultancy-type', { name: newTypeName.trim() });
      if (res.data?.success) {
        toast.success("Consultancy type created");
        setNewTypeName("");
        setIsAddOpen(false);
        fetchTypes();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create type");
    } finally {
      setIsAdding(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    
    try {
      setIsDeleting(true);
      const res = await api.delete(`/consultancy-type/${deleteConfirmId}`);
      if (res.data?.success) {
        toast.success("Consultancy type deleted");
        fetchTypes();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete type");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  const handleEditType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingType || !editingType.name.trim()) return;
    
    try {
      setIsUpdating(true);
      const res = await api.patch(`/consultancy-type/${editingType._id}`, { 
        name: editingType.name.trim(),
        status: editingType.status
      });
      if (res.data?.success) {
        toast.success("Consultancy type updated");
        setEditingType(null);
        fetchTypes();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update type");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t("consultant_types")}</h1>
          <p className="text-sm text-slate-500 mt-1">{t("manage_consultant_types")}</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors shrink-0">
                <Plus className="w-4 h-4" />
                {t("add_consultant_type")}
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t("add_consultant_type")}</DialogTitle>
                <DialogDescription>{t("create_new_category")}</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddType} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">{t("type_name")}</label>
                  <Input
                    placeholder="e.g. Financial Advisor"
                    value={newTypeName}
                    onChange={(e) => setNewTypeName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                    disabled={isAdding}
                  >
                    {t("cancel")}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                    disabled={isAdding}
                  >
                    {isAdding && <Loader2 className="w-4 h-4 animate-spin" />}
                    {t("add_type")}
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t("type_name_col")}</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">{t("consultants_col")}</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">{t("status_col")}</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">{t("actions_col")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  {t("loading_types")}
                </td>
              </tr>
            ) : types.length > 0 ? (
              types.map((type) => (
                <tr key={type._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">{type.name}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold border border-blue-100 dark:border-blue-800">
                      {type.consultantCount || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-semibold ${
                      type.status === 'active' 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {t(type.status.toLowerCase() as any) || type.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setEditingType({ ...type })}
                      className="text-slate-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 mr-1"
                      title="Edit type"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setDeleteConfirmId(type._id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                      title="Delete type"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  {t("no_types_found")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editingType} onOpenChange={(open) => !open && setEditingType(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("edit_consultant_type")}</DialogTitle>
            <DialogDescription>{t("update_category")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditType} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">{t("type_name")}</label>
              <Input
                placeholder="e.g. Financial Advisor"
                value={editingType?.name || ""}
                onChange={(e) => setEditingType(prev => prev ? { ...prev, name: e.target.value } : null)}
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">{t("status_col")}</label>
              <select 
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={editingType?.status || "active"}
                onChange={(e) => setEditingType(prev => prev ? { ...prev, status: e.target.value } : null)}
              >
                <option value="active">{t("active")}</option>
                <option value="inactive">{t("inactive")}</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setEditingType(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                disabled={isUpdating}
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                disabled={isUpdating}
              >
                {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                {t("save_changes")}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("confirm_deletion")}</DialogTitle>
            <DialogDescription>
              {t("delete_type_confirm")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setDeleteConfirmId(null)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              disabled={isDeleting}
            >
              {t("cancel")}
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
              {t("delete")}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
