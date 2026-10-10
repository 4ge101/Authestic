import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Sparkles,
  GraduationCap,
  Gamepad2,
  TrendingUp,
  User,
  Settings,
  HeartHandshake
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/stories', label: 'Stories', icon: BookOpen },
    { to: '/activities', label: 'Activities', icon: Sparkles },
    { to: '/learning', label: 'Learning', icon: GraduationCap },
    { to: '/games', label: 'Games', icon: Gamepad2 },
    { to: '/progress', label: 'Progress', icon: TrendingUp },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings }
  ];

  const mobileNavItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/stories', label: 'Stories', icon: BookOpen },
    { to: '/activities', label: 'Calm', icon: Sparkles },
    { to: '/learning', label: 'Learn', icon: GraduationCap },
    { to: '/games', label: 'Games', icon: Gamepad2 },
    { to: '/progress', label: 'Progress', icon: TrendingUp }
  ];

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="sidebar" aria-label="Main Navigation">
        <div className="sidebar-header">
          <div className="brand-icon" aria-hidden="true">
            A
          </div>
          <div>
            <div className="brand-title">Authsetic</div>
            <span className="brand-tagline">Calm learning space</span>
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
          <div className="sidebar-care-card">
            <span className="sidebar-care-title">
              <HeartHandshake size={14} aria-hidden="true" />
              <span>Safe & Calm Space</span>
            </span>
            <p>Thoughtfully paced resources for children and caregivers.</p>
          </div>
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
