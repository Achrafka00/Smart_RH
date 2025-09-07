
"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import type { UserRole, Employee } from "@/lib/types";
import { getEmployeeByRole } from "@/lib/services/employee.service";
import { useRouter, usePathname } from 'next/navigation';


type RoleContextType = {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: Employee | undefined;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>("HR");
  const [currentUser, setCurrentUser] = useState<Employee | undefined>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated && pathname !== '/login' && pathname !== '/signup') {
      router.push('/login');
    }
  }, [isAuthenticated, pathname, router]);

  const login = (role: UserRole) => {
    setRole(role);
    setIsAuthenticated(true);
  }

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(undefined);
  }

  useEffect(() => {
    async function fetchUser() {
      if (isAuthenticated) {
        const user = await getEmployeeByRole(role);
        setCurrentUser(user);
      }
    }
    fetchUser();
  }, [role, isAuthenticated]);

  const value = useMemo(() => ({ role, setRole, currentUser, isAuthenticated, login, logout }), [role, currentUser, isAuthenticated]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
