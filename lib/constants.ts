// Edge-safe constants. NOTHING in here may import next/headers, because this
// module is pulled into middleware, which runs on the Edge runtime.

export const ACCESS_COOKIE = "st_access";
export const REFRESH_COOKIE = "st_refresh";

// Short access token, long refresh token. The short access TTL is what makes
// the refresh flow actually fire during a normal session.
export const ACCESS_TTL = 60 * 10; // 10 minutes (seconds)
export const REFRESH_TTL = 60 * 60 * 24 * 7; // 7 days (seconds)