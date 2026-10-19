import React from 'react';
import { BookOpen, Gamepad2, MessageSquare, Heart } from 'lucide-react';
import { HandwrittenEncouragement } from './OrganicDecorative';

interface QuickActionsProps {
  onSelectAction: (actionKey: 'learn' | 'play' | 'communication' | 'resources') => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onSelectAction }) => {
  return (
    <section aria-labelledby="quick-actions-heading" className="relative">
      {/* Heading Line + "You can do it! 💚" Annotation */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 id="quick-actions-heading" className="text-lg sm:text-xl font-bold text-[#263831]">
              Quick Actions
            </h3>
            {/* 3 radiating warm yellow sun rays */}
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="text-[#FFC93C]" aria-hidden="true">
              <line x1="3" y1="4" x2="1" y2="2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="7" y1="3" x2="7" y2="1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="11" y1="4" x2="13" y2="2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-xs text-[#728078] font-medium mt-0.5">
            Jump into what you need right now.
          </p>
        </div>

        {/* Playful "You can do it! 💚" with curved arrow pointing toward Today's Activities */}
        <HandwrittenEncouragement className="hidden sm:flex -mt-2 -mr-1" />
      </div>

      {/* 4 Quick Actions in balanced 4-column horizontal grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        {/* Learn */}
        <button
          type="button"
          onClick={() => onSelectAction('learn')}
          className="group flex flex-col items-center sm:items-start text-center sm:text-left p-3 rounded-2xl hover:bg-[#F0EBDD]/40 transition-all cursor-pointer"
        >
          <div 
            style={{ borderRadius: '20px 24px 16px 22px' }}
            className="w-14 h-14 bg-[#E2EBD9] flex items-center justify-center mb-2.5 transition-transform group-hover:scale-105 shadow-2xs"
          >
            <BookOpen className="w-6 h-6 text-[#4A785D] stroke-[2.2]" />
          </div>
          <h4 className="font-bold text-sm text-[#263831] group-hover:text-[#568469] transition-colors leading-snug">
            Learn
          </h4>
          <p className="text-[11px] text-[#728078] mt-0.5 font-medium leading-relaxed">
            Explore fun lessons
          </p>
        </button>

        {/* Play */}
        <button
          type="button"
          onClick={() => onSelectAction('play')}
          className="group flex flex-col items-center sm:items-start text-center sm:text-left p-3 rounded-2xl hover:bg-[#F0EBDD]/40 transition-all cursor-pointer"
        >
          <div 
            style={{ borderRadius: '24px 18px 22px 16px' }}
            className="w-14 h-14 bg-[#F5D998] flex items-center justify-center mb-2.5 transition-transform group-hover:scale-105 shadow-2xs"
          >
            <Gamepad2 className="w-6 h-6 text-[#876527] stroke-[2.2]" />
          </div>
          <h4 className="font-bold text-sm text-[#263831] group-hover:text-[#568469] transition-colors leading-snug">
            Play
          </h4>
          <p className="text-[11px] text-[#728078] mt-0.5 font-medium leading-relaxed">
            Build skills through games
          </p>
        </button>

        {/* Communication */}
        <button
          type="button"
          onClick={() => onSelectAction('communication')}
          className="group flex flex-col items-center sm:items-start text-center sm:text-left p-3 rounded-2xl hover:bg-[#F0EBDD]/40 transition-all cursor-pointer"
        >
          <div 
            style={{ borderRadius: '18px 22px 24px 16px' }}
            className="w-14 h-14 bg-[#DCE8EE] flex items-center justify-center mb-2.5 transition-transform group-hover:scale-105 shadow-2xs"
          >
            <MessageSquare className="w-6 h-6 text-[#3E6C80] stroke-[2.2]" />
          </div>
          <h4 className="font-bold text-sm text-[#263831] group-hover:text-[#568469] transition-colors leading-snug">
            Communication
          </h4>
          <p className="text-[11px] text-[#728078] mt-0.5 font-medium leading-relaxed">
            Practice and express
          </p>
        </button>

        {/* Resources */}
        <button
          type="button"
          onClick={() => onSelectAction('resources')}
          className="group flex flex-col items-center sm:items-start text-center sm:text-left p-3 rounded-2xl hover:bg-[#F0EBDD]/40 transition-all cursor-pointer"
        >
          <div 
            style={{ borderRadius: '22px 16px 20px 24px' }}
            className="w-14 h-14 bg-[#F4DDD3] flex items-center justify-center mb-2.5 transition-transform group-hover:scale-105 shadow-2xs"
          >
            <Heart className="w-6 h-6 text-[#C05244] stroke-[2.2]" />
          </div>
          <h4 className="font-bold text-sm text-[#263831] group-hover:text-[#568469] transition-colors leading-snug">
            Resources
          </h4>
          <p className="text-[11px] text-[#728078] mt-0.5 font-medium leading-relaxed">
            Find helpful tools
          </p>
        </button>
      </div>
    </section>
  );
};
