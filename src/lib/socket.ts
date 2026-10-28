"use client";

import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { getSocketUrl } from "./config";

export { getSocketUrl };

let globalSocket: Socket | null = null;

/**
 * Returns a shared Socket.IO instance initialized with current auth token
 */
export function getSocket(): Socket | null {
  if (typeof window === "undefined") return null;

  if (globalSocket && globalSocket.connected) {
    return globalSocket;
  }

  const token = Cookies.get("accessToken");
  const rawToken = token
    ? token.startsWith("Bearer ")
      ? token.slice(7).trim()
      : token.trim()
    : "";

  const socketUrl = getSocketUrl();

  if (!globalSocket) {
    globalSocket = io(socketUrl, {
      transports: ["websocket", "polling"],
      auth: rawToken ? { token: rawToken } : undefined,
      query: rawToken ? { token: rawToken } : undefined,
      autoConnect: true,
    });

    globalSocket.on("connect", () => {
      if (process.env.NODE_ENV === "development") {
        console.log("🔌 Connected to global Socket.io server, id:", globalSocket?.id);
      }
    });

    globalSocket.on("connect_error", (err) => {
      if (process.env.NODE_ENV === "development") {
        console.warn("🔌 Socket connection error:", err.message);
      }
    });
  } else if (!globalSocket.connected) {
    if (rawToken) {
      globalSocket.auth = { token: rawToken };
    }
    globalSocket.connect();
  }

  return globalSocket;
}

/**
 * Disconnect and remove active socket instance
 */
export function disconnectSocket() {
  if (globalSocket) {
    try {
      globalSocket.removeAllListeners();
      globalSocket.disconnect();
    } catch (err) {
      console.error("Error disconnecting socket:", err);
    }
    globalSocket = null;
  }
}
