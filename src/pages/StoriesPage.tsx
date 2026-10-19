import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, ArrowRight, Heart, Sparkles, Star } from 'lucide-react';
import { SOCIAL_STORIES } from '../data/mockData';
import { BentoCard } from '../components/OrganicShapes';
import { CuteStarCharacter, SproutIcon, RollingHillsFooter } from '../components/OrganicDecorative';

export const StoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Transitions', 'Sensory', 'Social & Feelings'];

  const filtered = SOCIAL_STORIES.filter((story) => {
    if (selectedCategory === 'All') return true;
    return story.category === selectedCategory;
  });

  const featuredStory = SOCIAL_STORIES[0];
  const spotlightStory = SOCIAL_STORIES[1] || SOCIAL_STORIES[0];
  const remainingStories = SOCIAL_STORIES.slice(2);

  return (
    <div className="flex-1 flex flex-col justify-between">
      <main className="px-4 sm:px-8 lg:px-12 py-4 max-w-[1360px] mx-auto w-full z-10">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#6C537B] mb-2">
            <BookOpen className="w-4 h-4 text-[#6C537B]" />
            <span>Social Stories Library</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#263831] tracking-tight">
            Gentle Illustrated Stories
          </h1>
          <p className="text-sm text-[#728078] mt-1 font-medium max-w-xl">
            Visual narratives about transitions, sensory comfort, and predictable routines. Read together with warm illustrations and supportive pacing.
          </p>
        </div>

        {/* Category Filters */}
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

        {/* Bento Composition */}
        <div className="space-y-6 mb-8">
          {/* Top Bento Row: 8 cols Featured + 4 cols Story Spotlight */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Featured Story Bento (8 cols) */}
            <div className="lg:col-span-8">
              <BentoCard
                variant="hero"
                className="p-6 sm:p-8 h-full flex flex-col justify-between group cursor-pointer"
                onClick={() => navigate(`/stories/${featuredStory.id}`)}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Left Storybook Thumbnail with Asymmetrical Mask */}
                  <div className="md:col-span-5 h-48 sm:h-56 rounded-3xl overflow-hidden bg-[#F0EBDD] border border-[#EAE7DF]/70 relative">
                    <img
                      src={featuredStory.thumbnail}
                      alt={featuredStory.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Right Story Info */}
                  <div className="md:col-span-7">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#568469] uppercase tracking-wider mb-2">
                      <span>Featured Story</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-[#728078] normal-case">
                        <Clock className="w-3.5 h-3.5" />
                        {featuredStory.readTimeMinutes} min read
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#263831] mb-2 leading-tight group-hover:text-[#568469] transition-colors">
                      {featuredStory.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-[#728078] leading-relaxed font-medium mb-4">
                      {featuredStory.description}
                    </p>

                    <div className="p-3.5 rounded-2xl bg-[#F0EBDD]/50 border border-[#EAE7DF]/80 mb-5">
                      <p className="text-xs font-semibold text-[#568469] italic">
                        "{featuredStory.pages[0]?.cue || 'Take a deep breath and look at the flowers.'}"
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/stories/${featuredStory.id}`);
                      }}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#568469] hover:bg-[#456C55] text-white font-bold text-xs sm:text-sm shadow-2xs transition-all cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Start Reading</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </BentoCard>
            </div>

            {/* Story of the Day Spotlight Bento (4 cols) */}
            <div className="lg:col-span-4">
              <BentoCard
                variant="honey"
                className="p-6 sm:p-7 h-full flex flex-col justify-between group cursor-pointer"
                onClick={() => navigate(`/stories/${spotlightStory.id}`)}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-[#876527] uppercase tracking-wider">
                      Sensory Comfort Pick
                    </span>
                    <CuteStarCharacter className="w-10 h-10 -mt-2 -mr-1" />
                  </div>

                  <h3 className="text-xl font-bold text-[#263831] mb-2 group-hover:text-[#568469] transition-colors">
                    {spotlightStory.title}
                  </h3>

                  <p className="text-xs text-[#728078] leading-relaxed font-medium mb-4">
                    {spotlightStory.description}
                  </p>

                  <div className="p-3 rounded-2xl bg-[#FFFDF8]/80 border border-[#F4E3BF] text-xs text-[#876527] font-semibold mb-4">
                    ✨ "Asking for a break is a superpower."
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F4E3BF] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#728078]">
                    {spotlightStory.readTimeMinutes} min read · {spotlightStory.pages.length} pages
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#568469] group-hover:translate-x-0.5 transition-transform">
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </BentoCard>
            </div>
          </div>

          {/* Lower Bento Row: 6 cols Story Card + 6 cols Reading Guide Sanctuary */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Story Card: Trying Something New (6 cols) */}
            <div className="md:col-span-6">
              {remainingStories.length > 0 ? (
                <BentoCard
                  variant="companion"
                  className="p-6 sm:p-7 h-full flex flex-col justify-between group cursor-pointer"
                  onClick={() => navigate(`/stories/${remainingStories[0].id}`)}
                >
                  <div className="flex flex-col sm:flex-row gap-5 items-center">
                    <div className="w-full sm:w-40 h-32 rounded-2xl overflow-hidden bg-[#F0EBDD] border border-[#EAE7DF] shrink-0">
                      <img
                        src={remainingStories[0].thumbnail}
                        alt={remainingStories[0].title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-[11px] font-bold text-[#6C537B] uppercase tracking-wider block mb-1">
                        {remainingStories[0].category} · {remainingStories[0].readTimeMinutes} min read
                      </span>
                      <h3 className="text-lg font-bold text-[#263831] mb-1.5 group-hover:text-[#568469] transition-colors">
                        {remainingStories[0].title}
                      </h3>
                      <p className="text-xs text-[#728078] leading-relaxed font-medium">
                        {remainingStories[0].description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#EAE7DF] flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#728078]">
                      {remainingStories[0].pages.length} gentle illustrated pages
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#568469]">
                      <span>Open Story</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </BentoCard>
              ) : null}
            </div>

            {/* Reading Guidance Sanctuary Card (6 cols) */}
            <div className="md:col-span-6">
              <BentoCard
                variant="soft-cream"
                className="p-6 sm:p-7 h-full flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#E2EBD9] flex items-center justify-center text-[#568469]">
                      <SproutIcon className="w-5 h-5" color="#568469" />
                    </div>
                    <h3 className="text-base font-bold text-[#263831]">
                      Gentle Reading Tips for Caregivers
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[#728078] leading-relaxed mb-4">
                    Social stories help create predictable narratives for children. There is no requirement to finish a story in one sitting:
                  </p>

                  <ul className="space-y-2 text-xs text-[#263831] font-medium">
                    <li className="flex items-start gap-2">
                      <span className="text-[#568469] font-bold">·</span>
                      <span>Pause on illustrations as long as the learner wants.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#568469] font-bold">·</span>
                      <span>Allow repeating pages—repetition brings calm and safety.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#568469] font-bold">·</span>
                      <span>Emphasize the positive feeling cues rather than testing comprehension.</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E4DEC9] text-[11px] text-[#728078] font-semibold">
                  Neurodiversity-affirming approach · Zero pressure
                </div>
              </BentoCard>
            </div>
          </div>
        </div>
      </main>

      <RollingHillsFooter className="-mt-6" />
    </div>
  );
};
