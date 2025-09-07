export type UserRole = "Employee" | "HR";

export type Employee = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  team: string;
};

export type AbsenceRequest = {
  id: string;
  employeeId: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
};

export type JobPosting = {
  id: string;
  title: string;
  description: string;
  status: "Open" | "Closed";
  createdAt: Date;
};

export type Application = {
  id: string;
  jobId: string;
  candidateName: string;
  candidateEmail: string;
  cvUrl: string;
  status: "Received" | "Under Review" | "Rejected" | "Hired";
  appliedAt: Date;
};
