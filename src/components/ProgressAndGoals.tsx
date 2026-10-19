import React, { useRef, useEffect } from 'react';
import { Check } from 'lucide-react';
import { DailyGoal, LearningProgress } from '../types';
import { SproutIcon, CuteStarCharacter } from './OrganicDecorative';
import { setupCalmFloat } from '../utils/gsapMotion';

interface ProgressAndGoalsProps {
  progress: LearningProgress;
  goals: DailyGoal[];
  onToggleGoal: (goalId: string) => void;
}

export const ProgressAndGoals: React.FC<ProgressAndGoalsProps> = ({
  progress,
  goals,
  onToggleGoal,
}) => {
  const starRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cleanup = setupCalmFloat(starRef.current, {
      y: 4,
      rotation: 2.5,
      duration: 3.6,
    });
    return cleanup;
  }, []);
  return (
    <section 
      aria-label="Progress and today's goals"
      className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-8 items-center"
    >
      {/* Left: Your Progress with a subtle, asymmetric organic background surface */}
      <div className="md:col-span-6 relative flex flex-col justify-between p-6 sm:p-7 min-h-[140px] sm:min-h-[150px] w-full">
        {/* Subtle, asymmetric organic SVG background surface - NOT a generic rounded rectangle */}
        <svg
          viewBox="0 0 500 170"
          className="absolute inset-0 w-full h-full overflow-visible drop-shadow-[0_2px_6px_rgba(38,56,49,0.04)] pointer-events-none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M 32,36 
               C 85,16 160,22 250,16 
               C 340,10 425,18 474,38 
               C 504,50 508,82 492,118 
               C 476,146 420,158 340,156 
               C 240,154 150,162 82,152 
               C 28,144 8,118 10,76 
               C 12,48 18,40 32,36 Z"
            fill="#F0EBDD"
            stroke="#E4DEC9"
            strokeWidth="1.2"
          />
        </svg>

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="flex items-center gap-3.5 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E2EBD9] flex items-center justify-center text-[#568469] shrink-0">
              <SproutIcon className="w-6 h-6" color="#568469" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#263831]">
                Your Progress
              </h3>
              <p className="text-xs text-[#728078] font-medium">
                Keep going! You're doing great!
              </p>
            </div>
          </div>

          {/* Progress Bar & Counter */}
          <div className="flex items-center gap-3.5 mt-2">
            <div className="flex-1 h-3 rounded-full bg-[#EAE7DF] overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-[#568469] transition-all duration-500 ease-out"
                style={{
                  width: `${Math.min(100, Math.max(0, (progress.completedCount / progress.totalAssigned) * 100))}%`,
                }}
                role="progressbar"
                aria-valuenow={progress.completedCount}
                aria-valuemin={0}
                aria-valuemax={progress.totalAssigned}
              />
            </div>
            <span className="text-xs font-bold text-[#263831] shrink-0">
              {progress.completedCount} / {progress.totalAssigned}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Today's Goal - Visually open without a heavy rectangular card box */}
      <div className="md:col-span-6 flex items-center gap-4 sm:gap-6 p-3 sm:p-5 bg-transparent border-0 shadow-none">
        {/* Cute 3D Smiling Star Character floating freely */}
        <div ref={starRef} className="shrink-0 transition-transform hover:scale-105 duration-200">
          <CuteStarCharacter className="w-16 h-16 sm:w-20 sm:h-20" />
        </div>

        {/* Goal Checklist floating openly on the ivory canvas */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base text-[#263831] mb-2.5">
            Today's Goal
          </h3>

          <div className="space-y-2">
            {goals.map((goal) => (
              <button
                key={goal.id}
                type="button"
                onClick={() => onToggleGoal(goal.id)}
                className="w-full text-left flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#263831] hover:text-[#568469] transition-colors cursor-pointer group"
                aria-label={`${goal.title}, ${goal.completed ? 'completed' : 'not completed'}. Tap to toggle.`}
              >
                {goal.completed ? (
                  <span className="w-4 h-4 rounded-full bg-[#568469] text-white flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-[#8E9B93] shrink-0 group-hover:border-[#568469]" />
                )}
                <span className={goal.completed ? 'text-[#263831]' : 'text-[#728078]'}>
                  {goal.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
