
"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import type { UserRole, Employee } from "@/lib/types";
import { getEmployeeByRole } from "@/lib/services/employee.service";

type RoleContextType = {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: Employee | undefined;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>("HR");
  const [currentUser, setCurrentUser] = useState<Employee | undefined>();

  useEffect(() => {
    async function fetchUser() {
      const user = await getEmployeeByRole(role);
      setCurrentUser(user);
    }
    fetchUser();
  }, [role]);

  const value = useMemo(() => ({ role, setRole, currentUser }), [role, currentUser]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
