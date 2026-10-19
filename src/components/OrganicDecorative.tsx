import React from 'react';

// Cute smiling sun icon for "Hello, Sam! ☀️"
export const CuteSunIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
  >
    {/* Sun Rays */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <line
        key={i}
        x1="20"
        y1="5"
        x2="20"
        y2="2"
        stroke="#F5A623"
        strokeWidth="3"
        strokeLinecap="round"
        transform={`rotate(${angle} 20 20)`}
      />
    ))}
    {/* Sun Center */}
    <circle cx="20" cy="20" r="11" fill="#FFC93C" />
    <circle cx="20" cy="20" r="10.5" fill="#FFD966" />
    {/* Sweet Eyes */}
    <circle cx="16.5" cy="18.5" r="1.3" fill="#6A4900" />
    <circle cx="23.5" cy="18.5" r="1.3" fill="#6A4900" />
    {/* Rosy Cheeks */}
    <circle cx="14" cy="21.5" r="1.6" fill="#FFAA80" opacity="0.8" />
    <circle cx="26" cy="21.5" r="1.6" fill="#FFAA80" opacity="0.8" />
    {/* Smiling Mouth */}
    <path
      d="M17 21C18 23 22 23 23 21"
      stroke="#6A4900"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

// Cute 3D Smiling Star Character for "Today's Goal" (exact cute storybook star from reference)
export const CuteStarCharacter: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="starGlow" cx="45%" cy="38%" r="60%">
        <stop offset="0%" stopColor="#FFF5B8" />
        <stop offset="65%" stopColor="#FFD438" />
        <stop offset="100%" stopColor="#F5AE18" />
      </radialGradient>
      <filter id="softShadow" x="-15%" y="-10%" width="130%" height="125%">
        <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#C99214" floodOpacity="0.28" />
      </filter>
    </defs>
    
    {/* Chubby, rounded 5-point Star Body */}
    <path
      d="M 50 14 
         C 53 23, 58 33, 67 36 
         C 76 39, 87 42, 85 52 
         C 83 62, 72 66, 68 74 
         C 64 82, 63 92, 52 89 
         C 42 92, 40 82, 36 74 
         C 32 66, 21 62, 19 52 
         C 17 42, 28 39, 37 36 
         C 46 33, 47 23, 50 14 Z"
      fill="url(#starGlow)"
      filter="url(#softShadow)"
    />

    {/* Cheerful Eyes */}
    <ellipse cx="44" cy="46" rx="2.5" ry="3.5" fill="#4A3405" />
    <ellipse cx="58" cy="46" rx="2.5" ry="3.5" fill="#4A3405" />
    <circle cx="43" cy="45" r="1.1" fill="#FFFFFF" />
    <circle cx="57" cy="45" r="1.1" fill="#FFFFFF" />

    {/* Rosy Blushing Cheeks */}
    <ellipse cx="37" cy="51" rx="3.5" ry="2.2" fill="#FF8E72" opacity="0.85" />
    <ellipse cx="65" cy="51" rx="3.5" ry="2.2" fill="#FF8E72" opacity="0.85" />

    {/* Warm Happy Smile */}
    <path
      d="M45 51 C48 56 54 56 57 51"
      stroke="#4A3405"
      strokeWidth="2.2"
      strokeLinecap="round"
      fill="#D94E34"
    />
  </svg>
);

// Botanical Sprout with 3 organic leaves (for Your Progress & Sidebar)
export const SproutIcon: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-7 h-7',
  color = '#568469',
}) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
    aria-hidden="true"
  >
    {/* Left Leaf */}
    <path
      d="M16 22 C12 20 8 16 9 10 C14 10 16 16 16 22 Z"
      fill={color}
    />
    {/* Right Leaf */}
    <path
      d="M16 22 C18 18 24 14 24 8 C18 9 16 16 16 22 Z"
      fill={color}
      opacity="0.9"
    />
    {/* Center Little Sprout Leaf */}
    <path
      d="M16 22 C15 15 17 9 20 5 C21 9 18 16 16 22 Z"
      fill={color}
      opacity="0.8"
    />
  </svg>
);

// Playful "You can do it! 💚" annotation with curved arrow pointing to Today's Activities
export const HandwrittenEncouragement: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex flex-col items-end select-none pointer-events-none ${className}`}>
    <div className="font-bold text-[13px] text-[#568469] tracking-wide rotate-[-8deg] flex items-center gap-1 font-sans">
      <span>You can</span>
      <span className="block">do it!</span>
      <span className="text-xs">💚</span>
    </div>
    <svg
      width="44"
      height="36"
      viewBox="0 0 44 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mt-0.5 mr-2 text-[#568469]"
    >
      <path
        d="M36 4 C38 16 28 26 12 30"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="2 3"
      />
      <path
        d="M18 24 L10 30 L16 34"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  </div>
);

// Layered Rolling Landscape Hills - integrated seamlessly into the universal Footer component
export const RollingHillsFooter: React.FC<{ className?: string }> = () => null;

