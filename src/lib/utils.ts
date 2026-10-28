import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getServerOrigin } from "./config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(imagePath?: string | null): string | undefined {
  if (!imagePath) return undefined;
  
  const normalizedPath = imagePath.replace(/\\/g, '/');
  if (normalizedPath.startsWith('http') || normalizedPath.startsWith('data:') || normalizedPath.startsWith('blob:')) {
    return normalizedPath;
  }
  
  const origin = getServerOrigin();
  return `${origin}${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}`;
}

/**
 * Normalizes inconsistent backend list responses into a standard array.
 */
export function extractList(res: any): any[] {
  if (!res) return [];
  const payload = res.data?.data !== undefined ? res.data.data : (res.data !== undefined ? res.data : res);
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.appointments)) return payload.appointments;
  if (Array.isArray(payload?.bookings)) return payload.bookings;
  if (Array.isArray(payload?.history)) return payload.history;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}
