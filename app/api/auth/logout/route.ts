import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/auth";
import { csrfRejection, hasValidCsrfHeader } from "@/lib/csrf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    if (!hasValidCsrfHeader(req)) return csrfRejection();
  const res = NextResponse.json({ ok: true });
  clearAuthCookies(res);
  return res;
}