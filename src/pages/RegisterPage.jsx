import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { register as registerUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import StarBorder from '../components/StarBorder';
import BrandLogo from '../components/BrandLogo';
import { getPostLoginRoute } from '../utils/roleRedirect';

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
      const authData = await googleAuth({
        idToken: credentialResponse.credential,
        role: selectedRole,
        organization,
      });
      toast.success('Account created with Google!');
      navigate(getPostLoginRoute(authData?.user?.role));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google signup failed.');
    }
  };

  return (
    <div className="auth-page min-h-[100svh] flex items-center justify-center px-4 py-4 sm:py-6">
      <div className="auth-orb auth-orb-left"></div>
      <div className="auth-orb auth-orb-right"></div>

      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="text-center mb-6">
          <BrandLogo className="mb-2" />
          <p className="text-slate-400">Build better software with your team</p>
        </div>

        <div className="glass-card">
          <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="auth-input-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="auth-input-icon">
                  <path d="M20 21a8 8 0 1 0-16 0" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="pl-10"
                  {...register('name', { required: 'Name is required' })}
                />
              </div>
              {errors.name && <small>{errors.name.message}</small>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="auth-input-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="auth-input-icon">
                  <path d="M4 6h16v12H4z" />
                  <path d="m22 7-10 7L2 7" />
                </svg>
                <input
                  type="email"
                  placeholder="john@company.com"
                  className="pl-10"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: 'Invalid email format'
                    }
                  })}
                />
              </div>
              {errors.email && <small>{errors.email.message}</small>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="auth-input-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="auth-input-icon">
                  <rect x="4" y="11" width="16" height="9" rx="2" />
                  <path d="M8 11V8a4 4 0 1 1 8 0v3" />
                </svg>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' }
                  })}
                />
              </div>
              {errors.password && <small>{errors.password.message}</small>}
            </div>

            <StarBorder
              as="button"
              type="submit"
              className="w-full mt-4"
              color="#60a5fa"
              speed="5.5s"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Get Started for Free'}
            </StarBorder>

            <div className="my-4 flex items-center gap-3 text-xs text-slate-500">
              <div className="h-px bg-slate-800 flex-1"></div>
              <span>OR</span>
              <div className="h-px bg-slate-800 flex-1"></div>
            </div>

            <div className="w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-2">
              <GoogleLogin
                onSuccess={handleGoogleSignupSuccess}
                onError={() => toast.error('Google signup cancelled or failed.')}
                theme="outline"
                shape="pill"
                text="signup_with"
              />
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
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
