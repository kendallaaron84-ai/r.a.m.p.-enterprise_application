import React, { useState, useEffect } from 'react';
import { auth } from './firebase'; // Use the configured instance
import { onAuthStateChanged, User } from 'firebase/auth';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Forms } from './components/Forms';
import { Admin } from './components/Admin';
import { Login } from './components/Login';
import { INITIAL_SHIFTS, INITIAL_EMPLOYEES, INITIAL_TOOLTIPS, INITIAL_COHORTS, INITIAL_EXTERNAL_REPS, INITIAL_TIME_LOGS } from './constants';
import { AppState, Shift, TravelRequest, ExternalRep, TimeLog } from './types';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // App State
  const [isDark, setIsDark] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  
  // Data State
  const [state, setState] = useState<AppState>({
    shifts: INITIAL_SHIFTS,
    employees: INITIAL_EMPLOYEES,
    tooltips: INITIAL_TOOLTIPS,
    cohorts: INITIAL_COHORTS,
    externalReps: INITIAL_EXTERNAL_REPS,
    timeLogs: INITIAL_TIME_LOGS,
    travelRequests: []
  });

  // 1. Listen for Auth Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Apply Theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // --- Actions ---

  const updateShift = (updatedShift: Shift) => {
    setState(prev => ({
      ...prev,
      shifts: prev.shifts.map(s => s.id === updatedShift.id ? updatedShift : s)
    }));
  };

  const updateTooltip = (key: string, val: string) => {
    setState(prev => ({ ...prev, tooltips: { ...prev.tooltips, [key]: val } }));
  };

  const addExternalRep = (rep: ExternalRep) => {
    setState(prev => ({ ...prev, externalReps: [...prev.externalReps, rep] }));
  };

  const submitTimeLog = (log: TimeLog) => {
    setState(prev => ({ ...prev, timeLogs: [...prev.timeLogs, log] }));
  };

  const submitTravel = (req: TravelRequest) => {
    setState(prev => ({ ...prev, travelRequests: [...prev.travelRequests, req] }));
  };

  const processApproval = (id: string, type: 'time' | 'travel', status: 'Approved' | 'Rejected') => {
    if (type === 'time') {
      setState(prev => ({
        ...prev,
        timeLogs: prev.timeLogs.map(log => 
          log.id === id ? { ...log, status, approvedAt: new Date().toISOString() } : log
        )
      }));
    } else {
      setState(prev => ({
        ...prev,
        travelRequests: prev.travelRequests.map(req => 
          req.id === id ? { ...req, status } : req
        )
      }));
    }
  };

  // --- Render Logic ---

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-ramp-gold animate-spin" />
      </div>
    );
  }

  // FORCE LOGIN IF NO USER
  if (!user) {
    return <Login />;
  }

  // Main App (Authenticated)
  return (
    <Layout 
      activeView={activeView} 
      setView={setActiveView}
      isDark={isDark}
      toggleTheme={() => setIsDark(!isDark)}
    >
      {activeView === 'dashboard' && (
        <Dashboard 
          shifts={state.shifts} 
          employees={state.employees} 
          timeLogs={state.timeLogs} 
          travelRequests={state.travelRequests} 
          tooltips={state.tooltips} 
        />
      )}
      
      {activeView === 'forms' && (
        <Forms 
          state={state} 
          submitTimeLog={submitTimeLog}
          submitTravel={submitTravel}
        />
      )}

      {activeView === 'admin' && (
        <Admin 
          state={state} 
          updateShift={updateShift}
          updateTooltip={updateTooltip}
          addExternalRep={addExternalRep}
          processApproval={processApproval}
        />
      )}
    </Layout>
  );
};

export default App;