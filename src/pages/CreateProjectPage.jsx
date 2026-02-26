import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createProject } from '../services/projectService';
import { useAuth } from '../context/AuthContext';

const CreateProjectPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user && !['admin', 'manager'].includes(user.role)) {
      toast.error('Only admin or manager can create projects');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await createProject(data);
      toast.success('Project created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto py-4 sm:py-8 lg:py-10">
      <div className="mb-8 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold">Create New Project</h1>
      </div>

      <div className="glass-card">
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">Project Name</label>
            <input
              type="text"
              placeholder="e.g. SprintStack Mobile App"
              {...register('name', { required: 'Project name is required' })}
            />
            {errors.name && <small>{errors.name.message}</small>}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              placeholder="What is this project about?"
              rows="4"
              {...register('description')}
            ></textarea>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectPage;
