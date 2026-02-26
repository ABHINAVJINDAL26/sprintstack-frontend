import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 sm:gap-8">
          <Link to="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            SprintStack
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
            <Link to="/sprints/board" className="hover:text-blue-400 transition-colors">Sprint Board</Link>
            <Link to="/projects/create" className="hover:text-blue-400 transition-colors capitalize">New Project</Link>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-sm font-semibold truncate max-w-[140px]">{user?.name}</span>
            <span className="text-xs text-slate-500 uppercase tracking-wider">{user?.role}</span>
          </div>
          <Link to="/profile" className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center hover:border-blue-500 transition-all">
            {user?.name?.charAt(0).toUpperCase()}
          </Link>
          <button
            onClick={handleLogout}
            className="ml-2 p-2 text-slate-400 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          </button>
        </div>
        </div>

        <div className="md:hidden mt-3 flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-1 text-xs font-medium text-slate-300">
          <Link to="/dashboard" className="px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700 transition-colors">Dashboard</Link>
          <Link to="/sprints/board" className="px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700 transition-colors">Sprint Board</Link>
          <Link to="/projects/create" className="px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700 transition-colors">New Project</Link>
          <Link to="/profile" className="px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700 transition-colors">Profile</Link>
        </div>
      </nav>

      <main className="px-4 py-5 sm:p-6 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
