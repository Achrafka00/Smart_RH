
"use client";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoleGate } from "@/components/role-gate";
import { useRole } from "@/hooks/use-role";
import { Button } from "@/components/ui/button";
import { PlusCircle, Check, X } from "lucide-react";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn, getInitials } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { AbsenceRequest, Employee } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAbsenceRequests, addAbsenceRequest, updateAbsenceRequestStatus } from "@/lib/services/absence.service";
import { getEmployees } from "@/lib/services/employee.service";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  dateRange: z.object({
    from: z.date({ required_error: "A start date is required." }),
    to: z.date({ required_error: "An end date is required." }),
  }),
  reason: z.string().min(10, "Reason must be at least 10 characters long."),
});

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

export default function AbsencesPage() {
  const { currentUser } = useRole();
  const { toast } = useToast();
  const [requests, setRequests] = useState<AbsenceRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [reqs, emps] = await Promise.all([getAbsenceRequests(), getEmployees()]);
      setRequests(reqs.sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()));
      setEmployees(emps);
      setLoading(false);
    }
    fetchData();
  }, [])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!currentUser) return;
    
    const newRequestData = {
      employeeId: currentUser.id,
      startDate: values.dateRange.from,
      endDate: values.dateRange.to,
      reason: values.reason,
      status: "Pending" as const,
    };

    const newRequest = await addAbsenceRequest(newRequestData);
    setRequests([newRequest, ...requests]);

    toast({
      title: "Request Submitted",
      description: "Your time off request has been successfully submitted.",
    });
    setOpen(false);
    form.reset();
  };

  const handleRequestStatus = async (
    id: string,
    status: "Approved" | "Rejected"
  ) => {
    const updatedRequest = await updateAbsenceRequestStatus(id, status);
    if(updatedRequest) {
      setRequests(
        requests.map((req) => (req.id === id ? updatedRequest : req))
      );
      toast({
        title: `Request ${status}`,
        description: `The request has been ${status.toLowerCase()}.`,
      });
    }
  };

  const renderMyRequests = () => {
    if (loading) {
      return Array.from({length: 3}).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-36" /></TableCell>
          <TableCell><Skeleton className="h-4 w-48" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
        </TableRow>
      ))
    }
    return requests
      .filter((req) => req.employeeId === currentUser?.id)
      .map((req) => (
        <TableRow key={req.id}>
          <TableCell>{`${format(new Date(req.startDate), "MMM d")} - ${format(
            new Date(req.endDate),
            "MMM d, yyyy"
          )}`}</TableCell>
          <TableCell>{req.reason}</TableCell>
          <TableCell>{formatDistanceToNow(new Date(req.startDate))} ago</TableCell>
          <TableCell>
            <Badge variant={getBadgeVariant(req.status)}>{req.status}</Badge>
          </TableCell>
        </TableRow>
      ));
  }

  const renderTeamRequests = () => {
     if (loading) {
      return Array.from({length: 3}).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-4 w-36" /></TableCell>
          <TableCell><Skeleton className="h-4 w-48" /></TableCell>
          <TableCell className="text-right space-x-2">
            <Skeleton className="h-8 w-8 inline-block" />
            <Skeleton className="h-8 w-8 inline-block" />
          </TableCell>
        </TableRow>
      ))
    }
    return requests
      .filter((req) => req.status === "Pending")
      .map((req) => {
        const employee = employees.find(e => e.id === req.employeeId);
        return (
        <TableRow key={req.id}>
            <TableCell>
                <div className="flex items-center gap-3">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage src={employee?.avatar} alt={employee?.name} data-ai-hint="person avatar" />
                        <AvatarFallback>{getInitials(employee?.name || '')}</AvatarFallback>
                    </Avatar>
                    {employee?.name}
                </div>
            </TableCell>
          <TableCell>{`${format(new Date(req.startDate), "MMM d")} - ${format(
            new Date(req.endDate),
            "yyyy"
          )}`}</TableCell>
          <TableCell>{req.reason}</TableCell>
          <TableCell className="text-right">
            <Button variant="ghost" size="icon" onClick={() => handleRequestStatus(req.id, "Approved")}>
              <Check className="h-4 w-4 text-green-500"/>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleRequestStatus(req.id, "Rejected")}>
              <X className="h-4 w-4 text-red-500"/>
            </Button>
          </TableCell>
        </TableRow>
      )});
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Absence Management"
          description="Request time off and manage team absences."
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Request Time Off
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Time Off Request</DialogTitle>
              <DialogDescription>
                Fill out the form below to request time off.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="dateRange"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Dates</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value?.from && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value?.from ? (
                                field.value.to ? (
                                  <>
                                    {format(field.value.from, "LLL dd, y")} -{" "}
                                    {format(field.value.to, "LLL dd, y")}
                                  </>
                                ) : (
                                  format(field.value.from, "LLL dd, y")
                                )
                              ) : (
                                <span>Pick a date range</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range"
                            selected={{ from: field.value?.from, to: field.value?.to }}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g. Family vacation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="ghost">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Submit Request</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="my-requests">
        <TabsList>
          <TabsTrigger value="my-requests">My Requests</TabsTrigger>
          <RoleGate allowedRoles={["HR"]}>
            <TabsTrigger value="team-requests">Team Requests</TabsTrigger>
          </RoleGate>
        </TabsList>
        <TabsContent value="my-requests">
           <div className="rounded-lg border mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dates</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderMyRequests()}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <RoleGate allowedRoles={["HR"]}>
          <TabsContent value="team-requests">
            <div className="rounded-lg border mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
               {renderTeamRequests()}
              </TableBody>
            </Table>
            </div>
          </TabsContent>
        </RoleGate>
      </Tabs>
    </div>
  );
}
