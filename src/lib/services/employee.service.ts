
'use server';

import { EMPLOYEES } from '@/lib/data';
import type { Employee, UserRole } from '@/lib/types';

export async function getEmployees(): Promise<Employee[]> {
  // In a real app, you'd fetch this from a database.
  return Promise.resolve(EMPLOYEES);
}

export async function getEmployeeById(id: string): Promise<Employee | undefined> {
    // In a real app, you'd fetch this from a database.
    return Promise.resolve(EMPLOYEES.find(e => e.id === id));
}

export async function getEmployeeByRole(role: UserRole): Promise<Employee | undefined> {
    if (role === 'HR') {
        return Promise.resolve(EMPLOYEES.find(e => e.email === 'jane.doe@talentflow.com'));
    }
    // For demo purposes, return a specific employee for the 'Employee' role.
    return Promise.resolve(EMPLOYEES.find(e => e.email === 'fiona.clark@talentflow.com'));
}
