import React, { useState } from 'react';
import { AppState, TravelRequest, TimeLog } from '../types';
import { Send, MapPin, Calculator, AlertCircle, Calendar, Upload, FileText } from 'lucide-react';

interface FormsProps {
  state: AppState;
  submitTimeLog: (log: TimeLog) => void;
  submitTravel: (req: TravelRequest) => void;
}

export const Forms: React.FC<FormsProps> = ({ state, submitTimeLog, submitTravel }) => {
  // Form State
  const [selectedEmp, setSelectedEmp] = useState('');
  const [weekEnding, setWeekEnding] = useState('');
  const [selectedCohort, setSelectedCohort] = useState('');
  
  const [billable, setBillable] = useState('');
  const [actual, setActual] = useState('');
  
  // Toggle for Conditional Logic
  const [hasTravel, setHasTravel] = useState(false);
  
  // Travel State
  const [lodging, setLodging] = useState('');
  const [miles, setMiles] = useState('');
  const [fileName, setFileName] = useState(''); // Simulate file attachment

  // UI State
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 1. Validation
    if (!selectedEmp || !weekEnding || !selectedCohort) {
      setError('Please fill in all required fields (Employee, Week, Cohort).');
      return;
    }

    const b = parseFloat(billable) || 0;
    const a = parseFloat(actual) || 0;

    if (b > a) {
      setError('Billable hours cannot exceed Actual hours.');
      return;
    }

    // 2. Submit Time Log
    const timeLog: TimeLog = {
      id: `log-${Date.now()}`,
      employeeId: selectedEmp,
      cohortId: selectedCohort,
      weekEnding,
      billableHours: b,
      actualHours: a,
      status: 'Pending'
    };
    submitTimeLog(timeLog);

    // 3. Submit Travel (If checked)
    if (hasTravel) {
      const m = parseFloat(miles) || 0;
      const l = parseFloat(lodging) || 0;
      const reimbursement = (m * 0.67) + l;

      const travelReq: TravelRequest = {
        id: `trv-${Date.now()}`,
        employeeId: selectedEmp,
        weekEnding,
        lodgingCost: l,
        distanceMiles: m,
        totalReimbursement: reimbursement,
        status: 'Pending',
        attachmentName: fileName
      };
      submitTravel(travelReq);
    }

    // 4. Reset & Notify
    setSuccess('Timesheet and Request submitted to Business Admin for approval.');
    setBillable('');
    setActual('');
    setLodging('');
    setMiles('');
    setFileName('');
    setHasTravel(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      
      <div className="bg-white dark:bg-ramp-surface p-6 rounded-lg shadow-lg border-t-4 border-ramp-gold">
        <div className="flex items-center mb-6">
          <FileText className="w-6 h-6 text-ramp-gold mr-2" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-ramp-text">Weekly Submission</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Employee</label>
              <select 
                value={selectedEmp} 
                onChange={e => setSelectedEmp(e.target.value)}
                className="w-full p-3 rounded bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-ramp-gold focus:outline-none"
              >
                <option value="">Select Name...</option>
                {state.employees.map(e => (
                  <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Week Ending</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <input 
                  type="date"
                  value={weekEnding}
                  onChange={e => setWeekEnding(e.target.value)}
                  className="w-full p-3 pl-10 rounded bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-ramp-gold focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cohort Assignment</label>
             <select 
                value={selectedCohort} 
                onChange={e => setSelectedCohort(e.target.value)}
                className="w-full p-3 rounded bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-ramp-gold focus:outline-none"
              >
                <option value="">Select Project Cohort...</option>
                {state.cohorts.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
          </div>

          {/* Section 2: Hours */}
          <div className="p-4 bg-gray-50 dark:bg-black rounded border border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Time Entry</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Actual Hours Worked</label>
                <input 
                  type="number" 
                  step="0.5"
                  value={actual}
                  onChange={e => setActual(e.target.value)}
                  className="w-full p-2 rounded bg-white dark:bg-ramp-surface border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-ramp-gold"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Billable Hours</label>
                <input 
                  type="number" 
                  step="0.5"
                  value={billable}
                  onChange={e => setBillable(e.target.value)}
                  className="w-full p-2 rounded bg-white dark:bg-ramp-surface border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-ramp-gold"
                  placeholder="0.0"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Conditional Travel */}
          <div className="flex items-center space-x-3">
            <input 
              type="checkbox" 
              id="hasTravel"
              checked={hasTravel}
              onChange={e => setHasTravel(e.target.checked)}
              className="w-5 h-5 text-ramp-gold rounded focus:ring-ramp-gold bg-gray-100 dark:bg-black border-gray-300 dark:border-gray-700"
            />
            <label htmlFor="hasTravel" className="text-gray-900 dark:text-ramp-text font-medium select-none cursor-pointer">
              Include Travel Reimbursement Request?
            </label>
          </div>

          {hasTravel && (
            <div className="p-4 bg-gray-50 dark:bg-black rounded border border-gray-100 dark:border-gray-800 animate-fade-in">
               <h3 className="text-sm font-bold text-gray-500 uppercase mb-4 flex items-center">
                 <MapPin className="w-4 h-4 mr-2" />
                 Travel Details
               </h3>
               
               <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Total Miles</label>
                    <input 
                      type="number" 
                      value={miles}
                      onChange={e => setMiles(e.target.value)}
                      className="w-full p-2 rounded bg-white dark:bg-ramp-surface border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                      placeholder="0"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Rate: $0.67/mile</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Lodging Cost ($)</label>
                    <input 
                      type="number" 
                      value={lodging}
                      onChange={e => setLodging(e.target.value)}
                      className="w-full p-2 rounded bg-white dark:bg-ramp-surface border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                      placeholder="0.00"
                    />
                  </div>
               </div>

               <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Attach Receipts / Itinerary</label>
                  <div className="flex items-center space-x-2">
                    <label className="cursor-pointer bg-white dark:bg-ramp-surface border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-50 dark:hover:bg-black transition-colors flex items-center">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                      <input type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                    <span className="text-sm text-gray-500 italic">{fileName || "No file chosen"}</span>
                  </div>
               </div>

               <div className="mt-4 p-3 bg-ramp-gold/10 rounded flex justify-between items-center">
                 <span className="text-sm font-bold text-ramp-gold">Estimated Reimbursement:</span>
                 <span className="text-xl font-bold text-gray-900 dark:text-white">
                   ${((parseFloat(miles)||0) * 0.67 + (parseFloat(lodging)||0)).toFixed(2)}
                 </span>
               </div>
            </div>
          )}

          {/* Feedback */}
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded flex items-center">
              <Send className="w-4 h-4 mr-2" />
              {success}
            </div>
          )}

          <button type="submit" className="w-full bg-ramp-gold hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded transition-colors flex justify-center items-center shadow-lg shadow-yellow-900/20">
            Submit for Approval
          </button>

        </form>
      </div>
    </div>
  );
};