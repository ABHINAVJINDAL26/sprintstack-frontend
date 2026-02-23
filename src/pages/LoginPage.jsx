import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, getErrorMessage } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      await login(values);
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, 'Login failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <label>Email</label>
        <input type="email" {...register('email', { required: 'Email is required' })} />
        {errors.email && <small>{errors.email.message}</small>}

        <label>Password</label>
        <input type="password" {...register('password', { required: 'Password is required' })} />
        {errors.password && <small>{errors.password.message}</small>}

        <button className="btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>
        New user? <Link to="/register">Create account</Link>
      </p>
    </div>
  );
}

export default LoginPage;
