
'use server';

import { JOB_POSTINGS, APPLICATIONS } from '@/lib/data';
import type { JobPosting, Application } from '@/lib/types';

export async function getJobPostings(): Promise<JobPosting[]> {
  // In a real app, you'd fetch this from a database.
  return Promise.resolve(JOB_POSTINGS);
}

export async function getApplications(): Promise<Application[]> {
    // In a real app, you'd fetch this from a database.
    return Promise.resolve(APPLICATIONS);
}

export async function getApplicationsForJob(jobId: string): Promise<Application[]> {
    return Promise.resolve(APPLICATIONS.filter(app => app.jobId === jobId));
}

