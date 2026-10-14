import React, { useState, useEffect } from 'react';
import { X, Wind, Heart, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { playGentleChime } from '../utils/audio';

interface SensoryBubbleModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  reducedMotion: boolean;
}

export const SensoryBubbleModal: React.FC<SensoryBubbleModalProps> = ({
  isOpen,
  onClose,
  soundEnabled,
  onToggleSound,
  reducedMotion,
}) => {
  const [phase, setPhase] = useState<'breathe-in' | 'hold' | 'breathe-out'>('breathe-in');
  const [cycleCount, setCycleCount] = useState<number>(0);
  const [speed, setSpeed] = useState<'gentle' | 'slow'>('gentle');

  useEffect(() => {
    if (!isOpen) return;

    const intervalDuration = speed === 'gentle' ? 4000 : 5500;

    const cycleTimer = setInterval(() => {
      setPhase((prev) => {
        if (prev === 'breathe-in') {
          playGentleChime(soundEnabled, 440);
          return 'hold';
        }
        if (prev === 'hold') {
          return 'breathe-out';
        }
        playGentleChime(soundEnabled, 380);
        setCycleCount((c) => c + 1);
        return 'breathe-in';
      });
    }, intervalDuration);

    return () => clearInterval(cycleTimer);
  }, [isOpen, speed, soundEnabled]);

  if (!isOpen) return null;

  const phaseInstruction = {
    'breathe-in': 'Breathe in gently...',
    hold: 'Hold softly and rest...',
    'breathe-out': 'Breathe out slowly like a quiet breeze...',
  }[phase];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sensory-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#263831]/40 backdrop-blur-xs animate-in fade-in"
    >
      <div className="w-full max-w-lg bg-[#FFFDF8] border border-[#EAE7DF] rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col justify-between">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE7DF]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#DCE8EE] flex items-center justify-center text-[#486D7D]">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <h3 id="sensory-modal-title" className="text-lg font-bold text-[#263831]">
                Sensory Breathing Bubble
              </h3>
              <p className="text-xs text-[#728078]">Quiet regulation and calm pause</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleSound}
              className={`p-2 rounded-xl border transition-colors ${
                soundEnabled
                  ? 'bg-[#E2EBD9] border-[#568469] text-[#568469]'
                  : 'bg-[#FFFDF8] border-[#EAE7DF] text-[#728078]'
              }`}
              aria-label={soundEnabled ? 'Mute chimes' : 'Enable chimes'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[#728078] hover:text-[#263831] hover:bg-[#F0EBDD] transition-colors"
              aria-label="Close breathing bubble"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Breathing Animation Canvas */}
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <div className="relative w-52 h-52 flex items-center justify-center mb-6">
            {/* Outer soft ring */}
            <div
              className={`absolute inset-0 rounded-full bg-[#E2EBD9]/40 transition-all ${
                reducedMotion
                  ? 'scale-100'
                  : phase === 'breathe-in'
                  ? 'scale-110 duration-4000 ease-out'
                  : phase === 'hold'
                  ? 'scale-110 duration-2000'
                  : 'scale-90 duration-4000 ease-in'
              }`}
            />

            {/* Middle pastel bubble */}
            <div
              className={`w-36 h-36 rounded-full bg-[#DCE8EE]/80 border-4 border-[#FFFDF8] shadow-md flex items-center justify-center transition-all ${
                reducedMotion
                  ? 'scale-100'
                  : phase === 'breathe-in'
                  ? 'scale-115 duration-4000 ease-out'
                  : phase === 'hold'
                  ? 'scale-115 duration-2000'
                  : 'scale-85 duration-4000 ease-in'
              }`}
            >
              <Sparkles className="w-8 h-8 text-[#568469]" />
            </div>
          </div>

          <p className="text-xl font-bold text-[#263831] mb-2 transition-all">
            {phaseInstruction}
          </p>
          <p className="text-xs text-[#728078] max-w-xs leading-relaxed">
            There is nothing you need to accomplish here. Just breathe softly whenever you want.
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#568469] bg-[#E2EBD9] px-3 py-1 rounded-full">
            <Heart className="w-3.5 h-3.5 fill-[#568469]" />
            <span>{cycleCount} peaceful breaths taken</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-[#EAE7DF] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[#728078]">Pacing:</span>
            <button
              type="button"
              onClick={() => setSpeed('gentle')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                speed === 'gentle' ? 'bg-[#568469] text-[#FFFDF8]' : 'bg-[#F0EBDD] text-[#263831]'
              }`}
            >
              Gentle
            </button>
            <button
              type="button"
              onClick={() => setSpeed('slow')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                speed === 'slow' ? 'bg-[#568469] text-[#FFFDF8]' : 'bg-[#F0EBDD] text-[#263831]'
              }`}
            >
              Very Slow
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#568469] hover:bg-[#456C55] text-[#FFFDF8] font-bold transition-colors"
          >
            I feel ready
          </button>
        </div>
      </div>
    </div>
  );
};
