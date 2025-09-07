
'use server';

import { EMPLOYEES } from '@/lib/data';
import type { Employee } from '@/lib/types';

export async function getEmployees(): Promise<Employee[]> {
  // In a real app, you'd fetch this from a database.
  return Promise.resolve(EMPLOYEES);
}

export async function getEmployeeById(id: string): Promise<Employee | undefined> {
    // In a real app, you'd fetch this from a database.
    return Promise.resolve(EMPLOYEES.find(e => e.id === id));
}
    