import React from 'react';
import { Settings, Volume2, Sparkles, Heart, Eye, Sliders, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';
import { BentoCard } from '../components/OrganicShapes';
import { RollingHillsFooter } from '../components/OrganicDecorative';

interface SettingsPageProps {
  user: UserProfile;
  onUpdatePreferences: (updated: Partial<UserProfile['preferences']>) => void;
  onUpdateUserName: (name: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  user,
  onUpdatePreferences,
  onUpdateUserName,
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between">
      <main className="px-4 sm:px-8 lg:px-12 py-4 max-w-[1360px] mx-auto w-full z-10">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#263831] mb-2">
            <Settings className="w-4 h-4 text-[#263831]" />
            <span>Application Preferences</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#263831] tracking-tight">
            Caregiver & Sensory Settings
          </h1>
          <p className="text-sm text-[#728078] mt-1 font-medium max-w-xl">
            Customize sensory comfort, auditory cues, motion, and pacing for {user.name}.
          </p>
        </div>

        {/* Bento Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8 items-start">
          {/* Left Column: Sensory Environment (7 cols) */}
          <div className="md:col-span-7">
            <BentoCard variant="hero" className="p-6 sm:p-8">
              <h2 className="text-lg font-bold text-[#263831] mb-2">
                Sensory Accommodations
              </h2>
              <p className="text-xs text-[#728078] font-medium mb-5">
                Adjust environment settings to support regulation and prevent sensory overload.
              </p>

              <div className="space-y-3.5">
                {/* Sound */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F8F6F0] border border-[#EAE7DF]">
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#E2EBD9] flex items-center justify-center text-[#568469]">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-[#263831] block">
                        Gentle Sound Cues
                      </span>
                      <span className="text-xs text-[#728078] font-medium">
                        Soft organic chimes on activity completion (off by default).
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={user.preferences.soundEnabled}
                    onChange={(e) => onUpdatePreferences({ soundEnabled: e.target.checked })}
                    className="w-5 h-5 accent-[#568469] rounded cursor-pointer"
                  />
                </div>

                {/* Reduced Motion */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F8F6F0] border border-[#EAE7DF]">
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#F5D998] flex items-center justify-center text-[#876527]">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-[#263831] block">
                        Reduced Motion & Animation
                      </span>
                      <span className="text-xs text-[#728078] font-medium">
                        Minimizes transitions to prevent visual fatigue and overwhelm.
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={user.preferences.reducedMotion}
                    onChange={(e) => onUpdatePreferences({ reducedMotion: e.target.checked })}
                    className="w-5 h-5 accent-[#568469] rounded cursor-pointer"
                  />
                </div>

                {/* Spoken Voice Guidance */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F8F6F0] border border-[#EAE7DF]">
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#F4DDD3] flex items-center justify-center text-[#C05244]">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-[#263831] block">
                        Spoken Prompts (Text-to-Speech)
                      </span>
                      <span className="text-xs text-[#728078] font-medium">
                        Reads communication cards and story text in a relaxed voice.
                      </span>
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
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F8F6F0] border border-[#EAE7DF]">
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#DCE8EE] flex items-center justify-center text-[#3E6C80]">
                      <Eye className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-[#263831] block">
                        High Contrast Card Borders
                      </span>
                      <span className="text-xs text-[#728078] font-medium">
                        Strengthens card edges for increased visual clarity.
                      </span>
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
            </BentoCard>
          </div>

          {/* Right Column: Pacing & Profile (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            {/* Sensory Pacing Bento */}
            <BentoCard variant="soft-cream" className="p-6 sm:p-7">
              <h2 className="text-lg font-bold text-[#263831] mb-1">
                Sensory Pacing Mode
              </h2>
              <p className="text-xs text-[#728078] font-medium mb-4">
                Select the breathing and transition speed that best fits your child today.
              </p>

              <div className="grid grid-cols-3 gap-2.5">
                {(['calm', 'standard', 'gentle'] as const).map((pace) => (
                  <button
                    key={pace}
                    type="button"
                    onClick={() => onUpdatePreferences({ sensoryPacing: pace })}
                    className={`py-3 px-3 rounded-2xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      user.preferences.sensoryPacing === pace
                        ? 'bg-[#568469] text-white shadow-2xs'
                        : 'bg-[#FFFDF8] text-[#263831] hover:bg-[#F0EBDD] border border-[#E4DEC9]'
                    }`}
                  >
                    {pace}
                  </button>
                ))}
              </div>
            </BentoCard>

            {/* Learner Profile Info Bento */}
            <BentoCard variant="companion" className="p-6 sm:p-7">
              <h2 className="text-lg font-bold text-[#263831] mb-2">
                Learner Profile
              </h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-[#FFD966] p-0.5 shrink-0 border border-[#EAE7DF]">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <p className="font-bold text-base text-[#263831]">{user.name}</p>
                  <p className="text-xs text-[#728078] font-medium">Age {user.age} · Early Learner</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#E2EBD9]/60 border border-[#568469]/20 flex items-center gap-2 text-xs font-semibold text-[#568469]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>All preferences saved locally for your session.</span>
              </div>
            </BentoCard>
          </div>
        </div>
      </main>

      <RollingHillsFooter className="-mt-6" />
    </div>
  );
};
