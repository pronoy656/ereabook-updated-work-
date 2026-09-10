"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";
import api from '@/lib/axios';
import { initWebPush, getStoredFcmToken } from '@/lib/firebase';
import { disconnectSocket } from '@/lib/socket';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  login: (token: string, userData?: any) => void;
  logout: () => Promise<void>;
  updateUser: (data: Partial<any>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const updateUser = (data: Partial<any>) => {
    setUser((prev: any) => (prev ? { ...prev, ...data } : data));
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get('accessToken');
      if (token) {
        let initialUser: any = { token };
        try {
          const decoded: any = jwtDecode(token);
          initialUser = { ...decoded, token };
        } catch (e) {
          initialUser = { token };
        }
        setUser(initialUser);

        // Register Web Push FCM token with backend
        initWebPush(token).catch(() => {});

        try {
          const response = await api.get('/user/profile');
          if (response.data.success && response.data.data) {
            setUser((prev: any) => ({ ...prev, ...response.data.data }));
          }
        } catch (err) {
          console.error("Failed to fetch user profile on auth init:", err);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = (token: string, userData?: any) => {
    Cookies.set('accessToken', token, { expires: 7 }); // expires in 7 days
    
    let role = '';
    try {
      const decoded: any = jwtDecode(token);
      role = decoded.role || decoded.userType || '';
      setUser({ ...decoded, ...userData, token });
    } catch (e) {
      setUser({ ...userData, token });
    }

    // Register Web Push FCM token with backend
    initWebPush(token).catch(() => {});

    // Dynamic redirection based on role
    const normalizedRole = role.toUpperCase();
    if (normalizedRole === 'SUPER_ADMIN' || normalizedRole === 'ADMIN') {
      router.push('/admin/overview');
    } else if (normalizedRole === 'CONSULTANT') {
      router.push('/consultant/overview');
    } else {
      // Fallback if role is not recognized or missing
      router.push('/login');
    }
  };

  const logout = async () => {
    try {
      const fcmToken = getStoredFcmToken();

      // Call explicit logout endpoint on backend
      await api.post('/auth/logout', {
        deviceToken: fcmToken || undefined,
      }).catch((err) => {
        console.warn("Notice: /auth/logout request:", err?.response?.data?.message || err.message);
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // 1. Disconnect socket
      disconnectSocket();

      // 2. Clear stored auth tokens & user state
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        } catch {}
      }
      setUser(null);

      // 3. Redirect to login screen
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
