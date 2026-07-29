// A tiny HS256 JWT implementation on the Web Crypto API.  Used Web Crypto (not
// node:crypto) on purpose: it exists in both the Edge runtime (middleware) and
// the Node runtime (route handlers), so one signing/verifying path serves both.

const enc = new TextEncoder();
const dec = new TextDecoder();

export type Role = "admin" | "analyst";

export interface JwtClaims {
  sub: string; // user id
  role: Role;  // role (admin or analyst)
  type: "access" | "refresh";
  iat: number; // issued-at (seconds)
  exp: number; // expiry (seconds)
}

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string): Uint8Array {
  const s = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = s.length % 4 === 0 ? 0 : 4 - (s.length % 4);
  const bin = atob(s + "=".repeat(pad));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signToken(
  claims: Omit<JwtClaims, "iat">,
  secret: string
): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const payload: JwtClaims = { ...claims, iat: Math.floor(Date.now() / 1000) };

  const head = toBase64Url(enc.encode(JSON.stringify(header)));
  const body = toBase64Url(enc.encode(JSON.stringify(payload)));
  const signingInput = `${head}.${body}`;

  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(signingInput) as BufferSource);
  return `${signingInput}.${toBase64Url(new Uint8Array(sig))}`;
}

// Verifies signature AND expiry. Returns null on anything untrustworthy.
export async function verifyToken(
  token: string,
  secret: string
): Promise<JwtClaims | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [head, body, sig] = parts;
  const key = await hmacKey(secret);

  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    fromBase64Url(sig) as BufferSource,
    enc.encode(`${head}.${body}`)
  );
  if (!valid) return null;

  let claims: JwtClaims;
  try {
    claims = JSON.parse(dec.decode(fromBase64Url(body)));
  } catch {
    return null;
  }

  if (typeof claims.exp !== "number" || claims.exp * 1000 <= Date.now()) {
    return null; // expired or malformed
  }
  return claims;
}