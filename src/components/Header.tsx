import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Sliders, Volume2, VolumeX, Sparkles, Menu, X, Shield } from 'lucide-react';
import { UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  user: UserProfile;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCaregiverModal: () => void;
  onToggleSound: () => void;
  onToggleMotion: () => void;
  onOpenMobileMenu: () => void;
  mobileMenuOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  searchQuery,
  onSearchChange,
  onOpenCaregiverModal,
  onToggleSound,
  onToggleMotion,
  onOpenMobileMenu,
  mobileMenuOpen,
}) => {
  const navigate = useNavigate();
  const { isAdmin, isSupport } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full flex items-center justify-between gap-3 sm:gap-4 pt-3 pb-2 px-4 sm:px-8 lg:px-10 z-20">
      {/* Mobile Menu Toggle & Brand for Small Screens */}
      <div className="flex items-center gap-2 sm:gap-3 md:hidden">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl text-[#263831] hover:bg-[#F0EBDD] active:scale-95 transition-all cursor-pointer"
          aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <span className="font-extrabold text-base text-[#263831] tracking-tight">Eshal</span>
      </div>

      <div className="hidden md:block flex-1" />

      {/* Floating Top-Right Controls: Pill Search + Profile Avatar */}
      <div className="flex items-center justify-end gap-3 flex-1 max-w-lg">
        {/* Pill Search Field */}
        <div className="relative flex-1 max-w-sm">
          <label htmlFor="search-input" className="sr-only">
            Search activities and topics
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#728078]">
            <Search className="w-4 h-4 text-[#728078]" />
          </div>
          <input
            id="search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search activities, topics..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-[#FFFDF8]/90 backdrop-blur-xs border border-[#EAE7DF] rounded-full text-[#263831] placeholder-[#728078] focus:outline-none focus:ring-2 focus:ring-[#568469] focus:border-transparent transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-[#728078] hover:text-[#263831]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick Admin Dashboard Access */}
        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFDF8] hover:bg-[#E2EBD9] border border-[#EAE7DF] text-xs font-bold text-[#568469] transition-all shadow-2xs cursor-pointer active:scale-95 shrink-0"
          title="Open Admin Dashboard"
        >
          <Shield className="w-3.5 h-3.5 text-[#568469]" />
          <span className="hidden sm:inline">Admin Panel</span>
        </button>

        {/* Sensory Sound Indicator Quick Button */}
        <button
          type="button"
          onClick={onToggleSound}
          title={user.preferences.soundEnabled ? 'Gentle sound enabled' : 'Sound muted (calm mode)'}
          className={`p-2 rounded-full border transition-all ${
            user.preferences.soundEnabled
              ? 'bg-[#E2EBD9] border-[#568469] text-[#568469]'
              : 'bg-[#FFFDF8] border-[#EAE7DF] text-[#728078] hover:text-[#263831]'
          }`}
          aria-label={user.preferences.soundEnabled ? 'Mute calm sounds' : 'Enable calm sounds'}
        >
          {user.preferences.soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5" />
          ) : (
            <VolumeX className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Profile Avatar & Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-[#568469]/40 transition-all cursor-pointer"
            aria-expanded={profileDropdownOpen}
            aria-haspopup="true"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden bg-[#FFD966] p-0.5 shadow-2xs shrink-0">
              <img
                src={user.avatarUrl}
                alt={`${user.name}'s avatar`}
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#568469]" />
          </button>

          {/* Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#FFFDF8] border border-[#EAE7DF] rounded-3xl shadow-lg p-3 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-[#EAE7DF]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#263831]">{user.name}</span>
                  <span className="text-[11px] font-semibold text-[#568469] bg-[#E2EBD9] px-2 py-0.5 rounded-full">
                    Age {user.age}
                  </span>
                </div>
                <p className="text-xs text-[#728078] mt-0.5">Learner Profile</p>
              </div>

              <div className="py-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    navigate('/admin');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#568469] hover:bg-[#E2EBD9] font-bold transition-colors text-left"
                >
                  <Shield className="w-4 h-4 text-[#568469]" />
                  <span>Admin Console</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onOpenCaregiverModal();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#263831] hover:bg-[#F0EBDD] font-medium transition-colors text-left"
                >
                  <Sliders className="w-4 h-4 text-[#568469]" />
                  <span>Caregiver & Sensory Setup</span>
                </button>

                <button
                  type="button"
                  onClick={onToggleSound}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[#263831] hover:bg-[#F0EBDD] font-medium transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    {user.preferences.soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-[#568469]" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-[#728078]" />
                    )}
                    <span>Gentle Audio Effects</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#728078]">
                    {user.preferences.soundEnabled ? 'ON' : 'OFF'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onToggleMotion}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[#263831] hover:bg-[#F0EBDD] font-medium transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#568469]" />
                    <span>Reduced Motion</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#728078]">
                    {user.preferences.reducedMotion ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
