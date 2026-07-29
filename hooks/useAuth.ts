"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { login, logout, type LoginPayload } from "@/services/auth";
import { useAuthStore } from "@/store/auth";
import { resetSessionController, teardownSession } from "@/lib/session-controller";


export function useLogin() {
  const router = useRouter();
  const params = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);
  const redirectTo = params.get("from") || "/dashboard";

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (data) => {
      resetSessionController();
      setUser(data.user);
      toast.success("Signed in");
      router.replace(redirectTo);
      router.refresh(); // re-run Server Components so they see the new session
    },
    onError: (err: AxiosError<{ error?: string }>) => {
      toast.error(err.response?.data?.error ?? "Sign in failed");
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const clear = useAuthStore((s) => s.clear);

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      // Cancel in-flight requests + close the SSE stream BEFORE navigating,
      // so nothing keeps hitting the API after the cookies are already gone.
      teardownSession();
      clear();
      toast.success("Signed out");
      router.replace("/login");
      router.refresh();
    },
  });
}