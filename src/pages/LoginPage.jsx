import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, googleAuth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data);
      toast.success('Welcome back to SprintStack!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleAuth({ idToken: credentialResponse.credential });
      toast.success('Logged in with Google successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google login failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-2">
            SprintStack
          </h1>
          <p className="text-slate-400">Sign in to manage your agile workflow</p>
        </div>

        <div className="glass-card">
          <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                placeholder="name@company.com"
                {...register('email', { required: 'Email is required' })}
                className={errors.email ? 'border-rose-500' : ''}
              />
              {errors.email && <small>{errors.email.message}</small>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password', { required: 'Password is required' })}
                className={errors.password ? 'border-rose-500' : ''}
              />
              {errors.password && <small>{errors.password.message}</small>}
            </div>

            <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>

            <div className="my-4 flex items-center gap-3 text-xs text-slate-500">
              <div className="h-px bg-slate-800 flex-1"></div>
              <span>OR</span>
              <div className="h-px bg-slate-800 flex-1"></div>
            </div>

            <div className="w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-900/50 p-1">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Google login cancelled or failed.')}
                theme="outline"
                shape="pill"
                text="signin_with"
              />
            </div>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-slate-500">New to SprintStack? </span>
            <Link to="/register" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
              Create an account
            </Link>
          </div>
        </div>

        <p className="text-center mt-8 text-xs text-slate-600 uppercase tracking-widest">
          Industry Grade Agile Tracking
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
