import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Sparkles, Mail, ArrowRight, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [devToken, setDevToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.auth.forgotPassword(email);
      setMessage(res.message);
      if (res.devResetToken) {
        setDevToken(res.devResetToken);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#263831] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="w-full max-w-md bg-[#FFFDF8] rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-[#EAE7DF] relative z-10">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs text-[#728078] hover:text-[#568469] font-bold mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#F5D998]/40 flex items-center justify-center text-[#996B1F] mb-3 shadow-inner">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-[#263831] tracking-tight">Forgot Password</h1>
          <p className="text-xs text-[#728078] mt-1 font-medium">
            Enter your account email to receive a secure recovery link
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-[#F4DDD3]/60 border border-[#F4DDD3] flex items-start gap-3 text-xs text-[#8A3B29]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {message ? (
          <div className="p-5 rounded-2xl bg-[#E2EBD9] border border-[#d5e2cb] text-xs text-[#263831] text-center space-y-3">
            <CheckCircle className="w-8 h-8 text-[#568469] mx-auto" />
            <h3 className="font-bold text-sm text-[#263831]">Recovery Request Dispatched</h3>
            <p className="text-[#728078]">{message}</p>
            {devToken && (
              <div className="pt-2">
                <p className="text-[11px] text-[#568469] font-bold mb-2">Development Mode Quick Link:</p>
                <Link
                  to={`/reset-password?token=${devToken}`}
                  className="inline-block py-2 px-4 rounded-xl bg-[#568469] text-white font-bold text-xs hover:bg-[#456C55] transition-colors"
                >
                  Reset Password Now
                </Link>
              </div>
            )}
          </div>
        ) : (
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

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-2xl bg-[#568469] hover:bg-[#456C55] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Sending link...</span>
              ) : (
                <>
                  <span>Send Recovery Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
