"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRole } from "@/hooks/use-role";
import { getInitials } from "@/lib/utils";
import type { UserRole } from "@/lib/types";

export function UserNav() {
  const { role, setRole } = useRole();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://picsum.photos/id/248/200/200" alt="@talentflow" data-ai-hint="person avatar" />
            <AvatarFallback>{getInitials(role === 'HR' ? 'Jane Doe' : 'Fiona Clark')}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {role === 'HR' ? 'Jane Doe' : 'Fiona Clark'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {role === 'HR' ? 'jane.doe@talentflow.com' : 'fiona.clark@talentflow.com'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Role</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={role}
            onValueChange={(value) => setRole(value as UserRole)}
          >
            <DropdownMenuRadioItem value="HR">Manager (HR)</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Employee">
              Employee
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
