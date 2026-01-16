import React, { useState } from 'react';
import { LayoutDashboard, Users, FileText, Settings, Sun, Moon, Printer, Menu, X, LogOut } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  setView: (view: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeView, setView, isDark, toggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [printMode, setPrintMode] = useState(false);

  const togglePrintMode = () => {
    if (!printMode) {
      if (isDark) toggleTheme(); // Force light mode
      setPrintMode(true);
      setTimeout(() => window.print(), 500);
    } else {
      setPrintMode(false);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const NavItem = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => {
        setView(id);
        setMobileMenuOpen(false);
      }}
      className={`w-full flex items-center p-3 rounded-lg mb-2 transition-all duration-200 ${
        activeView === id 
        ? 'bg-ramp-gold text-black shadow-lg shadow-yellow-900/20' 
        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className={`min-h-screen flex bg-gray-50 dark:bg-black transition-colors duration-300 ${isDark ? 'dark' : ''}`}>
      
      {/* Sidebar - Hidden in Print Mode */}
      {!printMode && (
        <>
          <div className={`fixed inset-0 bg-black/50 z-40 md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`} onClick={() => setMobileMenuOpen(false)} />
          
          <aside className={`fixed md:relative z-50 w-64 h-screen bg-ramp-black border-r border-ramp-border flex flex-col transform transition-transform duration-300 md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-6 border-b border-ramp-border">
              <h1 className="text-2xl font-bold text-ramp-gold tracking-tight">R.A.M.P.</h1>
              <p className="text-xs text-gray-500 mt-1">ACCELERATOR v1.0</p>
            </div>
            
            <nav className="flex-1 p-4">
              <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
              <NavItem id="forms" label="Forms" icon={FileText} />
              <NavItem id="admin" label="Admin Portal" icon={Settings} />
            </nav>

            <div className="p-4 border-t border-ramp-border">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center p-2 text-red-400 hover:bg-red-900/20 rounded mb-4 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
              
              <div className="flex items-center bg-black/30 p-3 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-ramp-gold flex items-center justify-center text-black font-bold text-xs">
                  {auth.currentUser?.email?.substring(0,2).toUpperCase()}
                </div>
                <div className="ml-3 overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">{auth.currentUser?.email}</p>
                  <p className="text-[10px] text-gray-500">Online</p>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {!printMode && (
          <header className="h-16 bg-white dark:bg-ramp-surface border-b border-gray-200 dark:border-ramp-border flex items-center justify-between px-6 shadow-sm z-30">
            <button className="md:hidden text-gray-500" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
            
            <h2 className="text-lg font-semibold text-gray-800 dark:text-ramp-text ml-4 md:ml-0">
              {activeView === 'dashboard' && 'Executive Overview'}
              {activeView === 'forms' && 'Data Entry'}
              {activeView === 'admin' && 'System Configuration'}
            </h2>

            <div className="flex items-center space-x-4">
               <button 
                onClick={togglePrintMode}
                className="p-2 text-gray-500 hover:text-ramp-gold transition-colors"
                title="Print View (Light Mode)"
              >
                <Printer className="w-5 h-5" />
              </button>
              <button 
                onClick={toggleTheme}
                className="p-2 text-gray-500 hover:text-ramp-gold transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </header>
        )}

        <div className="flex-1 overflow-auto p-4 md:p-8 relative">
           {printMode && (
             <button 
               onClick={() => setPrintMode(false)}
               className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg no-print z-50"
             >
               Exit Print View
             </button>
           )}
           {children}
        </div>
      </main>
    </div>
  );
};