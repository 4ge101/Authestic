import React from 'react';
import { BookOpen, Gamepad2, Star, ArrowRight, Sparkles } from 'lucide-react';
import { SproutIcon } from './OrganicDecorative';

interface ExploreSectionProps {
  onNavigate: (route: string) => void;
}

export const ExploreSection: React.FC<ExploreSectionProps> = ({ onNavigate }) => {
  return (
    <section aria-labelledby="explore-heading" className="relative">
      <div className="mb-3.5">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#FFC93C]" />
          <h3 id="explore-heading" className="text-lg font-bold text-[#263831]">
            Explore
          </h3>
        </div>
        <p className="text-xs text-[#728078] font-medium mt-0.5">
          Find more activities and resources
        </p>
      </div>

      {/* 4 balanced Explore destination organic shapes in a horizontal row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        {/* 1. Stories: wide organic shape with off-center raised crest, uneven upper curve, softly dipping lower edge */}
        <button
          type="button"
          onClick={() => onNavigate('/stories')}
          className="group relative flex flex-col items-center justify-center p-0 bg-transparent border-0 shadow-none rounded-none cursor-pointer focus:outline-none min-h-[118px] sm:min-h-[128px] w-full"
        >
          {/* Visible organic surface: Custom SVG Bézier path */}
          <svg
            viewBox="0 0 220 120"
            className="absolute inset-0 w-full h-full overflow-visible drop-shadow-[0_2px_6px_rgba(38,56,49,0.06)] transition-transform duration-200 ease-out group-hover:scale-[1.03] group-active:scale-[0.98]"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M 24,58 C 26,38 52,22 88,20 C 120,18 140,10 162,12 C 182,14 204,26 210,48 C 216,70 210,92 188,104 C 165,114 135,118 108,110 C 80,102 52,112 36,104 C 20,96 22,78 24,58 Z"
              fill="#FDE8BE"
              stroke="#F2DCAB"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>

          {/* Separate content layer above the SVG */}
          <div className="relative z-10 flex flex-col items-center justify-center px-4 py-4 text-center">
            <div className="mb-2 transition-transform duration-200 group-hover:scale-110">
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-[#6C537B] stroke-[2]" />
            </div>
            <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-[#263831] group-hover:text-[#568469] transition-colors">
              <span>Stories</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </button>

        {/* 2. Games: broad flowing shape with two uneven curved rises and an asymmetrical base */}
        <button
          type="button"
          onClick={() => onNavigate('/play')}
          className="group relative flex flex-col items-center justify-center p-0 bg-transparent border-0 shadow-none rounded-none cursor-pointer focus:outline-none min-h-[118px] sm:min-h-[128px] w-full"
        >
          {/* Visible organic surface: Custom SVG Bézier path */}
          <svg
            viewBox="0 0 220 120"
            className="absolute inset-0 w-full h-full overflow-visible drop-shadow-[0_2px_6px_rgba(38,56,49,0.06)] transition-transform duration-200 ease-out group-hover:scale-[1.03] group-active:scale-[0.98]"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M 18,62 C 16,36 40,18 70,22 C 92,25 106,36 124,32 C 144,28 162,14 186,16 C 205,18 218,34 216,58 C 214,82 206,102 185,112 C 160,122 125,108 96,116 C 68,124 38,118 24,100 C 14,88 18,78 18,62 Z"
              fill="#D5E4EC"
              stroke="#BFD5E2"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>

          {/* Separate content layer above the SVG */}
          <div className="relative z-10 flex flex-col items-center justify-center px-4 py-4 text-center">
            <div className="mb-2 transition-transform duration-200 group-hover:scale-110">
              <Gamepad2 className="w-6 h-6 sm:w-7 sm:h-7 text-[#3B6478] stroke-[2]" />
            </div>
            <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-[#263831] group-hover:text-[#568469] transition-colors">
              <span>Games</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </button>

        {/* 3. Life Skills: gently sloping organic patch with offset crest and distinctly uneven contour */}
        <button
          type="button"
          onClick={() => onNavigate('/life-skills')}
          className="group relative flex flex-col items-center justify-center p-0 bg-transparent border-0 shadow-none rounded-none cursor-pointer focus:outline-none min-h-[118px] sm:min-h-[128px] w-full"
        >
          {/* Visible organic surface: Custom SVG Bézier path */}
          <svg
            viewBox="0 0 220 120"
            className="absolute inset-0 w-full h-full overflow-visible drop-shadow-[0_2px_6px_rgba(38,56,49,0.06)] transition-transform duration-200 ease-out group-hover:scale-[1.03] group-active:scale-[0.98]"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M 30,98 C 16,78 18,45 42,24 C 62,6 94,10 115,22 C 138,34 162,40 184,46 C 206,52 218,68 214,86 C 210,104 185,116 156,112 C 128,108 92,118 64,116 C 44,114 34,108 30,98 Z"
              fill="#FDE2C8"
              stroke="#F2CDB0"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>

          {/* Separate content layer above the SVG */}
          <div className="relative z-10 flex flex-col items-center justify-center px-4 py-4 text-center">
            <div className="mb-2 transition-transform duration-200 group-hover:scale-110">
              <Star className="w-6 h-6 sm:w-7 sm:h-7 text-[#9A6224] stroke-[2] fill-[#F5D998]" />
            </div>
            <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-[#263831] group-hover:text-[#568469] transition-colors">
              <span>Life Skills</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </button>

        {/* 4. Sensory: soft irregular landscape silhouette with shallow indentation on one side and raised curve on the other */}
        <button
          type="button"
          onClick={() => onNavigate('/sensory')}
          className="group relative flex flex-col items-center justify-center p-0 bg-transparent border-0 shadow-none rounded-none cursor-pointer focus:outline-none min-h-[118px] sm:min-h-[128px] w-full"
        >
          {/* Visible organic surface: Custom SVG Bézier path */}
          <svg
            viewBox="0 0 220 120"
            className="absolute inset-0 w-full h-full overflow-visible drop-shadow-[0_2px_6px_rgba(38,56,49,0.06)] transition-transform duration-200 ease-out group-hover:scale-[1.03] group-active:scale-[0.98]"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M 30,60 C 22,46 32,26 62,20 C 94,14 132,22 164,18 C 192,14 218,24 220,50 C 222,76 212,100 186,114 C 158,126 114,116 80,120 C 48,124 24,112 18,88 C 14,72 24,66 30,60 Z"
              fill="#DDE9D7"
              stroke="#C8DEC0"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>

          {/* Separate content layer above the SVG */}
          <div className="relative z-10 flex flex-col items-center justify-center px-4 py-4 text-center">
            <div className="mb-2 transition-transform duration-200 group-hover:scale-110">
              <SproutIcon className="w-6 h-6 sm:w-7 sm:h-7" color="#3E684C" />
            </div>
            <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-[#263831] group-hover:text-[#568469] transition-colors">
              <span>Sensory</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </button>
      </div>
    </section>
  );
};
