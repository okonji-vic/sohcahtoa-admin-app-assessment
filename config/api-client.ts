"use client";

import { getSessionSignal, teardownSession } from "@/lib/session-controller";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

// One axios instance for the whole app. withCredentials sends the httpOnly auth
// cookies; the custom header is our same-origin/CSRF signal (middleware and the
// refresh route look for it).
const api = axios.create({
  withCredentials: true,
  headers: { "x-requested-with": "sohcahtoa" },
});

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

api.interceptors.request.use((config) => {
  // Every request rides on the shared session signal unless it supplied its
  // own. This is what lets teardownSession() cancel every outstanding
  // request in one call, without wiring an AbortController per hook.
  if (!config.signal) config.signal = getSessionSignal();
  return config;
});

// Client-side fetch wrapper that transparently refreshes an expired access
// token and retries once. The important part is single-flight: if ten requests
// 401 at the same moment, they all await ONE refresh, not ten.
// If many requests 401 at once (access token just expired), they must NOT each
// fire their own refresh. The first one starts it; the rest await the same
// promise. Because the server rotates the refresh token on every call, letting
// them race would invalidate each other and log a healthy user out.
let refreshInFlight: Promise<boolean> | null = null;

function refreshOnce(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = axios
      .post("/api/auth/refresh", null, {
        withCredentials: true,
        headers: { "x-requested-with": "sohcahtoa" },
      })
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;
    const status = error.response?.status;
    const url = original?.url ?? "";
    

    // Retry once on 401, but never for the auth endpoints themselves (a bad
    // login or a dead refresh must surface, not loop).
    const isAuthCall = url.includes("/api/auth/");

    if (status === 401 && original && !original._retry && !isAuthCall) {
      original._retry = true;
      const ok = await refreshOnce();
      if (ok) return api(original);
      // Refresh failed: the session is dead. Cancel every other in-flight
      // request and every open SSE stream before navigating away, so
      // nothing keeps firing in the background against a dead session.
      teardownSession();
      if (typeof window !== "undefined") window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;