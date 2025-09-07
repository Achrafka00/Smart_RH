"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { RoleGate } from "@/components/role-gate";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { summarizeAbsenceData } from "@/ai/flows/summarize-absence-data";
import { suggestEmployeeActions } from "@/ai/flows/suggest-employee-actions";
import { ABSENCE_REQUESTS, EMPLOYEES } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Lightbulb } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

export default function InsightsPage() {
  const { toast } = useToast();
  const [summary, setSummary] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  
  const [employeeName, setEmployeeName] = useState("");
  const [teamMorale, setTeamMorale] = useState("");
  const [recentEvents, setRecentEvents] = useState("");

  const handleSummarize = async () => {
    setIsSummaryLoading(true);
    setSummary("");
    try {
      const absenceRecords = ABSENCE_REQUESTS.map(req => ({
        ...req,
        startDate: format(req.startDate, 'yyyy-MM-dd'),
        endDate: format(req.endDate, 'yyyy-MM-dd')
      }));
      const result = await summarizeAbsenceData({ absenceRecords });
      setSummary(result.summary);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate absence summary.",
      });
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handleSuggestActions = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuggestionsLoading(true);
    setSuggestions([]);
    
    const selectedEmployee = EMPLOYEES.find(emp => emp.name === employeeName);
    if (!selectedEmployee) {
        toast({ variant: "destructive", title: "Please select an employee."});
        setIsSuggestionsLoading(false);
        return;
    }

    try {
      const result = await suggestEmployeeActions({ 
        employeeName: selectedEmployee.name,
        employeeRole: selectedEmployee.role,
        teamMorale,
        recentEvents 
      });
      setSuggestions(result.suggestedActions);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate suggestions.",
      });
    } finally {
      setIsSuggestionsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <RoleGate allowedRoles={["HR"]}>
        <PageHeader
          title="AI-Powered Insights"
          description="Leverage AI to understand your team better and take meaningful actions."
        />
        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Absence Data Summary</CardTitle>
              <CardDescription>
                Generate an AI summary of team-wide absence records to identify trends.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleSummarize} disabled={isSummaryLoading}>
                {isSummaryLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Summary
              </Button>
              {isSummaryLoading && <p className="text-sm text-muted-foreground">AI is analyzing the data...</p>}
              {summary && (
                <div className="p-4 bg-secondary rounded-lg">
                  <h4 className="font-semibold mb-2">Summary:</h4>
                  <p className="text-sm text-secondary-foreground whitespace-pre-wrap">{summary}</p>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Managerial Action Suggestions</CardTitle>
              <CardDescription>
                Get AI-driven suggestions for supporting an employee based on context.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSuggestActions} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="employee">Employee</Label>
                  <Select onValueChange={setEmployeeName} value={employeeName}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {EMPLOYEES.map(emp => <SelectItem key={emp.id} value={emp.name}>{emp.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="morale">Team Morale</Label>
                  <Input id="morale" value={teamMorale} onChange={e => setTeamMorale(e.target.value)} placeholder="e.g., High, but some are feeling burnt out" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="events">Recent Events</Label>
                  <Textarea id="events" value={recentEvents} onChange={e => setRecentEvents(e.target.value)} placeholder="e.g., Completed a major project milestone" />
                </div>
                <Button type="submit" disabled={isSuggestionsLoading}>
                  {isSuggestionsLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Get Suggestions
                </Button>
              </form>
               {isSuggestionsLoading && <p className="text-sm text-muted-foreground mt-4">AI is crafting suggestions...</p>}
              {suggestions.length > 0 && (
                <div className="mt-6 p-4 bg-secondary rounded-lg">
                  <h4 className="font-semibold mb-2">Suggested Actions:</h4>
                  <ul className="space-y-2">
                    {suggestions.map((action, index) => (
                      <li key={index} className="flex items-start">
                        <Lightbulb className="h-4 w-4 mr-2 mt-1 text-accent flex-shrink-0" />
                        <span className="text-sm">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
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
