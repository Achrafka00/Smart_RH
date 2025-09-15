
"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import type { UserRole, Employee } from "@/lib/types";
import { getEmployeeById } from "@/lib/services/employee.service";
import { useRouter, usePathname } from 'next/navigation';


type RoleContextType = {
  role: UserRole;
  currentUser: Employee | undefined;
  isAuthenticated: boolean;
  login: (userId: string) => void;
  logout: () => void;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>("Employee");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<Employee | undefined>();
  const isAuthenticated = !!currentUserId;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check local storage for a logged-in user on initial load
    const storedUserId = localStorage.getItem('talentflow-userId');
    if (storedUserId) {
        setCurrentUserId(storedUserId);
    }
  }, []);
  
  useEffect(() => {
    if (!isAuthenticated && pathname !== '/login' && pathname !== '/signup') {
      router.push('/login');
    }
  }, [isAuthenticated, pathname, router]);

  const login = (userId: string) => {
    setCurrentUserId(userId);
    localStorage.setItem('talentflow-userId', userId);
  }

  const logout = () => {
    setCurrentUserId(null);
    setCurrentUser(undefined);
    localStorage.removeItem('talentflow-userId');
    router.push('/login');
  }

  useEffect(() => {
    async function fetchUser() {
      if (currentUserId) {
        const user = await getEmployeeById(currentUserId);
        setCurrentUser(user);
        if (user) {
            // A simple way to determine role for this demo
            const userRole: UserRole = user.email.includes('hr') ? 'HR' : 'Employee';
            setRole(userRole);
        }
      }
    }
    fetchUser();
  }, [currentUserId]);

  const value = useMemo(() => ({ role, currentUser, isAuthenticated, login, logout }), [role, currentUser, isAuthenticated]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
