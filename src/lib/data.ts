import type { Employee, AbsenceRequest } from './types';

export const EMPLOYEES: Employee[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@talentflow.com', avatar: 'https://picsum.photos/id/237/200/200', role: 'Frontend Developer', team: 'Web' },
  { id: '2', name: 'Bob Williams', email: 'bob@talentflow.com', avatar: 'https://picsum.photos/id/238/200/200', role: 'Backend Developer', team: 'API' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@talentflow.com', avatar: 'https://picsum.photos/id/239/200/200', role: 'UI/UX Designer', team: 'Design' },
  { id: '4', name: 'Diana Miller', email: 'diana@talentflow.com', avatar: 'https://picsum.photos/id/240/200/200', role: 'Project Manager', team: 'Management' },
  { id: '5', name: 'Ethan Davis', email: 'ethan@talentflow.com', avatar: 'https://picsum.photos/id/241/200/200', role: 'DevOps Engineer', team: 'Infrastructure' },
  { id: '6', name: 'Fiona Clark', email: 'fiona@talentflow.com', avatar: 'https://picsum.photos/id/242/200/200', role: 'QA Tester', team: 'Web' },
  { id: '7', name: 'George Harrison', email: 'george@talentflow.com', avatar: 'https://picsum.photos/id/243/200/200', role: 'Product Owner', team: 'Management' },
  { id: '8', name: 'Hannah Scott', email: 'hannah@talentflow.com', avatar: 'https://picsum.photos/id/244/200/200', role: 'Data Scientist', team: 'API' },
  { id: '9', name: 'Ian Taylor', email: 'ian@talentflow.com', avatar: 'https://picsum.photos/id/247/200/200', role: 'Frontend Developer', team: 'Web' },
  { id: '10', name: 'Jane Doe', email: 'jane@talentflow.com', avatar: 'https://picsum.photos/id/248/200/200', role: 'HR Manager', team: 'Management' }
];

export const ABSENCE_REQUESTS: AbsenceRequest[] = [
  { id: 'req1', employeeId: '1', startDate: new Date('2024-08-01'), endDate: new Date('2024-08-05'), reason: 'Vacation', status: 'Approved' },
  { id: 'req2', employeeId: '2', startDate: new Date('2024-08-10'), endDate: new Date('2024-08-11'), reason: 'Sick leave', status: 'Approved' },
  { id: 'req3', employeeId: '3', startDate: new Date('2024-09-01'), endDate: new Date('2024-09-07'), reason: 'Family trip', status: 'Pending' },
  { id: 'req4', employeeId: '6', startDate: new Date('2024-08-15'), endDate: new Date('2024-08-16'), reason: 'Doctor appointment', status: 'Pending' },
  { id: 'req5', employeeId: '5', startDate: new Date('2024-07-25'), endDate: new Date('2024-07-25'), reason: 'Personal day', status: 'Approved' },
  { id: 'req6', employeeId: '1', startDate: new Date('2024-10-10'), endDate: new Date('2024-10-20'), reason: 'Extended vacation', status: 'Pending' },
  { id: 'req7', employeeId: '4', startDate: new Date('2024-08-20'), endDate: new Date('2024-08-22'), reason: 'Conference', status: 'Approved' },
  { id: 'req8', employeeId: '6', startDate: new Date(), endDate: new Date(new Date().setDate(new Date().getDate() + 2)), reason: 'Feeling unwell', status: 'Approved' },
];
