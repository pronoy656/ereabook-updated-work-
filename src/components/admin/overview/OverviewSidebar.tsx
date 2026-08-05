import React from 'react';
import Link from 'next/link';
import { UserPlus, ShieldCheck, Users, LayoutGrid, FileText, Settings, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OverviewSidebar() {
  const notifications = [
    { id: 1, text: 'Pending consultant approvals', count: 12, bg: 'bg-purple-100', color: 'text-purple-600' },
    { id: 2, text: 'Failed payments', count: 3, bg: 'bg-amber-100', color: 'text-amber-600' },
    { id: 3, text: 'New reviews received', count: 8, bg: 'bg-emerald-100', color: 'text-emerald-600' },
    { id: 4, text: 'New support messages', count: 4, bg: 'bg-blue-100', color: 'text-blue-600' },
  ];

  const quickActions = [
    { text: 'Add Consultant', icon: UserPlus, href: '/admin/consultants/new', bg: 'bg-purple-50', color: 'text-purple-600' },
    { text: 'Approve Consultants', icon: ShieldCheck, href: '/admin/consultants?tab=pending', bg: 'bg-emerald-50', color: 'text-emerald-600' },
    { text: 'View All Users', icon: Users, href: '/admin/users', bg: 'bg-blue-50', color: 'text-blue-600' },
    { text: 'Manage Categories', icon: LayoutGrid, href: '/admin/categories', bg: 'bg-amber-50', color: 'text-amber-600' },
    { text: 'View Reports', icon: FileText, href: '/admin/reports', bg: 'bg-purple-50', color: 'text-purple-600' },
    { text: 'Platform Settings', icon: Settings, href: '/admin/settings', bg: 'bg-slate-100', color: 'text-slate-600' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      {/* Notifications Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-800">Notifications</h3>
          <Link href="/admin/notifications" className="text-xs font-bold text-blue-600 hover:text-blue-700">
            View all
          </Link>
        </div>
        
        <div className="flex flex-col gap-4">
          {notifications.map((notif) => (
            <div key={notif.id} className="flex items-center gap-4 group cursor-pointer">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold", notif.bg, notif.color)}>
                {notif.count}
              </div>
              <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                {notif.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-base font-bold text-slate-800 mb-4">Quick Actions</h3>
        
        <div className="flex flex-col gap-2">
          {quickActions.map((action, idx) => (
            <Link 
              key={idx} 
              href={action.href}
              className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", action.bg)}>
                  <action.icon className={cn("w-4 h-4", action.color)} />
                </div>
                <span className="text-sm font-semibold text-slate-700">{action.text}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
