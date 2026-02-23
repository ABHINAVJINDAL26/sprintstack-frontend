import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import AppLayout from '../components/AppLayout';
import { taskService } from '../services/taskService';
import { getErrorMessage } from '../utils/errorHandler';

function EditTaskPage() {
  const { taskId } = useParams();
  const { register, handleSubmit } = useForm({ defaultValues: { status: 'todo' } });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      await taskService.updateTask(taskId, values);
      toast.success('Task updated');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to update task'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout title="Edit Task">
      <form onSubmit={handleSubmit(onSubmit)} className="form card">
        <label>Status</label>
        <select {...register('status')}>
          <option value="backlog">Backlog</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
        </select>

        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Update Task'}
        </button>
      </form>
    </AppLayout>
  );
}

export default EditTaskPage;
