"use client";

import React, { useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { RoleGate } from "@/components/role-gate";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ABSENCE_REQUESTS, EMPLOYEES } from "@/lib/data";
import type { AbsenceRequest } from "@/lib/types";
import { format } from "date-fns";

const getBadgeVariant = (status: AbsenceRequest["status"]) => {
  switch (status) {
    case "Approved":
      return "default";
    case "Pending":
      return "secondary";
    case "Rejected":
      return "destructive";
  }
};

export default function ReportsPage() {
  const data = useMemo(() => {
    return ABSENCE_REQUESTS.map((req) => {
      const employee = EMPLOYEES.find((emp) => emp.id === req.employeeId);
      return {
        ...req,
        employeeName: employee?.name || "N/A",
        employeeEmail: employee?.email || "N/A",
      };
    }).sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  }, []);

  const handleExport = () => {
    const csvRows = [
      // Headers
      [
        "Employee Name",
        "Email",
        "Start Date",
        "End Date",
        "Reason",
        "Status",
      ].join(","),
    ];

    // Data
    data.forEach((row) => {
      const values = [
        `"${row.employeeName}"`,
        `"${row.employeeEmail}"`,
        `"${format(row.startDate, "yyyy-MM-dd")}"`,
        `"${format(row.endDate, "yyyy-MM-dd")}"`,
        `"${row.reason.replace(/"/g, '""')}"`,
        `"${row.status}"`,
      ].join(",");
      csvRows.push(values);
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `absence_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-8">
      <RoleGate allowedRoles={["HR"]}>
        <div className="flex items-center justify-between">
          <PageHeader
            title="Absence Reports"
            description="View and export all employee absence records."
          />
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export to CSV
          </Button>
        </div>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead className="hidden md:table-cell">Reason</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>
                    <div className="font-medium">{req.employeeName}</div>
                    <div className="text-sm text-muted-foreground">
                      {req.employeeEmail}
                    </div>
                  </TableCell>
                  <TableCell>{`${format(req.startDate, "MMM d")} - ${format(
                    req.endDate,
                    "MMM d, yyyy"
                  )}`}</TableCell>
                  <TableCell className="hidden md:table-cell">{req.reason}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(req.status)}>
                      {req.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </RoleGate>
       <RoleGate allowedRoles={["Employee"]}>
        <div className="text-center p-8">
            <h2 className="text-2xl font-semibold">Access Denied</h2>
            <p className="text-muted-foreground">This page is only available to managers.</p>
        </div>
      </RoleGate>
    </div>
  );
}
