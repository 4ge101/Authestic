import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { Sparkles, ArrowRight, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doVerify = async (tok: string) => {
    if (!tok) return;
    setLoading(true);
    setError(null);
    try {
      await api.auth.verifyEmail(tok);
      setVerified(true);
    } catch (err: any) {
      setError(err.message || 'Verification token is invalid or has expired.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const queryToken = searchParams.get('token');
    if (queryToken) {
      doVerify(queryToken);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doVerify(token);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#263831] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="w-full max-w-md bg-[#FFFDF8] rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-[#EAE7DF] relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#728078] hover:text-[#568469] font-bold mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#E2EBD9] flex items-center justify-center text-[#568469] mb-3 shadow-inner">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-[#263831] tracking-tight">Verify Your Email</h1>
          <p className="text-xs text-[#728078] mt-1 font-medium">
            Confirm your email address to ensure account security
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-[#F4DDD3]/60 border border-[#F4DDD3] flex items-start gap-3 text-xs text-[#8A3B29]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {verified ? (
          <div className="p-5 rounded-2xl bg-[#E2EBD9] border border-[#d5e2cb] text-xs text-[#263831] text-center space-y-3">
            <CheckCircle className="w-8 h-8 text-[#568469] mx-auto" />
            <h3 className="font-bold text-sm text-[#263831]">Email Verified!</h3>
            <p className="text-[#728078]">Your account email has been verified. Welcome to Eshal!</p>
            <Link
              to="/"
              className="inline-block py-2.5 px-5 rounded-xl bg-[#568469] text-white font-bold text-xs hover:bg-[#456C55] transition-colors"
            >
              Go to Learning Home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#728078] mb-1.5 uppercase tracking-wider">
                Verification Token
              </label>
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your token here"
                className="w-full bg-[#F8F6F0] border border-[#EAE7DF] rounded-2xl py-3 px-4 text-xs font-mono text-[#263831] focus:outline-none focus:border-[#568469] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-2xl bg-[#568469] hover:bg-[#456C55] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <span>Verify Email</span>
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
