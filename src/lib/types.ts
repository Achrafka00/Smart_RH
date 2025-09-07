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
