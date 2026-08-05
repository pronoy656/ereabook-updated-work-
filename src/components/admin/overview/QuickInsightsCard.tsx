import React from 'react';
import { ArrowUp, ArrowDown, AlertCircle, LifeBuoy } from 'lucide-react';

export function QuickInsightsCard() {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col h-full justify-between transition-colors">
      <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">Quick Insights</h3>
      
      <div className="grid grid-cols-2 gap-6 mb-6 flex-1">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Today's Consultations</span>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white leading-none">156</span>
            <span className="flex items-center text-[10px] font-bold text-emerald-500 pb-0.5">
              <ArrowUp className="w-2.5 h-2.5 mr-0.5" /> 12%
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Today's Revenue</span>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white leading-none">$1,245</span>
            <span className="flex items-center text-[10px] font-bold text-emerald-500 pb-0.5">
              <ArrowUp className="w-2.5 h-2.5 mr-0.5" /> 15%
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">New Users Today</span>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white leading-none">23</span>
            <span className="flex items-center text-[10px] font-bold text-emerald-500 pb-0.5">
              <ArrowUp className="w-2.5 h-2.5 mr-0.5" /> 9%
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">New Consultants</span>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white leading-none">5</span>
            <span className="flex items-center text-[10px] font-bold text-emerald-500 pb-0.5">
              <ArrowUp className="w-2.5 h-2.5 mr-0.5" /> 25%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-rose-50/50 dark:bg-rose-950/30 rounded-xl p-3 flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Pending Approvals</span>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-slate-900 dark:text-white">12</span>
            <div className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center">
              <AlertCircle className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
            </div>
          </div>
        </div>
        <div className="bg-blue-50/50 dark:bg-blue-950/30 rounded-xl p-3 flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Support Tickets</span>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-slate-900 dark:text-white">7</span>
            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
              <LifeBuoy className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
