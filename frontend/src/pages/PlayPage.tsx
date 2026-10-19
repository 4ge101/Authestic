import React from 'react';
import { Gamepad2, Play, Sparkles, Smile, Star, ArrowRight, Wind } from 'lucide-react';
import { Activity } from '../types';
import { BentoCard } from '../components/OrganicShapes';
import { CuteStarCharacter, RollingHillsFooter } from '../components/OrganicDecorative';

interface PlayPageProps {
  activities: Activity[];
  onStartActivity: (activity: Activity) => void;
}

export const PlayPage: React.FC<PlayPageProps> = ({ activities, onStartActivity }) => {
  const games = activities.filter((a) => a.category === 'Play' || a.category === 'Sensory');
  const puzzleAct = activities.find((a) => a.id === 'act-puzzle-time') || activities[0];
  const otherGames = games.filter((g) => g.id !== puzzleAct.id);

  return (
    <div className="flex-1 flex flex-col justify-between">
      <main className="px-4 sm:px-8 lg:px-12 py-4 max-w-[1360px] mx-auto w-full z-10">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#876527] mb-2">
            <Gamepad2 className="w-4 h-4 text-[#876527]" />
            <span>Play Sanctuary</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#263831] tracking-tight">
            Gentle Games & Calming Puzzles
          </h1>
          <p className="text-sm text-[#728078] mt-1 font-medium max-w-xl">
            Build fine motor and pattern recognition skills through low-sensory interactive play. No timers, no scoring stress, just peaceful fun.
          </p>
        </div>

        {/* Bento Composition */}
        <div className="space-y-6 mb-8">
          {/* Top Row: 8 cols Featured Game + 4 cols Free Play Sanctuary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Featured Interactive Game (8 cols) */}
            <div className="lg:col-span-8">
              <BentoCard
                variant="hero"
                className="p-6 sm:p-8 h-full flex flex-col justify-between group cursor-pointer"
                onClick={() => onStartActivity(puzzleAct)}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Left Illustrated Thumbnail */}
                  <div className="md:col-span-5 h-48 sm:h-56 rounded-3xl overflow-hidden bg-[#F0EBDD] border border-[#EAE7DF]/70 relative">
                    <img
                      src="/src/assets/images/activity_fox_puzzle_1791915350324.jpg"
                      alt="Wooden Fox Puzzle Activity"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Right Details */}
                  <div className="md:col-span-7">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#876527] uppercase tracking-wider mb-2">
                      <span>Interactive Feature</span>
                      <span>·</span>
                      <span className="text-[#728078] normal-case">5 min play</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#263831] mb-2 leading-tight group-hover:text-[#568469] transition-colors">
                      Wooden Shape Puzzle Matcher
                    </h2>

                    <p className="text-xs sm:text-sm text-[#728078] leading-relaxed font-medium mb-4">
                      Pick friendly wooden stars, circles, leaves, and moon shapes and slide them into their cozy matching slots. Gentle audio chimes encourage every step.
                    </p>

                    <div className="flex items-center gap-2 text-xs text-[#263831] font-semibold mb-5">
                      <span className="p-1.5 rounded-xl bg-[#F7E5B5] text-[#876527]">⭐</span>
                      <span className="p-1.5 rounded-xl bg-[#E2EBD9] text-[#568469]">🍃</span>
                      <span className="p-1.5 rounded-xl bg-[#DCE8EE] text-[#3E6C80]">🌙</span>
                      <span className="p-1.5 rounded-xl bg-[#F5DBD0] text-[#C05244]">🌸</span>
                      <span className="text-[#728078] text-[11px] ml-1">Tactile wooden textures</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartActivity(puzzleAct);
                      }}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#568469] hover:bg-[#456C55] text-white font-bold text-xs sm:text-sm shadow-2xs transition-all cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Play Puzzle Time Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </BentoCard>
            </div>

            {/* Sensory Calm Station Bento (4 cols) */}
            <div className="lg:col-span-4">
              <BentoCard
                variant="honey"
                className="p-6 sm:p-7 h-full flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-[#876527] uppercase tracking-wider">
                      Peaceful Play
                    </span>
                    <CuteStarCharacter className="w-10 h-10 -mt-2 -mr-1" />
                  </div>

                  <h3 className="text-xl font-bold text-[#263831] mb-2">
                    Zero Time Pressure
                  </h3>

                  <p className="text-xs text-[#728078] leading-relaxed font-medium mb-4">
                    Traditional games often cause stress with ticking clocks and losing sounds. Little Steps games are open-ended and peaceful.
                  </p>

                  <div className="p-3.5 rounded-2xl bg-[#FFFDF8] border border-[#F4E3BF] space-y-2 text-xs text-[#263831]">
                    <div className="flex items-center gap-2">
                      <span className="text-[#568469] font-bold">✓</span>
                      <span>No losing screens or penalties</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#568469] font-bold">✓</span>
                      <span>Gentle chime cues with volume controls</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#F4E3BF] text-[11px] text-[#876527] font-semibold">
                  Safe exploratory play for curious minds 💛
                </div>
              </BentoCard>
            </div>
          </div>

          {/* Lower Bento Row: Games Catalogue with Asymmetrical Cards */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {otherGames.map((game, index) => {
              const colSpan = index === 0 ? 'md:col-span-7' : 'md:col-span-5';
              const cardVariant = index % 2 === 0 ? 'companion' : 'sage';

              return (
                <div key={game.id} className={colSpan}>
                  <BentoCard
                    variant={cardVariant}
                    className="p-6 h-full flex flex-col justify-between group cursor-pointer"
                    onClick={() => onStartActivity(game)}
                  >
                    <div>
                      <div className="flex flex-col sm:flex-row gap-5 items-center mb-4">
                        <div className="w-full sm:w-36 h-28 rounded-2xl overflow-hidden bg-[#F0EBDD] border border-[#EAE7DF] shrink-0">
                          <img
                            src={game.thumbnail}
                            alt={game.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-[11px] font-bold text-[#876527] uppercase tracking-wider mb-1">
                            <span>{game.category}</span>
                            <span>·</span>
                            <span className="text-[#728078] normal-case">{game.durationMinutes} mins</span>
                          </div>
                          <h3 className="text-lg font-bold text-[#263831] mb-1 group-hover:text-[#568469] transition-colors leading-snug">
                            {game.title}
                          </h3>
                          <p className="text-xs text-[#728078] leading-relaxed font-medium">
                            {game.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#EAE7DF] flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#728078]">
                        Low stimulation · Sensory safe
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartActivity(game);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#568469] hover:bg-[#456C55] text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>Play</span>
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
