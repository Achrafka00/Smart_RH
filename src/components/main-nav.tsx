
"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  BrainCircuit,
  BarChart3,
  Briefcase,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useRole } from "@/hooks/use-role";

const navItems = [
  {
    href: "/",
    icon: LayoutDashboard,
    label: "Dashboard",
    roles: ["Employee", "HR"],
  },
  {
    href: "/employees",
    icon: Users,
    label: "Employees",
    roles: ["Employee", "HR"],
  },
  {
    href: "/absences",
    icon: Calendar,
    label: "Absences",
    roles: ["Employee", "HR"],
  },
  { href: "/insights", icon: BrainCircuit, label: "AI Insights", roles: ["HR"] },
  { href: "/recruitment", icon: Briefcase, label: "Recruitment", roles: ["HR"] },
  { href: "/reports", icon: BarChart3, label: "Reports", roles: ["HR"] },
];

export function MainNav() {
  const pathname = usePathname();
  const { role } = useRole();

  return (
    <SidebarMenu>
      {navItems.map((item) =>
        item.roles.includes(role) ? (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} legacyBehavior passHref>
              <SidebarMenuButton
                isActive={pathname === item.href}
                tooltip={{ children: item.label }}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ) : null
      )}
    </SidebarMenu>
  );
}
