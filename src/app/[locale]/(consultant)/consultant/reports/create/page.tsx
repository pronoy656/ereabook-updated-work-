"use client";

import { 
    Send, Image as ImageIcon, Link as LinkIcon, Plus, X, ArrowLeft, Loader2, 
    ListOrdered, ShoppingBag, FileText, Trash2, CheckCircle2, Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, useRef, useEffect, Suspense } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface ProductInput {
    name: string;
    image?: string;
    url?: string;
    buyLink?: string;
}

function CreateReportContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialConsultationId = searchParams.get('consultationId') || "";
    const editId = searchParams.get('editId') || "";

    const [isEditing, setIsEditing] = useState(!!editId);
    const [loadingData, setLoadingData] = useState(!!editId);

    const [images, setImages] = useState<{ name: string; size: string; file: File }[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [links, setLinks] = useState<string[]>([]);
    const [newLink, setNewLink] = useState("");
    const [consultationId, setConsultationId] = useState(initialConsultationId);
    const [conversation, setConversation] = useState("");
    const [reportSummary, setReportSummary] = useState("");

    // Key Discussion Points
    const [keyPoints, setKeyPoints] = useState<string[]>([]);
    const [newKeyPoint, setNewKeyPoint] = useState("");

    // Steps Taken
    const [stepsTaken, setStepsTaken] = useState<string[]>([]);
    const [newStep, setNewStep] = useState("");

    // Recommended Products
    const [products, setProducts] = useState<ProductInput[]>([]);
    const [prodName, setProdName] = useState("");
    const [prodImageFile, setProdImageFile] = useState<File | null>(null);
    const [prodImagePreview, setProdImagePreview] = useState("");
    const [prodUrl, setProdUrl] = useState("");
    const prodFileInputRef = useRef<HTMLInputElement>(null);

    const [sending, setSending] = useState(false);
    const [fetchingTranscript, setFetchingTranscript] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user } = useAuth();
    
    // Fetch existing report for editing
    useEffect(() => {
        if (editId) {
            setLoadingData(true);
            api.get(`/report/${editId}`)
                .then(res => {
                    if (res.data?.success) {
                        const data = res.data.data;
                        if (data.consultation?._id) setConsultationId(data.consultation._id);
                        setConversation(data.conversation || "");
                        setReportSummary(data.reportSummary || data.summary || data.notes || "");
                        setKeyPoints(data.keyPoints || []);
                        setStepsTaken(data.stepsTaken || []);
                        setLinks(data.links || []);
                        setExistingImages(data.images || []);
                        if (data.recommendedProducts && Array.isArray(data.recommendedProducts)) {
                            setProducts(data.recommendedProducts.map((p: any) => ({
                                name: p.name,
                                image: p.image || "",
                                url: p.url || p.buyLink || "",
                                buyLink: p.buyLink || p.url || ""
                            })));
                        }
                    }
                })
                .catch(err => toast.error("Failed to fetch report for editing"))
                .finally(() => setLoadingData(false));
        }
    }, [editId]);

    // Debounced automatic transcript fetching logic
    useEffect(() => {
        if (isEditing) return; // Don't auto-fetch if editing
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
                        toast.success("Transcript loaded automatically!");
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
    }, [consultationId, user, isEditing]);

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

    const removeLink = (index: number) => {
        setLinks(links.filter((_, i) => i !== index));
    };

    const addKeyPoint = () => {
        if (newKeyPoint && newKeyPoint.trim() !== "") {
            setKeyPoints([...keyPoints, newKeyPoint.trim()]);
            setNewKeyPoint("");
        }
    };

    const removeKeyPoint = (index: number) => {
        setKeyPoints(keyPoints.filter((_, i) => i !== index));
    };

    const addStep = () => {
        if (newStep && newStep.trim() !== "") {
            setStepsTaken([...stepsTaken, newStep.trim()]);
            setNewStep("");
        }
    };

    const removeStep = (index: number) => {
        setStepsTaken(stepsTaken.filter((_, i) => i !== index));
    };

    const addProduct = () => {
        if (!prodName.trim()) {
            toast.error("Please provide a Product Name.");
            return;
        }
        setProducts([
            ...products,
            {
                name: prodName.trim(),
                image: prodImagePreview || "",
                url: prodUrl.trim() || "",
                buyLink: prodUrl.trim() || ""
            }
        ]);
        setProdName("");
        setProdImageFile(null);
        setProdImagePreview("");
        setProdUrl("");
        if (prodFileInputRef.current) {
            prodFileInputRef.current.value = "";
        }
    };

    const removeProduct = (index: number) => {
        setProducts(products.filter((_, i) => i !== index));
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleFinalize = async () => {
        if (!reportSummary.trim()) {
            toast.error("Please write a Report Summary.");
            return;
        }

        setSending(true);
        try {
            const formattedProducts = products.map(p => ({
                name: p.name,
                image: p.image || "",
                url: p.url || p.buyLink || "",
                buyLink: p.url || p.buyLink || ""
            }));

            const jsonPayload: any = {
                ...(consultationId ? { consultationId } : {}),
                conversation: conversation || "",
                summary: reportSummary,
                reportSummary: reportSummary,
                notes: reportSummary,
                keyPoints: keyPoints || [],
                stepsTaken: stepsTaken || [],
                recommendedProducts: formattedProducts,
                links: links || [],
                existingImages: existingImages || [],
                images: existingImages || []
            };

            // If no new File objects are being uploaded, send standard JSON to ensure all arrays/objects are properly typed for Zod
            if (images.length === 0) {
                if (isEditing) {
                    const response = await api.patch(`/report/${editId}`, jsonPayload);
                    if (response.data.success) {
                        toast.success("Report updated successfully!");
                        router.push(`/consultant/reports/${editId}`);
                    }
                } else {
                    const response = await api.post("/report", jsonPayload);
                    if (response.data.success) {
                        toast.success("Consultation report created successfully!");
                        const createdReport = response.data.data;
                        const newReportId = createdReport?._id || createdReport?.id;

                        if (newReportId) {
                            window.open(`/consultant/reports/${newReportId}`, '_blank');
                        }
                        router.push('/consultant/reports');
                    }
                }
            } else {
                // When new files are uploaded, use FormData
                const formData = new FormData();
                formData.append("data", JSON.stringify(jsonPayload));

                if (consultationId) {
                    formData.append("consultationId", consultationId);
                }
                formData.append("conversation", conversation);
                formData.append("summary", reportSummary);
                formData.append("reportSummary", reportSummary);
                formData.append("notes", reportSummary);

                keyPoints.forEach(point => {
                    formData.append("keyPoints", point);
                });

                stepsTaken.forEach(step => {
                    formData.append("stepsTaken", step);
                });

                if (formattedProducts.length > 0) {
                    formData.append("recommendedProducts", JSON.stringify(formattedProducts));
                }
                
                links.forEach(link => {
                    formData.append("links", link);
                });
                
                images.forEach(img => {
                    formData.append("images", img.file);
                });
                
                existingImages.forEach(img => {
                    formData.append("existingImages", img);
                });

                if (isEditing) {
                    const response = await api.patch(`/report/${editId}`, formData);
                    if (response.data.success) {
                        toast.success("Report updated successfully!");
                        router.push(`/consultant/reports/${editId}`);
                    }
                } else {
                    const response = await api.post("/report", formData);
                    if (response.data.success) {
                        toast.success("Consultation report created successfully!");
                        const createdReport = response.data.data;
                        const newReportId = createdReport?._id || createdReport?.id;

                        if (newReportId) {
                            window.open(`/consultant/reports/${newReportId}`, '_blank');
                        }
                        router.push('/consultant/reports');
                    }
                }
            }
        } catch (error: any) {
            console.error("Error finalizing report:", error);
            const errDetail = error.response?.data?.errorMessages?.map((e: any) => e.message).join(", ");
            toast.error(errDetail || error.response?.data?.message || "Failed to finalize report.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50 p-6 md:p-10 space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <Button 
                        variant="ghost" 
                        onClick={() => router.back()} 
                        className="w-fit text-slate-500 hover:text-slate-900 -ml-2 rounded-xl mb-2 font-bold"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to {isEditing ? 'Details' : 'Reports'}
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <FileText className="w-5 h-5" />
                        </div>
                        {isEditing ? 'Edit Consultation Report' : 'Create Consultation Report'}
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm">{isEditing ? 'Update your conversation summary, key points, steps taken, and recommendations.' : 'Submit your conversation summary, key points, steps taken, and recommendations.'}</p>
                </div>
            </div>

            {loadingData ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            ) : (
                <>
                    {/* ROW 1: Conversation Transcript & Report Summary IN THE SAME ROW */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Conversation Transcript (Left side of Row 1) */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm flex flex-col justify-between space-y-3">
                    <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-blue-500" />
                            Conversation Transcript
                        </span>
                        {fetchingTranscript && (
                            <span className="text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                                <Loader2 className="w-3 h-3 animate-spin" /> Auto-fetching...
                            </span>
                        )}
                    </Label>
                    <Textarea 
                        className="flex-1 min-h-[180px] text-xs border-slate-200 rounded-2xl p-4 focus-visible:ring-2 focus-visible:ring-blue-500/20 resize-none placeholder:text-slate-400 bg-slate-50/50 font-mono text-slate-700 leading-relaxed"
                        placeholder="Conversation log (automatically fetched or paste transcript here)..."
                        value={conversation}
                        onChange={(e) => setConversation(e.target.value)}
                    />
                </div>

                {/* Report Summary (Right side of Row 1) */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm flex flex-col justify-between space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-600" />
                            Report Summary <span className="text-red-500">*</span>
                        </Label>
                        {consultationId && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                    const toastId = toast.loading("Fetching Gemini AI Summary...");
                                    try {
                                        const res = await api.get(`/report/ai-summary/${consultationId}`);
                                        if (res.data?.success && res.data?.data) {
                                            const aiData = res.data.data;
                                            if (aiData.overview) setReportSummary(aiData.overview);
                                            if (aiData.keyPoints && Array.isArray(aiData.keyPoints)) {
                                                setKeyPoints((prev) => [...Array.from(new Set([...prev, ...aiData.keyPoints]))]);
                                            }
                                            if (aiData.actionItems && Array.isArray(aiData.actionItems)) {
                                                setStepsTaken((prev) => [...Array.from(new Set([...prev, ...aiData.actionItems]))]);
                                            }
                                            toast.success("AI Summary, Key Points & Action items imported!", { id: toastId });
                                        } else {
                                            toast.error("No AI summary found yet.", { id: toastId });
                                        }
                                    } catch (err: any) {
                                        toast.error(err?.response?.data?.message || "Failed to load AI summary.", { id: toastId });
                                    }
                                }}
                                className="h-7 px-2.5 rounded-lg border-indigo-200 bg-indigo-50/70 text-indigo-700 hover:bg-indigo-100 font-bold text-[11px] flex items-center gap-1"
                            >
                                ✨ Import Gemini AI Summary
                            </Button>
                        )}
                    </div>
                    <Textarea 
                        className="flex-1 min-h-[180px] text-sm border-slate-200 rounded-2xl p-4 focus-visible:ring-2 focus-visible:ring-blue-500/20 resize-none placeholder:text-slate-400 bg-slate-50/50 font-medium leading-relaxed"
                        placeholder="Write your detailed consultation report summary here..."
                        value={reportSummary}
                        onChange={(e) => setReportSummary(e.target.value)}
                    />
                </div>

            </div>

            {/* ROW 2: Key Discussion Points & Steps Taken (Side-by-Side 2-Column) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Key Discussion Points */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm space-y-4">
                    <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                        <span>Key Discussion Points</span>
                    </Label>
                    
                    <div className="flex gap-2">
                        <Input 
                            placeholder="e.g. Discussed boiler pressure leakage issue"
                            value={newKeyPoint}
                            onChange={(e) => setNewKeyPoint(e.target.value)}
                            className="h-11 rounded-xl bg-slate-50 border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20"
                            onKeyDown={(e) => e.key === 'Enter' && addKeyPoint()}
                        />
                        <Button 
                            type="button"
                            onClick={addKeyPoint} 
                            className="h-11 rounded-xl px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shrink-0 shadow-sm"
                        >
                            <Plus className="h-4 w-4 mr-1" /> Add
                        </Button>
                    </div>

                    {keyPoints.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                            {keyPoints.map((point, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 group transition-all hover:bg-indigo-50/80">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                                        <p className="text-xs font-semibold text-slate-800 leading-snug">{point}</p>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => removeKeyPoint(idx)}
                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all ml-2 shrink-0"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Steps Taken */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm space-y-4">
                    <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                        <ListOrdered className="w-4 h-4 text-blue-600" />
                        <span>Steps Taken</span>
                    </Label>
                    
                    <div className="flex gap-2">
                        <Input 
                            placeholder="e.g. Problem identified: hair strainer clogged"
                            value={newStep}
                            onChange={(e) => setNewStep(e.target.value)}
                            className="h-11 rounded-xl bg-slate-50 border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500/20"
                            onKeyDown={(e) => e.key === 'Enter' && addStep()}
                        />
                        <Button 
                            type="button"
                            onClick={addStep} 
                            className="h-11 rounded-xl px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 shadow-sm"
                        >
                            <Plus className="h-4 w-4 mr-1" /> Add
                        </Button>
                    </div>

                    {stepsTaken.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                            {stepsTaken.map((step, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 group transition-all hover:bg-blue-50/30">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                                            {idx + 1}
                                        </span>
                                        <p className="text-xs font-semibold text-slate-800 leading-snug">{step}</p>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => removeStep(idx)}
                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all ml-2 shrink-0"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {/* ROW 3: Recommended Products & Tools (With Full-Width Photo Attachment Box & Add Product Button Below) */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm space-y-4">
                <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-emerald-600" />
                    <span>Recommended Products & Tools</span>
                </Label>

                <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input 
                            placeholder="Product Name (e.g. Pipe Wrench)"
                            value={prodName}
                            onChange={(e) => setProdName(e.target.value)}
                            className="h-11 rounded-xl bg-white border-slate-200 text-xs font-medium"
                        />
                        <Input 
                            placeholder="Buy / Reference Link (optional, e.g. https://...)"
                            value={prodUrl}
                            onChange={(e) => setProdUrl(e.target.value)}
                            className="h-11 rounded-xl bg-white border-slate-200 text-xs font-medium"
                        />
                    </div>

                    {/* FULL-WIDTH PHOTO ATTACHMENT BOX */}
                    <div 
                        className="border-2 border-dashed border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-emerald-50/40 hover:bg-emerald-50/70 transition-all cursor-pointer group w-full"
                        onClick={() => prodFileInputRef.current?.click()}
                    >
                        <input 
                            type="file" 
                            ref={prodFileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setProdImageFile(file);
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        setProdImagePreview(reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />

                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform shrink-0">
                                <ImageIcon className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-bold text-slate-800">
                                    {prodImageFile ? `Attached Photo: ${prodImageFile.name}` : "Attach Product Photo (Click to upload)"}
                                </p>
                                <p className="text-[11px] text-slate-500 font-medium">Click to select photo for this product</p>
                            </div>
                        </div>

                        {prodImagePreview && (
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-emerald-300 shrink-0">
                                <img src={prodImagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setProdImageFile(null);
                                        setProdImagePreview("");
                                        if (prodFileInputRef.current) prodFileInputRef.current.value = "";
                                    }}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-bl p-0.5"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ADD PRODUCT BUTTON (POSITIONED BELOW ATTACH PRODUCT PHOTO) */}
                    <div className="flex justify-end pt-1">
                        <Button 
                            type="button"
                            onClick={addProduct} 
                            className="w-full sm:w-auto h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md rounded-xl flex items-center justify-center gap-2"
                        >
                            <Plus className="h-4 w-4" /> Add Product
                        </Button>
                    </div>
                </div>

                {products.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                        {products.map((prod, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm group">
                                <div className="flex items-center gap-3 min-w-0">
                                    {prod.image ? (
                                        <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-base shrink-0">
                                            🛍️
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-slate-900 truncate">{prod.name}</p>
                                        {prod.url && prod.url !== '#' && (
                                            <a href={prod.url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-medium text-blue-600 hover:underline truncate block">
                                                {prod.url}
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => removeProduct(idx)}
                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ROW 4: Helpful Links & Attached Photos (2-Column) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Helpful Links Card */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm space-y-4">
                    <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                        <LinkIcon className="w-4 h-4 text-blue-500" />
                        <span>Helpful Links</span>
                    </Label>
                    <div className="flex gap-2">
                        <Input 
                            placeholder="https://..." 
                            value={newLink}
                            onChange={(e) => setNewLink(e.target.value)}
                            className="h-10 rounded-xl bg-slate-50 border-slate-200 text-xs font-medium"
                            onKeyDown={(e) => e.key === 'Enter' && addLink()}
                        />
                        <Button 
                            type="button"
                            onClick={addLink} 
                            className="h-10 rounded-xl px-3 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs shrink-0"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    {links.length > 0 && (
                        <div className="space-y-1.5">
                            {links.map((link, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                                    <p className="text-xs font-medium text-slate-700 truncate max-w-[240px]">{link}</p>
                                    <button 
                                        type="button"
                                        onClick={() => removeLink(idx)}
                                        className="text-slate-400 hover:text-red-500 p-1 rounded-md"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Attach Photos Card */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm space-y-4">
                    <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-orange-500" />
                        <span>Attached Photos</span>
                    </Label>
                    <div 
                        className="border-2 border-dashed border-slate-200 rounded-2xl p-4 flex items-center justify-center gap-3 bg-slate-50/50 hover:bg-blue-50/30 hover:border-blue-300 transition-all cursor-pointer group"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                        <div className="h-8 w-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                            <ImageIcon className="h-4 w-4" />
                        </div>
                        <p className="text-xs font-semibold text-slate-700">Click to Attach Photo</p>
                    </div>

                    {images.length > 0 && (
                        <div className="space-y-1.5">
                            {images.map((file, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                                    <p className="text-xs font-medium text-slate-700 truncate max-w-[220px]">{file.name}</p>
                                    <button 
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="text-slate-400 hover:text-red-500 p-1 rounded-md"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {/* 🚀 SUBMIT REPORT BUTTON (AT THE VERY BOTTOM OF ALL FORMS) */}
            <div className="pt-6 pb-10 flex justify-end">
                <Button 
                    onClick={handleFinalize}
                    disabled={sending}
                    className="w-full sm:w-auto h-14 px-10 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl shadow-blue-500/25 font-black text-base border-none disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                    {sending ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            {isEditing ? 'Updating...' : 'Submitting...'}
                        </>
                    ) : (
                        <>
                            <Send className="h-5 w-5" />
                            {isEditing ? 'Update Final Report' : 'Submit Final Report'}
                        </>
                    )}
                </Button>
            </div>
            
            </>
            )}

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
