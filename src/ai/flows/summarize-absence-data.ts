// Summarize Absence Data
'use server';
/**
 * @fileOverview Summarizes absence data to identify trends or issues for managers.
 *
 * - summarizeAbsenceData - A function that takes absence records and provides a summary.
 * - SummarizeAbsenceDataInput - The input type for the summarizeAbsenceData function.
 * - SummarizeAbsenceDataOutput - The return type for the summarizeAbsenceData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAbsenceDataInputSchema = z.object({
  absenceRecords: z.array(
    z.object({
      employeeId: z.string(),
      startDate: z.string().describe('Start date of the absence (YYYY-MM-DD).'),
      endDate: z.string().describe('End date of the absence (YYYY-MM-DD).'),
      reason: z.string(),
    })
  ).describe('An array of absence records for employees.'),
});
export type SummarizeAbsenceDataInput = z.infer<typeof SummarizeAbsenceDataInputSchema>;

const SummarizeAbsenceDataOutputSchema = z.object({
  summary: z.string().describe('A summary of the absence data, highlighting any trends or issues.'),
});
export type SummarizeAbsenceDataOutput = z.infer<typeof SummarizeAbsenceDataOutputSchema>;

export async function summarizeAbsenceData(input: SummarizeAbsenceDataInput): Promise<SummarizeAbsenceDataOutput> {
  return summarizeAbsenceDataFlow(input);
}

const summarizeAbsenceDataPrompt = ai.definePrompt({
  name: 'summarizeAbsenceDataPrompt',
  input: {schema: SummarizeAbsenceDataInputSchema},
  output: {schema: SummarizeAbsenceDataOutputSchema},
  prompt: `You are an AI assistant helping managers understand employee absence data.
  Given the following absence records, provide a concise summary highlighting any trends, issues, or notable patterns.
  Absence Records:
  {{#each absenceRecords}}
  - Employee ID: {{employeeId}}, Start Date: {{startDate}}, End Date: {{endDate}}, Reason: {{reason}}
  {{/each}}
  Summary:
  `,
});

const summarizeAbsenceDataFlow = ai.defineFlow(
  {
    name: 'summarizeAbsenceDataFlow',
    inputSchema: SummarizeAbsenceDataInputSchema,
    outputSchema: SummarizeAbsenceDataOutputSchema,
  },
  async input => {
    const {output} = await summarizeAbsenceDataPrompt(input);
    return output!;
  }
);
