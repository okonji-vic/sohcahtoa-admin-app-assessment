"use client";

// Central place to cancel "the session" as a unit: every in-flight axios
// request and every open SSE connection share one AbortController + a small
// EventSource registry. Logout, or a failed refresh, tears both down in one
// call instead of each hook independently guessing when to stop.

type Closeable = { close: () => void };

let controller = new AbortController();
const eventSources = new Set<Closeable>();

export function getSessionSignal(): AbortSignal {
  return controller.signal;
}

export function registerEventSource(source: Closeable) {
  eventSources.add(source);
  return () => eventSources.delete(source);
}

// Call after a successful login: an AbortController can't be "un-aborted",
// so the next session needs a brand new one.
export function resetSessionController() {
  controller = new AbortController();
}

// Call on logout, or when a refresh attempt fails and we're forcing logout.
export function teardownSession() {
  controller.abort();
  eventSources.forEach((s) => s.close());
  eventSources.clear();
  resetSessionController();
}