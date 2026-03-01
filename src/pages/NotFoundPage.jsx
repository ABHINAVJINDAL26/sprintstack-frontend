import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const NotFoundPage = () => {
  const { user } = useAuth();

  return (
    <div className="auth-page min-h-[100svh] flex items-center justify-center px-4 py-6">
      <div className="auth-orb auth-orb-left"></div>
      <div className="auth-orb auth-orb-right"></div>

      <div className="relative z-10 w-full max-w-5xl text-center animate-fade-in">
        <div className="mx-auto w-full max-w-[640px] h-[340px] sm:h-[430px] lg:h-[500px]">
          <DotLottieReact
            src="https://lottie.host/5a20357a-cff3-47dd-b57d-95f86a067243/rLCWpYCfaG.lottie"
            loop
            autoplay
          />
        </div>

        <p className="text-sm uppercase tracking-[0.35em] text-slate-500 -mt-4 mb-2">Error 404</p>
        <h1 className="text-3xl sm:text-5xl font-bold mb-3">Page Not Found</h1>
        <p className="text-slate-400 mb-8 max-w-xl mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Link to={user ? '/dashboard' : '/login'} className="btn btn-primary flex-1">
            {user ? 'Go to Dashboard' : 'Go to Login'}
          </Link>
          <Link to="/register" className="btn btn-secondary flex-1">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
