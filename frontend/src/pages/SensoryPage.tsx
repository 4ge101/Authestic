import React, { useState, useEffect } from 'react';
import { Wind, Volume2, VolumeX, Sparkles, Heart, Sun, Coffee } from 'lucide-react';
import { playGentleChime } from '../utils/audio';
import { BentoCard } from '../components/OrganicShapes';
import { RollingHillsFooter } from '../components/OrganicDecorative';

export const SensoryPage: React.FC = () => {
  const [phase, setPhase] = useState<'breathe-in' | 'hold' | 'breathe-out'>('breathe-in');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [speed, setSpeed] = useState<'gentle' | 'slow'>('gentle');
  const [quietBreakActive, setQuietBreakActive] = useState<boolean>(false);

  useEffect(() => {
    const duration = speed === 'gentle' ? 4000 : 5500;
    const interval = setInterval(() => {
      setPhase((prev) => {
        if (prev === 'breathe-in') {
          playGentleChime(soundEnabled, 440);
          return 'hold';
        }
        if (prev === 'hold') {
          return 'breathe-out';
        }
        playGentleChime(soundEnabled, 380);
        return 'breathe-in';
      });
    }, duration);

    return () => clearInterval(interval);
  }, [speed, soundEnabled]);

  const phaseText = {
    'breathe-in': 'Breathe in gently...',
    hold: 'Hold softly...',
    'breathe-out': 'Breathe out slowly...',
  }[phase];

  return (
    <div className="flex-1 flex flex-col justify-between">
      <main className="px-4 sm:px-8 lg:px-12 py-4 max-w-[1360px] mx-auto w-full z-10">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#3E684C] mb-2">
            <Wind className="w-4 h-4 text-[#3E684C]" />
            <span>Sensory Sanctuary</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#263831] tracking-tight">
            Quiet Regulation & Calming Pauses
          </h1>
          <p className="text-sm text-[#728078] mt-1 font-medium max-w-xl">
            A dedicated peaceful space for soothing nervous systems. Take quiet breaths, rest your senses, and pause whenever you need.
          </p>
        </div>

        {/* Bento Layout: 7 cols Breathing Bubble + 5 cols Sensory Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
          {/* Left: Interactive Breathing Circle (7 cols) */}
          <div className="lg:col-span-7">
            <BentoCard variant="hero" className="p-8 sm:p-10 flex flex-col items-center justify-center text-center min-h-[460px]">
              <div className="relative w-60 h-60 flex items-center justify-center mb-8">
                {/* Outer halo with organic breathing wave */}
                <div
                  style={{
                    borderRadius: '48% 52% 44% 56% / 54% 46% 54% 46%',
                  }}
                  className={`absolute inset-0 bg-[#E2EBD9]/60 transition-all ${
                    phase === 'breathe-in'
                      ? 'scale-110 duration-4000 ease-out'
                      : phase === 'hold'
                      ? 'scale-110 duration-2000'
                      : 'scale-90 duration-4000 ease-in'
                  }`}
                />

                {/* Pastel breathing circle */}
                <div
                  style={{
                    borderRadius: '46% 54% 52% 48% / 50% 48% 52% 50%',
                  }}
                  className={`w-40 h-40 bg-[#DCE8EE] border-4 border-[#FFFDF8] shadow-md flex items-center justify-center transition-all ${
                    phase === 'breathe-in'
                      ? 'scale-115 duration-4000 ease-out'
                      : phase === 'hold'
                      ? 'scale-115 duration-2000'
                      : 'scale-85 duration-4000 ease-in'
                  }`}
                >
                  <Sparkles className="w-8 h-8 text-[#568469]" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[#263831] mb-2 transition-all">
                {phaseText}
              </h2>
              <p className="text-xs sm:text-sm text-[#728078] max-w-sm mb-6 leading-relaxed font-medium">
                There is nothing to complete here. Allow your body to rest in its own rhythm.
              </p>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSpeed('gentle')}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    speed === 'gentle' ? 'bg-[#568469] text-white' : 'bg-[#F0EBDD] text-[#263831]'
                  }`}
                >
                  Gentle Pace
                </button>
                <button
                  type="button"
                  onClick={() => setSpeed('slow')}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    speed === 'slow' ? 'bg-[#568469] text-white' : 'bg-[#F0EBDD] text-[#263831]'
                  }`}
                >
                  Slow & Soft
                </button>

                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-2 rounded-full border transition-colors cursor-pointer ${
                    soundEnabled
                      ? 'bg-[#E2EBD9] border-[#568469] text-[#568469]'
                      : 'bg-[#FFFDF8] border-[#EAE7DF] text-[#728078]'
                  }`}
                  title={soundEnabled ? 'Mute audio' : 'Turn on chime audio'}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
            </BentoCard>
          </div>

          {/* Right: Sensory Tools & Quiet Break Mode (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Break Bento Card */}
            <BentoCard variant="soft-cream" className="p-6 sm:p-7">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E2EBD9] flex items-center justify-center text-[#568469]">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#263831]">
                    Quiet Break Screen
                  </h3>
                  <p className="text-xs text-[#728078]">Pause all visual prompts</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#728078] leading-relaxed mb-4 font-medium">
                Step away from tasks and dim the screen. Autistic nervous systems need low-stimulation downtime to reset comfortably.
              </p>

              <button
                type="button"
                onClick={() => setQuietBreakActive(!quietBreakActive)}
                className={`w-full py-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  quietBreakActive
                    ? 'bg-[#568469] text-white'
                    : 'bg-[#FFFDF8] text-[#263831] hover:bg-[#F0EBDD] border border-[#E4DEC9]'
                }`}
              >
                {quietBreakActive ? 'Resume Active Screen' : 'Start Quiet Break Mode'}
              </button>

              {quietBreakActive && (
                <div className="mt-4 p-4 rounded-2xl bg-[#E2EBD9]/60 border border-[#568469]/30 text-center text-xs font-semibold text-[#568469]">
                  Quiet break is active. Take as much time as you like.
                </div>
              )}
            </BentoCard>

            {/* Gentle Audio Cues Policy Card */}
            <BentoCard variant="companion" className="p-6">
              <h3 className="font-bold text-sm text-[#263831] mb-2">
                Sensory Preferences Policy
              </h3>
              <p className="text-xs text-[#728078] leading-relaxed font-medium">
                Little Steps never autoplays sound and avoids rapid animations or flashing visuals. All sound is off by default, and contrast or motion can be adapted instantly.
              </p>
            </BentoCard>
          </div>
        </div>
      </main>

      <RollingHillsFooter className="-mt-6" />
    </div>
  );
};
