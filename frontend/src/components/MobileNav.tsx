import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Gamepad2, MessageSquare, BarChart2, Settings } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const items = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/learn', label: 'Learn', icon: BookOpen },
    { path: '/play', label: 'Play', icon: Gamepad2 },
    { path: '/stories', label: 'Stories', icon: MessageSquare },
    { path: '/progress', label: 'Progress', icon: BarChart2 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 bg-[#FFFDF8]/95 backdrop-blur-md border-t border-[#EAE7DF] py-2 px-3 z-30 flex items-center justify-around shadow-md"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.path);

        return (
          <button
            key={item.path}
            type="button"
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center p-1.5 min-w-[50px] rounded-xl transition-colors cursor-pointer ${
              isActive
                ? 'text-[#568469] font-bold bg-[#E2EBD9]/60'
                : 'text-[#728078] hover:text-[#263831]'
            }`}
          >
            <Icon className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
