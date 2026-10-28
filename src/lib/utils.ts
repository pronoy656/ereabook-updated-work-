import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getServerUrl } from "./api-config"
export { getServerUrl } from "./api-config"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFileUrl(filePath?: string | null): string {
  if (!filePath) return '';
  const normalizedPath = filePath.replace(/\\/g, '/');
  if (normalizedPath.startsWith('http') || normalizedPath.startsWith('data:') || normalizedPath.startsWith('blob:')) {
    return normalizedPath;
  }
  const origin = getServerUrl();
  return `${origin}${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}`;
}

export function getImageUrl(imagePath?: string | null): string | undefined {
  if (!imagePath) return undefined;
  return getFileUrl(imagePath);
}
