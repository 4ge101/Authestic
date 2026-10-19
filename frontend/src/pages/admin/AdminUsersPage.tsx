import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  Search,
  UserX,
  UserCheck,
  Shield,
  KeyRound,
  Trash2,
  AlertCircle,
  RefreshCw,
  LogOut,
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [resetModalToken, setResetModalToken] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    message: string;
    actionLabel: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.admin.getUsers({
        search: search || undefined,
        role: roleFilter || undefined,
        status: statusFilter || undefined,
      });
      setUsers(data.users);
      setTotal(data.total);
    } catch (err: any) {
      setError(err.message || 'Failed to load user accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = (user: any) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    const confirmMsg =
      nextStatus === 'suspended'
        ? `Are you sure you want to suspend ${user.name} (${user.email})? They will be logged out immediately.`
        : `Reactivate account for ${user.name}?`;

    setConfirmModal({
      title: nextStatus === 'suspended' ? 'Suspend Account' : 'Reactivate Account',
      message: confirmMsg,
      actionLabel: nextStatus === 'suspended' ? 'Suspend User' : 'Reactivate',
      isDestructive: nextStatus === 'suspended',
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          await api.admin.updateUserStatus(user.id, nextStatus, 'Admin console action');
          setActionSuccess(`Account status updated to ${nextStatus}.`);
          fetchUsers();
        } catch (err: any) {
          setError(err.message || 'Failed to update status.');
        }
      },
    });
  };

  const handleChangeRole = (user: any, newRole: 'user' | 'support' | 'admin') => {
    setConfirmModal({
      title: 'Update Role',
      message: `Change role of ${user.email} to ${newRole}?`,
      actionLabel: 'Update Role',
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          await api.admin.updateUserRole(user.id, newRole);
          setActionSuccess(`Role updated to ${newRole}.`);
          fetchUsers();
        } catch (err: any) {
          setError(err.message || 'Failed to update role.');
        }
      },
    });
  };

  const handleRevokeSessions = (user: any) => {
    setConfirmModal({
      title: 'Revoke Sessions',
      message: `Revoke all active sessions for ${user.email}? They will need to sign in again.`,
      actionLabel: 'Revoke Sessions',
      isDestructive: true,
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          const res = await api.admin.revokeSessions(user.id);
          setActionSuccess(res.message);
        } catch (err: any) {
          setError(err.message || 'Failed to revoke sessions.');
        }
      },
    });
  };

  const handleTriggerReset = async (user: any) => {
    try {
      const res = await api.admin.triggerReset(user.id);
      setResetModalToken(res.devResetToken);
      setActionSuccess(res.message);
    } catch (err: any) {
      setError(err.message || 'Failed to generate reset link.');
    }
  };

  const handleDeleteUser = (user: any) => {
    setConfirmModal({
      title: 'Delete User Account',
      message: `DESTRUCTIVE ACTION: Are you sure you want to permanently delete ${user.name} (${user.email})? This action is audited and irreversible.`,
      actionLabel: 'Delete Permanently',
      isDestructive: true,
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          await api.admin.deleteUser(user.id);
          setActionSuccess(`Account deleted.`);
          fetchUsers();
        } catch (err: any) {
          setError(err.message || 'Failed to delete user.');
        }
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#263831]">User Accounts Management</h1>
          <p className="text-xs text-[#728078] mt-1 font-medium">
            Manage registered caregivers, account statuses, RBAC roles, and sessions
          </p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FFFDF8] border border-[#EAE7DF] text-xs font-bold text-[#568469] hover:bg-[#E2EBD9] transition-colors cursor-pointer self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-[#F4DDD3]/60 border border-[#F4DDD3] flex items-center gap-3 text-xs text-[#8A3B29]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-[#E2EBD9] border border-[#d5e2cb] text-xs text-[#263831] flex items-center justify-between">
          <span>{actionSuccess}</span>
          <button
            onClick={() => setActionSuccess(null)}
            className="text-[11px] font-bold text-[#568469] hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {resetModalToken && (
        <div className="p-5 rounded-3xl bg-[#FFFDF8] border border-[#568469] shadow-md space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#568469]">
            <KeyRound className="w-4 h-4" />
            <span>Password Reset Token Generated</span>
          </div>
          <p className="text-xs text-[#728078]">
            In development, use this link to complete the reset without email dispatch:
          </p>
          <div className="p-2.5 rounded-xl bg-[#F8F6F0] font-mono text-xs text-[#263831] break-all select-all">
            {window.location.origin}/reset-password?token={resetModalToken}
          </div>
          <button
            onClick={() => setResetModalToken(null)}
            className="text-xs font-bold text-[#568469] hover:underline pt-1"
          >
            Close Token Box
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-[#FFFDF8] p-4 rounded-3xl border border-[#EAE7DF] flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#728078] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-[#F8F6F0] border border-[#EAE7DF] rounded-2xl py-2 pl-10 pr-4 text-xs text-[#263831] focus:outline-none focus:border-[#568469]"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#F8F6F0] border border-[#EAE7DF] rounded-2xl py-2 px-3 text-xs text-[#263831] focus:outline-none focus:border-[#568469]"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="support">Support</option>
            <option value="admin">Administrator</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F8F6F0] border border-[#EAE7DF] rounded-2xl py-2 px-3 text-xs text-[#263831] focus:outline-none focus:border-[#568469]"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-[#FFFDF8] rounded-3xl border border-[#EAE7DF] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EAE7DF] bg-[#F8F6F0]/50 text-[10px] font-black uppercase tracking-wider text-[#728078]">
                <th className="py-3.5 px-6">User / Caregiver</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Verified</th>
                <th className="py-3.5 px-4">Registered</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE7DF] text-xs">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#F8F6F0]/60 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="font-bold text-[#263831]">{u.name}</div>
                    <div className="text-[11px] text-[#728078]">{u.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleChangeRole(u, e.target.value as any)}
                      className="bg-[#F8F6F0] border border-[#EAE7DF] rounded-xl py-1 px-2 text-[11px] font-bold text-[#263831] focus:outline-none"
                    >
                      <option value="user">User</option>
                      <option value="support">Support</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        u.status === 'active'
                          ? 'bg-[#E2EBD9] text-[#568469]'
                          : 'bg-[#F4DDD3] text-[#B25D48]'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[11px] font-bold ${
                        u.emailVerified ? 'text-[#568469]' : 'text-[#728078]'
                      }`}
                    >
                      {u.emailVerified ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[11px] text-[#728078]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-6 text-right space-x-1 whitespace-nowrap">
                    {/* Suspend / Reactivate */}
                    <button
                      onClick={() => handleToggleStatus(u)}
                      title={u.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
                      className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                        u.status === 'active'
                          ? 'bg-[#FFFDF8] text-[#B25D48] border-[#EAE7DF] hover:bg-[#F4DDD3]/50'
                          : 'bg-[#E2EBD9] text-[#568469] border-[#d5e2cb] hover:bg-[#d5e2cb]'
                      }`}
                    >
                      {u.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                    </button>

                    {/* Revoke Sessions */}
                    <button
                      onClick={() => handleRevokeSessions(u)}
                      title="Revoke Active Sessions"
                      className="p-1.5 rounded-xl bg-[#FFFDF8] border border-[#EAE7DF] text-[#728078] hover:bg-[#F8F6F0] transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>

                    {/* Trigger Reset */}
                    <button
                      onClick={() => handleTriggerReset(u)}
                      title="Generate Password Reset Link"
                      className="p-1.5 rounded-xl bg-[#FFFDF8] border border-[#EAE7DF] text-[#568469] hover:bg-[#E2EBD9] transition-colors cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteUser(u)}
                      title="Permanently Delete"
                      className="p-1.5 rounded-xl bg-[#FFFDF8] border border-[#EAE7DF] text-[#8A3B29] hover:bg-[#F4DDD3] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-[#EAE7DF] flex items-center justify-between text-xs text-[#728078]">
          <span>Showing {users.length} accounts</span>
          <span className="font-bold text-[#263831]">Total Registered: {total}</span>
        </div>
      </div>

      {/* Accessible In-App Confirmation Dialog */}
      {confirmModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#263831]/40 backdrop-blur-2xs flex items-center justify-center p-4"
        >
          <div className="w-full max-w-md bg-[#FFFDF8] rounded-[2rem] p-6 shadow-xl border border-[#EAE7DF] space-y-4">
            <h3 className="text-base font-bold text-[#263831]">{confirmModal.title}</h3>
            <p className="text-xs text-[#728078] leading-relaxed">{confirmModal.message}</p>
            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 rounded-xl bg-[#F8F6F0] hover:bg-[#EAE7DF] text-[#728078] text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer ${
                  confirmModal.isDestructive
                    ? 'bg-[#B25D48] hover:bg-[#994734]'
                    : 'bg-[#568469] hover:bg-[#456C55]'
                }`}
              >
                {confirmModal.actionLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
