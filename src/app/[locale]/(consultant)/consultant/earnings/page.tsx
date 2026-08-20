"use client";

import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  ExternalLink,
  Banknote
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

// Mock data for initial implementation
const summaryMetrics = {
  totalEarnings: 3450.50,
  pendingBalance: 450.00,
  availableToWithdraw: 3000.50,
};

const recentTransactions = [
  {
    id: 'tr_1',
    date: new Date(2026, 7, 4, 14, 30),
    client: 'David Smith',
    durationMinutes: 45,
    amount: 112.50,
    status: 'completed'
  },
  {
    id: 'tr_2',
    date: new Date(2026, 7, 3, 10, 15),
    client: 'Sarah Connor',
    durationMinutes: 30,
    amount: 75.00,
    status: 'completed'
  },
  {
    id: 'tr_3',
    date: new Date(2026, 7, 3, 16, 0),
    client: 'John Doe',
    durationMinutes: 60,
    amount: 150.00,
    status: 'completed'
  },
  {
    id: 'tr_4',
    date: new Date(2026, 7, 5, 9, 30), // Today
    client: 'Alice Wonderland',
    durationMinutes: 20,
    amount: 50.00,
    status: 'pending' // Still processing with Stripe
  }
].sort((a, b) => b.date.getTime() - a.date.getTime());

export default function EarningsPage() {
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdraw = () => {
    setIsWithdrawing(true);
    // Simulate API call to request payout or redirect to Stripe Express dashboard
    setTimeout(() => {
      toast.success("Withdrawal initiated successfully! Funds should appear in your bank account soon.", {
        icon: <Banknote className="w-5 h-5 text-emerald-500" />
      });
      setIsWithdrawing(false);
    }, 1500);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Earnings & Payouts</h1>
          <p className="text-slate-500 mt-2">Manage your consultation earnings and request withdrawals.</p>
        </div>
        <button 
          onClick={handleWithdraw}
          disabled={isWithdrawing || summaryMetrics.availableToWithdraw <= 0}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isWithdrawing ? (
             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Wallet className="w-5 h-5" />
              Withdraw Funds
            </>
          )}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Earnings */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Earnings</h3>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Banknote className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900 font-mono tracking-tighter">
            ${summaryMetrics.totalEarnings.toFixed(2)}
          </div>
          <div className="mt-2 text-sm text-slate-400">
            Lifetime earnings from all consultations
          </div>
        </div>

        {/* Pending Balance */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider">Pending</h3>
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900 font-mono tracking-tighter">
            ${summaryMetrics.pendingBalance.toFixed(2)}
          </div>
          <div className="mt-2 text-sm text-slate-400">
            Currently processing via Stripe
          </div>
        </div>

        {/* Available to Withdraw */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 shadow-xl shadow-emerald-600/20 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-emerald-100 uppercase tracking-wider">Available</h3>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-black text-white font-mono tracking-tighter">
            ${summaryMetrics.availableToWithdraw.toFixed(2)}
          </div>
          <div className="mt-2 text-sm text-emerald-100 flex items-center gap-1">
            Ready to be transferred <ArrowUpRight className="w-4 h-4 opacity-70" />
          </div>
        </div>
      </div>

      {/* Stripe Connect Notice */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-indigo-900">Manage Stripe Connect</h4>
          <p className="text-sm text-indigo-700 mt-1 max-w-2xl">
            Update your bank account details, view detailed tax forms, and track individual payout schedules directly in your Stripe Express dashboard.
          </p>
        </div>
        <button className="shrink-0 px-5 py-2.5 bg-white border border-indigo-200 text-indigo-700 font-bold rounded-xl text-sm shadow-sm hover:bg-indigo-50 transition-colors flex items-center gap-2 cursor-pointer">
          View Dashboard <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Transaction History */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-4 font-bold border-b border-slate-100">Date & Time</th>
                <th className="px-6 py-4 font-bold border-b border-slate-100">Client</th>
                <th className="px-6 py-4 font-bold border-b border-slate-100">Duration</th>
                <th className="px-6 py-4 font-bold border-b border-slate-100">Status</th>
                <th className="px-6 py-4 font-bold border-b border-slate-100 text-right">Amount</th>
                <th className="px-6 py-4 font-bold border-b border-slate-100 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900">{format(tx.date, 'MMM dd, yyyy')}</div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">{format(tx.date, 'h:mm a')}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900">{tx.client}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-500">{tx.durationMinutes} mins</div>
                  </td>
                  <td className="px-6 py-4">
                    {tx.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100">
                        <Clock className="w-3.5 h-3.5" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-bold text-slate-900 font-mono tracking-tight">+${tx.amount.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {recentTransactions.length === 0 && (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
              <Banknote className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No transactions yet</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Once you complete your first consultation, your earnings and transaction history will appear here.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
