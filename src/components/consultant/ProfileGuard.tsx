"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function ProfileGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkProfile = async () => {
      try {
        const response = await api.get('/user/profile');
        if (response.data.success && response.data.data) {
          const profile = response.data.data;
          
          // Check if all mandatory fields are filled
          const isComplete = !!(
            profile.name &&
            profile.name.trim() !== '' &&
            profile.email &&
            profile.email.trim() !== '' &&
            profile.consultancyType &&
            profile.consultancyType.trim() !== '' &&
            profile.perMinuteRate !== undefined &&
            profile.perMinuteRate !== null
          );

          if (!isComplete) {
            if (pathname !== '/consultant/settings') {
              if (isMounted) {
                toast.error("Please complete your profile to navigate.");
                router.replace('/consultant/settings?forced=true');
              }
            } else {
              if (isMounted) setIsAllowed(true);
            }
          } else {
            if (isMounted) setIsAllowed(true);
          }
        } else {
          // If API fails to return expected data format, allow to prevent locking user out completely
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

    checkProfile();

    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

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

  // Only render children if allowed. 
  // If not allowed, it means a redirect is in progress, so render nothing.
  return isAllowed ? <>{children}</> : null;
}
