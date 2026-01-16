import React, { useMemo } from 'react';
import { Shift, Employee, TooltipConfig, TimeLog, TravelRequest } from '../types';
import { Tooltip } from './Tooltip';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { DollarSign, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

interface DashboardProps {
  shifts: Shift[];
  employees: Employee[];
  timeLogs: TimeLog[];
  travelRequests: TravelRequest[];
  tooltips: TooltipConfig;
}

export const Dashboard: React.FC<DashboardProps> = ({ shifts, employees, timeLogs, travelRequests, tooltips }) => {
  
  // --- Enhanced Calculations with Transactional Logic ---

  const metrics = useMemo(() => {
    let totalPlannedBudget = 0;
    let totalActualBudget = 0;
    let totalCV = 0;
    let totalSV = 0;
    
    // 1. Calculate Shift Totals
    shifts.forEach(shift => {
      totalPlannedBudget += shift.plannedBudget;
      totalActualBudget += shift.actualBudget; // This comes from Admin entry for specific shifts
      
      // CV & SV Logic
      const cv = shift.plannedBudget - shift.actualBudget;
      totalCV += cv;
      
      const getDuration = (start: string, end: string) => {
        if (!start || !end) return 0;
        return (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 3600 * 24);
      };
      
      const plannedDur = getDuration(shift.plannedStart, shift.plannedEnd);
      const actualDur = getDuration(shift.actualStart, shift.actualEnd);
      
      if (shift.actualStart && shift.actualEnd) {
        totalSV += (plannedDur - actualDur);
      }
    });

    return {
      totalPlannedBudget,
      totalActualBudget,
      totalCV,
      totalSV
    };
  }, [shifts]);

  // 2. Employee Utilization Roll-up (Calculated from Approved Logs)
  const employeeMetrics = useMemo(() => {
    return employees.map(emp => {
      // Filter logs for this employee that are APPROVED
      const myLogs = timeLogs.filter(l => l.employeeId === emp.id && l.status === 'Approved');
      
      const totalBillable = myLogs.reduce((acc, curr) => acc + curr.billableHours, 0);
      const totalActual = myLogs.reduce((acc, curr) => acc + curr.actualHours, 0);
      
      // Calculate total cost (Wage * Actual Hours)
      const laborCost = totalActual * emp.wage;

      return {
        ...emp,
        calculatedBillable: totalBillable,
        calculatedActual: totalActual,
        laborCost,
        utilization: totalActual > 0 ? (totalBillable / totalActual) * 100 : 0
      };
    });
  }, [employees, timeLogs]);

  // Chart Data
  const chartData = shifts.map(s => ({
    name: `S${s.id}`,
    Planned: s.plannedBudget,
    Actual: s.actualBudget,
  }));

  // Helper Component
  const MetricCard = ({ title, value, subtext, icon: Icon, isGood, tooltipKey }: any) => (
    <div className="bg-white dark:bg-ramp-surface p-6 rounded-lg shadow-md border-l-4 border-ramp-gold">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium flex items-center">
          {title}
          <Tooltip content={tooltips[tooltipKey] || ''} />
        </h3>
        <div className="p-2 bg-gray-100 dark:bg-black rounded-full">
          <Icon className="w-5 h-5 text-ramp-gold" />
        </div>
      </div>
      <div className={`text-2xl font-bold ${isGood === undefined ? 'text-gray-900 dark:text-ramp-text' : isGood ? 'text-green-500' : 'text-red-500'}`}>
        {value}
      </div>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Budget (Planned)" 
          value={`$${metrics.totalPlannedBudget.toLocaleString()}`}
          icon={DollarSign}
          tooltipKey="cv_label"
        />
        <MetricCard 
          title="Cost Variance (CV)" 
          value={`$${metrics.totalCV.toLocaleString()}`}
          isGood={metrics.totalCV >= 0}
          subtext={metrics.totalCV >= 0 ? "Under Budget" : "Over Budget"}
          icon={TrendingUp}
          tooltipKey="cv_label"
        />
        <MetricCard 
          title="Schedule Variance (SV)" 
          value={`${metrics.totalSV.toFixed(1)} Days`}
          isGood={metrics.totalSV >= 0}
          subtext={metrics.totalSV >= 0 ? "Ahead of Schedule" : "Behind Schedule"}
          icon={Clock}
          tooltipKey="sv_label"
        />
        <MetricCard 
          title="Program Health" 
          value={metrics.totalCV >= 0 && metrics.totalSV >= 0 ? "ON TRACK" : "AT RISK"}
          isGood={metrics.totalCV >= 0 && metrics.totalSV >= 0}
          icon={AlertTriangle}
          tooltipKey="prog_var_label"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Simplified Gantt - Visualization Only */}
        <div className="lg:col-span-2 bg-white dark:bg-ramp-surface p-6 rounded-lg shadow-md">
           <h2 className="text-xl font-bold text-gray-900 dark:text-ramp-text mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
            Executive Gantt Roll-up
          </h2>
          <div className="text-center text-gray-500 py-10">
            {/* Keeping the visual simple for now to focus on the Form logic */}
            (Gantt Chart Visualization active in full version)
          </div>
        </div>

        {/* Budget Chart */}
        <div className="bg-white dark:bg-ramp-surface p-6 rounded-lg shadow-md">
           <h2 className="text-xl font-bold text-gray-900 dark:text-ramp-text mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
            Budget Variance
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.2} />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#D4AF37', color: '#fff' }}/>
                <Legend />
                <Bar dataKey="Planned" fill="#888888" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Actual" fill="#D4AF37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Employee Utilization Table - Now Driven by APPROVED Time Logs */}
      <div className="bg-white dark:bg-ramp-surface rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-ramp-text">Real-Time Utilization (Approved Logs Only)</h2>
          <span className="text-xs text-gray-500 bg-gray-100 dark:bg-black px-2 py-1 rounded">Live Data</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-black text-gray-500 dark:text-gray-400 uppercase text-xs">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Cohort</th>
                <th className="p-4 text-right">Wage/Hr</th>
                <th className="p-4 text-right">Approved Billable</th>
                <th className="p-4 text-right">Approved Actual</th>
                <th className="p-4 text-right">Labor Cost (Est)</th>
                <th className="p-4 text-right">Utilization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {employeeMetrics.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                  <td className="p-4 text-gray-900 dark:text-ramp-text font-medium">{emp.firstName} {emp.lastName}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">{emp.cohortId}</td>
                  <td className="p-4 text-right text-gray-600 dark:text-gray-400">${emp.wage}</td>
                  <td className="p-4 text-right text-gray-600 dark:text-gray-400 font-mono">{emp.calculatedBillable.toFixed(1)}</td>
                  <td className="p-4 text-right text-gray-600 dark:text-gray-400 font-mono">{emp.calculatedActual.toFixed(1)}</td>
                  <td className="p-4 text-right text-gray-600 dark:text-gray-400">${emp.laborCost.toLocaleString()}</td>
                  <td className="p-4 text-right">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${emp.utilization >= 90 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {emp.utilization.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};