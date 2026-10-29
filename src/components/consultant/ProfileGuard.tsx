"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export default function ProfileGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const isVerifiedRef = useRef(false);

  // Helper to safely check non-empty string, array, or object
  const hasValue = (val: any) => {
    if (val === null || val === undefined) return false;
    if (typeof val === 'string') return val.trim() !== '';
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === 'object') return Boolean(val._id || Object.keys(val).length > 0);
    return Boolean(val);
  };

  const checkCompletion = (profile: any) => {
    if (!profile) return false;
    return !!(
      hasValue(profile.name) &&
      hasValue(profile.email) &&
      hasValue(profile.consultancyType) &&
      profile.perMinuteRate !== undefined &&
      profile.perMinuteRate !== null
    );
  };

  useEffect(() => {
    let isMounted = true;

    // If on settings page, always allow access so consultant can complete profile
    if (pathname.includes('/consultant/settings')) {
      setIsAllowed(true);
      setLoading(false);
      return;
    }

    // If profile was already verified as complete, skip repeated network calls
    if (isVerifiedRef.current) {
      setIsAllowed(true);
      setLoading(false);
      return;
    }

    // Wait until AuthContext finishes loading
    if (authLoading) return;

    // Fast-path: Check if user in AuthContext already has all required fields
    if (user && checkCompletion(user)) {
      isVerifiedRef.current = true;
      setIsAllowed(true);
      setLoading(false);
      return;
    }

    // Fallback: Fetch latest profile if not complete in AuthContext
    const verifyProfile = async () => {
      try {
        const response = await api.get('/user/profile');
        if (response.data.success && response.data.data) {
          const profile = response.data.data;
          updateUser(profile);

          const isComplete = checkCompletion(profile);

          if (!isComplete) {
            if (!pathname.includes('/consultant/settings')) {
              if (isMounted) {
                toast.error("Please complete your profile to navigate.");
                router.replace('/consultant/settings?forced=true');
              }
            } else {
              if (isMounted) setIsAllowed(true);
            }
          } else {
            isVerifiedRef.current = true;
            if (isMounted) setIsAllowed(true);
          }
        } else {
          // If API fails to return expected data format, allow to prevent locking user out
          if (isMounted) setIsAllowed(true);
        }
      } catch (err) {
        console.error("ProfileGuard error", err);
        // Allow on error so we don't infinitely block due to network issues
        if (isMounted) setIsAllowed(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    verifyProfile();

    return () => {
      isMounted = false;
    };
  }, [pathname, router, authLoading, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
          <p className="text-slate-500 font-medium text-sm">Verifying profile...</p>
        </div>
      </div>
    );
  }
  return isAllowed ? <>{children}</> : null;
}
