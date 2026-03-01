import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BrandLogo from './BrandLogo';

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const canCreateProject = ['admin', 'manager'].includes(user?.role);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 relative overflow-hidden">
      <div className="app-bg-blob app-bg-blob-1"></div>
      <div className="app-bg-blob app-bg-blob-2"></div>

      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 sm:gap-8 min-w-0">
          <BrandLogo
            to="/dashboard"
            textClassName="text-lg sm:text-xl lg:text-2xl"
            iconWrapperClassName="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11"
            animated={false}
          />
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/dashboard" className="nav-link-premium hover:text-blue-400 transition-colors">Dashboard</Link>
            <Link to="/sprints/board" className="nav-link-premium hover:text-blue-400 transition-colors">Sprint Board</Link>
            {canCreateProject && (
              <Link to="/projects/create" className="nav-link-premium hover:text-blue-400 transition-colors capitalize">New Project</Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-4 shrink-0">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-sm font-semibold truncate max-w-[140px]">{user?.name}</span>
            <span className="text-xs text-slate-500 uppercase tracking-wider">{user?.role}</span>
          </div>
          <Link to="/profile" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center hover:border-blue-500 transition-all">
            {user?.name?.charAt(0).toUpperCase()}
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          </button>
        </div>
        </div>

        <div className="md:hidden mt-3 flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-1 text-xs font-medium text-slate-300">
          <Link to="/dashboard" className="px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700 transition-colors">Dashboard</Link>
          <Link to="/sprints/board" className="px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700 transition-colors">Sprint Board</Link>
          {canCreateProject && (
            <Link to="/projects/create" className="px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700 transition-colors">New Project</Link>
          )}
          <Link to="/profile" className="px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700 transition-colors">Profile</Link>
        </div>
      </nav>

      <main className="px-4 py-5 sm:p-6 max-w-7xl mx-auto w-full relative z-10">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
