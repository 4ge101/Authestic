import React from 'react';

/**
 * Organic Shape System for Little Steps
 * Genuine art-directed Bézier curves with natural asymmetrical contours,
 * shallow dips, offset crests, and rolling landscape waves.
 * NEVER simple ovals, stretched ellipses, or uniform border-radii.
 */

interface OrganicShapeProps {
  className?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  children?: React.ReactNode;
}

// 1. Hero Landscape Bottom Rolling Hill Wave (as seen in the reference image)
// Starts higher on the left, dips smoothly across the center, and slopes softly to the right
export const HeroHillMaskPath: React.FC = () => (
  <svg width="0" height="0" className="absolute">
    <defs>
      <clipPath id="heroHillClip" clipPathUnits="objectBoundingBox">
        {/* A flowing landscape with a curved, rolling bottom edge */}
        <path d="M 0,0 
                 L 1,0 
                 L 1,0.82 
                 C 0.84,0.87 0.66,0.76 0.48,0.85 
                 C 0.32,0.94 0.16,0.91 0,0.83 
                 Z" />
      </clipPath>
    </defs>
  </svg>
);

// 2. "Your Progress" Organic Cream Patch
// Sits under progress content: shallow dip on top-left, gentle crest on top-right, soft organic bottom
export const ProgressOrganicPatch: React.FC<OrganicShapeProps> = ({
  className = '',
  fill = '#F0EBDD',
  children,
}) => (
  <div 
    className={`relative ${className}`}
    style={{
      borderRadius: '44px 30px 48px 34px / 34px 50px 36px 54px',
    }}
  >
    <svg
      viewBox="0 0 540 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-2xs"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M 36 42 
           C 70 20, 130 16, 210 24 
           C 270 30, 340 18, 430 14 
           C 490 12, 532 36, 536 78 
           C 540 122, 505 158, 440 164 
           C 350 172, 240 156, 140 166 
           C 65 174, 18 148, 12 98 
           C 8 58, 16 48, 36 42 Z"
        fill={fill}
      />
    </svg>
    <div className="relative z-10">{children}</div>
  </div>
);

// 3. Quick Action Organic Shapes (4 uniquely different contour families)

// Learn: True asymmetric botanical leaf with gentle pointed apex, concave dip, and plump rounded base
export const QuickActionLearnShape: React.FC<OrganicShapeProps> = ({
  className = '',
  fill = '#E2EBD9',
  children,
}) => (
  <div className={`relative ${className}`}>
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M 76 14 
           C 88 26, 92 56, 82 78 
           C 72 94, 38 98, 20 84 
           C 6 72, 8 46, 22 28 
           C 34 14, 60 4, 76 14 Z"
        fill={fill}
      />
    </svg>
    <div className="relative z-10 flex items-center justify-center w-full h-full">{children}</div>
  </div>
);

// Play: Asymmetric 4-lobed cloud/pebble with unequal lobes and indented dips
export const QuickActionPlayShape: React.FC<OrganicShapeProps> = ({
  className = '',
  fill = '#F7E5B5',
  children,
}) => (
  <div className={`relative ${className}`}>
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M 34 14 
           C 52 8, 70 14, 82 24 
           C 94 36, 96 60, 84 78 
           C 72 94, 46 96, 28 90 
           C 12 84, 6 62, 10 44 
           C 14 26, 20 18, 34 14 Z"
        fill={fill}
      />
    </svg>
    <div className="relative z-10 flex items-center justify-center w-full h-full">{children}</div>
  </div>
);

// Communication: Organic conversation droplet with soft conversational tail bump
export const QuickActionCommShape: React.FC<OrganicShapeProps> = ({
  className = '',
  fill = '#DCE8EE',
  children,
}) => (
  <div className={`relative ${className}`}>
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M 46 12 
           C 72 10, 92 28, 92 52 
           C 92 74, 76 90, 52 92 
           C 32 94, 14 88, 12 70 
           C 10 52, 18 32, 28 20 
           C 34 14, 40 12, 46 12 Z"
        fill={fill}
      />
    </svg>
    <div className="relative z-10 flex items-center justify-center w-full h-full">{children}</div>
  </div>
);

// Resources: Warm botanical seed / organic heart contour with gentle top notch
export const QuickActionResourceShape: React.FC<OrganicShapeProps> = ({
  className = '',
  fill = '#F5DBD0',
  children,
}) => (
  <div className={`relative ${className}`}>
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M 50 20 
           C 62 10, 84 12, 90 32 
           C 96 54, 84 78, 62 90 
           C 48 96, 36 92, 22 80 
           C 8 68, 6 44, 16 26 
           C 24 12, 40 12, 50 20 Z"
        fill={fill}
      />
    </svg>
    <div className="relative z-10 flex items-center justify-center w-full h-full">{children}</div>
  </div>
);

// 4. Featured Activity Flowing Surface (Wide, flowing asymmetrical horizontal contour)
export const FeaturedActivityOrganicSurface: React.FC<OrganicShapeProps> = ({
  className = '',
  fill = '#FFFDF8',
  children,
}) => (
  <div 
    className={`relative ${className}`}
    style={{
      borderRadius: '36px 56px 30px 48px / 48px 32px 52px 36px',
    }}
  >
    <svg
      viewBox="0 0 840 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-2xs"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M 46 18 
           C 160 8, 360 16, 580 10 
           C 720 6, 810 22, 824 58 
           C 836 94, 804 136, 730 140 
           C 560 148, 320 138, 140 144 
           C 50 148, 12 124, 14 78 
           C 16 38, 22 22, 46 18 Z"
        fill={fill}
        stroke="#EAE7DF"
        strokeWidth="1.5"
      />
    </svg>
    <div className="relative z-10">{children}</div>
  </div>
);

