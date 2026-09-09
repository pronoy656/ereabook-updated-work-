"use client";

/**
 * Robust cross-browser notification permission requester
 */
export async function requestDesktopNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    console.log("This browser does not support desktop notifications.");
    return "denied";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  try {
    return await new Promise<NotificationPermission>((resolve) => {
      try {
        const promise = Notification.requestPermission((result) => {
          resolve(result || Notification.permission);
        });
        if (promise && typeof promise.then === "function") {
          promise
            .then((res) => resolve(res || Notification.permission))
            .catch(() => resolve(Notification.permission));
        }
      } catch {
        resolve(Notification.permission);
      }
    });
  } catch (error) {
    console.warn("Failed to request notification permission:", error);
    return Notification.permission;
  }
}

export interface DesktopNotificationOptions {
  body?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  url?: string;
  silent?: boolean;
  data?: any;
}

/**
 * Displays an OS Desktop Notification on the screen corner without hanging
 */
export async function showDesktopNotification(
  title: string,
  options: DesktopNotificationOptions = {}
): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }

  const permission = Notification.permission;
  if (permission !== "granted") {
    console.warn("Desktop notification not shown: permission is", permission);
    return false;
  }

  const iconUrl = options.icon || "/favicon.png";
  const badgeUrl = options.badge || "/favicon.png";
  const targetUrl = options.url || "/consultant/overview";
  const notifTag = options.tag || `fixpair-notif-${Date.now()}`;

  const notifOptions: NotificationOptions = {
    body: options.body || "",
    icon: iconUrl,
    badge: badgeUrl,
    tag: notifTag,
    requireInteraction: options.requireInteraction ?? false,
    silent: options.silent ?? false,
    data: {
      url: targetUrl,
      ...(options.data || {}),
    },
  };

  // 1. Try ServiceWorkerRegistration.showNotification first if an active SW exists (non-blocking)
  if ("serviceWorker" in navigator) {
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && reg.active && typeof reg.showNotification === "function") {
        await reg.showNotification(title, notifOptions);
        return true;
      }
    } catch (swErr) {
      console.warn("SW showNotification attempt failed, falling back to standard notification:", swErr);
    }
  }

  // 2. Standard Window Notification fallback (immediate execution)
  try {
    const notification = new Notification(title, notifOptions);

    notification.onclick = (e) => {
      e.preventDefault();
      window.focus();
      if (targetUrl) {
        window.location.href = targetUrl;
      }
      notification.close();
    };

    return true;
  } catch (err) {
    console.warn("Failed to create standard Notification:", err);
    return false;
  }
}
