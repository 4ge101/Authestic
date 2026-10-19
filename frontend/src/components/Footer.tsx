import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  ArrowUp,
  Sparkles,
  Volume2,
  VolumeX,
  Eye,
  ShieldCheck,
  BookOpen,
  Gamepad2,
  Smile,
  Compass,
} from 'lucide-react';
import { SproutIcon } from './OrganicDecorative';
import { smoothScrollToTop } from '../utils/gsapMotion';

interface FooterProps {
  className?: string;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  reducedMotion?: boolean;
  onToggleMotion?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  className = '',
  soundEnabled = true,
  onToggleSound,
  reducedMotion = false,
  onToggleMotion,
}) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    smoothScrollToTop();
  };

  return (
    <footer
      className={`relative w-full bg-[#F0EBDD] text-[#263831] border-t border-[#EAE7DF] mt-12 ${className}`}
      aria-label="Footer"
    >
      {/* Organic Layered Rolling Hills Transition at Top of Footer */}
      <div className="w-full overflow-hidden leading-none select-none pointer-events-none -mt-14 sm:-mt-20">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-14 sm:h-20 block"
          preserveAspectRatio="none"
        >
          {/* Back Gentle Hill */}
          <path
            d="M0 60 Q 340 10, 720 50 T 1440 30 L 1440 120 L 0 120 Z"
            fill="#E5DEC9"
            opacity="0.5"
          />
          {/* Mid Hill */}
          <path
            d="M0 75 Q 400 35, 860 65 T 1440 50 L 1440 120 L 0 120 Z"
            fill="#DDE7D5"
            opacity="0.75"
          />
          {/* Foreground Hill matching #F0EBDD */}
          <path
            d="M0 90 Q 520 60, 1020 80 T 1440 65 L 1440 120 L 0 120 Z"
            fill="#F0EBDD"
          />

          {/* Left Shrub & Sprout */}
          <circle cx="90" cy="100" r="14" fill="#88A88E" opacity="0.6" />
          <circle cx="108" cy="104" r="11" fill="#75977C" opacity="0.75" />
          <path d="M100 102 C 95 94, 90 90, 92 82 C 98 86, 102 96, 100 102 Z" fill="#568469" />

          {/* Right Wildflowers & Chamomile */}
          <g transform="translate(1340, 72)">
            {/* Flower 1 - Daisy */}
            <circle cx="0" cy="0" r="4.5" fill="#FFC93C" />
            {[0, 60, 120, 180, 240, 300].map((deg, idx) => (
              <ellipse
                key={idx}
                cx="0"
                cy="-9"
                rx="3"
                ry="5.5"
                fill="#FFFDF8"
                transform={`rotate(${deg} 0 0)`}
              />
            ))}
          </g>
          <g transform="translate(1380, 80)">
            {/* Flower 2 - Soft Coral Blossom */}
            <circle cx="0" cy="0" r="4" fill="#FFA585" />
            {[0, 72, 144, 216, 288].map((deg, idx) => (
              <ellipse
                key={idx}
                cx="0"
                cy="-8"
                rx="3.5"
                ry="5"
                fill="#F28E79"
                transform={`rotate(${deg} 0 0)`}
              />
            ))}
          </g>
        </svg>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-12 pt-8 pb-14">
        {/* Main 4-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 mb-12">
          {/* Brand & Purpose (col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-2xl bg-[#E2EBD9] flex items-center justify-center shadow-xs">
                  <SproutIcon className="w-6 h-6 text-[#568469]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-xl tracking-tight text-[#263831]">
                    Eshal
                  </span>
                  <span className="text-[11px] font-bold text-[#568469] tracking-wider uppercase">
                    Autism Learning Haven
                  </span>
                </div>
              </div>

              <p className="text-sm text-[#728078] leading-relaxed max-w-sm mb-5 font-medium">
                A calm, sensory-friendly companion designed with love for young autistic minds and their caregivers. Every step is celebrated at your child's own natural pace.
              </p>

              {/* Trust & Sensory Badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#568469]">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDF8] border border-[#EAE7DF] shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#568469]" />
                  100% Ad-Free & Child-Safe
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDF8] border border-[#EAE7DF] shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#E5A83B]" />
                  Calm Sensory Palette
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Explore Activities (col-span-3) */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#728078] mb-3 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#568469]" />
              Gentle Pathways
            </h3>
            <ul className="space-y-2 text-sm font-semibold text-[#263831]/80">
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigate('/learn')}
                  className="hover:text-[#568469] hover:translate-x-0.5 transition-all inline-flex items-center gap-2 text-left cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#568469]" />
                  Learning Hub
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigate('/stories')}
                  className="hover:text-[#568469] hover:translate-x-0.5 transition-all inline-flex items-center gap-2 text-left cursor-pointer"
                >
                  <Smile className="w-3.5 h-3.5 text-[#568469]" />
                  Stories & Narratives
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigate('/play')}
                  className="hover:text-[#568469] hover:translate-x-0.5 transition-all inline-flex items-center gap-2 text-left cursor-pointer"
                >
                  <Gamepad2 className="w-3.5 h-3.5 text-[#568469]" />
                  Playful Games
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigate('/sensory')}
                  className="hover:text-[#568469] hover:translate-x-0.5 transition-all inline-flex items-center gap-2 text-left cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#568469]" />
                  Sensory Breakroom
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigate('/communication')}
                  className="hover:text-[#568469] hover:translate-x-0.5 transition-all inline-flex items-center gap-2 text-left cursor-pointer"
                >
                  <span className="text-xs">💬</span>
                  AAC Communication
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Caregivers & Support (col-span-2) */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#728078] mb-3 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#568469]" />
              Caregivers
            </h3>
            <ul className="space-y-2 text-sm font-semibold text-[#263831]/80">
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigate('/progress')}
                  className="hover:text-[#568469] hover:translate-x-0.5 transition-all text-left cursor-pointer"
                >
                  Journey & Goals
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigate('/resources')}
                  className="hover:text-[#568469] hover:translate-x-0.5 transition-all text-left cursor-pointer"
                >
                  Resource Library
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigate('/life-skills')}
                  className="hover:text-[#568469] hover:translate-x-0.5 transition-all text-left cursor-pointer"
                >
                  Routine Visuals
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigate('/settings')}
                  className="hover:text-[#568469] hover:translate-x-0.5 transition-all text-left cursor-pointer"
                >
                  Comfort Settings
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Sensory Controls & Back to Top (col-span-2) */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#728078] mb-3">
                Sensory Controls
              </h3>
              <div className="flex flex-col gap-2">
                {onToggleSound && (
                  <button
                    type="button"
                    onClick={onToggleSound}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#FFFDF8] hover:bg-white text-xs font-bold text-[#263831] border border-[#EAE7DF] transition-all cursor-pointer shadow-2xs"
                    title={soundEnabled ? 'Mute soothing audio chimes' : 'Turn on soothing audio chimes'}
                  >
                    <span className="flex items-center gap-1.5">
                      {soundEnabled ? (
                        <Volume2 className="w-3.5 h-3.5 text-[#568469]" />
                      ) : (
                        <VolumeX className="w-3.5 h-3.5 text-[#728078]" />
                      )}
                      Sound Chimes
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${soundEnabled ? 'bg-[#E2EBD9] text-[#568469]' : 'bg-[#EAE7DF] text-[#728078]'}`}>
                      {soundEnabled ? 'ON' : 'OFF'}
                    </span>
                  </button>
                )}

                {onToggleMotion && (
                  <button
                    type="button"
                    onClick={onToggleMotion}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#FFFDF8] hover:bg-white text-xs font-bold text-[#263831] border border-[#EAE7DF] transition-all cursor-pointer shadow-2xs"
                    title="Toggle reduced motion for calmer visuals"
                  >
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#568469]" />
                      Motion
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${reducedMotion ? 'bg-[#F5D998] text-[#7A5B0B]' : 'bg-[#E2EBD9] text-[#568469]'}`}>
                      {reducedMotion ? 'CALM' : 'NORMAL'}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Back to Top Button */}
            <div className="mt-4 pt-3 border-t border-[#EAE7DF]/70">
              <button
                type="button"
                onClick={() => smoothScrollToTop()}
                className="group w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#568469] hover:bg-[#456C55] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98"
                aria-label="Scroll back to top of the page"
              >
                <span>Back to Top</span>
                <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer: Copyright, Privacy & Accessibility Pledge */}
        <div className="pt-6 border-t border-[#EAE7DF] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#728078] font-medium">
          <div className="flex items-center gap-1.5">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#E68165] fill-[#E68165]" />
            <span>for neurodivergent young learners everywhere.</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[11px] flex-wrap">
            <Link to="/admin" className="text-[#568469] font-bold hover:underline">
              Admin Console
            </Link>
            <span>•</span>
            <span>No Trackers</span>
            <span>•</span>
            <span>Non-Overstimulating</span>
            <span>•</span>
            <span>Eshal &copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
