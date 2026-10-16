import React, { useEffect, useState } from 'react';
import { api, ApiOverviewStats } from '../../services/api';
import {
  Users,
  ShieldCheck,
  UserX,
  Layers,
  FileText,
  Activity,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export const AdminOverviewPage: React.FC = () => {
  const [stats, setStats] = useState<ApiOverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.admin.getOverview();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load administrative overview statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#263831]">Administrator Overview</h1>
          <p className="text-xs text-[#728078] mt-1 font-medium">
            Real-time platform metrics, account counts, and security events from PostgreSQL
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FFFDF8] border border-[#EAE7DF] text-xs font-bold text-[#568469] hover:bg-[#E2EBD9] transition-colors cursor-pointer self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-[#F4DDD3]/60 border border-[#F4DDD3] flex items-center gap-3 text-xs text-[#8A3B29]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-[#FFFDF8] p-6 rounded-3xl border border-[#EAE7DF] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#728078]">Total Accounts</span>
            <div className="w-9 h-9 rounded-xl bg-[#E2EBD9] flex items-center justify-center text-[#568469]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-[#263831]">{stats ? stats.totalUsers : '-'}</p>
          <p className="text-[11px] text-[#728078] mt-1">Registered caregivers & admins</p>
        </div>

        {/* Active Users */}
        <div className="bg-[#FFFDF8] p-6 rounded-3xl border border-[#EAE7DF] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#728078]">Active Accounts</span>
            <div className="w-9 h-9 rounded-xl bg-[#E2EBD9] flex items-center justify-center text-[#568469]">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-[#568469]">{stats ? stats.activeUsers : '-'}</p>
          <p className="text-[11px] text-[#728078] mt-1">In good standing</p>
        </div>

        {/* Suspended Users */}
        <div className="bg-[#FFFDF8] p-6 rounded-3xl border border-[#EAE7DF] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#728078]">Suspended</span>
            <div className="w-9 h-9 rounded-xl bg-[#F4DDD3] flex items-center justify-center text-[#B25D48]">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-[#B25D48]">{stats ? stats.suspendedUsers : '-'}</p>
          <p className="text-[11px] text-[#728078] mt-1">Restricted from accessing API</p>
        </div>

        {/* Published Content */}
        <div className="bg-[#FFFDF8] p-6 rounded-3xl border border-[#EAE7DF] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#728078]">Live Content</span>
            <div className="w-9 h-9 rounded-xl bg-[#F5D998]/40 flex items-center justify-center text-[#996B1F]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-[#263831]">{stats ? stats.publishedContent : '-'}</p>
          <p className="text-[11px] text-[#728078] mt-1">Activities, stories & resources</p>
        </div>
      </div>

      {/* Security Activity & Audit Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Authentication Events */}
        <div className="lg:col-span-2 bg-[#FFFDF8] p-6 md:p-8 rounded-3xl border border-[#EAE7DF] shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-[#263831]">Recent Authentication Events</h2>
              <p className="text-xs text-[#728078] mt-0.5">Last 10 sign-in and security actions</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#F0EBDD] flex items-center justify-center text-[#728078]">
              <Activity className="w-4 h-4" />
            </div>
          </div>

          <div className="divide-y divide-[#EAE7DF]">
            {stats?.recentAuthEvents && stats.recentAuthEvents.length > 0 ? (
              stats.recentAuthEvents.map((evt, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        evt.eventType === 'login_success' ? 'bg-[#568469]' : 'bg-[#B25D48]'
                      }`}
                    />
                    <div>
                      <p className="font-bold text-[#263831]">{evt.email || 'Anonymous'}</p>
                      <p className="text-[11px] text-[#728078]">
                        IP: {evt.ipAddress || '127.0.0.1'} • {evt.eventType === 'login_success' ? 'Signed in' : 'Failed sign-in attempt'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#728078]">
                    {new Date(evt.timestamp || evt.createdAt || Date.now()).toLocaleTimeString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-xs text-[#728078]">No recent security events recorded.</p>
            )}
          </div>
        </div>

        {/* Security Health & Policy Checklist */}
        <div className="bg-[#FFFDF8] p-6 md:p-8 rounded-3xl border border-[#EAE7DF] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-[#568469]" />
              <h2 className="text-base font-bold text-[#263831]">System Security Status</h2>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8F6F0]">
                <span className="text-[#728078]">Password Hashing</span>
                <span className="font-bold text-[#568469]">Argon2id / Bcrypt (Active)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8F6F0]">
                <span className="text-[#728078]">Session Security</span>
                <span className="font-bold text-[#568469]">HttpOnly Opaque Cookie</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8F6F0]">
                <span className="text-[#728078]">Total Audit Logs</span>
                <span className="font-bold text-[#263831]">{stats?.auditEventsCount || 0} Records</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8F6F0]">
                <span className="text-[#728078]">Child Privacy Standard</span>
                <span className="font-bold text-[#568469]">Zero Telemetry / Minimal Data</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#EAE7DF]">
            <p className="text-[11px] text-[#728078] leading-relaxed">
              All administrative operations are permanently logged to the audit trail for security compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
