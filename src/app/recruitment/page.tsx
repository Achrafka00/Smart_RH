
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { RoleGate } from "@/components/role-gate";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Eye, Users, Briefcase } from "lucide-react";
import { getJobPostings, getApplications, addJobPosting, updateJobPostingStatus } from "@/lib/services/recruitment.service";
import type { JobPosting, Application } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

const getBadgeVariantForJob = (status: JobPosting["status"]) => {
  switch (status) {
    case "Open":
      return "default";
    case "Closed":
      return "secondary";
    default:
        return "default"
  }
};

const getBadgeVariantForApp = (status: Application["status"]) => {
  switch (status) {
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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newJob, setNewJob] = useState({ title: "", description: "" });

  const fetchJobsAndApps = async () => {
      const [jobs, apps] = await Promise.all([getJobPostings(), getApplications()]);
      setJobPostings(jobs.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()));
      setApplications(apps.sort((a,b) => b.appliedAt.getTime() - a.appliedAt.getTime()));
      setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchJobsAndApps();
  }, []);

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title || !newJob.description) {
        toast({ variant: 'destructive', title: "Missing fields", description: "Please fill out all fields."});
        return;
    }
    await addJobPosting(newJob);
    toast({ title: "Job Posting Created", description: `${newJob.title} has been posted.` });
    setIsAddDialogOpen(false);
    setNewJob({ title: "", description: "" });
    fetchJobsAndApps(); // Refetch
  };

  const handleStatusToggle = async (jobId: string, currentStatus: "Open" | "Closed") => {
    const newStatus = currentStatus === "Open" ? "Closed" : "Open";
    await updateJobPostingStatus(jobId, newStatus);
    toast({ title: "Job Status Updated", description: `The job is now ${newStatus.toLowerCase()}.`});
    fetchJobsAndApps(); // Refetch
  };

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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> New Job Posting
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Job Posting</DialogTitle>
                    <DialogDescription>Fill out the details for the new job opening.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddJob} className="space-y-4">
                    <div>
                        <Label htmlFor="job-title">Job Title</Label>
                        <Input id="job-title" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} />
                    </div>
                    <div>
                        <Label htmlFor="job-desc">Description</Label>
                        <Textarea id="job-desc" value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Create Posting</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
          </Dialog>
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
                                 <div className="flex items-center gap-1 text-muted-foreground mt-2">
                                    <Users className="h-4 w-4" />
                                    <span className="text-sm font-bold">{applicationsByJob[job.id] || 0}</span>
                                    <span className="text-sm">Applicants</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <Badge variant={getBadgeVariantForJob(job.status)}>{job.status}</Badge>
                                <div className="flex items-center space-x-2">
                                    <Label htmlFor={`status-switch-${job.id}`} className="text-sm font-normal">
                                        {job.status === "Open" ? "Close" : "Open"}
                                    </Label>
                                    <Switch 
                                        id={`status-switch-${job.id}`}
                                        checked={job.status === 'Open'}
                                        onCheckedChange={() => handleStatusToggle(job.id, job.status)}
                                    />
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
                     {loading ? (
                         <div className="flex items-center justify-center h-48 text-muted-foreground">
                            <Skeleton className="h-16 w-16" />
                         </div>
                    ) : applications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground rounded-lg border-2 border-dashed">
                             <Briefcase className="h-12 w-12 mb-2" />
                            <p className="font-semibold">No Applications Yet</p>
                            <p className="text-sm">New applications will appear here.</p>
                        </div>
                    ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Candidate</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {applications.slice(0, 5).map(app => {
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
                                            <Badge variant={getBadgeVariantForApp(app.status)}>{app.status}</Badge>
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
                    )}
                </CardContent>
                 {applications.length > 5 && (
                    <CardFooter>
                        <Button variant="outline" className="w-full">View All Applications</Button>
                    </CardFooter>
                )}
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
