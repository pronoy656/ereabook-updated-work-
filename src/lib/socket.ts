"use client";

import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { getServerUrl } from "./api-config";

let globalSocket: Socket | null = null;

export function getSocketUrl(): string {
  return getServerUrl();
}

/**
 * Creates a configured Socket.IO client instance with auth & headers preset
 */
export function createSocketConnection(customOptions: any = {}): Socket {
  const socketUrl = getSocketUrl();
  const token = Cookies.get("accessToken");
  const rawToken = token
    ? token.startsWith("Bearer ")
      ? token.slice(7).trim()
      : token.trim()
    : "";

  const { extraHeaders, auth, query, ...restOptions } = customOptions;

  return io(socketUrl, {
    transports: ["websocket", "polling"],
    extraHeaders: {

      ...(extraHeaders || {}),
    },
    auth: auth !== undefined ? auth : (rawToken ? { token: rawToken } : undefined),
    query,
    ...restOptions,
  });
}

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

  if (!globalSocket) {
    globalSocket = createSocketConnection({ autoConnect: true });

    globalSocket.on("connect", () => {
      console.log("🔌 Connected to global Socket.io server, id:", globalSocket?.id);
    });

    globalSocket.on("connect_error", (err) => {
      console.warn("🔌 Socket connection error:", err.message);
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
