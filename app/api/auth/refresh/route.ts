import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, signToken } from "@/lib/jwt";
import { setAuthCookies, clearAuthCookies } from "@/lib/auth";
import { REFRESH_COOKIE, ACCESS_TTL, REFRESH_TTL } from "@/lib/constants";
import { getSecret } from "@/utils/authSecret";
import { csrfRejection, hasValidCsrfHeader } from "@/lib/csrf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";


export async function POST(req: Request) {
  if (!hasValidCsrfHeader(req)) return csrfRejection();
  const store = await cookies();
  const refreshToken = store.get(REFRESH_COOKIE)?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  const secret = getSecret();
  const claims = await verifyToken(refreshToken, secret);

  if (!claims || claims.type !== "refresh") {
    // Dead/invalid refresh token -> force logout client-side.
    const res = NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
    clearAuthCookies(res);
    return res;
  }

  const now = Math.floor(Date.now() / 1000);

  // Rotate BOTH tokens. Rotating the refresh token too (not just access) is
  // what makes reuse detection possible later, and is why the client-side
  // single-flight guard in api.ts matters: two concurrent refreshes would
  // each rotate the refresh token and invalidate the other.
  const newAccessToken = await signToken(
    { sub: claims.sub, role: claims.role, type: "access", exp: now + ACCESS_TTL },
    secret
  );
  const newRefreshToken = await signToken(
    { sub: claims.sub, role: claims.role, type: "refresh", exp: now + REFRESH_TTL },
    secret
  );

  const res = NextResponse.json({ expiresIn: ACCESS_TTL });
  setAuthCookies(res, newAccessToken, newRefreshToken);
  return res;
}