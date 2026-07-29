import { NextResponse } from "next/server";

const EXPECTED_HEADER_VALUE = "sohcahtoa";

// PRIMARY defence: sameSite:"lax" on the auth cookies (lib/auth.ts). A
// cross-site form/img/fetch-without-credentials POST simply doesn't attach
// the cookie at all in a modern browser — the request arrives unauthenticated
// and getSession() rejects it before this header is ever checked.
//
// SECONDARY defence (this check): a custom request header can only be set by
// JS running same-origin — an XHR/fetch from our own frontend. A forged
// cross-site <form> submission has no way to add it. This covers browsers or
// proxy configurations where sameSite enforcement is weaker than Lax, and is
// the belt to sameSite's suspenders.
export function hasValidCsrfHeader(req: Request): boolean {
  return req.headers.get("x-requested-with") === EXPECTED_HEADER_VALUE;
}

export function csrfRejection() {
  return NextResponse.json({ error: "CSRF check failed" }, { status: 403 });
}