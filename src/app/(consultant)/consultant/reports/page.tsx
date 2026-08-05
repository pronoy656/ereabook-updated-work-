"use client";

import React, { useEffect, useState } from "react";
import { Plus, FileText, Download, Eye, Calendar, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CreateReportModal } from "./CreateReportModal";

interface Report {
    _id: string;
    consultation: {
        _id: string;
        bookingType: string;
        status: string;
    };
    user: {
        _id: string;
        name: string;
        image: string;
        avatar: string | null;
    };
    duration: number;
    pdfUrl: string;
    createdAt: string;
}

export default function ReportsListPage() {
    const router = useRouter();
    const [reports, setReports] = useState<Report[]>([]);
    const [pendingBookings, setPendingBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedConsultationId, setSelectedConsultationId] = useState("");

    const fetchData = async () => {
        try {
            setLoading(true);
            const [reportsRes, bookingsRes] = await Promise.all([
                api.get("/report"),
                api.get("/consultation/my-bookings?status=completed")
            ]);
            
            if (reportsRes.data.success) {
                setReports(reportsRes.data.data);
            }
            if (bookingsRes.data.success) {
                const bookings = bookingsRes.data.data || [];
                setPendingBookings(bookings.filter((b: any) => b.report === null));
            }
        } catch (error: any) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load reports data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50 p-6 md:p-8 lg:p-10 space-y-8 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Consultation Reports</h1>
                    <p className="text-slate-500 mt-1">View past consultation summaries and generate new reports.</p>
                </div>
            </div>

            <Tabs defaultValue="pending" className="w-full">
                <TabsList className="mb-2">
                    <TabsTrigger value="pending">Pending Reports ({pendingBookings.length})</TabsTrigger>
                    <TabsTrigger value="generated">Generated Reports ({reports.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="pending" className="space-y-6">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[1, 2, 3].map((skeleton) => (
                                <Card key={skeleton} className="border-none shadow-sm rounded-2xl animate-pulse bg-white/60 min-h-[200px]" />
                            ))}
                        </div>
                    ) : pendingBookings.length === 0 ? (
                        <Card className="border-none shadow-sm rounded-2xl bg-white flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
                            <div className="h-20 w-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
                                <FileText className="h-10 w-10" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No Pending Reports</h3>
                            <p className="text-slate-500 max-w-sm mx-auto">
                                You have generated reports for all completed consultations.
                            </p>
                        </Card>
                    ) : (
                        <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                                        <TableHead className="font-semibold text-slate-700">Client</TableHead>
                                        <TableHead className="font-semibold text-slate-700">Booking Type</TableHead>
                                        <TableHead className="font-semibold text-slate-700">Date & Time</TableHead>
                                        <TableHead className="font-semibold text-slate-700">Status</TableHead>
                                        <TableHead className="text-right font-semibold text-slate-700">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendingBookings.map((booking) => (
                                        <TableRow 
                                            key={booking._id} 
                                            className="group cursor-pointer hover:bg-slate-50/50"
                                            onClick={() => {
                                                setSelectedConsultationId(booking._id);
                                                setIsCreateModalOpen(true);
                                            }}
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 border border-slate-100">
                                                        <AvatarImage src={booking.user?.image} alt={booking.user?.name} />
                                                        <AvatarFallback className="bg-blue-50 text-blue-600 font-bold text-xs">
                                                            {booking.user?.name?.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900">{booking.user?.name}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wider">
                                                    {booking.bookingType || '-'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Calendar className="h-4 w-4 text-slate-400" />
                                                    <span>{format(new Date(booking.createdAt), 'MMM dd, yyyy - hh:mm a')}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-semibold uppercase tracking-wider">
                                                    Pending
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button 
                                                    size="sm"
                                                    className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedConsultationId(booking._id);
                                                        setIsCreateModalOpen(true);
                                                    }}
                                                >
                                                    <Plus className="mr-1 h-3.5 w-3.5" /> Create
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    )}
                </TabsContent>
                
                <TabsContent value="generated" className="space-y-6">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[1, 2, 3].map((skeleton) => (
                                <Card key={skeleton} className="border-none shadow-sm rounded-2xl animate-pulse bg-white/60 min-h-[200px]" />
                            ))}
                        </div>
                    ) : reports.length === 0 ? (
                        <Card className="border-none shadow-sm rounded-2xl bg-white flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
                            <div className="h-20 w-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
                                <FileText className="h-10 w-10" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No Reports Found</h3>
                            <p className="text-slate-500 max-w-sm mx-auto mb-8">
                                You haven't generated any consultation reports yet. Create one after completing a session.
                            </p>
                            <Button 
                                onClick={() => {
                                    setSelectedConsultationId("");
                                    setIsCreateModalOpen(true);
                                }}
                                variant="outline"
                                className="rounded-xl h-11 border-blue-200 text-blue-600 hover:bg-blue-50"
                            >
                                <Plus className="mr-2 h-4 w-4" /> Create First Report
                            </Button>
                        </Card>
                    ) : (
                        <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                                        <TableHead className="font-semibold text-slate-700">Client</TableHead>
                                        <TableHead className="font-semibold text-slate-700">Booking Type</TableHead>
                                        <TableHead className="font-semibold text-slate-700">Date & Time</TableHead>
                                        <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reports.map((report) => (
                                        <TableRow 
                                            key={report._id} 
                                            className="group cursor-pointer hover:bg-slate-50/50"
                                            onClick={() => router.push(`/consultant/reports/${report._id}`)}
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 border border-slate-100">
                                                        <AvatarImage src={report.user.image} alt={report.user.name} />
                                                        <AvatarFallback className="bg-blue-50 text-blue-600 font-bold text-xs">
                                                            {report.user.name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900">{report.user.name}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wider">
                                                    {report.consultation.bookingType}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Calendar className="h-4 w-4 text-slate-400" />
                                                    <span>{format(new Date(report.createdAt), 'MMM dd, yyyy - hh:mm a')}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm"
                                                        className="rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.push(`/consultant/reports/${report._id}`);
                                                        }}
                                                    >
                                                        <Eye className="h-4 w-4 mr-1.5" /> View
                                                    </Button>
                                                    {report.pdfUrl && (
                                                        <Button 
                                                            variant="secondary" 
                                                            size="sm"
                                                            className="rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/api\/v1\/?$/, '');
                                                                const normalizedPath = report.pdfUrl.startsWith('/') ? report.pdfUrl : `/${report.pdfUrl}`;
                                                                window.open(report.pdfUrl.startsWith('http') ? report.pdfUrl : `${baseUrl}${normalizedPath}`, '_blank');
                                                            }}
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>

            <CreateReportModal 
                open={isCreateModalOpen} 
                onOpenChange={setIsCreateModalOpen} 
                consultationId={selectedConsultationId}
                onSuccess={() => {
                    fetchData();
                }}
            />
        </div>
    );
}
