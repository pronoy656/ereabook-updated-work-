import { getApiBaseUrl, getServerOrigin } from "./config";

export const API_URL = getApiBaseUrl();

export function getServerUrl(): string {
  return getServerOrigin();
}
