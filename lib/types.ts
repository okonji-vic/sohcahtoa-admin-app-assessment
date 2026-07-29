// Type-only re-export: `import type` is erased at build, so pulling Role here
// never drags the jwt/crypto code into a client bundle.
export type { Role } from "./jwt";
import type { Role } from "./jwt";

export interface AuthUser {
  id: string;
  role: Role;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
}

// What POST /api/auth/login returns to the client (no tokens in the body).
export interface LoginResponse {
  user: AuthUser;
  expiresIn: number;
}