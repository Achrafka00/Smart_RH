
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader } from "@/components/page-header";
import { getInitials } from "@/lib/utils";
import { Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { getEmployees } from "@/lib/services/employee.service";
import type { Employee } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTeam, setFilterTeam] = useState("All Teams");

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      const data = await getEmployees();
      setEmployees(data);
      setLoading(false);
    };
    fetchEmployees();
  }, []);

  const teams = useMemo(
    () => ["All Teams", ...Array.from(new Set(employees.map((e) => e.team)))],
    [employees]
  );

  const filteredEmployees = useMemo(() => {
    return employees.filter(
      (employee) =>
        (employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.role.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterTeam === "All Teams" || employee.team === filterTeam)
    );
  }, [employees, searchTerm, filterTeam]);

  return (
    <div className="p-4 sm:p-8">
      <PageHeader
        title="Employee Directory"
        description="Search and browse for employees in the organization."
      />
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              {filterTeam} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {teams.map((team) => (
              <DropdownMenuItem key={team} onSelect={() => setFilterTeam(team)}>
                {team}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Role</TableHead>
              <TableHead className="hidden md:table-cell">Team</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                Array.from({length: 5}).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell>
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div>
                                    <Skeleton className="h-4 w-24 mb-1" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-28" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                    </TableRow>
                ))
            ) : filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={employee.avatar} alt={employee.name} data-ai-hint="person avatar" />
                      <AvatarFallback>
                        {getInitials(employee.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {employee.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{employee.role}</TableCell>
                <TableCell className="hidden md:table-cell">{employee.team}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
       {filteredEmployees.length === 0 && !loading && (
          <div className="text-center p-8 text-muted-foreground">
            No employees found.
          </div>
        )}
    </div>
  );
}
