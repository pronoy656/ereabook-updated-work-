'use client';
import React, { useState, useEffect } from 'react';
import { Star, User, MessageSquare } from 'lucide-react';
import api from '@/lib/axios';
import { getImageUrl } from '@/lib/utils';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function RecentFeedback() {
  const t = useTranslations('consultant_overview');
  const locale = useLocale();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get('/consultant/recent-feedback?limit=5');
        const data = response.data?.data || response.data;
        if (Array.isArray(data)) {
          setReviews(data.slice(0, 5));
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.error("Failed to fetch recent reviews:", err);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 w-full h-full flex flex-col transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-slate-800 dark:text-white">{t('recent_feedback')}</h3>
      </div>

      <div className="flex flex-col gap-0 w-full flex-1 min-h-0">
        <div className="flex flex-col w-full gap-1 overflow-y-auto custom-scrollbar h-full pr-2">
          {loading ? (
             <div className="py-8 text-center text-sm text-slate-500">{t('loading_feedback')}</div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 h-full text-center">
              <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-3 border border-slate-100 dark:border-slate-700">
                <MessageSquare className="w-6 h-6 text-slate-400 dark:text-slate-500" />
              </div>
              <h4 className="text-[14px] font-bold text-slate-700 dark:text-slate-300 mb-1">{t('no_feedback_yet')}</h4>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 max-w-[220px]">{t('no_feedback_desc')}</p>
            </div>
          ) : (
            reviews.map((review, index) => {
              const id = review.id || review._id || index;
              const userName = review.clientName || review.user?.name || "Client";
              const userImage = getImageUrl(review.clientImage || review.user?.image || review.user?.avatar || null);
              const rating = review.rating || 5;
              const dateStr = review.createdAt 
                ? new Date(review.createdAt).toLocaleString(locale === 'de' ? 'de-DE' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) 
                : 'Unknown Date';

              // Fallback topic badge for now since API might not have it
              const topic = review.topic || (index % 2 === 0 ? "Business Strategy" : "Marketing Strategy");
              const topicColor = index % 2 === 0 ? "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 border-purple-100 dark:border-purple-800" : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800";

              return (
                <div key={id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start py-5 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors rounded-xl px-2 -mx-2">
                  
                  {/* User info */}
                  <div className="md:col-span-4 lg:col-span-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm shrink-0 overflow-hidden border border-slate-200 dark:border-slate-700">
                      {userImage && !imageErrors[review._id || index] ? (
                        <img 
                          src={userImage} 
                          alt={userName} 
                          className="w-full h-full object-cover" 
                          onError={() => setImageErrors(prev => ({ ...prev, [id]: true }))}
                        />
                      ) : (
                         <User className="w-5 h-5" />
                      )}
                    </div>
                    <div className="md:col-span-8 lg:col-span-7 flex flex-col gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-sm block">{userName}</span>
                      <span className="text-slate-400 dark:text-slate-500 text-[11px] font-medium mt-0.5">{dateStr}</span>
                    </div>
                  </div>

                  {/* Stars and Comment */}
                  <div className="md:col-span-8 lg:col-span-7 flex flex-col gap-2">
                    <div className="flex items-center gap-1 shrink-0">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-4 h-4 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-700"}`} 
                        />
                      ))}
                    </div>
                    
                    <p className="text-slate-600 dark:text-slate-300 text-[13px] leading-relaxed">
                       {review.comment || t('default_comment')}
                    </p>
                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}