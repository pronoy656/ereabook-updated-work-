"use client";

import { Send, Image as ImageIcon, Link as LinkIcon, Plus, X, FileText, Paperclip, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import React, { useState, useRef, useEffect, Suspense } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function CreateReportContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialConsultationId = searchParams.get('consultationId') || "";

    const [images, setImages] = useState<{ name: string; size: string; file: File }[]>([]);
    const [links, setLinks] = useState<string[]>([]);
    const [newLink, setNewLink] = useState("");
    const [consultationId, setConsultationId] = useState(initialConsultationId);
    const [conversation, setConversation] = useState("");
    const [reportSummary, setReportSummary] = useState("");
    const [sending, setSending] = useState(false);
    const [fetchingTranscript, setFetchingTranscript] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user } = useAuth();
    
    // Debounced automatic transcript fetching logic
    useEffect(() => {
        const fetchTranscript = async () => {
            if (!consultationId || consultationId.length < 10) return;
            
            setFetchingTranscript(true);
            try {
                const res = await api.get(`/transcription/${consultationId}/history`);
                const history = res.data?.data || res.data || [];
                
                if (Array.isArray(history) && history.length > 0) {
                    // Extract unique numeric UIDs
                    const uniqueUids = Array.from(new Set(history.map((item: any) => Number(item.speakerUid)).filter((uid: number) => !isNaN(uid))));
                    
                    // Determine the consultant's Agora UID
                    let actualConsultantUid = typeof user?.uid === 'number' ? user.uid : 2001;
                    if (uniqueUids.length > 0 && !uniqueUids.includes(actualConsultantUid)) {
                        // Fallback: assume the higher UID is the consultant (e.g. 2001 vs 1001)
                        actualConsultantUid = Math.max(...uniqueUids);
                    }

                    const formattedTranscript = history
                        .filter((item: any) => item.isFinal && item.text?.trim())
                        .map((item: any) => {
                            let speakerName = "Client";
                            if (item.speakerRole) {
                                speakerName = item.speakerRole.toLowerCase() === 'consultant' ? 'Consultant' : 'Client';
                            } else {
                                speakerName = Number(item.speakerUid) === actualConsultantUid ? "Consultant" : "Client";
                            }
                            return `${speakerName}: ${item.text}`;
                        })
                        .join("\n");
                    
                    if (formattedTranscript) {
                        setConversation(formattedTranscript);
                        toast.success("Transcript fetched automatically!");
                    } else {
                        // Keep whatever user typed if transcript comes back empty
                    }
                }
            } catch (error) {
                console.error("Failed to fetch transcript:", error);
                // We don't show a toast error here to avoid annoying the user on random typing
            } finally {
                setFetchingTranscript(false);
            }
        };

        const timer = setTimeout(() => {
            fetchTranscript();
        }, 1000);

        return () => clearTimeout(timer);
    }, [consultationId, user]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
            setImages([...images, { name: file.name, size: `${sizeInMB} MB`, file }]);
        }
    };

    const addLink = () => {
        if (newLink && newLink.trim() !== "") {
            setLinks([...links, newLink.trim()]);
            setNewLink("");
        }
    };

    const handleFinalize = async () => {
        if (!consultationId) {
            toast.error("Please enter a consultation ID.");
            return;
        }

        setSending(true);
        try {
            const formData = new FormData();
            formData.append("consultationId", consultationId);
            formData.append("conversation", conversation);
            formData.append("reportSummary", reportSummary);
            
            links.forEach(link => {
                formData.append("links", link);
            });
            
            images.forEach(img => {
                formData.append("images", img.file);
            });

            console.log("Sending report FormData:", formData);
            const response = await api.post("/report", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            if (response.data.success) {
                toast.success("Consultation report finalized successfully!");
                setTimeout(() => {
                    router.push('/consultant/reports');
                }, 2000);
            }
        } catch (error: any) {
            console.error("Error finalizing report:", error);
            toast.error(error.response?.data?.message || "Failed to finalize report.");
        } finally {
            setSending(false);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const removeLink = (index: number) => {
        setLinks(links.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50 p-6 md:p-8 lg:p-10 space-y-8 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col gap-4">
                <Button 
                    variant="ghost" 
                    onClick={() => router.back()} 
                    className="w-fit text-slate-500 hover:text-slate-900 -ml-2 rounded-xl"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Reports
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Consultation Report</h1>
                    <p className="text-slate-500 mt-1">Submit your conversation summary and resources.</p>
                </div>
            </div>

            {/* Main Content Card */}
            <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
                <CardContent className="p-0">
                    {/* Consultation ID */}
                    <div className="p-6 md:p-8">
                        <div className="space-y-2 max-w-md">
                            <Label htmlFor="consultationId" className="text-sm font-medium text-slate-700">Consultation ID</Label>
                            <div className="relative">
                                <Input 
                                    id="consultationId"
                                    className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-blue-500/20 pr-10"
                                    value={consultationId}
                                    onChange={(e) => setConsultationId(e.target.value)}
                                    placeholder="e.g. 69ffc3623764570a2d6c35b9"
                                />
                                {fetchingTranscript && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-slate-100" />

                    {/* Main Editor and Sidebar */}
                    <div className="flex flex-col lg:flex-row min-h-[500px]">
                        {/* Editor Section */}
                         <div className="flex-1 p-6 md:p-8 space-y-6">
                             <div className="space-y-3">
                                 <Label className="text-lg font-bold text-slate-900 flex items-center justify-between">
                                     <span>Conversation Transcript</span>
                                     {fetchingTranscript && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                                 </Label>
                                 <Textarea 
                                    className="min-h-[200px] text-base border border-slate-200 rounded-2xl p-4 focus-visible:ring-blue-500/20 resize-none placeholder:text-slate-400 bg-slate-50"
                                    placeholder="user: Hello, sir!&#10;consultant: how can i help you.&#10;user: i feel headache.&#10;consultant: taka napa 2X time"
                                    value={conversation}
                                    onChange={(e) => setConversation(e.target.value)}
                                />
                             </div>
                             
                             <div className="space-y-3 flex-1 flex flex-col">
                                <Label className="text-lg font-bold text-slate-900">
                                    Report Summary <span className="text-red-500">*</span>
                                </Label>
                                <Textarea 
                                    className="flex-1 min-h-[250px] text-base border-slate-200 rounded-xl p-5 focus-visible:ring-blue-500/20 resize-none placeholder:text-slate-400 bg-white shadow-sm"
                                    placeholder="Write your detailed consultation report summary here..."
                                    value={reportSummary}
                                    onChange={(e) => setReportSummary(e.target.value)}
                                />
                             </div>
                        </div>

                        {/* Sidebar Section */}
                        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-50 p-6 md:p-8 space-y-8 bg-slate-50/30">
                            
                            {/* Links */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                                    <LinkIcon className="h-4 w-4 text-slate-500" />
                                    <span>Helpful Links</span>
                                </div>
                                <div className="flex gap-2">
                                    <Input 
                                        placeholder="https://..." 
                                        value={newLink}
                                        onChange={(e) => setNewLink(e.target.value)}
                                        className="h-10 rounded-xl bg-white border-slate-200 focus:ring-blue-500/20 text-sm"
                                        onKeyDown={(e) => e.key === 'Enter' && addLink()}
                                    />
                                    <Button onClick={addLink} variant="secondary" className="h-10 rounded-xl px-3 bg-blue-50 text-blue-600 hover:bg-blue-100">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {links.map((link, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-sm group hover:border-blue-200 transition-colors">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-blue-50 text-blue-500 shrink-0">
                                                    <LinkIcon className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium text-slate-700 truncate">{link}</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => removeLink(idx)}
                                                className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Images */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                                    <ImageIcon className="h-4 w-4 text-slate-500" />
                                    <span>Images / Photos</span>
                                </div>
                                <div 
                                    className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center space-y-3 bg-white hover:bg-slate-50/50 transition-colors cursor-pointer group"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                                        <ImageIcon className="h-5 w-5" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-slate-600">Attach Photo</p>
                                        <p className="text-[11px] text-slate-400 mt-1">JPG, PNG (Max 5MB)</p>
                                    </div>
                                </div>
                                
                                {/* Dynamic Images List */}
                                <div className="space-y-2">
                                    {images.map((file, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-sm group">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 bg-orange-50 text-orange-500">
                                                    <ImageIcon className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium text-slate-700 truncate">{file.name}</p>
                                                    <p className="text-[10px] text-slate-400">{file.size}</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => removeImage(idx)}
                                                className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Bottom Actions Footer */}
            <div className="flex justify-end items-center gap-4 pt-4 border-t border-slate-100">
                <Button 
                    onClick={handleFinalize}
                    disabled={sending}
                    className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transition-all font-semibold border-none disabled:opacity-50"
                >
                    <Send className="mr-2 h-4 w-4" />
                    {sending ? "Sending..." : "Submit Report"}
                </Button>
            </div>
        </div>
    );
}

export default function ReportsCreatePage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>}>
            <CreateReportContent />
        </Suspense>
    );
}
