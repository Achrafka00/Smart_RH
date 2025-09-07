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
import { EMPLOYEES, ABSENCE_REQUESTS } from "@/lib/data";
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
import type { Employee } from "@/lib/types";
import { useMemo } from "react";

const getStatusForEmployee = (employeeId: string) => {
  const onLeave = ABSENCE_REQUESTS.some(
    (req) =>
      req.employeeId === employeeId &&
      req.status === "Approved" &&
      new Date() >= req.startDate &&
      new Date() <= req.endDate
  );
  return onLeave ? "On Leave" : "In Office";
};

export default function Dashboard() {
  const { role } = useRole();
  const team = EMPLOYEES.slice(0, 5);

  const absenceData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const data: { [key: string]: { name: string; Sick: number; Vacation: number } } = {};

    months.forEach((month) => {
      data[month] = { name: month, Sick: 0, Vacation: 0 };
    });

    ABSENCE_REQUESTS.forEach((req) => {
      if (req.status === "Approved") {
        const month = months[req.startDate.getMonth()];
        if (req.reason.toLowerCase().includes("sick")) {
          data[month].Sick += 1;
        } else {
          data[month].Vacation += 1;
        }
      }
    });

    return Object.values(data);
  }, []);

  return (
    <>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Employees
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{EMPLOYEES.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  On Leave
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {EMPLOYEES.filter(
                    (e) => getStatusForEmployee(e.id) === "On Leave"
                  ).length}
                </div>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {ABSENCE_REQUESTS.filter(r => r.status === 'Pending').length}
                </div>
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
                {team.map((employee: Employee) => {
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
              </CardContent>
            </Card>
          </div>
        </RoleGate>

        <RoleGate allowedRoles={["Employee"]}>
          <Card>
            <CardHeader>
              <CardTitle>My Status</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={EMPLOYEES[5].avatar} alt={EMPLOYEES[5].name} data-ai-hint="person profile" />
                <AvatarFallback>{getInitials(EMPLOYEES[5].name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">{EMPLOYEES[5].name}</p>
                <Badge
                  className={
                    getStatusForEmployee(EMPLOYEES[5].id) === "On Leave"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }
                >
                  {getStatusForEmployee(EMPLOYEES[5].id)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </RoleGate>
      </div>
    </>
  );
}
