import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import StarBorder from '../components/StarBorder';
import BrandLogo from '../components/BrandLogo';
import { getPostLoginRoute } from '../utils/roleRedirect';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, googleAuth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const authData = await login(data);
      toast.success('Welcome back to SprintStack!');
      navigate(getPostLoginRoute(authData?.user?.role));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const authData = await googleAuth({ idToken: credentialResponse.credential });
      toast.success('Logged in with Google successfully!');
      navigate(getPostLoginRoute(authData?.user?.role));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google login failed.');
    }
  };

  return (
    <div className="auth-page min-h-[100svh] flex items-center justify-center px-4 py-4 sm:py-6">
      <div className="auth-orb auth-orb-left"></div>
      <div className="auth-orb auth-orb-right"></div>

      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="text-center mb-7">
          <BrandLogo className="mb-2" />
          <p className="text-slate-400">Sign in to manage your agile workflow</p>
        </div>

        <div className="glass-card">
          <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="auth-input-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="auth-input-icon">
                  <path d="M4 6h16v12H4z" />
                  <path d="m22 7-10 7L2 7" />
                </svg>
                <input
                  type="email"
                  placeholder="name@company.com"
                  {...register('email', { required: 'Email is required' })}
                  className={`pl-10 ${errors.email ? 'border-rose-500' : ''}`}
                />
              </div>
              {errors.email && <small>{errors.email.message}</small>}
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
                  {...register('password', { required: 'Password is required' })}
                  className={`pl-10 ${errors.password ? 'border-rose-500' : ''}`}
                />
              </div>
              {errors.password && <small>{errors.password.message}</small>}
            </div>

            <StarBorder
              as="button"
              type="submit"
              className="w-full mt-4"
              color="#60a5fa"
              speed="5s"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </StarBorder>

            <div className="my-4 flex items-center gap-3 text-xs text-slate-500">
              <div className="h-px bg-slate-800 flex-1"></div>
              <span>OR</span>
              <div className="h-px bg-slate-800 flex-1"></div>
            </div>

            <div className="w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-2">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Google login cancelled or failed.')}
                theme="outline"
                shape="pill"
                text="signin_with"
              />
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-500">New to SprintStack? </span>
            <Link to="/register" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
              Create an account
            </Link>
          </div>
        </div>

        <p className="text-center mt-6 text-xs text-slate-600 uppercase tracking-widest">
          Industry Grade Agile Tracking
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
