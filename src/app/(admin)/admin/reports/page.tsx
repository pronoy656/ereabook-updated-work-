"use client";

import React, { useState, useEffect } from "react";
import { Search, Eye, FileText, Download, ExternalLink, User, Calendar, Clock, Link as LinkIcon, Image as ImageIcon, Timer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, getImageUrl } from "@/lib/utils";
import api from "@/lib/axios";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface Report {
    _id: string;
    consultation: {
        _id: string;
        bookingType: string;
        date: string;
        status: string;
    };
    user: {
        _id: string;
        name: string;
        image: string;
    };
    consultant: {
        _id: string;
        name: string;
        image: string;
    };
    conversation: string;
    duration: number;
    images: string[];
    links: string[];
    pdfUrl: string;
    createdAt: string;
}

export default function AdminReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await api.get("/report");
                if (response.data.success) {
                    setReports(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching reports:", error);
                toast.error("Failed to load reports.");
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const filteredReports = reports.filter(report => 
        (report.user?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (report.consultant?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleViewDetails = (report: Report) => {
        setSelectedReport(report);
        setIsDetailsOpen(true);
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50 dark:bg-transparent p-6 md:p-8 lg:p-10 space-y-8 animate-in fade-in duration-500 transition-colors">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Consultation Reports</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Review and manage finalized consultation reports and PDFs.</p>
                </div>
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                        placeholder="Search by user or consultant..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-11 rounded-xl bg-white dark:bg-[#1e293b] border-slate-100 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-500 shadow-sm focus:ring-blue-500/10"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] space-y-4 bg-white dark:bg-[#1e293b] rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Loading reports...</p>
                </div>
            ) : filteredReports.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] space-y-4 bg-white dark:bg-[#1e293b] rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm text-center p-8">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-2">
                        <FileText className="w-10 h-10 text-slate-200 dark:text-slate-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">No reports found</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">Try adjusting your search or check back later for new consultations.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-colors relative">
                    <div className="overflow-x-auto relative min-h-[200px]">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                                    <th className="py-4 px-4 xl:px-6 text-[13px] font-semibold text-slate-500 dark:text-slate-400">User</th>
                                    <th className="py-4 px-4 xl:px-6 text-[13px] font-semibold text-slate-500 dark:text-slate-400">Consultant</th>
                                    <th className="py-4 px-4 xl:px-6 text-[13px] font-semibold text-slate-500 dark:text-slate-400">Date</th>
                                    <th className="py-4 px-4 xl:px-6 text-[13px] font-semibold text-slate-500 dark:text-slate-400">Links</th>
                                    <th className="py-4 px-4 xl:px-6 text-[13px] font-semibold text-slate-500 dark:text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                {filteredReports.map((report, index) => (
                                    <tr key={report._id || index} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors">
                                        <td className="py-4 px-4 xl:px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shadow-sm overflow-hidden shrink-0">
                                                    {report.user?.image && !imageErrors[`${report._id}_user`] ? <img src={getImageUrl(report.user!.image as string)} alt="" className="w-full h-full object-cover" onError={() => setImageErrors(prev => ({ ...prev, [`${report._id}_user`]: true }))} /> : <User className="w-4 h-4 text-blue-500 dark:text-blue-400" />}
                                                </div>
                                                <span className="text-[14px] font-bold text-slate-800 dark:text-slate-200">{report.user?.name || "Unknown User"}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 xl:px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shadow-sm overflow-hidden shrink-0">
                                                    {report.consultant?.image && !imageErrors[`${report._id}_consultant`] ? <img src={getImageUrl(report.consultant!.image as string)} alt="" className="w-full h-full object-cover" onError={() => setImageErrors(prev => ({ ...prev, [`${report._id}_consultant`]: true }))} /> : <User className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />}
                                                </div>
                                                <span className="text-[14px] font-bold text-slate-800 dark:text-slate-200">{report.consultant?.name || "Unknown Consultant"}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 xl:px-6">
                                            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-[13px] font-medium">
                                                <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                                {new Date(report.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 xl:px-6">
                                            {report.links && report.links.length > 0 ? (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {report.links.slice(0, 2).map((link, idx) => (
                                                        <a 
                                                            key={idx} 
                                                            href={link.startsWith('http') ? link : `https://${link}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-[#1e293b] text-slate-600 dark:text-slate-300 text-[11px] font-bold rounded-md border border-slate-200 dark:border-slate-700 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800 transition-all shadow-sm"
                                                        >
                                                            <ExternalLink className="w-3 h-3" />
                                                            L{idx + 1}
                                                        </a>
                                                    ))}
                                                    {report.links.length > 2 && (
                                                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 self-center ml-1">
                                                            +{report.links.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-[13px] text-slate-400 dark:text-slate-600 italic">No links</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 xl:px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    className="rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 h-8 px-3 text-[12px] font-bold transition-all"
                                                    onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${report.pdfUrl}`, '_blank')}
                                                >
                                                    <Download className="w-3.5 h-3.5 mr-1.5" />
                                                    PDF
                                                </Button>
                                                <Button 
                                                    size="sm"
                                                    onClick={() => handleViewDetails(report)}
                                                    className="rounded-lg bg-blue-600 hover:bg-blue-500 text-white h-8 px-3.5 text-[12px] font-bold shadow-sm"
                                                >
                                                    Details
                                                    <Eye className="w-3.5 h-3.5 ml-1.5" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Details Dialog */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-[700px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl dark:bg-[#1e293b]">
                    <DialogHeader className="p-8 pb-4">
                        <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            Report Details
                        </DialogTitle>
                    </DialogHeader>
                    
                    {selectedReport && (
                        <div className="p-8 pt-4 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {/* User & Consultant Info */}
                            <div className="grid grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-800/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
                                <div className="space-y-3">
                                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">User</p>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-600 flex items-center justify-center overflow-hidden shadow-sm">
                                            {selectedReport.user?.image && !imageErrors[`${selectedReport._id}_user_modal`] ? <img src={getImageUrl(selectedReport.user.image)} alt="" className="w-full h-full object-cover" onError={() => setImageErrors(prev => ({ ...prev, [`${selectedReport._id}_user_modal`]: true }))} /> : <User className="w-5 h-5 text-slate-400 dark:text-slate-500" />}
                                        </div>
                                        <p className="text-sm font-bold text-slate-800 dark:text-white">{selectedReport.user?.name || "Unknown User"}</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Consultant</p>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-600 flex items-center justify-center overflow-hidden shadow-sm">
                                            {selectedReport.consultant?.image && !imageErrors[`${selectedReport._id}_consultant_modal`] ? <img src={getImageUrl(selectedReport.consultant.image)} alt="" className="w-full h-full object-cover" onError={() => setImageErrors(prev => ({ ...prev, [`${selectedReport._id}_consultant_modal`]: true }))} /> : <User className="w-5 h-5 text-slate-400 dark:text-slate-500" />}
                                        </div>
                                        <p className="text-sm font-bold text-slate-800 dark:text-white">{selectedReport.consultant?.name || "Unknown Consultant"}</p>
                                    </div>
                                </div>
                            </div>



                            {/* Links Section - Full Width */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                    <LinkIcon className="w-4 h-4" />
                                    Resources & Links
                                </h4>
                                <div className="space-y-2">
                                    {selectedReport.links && selectedReport.links.length > 0 ? selectedReport.links.map((link, idx) => (
                                        <a 
                                            key={idx} 
                                            href={link.startsWith('http') ? link : `https://${link}`} 
                                            target="_blank" 
                                            className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-700 group hover:border-blue-200 dark:hover:border-blue-800 transition-all"
                                        >
                                            <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate max-w-[200px]">{link}</span>
                                            <ExternalLink className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                                        </a>
                                    )) : (
                                        <p className="text-xs text-slate-400 dark:text-slate-500 italic">No links attached.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="p-8 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-700">
                        <Button 
                            variant="outline" 
                            className="rounded-xl font-bold text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                            onClick={() => setIsDetailsOpen(false)}
                        >
                            Close Details
                        </Button>
                        <Button 
                            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 border-none"
                            onClick={() => selectedReport && window.open(`${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${selectedReport.pdfUrl}`, '_blank')}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF Report
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
