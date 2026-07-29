import { NextResponse } from "next/server";
import { findUserByCredentials } from "@/lib/mock-users";
import { issueTokens, setAuthCookies } from "@/lib/auth";

// Node runtime: this handler signs tokens and (later) would hit a DB.
export const runtime = "nodejs";
// Made sure to never cache an auth response.
export const dynamic = "force-dynamic";

interface LoginBody {
  email?: unknown;
  password?: unknown;
}

export async function POST(req: Request) {
  let body: LoginBody;
  try {
    body = (await req.json()) as LoginBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  // Input validation -> 422 for malformed, distinct from 401 for wrong creds.
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 422 }
    );
  }

  const user = findUserByCredentials(email, password);
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const { accessToken, refreshToken, expiresIn } = await issueTokens(user);

  // DELIBERATE DEVIATION FROM BRIEF 1.1 (see README): tokens are NOT returned in
  // the body. They live only in httpOnly cookies, per the mandatory rule 5.4.
  // We return just the user and expiry the client legitimately needs.
  const res = NextResponse.json({
    user: { id: user.id, role: user.role, email: user.email, name: user.name, firstName: user.firstName, lastName: user.lastName },
    expiresIn,
  });
  setAuthCookies(res, accessToken, refreshToken);
  return res;
}