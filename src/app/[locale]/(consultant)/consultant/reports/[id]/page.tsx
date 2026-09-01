"use client";

import React, { useEffect, useState } from "react";
import { 
  ArrowLeft, FileText, Link as LinkIcon, 
  ExternalLink, Loader2, Sparkles, User, 
  Clock, Wrench, ShieldCheck, Tag, CheckCircle2, ListChecks, Lightbulb, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { format } from "date-fns";
import { toast } from "sonner";
import { AISummaryCard, AISummaryData } from "@/components/consultant/reports/AISummaryCard";

interface ReportDetail {
    _id: string;
    consultation: {
        _id: string;
        bookingType: string;
        perMinuteRate: number;
        totalAmount: number;
        status: string;
        category?: string;
    };
    user: {
        _id: string;
        name: string;
        image: string;
        avatar: string | null;
    };
    consultant: {
        _id: string;
        name: string;
        image: string;
        avatar: string | null;
    };
    conversation: string;
    duration: number;
    images: string[];
    links: string[];
    pdfUrl: string;
    createdAt: string;
    summary?: string;
    reportSummary?: string;
    notes?: string;
    keyPoints?: string[];
    aiSummary?: AISummaryData;
    stepsTaken?: string[];
    recommendedProducts?: {
        name: string;
        price: string;
        image?: string;
        url?: string;
        buyLink?: string;
    }[];
}

export default function ReportDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [report, setReport] = useState<ReportDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReportDetail = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/report/${params.id}`);
                if (response.data.success) {
                    setReport(response.data.data);
                }
            } catch (error: any) {
                console.error("Error fetching report details:", error);
                toast.error("Failed to load report details.");
                router.push('/consultant/reports');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchReportDetail();
        }
    }, [params.id, router]);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-[#F8FAFC] p-6 md:p-10 space-y-6 animate-pulse">
                <div className="h-10 w-48 bg-slate-200 rounded-xl mb-4"></div>
                <div className="h-[200px] bg-slate-200 rounded-3xl"></div>
                <div className="h-[400px] bg-slate-200 rounded-3xl"></div>
            </div>
        );
    }

    if (!report) return null;

    const getAssetUrl = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/api\/v1\/?$/, '');
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        return `${baseUrl}${normalizedPath}`;
    };

    const formatDuration = (totalSeconds: number) => {
        if (!totalSeconds) return "0 min 17 sec";
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins} min ${secs} sec`;
    };

    const stepsList = (report.stepsTaken && Array.isArray(report.stepsTaken) && report.stepsTaken.length > 0)
        ? report.stepsTaken
        : [];

    const productsList = (report.recommendedProducts && Array.isArray(report.recommendedProducts) && report.recommendedProducts.length > 0)
        ? report.recommendedProducts
        : [];

    const linksList = (report.links && Array.isArray(report.links) && report.links.length > 0)
        ? report.links
        : [];

    const imagesList = (report.images && Array.isArray(report.images) && report.images.length > 0)
        ? report.images
        : [];

    const activeKeyPoints = (report.keyPoints && Array.isArray(report.keyPoints) && report.keyPoints.length > 0)
        ? report.keyPoints
        : (report.aiSummary?.keyPoints || []);

    const reportIdDisplay = `rep_call_${report._id.substring(0, 9)}`;
    const formattedDate = format(new Date(report.createdAt), 'MMMM dd, yyyy');
    const aiSummary = report.aiSummary;

    return (
        <div className="flex flex-col min-h-screen bg-[#F8FAFC] p-4 sm:p-6 md:p-10 space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
            
            {/* ── Header Actions ─────────────────────────────────────── */}
            <div className="flex items-center justify-between print:hidden">
                <Button 
                    variant="ghost" 
                    onClick={() => router.push('/consultant/reports')} 
                    className="w-fit text-slate-600 hover:text-slate-900 rounded-xl font-bold hover:bg-slate-200/50"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Reports
                </Button>
            </div>

            {/* ── ON-SCREEN REPORT VIEW ───────────────────────────────── */}
            <div className="space-y-8 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100">
                
                {/* Brand Header */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-[#0f172a]">Fixpair</h1>
                        <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#2563EB] mt-0.5">
                            YOUR PROFESSIONAL IN YOUR POCKET
                        </p>
                    </div>
                    <div className="text-right space-y-1">
                        <h2 className="text-xl font-bold text-slate-900">Service log</h2>
                        <p className="text-xs font-mono text-slate-400">ID: <span className="text-slate-700 font-semibold">{reportIdDisplay}</span></p>
                        <p className="text-xs font-medium text-slate-500">Date: <span className="text-slate-800 font-bold">{formattedDate}</span></p>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="bg-[#F8FAFC] border border-slate-200/70 rounded-2xl p-6 md:p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">CATEGORY</p>
                            <p className="text-base font-bold text-slate-900">{report.consultation?.category || report.consultation?.bookingType || "Plumbing expert"}</p>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">ADVISOR</p>
                            <p className="text-base font-bold text-slate-900">{report.consultant?.name || "Thomas Müller"}</p>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">CONVERSATION DURATION</p>
                            <p className="text-base font-bold text-slate-900">{formatDuration(report.duration)}</p>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">STATUS</p>
                            <p className="text-base font-bold text-[#10B981]">Successfully completed</p>
                        </div>
                    </div>
                </div>

                {/* Gemini AI Summary (Overview + Key Discussion Points) */}
                <AISummaryCard
                    consultationId={report.consultation?._id}
                    initialSummary={{
                        overview: report.aiSummary?.overview || report.summary || report.reportSummary || report.notes,
                        keyPoints: activeKeyPoints,
                        actionItems: report.aiSummary?.actionItems,
                        recommendations: report.aiSummary?.recommendations
                    }}
                    variant="default"
                />

                {/* Steps Taken */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-1.5 h-6 bg-[#2563EB] rounded-full shrink-0" />
                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Steps taken</h3>
                    </div>
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                        {stepsList.length > 0 ? (
                            <div className="space-y-4">
                                {stepsList.map((step, idx) => (
                                    <div key={idx} className="flex items-center gap-4 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                                        <div className="w-7 h-7 rounded-full bg-blue-50 text-[#2563EB] font-bold text-xs flex items-center justify-center shrink-0">
                                            {idx + 1}
                                        </div>
                                        <p className="text-slate-800 font-medium text-base">{step}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-slate-50/60 border border-dashed border-slate-200 rounded-xl p-5 text-center">
                                <p className="text-sm font-medium text-slate-500 italic">No specific steps recorded for this consultation.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recommended Products */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-1.5 h-6 bg-[#10B981] rounded-full shrink-0" />
                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Recommended Products & Tools</h3>
                    </div>
                    {productsList.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {productsList.map((prod, idx) => (
                                <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                                    {prod.image ? (
                                        <img src={getAssetUrl(prod.image)} alt={prod.name} className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100" />
                                    ) : (
                                        <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-lg shrink-0">
                                            🛍️
                                        </div>
                                    )}
                                    <div className="flex flex-col justify-between flex-1 min-w-0 h-full">
                                        <h4 className="font-bold text-slate-900 text-sm line-clamp-2 leading-tight">{prod.name}</h4>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="font-bold text-[#2563EB] text-sm">{prod.price}</span>
                                            <a href={prod.buyLink || prod.url || '#'} target="_blank" rel="noopener noreferrer"
                                                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors">
                                                Buy →
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-slate-50/60 border border-dashed border-slate-200 rounded-2xl p-6 text-center">
                            <p className="text-sm font-medium text-slate-500 italic">No recommended products or tools were added for this consultation.</p>
                        </div>
                    )}
                </div>

                {/* Helpful Links */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2.5">
                        <div className="w-1.5 h-6 bg-[#2563EB] rounded-full shrink-0" />
                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Helpful Links</h3>
                    </div>
                    {linksList.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {linksList.map((link, idx) => (
                                <a key={idx} href={link} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-50/60 hover:bg-blue-100/60 border border-blue-100 text-sm text-[#2563EB] font-bold transition-all group">
                                    <span className="flex items-center gap-2.5 truncate">
                                        <LinkIcon className="w-4 h-4 text-blue-500 shrink-0" />
                                        <span className="truncate">{link}</span>
                                    </span>
                                    <ExternalLink className="w-4 h-4 shrink-0 opacity-70 group-hover:opacity-100" />
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-slate-50/60 border border-dashed border-slate-200 rounded-2xl p-6 text-center">
                            <p className="text-sm font-medium text-slate-500 italic">No external links were attached for this consultation.</p>
                        </div>
                    )}
                </div>

                {/* Attached Photos */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2.5">
                        <div className="w-1.5 h-6 bg-orange-500 rounded-full shrink-0" />
                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Attached Photos</h3>
                    </div>
                    {imagesList.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {imagesList.map((img, idx) => (
                                <a key={idx} href={getAssetUrl(img)} target="_blank" rel="noopener noreferrer"
                                    className="block rounded-2xl overflow-hidden border border-slate-200 aspect-square hover:opacity-90 transition-opacity">
                                    <img src={getAssetUrl(img)} alt="Attachment" className="w-full h-full object-cover" />
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-slate-50/60 border border-dashed border-slate-200 rounded-2xl p-6 text-center">
                            <p className="text-sm font-medium text-slate-500 italic">No photos or attachments were uploaded for this consultation.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
