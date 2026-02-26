import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createTask } from '../services/taskService';
import { getProjectById } from '../services/projectService';
import { useAuth } from '../context/AuthContext';

const CreateTaskPage = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const sprintId = searchParams.get('sprintId');

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      projectId,
      sprintId,
      priority: 'medium',
      status: 'todo'
    }
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState(null);
  const teamMembers = project?.teamMembers || [];
  const { user } = useAuth();

  useEffect(() => {
    if (user && !['admin', 'manager'].includes(user.role)) {
      toast.error('Only admin or manager can create tasks');
      navigate('/dashboard');
      return;
    }

    if (projectId) {
      getProjectById(projectId).then(res => setProject(res.data.project));
    }
  }, [projectId, user, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await createTask(data);
      toast.success('Task created successfully!');
      if (sprintId) {
        navigate(`/sprints/board?sprintId=${sprintId}&projectId=${projectId}`);
      } else {
        navigate(`/projects/${projectId}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
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
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Create New Task</h1>
          {project && <p className="text-sm text-slate-500 uppercase font-bold tracking-widest">{project.name}</p>}
        </div>
      </div>

      <div className="glass-card">
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">Task Title</label>
            <input
              type="text"
              placeholder="e.g. Implement user authentication"
              {...register('title', { required: 'Task title is required' })}
            />
            {errors.title && <small>{errors.title.message}</small>}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              placeholder="Detailed acceptance criteria..."
              rows="4"
              {...register('description')}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select {...register('priority')}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Story Points</label>
              <input
                type="number"
                placeholder="3"
                {...register('storyPoints')}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Assign To</label>
            <select {...register('assignedTo')}>
              <option value="">Unassigned</option>
              {teamMembers.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name} ({member.role})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-600 mt-1">Select any project team member.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
              {loading ? 'Adding...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskPage;
