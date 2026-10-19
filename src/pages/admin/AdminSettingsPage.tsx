import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Settings, Save, AlertCircle, CheckCircle, RefreshCw, ShieldAlert } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<any>({
    appName: 'Eshal',
    brandTagline: 'Autism Learning Platform',
    allowPublicRegistration: true,
    maintenanceMode: false,
    sessionTimeoutHours: 168,
    requireEmailVerification: false,
    maxDailyGoalMinutes: 120,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.admin.getSettings();
      setSettings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await api.admin.updateSettings(settings);
      setSettings(updated);
      setSuccess('Application settings updated and logged to audit trail.');
    } catch (err: any) {
      setError(err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#263831]">Application Settings</h1>
          <p className="text-xs text-[#728078] mt-1 font-medium">
            System configuration, authentication policies, session timeouts, and registration controls
          </p>
        </div>
        <button
          onClick={fetchSettings}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FFFDF8] border border-[#EAE7DF] text-xs font-bold text-[#568469] hover:bg-[#E2EBD9] transition-colors cursor-pointer self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Reload</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-[#F4DDD3]/60 border border-[#F4DDD3] flex items-center gap-3 text-xs text-[#8A3B29]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-[#E2EBD9] border border-[#d5e2cb] text-xs text-[#263831] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#568469]" />
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess(null)} className="text-[11px] font-bold text-[#568469] hover:underline">
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#FFFDF8] p-6 md:p-8 rounded-3xl border border-[#EAE7DF] shadow-xs space-y-6">
        {/* Brand Section */}
        <div>
          <h3 className="text-sm font-bold text-[#263831] mb-3 pb-2 border-b border-[#EAE7DF]">
            Branding & Presentation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#728078] mb-1.5 uppercase tracking-wider">
                Application Display Name
              </label>
              <input
                type="text"
                required
                value={settings.appName || ''}
                onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
                className="w-full bg-[#F8F6F0] border border-[#EAE7DF] rounded-2xl py-2.5 px-3.5 text-[#263831]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#728078] mb-1.5 uppercase tracking-wider">
                Brand Tagline
              </label>
              <input
                type="text"
                required
                value={settings.brandTagline || ''}
                onChange={(e) => setSettings({ ...settings, brandTagline: e.target.value })}
                className="w-full bg-[#F8F6F0] border border-[#EAE7DF] rounded-2xl py-2.5 px-3.5 text-[#263831]"
              />
            </div>
          </div>
        </div>

        {/* Security & Access Policies */}
        <div>
          <h3 className="text-sm font-bold text-[#263831] mb-3 pb-2 border-b border-[#EAE7DF]">
            Security & Authentication Policies
          </h3>
          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8F6F0] cursor-pointer">
              <div>
                <p className="font-bold text-[#263831]">Allow Public Self-Registration</p>
                <p className="text-[11px] text-[#728078]">Allow new caregivers to create accounts from the login page</p>
              </div>
              <input
                type="checkbox"
                checked={settings.allowPublicRegistration}
                onChange={(e) => setSettings({ ...settings, allowPublicRegistration: e.target.checked })}
                className="w-5 h-5 accent-[#568469] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8F6F0] cursor-pointer">
              <div>
                <p className="font-bold text-[#263831]">Strict Email Verification Required</p>
                <p className="text-[11px] text-[#728078]">Require email token confirmation before granting full app access</p>
              </div>
              <input
                type="checkbox"
                checked={settings.requireEmailVerification}
                onChange={(e) => setSettings({ ...settings, requireEmailVerification: e.target.checked })}
                className="w-5 h-5 accent-[#568469] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8F6F0] cursor-pointer">
              <div>
                <p className="font-bold text-[#8A3B29] flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Maintenance Mode</span>
                </p>
                <p className="text-[11px] text-[#728078]">Temporarily restricts access for non-administrator accounts</p>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="w-5 h-5 accent-[#B25D48] rounded"
              />
            </label>
          </div>
        </div>

        {/* Timeouts */}
        <div>
          <h3 className="text-sm font-bold text-[#263831] mb-3 pb-2 border-b border-[#EAE7DF]">
            Session Duration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#728078] mb-1.5 uppercase tracking-wider">
                Session Expiration (Hours)
              </label>
              <input
                type="number"
                min="1"
                max="720"
                value={settings.sessionTimeoutHours || 168}
                onChange={(e) => setSettings({ ...settings, sessionTimeoutHours: parseInt(e.target.value, 10) || 168 })}
                className="w-full bg-[#F8F6F0] border border-[#EAE7DF] rounded-2xl py-2.5 px-3.5 text-[#263831]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#728078] mb-1.5 uppercase tracking-wider">
                Max Daily Goal Focus (Minutes)
              </label>
              <input
                type="number"
                min="10"
                max="300"
                value={settings.maxDailyGoalMinutes || 120}
                onChange={(e) => setSettings({ ...settings, maxDailyGoalMinutes: parseInt(e.target.value, 10) || 120 })}
                className="w-full bg-[#F8F6F0] border border-[#EAE7DF] rounded-2xl py-2.5 px-3.5 text-[#263831]"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#568469] hover:bg-[#456C55] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
