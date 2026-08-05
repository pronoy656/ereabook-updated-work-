"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  LogOut,
  ChevronDown,
  User,
  Settings,
  CreditCard,
  Shield,
  Search,
  Sun,
  Moon
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export default function TopBar() {
  const router = useRouter();
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex items-center justify-between px-10 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1e293b] sticky top-0 z-10 h-20 transition-colors">
      <div className="flex items-center gap-8">

      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <Button variant="outline" size="icon" className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors hidden sm:flex">
          <Search className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        </Button>
        
        {/* Notifications */}
        <div className="relative hidden sm:block">
          <Button variant="outline" size="icon" className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Bell className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </Button>
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-900 transition-colors">
            8
          </span>
        </div>

        {/* Theme Toggle */}
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors mr-2"
        >
          {theme === 'dark' ? (
            <Moon className="w-4 h-4 text-slate-300" />
          ) : (
            <Sun className="w-4 h-4 text-slate-600" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 pl-2 pr-1 py-1 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all outline-none border border-transparent hover:border-slate-100 dark:hover:border-slate-700 group cursor-pointer lg:min-w-[180px]">
              <div className="hidden lg:block text-right">
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Super Admin</div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">admin@fixpair.com</div>
              </div>
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-500/20">
                  SA
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64 p-2 mt-2 rounded-[20px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border-slate-100 dark:border-slate-800 dark:bg-[#1e293b]">
            <DropdownMenuLabel className="px-3 py-4">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Account Information</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-bold">
                    SA
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Super Admin</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">Owner Account</p>
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-slate-50 dark:bg-slate-800/50 mx-2" />

            <DropdownMenuGroup className="p-1">
              <DropdownMenuItem 
                onClick={() => router.push('/admin/settings')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer focus:bg-blue-50 dark:focus:bg-blue-900/30 focus:text-blue-600 dark:focus:text-blue-400 group transition-all"
              >
                <User className="w-4 h-4 text-slate-400 dark:text-slate-500 group-focus:text-blue-600 dark:group-focus:text-blue-400" />
                <span className="font-medium dark:text-slate-300 group-focus:dark:text-blue-400">My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => router.push('/admin/settings')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer focus:bg-blue-50 dark:focus:bg-blue-900/30 focus:text-blue-600 dark:focus:text-blue-400 group transition-all"
              >
                <Settings className="w-4 h-4 text-slate-400 dark:text-slate-500 group-focus:text-blue-600 dark:group-focus:text-blue-400" />
                <span className="font-medium dark:text-slate-300 group-focus:dark:text-blue-400">Account Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-slate-50 dark:bg-slate-800/50 mx-2" />

            <div className="p-1">
              <DropdownMenuItem onClick={() => logout()} className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer text-rose-600 dark:text-rose-400 focus:bg-rose-50 dark:focus:bg-rose-950/30 focus:text-rose-700 dark:focus:text-rose-300 group transition-all">
                <div className="p-1.5 bg-rose-50 dark:bg-rose-950/30 rounded-lg group-focus:bg-rose-100 dark:group-focus:bg-rose-900/50">
                  <LogOut className="w-4 h-4" />
                </div>
                <span className="font-bold">Log out</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

