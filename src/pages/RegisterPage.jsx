import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';

function RegisterPage() {
  const { register: formRegister, handleSubmit, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, getErrorMessage } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      await register(values);
      navigate('/login');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Registration failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <h1>Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <label>Name</label>
        <input {...formRegister('name', { required: 'Name is required' })} />
        {errors.name && <small>{errors.name.message}</small>}

        <label>Email</label>
        <input type="email" {...formRegister('email', { required: 'Email is required' })} />
        {errors.email && <small>{errors.email.message}</small>}

        <label>Password</label>
        <input type="password" {...formRegister('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} />
        {errors.password && <small>{errors.password.message}</small>}

        <label>Role</label>
        <select {...formRegister('role', { required: true })} defaultValue="developer">
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="developer">Developer</option>
          <option value="qa">QA</option>
        </select>

        <button className="btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p>
        Already have account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
