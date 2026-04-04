import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-25">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-3 border-ocean-500 border-t-transparent animate-spin" />
          <p className="text-[13px] text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-25">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-3 border-ocean-500 border-t-transparent animate-spin" />
          <p className="text-[13px] text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
