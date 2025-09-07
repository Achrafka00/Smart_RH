
import type { Employee, AbsenceRequest, JobPosting, Application, Message, Conversation } from './types';

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

export const JOB_POSTINGS: JobPosting[] = [
    { id: 'job1', title: 'Senior Frontend Developer', description: 'Join our team to build amazing user experiences.', status: 'Open', createdAt: new Date('2024-07-15') },
    { id: 'job2', title: 'Lead Backend Engineer', description: 'Lead our API team and build scalable services.', status: 'Open', createdAt: new Date('2024-07-10') },
    { id: 'job3', title: 'Marketing Intern', description: 'Summer internship opportunity for marketing students.', status: 'Closed', createdAt: new Date('2024-05-20') },
];

export const APPLICATIONS: Application[] = [
    { id: 'app1', jobId: 'job1', candidateName: 'Liam Gallagher', candidateEmail: 'liam.g@example.com', cvUrl: '#', status: 'Received', appliedAt: new Date('2024-07-20') },
    { id: 'app2', jobId: 'job1', candidateName: 'Noel Gallagher', candidateEmail: 'noel.g@example.com', cvUrl: '#', status: 'Under Review', appliedAt: new Date('2024-07-21') },
    { id: 'app3', jobId: 'job2', candidateName: 'Damon Albarn', candidateEmail: 'damon.a@example.com', cvUrl: '#', status: 'Received', appliedAt: new Date('2024-07-18') },
    { id: 'app4', jobId: 'job3', candidateName: 'Graham Coxon', candidateEmail: 'graham.c@example.com', cvUrl: '#', status: 'Hired', appliedAt: new Date('2024-06-01') },
];

// Mock data for Messages and Conversations
export const MESSAGES: Message[] = [
    { id: 'msg1', conversationId: 'conv1', senderId: '6', content: 'Hey Jane, do you have a minute to chat?', timestamp: new Date(new Date().getTime() - 1000 * 60 * 5) },
    { id: 'msg2', conversationId: 'conv1', senderId: '10', content: 'Sure Fiona, what\'s up?', timestamp: new Date(new Date().getTime() - 1000 * 60 * 4) },
    { id: 'msg3', conversationId: 'conv1', senderId: '6', content: 'I wanted to ask about the new project timeline.', timestamp: new Date(new Date().getTime() - 1000 * 60 * 3) },
    { id: 'msg4', conversationId: 'conv2', senderId: '1', content: 'Hey Bob, did you see the latest API docs?', timestamp: new Date(new Date().getTime() - 1000 * 60 * 60 * 2) },
    { id: 'msg5', conversationId: 'conv2', senderId: '2', content: 'Not yet, I\'ll check them out now.', timestamp: new Date(new Date().getTime() - 1000 * 60 * 60 * 1) },
];

export const CONVERSATIONS: Conversation[] = [
    { id: 'conv1', participantIds: ['6', '10'], lastMessage: MESSAGES[2] },
    { id: 'conv2', participantIds: ['1', '2'], lastMessage: MESSAGES[4] },
];
