import React, { useState } from 'react';
import { Star, CheckCircle2, ChevronRight, ChevronLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { LIFE_SKILL_ROUTINES } from '../data/mockData';
import { LifeSkillRoutine } from '../types';
import { BentoCard } from '../components/OrganicShapes';
import { RollingHillsFooter } from '../components/OrganicDecorative';

export const LifeSkillsPage: React.FC = () => {
  const [activeRoutine, setActiveRoutine] = useState<LifeSkillRoutine>(LIFE_SKILL_ROUTINES[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);

  const currentStep = activeRoutine.steps[currentStepIndex] || activeRoutine.steps[0];
  const isCompleted = completedStepIds.length === activeRoutine.steps.length;

  const handleToggleStep = (stepId: string) => {
    setCompletedStepIds((prev) =>
      prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]
    );
  };

  const handleSelectRoutine = (routine: LifeSkillRoutine) => {
    setActiveRoutine(routine);
    setCurrentStepIndex(0);
    setCompletedStepIds([]);
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <main className="px-4 sm:px-8 lg:px-12 py-4 max-w-[1360px] mx-auto w-full z-10">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#9A6224] mb-2">
            <Star className="w-4 h-4 fill-[#F5D998] text-[#9A6224]" />
            <span>Life Skills & Daily Routines</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#263831] tracking-tight">
            Step-by-Step Daily Routines
          </h1>
          <p className="text-sm text-[#728078] mt-1 font-medium max-w-xl">
            Visual schedules that make morning routines, hygiene, and daily transitions clear, predictable, and calm.
          </p>
        </div>

        {/* Routine Selector Tabs */}
        <div className="flex flex-wrap gap-2.5 mb-6">
          {LIFE_SKILL_ROUTINES.map((routine) => (
            <button
              key={routine.id}
              type="button"
              onClick={() => handleSelectRoutine(routine)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeRoutine.id === routine.id
                  ? 'bg-[#568469] text-white shadow-2xs'
                  : 'bg-[#FFFDF8] text-[#728078] hover:text-[#263831] hover:bg-[#F0EBDD] border border-[#EAE7DF]'
              }`}
            >
              {routine.title}
            </button>
          ))}
        </div>

        {/* Active Step Viewer Bento Card */}
        <div className="space-y-6 mb-8">
          <BentoCard variant="hero" className="p-6 sm:p-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Step Big Symbol / Artwork */}
              <div 
                style={{
                  borderRadius: '34px 44px 28px 38px / 42px 30px 40px 32px',
                }}
                className="w-36 h-36 sm:w-44 sm:h-44 bg-[#F0EBDD] border border-[#EAE7DF] flex flex-col items-center justify-center text-6xl shrink-0 shadow-inner"
              >
                <span>{currentStep.iconSymbol}</span>
                <span className="text-xs font-bold text-[#568469] mt-2">
                  Step {currentStep.stepNumber} of {activeRoutine.steps.length}
                </span>
              </div>

              {/* Step Details */}
              <div className="flex-1 text-center md:text-left">
                <span className="text-xs font-bold text-[#9A6224] uppercase tracking-wider block mb-2">
                  {activeRoutine.title}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#263831] mb-2">
                  {currentStep.title}
                </h2>
                <p className="text-sm sm:text-base text-[#728078] leading-relaxed max-w-lg mb-6 font-medium">
                  {currentStep.instruction}
                </p>

                <button
                  type="button"
                  onClick={() => handleToggleStep(currentStep.id)}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    completedStepIds.includes(currentStep.id)
                      ? 'bg-[#E2EBD9] text-[#568469]'
                      : 'bg-[#568469] text-white hover:bg-[#456C55]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {completedStepIds.includes(currentStep.id) ? 'Step Completed! ✓' : 'Mark Step Done'}
                  </span>
                </button>
              </div>
            </div>

            {/* Step Navigation Controls */}
            <div className="pt-6 mt-8 border-t border-[#EAE7DF]/70 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStepIndex((p) => Math.max(0, p - 1))}
                disabled={currentStepIndex === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#EAE7DF] text-xs font-bold text-[#263831] hover:bg-[#F0EBDD] disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>

              <span className="text-xs font-semibold text-[#728078]">
                {completedStepIds.length} of {activeRoutine.steps.length} steps checked
              </span>

              <button
                type="button"
                onClick={() =>
                  setCurrentStepIndex((p) => Math.min(activeRoutine.steps.length - 1, p + 1))
                }
                disabled={currentStepIndex === activeRoutine.steps.length - 1}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#568469] text-white text-xs font-bold hover:bg-[#456C55] disabled:opacity-30 disabled:hover:bg-[#568469] transition-all cursor-pointer"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </BentoCard>

          {/* All Steps Overview Bento Card */}
          <BentoCard variant="companion" className="p-6">
            <h3 className="font-bold text-base text-[#263831] mb-4">
              All Steps Overview
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {activeRoutine.steps.map((step, idx) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStepIndex(idx)}
                  style={{
                    borderRadius: '22px 28px 18px 24px / 26px 18px 24px 20px',
                  }}
                  className={`p-4 border text-left transition-all cursor-pointer ${
                    currentStepIndex === idx
                      ? 'border-[#568469] bg-[#E2EBD9]/50 ring-2 ring-[#568469]/20'
                      : 'border-[#EAE7DF] bg-[#FFFDF8] hover:bg-[#F0EBDD]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{step.iconSymbol}</span>
                    {completedStepIds.includes(step.id) && (
                      <CheckCircle2 className="w-4 h-4 text-[#568469]" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-[#263831] block">
                    {step.stepNumber}. {step.title}
                  </span>
                </button>
              ))}
            </div>
          </BentoCard>
        </div>
      </main>

      <RollingHillsFooter className="-mt-6" />
    </div>
  );
};
