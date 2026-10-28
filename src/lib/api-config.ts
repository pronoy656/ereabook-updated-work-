export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://10.10.7.106:5000/api/v1';

export function getServerUrl(): string {
  return new URL(API_URL).origin;
}
