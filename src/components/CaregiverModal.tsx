import React from 'react';
import { X, Sliders, ShieldCheck, Heart, Sparkles, Volume2, Eye } from 'lucide-react';
import { UserProfile, ResourceItem } from '../types';

interface CaregiverModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  resources: ResourceItem[];
  onUpdatePreferences: (updated: Partial<UserProfile['preferences']>) => void;
}

export const CaregiverModal: React.FC<CaregiverModalProps> = ({
  isOpen,
  onClose,
  user,
  resources,
  onUpdatePreferences,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="caregiver-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#263831]/40 backdrop-blur-xs animate-in fade-in"
    >
      <div className="w-full max-w-2xl bg-[#FFFDF8] border border-[#EAE7DF] rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col justify-between max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE7DF]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E2EBD9] flex items-center justify-center text-[#568469]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 id="caregiver-modal-title" className="text-xl font-bold text-[#263831]">
                Caregiver & Sensory Setup
              </h3>
              <p className="text-xs text-[#728078]">
                Personalize learning pace and sensory comfort for {user.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#728078] hover:text-[#263831] hover:bg-[#F0EBDD] transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sensory Controls Section */}
        <div className="py-6 space-y-6">
          <div>
            <h4 className="text-sm font-bold text-[#263831] uppercase tracking-wider mb-3">
              Sensory Environment
            </h4>

            <div className="space-y-3">
              {/* Sound toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F0EBDD]/60 border border-[#EAE7DF]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FFFDF8] flex items-center justify-center text-[#568469]">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#263831]">Gentle Sound Cues</span>
                    <p className="text-xs text-[#728078]">
                      Soft organic chimes on matches (off by default for sensory peace).
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={user.preferences.soundEnabled}
                  onChange={(e) => onUpdatePreferences({ soundEnabled: e.target.checked })}
                  className="w-5 h-5 accent-[#568469] rounded cursor-pointer"
                />
              </div>

              {/* Reduced motion toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F0EBDD]/60 border border-[#EAE7DF]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FFFDF8] flex items-center justify-center text-[#568469]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#263831]">Reduced Animation</span>
                    <p className="text-xs text-[#728078]">
                      Eliminates nonessential motion to prevent visual overstimulation.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={user.preferences.reducedMotion}
                  onChange={(e) => onUpdatePreferences({ reducedMotion: e.target.checked })}
                  className="w-5 h-5 accent-[#568469] rounded cursor-pointer"
                />
              </div>

              {/* Voice Guidance toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F0EBDD]/60 border border-[#EAE7DF]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FFFDF8] flex items-center justify-center text-[#568469]">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#263831]">Spoken Prompts</span>
                    <p className="text-xs text-[#728078]">
                      Reads communication cards and affirmations in a relaxed, friendly tone.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={user.preferences.voiceGuidance}
                  onChange={(e) => onUpdatePreferences({ voiceGuidance: e.target.checked })}
                  className="w-5 h-5 accent-[#568469] rounded cursor-pointer"
                />
              </div>

              {/* High Contrast */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F0EBDD]/60 border border-[#EAE7DF]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FFFDF8] flex items-center justify-center text-[#568469]">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#263831]">High Contrast Borders</span>
                    <p className="text-xs text-[#728078]">
                      Strengthens card edges and text outlines for visual clarity.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={user.preferences.highContrast}
                  onChange={(e) => onUpdatePreferences({ highContrast: e.target.checked })}
                  className="w-5 h-5 accent-[#568469] rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Sensory Pacing */}
          <div>
            <h4 className="text-sm font-bold text-[#263831] uppercase tracking-wider mb-2">
              Sensory Pacing
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {(['calm', 'standard', 'gentle'] as const).map((pace) => (
                <button
                  key={pace}
                  type="button"
                  onClick={() => onUpdatePreferences({ sensoryPacing: pace })}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize transition-all ${
                    user.preferences.sensoryPacing === pace
                      ? 'bg-[#568469] text-[#FFFDF8] border-[#568469] shadow-xs'
                      : 'bg-[#FFFDF8] text-[#263831] border-[#EAE7DF] hover:bg-[#F0EBDD]'
                  }`}
                >
                  {pace}
                </button>
              ))}
            </div>
          </div>

          {/* Caregiver Guides preview */}
          <div>
            <h4 className="text-sm font-bold text-[#263831] uppercase tracking-wider mb-3">
              Caregiver Guides & Evidence
            </h4>
            <div className="space-y-2">
              {resources.slice(0, 2).map((res) => (
                <div
                  key={res.id}
                  className="p-3 rounded-2xl bg-[#FFFDF8] border border-[#EAE7DF] flex items-start justify-between gap-3"
                >
                  <div>
                    <h5 className="text-xs font-bold text-[#263831]">{res.title}</h5>
                    <p className="text-[11px] text-[#728078] mt-0.5">{res.description}</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#568469] bg-[#E2EBD9] px-2 py-0.5 rounded-full shrink-0">
                    {res.readTime}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#EAE7DF] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#568469] font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Preferences saved locally</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#568469] hover:bg-[#456C55] text-[#FFFDF8] font-bold text-sm shadow-xs transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