// 5. Four Distinct Explore Destination Shapes
// Stories: Asymmetric rolling hill silhouette with a gentle raised crest on right
export const ExploreStoriesShape: React.FC<OrganicShapeProps> = ({
  className = '',
  fill = '#FDE8BE',
  children,
}) => (
  <div 
    className={`relative ${className}`}
    style={{
      borderRadius: '34px 50px 28px 42px / 44px 30px 48px 36px',
    }}
  >
    <svg
      viewBox="0 0 180 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full pointer-events-none transition-transform group-hover:scale-[1.03]"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M 24 38 
           C 54 18, 110 12, 156 26 
           C 176 38, 178 72, 160 98 
           C 138 116, 68 118, 26 104 
           C 8 92, 6 56, 24 38 Z"
        fill={fill}
      />
    </svg>
    <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">{children}</div>
  </div>
);

// Games: Soft cloud silhouette with varied natural lobes
export const ExploreGamesShape: React.FC<OrganicShapeProps> = ({
  className = '',
  fill = '#D5E4EC',
  children,
}) => (
  <div 
    className={`relative ${className}`}
    style={{
      borderRadius: '44px 32px 46px 28px / 32px 46px 34px 48px',
    }}
  >
    <svg
      viewBox="0 0 180 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full pointer-events-none transition-transform group-hover:scale-[1.03]"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M 36 22 
           C 66 12, 120 12, 154 30 
           C 174 48, 172 82, 148 102 
           C 118 118, 54 116, 24 98 
           C 6 82, 10 40, 36 22 Z"
        fill={fill}
      />
    </svg>
    <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">{children}</div>
  </div>
);

// Life Skills: Offset crest with a shallow natural slope
export const ExploreLifeSkillsShape: React.FC<OrganicShapeProps> = ({
  className = '',
  fill = '#FDE2C8',
  children,
}) => (
  <div 
    className={`relative ${className}`}
    style={{
      borderRadius: '30px 48px 36px 44px / 46px 28px 44px 38px',
    }}
  >
    <svg
      viewBox="0 0 180 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full pointer-events-none transition-transform group-hover:scale-[1.03]"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M 28 24 
           C 64 12, 130 14, 162 38 
           C 178 58, 170 90, 144 106 
           C 112 118, 48 114, 20 94 
           C 4 76, 6 42, 28 24 Z"
        fill={fill}
      />
    </svg>
    <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">{children}</div>
  </div>
);

// Sensory: Organic natural leaf/meadow mound
export const ExploreSensoryShape: React.FC<OrganicShapeProps> = ({
  className = '',
  fill = '#DDE9D7',
  children,
}) => (
  <div 
    className={`relative ${className}`}
    style={{
      borderRadius: '40px 30px 44px 36px / 32px 46px 36px 48px',
    }}
  >
    <svg
      viewBox="0 0 180 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full pointer-events-none transition-transform group-hover:scale-[1.03]"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M 24 28 
           C 58 14, 122 16, 158 36 
           C 176 56, 170 88, 148 104 
           C 120 118, 52 116, 22 98 
           C 6 82, 4 48, 24 28 Z"
        fill={fill}
      />
    </svg>
    <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">{children}</div>
  </div>
);

// 6. Generic Versatile Asymmetrical Bento Card for Content Pages
// Provides varied organic silhouettes so cards don't look like identical rectangles
export interface BentoCardProps {
  variant?: 'hero' | 'companion' | 'featured' | 'soft-cream' | 'honey' | 'sage';
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  variant = 'featured',
  className = '',
  children,
  onClick,
}) => {
  // Curated non-uniform multi-corner radii for authentic organic bento aesthetics
  const radiiMap = {
    hero: '38px 58px 32px 48px / 52px 34px 54px 38px',
    companion: '44px 28px 46px 34px / 34px 48px 36px 50px',
    featured: '36px 54px 30px 46px / 48px 32px 50px 36px',
    'soft-cream': '42px 32px 46px 28px / 32px 48px 36px 50px',
    honey: '36px 48px 30px 44px / 46px 34px 50px 36px',
    sage: '32px 46px 38px 28px / 44px 36px 48px 34px',
  };

  const bgMap = {
    hero: 'bg-[#FFFDF8]',
    companion: 'bg-[#FFFDF8]',
    featured: 'bg-[#FFFDF8]',
    'soft-cream': 'bg-[#F0EBDD]',
    honey: 'bg-[#FFFBF2]',
    sage: 'bg-[#F7FAF5]',
  };

  const borderMap = {
    hero: 'border-[#EAE7DF]',
    companion: 'border-[#EAE7DF]',
    featured: 'border-[#EAE7DF]',
    'soft-cream': 'border-[#E4DEC9]',
    honey: 'border-[#F4E3BF]',
    sage: 'border-[#D9E6D3]',
  };

  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: radiiMap[variant],
      }}
      className={`relative border ${borderMap[variant]} ${bgMap[variant]} shadow-2xs transition-all duration-300 ease-out hover:shadow-xs ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
