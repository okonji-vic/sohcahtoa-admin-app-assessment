export function getSecret(): string {
    const s = process.env.AUTH_SECRET;
    if (!s) throw new Error("AUTH_SECRET is not set. Add it to .env.local");
    return s;
  }