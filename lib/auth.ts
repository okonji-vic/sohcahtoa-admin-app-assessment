import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { signToken, verifyToken, type JwtClaims, type Role } from "./jwt";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  ACCESS_TTL,
  REFRESH_TTL,
} from "./constants";
import { getSecret } from "@/utils/authSecret";

// Server-only. this file was NOT imported into middleware simply because (it pulls next/headers,
// which is not available on the Edge runtime). Middleware uses lib/jwt directly.


export async function issueTokens(user: { id: string; role: Role }) {
  const now = Math.floor(Date.now() / 1000);
  const secret = getSecret();

  const accessToken = await signToken(
    { sub: user.id, role: user.role, type: "access", exp: now + ACCESS_TTL },
    secret
  );
  const refreshToken = await signToken(
    { sub: user.id, role: user.role, type: "refresh", exp: now + REFRESH_TTL },
    secret
  );

  return { accessToken, refreshToken, expiresIn: ACCESS_TTL };
}

const cookieBase = {
  httpOnly: true, // not readable by JS -> mitigates token theft via XSS
  secure: process.env.NODE_ENV === "production", // HTTPS-only in prod
  sameSite: "lax" as const, // primary CSRF defence (see README)
  path: "/",
};

export function setAuthCookies(res: NextResponse, accessToken: string, refreshToken: string) {
  res.cookies.set(ACCESS_COOKIE, accessToken, { ...cookieBase, maxAge: ACCESS_TTL });
  res.cookies.set(REFRESH_COOKIE, refreshToken, { ...cookieBase, maxAge: REFRESH_TTL });
}

export function clearAuthCookies(res: NextResponse) {
  res.cookies.set(ACCESS_COOKIE, "", { ...cookieBase, maxAge: 0 });
  res.cookies.set(REFRESH_COOKIE, "", { ...cookieBase, maxAge: 0 });
}

// Read + verify the current session inside Server Components and Route Handlers.
export async function getSession(): Promise<JwtClaims | null> {
  const store = await cookies();
  const token = store.get(ACCESS_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token, getSecret());
}

export function isRole(claims: JwtClaims | null, role: Role): boolean {
  return !!claims && claims.role === role;
}