import React, { useState } from 'react';
import { BookOpen, Sparkles, Clock, Play, CheckCircle2, ArrowRight } from 'lucide-react';
import { Activity } from '../types';
import { BentoCard } from '../components/OrganicShapes';
import { SproutIcon, RollingHillsFooter } from '../components/OrganicDecorative';

interface LearnPageProps {
  activities: Activity[];
  onStartActivity: (activity: Activity) => void;
}

export const LearnPage: React.FC<LearnPageProps> = ({ activities, onStartActivity }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Shapes', 'Reading', 'Communication', 'Routine'];

  const filtered = activities.filter((act) => {
    if (selectedCategory === 'All') return true;
    return act.tags.includes(selectedCategory) || act.category === selectedCategory;
  });

  const featuredActivity = activities.find((a) => a.id === 'act-puzzle-time') || activities[0];
  const secondaryActivities = activities.filter((a) => a.id !== featuredActivity.id);

  return (
    <div className="flex-1 flex flex-col justify-between">
      <main className="px-4 sm:px-8 lg:px-12 py-4 max-w-[1360px] mx-auto w-full z-10">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#568469] mb-2">
            <BookOpen className="w-4 h-4 text-[#568469]" />
            <span>Learning Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#263831] tracking-tight">
            Gentle Explorations & Lessons
          </h1>
          <p className="text-sm text-[#728078] mt-1 font-medium max-w-xl">
            Supportive activities crafted for curious young learners. Move at your own relaxed pace without timers, scores, or stress.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2.5 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#568469] text-white shadow-2xs'
                  : 'bg-[#FFFDF8] text-[#728078] hover:text-[#263831] hover:bg-[#F0EBDD] border border-[#EAE7DF]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Asymmetrical Bento Composition */}
        <div className="space-y-6 mb-8">
          {/* Top Bento Row: 8 cols Featured Lesson + 4 cols Daily Focus Bento */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Featured Interactive Lesson (8 cols) */}
            <div className="lg:col-span-8">
              <BentoCard
                variant="hero"
                className="p-6 sm:p-8 h-full flex flex-col justify-between group cursor-pointer"
                onClick={() => onStartActivity(featuredActivity)}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Left Illustrated Thumbnail */}
                  <div className="md:col-span-5 h-48 sm:h-56 rounded-3xl overflow-hidden bg-[#F0EBDD] border border-[#EAE7DF]/70 relative">
                    <img
                      src={featuredActivity.thumbnail}
                      alt={featuredActivity.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {featuredActivity.completed && (
                      <div className="absolute top-3 right-3 bg-[#568469] text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </div>
                    )}
                  </div>

                  {/* Right Details */}
                  <div className="md:col-span-7">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#568469] uppercase tracking-wider mb-2">
                      <span>Featured Lesson</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-[#728078] normal-case">
                        <Clock className="w-3.5 h-3.5" />
                        {featuredActivity.durationMinutes} mins
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#263831] mb-2 leading-tight group-hover:text-[#568469] transition-colors">
                      {featuredActivity.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-[#728078] leading-relaxed font-medium mb-4">
                      {featuredActivity.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-5 p-3 rounded-2xl bg-[#F0EBDD]/50 border border-[#EAE7DF]/80">
                      <div className="flex items-center justify-between text-xs font-bold text-[#263831] mb-1.5">
                        <span>Current Progress</span>
                        <span className="text-[#568469]">
                          {featuredActivity.completedSteps ?? 0} of {featuredActivity.totalSteps ?? 4} steps completed
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#EAE7DF] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#568469] transition-all"
                          style={{
                            width: `${((featuredActivity.completedSteps ?? 0) / (featuredActivity.totalSteps || 1)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartActivity(featuredActivity);
                      }}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#568469] hover:bg-[#456C55] text-white font-bold text-xs sm:text-sm shadow-2xs transition-all cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>{featuredActivity.completedSteps ? 'Resume Lesson' : 'Start Lesson'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </BentoCard>
            </div>

            {/* Daily Learning Focus (4 cols) */}
            <div className="lg:col-span-4">
              <BentoCard
                variant="soft-cream"
                className="p-6 sm:p-7 h-full flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-9 h-9 rounded-2xl bg-[#E2EBD9] flex items-center justify-center text-[#568469]">
                      <SproutIcon className="w-6 h-6" color="#568469" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#728078] uppercase tracking-wider block">
                        Today's Focus
                      </span>
                      <h3 className="font-bold text-base text-[#263831]">
                        Predictable Exploration
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#728078] leading-relaxed mb-4 font-medium">
                    Young autistic children thrive on predictable routines. Lessons in Eshal have no hidden surprises or timed penalties.
                  </p>

                  <div className="space-y-2 text-xs text-[#263831]">
                    <div className="p-3 rounded-2xl bg-[#FFFDF8] border border-[#E4DEC9] flex items-center gap-2.5">
                      <span className="text-base">🧩</span>
                      <span className="font-semibold">Hands-on tactile puzzle pieces</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#FFFDF8] border border-[#E4DEC9] flex items-center gap-2.5">
                      <span className="text-base">🍃</span>
                      <span className="font-semibold">Soft chime audio rewards</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E4DEC9] text-[11px] text-[#568469] font-bold">
                  Take small steps every day 💚
                </div>
              </BentoCard>
            </div>
          </div>

          {/* Lower Bento Grid: Asymmetrical Cards for Remaining Lessons */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {secondaryActivities.map((act, index) => {
              // Asymmetrical column widths: alternate 7 and 5 cols, or 6 and 6 cols
              const colSpan = index === 0 ? 'md:col-span-7' : index === 1 ? 'md:col-span-5' : 'md:col-span-6';
              const cardVariant = index % 2 === 0 ? 'featured' : 'companion';

              return (
                <div key={act.id} className={colSpan}>
                  <BentoCard
                    variant={cardVariant}
                    className="p-6 h-full flex flex-col justify-between group cursor-pointer"
                    onClick={() => onStartActivity(act)}
                  >
                    <div>
                      <div className="flex flex-col sm:flex-row gap-5 items-center mb-4">
                        <div className="w-full sm:w-36 h-28 rounded-2xl overflow-hidden bg-[#F0EBDD] border border-[#EAE7DF] shrink-0">
                          <img
                            src={act.thumbnail}
                            alt={act.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-[11px] font-bold text-[#568469] uppercase tracking-wider mb-1">
                            <span>{act.category}</span>
                            <span>·</span>
                            <span className="text-[#728078] normal-case">{act.durationMinutes} mins</span>
                          </div>
                          <h3 className="text-lg font-bold text-[#263831] mb-1 group-hover:text-[#568469] transition-colors leading-snug">
                            {act.title}
                          </h3>
                          <p className="text-xs text-[#728078] leading-relaxed font-medium">
                            {act.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#EAE7DF] flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#728078]">
                        {act.completedSteps ? `${act.completedSteps}/${act.totalSteps} steps completed` : 'Self-paced lesson'}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartActivity(act);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#568469] hover:bg-[#456C55] text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>{act.completedSteps ? 'Resume' : 'Start'}</span>
                      </button>
                    </div>
                  </BentoCard>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <RollingHillsFooter className="-mt-6" />
    </div>
  );
};
