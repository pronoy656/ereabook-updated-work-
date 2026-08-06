import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(imagePath?: string | null): string | undefined {
  if (!imagePath) return undefined;
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://10.10.7.106:5000/api/v1';
  let origin = 'http://10.10.7.106:5000';
  try {
    const url = new URL(apiUrl);
    origin = url.origin;
  } catch (e) {
    // Fallback handled
  }
  
  return `${origin}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
}
