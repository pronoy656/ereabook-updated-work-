"use client";

import React, { useEffect, useState, useRef } from "react";
import { ArrowLeft, Calendar, Clock, Download, FileText, Image as ImageIcon, Link as LinkIcon, User, Eye } from "lucide-react";
import generatePDF from 'react-to-pdf';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { format } from "date-fns";
import { toast } from "sonner";
import Image from "next/image";

interface ReportDetail {
    _id: string;
    consultation: {
        _id: string;
        bookingType: string;
        perMinuteRate: number;
        totalAmount: number;
        status: string;
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
    reportSummary?: string;
}

export default function ReportDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [report, setReport] = useState<ReportDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const targetRef = useRef<HTMLDivElement>(null);

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
            <div className="flex flex-col min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-6 animate-pulse">
                <div className="h-10 w-48 bg-slate-200 rounded-xl mb-4"></div>
                <div className="h-[200px] bg-slate-200 rounded-[2rem]"></div>
                <div className="flex gap-6">
                    <div className="flex-1 h-[400px] bg-slate-200 rounded-[2rem]"></div>
                    <div className="w-80 h-[400px] bg-slate-200 rounded-[2rem]"></div>
                </div>
            </div>
        );
    }

    if (!report) return null;

    const getAssetUrl = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        // Strip /api/v1 from the URL because static files are typically served from the server root
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/api\/v1\/?$/, '');
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        return `${baseUrl}${normalizedPath}`;
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50 p-6 md:p-8 lg:p-10 space-y-6 animate-in fade-in duration-500">
            {/* Header Actions */}
            <div className="flex items-center justify-between mb-4">
                <Button 
                    variant="ghost" 
                    onClick={() => router.push('/consultant/reports')} 
                    className="w-fit text-slate-500 hover:text-slate-900 -ml-2 rounded-xl"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Reports
                </Button>

                <Button 
                    onClick={() => generatePDF(targetRef, {filename: `report-${report._id}.pdf`})}
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
                >
                    <Download className="mr-2 h-4 w-4" /> Download PDF
                </Button>
            </div>

            {/* Printable Content */}
            <div ref={targetRef} className="space-y-6 bg-slate-50/50 p-6 rounded-3xl">
                {/* Top Overview Card */}
                <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
                <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 border-2 border-slate-100">
                                <AvatarImage src={getAssetUrl(report.user.image)} alt={report.user.name} />
                                <AvatarFallback className="bg-blue-50 text-blue-600 text-xl font-bold">
                                    {report.user.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">{report.user.name}</h2>
                                <div className="flex items-center gap-2 mt-1 text-slate-500 text-sm font-medium">
                                    <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md text-xs uppercase tracking-wider text-slate-600">
                                        {report.consultation.bookingType}
                                    </span>
                                    <span>•</span>
                                    <span className={report.consultation.status === 'completed' ? 'text-green-600' : 'text-slate-500'}>
                                        {report.consultation.status.charAt(0).toUpperCase() + report.consultation.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 md:border-l md:border-slate-100 md:pl-6">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Date</p>
                                <p className="text-base font-semibold text-slate-900">
                                    {format(new Date(report.createdAt), 'MMM dd, yyyy')}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Main Content Layout */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Conversation Body */}
                <div className="flex-1 space-y-6">
                    <Card className="border-none shadow-sm rounded-[2rem] bg-white">
                        <CardContent className="p-6 md:p-8">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-blue-500" />
                                Conversation
                            </h3>
                            <Separator className="mb-6 bg-slate-100" />
                            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                                {report.conversation || <span className="text-slate-400 italic">No conversation recorded.</span>}
                            </div>
                        </CardContent>
                    </Card>

                    {report.reportSummary && (
                        <Card className="border-none shadow-sm rounded-[2rem] bg-white">
                            <CardContent className="p-6 md:p-8">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-purple-500" />
                                    Report Summary
                                </h3>
                                <Separator className="mb-6 bg-slate-100" />
                                <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                                    {report.reportSummary}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar Details */}
                <div className="w-full lg:w-80 space-y-6">
                    {/* Links */}
                    {report.links && report.links.length > 0 && (
                        <Card className="border-none shadow-sm rounded-[2rem] bg-white">
                            <CardContent className="p-6">
                                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                                    <LinkIcon className="h-4 w-4 text-blue-500" />
                                    Attached Links
                                </h3>
                                <div className="space-y-3">
                                    {report.links.map((link, idx) => (
                                        <a 
                                            key={idx} 
                                            href={link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition-colors group"
                                        >
                                            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-blue-500 shadow-sm shrink-0">
                                                <LinkIcon className="h-3.5 w-3.5" />
                                            </div>
                                            <span className="text-sm font-medium text-slate-700 truncate group-hover:text-blue-700">{link}</span>
                                        </a>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Images/Files */}
                    {report.images && report.images.length > 0 && (
                        <Card className="border-none shadow-sm rounded-[2rem] bg-white">
                            <CardContent className="p-6">
                                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                                    <ImageIcon className="h-4 w-4 text-orange-500" />
                                    Attached Files
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {report.images.map((img, idx) => {
                                        const isPdf = img.toLowerCase().endsWith('.pdf');
                                        return (
                                            <a 
                                                key={idx}
                                                href={getAssetUrl(img)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group block relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-square hover:border-blue-300 transition-colors"
                                            >
                                                {isPdf ? (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-red-500 p-2">
                                                        <FileText className="h-8 w-8 mb-2" />
                                                        <span className="text-[10px] font-bold text-slate-600 truncate w-full text-center">PDF Document</span>
                                                    </div>
                                                ) : (
                                                    <img 
                                                        src={getAssetUrl(img)} 
                                                        alt="Attachment"
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                )}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                                                    <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                                                        <Eye className="h-4 w-4 text-slate-700" />
                                                    </div>
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
            </div>
        </div>
    );
}
