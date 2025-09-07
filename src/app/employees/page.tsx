
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
import { Search, ChevronDown, PlusCircle, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { getEmployees, addEmployee, deleteEmployee } from "@/lib/services/employee.service";
import type { Employee } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { RoleGate } from "@/components/role-gate";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTeam, setFilterTeam] = useState("All Teams");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    role: "",
    team: "",
  });

  const fetchEmployees = async () => {
    setLoading(true);
    const data = await getEmployees();
    setEmployees(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);
  
  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    const avatar = `https://picsum.photos/seed/${newEmployee.name}/200/200`;
    const employeeData = { ...newEmployee, avatar };
    await addEmployee(employeeData);
    toast({ title: "Employee Added", description: `${newEmployee.name} has been added.` });
    setIsAddDialogOpen(false);
    setNewEmployee({ name: "", email: "", role: "", team: "" });
    fetchEmployees(); // Refetch to show the new employee
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    await deleteEmployee(employeeId);
    toast({ title: "Employee Deleted", description: "The employee has been removed." });
    fetchEmployees(); // Refetch to show the updated list
  };


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
      <div className="flex items-center justify-between">
        <PageHeader
          title="Employee Directory"
          description="Search and browse for employees in the organization."
        />
        <RoleGate allowedRoles={["HR"]}>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>Fill out the form to add a new employee to the directory.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddEmployee} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={newEmployee.name} onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})} required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={newEmployee.email} onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})} required />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" value={newEmployee.role} onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})} required />
                  </div>
                  <div>
                    <Label htmlFor="team">Team</Label>
                    <Input id="team" value={newEmployee.team} onChange={(e) => setNewEmployee({...newEmployee, team: e.target.value})} required />
                  </div>
                   <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="ghost">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Add Employee</Button>
                  </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </RoleGate>
      </div>
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
              <RoleGate allowedRoles={["HR"]}><TableHead className="text-right">Actions</TableHead></RoleGate>
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
                        <RoleGate allowedRoles={["HR"]}><TableCell className="text-right"><Skeleton className="h-8 w-8 inline-block" /></TableCell></RoleGate>
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
                <RoleGate allowedRoles={["HR"]}>
                    <TableCell className="text-right">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                               <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the employee record.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteEmployee(employee.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </TableCell>
                </RoleGate>
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
