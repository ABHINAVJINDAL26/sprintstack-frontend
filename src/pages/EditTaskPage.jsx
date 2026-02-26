import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getTaskById, updateTask, deleteTask } from '../services/taskService';

const EditTaskPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    try {
      const { data } = await getTaskById(taskId);
      reset({
        title: data.task.title,
        description: data.task.description,
        status: data.task.status,
        priority: data.task.priority,
        storyPoints: data.task.storyPoints,
        assignedTo: data.task.assignedTo?._id || ''
      });
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load task');
      navigate(-1);
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await updateTask(taskId, data);
      toast.success('Task updated!');
      navigate(-1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(taskId);
      toast.success('Task deleted');
      navigate(-1);
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  if (loading) return <div className="text-center py-20">Loading Task...</div>;

  return (
    <div className="animate-fade-in max-w-2xl mx-auto py-4 sm:py-8 lg:py-10">
      <div className="mb-8 flex justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold">Edit Task</h1>
        </div>
        <button onClick={handleDelete} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors" title="Delete Task">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
        </button>
      </div>

      <div className="glass-card">
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">Task Title</label>
            <input
              type="text"
              {...register('title', { required: 'Task title is required' })}
            />
            {errors.title && <small>{errors.title.message}</small>}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              rows="4"
              {...register('description')}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select {...register('status')}>
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select {...register('priority')}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Assignee ID</label>
            <input
              type="text"
              {...register('assignedTo')}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex-1" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskPage;
