import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">User Profile</h1>

      <div className="glass-card flex items-center gap-8 p-10">
        <div className="w-32 h-32 rounded-full bg-blue-600/20 border-4 border-slate-800 flex items-center justify-center text-5xl font-bold bg-gradient-to-tr from-blue-500 to-emerald-500 text-white">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Full Name</p>
            <p className="text-xl font-semibold text-slate-100">{user?.name}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Email Address</p>
            <p className="text-slate-300">{user?.email}</p>
          </div>
          <div className="flex gap-10">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Role</p>
              <span className="badge badge-blue">{user?.role}</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Organization</p>
              <p className="text-slate-300 font-medium">{user?.organization || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 glass-card border-dashed border-slate-800">
        <h3 className="text-lg font-bold mb-4">Account Settings</h3>
        <p className="text-sm text-slate-500">
          This project follows a strict MVC pattern. Profile editing is planned for the next sprint!
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
