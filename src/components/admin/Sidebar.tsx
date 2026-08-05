"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Activity,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  FileText,
  Headphones,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const items = [
  {
    group: "Main Menu", links: [
      { href: "/admin/overview", label: "Overview", Icon: LayoutDashboard },
      { 
        href: "/admin/users", 
        label: "Users", 
        Icon: Users,
        subLinks: [
          { href: "/admin/users/customers", label: "Customers" },
          { href: "/admin/users/consultants", label: "Consultants" }
        ]
      },
      { href: "/admin/reports", label: "Reports", Icon: FileText },
      { href: "/admin/legal", label: "Legal", Icon: FileText },
      { href: "/admin/live-monitoring", label: "Live Monitoring", Icon: Activity },
      { href: "/admin/payments", label: "Payments", Icon: CreditCard },
      { href: "/admin/support", label: "Support", Icon: Headphones },
    ]
  },
  {
    group: "Preferences", links: [
      { href: "/admin/settings", label: "Settings", Icon: Settings },
    ]
  }
];

export default function Sidebar({ active }: { active?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const current = active ?? pathname ?? "";
  
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    "Users": true
  });

  const toggleMenu = (e: React.MouseEvent, label: string) => {
    e.preventDefault();
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className="h-screen w-64 bg-white dark:bg-[#1e293b] text-slate-600 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800 fixed left-0 top-0 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-colors duration-300 z-50">
      <div className="p-8 pb-10">
        <div className="flex items-center gap-3 w-full">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <div className="w-5 h-5 bg-white rounded-sm rotate-45 flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-blue-600 rounded-px -rotate-45" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-none transition-colors">Fixpair</span>
            <span className="text-[10px] text-blue-500 font-bold uppercase tracking-[0.2em] mt-1 ml-0.5">Admin</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 space-y-8 overflow-y-auto pb-6">
        {items.map((group) => (
          <div key={group.group} className="space-y-3">
            <h4 className="px-4 text-[11px] font-bold mb-4 text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] transition-colors">
              {group.group}
            </h4>
            <nav className="space-y-1.5">
              {group.links.map((item) => {
                const hasSubLinks = !!item.subLinks;
                const isExactActive = current === item.href;
                const isChildActive = hasSubLinks && item.subLinks!.some(sub => current === sub.href);
                const isActive = isExactActive || isChildActive;
                const isOpen = openMenus[item.label];

                return (
                  <div key={item.label}>
                    <Link
                      href={hasSubLinks ? "#" : item.href}
                      onClick={(e) => hasSubLinks ? toggleMenu(e, item.label) : undefined}
                      className={cn(
                        "group flex items-center justify-between px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200",
                        !hasSubLinks && isActive
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 active:scale-95"
                          : "text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400",
                        hasSubLinks && (isOpen || isActive) && "bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.Icon className={cn(
                          "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                          (!hasSubLinks && isActive) ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400",
                          hasSubLinks && (isOpen || isActive) && "text-blue-600 dark:text-blue-400"
                        )} />
                        <span>{item.label}</span>
                      </div>
                      {hasSubLinks && (
                        <div className={cn("transition-transform duration-200", isOpen && "rotate-180")}>
                          <ChevronDown className="w-4 h-4 opacity-50" />
                        </div>
                      )}
                    </Link>
                    
                    {hasSubLinks && isOpen && (
                      <div className="mt-1 ml-4 pl-4 border-l border-slate-100 dark:border-slate-800 space-y-1 transition-colors">
                        {item.subLinks!.map(sub => {
                          const isSubActive = current === sub.href;
                          return (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              className={cn(
                                "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                                isSubActive
                                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                                  : "text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400"
                              )}
                            >
                              <span>{sub.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="p-4 mt-auto border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1e293b] transition-colors">
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-[24px] group border border-slate-100 dark:border-slate-700 transition-colors">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-600/20">
              SA
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate max-w-[100px] transition-colors">Super Admin</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 transition-colors">Admin</p>
            </div>
          </div>
          <button onClick={() => logout()} className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all duration-200 group/logout">
            <LogOut className="w-5 h-5 transition-transform group-hover/logout:-translate-x-0.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
