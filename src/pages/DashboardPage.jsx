import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllProjects } from '../services/projectService';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await getAllProjects();
      setProjects(data.projects);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <header className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name.split(' ')[0]}!</h1>
          <p className="text-slate-400">Here's what's happening in your projects today.</p>
        </div>
        <Link to="/projects/create" className="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          New Project
        </Link>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          Your Projects
          <span className="bg-blue-500/20 text-blue-400 text-xs py-1 px-2 rounded-full">{projects.length}</span>
        </h2>

        {projects.length === 0 ? (
          <div className="glass-card text-center py-20 border-dashed border-2 border-slate-800">
            <p className="text-slate-500 mb-6">No projects found. Start by creating a new one!</p>
            <Link to="/projects/create" className="btn btn-outline">Create Your First Project</Link>
          </div>
        ) : (
          <div className="grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const ProjectCard = ({ project }) => {
  return (
    <div className="glass-card flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className={`badge ${project.status === 'active' ? 'badge-emerald' : 'badge-amber'}`}>
            {project.status}
          </span>
          <span className="text-xs text-slate-500">{new Date(project.createdAt).toLocaleDateString()}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 text-slate-100">{project.name}</h3>
        <p className="text-sm text-slate-400 mb-6 line-clamp-2">{project.description || 'No description provided.'}</p>
      </div>

      <div className="mt-auto">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex -space-x-2 overflow-hidden">
            {project.teamMembers.slice(0, 3).map((member, i) => (
              <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold border border-slate-700" title={member.name}>
                {member.name.charAt(0).toUpperCase()}
              </div>
            ))}
            {project.teamMembers.length > 3 && (
              <div className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-700">
                +{project.teamMembers.length - 3}
              </div>
            )}
          </div>
          <span className="text-xs text-slate-500">{project.teamMembers.length} Members</span>
        </div>

        <Link to={`/projects/${project._id}`} className="btn btn-secondary w-full">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
