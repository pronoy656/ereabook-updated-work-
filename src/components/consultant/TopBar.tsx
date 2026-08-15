"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  LogOut,
  ChevronDown,
  User,
  Settings,
  Search
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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/utils";

const getInitials = (name?: string) => {
  if (!name) return 'C';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

export default function TopBar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isAvailable, setIsAvailable] = useState(user?.activeStatus ?? true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    if (user && user.activeStatus !== undefined) {
      setIsAvailable(user.activeStatus);
    }
    
    // Fetch latest profile to get accurate activeStatus on refresh
    const fetchStatus = async () => {
      try {
        const response = await api.get('/user/profile');
        if (response.data.success && response.data.data) {
          setProfileData(response.data.data);
          if (response.data.data.activeStatus !== undefined) {
            setIsAvailable(response.data.data.activeStatus);
          }
        }
      } catch (err) {
        console.error("Failed to fetch current status", err);
      }
    };
    
    fetchStatus();
  }, [user]);

  const updateStatus = async (newStatus: boolean) => {
    try {
      setIsAvailable(newStatus);
      const response = await api.patch('/user/toggle-status', {
        activeStatus: newStatus
      });
      if (response.data.success) {
        toast.success(`Status updated to ${newStatus ? 'Available' : 'Unavailable'}`);
      } else {
        setIsAvailable(!newStatus);
        toast.error("Failed to update status");
      }
    } catch (err: any) {
      console.error("Status update error", err);
      setIsAvailable(!newStatus);
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleToggle = (checked: boolean) => {
    if (!checked) {
      setShowConfirmDialog(true);
    } else {
      updateStatus(true);
    }
  };

  const confirmUnavailable = () => {
    updateStatus(false);
    setShowConfirmDialog(false);
  };

  return (
    <div className="flex items-center justify-between px-10 py-4 border-b border-slate-100 bg-white sticky top-0 z-10 h-20">
      <div className="flex items-center gap-8">


      </div>

      <div className="flex items-center gap-6">

        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-full border border-slate-100 hidden sm:flex">
          <span className={`text-xs font-bold ${isAvailable ? 'text-emerald-600' : 'text-slate-400'}`}>
            {isAvailable ? 'Available' : 'Unavailable'}
          </span>
          <Switch 
            checked={isAvailable} 
            onCheckedChange={handleToggle} 
            className="data-[state=checked]:bg-emerald-500"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 hover:bg-slate-50 rounded-full transition-colors cursor-pointer outline-none group">
              <Bell className="w-5 h-5 text-slate-500 group-hover:text-emerald-600 transition-colors" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-2 mt-2 rounded-[20px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border-slate-100">
            <div className="flex items-center justify-between px-3 py-2">
              <h3 className="font-bold text-slate-800">Notifications</h3>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">2 New</span>
            </div>
            <DropdownMenuSeparator className="bg-slate-50 mx-2" />
            <div className="max-h-[350px] overflow-y-auto p-1 flex flex-col gap-0.5">
              {[
                { id: 1, title: "New Callback Request", message: "You have a new callback request from John Doe.", time: "2m ago", isNew: true },
                { id: 2, title: "Booking Confirmed", message: "Your 3:00 PM booking with Sarah has been confirmed.", time: "1h ago", isNew: true },
                { id: 3, title: "Payment Received", message: "Payment for your recent consultation was successful.", time: "2h ago", isNew: false },
                { id: 4, title: "Reminder", message: "Don't forget to update your availability for next week.", time: "1d ago", isNew: false },
                { id: 5, title: "System Update", message: "The platform will undergo maintenance this Sunday.", time: "2d ago", isNew: false },
              ].map(notification => (
                <DropdownMenuItem key={notification.id} className={`flex flex-col items-start gap-1.5 p-3 rounded-xl cursor-pointer transition-all outline-none ${notification.isNew ? 'bg-blue-50/50 hover:bg-blue-50 focus:bg-blue-50' : 'hover:bg-slate-50 focus:bg-slate-50'}`}>
                  <div className="flex items-center justify-between w-full gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-semibold text-slate-800 truncate">{notification.title}</span>
                      {notification.isNew && (
                        <span className="text-[9px] font-bold text-white bg-blue-500 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">New</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium shrink-0">{notification.time}</span>
                  </div>
                  <p className={`text-xs line-clamp-2 ${notification.isNew ? 'text-slate-600' : 'text-slate-500'}`}>{notification.message}</p>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator className="bg-slate-50 mx-2" />
            <div className="p-1">
              <Button variant="ghost" className="w-full text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl py-2 h-auto">
                Mark all as read
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 pl-2 pr-1 py-1 hover:bg-slate-50 rounded-2xl transition-all outline-none border border-transparent hover:border-slate-100 group cursor-pointer lg:min-w-[180px]">
              <div className="hidden lg:block text-right">
                <div className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{profileData?.name || user?.name || "Consultant"}</div>
                <div className="text-[11px] text-slate-400 font-medium">{profileData?.email || user?.email || ""}</div>
              </div>
              <div className="relative">
                {profileData?.image || user?.image ? (
                  <img src={getImageUrl(profileData?.image || user?.image)} alt={profileData?.name || user?.name || "Avatar"} className="h-10 w-10 rounded-xl object-cover" />
                ) : (
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-emerald-500/20">
                    {getInitials(profileData?.name || user?.name)}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64 p-2 mt-2 rounded-[20px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border-slate-100">
            <DropdownMenuLabel className="px-3 py-4">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Account Information</p>
                <div className="flex items-center gap-3 mt-1">
                  {profileData?.image || user?.image ? (
                    <img src={getImageUrl(profileData?.image || user?.image)} alt={profileData?.name || user?.name || "Avatar"} className="h-10 w-10 rounded-lg object-cover" />
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 text-sm font-bold">
                      {getInitials(profileData?.name || user?.name)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-slate-800">{profileData?.name || user?.name || "Consultant"}</p>
                    <p className="text-[11px] text-slate-400 capitalize">{profileData?.role || user?.role || "Consultant"}</p>
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-slate-50 mx-2" />

            <DropdownMenuGroup className="p-1">
              <DropdownMenuItem 
                onClick={() => router.push('/consultant/settings')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer focus:bg-emerald-50 focus:text-emerald-600 group transition-all"
              >
                <User className="w-4 h-4 text-slate-400 group-focus:text-emerald-600" />
                <span className="font-medium">My Profile</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-slate-50 mx-2" />

            <div className="p-1">
              <DropdownMenuItem onClick={() => logout()} className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer text-rose-600 focus:bg-rose-50 focus:text-rose-700 group transition-all">
                <div className="p-1.5 bg-rose-50 rounded-lg group-focus:bg-rose-100">
                  <LogOut className="w-4 h-4" />
                </div>
                <span className="font-bold">Log out</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Set Status to Unavailable?</DialogTitle>
            <DialogDescription className="mt-2">
              You will not receive any new instant consultation requests while you are unavailable. Are you sure you want to go offline?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmUnavailable}>Go Unavailable</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

