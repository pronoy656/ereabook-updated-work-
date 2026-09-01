"use client";

import React, { useState } from "react";
import { Sparkles, RefreshCw, CheckCircle2, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/axios";

export interface AISummaryData {
  overview?: string;
  keyPoints?: string[];
  actionItems?: string[];
  recommendations?: string[];
}

interface AISummaryCardProps {
  consultationId?: string;
  initialSummary?: AISummaryData | null;
  onSummaryUpdated?: (summary: AISummaryData) => void;
  className?: string;
  variant?: "default" | "darkGradient";
}

export function AISummaryCard({
  consultationId,
  initialSummary,
  onSummaryUpdated,
  className = "",
  variant = "default",
}: AISummaryCardProps) {
  const [summary, setSummary] = useState<AISummaryData | null>(initialSummary || null);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const fetchOrRegenerateSummary = async (isRegenerate = false) => {
    if (!consultationId) {
      toast.error("Consultation ID is required to fetch AI Summary.");
      return;
    }

    try {
      setLoading(true);
      const method = isRegenerate ? "post" : "get";
      const toastMsg = isRegenerate ? "Regenerating AI Summary with Gemini..." : "Fetching AI Summary...";
      const toastId = toast.loading(toastMsg);

      const response = await api[method](`/report/ai-summary/${consultationId}`);
      if (response.data?.success && response.data?.data) {
        const updatedData: AISummaryData = response.data.data;
        setSummary(updatedData);
        if (onSummaryUpdated) {
          onSummaryUpdated(updatedData);
        }
        toast.success(
          isRegenerate ? "AI Summary regenerated successfully!" : "AI Summary loaded!",
          { id: toastId }
        );
      } else {
        toast.error("Could not retrieve AI summary", { id: toastId });
      }
    } catch (error: any) {
      console.error("AI Summary error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to process AI summary."
      );
    } finally {
      setLoading(false);
    }
  };

  const hasContent =
    summary &&
    (summary.overview ||
      (summary.keyPoints && summary.keyPoints.length > 0));

  const isDark = variant === "darkGradient";

  return (
    <div
      className={
        isDark
          ? `bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all ${className}`
          : `bg-gradient-to-br from-indigo-900/5 via-purple-900/5 to-slate-900/5 border border-indigo-200/60 dark:border-indigo-800/40 rounded-3xl p-6 sm:p-8 shadow-xs transition-all ${className}`
      }
    >
      {/* Card Header */}
      <div
        className={
          isDark
            ? "flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-indigo-800/50"
            : "flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-indigo-100 dark:border-indigo-900/40"
        }
      >
        <div className="flex items-center gap-3.5">
          <div
            className={
              isDark
                ? "w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 text-white shrink-0"
                : "w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white shrink-0"
            }
          >
            <Sparkles className={`w-5 h-5 animate-pulse ${isDark ? "text-amber-300" : ""}`} />
          </div>
          <div>
            <h3
              className={
                isDark
                  ? "text-xl font-black text-white tracking-tight"
                  : "text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight"
              }
            >
              Gemini AI Summary
            </h3>
            <p className={isDark ? "text-xs text-indigo-200 mt-0.5 font-medium" : "text-xs text-slate-500 dark:text-slate-400 mt-0.5"}>
              Auto-generated intelligence from live consultation transcription
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          {consultationId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchOrRegenerateSummary(true)}
              disabled={loading}
              className={
                isDark
                  ? "rounded-xl border-indigo-400/40 bg-white/10 hover:bg-white/20 text-white font-bold text-xs h-9 px-3.5 gap-1.5 shadow-sm transition-all"
                  : "rounded-xl border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 font-semibold text-xs h-9 px-3 gap-1.5 shadow-sm transition-all"
              }
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Generating..." : "Re-generate AI"}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className={
              isDark
                ? "rounded-xl text-indigo-200 hover:bg-white/10 p-2 h-9 w-9"
                : "rounded-xl text-slate-500 hover:bg-slate-200/50 p-2 h-9 w-9"
            }
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Content Area */}
      {isExpanded && (
        <div className="pt-6 space-y-6">
          {!hasContent ? (
            <div
              className={
                isDark
                  ? "text-center py-8 space-y-3 bg-white/5 rounded-2xl border border-dashed border-indigo-700/50"
                  : "text-center py-8 space-y-3 bg-white/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-indigo-200"
              }
            >
              <FileText className={`w-10 h-10 mx-auto ${isDark ? "text-indigo-400" : "text-indigo-300"}`} />
              <p className={isDark ? "text-sm font-medium text-indigo-200" : "text-sm font-medium text-slate-600 dark:text-slate-300"}>
                No AI summary available yet for this consultation.
              </p>
              {consultationId && (
                <Button
                  onClick={() => fetchOrRegenerateSummary(false)}
                  disabled={loading}
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md px-4 py-2"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Fetch Summary Now
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Executive Overview */}
              {summary.overview && (
                <div className="space-y-2">
                  <div className={`flex items-center gap-2 font-bold text-sm ${isDark ? "text-indigo-200" : "text-indigo-900 dark:text-indigo-200"}`}>
                    <FileText className={`w-4 h-4 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
                    <span>Executive Summary</span>
                  </div>
                  <div
                    className={
                      isDark
                        ? "bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl text-slate-100 text-sm leading-relaxed font-medium shadow-xs"
                        : "bg-white/80 dark:bg-slate-900/60 border border-indigo-100 dark:border-indigo-950 p-4 sm:p-5 rounded-2xl text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium shadow-xs"
                    }
                  >
                    {summary.overview}
                  </div>
                </div>
              )}

              {/* Key Discussion Points (Full Width) */}
              {summary.keyPoints && summary.keyPoints.length > 0 && (
                <div className="space-y-2">
                  <div className={`flex items-center gap-2 font-bold text-sm ${isDark ? "text-emerald-300" : "text-slate-900 dark:text-slate-100"}`}>
                    <CheckCircle2 className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                    <span>Key Discussion Points</span>
                  </div>
                  <div
                    className={
                      isDark
                        ? "bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl space-y-2.5 shadow-xs"
                        : "bg-white/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 p-4 sm:p-5 rounded-2xl space-y-2.5 shadow-xs"
                    }
                  >
                    {summary.keyPoints.map((point, idx) => (
                      <div key={idx} className={`flex items-start gap-2.5 text-xs sm:text-sm font-medium ${isDark ? "text-slate-100" : "text-slate-700 dark:text-slate-300"}`}>
                        <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${isDark ? "bg-emerald-400 shadow-xs shadow-emerald-400/50" : "bg-emerald-500"}`} />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
