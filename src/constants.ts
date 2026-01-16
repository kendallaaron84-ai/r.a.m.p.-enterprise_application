import { Shift, Employee, TooltipConfig, Cohort, ExternalRep, TimeLog } from './types';

export const INITIAL_TOOLTIPS: TooltipConfig = {
  cv_label: "Cost Variance: The difference between what we planned to spend and what was actually spent. (Planned - Actual)",
  sv_label: "Schedule Variance: The difference in duration between planned and actual timelines.",
  prog_var_label: "Total Program Variance: The sum of all cost and schedule variances across all shifts.",
  shift_1_label: "Shift 1: Focused on internal mindset and courageous leadership.",
  shift_2_label: "Shift 2: Strategic alignment and market positioning.",
  shift_3_label: "Shift 3: Operational excellence and execution.",
  shift_4_label: "Shift 4: Innovation and scaling.",
  shift_5_label: "Shift 5: Sustainability and legacy building.",
  billable_hours_label: "Hours strictly chargeable to the client project code.",
  travel_reimb_label: "Calculated at standard rate ($0.67/mile) plus lodging.",
};

export const INITIAL_SHIFTS: Shift[] = [
  {
    id: 1,
    name: "Shift 1: Mindset",
    description: "Operate with Courageous Mindset",
    plannedStart: "2023-10-01",
    plannedEnd: "2023-10-15",
    plannedBudget: 15000,
    actualStart: "2023-10-02",
    actualEnd: "2023-10-18",
    actualBudget: 16500,
  },
  {
    id: 2,
    name: "Shift 2: Strategy",
    description: "Market Alignment",
    plannedStart: "2023-10-20",
    plannedEnd: "2023-11-05",
    plannedBudget: 20000,
    actualStart: "2023-10-21",
    actualEnd: "2023-11-04",
    actualBudget: 18500,
  },
  {
    id: 3,
    name: "Shift 3: Execution",
    description: "Operational Excellence",
    plannedStart: "2023-11-10",
    plannedEnd: "2023-11-25",
    plannedBudget: 25000,
    actualStart: "2023-11-12",
    actualEnd: "2023-11-30",
    actualBudget: 28000,
  },
  {
    id: 4,
    name: "Shift 4: Scale",
    description: "Innovation Growth",
    plannedStart: "2023-12-01",
    plannedEnd: "2023-12-20",
    plannedBudget: 30000,
    actualStart: "2023-12-02",
    actualEnd: "",
    actualBudget: 12000,
  },
  {
    id: 5,
    name: "Shift 5: Legacy",
    description: "Sustainability",
    plannedStart: "2024-01-05",
    plannedEnd: "2024-01-20",
    plannedBudget: 18000,
    actualStart: "",
    actualEnd: "",
    actualBudget: 0,
  },
];

export const INITIAL_EMPLOYEES: Employee[] = [
  { id: '1', firstName: 'John', lastName: 'Doe', wage: 85, cohortId: 'c1' },
  { id: '2', firstName: 'Jane', lastName: 'Smith', wage: 95, cohortId: 'c1' },
  { id: '3', firstName: 'Michael', lastName: 'Johnson', wage: 75, cohortId: 'c2' },
];

export const INITIAL_COHORTS: Cohort[] = [
  { id: 'c1', name: 'Alpha Cohort 2023' },
  { id: 'c2', name: 'Bravo Cohort 2023' },
  { id: 'c3', name: 'Charlie Cohort 2024' },
];

export const INITIAL_EXTERNAL_REPS: ExternalRep[] = [
  { id: 'r1', name: 'Sarah Connor', company: 'Skynet Consulting' },
];

// Pre-load some pending logs so you can test the queue immediately
export const INITIAL_TIME_LOGS: TimeLog[] = [
  { 
    id: 'log-001', 
    employeeId: '1', 
    cohortId: 'c1', 
    weekEnding: '2023-11-03', 
    billableHours: 40, 
    actualHours: 42, 
    status: 'Pending' 
  },
  { 
    id: 'log-002', 
    employeeId: '2', 
    cohortId: 'c1', 
    weekEnding: '2023-11-03', 
    billableHours: 35, 
    actualHours: 35, 
    status: 'Approved',
    approvedAt: '2023-11-04'
  }
];