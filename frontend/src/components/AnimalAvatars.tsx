import React from 'react';

interface AnimalAvatarProps {
  id: 'otter' | 'owl' | 'fox' | 'turtle' | 'bear' | 'dolphin' | string;
  size?: number;
  className?: string;
  showBg?: boolean;
}

export const AnimalAvatar: React.FC<AnimalAvatarProps> = ({
  id,
  size = 48,
  className = '',
  showBg = true
}) => {
  const bgColors: Record<string, string> = {
    otter: '#EEF6F5',
    owl: '#F3F8F5',
    fox: '#FAF2EA',
    turtle: '#E6EFF7',
    bear: '#F5EFE6',
    dolphin: '#E6EFF7'
  };

  const borderColors: Record<string, string> = {
    otter: '#B6D6D1',
    owl: '#C6E0D0',
    fox: '#FEDCB0',
    turtle: '#BCE1F8',
    bear: '#DECBB6',
    dolphin: '#BCE1F8'
  };

  const bg = bgColors[id] || '#EEF6F5';
  const border = borderColors[id] || '#B6D6D1';

  return (
    <div
      className={`animal-avatar-container ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: showBg ? bg : 'transparent',
        border: showBg ? `2px solid ${border}` : 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0
      }}
      aria-label={`${id} companion`}
    >
      <svg
        width={size * 0.75}
        height={size * 0.75}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {id === 'otter' && (
          <g id="otter-art">
            {/* Otter ears */}
            <circle cx="15" cy="18" r="5" fill="#5D9C94" />
            <circle cx="33" cy="18" r="5" fill="#5D9C94" />
            <circle cx="15" cy="18" r="2.5" fill="#DDEBE2" />
            <circle cx="33" cy="18" r="2.5" fill="#DDEBE2" />
            {/* Otter head */}
            <circle cx="24" cy="25" r="14" fill="#5D9C94" />
            {/* Otter muzzle */}
            <ellipse cx="24" cy="28" rx="8" ry="6" fill="#F9F8F5" />
            {/* Eyes */}
            <circle cx="19" cy="23" r="2" fill="#243447" />
            <circle cx="29" cy="23" r="2" fill="#243447" />
            <circle cx="18.5" cy="22.5" r="0.6" fill="#FFFFFF" />
            <circle cx="28.5" cy="22.5" r="0.6" fill="#FFFFFF" />
            {/* Nose & mouth */}
            <ellipse cx="24" cy="27" rx="2.5" ry="1.8" fill="#243447" />
            <path d="M22 30 Q24 32 26 30" stroke="#243447" strokeWidth="1.2" strokeLinecap="round" />
            {/* Whiskers */}
            <line x1="14" y1="28" x2="9" y2="27" stroke="#243447" strokeWidth="1" strokeLinecap="round" />
            <line x1="14" y1="30" x2="8" y2="31" stroke="#243447" strokeWidth="1" strokeLinecap="round" />
            <line x1="34" y1="28" x2="39" y2="27" stroke="#243447" strokeWidth="1" strokeLinecap="round" />
            <line x1="34" y1="30" x2="40" y2="31" stroke="#243447" strokeWidth="1" strokeLinecap="round" />
          </g>
        )}

        {id === 'owl' && (
          <g id="owl-art">
            {/* Owl ear tufts */}
            <path d="M14 15 L18 8 L22 17 Z" fill="#417558" />
            <path d="M34 15 L30 8 L26 17 Z" fill="#417558" />
            {/* Owl head & body */}
            <circle cx="24" cy="25" r="14" fill="#417558" />
            {/* Eye discs */}
            <circle cx="18" cy="23" r="6" fill="#F9F8F5" />
            <circle cx="30" cy="23" r="6" fill="#F9F8F5" />
            {/* Pupils */}
            <circle cx="18" cy="23" r="2.8" fill="#243447" />
            <circle cx="30" cy="23" r="2.8" fill="#243447" />
            <circle cx="17.2" cy="22.2" r="0.8" fill="#FFFFFF" />
            <circle cx="29.2" cy="22.2" r="0.8" fill="#FFFFFF" />
            {/* Beak */}
            <polygon points="24,25 21,30 27,30" fill="#E8AC72" />
            {/* Chest feathers pattern */}
            <path d="M21 34 Q24 36 27 34" stroke="#DDEBE2" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M22 37 Q24 39 26 37" stroke="#DDEBE2" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </g>
        )}

        {id === 'fox' && (
          <g id="fox-art">
            {/* Fox ears */}
            <polygon points="12,22 15,9 23,20" fill="#D98236" />
            <polygon points="14,20 16,12 21,19" fill="#F9F8F5" />
            <polygon points="36,22 33,9 25,20" fill="#D98236" />
            <polygon points="34,20 32,12 27,19" fill="#F9F8F5" />
            {/* Head */}
            <polygon points="24,37 11,21 37,21" fill="#D98236" />
            {/* White cheeks */}
            <polygon points="24,37 11,21 17,31" fill="#F9F8F5" />
            <polygon points="24,37 37,21 31,31" fill="#F9F8F5" />
            {/* Eyes */}
            <ellipse cx="19" cy="23" rx="1.8" ry="2.2" fill="#243447" />
            <ellipse cx="29" cy="23" rx="1.8" ry="2.2" fill="#243447" />
            <circle cx="18.5" cy="22.3" r="0.6" fill="#FFFFFF" />
            <circle cx="28.5" cy="22.3" r="0.6" fill="#FFFFFF" />
            {/* Nose */}
            <circle cx="24" cy="36" r="2" fill="#243447" />
          </g>
        )}

        {id === 'turtle' && (
          <g id="turtle-art">
            {/* Flippers */}
            <ellipse cx="12" cy="18" rx="4" ry="7" fill="#417558" transform="rotate(-30 12 18)" />
            <ellipse cx="36" cy="18" rx="4" ry="7" fill="#417558" transform="rotate(30 36 18)" />
            <ellipse cx="14" cy="33" rx="3.5" ry="5.5" fill="#417558" transform="rotate(35 14 33)" />
            <ellipse cx="34" cy="33" rx="3.5" ry="5.5" fill="#417558" transform="rotate(-35 34 33)" />
            {/* Shell */}
            <circle cx="24" cy="26" r="13" fill="#5D9C94" />
            <circle cx="24" cy="26" r="9" fill="#417558" stroke="#DDEBE2" strokeWidth="1.5" />
            {/* Shell markings */}
            <path d="M24 17 L24 35 M15 26 L33 26" stroke="#DDEBE2" strokeWidth="1.2" />
            {/* Head */}
            <circle cx="24" cy="12" r="5.5" fill="#417558" />
            {/* Eyes */}
            <circle cx="21.5" cy="11.5" r="1.3" fill="#243447" />
            <circle cx="26.5" cy="11.5" r="1.3" fill="#243447" />
            <circle cx="21" cy="11" r="0.4" fill="#FFFFFF" />
            <circle cx="26" cy="11" r="0.4" fill="#FFFFFF" />
            {/* Smile */}
            <path d="M22.5 14 Q24 15 25.5 14" stroke="#243447" strokeWidth="0.8" strokeLinecap="round" />
          </g>
        )}

        {id === 'bear' && (
          <g id="bear-art">
            {/* Bear ears */}
            <circle cx="14" cy="16" r="5" fill="#874E18" />
            <circle cx="34" cy="16" r="5" fill="#874E18" />
            <circle cx="14" cy="16" r="2.8" fill="#E8AC72" />
            <circle cx="34" cy="16" r="2.8" fill="#E8AC72" />
            {/* Head */}
            <circle cx="24" cy="25" r="13.5" fill="#874E18" />
            {/* Snout */}
            <ellipse cx="24" cy="29" rx="7" ry="5.5" fill="#E8AC72" />
            {/* Nose */}
            <ellipse cx="24" cy="27" rx="2.8" ry="2" fill="#243447" />
            <path d="M22 30 Q24 32 26 30" stroke="#243447" strokeWidth="1.2" strokeLinecap="round" />
            {/* Eyes */}
            <circle cx="18" cy="22" r="1.8" fill="#243447" />
            <circle cx="30" cy="22" r="1.8" fill="#243447" />
            <circle cx="17.5" cy="21.5" r="0.5" fill="#FFFFFF" />
            <circle cx="29.5" cy="21.5" r="0.5" fill="#FFFFFF" />
          </g>
        )}

        {id === 'dolphin' && (
          <g id="dolphin-art">
            {/* Body */}
            <path
              d="M10 28 C12 18, 22 14, 34 19 C38 21, 41 24, 42 27 C38 26, 32 25, 27 28 C20 32, 14 34, 10 28 Z"
              fill="#0284C7"
            />
            {/* Dorsal fin */}
            <path d="M22 16 C23 11, 26 10, 29 13 C27 15, 25 16, 22 16 Z" fill="#0284C7" />
            {/* Belly highlight */}
            <path
              d="M12 28 C18 31, 24 31, 30 28 C34 26, 38 26, 42 27 C38 29, 32 32, 26 33 C18 34, 14 32, 12 28 Z"
              fill="#E6EFF7"
            />
            {/* Eye */}
            <circle cx="36" cy="22" r="1.6" fill="#243447" />
            <circle cx="35.5" cy="21.5" r="0.5" fill="#FFFFFF" />
            {/* Beak / mouth smile */}
            <path d="M38 25 Q40 26 42 25" stroke="#243447" strokeWidth="1" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </div>
  );
};
