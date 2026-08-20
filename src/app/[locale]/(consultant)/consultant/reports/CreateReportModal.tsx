"use client";

import { Send, Image as ImageIcon, Link as LinkIcon, Plus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import React, { useState, useRef, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface CreateReportModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    consultationId?: string;
    onSuccess?: () => void;
}

export function CreateReportModal({ open, onOpenChange, consultationId: initialId, onSuccess }: CreateReportModalProps) {
    const [images, setImages] = useState<{ name: string; size: string; file: File }[]>([]);
    const [links, setLinks] = useState<string[]>([]);
    const [newLink, setNewLink] = useState("");
    const [consultationId, setConsultationId] = useState(initialId || "");
    const [conversation, setConversation] = useState("");
    const [reportSummary, setReportSummary] = useState("");
    const [sending, setSending] = useState(false);
    const [fetchingTranscript, setFetchingTranscript] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user } = useAuth();

    // Reset state when modal opens with a new ID
    useEffect(() => {
        if (open) {
            setConsultationId(initialId || "");
            setImages([]);
            setLinks([]);
            setNewLink("");
            setConversation("");
            setReportSummary("");
        }
    }, [open, initialId]);

    // Debounced automatic transcript fetching logic
    useEffect(() => {
        if (!open) return;
        const fetchTranscript = async () => {
            if (!consultationId || consultationId.length < 10) return;
            
            setFetchingTranscript(true);
            try {
                const res = await api.get(`/transcription/${consultationId}/history`);
                const history = res.data?.data || res.data || [];
                
                if (Array.isArray(history) && history.length > 0) {
                    const uniqueUids = Array.from(new Set(history.map((item: any) => Number(item.speakerUid)).filter((uid: number) => !isNaN(uid))));
                    
                    let actualConsultantUid = typeof user?.uid === 'number' ? user.uid : 2001;
                    if (uniqueUids.length > 0 && !uniqueUids.includes(actualConsultantUid)) {
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
                    }
                }
            } catch (error) {
                console.error("Failed to fetch transcript:", error);
            } finally {
                setFetchingTranscript(false);
            }
        };

        const timer = setTimeout(() => {
            fetchTranscript();
        }, 1000);

        return () => clearTimeout(timer);
    }, [consultationId, user, open]);

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

            const response = await api.post("/report", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            if (response.data.success) {
                toast.success("Consultation report finalized successfully!");
                onOpenChange(false);
                if (onSuccess) onSuccess();
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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl lg:max-w-5xl p-0 overflow-hidden bg-white rounded-[2rem] gap-0 border-none shadow-2xl max-h-[90vh] flex flex-col">
                <DialogHeader className="p-6 md:p-8 pb-4 bg-white border-b border-slate-100 flex-shrink-0">
                    <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">Consultation Report</DialogTitle>
                    <DialogDescription className="text-slate-500 mt-1">Submit your conversation summary and resources.</DialogDescription>
                </DialogHeader>
                
                <div className="flex-1 overflow-y-auto">
                    {/* Main Editor and Sidebar */}
                    <div className="flex flex-col lg:flex-row min-h-[400px]">
                        {/* Editor Section */}
                        <div className="flex-1 p-6 md:p-8 space-y-6 bg-white flex flex-col">
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                                    <span>Conversation Transcript</span>
                                    {fetchingTranscript && <Loader2 className="h-3 w-3 animate-spin text-blue-500" />}
                                </Label>
                                <Textarea
                                    className="h-[160px] w-full text-sm border-slate-200 rounded-xl p-4 focus-visible:ring-blue-500/20 resize-none placeholder:text-slate-400 bg-white shadow-sm custom-scrollbar"
                                    placeholder={fetchingTranscript ? "Fetching transcript..." : "Write or edit the conversation transcript here..."}
                                    value={conversation}
                                    onChange={(e) => setConversation(e.target.value)}
                                />
                            </div>
                            
                            <div className="space-y-3 flex-1 flex flex-col">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
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
                        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-100 p-6 md:p-8 space-y-8 bg-slate-50/30">
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
                                <div className="space-y-2 max-h-32 overflow-y-auto">
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
                                <div className="space-y-2 max-h-32 overflow-y-auto">
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
                </div>
                
                {/* Bottom Actions Footer */}
                <div className="flex justify-end items-center gap-4 p-4 md:p-6 border-t border-slate-100 bg-white shrink-0">
                    <Button 
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-12 px-6 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleFinalize}
                        disabled={sending}
                        className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transition-all font-semibold border-none disabled:opacity-50"
                    >
                        <Send className="mr-2 h-4 w-4" />
                        {sending ? "Sending..." : "Submit Report"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
