"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";
import api from '@/lib/axios';
import { initWebPush } from '@/lib/firebase';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  login: (token: string, userData?: any) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      let role = (user?.role || user?.userType || '').toUpperCase();
      if (!role) {
        const token = Cookies.get('accessToken');
        if (token) {
          try {
            const decoded: any = jwtDecode(token);
            role = (decoded?.role || decoded?.userType || '').toUpperCase();
          } catch {}
        }
      }

      if (role === 'CONSULTANT') {
        await api.patch('/user/toggle-status', {
          activeStatus: false,
        });
      }
    } catch (err) {
      console.error("Failed to update status to unavailable on logout:", err);
    } finally {
      Cookies.remove('accessToken');
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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
