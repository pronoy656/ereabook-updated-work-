/**
 * Centralized Application Configuration & URL Helpers
 */

export const DEFAULT_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://nayem5000.binarybards.online/api/v1";

/**
 * Returns the base API URL (e.g. "https://domain.com/api/v1")
 */
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
}

/**
 * Returns the backend server origin without the `/api/v1` path
 * e.g. "https://domain.com/api/v1" -> "https://domain.com"
 */
export function getServerOrigin(): string {
  const apiUrl = getApiBaseUrl();
  try {
    const url = new URL(apiUrl);
    return url.origin;
  } catch {
    return apiUrl.replace(/\/api\/v1\/?$/, "");
  }
}

/**
 * Returns the Socket.io server connection URL
 */
export function getSocketUrl(): string {
  return process.env.NEXT_PUBLIC_SOCKET_URL || getServerOrigin();
}
