
import api from "@/config/api-client";
import type { LoginResponse } from "@/lib/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/api/auth/login", payload);
  return data;
}

export async function logout(): Promise<void> {
  await api.post("/api/auth/logout");
}