export interface Shift {
  id: number;
  name: string;
  description: string;
  plannedStart: string; // YYYY-MM-DD
  plannedEnd: string;
  plannedBudget: number;
  actualStart: string;
  actualEnd: string;
  actualBudget: number;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  wage: number;
  cohortId: string;
  // Totals are now derived from TimeLogs, but kept here for quick profile view if needed
  totalBillableHours?: number; 
  totalActualHours?: number;
}

export interface TimeLog {
  id: string;
  employeeId: string;
  cohortId: string;
  weekEnding: string; // YYYY-MM-DD
  billableHours: number;
  actualHours: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
  approvedAt?: string;
}

export interface TravelRequest {
  id: string;
  employeeId: string;
  weekEnding: string; // Link to the timesheet week
  lodgingCost: number;
  distanceMiles: number;
  totalReimbursement: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  attachmentName?: string; // Mocking the file upload
}

export interface Cohort {
  id: string;
  name: string;
}

export interface ExternalRep {
  id: string;
  name: string;
  company: string;
}

export interface TooltipConfig {
  [key: string]: string;
}

export interface AppState {
  shifts: Shift[];
  employees: Employee[];
  timeLogs: TimeLog[]; // New Transactional Data
  travelRequests: TravelRequest[];
  externalReps: ExternalRep[];
  tooltips: TooltipConfig;
  cohorts: Cohort[];
}