
"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/hooks/use-role";
import { PageHeader } from "@/components/page-header";
import { RoleGate } from "@/components/role-gate";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getInitials } from "@/lib/utils";
import type { Employee, AbsenceRequest } from "@/lib/types";
import { useMemo, useState, useEffect } from "react";
import { getEmployees } from "@/lib/services/employee.service";
import { getAbsenceRequests } from "@/lib/services/absence.service";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { role, currentUser } = useRole();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [absenceRequests, setAbsenceRequests] = useState<AbsenceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  const team = employees.slice(0, 5);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [emps, reqs] = await Promise.all([getEmployees(), getAbsenceRequests()]);
      setEmployees(emps);
      setAbsenceRequests(reqs);
      setLoading(false);
    }
    fetchData();
  }, [])

  const getStatusForEmployee = (employeeId: string) => {
    const onLeave = absenceRequests.some(
      (req) =>
        req.employeeId === employeeId &&
        req.status === "Approved" &&
        new Date() >= new Date(req.startDate) &&
        new Date() <= new Date(req.endDate)
    );
    return onLeave ? "On Leave" : "In Office";
  };


  const absenceData = useMemo(() => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const data: { [key: string]: { name: string; Sick: number; Vacation: number } } = {};

    months.forEach((month) => {
      data[month] = { name: month, Sick: 0, Vacation: 0 };
    });

    absenceRequests.forEach((req) => {
      if (req.status === "Approved") {
        const month = months[new Date(req.startDate).getMonth()];
        if (req.reason.toLowerCase().includes("sick")) {
          data[month].Sick += 1;
        } else {
          data[month].Vacation += 1;
        }
      }
    });

    return Object.values(data);
  }, [absenceRequests]);

  const onLeaveCount = useMemo(() => employees.filter(
    (e) => getStatusForEmployee(e.id) === "On Leave"
  ).length, [employees, absenceRequests]);

  const pendingRequestsCount = useMemo(() => absenceRequests.filter(r => r.status === 'Pending').length, [absenceRequests]);

  return (
    <div className="p-4 sm:p-8">
      <PageHeader
        title="Dashboard"
        description={
          role === "HR"
            ? "Welcome back, here's a look at your team's status."
            : "Welcome back, here's your current status."
        }
      />
      <div className="space-y-8">
        <RoleGate allowedRoles={["HR"]}>
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Employees
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{employees.length}</div>}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    On Leave
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{onLeaveCount}</div>}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{pendingRequestsCount}</div>}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Team Overview</CardTitle>
                  <CardDescription>
                    Current status of your team members.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {loading ? Array.from({length: 5}).map((_, i) => (
                    <div key={i} className="flex flex-col items-center space-y-2">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-6 w-20" />
                    </div>
                  )) : team.map((employee: Employee) => {
                    const status = getStatusForEmployee(employee.id);
                    return (
                      <div
                        key={employee.id}
                        className="flex flex-col items-center space-y-2"
                      >
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={employee.avatar} alt={employee.name} data-ai-hint="person portrait" />
                          <AvatarFallback>
                            {getInitials(employee.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                          <p className="font-semibold">{employee.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {employee.role}
                          </p>
                        </div>
                        <Badge
                          variant={status === "On Leave" ? "secondary" : "default"}
                          className={
                            status === "On Leave"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }
                        >
                          {status}
                        </Badge>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Absence Report</CardTitle>
                  <CardDescription>
                    Monthly breakdown of approved absences.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? <Skeleton className="h-[300px] w-full" /> : 
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={absenceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Vacation" fill="hsl(var(--primary))" />
                      <Bar dataKey="Sick" fill="hsl(var(--accent))" />
                    </BarChart>
                  </ResponsiveContainer>
                  }
                </CardContent>
              </Card>
            </div>
          </>
        </RoleGate>

        <RoleGate allowedRoles={["Employee"]}>
          <Card>
            <CardHeader>
              <CardTitle>My Status</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center space-x-4">
              {loading || !currentUser ? (
                <>
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </>
              ) : (
                <>
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} data-ai-hint="person profile" />
                    <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg">{currentUser.name}</p>
                    <Badge
                      className={
                        getStatusForEmployee(currentUser.id) === "On Leave"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }
                    >
                      {getStatusForEmployee(currentUser.id)}
                    </Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </RoleGate>
      </div>
    </div>
  );
}
