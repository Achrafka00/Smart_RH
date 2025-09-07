
'use server';

import { JOB_POSTINGS, APPLICATIONS } from '@/lib/data';
import type { JobPosting, Application } from '@/lib/types';

let jobPostingsData = [...JOB_POSTINGS];
let applicationsData = [...APPLICATIONS];


export async function getJobPostings(): Promise<JobPosting[]> {
  // In a real app, you'd fetch this from a database.
  return Promise.resolve(jobPostingsData);
}

export async function getApplications(): Promise<Application[]> {
    // In a real app, you'd fetch this from a database.
    return Promise.resolve(applicationsData);
}

export async function getApplicationsForJob(jobId: string): Promise<Application[]> {
    return Promise.resolve(applicationsData.filter(app => app.jobId === jobId));
}

export async function addJobPosting(job: Omit<JobPosting, 'id' | 'status' | 'createdAt'>): Promise<JobPosting> {
    const newJob: JobPosting = {
        ...job,
        id: `job${jobPostingsData.length + 1}_${Date.now()}`,
        status: 'Open',
        createdAt: new Date(),
    };
    jobPostingsData.unshift(newJob);
    return Promise.resolve(newJob);
}

export async function updateJobPostingStatus(jobId: string, status: 'Open' | 'Closed'): Promise<JobPosting | undefined> {
    const jobIndex = jobPostingsData.findIndex(job => job.id === jobId);
    if (jobIndex !== -1) {
        jobPostingsData[jobIndex].status = status;
        return Promise.resolve(jobPostingsData[jobIndex]);
    }
    return Promise.resolve(undefined);
}
