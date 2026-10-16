import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Safe redirect path (no external URLs)
  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      setEmail('admin@eshal.org');
      setPassword('AdminPassword123!');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#263831] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Decorative calm background shapes */}
      <div className="absolute top-[-50px] left-[-50px] w-80 h-80 rounded-full bg-[#E2EBD9]/40 blur-2xl pointer-events-none" />
      <div className="absolute bottom-[-50px] right-[-50px] w-96 h-96 rounded-full bg-[#F5D998]/20 blur-2xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#FFFDF8] rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-[#EAE7DF] relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#E2EBD9] flex items-center justify-center text-[#568469] mb-3 shadow-inner">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-[#263831] tracking-tight">Welcome to Eshal</h1>
          <p className="text-xs text-[#728078] mt-1 font-medium">
            Sign in to access your child's calm learning home
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-[#F4DDD3]/60 border border-[#F4DDD3] flex items-start gap-3 text-xs text-[#8A3B29]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#728078] mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#728078] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="caregiver@example.com"
                className="w-full bg-[#F8F6F0] border border-[#EAE7DF] rounded-2xl py-3 pl-11 pr-4 text-sm text-[#263831] focus:outline-none focus:border-[#568469] transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#728078] uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-[#568469] font-bold hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#728078] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F8F6F0] border border-[#EAE7DF] rounded-2xl py-3 pl-11 pr-4 text-sm text-[#263831] focus:outline-none focus:border-[#568469] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-2xl bg-[#568469] hover:bg-[#456C55] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials Box */}
        <div className="mt-6 p-3.5 rounded-2xl bg-[#F0EBDD]/60 border border-[#EAE7DF] text-xs">
          <div className="flex items-center gap-2 text-[#568469] font-bold mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Default Administrator Account</span>
          </div>
          <p className="text-[11px] text-[#728078] mb-2 leading-relaxed">
            Use the provisioned credentials to access the Administrator Dashboard and system settings.
          </p>
          <button
            type="button"
            onClick={() => handleFillDemo('admin')}
            className="text-[11px] font-bold text-[#568469] bg-[#E2EBD9] hover:bg-[#d5e2cb] px-3 py-1 rounded-lg transition-colors cursor-pointer"
          >
            Fill Admin Credentials (admin@eshal.org)
          </button>
        </div>

        <div className="mt-8 text-center text-xs text-[#728078]">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-[#568469] font-bold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
