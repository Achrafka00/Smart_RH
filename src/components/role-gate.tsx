"use client";

import { useRole } from "@/hooks/use-role";
import type { UserRole } from "@/lib/types";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function RoleGate({ children, allowedRoles }: RoleGateProps) {
  const { role } = useRole();

  if (!allowedRoles.includes(role)) {
    return null;
  }

  return <>{children}</>;
}
