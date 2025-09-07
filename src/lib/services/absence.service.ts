
'use server';

import { ABSENCE_REQUESTS } from '@/lib/data';
import type { AbsenceRequest } from '@/lib/types';

export async function getAbsenceRequests(): Promise<AbsenceRequest[]> {
  // In a real app, you'd fetch this from a database.
  return Promise.resolve(ABSENCE_REQUESTS);
}

export async function getAbsenceRequestById(id: string): Promise<AbsenceRequest | undefined> {
    return Promise.resolve(ABSENCE_REQUESTS.find(r => r.id === id));
}

export async function addAbsenceRequest(request: Omit<AbsenceRequest, 'id'>): Promise<AbsenceRequest> {
    const newRequest: AbsenceRequest = {
        ...request,
        id: `req${ABSENCE_REQUESTS.length + 1}`,
    };
    ABSENCE_REQUESTS.unshift(newRequest);
    return Promise.resolve(newRequest);
}

export async function updateAbsenceRequestStatus(id: string, status: 'Approved' | 'Rejected'): Promise<AbsenceRequest | undefined> {
    const requestIndex = ABSENCE_REQUESTS.findIndex(req => req.id === id);
    if (requestIndex !== -1) {
        ABSENCE_REQUESTS[requestIndex].status = status;
        return Promise.resolve(ABSENCE_REQUESTS[requestIndex]);
    }
    return Promise.resolve(undefined);
}
    