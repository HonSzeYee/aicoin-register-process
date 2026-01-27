import { AccountChecklistItem, DevReadMap } from "@/context/AppStateContext";

export type ProgressPayload = {
  userName: string;
  accountItems: AccountChecklistItem[];
  devReadMap: DevReadMap;
  updatedAt: string;
};

const DEFAULT_ENDPOINT = "/api/onboarding/progress";
const API_BASE = import.meta.env.VITE_ONBOARDING_API_BASE ?? "";
const PROGRESS_ENDPOINT = API_BASE ? `${API_BASE}${DEFAULT_ENDPOINT}` : DEFAULT_ENDPOINT;

export function shouldSyncProgress() {
  if (typeof window === "undefined") return false;
  if (navigator && typeof navigator.onLine === "boolean") {
    return navigator.onLine;
  }
  return true;
}

export async function fetchProgress(signal?: AbortSignal): Promise<ProgressPayload | null> {
  if (typeof window === "undefined") return null;
  const response = await fetch(PROGRESS_ENDPOINT, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
    signal,
  });

  if (response.status === 204 || response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch progress: ${response.status}`);
  }

  const data = (await response.json()) as ProgressPayload | null;
  if (!data || typeof data !== "object") return null;
  return data;
}

export async function saveProgress(
  payload: ProgressPayload,
  signal?: AbortSignal
): Promise<void> {
  if (typeof window === "undefined") return;
  const response = await fetch(PROGRESS_ENDPOINT, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to save progress: ${response.status}`);
  }
}
