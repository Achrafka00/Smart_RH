"use client";
import React, { useState } from "react";
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
import { ABSENCE_REQUESTS, EMPLOYEES } from "@/lib/data";
import type { AbsenceRequest } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const { role } = useRole();
  const { toast } = useToast();
  const [requests, setRequests] = useState<AbsenceRequest[]>(ABSENCE_REQUESTS);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newRequest: AbsenceRequest = {
      id: `req${requests.length + 1}`,
      employeeId: role === "HR" ? EMPLOYEES[9].id : EMPLOYEES[5].id, // Mock current user
      startDate: values.dateRange.from,
      endDate: values.dateRange.to,
      reason: values.reason,
      status: "Pending",
    };
    setRequests([newRequest, ...requests]);
    toast({
      title: "Request Submitted",
      description: "Your time off request has been successfully submitted.",
    });
    setOpen(false);
    form.reset();
  };

  const handleRequestStatus = (
    id: string,
    status: "Approved" | "Rejected"
  ) => {
    setRequests(
      requests.map((req) => (req.id === id ? { ...req, status } : req))
    );
    toast({
      title: `Request ${status}`,
      description: `The request has been ${status.toLowerCase()}.`,
    });
  };
  
  const myUserId = role === "HR" ? EMPLOYEES[9].id : EMPLOYEES[5].id;

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
                {requests
                  .filter((req) => req.employeeId === myUserId)
                  .map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>{`${format(req.startDate, "MMM d")} - ${format(
                        req.endDate,
                        "MMM d, yyyy"
                      )}`}</TableCell>
                      <TableCell>{req.reason}</TableCell>
                      <TableCell>{formatDistanceToNow(req.startDate)} ago</TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(req.status)}>{req.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
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
                {requests
                  .filter((req) => req.status === "Pending")
                  .map((req) => {
                    const employee = EMPLOYEES.find(e => e.id === req.employeeId);
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
                      <TableCell>{`${format(req.startDate, "MMM d")} - ${format(
                        req.endDate,
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
                  )})}
              </TableBody>
            </Table>
            </div>
          </TabsContent>
        </RoleGate>
      </Tabs>
    </div>
  );
}
