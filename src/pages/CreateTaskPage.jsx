import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import AppLayout from '../components/AppLayout';
import { taskService } from '../services/taskService';
import { getErrorMessage } from '../utils/errorHandler';

function CreateTaskPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      await taskService.createTask(values);
      toast.success('Task created');
      reset();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to create task'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout title="Create Task">
      <form onSubmit={handleSubmit(onSubmit)} className="form card">
        <label>Title</label>
        <input {...register('title', { required: 'Title is required' })} />
        {errors.title && <small>{errors.title.message}</small>}

        <label>Description</label>
        <textarea {...register('description')} rows={4} />

        <label>Project ID</label>
        <input {...register('projectId', { required: 'Project ID is required' })} />
        {errors.projectId && <small>{errors.projectId.message}</small>}

        <label>Priority</label>
        <select {...register('priority')} defaultValue="medium">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </AppLayout>
  );
}

export default CreateTaskPage;
