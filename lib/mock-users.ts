import type { Role } from "./jwt";

// Mock user store. In production this is a database lookup with a hashed
// password (bcrypt/argon2), never plaintext. Kept in-memory here per this assessment.
export interface MockUser {
  id: string;
  email: string;
  password: string;
  role: Role;
  name: string;
  firstName: string;
  lastName: string;
}

const USERS: MockUser[] = [
  { id: "u_admin", email: "admin@sohcahtoa.test", password: "admin1234", role: "admin", name: "Emmanuel Israel", firstName: "Emmanuel", lastName: "Israel" },
  { id: "u_analyst", email: "analyst@sohcatoa.test", password: "analyst1234", role: "analyst", name: "Olatunji Adebayo", firstName: "Olatunji", lastName: "Adebayo" },
];

export function findUserByCredentials(email: string, password: string): MockUser | null {
  const user = USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
  // Constant-ish comparison is overkill here, but never leak which half
  // failed: same null result whether the email or the password was wrong.
  if (!user || user.password !== password) return null;
  return user;
}