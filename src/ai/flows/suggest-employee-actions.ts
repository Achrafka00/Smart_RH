'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting actions a manager can take to support their employees.
 *
 * The flow takes employee information and context as input and returns a list of suggested actions.
 * - suggestEmployeeActions - The function that triggers the flow and returns action suggestions.
 * - SuggestEmployeeActionsInput - The input type for the suggestEmployeeActions function.
 * - SuggestEmployeeActionsOutput - The output type for the suggestEmployeeActions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestEmployeeActionsInputSchema = z.object({
  employeeName: z.string().describe('The name of the employee.'),
  employeeRole: z.string().describe('The role of the employee.'),
  teamMorale: z.string().describe('A description of the current team morale.'),
  recentEvents: z.string().describe('Any recent events involving the employee or the team.'),
});

export type SuggestEmployeeActionsInput = z.infer<typeof SuggestEmployeeActionsInputSchema>;

const SuggestEmployeeActionsOutputSchema = z.object({
  suggestedActions: z
    .array(z.string())
    .describe('A list of suggested actions for the manager to take.'),
});

export type SuggestEmployeeActionsOutput = z.infer<typeof SuggestEmployeeActionsOutputSchema>;

export async function suggestEmployeeActions(
  input: SuggestEmployeeActionsInput
): Promise<SuggestEmployeeActionsOutput> {
  return suggestEmployeeActionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestEmployeeActionsPrompt',
  input: {schema: SuggestEmployeeActionsInputSchema},
  output: {schema: SuggestEmployeeActionsOutputSchema},
  prompt: `You are an AI assistant helping managers support their employees.

  Based on the employee's information, team morale, and recent events, suggest a list of actions the manager can take to support the employee.

  Employee Name: {{{employeeName}}}
  Employee Role: {{{employeeRole}}}
  Team Morale: {{{teamMorale}}}
  Recent Events: {{{recentEvents}}}

  Consider actions that can improve employee well-being, address potential issues, or enhance team collaboration.

  Format your response as a list of suggested actions.
  `,
});

const suggestEmployeeActionsFlow = ai.defineFlow(
  {
    name: 'suggestEmployeeActionsFlow',
    inputSchema: SuggestEmployeeActionsInputSchema,
    outputSchema: SuggestEmployeeActionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
