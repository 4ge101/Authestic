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
  const { user, loading, isAdmin, isSupport, logout, login } = useAuth();
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
        <div className="w-16 h-16 rounded-3xl bg-[#F4DDD3] flex items-center justify-center text-[#B25D48] mb-4 shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black mb-2">Administrator Access Required</h1>
        <p className="text-xs text-[#728078] max-w-md mb-6 leading-relaxed">
          Your current account (<span className="font-bold text-[#263831]">{user.email}</span>) has the <span className="font-bold text-[#263831]">{user.role}</span> role and cannot view the Admin Console.
        </p>

        <div className="p-5 rounded-3xl bg-[#FFFDF8] border border-[#EAE7DF] shadow-xs max-w-sm w-full mb-6 text-left">
          <p className="text-xs font-bold text-[#568469] mb-1">Eshal Admin Credentials:</p>
          <p className="text-xs text-[#263831] font-mono">Email: admin@eshal.org</p>
          <p className="text-xs text-[#263831] font-mono">Password: AdminPassword123!</p>
          
          <button
            type="button"
            onClick={async () => {
              try {
                await login('admin@eshal.org', 'AdminPassword123!');
                window.location.reload();
              } catch (e) {}
            }}
            className="mt-4 w-full py-2.5 rounded-2xl bg-[#568469] hover:bg-[#456C55] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-2"
          >
            <span>🚀 Switch to Admin Account Instantly</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            className="px-6 py-2.5 rounded-full bg-[#FFFDF8] border border-[#EAE7DF] text-[#263831] text-xs font-bold hover:bg-[#E2EBD9] transition-colors"
          >
            Return to Learning Home
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
