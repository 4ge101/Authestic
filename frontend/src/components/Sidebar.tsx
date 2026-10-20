import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Gamepad2, 
  BarChart2, 
  Folder, 
  Settings,
  MessageSquare,
  BookText
} from 'lucide-react';
import { SproutIcon } from './OrganicDecorative';

interface SidebarProps {
  onCloseMobileDrawer?: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onCloseMobileDrawer,
  className = '',
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/learn', label: 'Learn', icon: BookOpen },
    { path: '/play', label: 'Play', icon: Gamepad2 },
    { path: '/stories', label: 'Stories', icon: BookText },
    { path: '/communication', label: 'Communication', icon: MessageSquare },
    { path: '/progress', label: 'Progress', icon: BarChart2 },
    { path: '/resources', label: 'Resources', icon: Folder },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    if (onCloseMobileDrawer) onCloseMobileDrawer();
  };

  return (
    <aside 
      className={`w-full md:w-[205px] shrink-0 bg-[#F0EBDD] flex flex-col justify-between p-5 border-r border-[#EAE7DF]/70 select-none overflow-y-auto no-scrollbar ${className}`}
      aria-label="Main Navigation"
    >
      <div className="shrink-0">
        {/* Brand */}
        <div 
          onClick={() => handleNavClick('/')}
          className="flex items-center gap-2.5 mb-7 px-1 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#568469] rounded-xl transition-transform active:scale-98"
          tabIndex={0}
          role="button"
          aria-label="Eshal Home"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleNavClick('/');
            }
          }}
        >
          <div className="w-8 h-8 rounded-full bg-[#E2EBD9] flex items-center justify-center text-[#568469] shadow-2xs group-hover:scale-105 transition-transform">
            <SproutIcon className="w-5 h-5" color="#568469" />
          </div>
          <div>
            <h1 className="font-extrabold text-base leading-tight tracking-tight text-[#263831] group-hover:text-[#568469] transition-colors">
              Eshal
            </h1>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5" aria-label="Sidebar Menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = 
              item.path === '/' 
                ? location.pathname === '/' 
                : location.pathname.startsWith(item.path);

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all text-left cursor-pointer active:scale-[0.98] ${
                  isActive
                    ? 'bg-[#FFFDF8] text-[#263831] shadow-2xs font-bold ring-1 ring-[#EAE7DF]'
                    : 'text-[#566860] hover:text-[#263831] hover:bg-[#EAE7DF]/60'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon 
                  className={`w-4 h-4 stroke-[2.2] shrink-0 transition-colors ${
                    isActive ? 'text-[#568469]' : 'text-[#6C7D73]'
                  }`} 
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Gentle Affirmation Footer without boxed card */}
      <div className="mt-8 pt-4 pb-1 text-center flex flex-col items-center shrink-0 border-t border-[#EAE7DF]/40">
        <SproutIcon className="w-6 h-6 mb-1.5" color="#568469" />
        <p className="text-[11px] font-bold text-[#263831] leading-tight">
          You're doing<br />great!
        </p>
        <span className="text-xs mt-0.5" aria-hidden="true">💚</span>
      </div>
    </aside>
  );
};
