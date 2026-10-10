import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  accent?: 'teal' | 'sage' | 'blue' | 'orange' | 'default';
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  accent = 'default',
  interactive = false,
  className = '',
  onClick,
  style
}) => {
  const accentClass =
    accent === 'teal'
      ? 'card-teal'
      : accent === 'sage'
      ? 'card-sage'
      : accent === 'blue'
      ? 'card-blue'
      : accent === 'orange'
      ? 'card-orange'
      : '';

  const interactiveClass = interactive ? 'interactive' : '';

  return (
    <div
      className={`card ${accentClass} ${interactiveClass} ${className}`.trim()}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive && onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      style={style}
    >
      {children}
    </div>
  );
};
