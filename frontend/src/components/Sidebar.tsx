import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Sparkles,
  Heart,
  GraduationCap,
  Gamepad2,
  TrendingUp,
  User,
  ShieldCheck
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/stories', label: 'Stories', icon: BookOpen },
    { to: '/garden', label: 'Feelings', icon: Heart },
    { to: '/activities', label: 'Activities', icon: Sparkles },
    { to: '/learning', label: 'Learning', icon: GraduationCap },
    { to: '/games', label: 'Games', icon: Gamepad2 },
    { to: '/progress', label: 'Progress', icon: TrendingUp },
    { to: '/settings', label: 'Profile & Settings', icon: User }
  ];

  const mobileNavItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/stories', label: 'Stories', icon: BookOpen },
    { to: '/garden', label: 'Feelings', icon: Heart },
    { to: '/activities', label: 'Activities', icon: Sparkles },
    { to: '/learning', label: 'Learning', icon: GraduationCap },
    { to: '/games', label: 'Games', icon: Gamepad2 }
  ];

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="sidebar" aria-label="Main Navigation">
        <div className="sidebar-header">
          <div className="brand-mark" aria-hidden="true">
            A
          </div>
          <div className="brand-text">
            <span className="brand-title">Authsetic</span>
            <span className="brand-tagline">Learning & Calming Space</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                end={item.to === '/'}
              >
                <Icon className="nav-icon" aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <NavLink
            to="/caregiver"
            className={({ isActive }) => `sidebar-caregiver-link ${isActive ? 'active' : ''}`}
          >
            <ShieldCheck size={16} aria-hidden="true" />
            <span>Caregiver View</span>
          </NavLink>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
              end={item.to === '/'}
            >
              <Icon aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
};
