import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState('boy');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devToken, setDevToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await register({ email, password, name, avatar });
      if (res?.devVerificationToken) {
        setDevToken(res.devVerificationToken);
      } else {
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#263831] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-[-50px] left-[-50px] w-80 h-80 rounded-full bg-[#E2EBD9]/40 blur-2xl pointer-events-none" />
      <div className="absolute bottom-[-50px] right-[-50px] w-96 h-96 rounded-full bg-[#F4DDD3]/30 blur-2xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#FFFDF8] rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-[#EAE7DF] relative z-10">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#E2EBD9] flex items-center justify-center text-[#568469] mb-3 shadow-inner">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-[#263831] tracking-tight">Create an Account</h1>
          <p className="text-xs text-[#728078] mt-1 font-medium">
            Join Eshal for personalized, gentle autism support
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-[#F4DDD3]/60 border border-[#F4DDD3] flex items-start gap-3 text-xs text-[#8A3B29]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {devToken ? (
          <div className="p-5 rounded-2xl bg-[#E2EBD9] border border-[#d5e2cb] text-xs text-[#263831] text-center space-y-3">
            <CheckCircle className="w-8 h-8 text-[#568469] mx-auto" />
            <h3 className="font-bold text-sm text-[#263831]">Account Created!</h3>
            <p className="text-[#728078]">
              Your account is ready. In local development mode, you can verify your email immediately:
            </p>
            <Link
              to={`/verify-email?token=${devToken}`}
              className="inline-block py-2.5 px-5 rounded-xl bg-[#568469] text-white font-bold text-xs hover:bg-[#456C55] transition-colors"
            >
              Verify Email Now
            </Link>
            <div>
              <Link
                to="/"
                className="text-[11px] text-[#568469] font-bold hover:underline block mt-2"
              >
                Or Continue Directly to Learning Home
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-[#728078] mb-1 uppercase tracking-wider">
                Child or Caregiver Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#728078] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Leo or Sarah"
                  className="w-full bg-[#F8F6F0] border border-[#EAE7DF] rounded-2xl py-2.5 pl-11 pr-4 text-sm text-[#263831] focus:outline-none focus:border-[#568469] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#728078] mb-1 uppercase tracking-wider">
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
                  className="w-full bg-[#F8F6F0] border border-[#EAE7DF] rounded-2xl py-2.5 pl-11 pr-4 text-sm text-[#263831] focus:outline-none focus:border-[#568469] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#728078] mb-1 uppercase tracking-wider">
                Choose Profile Avatar
              </label>
              <div className="flex gap-2">
                {[
                  { id: 'boy', label: 'Boy' },
                  { id: 'girl', label: 'Girl' },
                  { id: 'corgi', label: 'Friendly Pup' },
                  { id: 'fox', label: 'Wise Fox' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAvatar(item.id)}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      avatar === item.id
                        ? 'bg-[#E2EBD9] border-[#568469] text-[#263831]'
                        : 'bg-[#F8F6F0] border-[#EAE7DF] text-[#728078] hover:bg-[#F0EBDD]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#728078] mb-1 uppercase tracking-wider">
                Password (min 8 chars)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#728078] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#F8F6F0] border border-[#EAE7DF] rounded-2xl py-2.5 pl-11 pr-4 text-sm text-[#263831] focus:outline-none focus:border-[#568469] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#728078] mb-1 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#728078] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#F8F6F0] border border-[#EAE7DF] rounded-2xl py-2.5 pl-11 pr-4 text-sm text-[#263831] focus:outline-none focus:border-[#568469] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3.5 rounded-2xl bg-[#568469] hover:bg-[#456C55] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-[#728078]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#568469] font-bold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
