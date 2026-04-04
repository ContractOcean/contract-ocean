import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-25">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-[3px] border-ocean-500 border-t-transparent animate-spin" />
        <p className="text-[13px] text-slate-400">Loading...</p>
      </div>
    </div>
  );
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;

  // If user hasn't completed onboarding, redirect there (unless already on onboarding page)
  if (profile && !profile.onboarding_completed && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/" replace />;

  return <>{children}</>;
}

// Special route for onboarding — requires auth but not onboarding completion
export function OnboardingRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;

  // If onboarding already done, go to dashboard
  if (profile?.onboarding_completed) return <Navigate to="/" replace />;

  return <>{children}</>;
}
