import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  BarChart3,
  Users,
  Layers,
  FileText,
  Settings,
  ArrowLeft,
  LogOut,
  Sparkles,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/admin', end: true, label: 'Overview', icon: Shield },
    { to: '/admin/analytics', label: 'Data Analytics', icon: BarChart3 },
    { to: '/admin/users', label: 'User Accounts', icon: Users },
    { to: '/admin/content', label: 'Content Management', icon: Layers },
    { to: '/admin/audit', label: 'Security & Audit', icon: FileText },
    { to: '/admin/settings', label: 'App Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#263831] flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#FFFDF8] border-r border-[#EAE7DF] flex flex-col p-6 shrink-0">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-[#568469] flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-tight text-[#263831]">Eshal</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#568469]"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#728078]">
                Admin Console
              </span>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#E2EBD9] text-[#263831] shadow-xs'
                    : 'text-[#728078] hover:bg-[#F8F6F0] hover:text-[#263831]'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Admin User Profile & Switcher */}
        <div className="pt-6 border-t border-[#EAE7DF] space-y-3">
          <div className="p-3 rounded-2xl bg-[#F0EBDD]/50 border border-[#EAE7DF]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#728078]">Signed in as</p>
            <p className="text-xs font-bold text-[#263831] truncate mt-0.5">{user?.name}</p>
            <p className="text-[11px] text-[#728078] truncate">{user?.email}</p>
            <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-[#568469] text-white text-[9px] font-black tracking-wider uppercase">
              {user?.role}
            </span>
          </div>

          <NavLink
            to="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#F8F6F0] hover:bg-[#E2EBD9] text-xs font-bold text-[#568469] border border-[#EAE7DF] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Learning App</span>
          </NavLink>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-[#8A3B29] hover:bg-[#F4DDD3]/50 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin View Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
