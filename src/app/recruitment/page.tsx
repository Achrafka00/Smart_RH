
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { RoleGate } from "@/components/role-gate";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Eye, Users } from "lucide-react";
import { getJobPostings, getApplications } from "@/lib/services/recruitment.service";
import type { JobPosting, Application } from "@/lib/types";
import { format, formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

const getBadgeVariant = (status: JobPosting["status"] | Application["status"]) => {
  switch (status) {
    case "Open":
      return "default";
    case "Closed":
      return "secondary";
    case "Received":
      return "secondary";
    case "Under Review":
      return "default";
    case "Hired":
      return "default";
    case "Rejected":
      return "destructive";
    default:
        return "default"
  }
};

export default function RecruitmentPage() {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [jobs, apps] = await Promise.all([getJobPostings(), getApplications()]);
      setJobPostings(jobs.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()));
      setApplications(apps.sort((a,b) => b.appliedAt.getTime() - a.appliedAt.getTime()));
      setLoading(false);
    }
    fetchData();
  }, []);

  const applicationsByJob = useMemo(() => {
    return jobPostings.reduce((acc, job) => {
        acc[job.id] = applications.filter(app => app.jobId === job.id).length;
        return acc;
    }, {} as Record<string, number>);
  }, [jobPostings, applications]);


  return (
    <div className="p-4 sm:p-8">
      <RoleGate allowedRoles={["HR"]}>
        <div className="flex items-center justify-between">
          <PageHeader
            title="Recruitment"
            description="Manage job openings and candidate applications."
          />
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> New Job Posting
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
            {/* Job Postings */}
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Job Postings</CardTitle>
                    <CardDescription>Active and closed job openings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {loading ? (
                        Array.from({length: 3}).map((_, i) => (
                            <div key={i} className="p-4 border rounded-lg flex justify-between items-center">
                                <div>
                                    <Skeleton className="h-5 w-48 mb-2" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                                <Skeleton className="h-8 w-20" />
                            </div>
                        ))
                    ) : jobPostings.map(job => (
                        <div key={job.id} className="p-4 border rounded-lg flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold">{job.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                    Posted {formatDistanceToNow(job.createdAt, { addSuffix: true })}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant={getBadgeVariant(job.status)}>{job.status}</Badge>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    <span className="text-sm font-bold">{applicationsByJob[job.id] || 0}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Recent Applications */}
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Recent Applications</CardTitle>
                    <CardDescription>The latest CVs received from candidates.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Candidate</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({length: 4}).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-9 w-9 rounded-full" />
                                                <div>
                                                    <Skeleton className="h-4 w-24 mb-1" />
                                                    <Skeleton className="h-3 w-32" />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                                    </TableRow>
                                ))
                            ) : applications.slice(0, 5).map(app => {
                                const job = jobPostings.find(j => j.id === app.jobId);
                                return (
                                    <TableRow key={app.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="hidden h-9 w-9 sm:flex">
                                                    <AvatarFallback>{getInitials(app.candidateName)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{app.candidateName}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Applied for {job?.title}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getBadgeVariant(app.status)}>{app.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full">View All Applications</Button>
                </CardFooter>
            </Card>
        </div>
      </RoleGate>
      <RoleGate allowedRoles={["Employee"]}>
        <div className="text-center p-8">
          <h2 className="text-2xl font-semibold">Access Denied</h2>
          <p className="text-muted-foreground">
            This page is only available to HR personnel.
          </p>
        </div>
      </RoleGate>
    </div>
  );
}
