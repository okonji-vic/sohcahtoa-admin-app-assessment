"use client";

import { Button } from "antd";
import { useLogout } from "@/hooks/useAuth";

export default function LogoutButton() {
  const logout = useLogout();
  return (
    <Button danger onClick={() => logout.mutate()} loading={logout.isPending}>
      Log out
    </Button>
  );
}
