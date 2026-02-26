import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { register as registerUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      role: 'developer',
      organization: ''
    }
  });
  const { googleAuth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = watch('role') || 'developer';
  const organization = watch('organization') || '';

  const handleGoogleSignupSuccess = async (credentialResponse) => {
    try {
      await googleAuth({
        idToken: credentialResponse.credential,
        role: selectedRole,
        organization,
      });
      toast.success('Account created with Google!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google signup failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-2">
            SprintStack
          </h1>
          <p className="text-slate-400">Build better software with your team</p>
        </div>

        <div className="glass-card">
          <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && <small>{errors.name.message}</small>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                placeholder="john@company.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: 'Invalid email format'
                  }
                })}
              />
              {errors.email && <small>{errors.email.message}</small>}
            </div>

            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Role</label>
                <select {...register('role', { required: 'Role is required' })}>
                  <option value="developer">Developer</option>
                  <option value="manager">Manager</option>
                  <option value="qa">QA Engineer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Organization</label>
                <input
                  type="text"
                  placeholder="TechCorp"
                  {...register('organization')}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Minimum 6 characters' }
                })}
              />
              {errors.password && <small>{errors.password.message}</small>}
            </div>

            <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
              {loading ? 'Creating Account...' : 'Get Started for Free'}
            </button>

            <div className="my-4 flex items-center gap-3 text-xs text-slate-500">
              <div className="h-px bg-slate-800 flex-1"></div>
              <span>OR</span>
              <div className="h-px bg-slate-800 flex-1"></div>
            </div>

            <div className="w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-900/50 p-1">
              <GoogleLogin
                onSuccess={handleGoogleSignupSuccess}
                onError={() => toast.error('Google signup cancelled or failed.')}
                theme="outline"
                shape="pill"
                text="signup_with"
              />
            </div>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-slate-500">Already have an account? </span>
            <Link to="/login" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
