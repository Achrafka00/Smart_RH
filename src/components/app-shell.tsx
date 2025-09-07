
"use client";

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";
import { BrainCircuit } from "lucide-react";
import { useRole } from "@/hooks/use-role";


const getPageTitle = (pathname: string) => {
  switch (pathname) {
    case "/":
      return "Dashboard";
    case "/employees":
      return "Employee Directory";
    case "/absences":
      return "Absence Management";
    case "/insights":
      return "AI Insights";
    case "/reports":
      return "Reporting";
    case "/recruitment":
      return "Recruitment";
    default:
      return "TalentFlow";
  }
};

const AUTH_ROUTES = ["/login", "/signup"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const { isAuthenticated } = useRole();
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isAuthRoute || !isAuthenticated) {
    return <>{children}</>;
  }

  if (!isMounted) {
    // To prevent hydration mismatch, we can render a skeleton or null.
    // The sidebar state is read from cookies, which is a client-side only operation.
    return null;
  }

  return (
    <SidebarProvider
      key={isMobile ? "mobile" : "desktop"}
      defaultOpen={!isMobile}
    >
      <div className="group-data-[variant=inset]:bg-transparent flex min-h-screen w-full bg-background">
        <Sidebar
          variant="sidebar"
          collapsible="icon"
          className="peer hidden border-r bg-card transition-all duration-300 ease-in-out md:flex"
        >
          <SidebarHeader className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <span className="text-lg font-semibold text-primary group-data-[collapsible=icon]:hidden">
              TalentFlow
            </span>
          </SidebarHeader>
          <SidebarContent>
            <MainNav />
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex flex-col">
          <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-8">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <div className="hidden font-semibold md:block">
                {getPageTitle(pathname)}
              </div>
            </div>
            <UserNav />
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
