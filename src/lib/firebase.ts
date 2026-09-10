"use client";

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getMessaging, getToken, onMessage, Messaging, isSupported } from "firebase/messaging";
import Cookies from "js-cookie";
import api from "@/lib/axios";
import { audioManager } from "@/lib/audioManager";
import { toast } from "sonner";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCGyiEUvWbGjoGo8C6Vp_2afFUs8lQDfIw",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "fixpair-606c8.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "fixpair-606c8",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "fixpair-606c8.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "827439833710",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:827439833710:web:a77dbd173624ce0cd3fc7f",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-633FNVWVTE",
};

const VAPID_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ||
  "BOCrNH1eoAoSr4U4tsXK-fpIiPDNOeEYYLwbMRIwddDLiK5EW5iFO3Qo-rn6dkAneWzZ_zP3smZeFLDqkzv5D-k";

let app: FirebaseApp | null = null;
let messaging: Messaging | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }
  return app;
}

export async function getFirebaseMessaging(): Promise<Messaging | null> {
  if (typeof window === "undefined") return null;

  const supported = await isSupported().catch(() => false);
  if (!supported) {
    console.warn("Firebase Messaging is not supported in this browser environment.");
    return null;
  }

  if (!messaging) {
    const firebaseApp = getFirebaseApp();
    messaging = getMessaging(firebaseApp);
  }
  return messaging;
}

/**
 * Registers browser service worker and sends FCM Web Push Device Token to the Fixpair backend
 */
export async function initWebPush(userJwtToken?: string): Promise<string | null> {
  if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator)) {
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Push notification permission not granted:", permission);
      return null;
    }

    // Register Firebase Service Worker
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
      scope: "/",
    });
    await navigator.serviceWorker.ready;

    const msgInstance = await getFirebaseMessaging();
    if (!msgInstance) return null;

    // Obtain FCM Device Token with VAPID Key
    const currentToken = await getToken(msgInstance, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (currentToken) {
      console.log("🔥 FCM Web Push Token generated successfully:", currentToken);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("fcm_device_token", currentToken);
        } catch {}
      }

      // Save device token to Fixpair backend
      const token = userJwtToken || Cookies.get("accessToken");
      if (token) {
        try {
          const response = await api.post("/user/device-token", {
            deviceToken: currentToken,
            deviceType: "web",
            action: "add",
          });
          console.log("✅ Device token registered with backend:", response.data);
        } catch (apiErr) {
          console.warn("Notice: Failed to send device token to backend:", apiErr);
        }
      }

      // Foreground message listener
      onMessage(msgInstance, (payload) => {
        console.log("📬 Foreground FCM push received:", payload);
        const title = payload.notification?.title || payload.data?.title || "New Notification";
        const message = payload.notification?.body || payload.data?.message || "";

        audioManager.playNotificationChime();
        toast.info(title, {
          description: message,
          duration: 6000,
        });

        window.dispatchEvent(
          new CustomEvent("fixpair:new-notification", {
            detail: {
              ...payload.data,
              title,
              message,
            },
          })
        );
      });

      return currentToken;
    } else {
      console.warn("No registration token available. Request permission to generate one.");
      return null;
    }
  } catch (error) {
    console.error("An error occurred while setting up Web Push:", error);
    return null;
  }
}

/**
 * Get stored FCM push notification device token if available
 */
export function getStoredFcmToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("fcm_device_token");
  } catch {
    return null;
  }
}

/**
 * Get active FCM device token or retrieve from cache
 */
export async function getFcmToken(): Promise<string | null> {
  const cached = getStoredFcmToken();
  if (cached) return cached;
  return await initWebPush();
}

