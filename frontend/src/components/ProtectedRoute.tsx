import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Sparkles } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { user, loading, isAdmin, isSupport } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F6F0] flex flex-col items-center justify-center p-6 text-[#263831]">
        <div className="w-16 h-16 rounded-3xl bg-[#E2EBD9] flex items-center justify-center text-[#568469] mb-4 animate-pulse">
          <Sparkles className="w-8 h-8" />
        </div>
        <p className="text-sm font-bold text-[#568469] tracking-wider uppercase">Eshal</p>
        <p className="text-xs text-[#728078] mt-1">Preparing your calm learning space...</p>
      </div>
    );
  }

  if (!user) {
    // Redirect to login while saving requested path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin && !isSupport) {
    return (
      <div className="min-h-screen bg-[#F8F6F0] flex flex-col items-center justify-center p-6 text-center text-[#263831]">
        <div className="w-16 h-16 rounded-3xl bg-[#F4DDD3] flex items-center justify-center text-[#B25D48] mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Administrator Access Required</h1>
        <p className="text-sm text-[#728078] max-w-md mb-6">
          Your account ({user.email}) does not have administrative permissions to view this section.
        </p>
        <a
          href="/"
          className="px-6 py-2.5 rounded-full bg-[#568469] text-white text-xs font-bold hover:bg-[#456C55] transition-colors"
        >
          Return to Learning Home
        </a>
      </div>
    );
  }

  return <>{children}</>;
};
