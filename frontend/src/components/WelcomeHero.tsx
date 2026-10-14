import React, { useRef, useEffect } from 'react';
import { Leaf, ChevronRight } from 'lucide-react';
import { UserProfile } from '../types';
import { CuteSunIcon } from './OrganicDecorative';
import { setupCalmFloat } from '../utils/gsapMotion';

interface WelcomeHeroProps {
  user: UserProfile;
  onContinueLearning: () => void;
  onTakeBreak?: () => void;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({
  user,
  onContinueLearning,
}) => {
  const sunRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cleanup = setupCalmFloat(sunRef.current, {
      y: 3.5,
      duration: 3.2,
      disabled: user.preferences.reducedMotion,
    });
    return cleanup;
  }, [user.preferences.reducedMotion]);
  return (
    <section 
      aria-label="Welcome section"
      className="relative pt-2 pb-1 overflow-visible"
    >
      {/* Responsive SVG ClipPath for the Hero Landscape lower edge */}
      <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id="heroLandscapeClip" clipPathUnits="objectBoundingBox">
            {/* Natural rolling landscape silhouette along the lower boundary */}
            <path d="M 0,0 
                     L 1,0 
                     L 1,0.84 
                     C 0.86,0.92 0.70,0.80 0.52,0.87 
                     C 0.36,0.93 0.18,0.85 0,0.92 
                     Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center min-h-[320px] lg:min-h-[380px]">
        {/* Left Side: Welcoming Storybook Copy (5 cols on lg) */}
        <div className="lg:col-span-5 z-20 flex flex-col justify-center py-2 lg:py-6">
          {/* Greeting with Cute Sun mascot */}
          <div className="inline-flex items-center gap-2 text-base font-bold text-[#263831] mb-2.5">
            <span>Hello, {user.name}!</span>
            <span ref={sunRef} className="inline-flex">
              <CuteSunIcon className="w-5 h-5 text-[#FFC93C]" />
            </span>
          </div>

          {/* Large Bold Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#263831] tracking-tight leading-[1.12] mb-3">
            Small steps<br />make big progress!
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#728078] leading-relaxed max-w-sm mb-6 font-medium">
            Today is a great day to learn,<br />explore and be yourself!
          </p>

          {/* Pill-shaped Continue Learning button */}
          <div>
            <button
              type="button"
              onClick={onContinueLearning}
              className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 rounded-full bg-[#568469] hover:bg-[#456C55] active:scale-[0.98] text-[#FFFDF8] font-bold text-sm sm:text-base shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-[#568469] focus:ring-offset-2 cursor-pointer"
            >
              <Leaf className="w-4 h-4 text-[#E2EBD9] fill-[#E2EBD9]" />
              <span>Continue Learning</span>
              <ChevronRight className="w-4 h-4 text-[#E2EBD9]" />
            </button>
          </div>
        </div>

        {/* Right Side: Large Flowing Landscape Illustration (7 cols on lg) */}
        {/* NO rectangular container, NO borders, NO card boxes - blends directly into ivory canvas */}
        <div className="lg:col-span-7 relative h-[280px] sm:h-[350px] lg:h-[400px] w-full flex items-center justify-center lg:justify-end">
          {/* Clipped image container with organic landscape bottom edge */}
          <div 
            className="relative w-full h-full overflow-hidden"
            style={{
              clipPath: 'url(#heroLandscapeClip)',
              WebkitClipPath: 'url(#heroLandscapeClip)',
            }}
          >
            <img
              src="/src/assets/images/hero_boy_corgi_1791915349516.jpg"
              alt="Cheerful child with companion puppy enjoying sunny rolling hills"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-[center_35%]"
            />

            {/* Seamless Left Edge Fade into warm ivory page background */}
            <div 
              className="absolute inset-y-0 left-0 w-28 sm:w-36 pointer-events-none z-10 hidden sm:block" 
              style={{
                background: 'linear-gradient(to right, #F8F6F0 0%, rgba(248, 246, 240, 0.6) 45%, rgba(248, 246, 240, 0) 100%)',
              }}
            />

            {/* Seamless Bottom Edge Landscape Fade */}
            <div 
              className="absolute inset-x-0 bottom-0 h-20 sm:h-28 pointer-events-none z-10" 
              style={{
                background: 'linear-gradient(to top, #F8F6F0 0%, rgba(248, 246, 240, 0.7) 45%, rgba(248, 246, 240, 0) 100%)',
              }}
            />

            {/* Subtle Top Edge Soft Blend */}
            <div 
              className="absolute inset-x-0 top-0 h-10 pointer-events-none z-10" 
              style={{
                background: 'linear-gradient(to bottom, rgba(248, 246, 240, 0.45) 0%, rgba(248, 246, 240, 0) 100%)',
              }}
            />
          </div>

          {/* Layered landscape rolling wave accent along the bottom connecting illustration to the page */}
          <svg 
            viewBox="0 0 600 60" 
            className="absolute -bottom-1 -left-6 right-0 w-[110%] h-12 text-[#F8F6F0] pointer-events-none z-20" 
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path 
              d="M 0,32 C 140,54 280,18 420,38 C 500,48 560,26 600,32 L 600,60 L 0,60 Z" 
              fill="currentColor" 
            />
          </svg>
        </div>
      </div>
    </section>
  );
};
