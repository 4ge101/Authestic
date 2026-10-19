import React, { useEffect, useState } from 'react';
import { api, ApiAuditLog } from '../../services/api';
import {
  FileText,
  Shield,
  Activity,
  AlertCircle,
  RefreshCw,
  Clock,
  Filter,
} from 'lucide-react';

export const AdminAuditPage: React.FC = () => {
  const [logs, setLogs] = useState<ApiAuditLog[]>([]);
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.admin.getAuditLogs();
      setLogs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load security audit trail.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filtered = eventTypeFilter
    ? logs.filter((l) => l.eventType === eventTypeFilter)
    : logs;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#263831]">Security & Administrative Audit Log</h1>
          <p className="text-xs text-[#728078] mt-1 font-medium">
            Permanent, tamper-evident record of authentication, RBAC modifications, and data operations
          </p>
        </div>
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FFFDF8] border border-[#EAE7DF] text-xs font-bold text-[#568469] hover:bg-[#E2EBD9] transition-colors cursor-pointer self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-[#F4DDD3]/60 border border-[#F4DDD3] flex items-center gap-3 text-xs text-[#8A3B29]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-[#FFFDF8] p-4 rounded-3xl border border-[#EAE7DF] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#728078]" />
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className="bg-[#F8F6F0] border border-[#EAE7DF] rounded-2xl py-2 px-3 text-xs text-[#263831] focus:outline-none focus:border-[#568469]"
          >
            <option value="">All Event Types</option>
            <option value="login_success">login_success</option>
            <option value="login_failed">login_failed</option>
            <option value="register">register</option>
            <option value="logout">logout</option>
            <option value="user_suspended">user_suspended</option>
            <option value="user_activated">user_activated</option>
            <option value="role_changed">role_changed</option>
            <option value="sessions_revoked">sessions_revoked</option>
            <option value="content_created">content_created</option>
            <option value="content_updated">content_updated</option>
            <option value="content_deleted">content_deleted</option>
            <option value="settings_updated">settings_updated</option>
          </select>
        </div>

        <span className="text-xs text-[#728078] font-bold">{filtered.length} Recorded Events</span>
      </div>

      {/* Audit Log Table */}
      <div className="bg-[#FFFDF8] rounded-3xl border border-[#EAE7DF] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#EAE7DF] bg-[#F8F6F0]/50 text-[10px] font-black uppercase tracking-wider text-[#728078]">
                <th className="py-3.5 px-6">Timestamp</th>
                <th className="py-3.5 px-4">Event Type</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Target</th>
                <th className="py-3.5 px-6">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE7DF]">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-[#F8F6F0]/60 transition-colors font-mono">
                  <td className="py-3 px-6 whitespace-nowrap text-[#728078] text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>{new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        log.eventType.includes('failed') || log.eventType.includes('suspended')
                          ? 'bg-[#F4DDD3] text-[#B25D48]'
                          : log.eventType.includes('success') || log.eventType.includes('activated')
                          ? 'bg-[#E2EBD9] text-[#568469]'
                          : 'bg-[#F0EBDD] text-[#728078]'
                      }`}
                    >
                      {log.eventType}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans font-bold text-[#263831]">
                    {log.actorEmail || 'System / Anonymous'}
                  </td>
                  <td className="py-3 px-4 text-[#728078]">
                    {log.targetType ? `${log.targetType} (${log.targetId?.slice(0, 8)}...)` : '-'}
                  </td>
                  <td className="py-3 px-6 font-mono text-[11px] text-[#728078]">
                    {JSON.stringify(log.details)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
