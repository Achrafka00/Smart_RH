
'use server';

import { EMPLOYEES } from '@/lib/data';
import type { Employee, UserRole } from '@/lib/types';

let employeesData = [...EMPLOYEES];

export async function getEmployees(): Promise<Employee[]> {
  // In a real app, you'd fetch this from a database.
  return Promise.resolve(employeesData);
}

export async function getEmployeeById(id: string): Promise<Employee | undefined> {
    // In a real app, you'd fetch this from a database.
    return Promise.resolve(employeesData.find(e => e.id === id));
}

export async function getEmployeeByRole(role: UserRole): Promise<Employee | undefined> {
    if (role === 'HR') {
        // Ensure the HR manager always exists
        const hrManager = employeesData.find(e => e.email === 'jane@talentflow.com');
        if (hrManager) return Promise.resolve(hrManager);
        // If they got deleted somehow, use the default from the original list
        return Promise.resolve(EMPLOYEES.find(e => e.email === 'jane@talentflow.com'));

    }
    // For demo purposes, return a specific employee for the 'Employee' role.
    const employee = employeesData.find(e => e.email === 'fiona@talentflow.com');
    if (employee) return Promise.resolve(employee);
    // If they got deleted, return the first non-hr person
    return Promise.resolve(employeesData.find(e => e.email !== 'jane@talentflow.com'));
}

export async function addEmployee(employee: Omit<Employee, 'id'>): Promise<Employee> {
    const newEmployee: Employee = {
        ...employee,
        id: `emp${employeesData.length + 1}_${Date.now()}`, // more unique id
    };
    employeesData.unshift(newEmployee);
    return Promise.resolve(newEmployee);
}

export async function deleteEmployee(employeeId: string): Promise<void> {
    employeesData = employeesData.filter(emp => emp.id !== employeeId);
    return Promise.resolve();
}
