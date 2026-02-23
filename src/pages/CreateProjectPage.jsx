import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import AppLayout from '../components/AppLayout';
import { projectService } from '../services/projectService';
import { getErrorMessage } from '../utils/errorHandler';

function CreateProjectPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      await projectService.createProject(values);
      toast.success('Project created');
      reset();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to create project'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout title="Create Project">
      <form onSubmit={handleSubmit(onSubmit)} className="form card">
        <label>Project Name</label>
        <input {...register('name', { required: 'Project name is required' })} />
        {errors.name && <small>{errors.name.message}</small>}

        <label>Description</label>
        <textarea {...register('description')} rows={4} />

        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </AppLayout>
  );
}

export default CreateProjectPage;
