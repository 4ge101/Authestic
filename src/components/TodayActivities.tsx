import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Activity } from '../types';

interface TodayActivitiesProps {
  activities: Activity[];
  onStartActivity: (activity: Activity) => void;
  onViewAllActivities: () => void;
}

export const TodayActivities: React.FC<TodayActivitiesProps> = ({
  activities,
  onStartActivity,
  onViewAllActivities,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!activities || activities.length === 0) {
    return null;
  }

  const currentActivity = activities[currentIndex] || activities[0];

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < activities.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <section aria-labelledby="todays-activities-heading" className="relative">
      {/* Header Line */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#E2EBD9] flex items-center justify-center text-[#568469]">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <h3 id="todays-activities-heading" className="text-lg font-bold text-[#263831]">
            Today's Activities
          </h3>
        </div>

        <button
          type="button"
          onClick={onViewAllActivities}
          className="text-xs font-bold text-[#568469] hover:text-[#456C55] transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Wide, shallow horizontal surface + outside circular arrows */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Featured activity wide surface with flowing organic contour - NOT a conventional rectangular card */}
        <div className="relative flex-1 p-0 bg-transparent border-0 shadow-none rounded-none min-h-[110px] sm:min-h-[120px]">
          {/* Visible Organic Surface: Flowing custom SVG Bézier path */}
          <svg
            viewBox="0 0 860 140"
            className="absolute inset-0 w-full h-full overflow-visible drop-shadow-[0_2px_8px_rgba(38,56,49,0.05)] pointer-events-none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M 42,28 
                 C 160,14 360,22 560,14 
                 C 700,8 810,22 836,48 
                 C 852,70 848,98 824,116 
                 C 740,132 580,126 400,132 
                 C 240,138 100,128 42,120 
                 C 16,104 14,72 18,52 
                 C 22,38 28,30 42,28 Z"
              fill="#FFFDF8"
              stroke="#EAE7DF"
              strokeWidth="1.5"
            />
          </svg>

          {/* Foreground Content */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 py-4 px-6 sm:px-8 h-full">
            {/* Left: Thumbnail (Cute Fox Puzzle) */}
            <div className="w-full sm:w-28 md:w-32 h-20 sm:h-22 rounded-2xl overflow-hidden shrink-0 bg-[#F0EBDD] border border-[#EAE7DF]/70">
              <img
                src={currentActivity.thumbnail}
                alt={currentActivity.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Middle: Details */}
            <div className="flex-1 w-full min-w-0 text-center sm:text-left">
              <span className="text-[11px] font-bold text-[#568469] uppercase tracking-wider block mb-0.5">
                Play & Learn · Fine Motor
              </span>

              <h4 className="text-base sm:text-lg font-bold text-[#263831] leading-snug">
                {currentActivity.title}
              </h4>

              <p className="text-xs text-[#728078] leading-relaxed font-medium mt-0.5 max-w-lg line-clamp-2">
                {currentActivity.description}
              </p>
            </div>

            {/* Right: Pill Start button */}
            <div className="shrink-0 w-full sm:w-auto flex justify-center sm:justify-end">
              <button
                type="button"
                onClick={() => onStartActivity(currentActivity)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full bg-[#568469] hover:bg-[#456C55] active:scale-[0.98] text-[#FFFDF8] font-bold text-xs sm:text-sm shadow-2xs transition-all cursor-pointer"
              >
                <span>{currentActivity.completedSteps ? 'Resume' : 'Start'}</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Outside Circular Navigation Arrows */}
        {activities.length > 1 && (
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="w-9 h-9 rounded-full border border-[#EAE7DF] bg-[#FFFDF8] text-[#263831] hover:bg-[#F0EBDD] disabled:opacity-30 disabled:hover:bg-[#FFFDF8] transition-all flex items-center justify-center shadow-2xs cursor-pointer"
              aria-label="Previous activity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex === activities.length - 1}
              className="w-9 h-9 rounded-full border border-[#EAE7DF] bg-[#FFFDF8] text-[#263831] hover:bg-[#F0EBDD] disabled:opacity-30 disabled:hover:bg-[#FFFDF8] transition-all flex items-center justify-center shadow-2xs cursor-pointer"
              aria-label="Next activity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 3 Carousel Dots centered underneath */}
      <div className="flex items-center justify-center gap-1.5 mt-2.5">
        {activities.slice(0, 3).map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
              currentIndex === idx ? 'bg-[#568469] w-3.5' : 'bg-[#EAE7DF]'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
