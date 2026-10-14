import React from 'react';
import { BarChart2, CheckCircle2, Circle, Leaf, Star, Sparkles, Check, ArrowRight } from 'lucide-react';
import { DailyGoal, LearningProgress, Activity } from '../types';
import { BentoCard } from '../components/OrganicShapes';
import { SproutIcon, CuteStarCharacter, RollingHillsFooter } from '../components/OrganicDecorative';

interface ProgressPageProps {
  progress: LearningProgress;
  goals: DailyGoal[];
  activities: Activity[];
  onToggleGoal: (goalId: string) => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({
  progress,
  goals,
  activities,
  onToggleGoal,
}) => {
  const completedActivities = activities.filter((a) => a.completed);

  return (
    <div className="flex-1 flex flex-col justify-between">
      <main className="px-4 sm:px-8 lg:px-12 py-4 max-w-[1360px] mx-auto w-full z-10">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#568469] mb-2">
            <BarChart2 className="w-4 h-4 text-[#568469]" />
            <span>Progress & Milestones</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#263831] tracking-tight">
            Your Gentle Learning Journey
          </h1>
          <p className="text-sm text-[#728078] mt-1 font-medium max-w-xl">
            Track meaningful daily steps at your own pace. No competitive scores, timers, or streaks—just calm, celebratory growth.
          </p>
        </div>

        {/* Bento Composition */}
        <div className="space-y-6 mb-8">
          {/* Top Row: 7 cols Progress Overview + 5 cols Goals with Star */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Progress Overview (7 cols) */}
            <div className="lg:col-span-7">
              <BentoCard
                variant="hero"
                className="p-6 sm:p-8 h-full flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#E2EBD9] flex items-center justify-center text-[#568469]">
                        <SproutIcon className="w-6 h-6" color="#568469" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-[#263831]">
                          Weekly Progress Journey
                        </h2>
                        <span className="text-xs font-semibold text-[#568469]">
                          {progress.currentMilestone}
                        </span>
                      </div>
                    </div>

                    <span className="text-2xl font-black text-[#568469]">
                      {progress.overallPercentage}%
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#728078] leading-relaxed mb-6 font-medium">
                    {progress.encouragingMessage}
                  </p>

                  {/* Progress Bar */}
                  <div className="p-4 rounded-2xl bg-[#F0EBDD]/60 border border-[#EAE7DF] mb-4">
                    <div className="flex items-center justify-between text-xs font-bold text-[#263831] mb-2">
                      <span>Daily Steps Completed</span>
                      <span className="text-[#568469]">
                        {progress.completedCount} of {progress.totalAssigned} steps
                      </span>
                    </div>
                    <div className="w-full h-3.5 rounded-full bg-[#EAE7DF] overflow-hidden p-0.5">
                      <div
                        className="h-full rounded-full bg-[#568469] transition-all duration-700 ease-out"
                        style={{ width: `${progress.overallPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EAE7DF] flex items-center justify-between text-xs text-[#728078] font-medium">
                  <span>Every step is celebrated</span>
                  <span className="text-[#568469] font-bold">Small steps make big progress 💚</span>
                </div>
              </BentoCard>
            </div>

            {/* Today's Goals with Cute Smiling Star (5 cols) */}
            <div className="lg:col-span-5">
              <BentoCard
                variant="soft-cream"
                className="p-6 sm:p-7 h-full flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-[#263831]">
                        Today's Goals
                      </h2>
                      <span className="text-xs text-[#728078] font-medium">
                        {goals.filter((g) => g.completed).length} of {goals.length} completed
                      </span>
                    </div>
                    <CuteStarCharacter className="w-14 h-14 -mt-2 -mr-1" />
                  </div>

                  <div className="space-y-2.5">
                    {goals.map((goal) => (
                      <button
                        key={goal.id}
                        type="button"
                        onClick={() => onToggleGoal(goal.id)}
                        className="w-full text-left p-3 rounded-2xl bg-[#FFFDF8] hover:bg-[#FFFDF8]/90 border border-[#E4DEC9] transition-all flex items-start gap-3 cursor-pointer group shadow-2xs"
                      >
                        {goal.completed ? (
                          <span className="w-5 h-5 rounded-full bg-[#568469] text-white flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        ) : (
                          <span className="w-5 h-5 rounded-full border-2 border-[#8E9B93] shrink-0 mt-0.5 group-hover:border-[#568469]" />
                        )}
                        <div>
                          <span className={`text-xs font-bold block ${goal.completed ? 'line-through text-[#728078]' : 'text-[#263831]'}`}>
                            {goal.title}
                          </span>
                          <span className="text-[11px] text-[#728078] font-medium">
                            {goal.description}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E4DEC9] text-[11px] text-[#568469] font-bold">
                  Tap to check off anytime 🌟
                </div>
              </BentoCard>
            </div>
          </div>

          {/* Lower Bento: Activities Explorer Log */}
          <BentoCard variant="companion" className="p-6 sm:p-8">
            <h2 className="text-lg font-bold text-[#263831] mb-2">
              Activities Explorer Log
            </h2>
            <p className="text-xs text-[#728078] font-medium mb-5">
              Review what Sam has engaged with today. Celebrate curiosity and effort over scores.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center gap-3.5 ${
                    act.completed
                      ? 'bg-[#E2EBD9]/50 border-[#568469]/30'
                      : 'bg-[#FFFDF8] border-[#EAE7DF]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                    act.completed ? 'bg-[#568469] text-white' : 'bg-[#F0EBDD] text-[#728078]'
                  }`}>
                    {act.completed ? '✓' : '○'}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#263831]">{act.title}</h3>
                    <p className="text-[11px] text-[#728078] font-medium">
                      {act.category} · {act.completed ? 'Completed' : 'In Progress'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>
        </div>
      </main>

      <RollingHillsFooter className="-mt-6" />
    </div>
  );
};
