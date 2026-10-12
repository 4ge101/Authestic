import React from 'react';

export type GameTokenType =
  | 'circle'
  | 'square'
  | 'triangle'
  | 'diamond'
  | 'leaf'
  | 'water'
  | 'sun'
  | 'pebble';

interface GameTokenProps {
  type: GameTokenType;
  size?: number;
  color?: string;
  className?: string;
  ariaLabel?: string;
}

export const GameToken: React.FC<GameTokenProps> = ({
  type,
  size = 32,
  color,
  className = '',
  ariaLabel
}) => {
  const defaultColors: Record<GameTokenType, string> = {
    circle: '#0284C7',
    square: '#D97706',
    triangle: '#417558',
    diamond: '#0D8276',
    leaf: '#417558',
    water: '#0284C7',
    sun: '#D97706',
    pebble: '#637587'
  };

  const fill = color || defaultColors[type] || '#0D8276';

  return (
    <span
      className={`game-token-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        flexShrink: 0
      }}
      role="img"
      aria-label={ariaLabel || `${type} token`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {type === 'circle' && (
          <circle cx="16" cy="16" r="12" fill={fill} stroke="#243447" strokeWidth="1.5" />
        )}

        {type === 'square' && (
          <rect
            x="5"
            y="5"
            width="22"
            height="22"
            rx="4"
            fill={fill}
            stroke="#243447"
            strokeWidth="1.5"
          />
        )}

        {type === 'triangle' && (
          <polygon
            points="16,5 27,25 5,25"
            fill={fill}
            stroke="#243447"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        )}

        {type === 'diamond' && (
          <polygon
            points="16,4 27,16 16,28 5,16"
            fill={fill}
            stroke="#243447"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        )}

        {type === 'leaf' && (
          <path
            d="M8 24 C8 14, 18 8, 25 7 C25 15, 19 25, 8 24 Z M8 24 L17 15"
            fill={fill}
            stroke="#243447"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        )}

        {type === 'water' && (
          <path
            d="M16 6 C16 6, 8 16, 8 21 C8 25.4 11.6 29 16 29 C20.4 29 24 25.4 24 21 C24 16, 16 6, 16 6 Z"
            fill={fill}
            stroke="#243447"
            strokeWidth="1.5"
          />
        )}

        {type === 'sun' && (
          <g>
            <circle cx="16" cy="16" r="7" fill={fill} stroke="#243447" strokeWidth="1.5" />
            <line x1="16" y1="3" x2="16" y2="6" stroke="#243447" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="16" y1="26" x2="16" y2="29" stroke="#243447" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="3" y1="16" x2="6" y2="16" stroke="#243447" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="26" y1="16" x2="29" y2="16" stroke="#243447" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}

        {type === 'pebble' && (
          <ellipse
            cx="16"
            cy="16"
            rx="11"
            ry="9"
            fill={fill}
            stroke="#243447"
            strokeWidth="1.5"
          />
        )}
      </svg>
    </span>
  );
};
