import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Volume2, Sparkles, Check } from 'lucide-react';
import { SOCIAL_STORIES } from '../data/mockData';
import { speakCardLabel } from '../utils/audio';
import { BentoCard } from '../components/OrganicShapes';
import { RollingHillsFooter } from '../components/OrganicDecorative';

export const StoryReaderPage: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();

  const story = SOCIAL_STORIES.find((s) => s.id === storyId);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

  if (!story) {
    return (
      <div className="px-6 py-16 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-[#263831] mb-2">Story not found</h2>
        <p className="text-sm text-[#728078] mb-6 font-medium">We could not find the requested social story.</p>
        <button
          type="button"
          onClick={() => navigate('/stories')}
          className="px-6 py-2.5 rounded-full bg-[#568469] text-white font-bold text-xs"
        >
          Back to Stories
        </button>
      </div>
    );
  }

  const currentPage = story.pages[currentPageIndex] || story.pages[0];
  const isFirst = currentPageIndex === 0;
  const isLast = currentPageIndex === story.pages.length - 1;

  const handleReadAloud = () => {
    speakCardLabel(currentPage.text, true);
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <main className="px-4 sm:px-8 py-6 max-w-4xl mx-auto w-full z-10">
        {/* Top Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => navigate('/stories')}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#728078] hover:text-[#263831] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Stories Library</span>
          </button>

          <span className="text-xs font-bold text-[#568469]">
            Page {currentPageIndex + 1} of {story.pages.length}
          </span>
        </div>

        {/* Main Story Book Bento Card */}
        <BentoCard variant="hero" className="p-6 sm:p-10 flex flex-col justify-between min-h-[480px] mb-8">
          {/* Story Illustration with Organic Corner Styling */}
          <div 
            style={{
              borderRadius: '26px 36px 22px 30px / 32px 22px 30px 24px',
            }}
            className="w-full h-64 sm:h-84 overflow-hidden bg-[#F0EBDD] border border-[#EAE7DF]/70 mb-6 relative"
          >
            <img
              src={currentPage.illustration}
              alt={story.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text Passage */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#6C537B] uppercase tracking-wider">
                {story.title}
              </span>
              <button
                type="button"
                onClick={handleReadAloud}
                className="p-2.5 rounded-full bg-[#E2EBD9] text-[#568469] hover:bg-[#568469] hover:text-white transition-colors cursor-pointer"
                title="Read this page aloud"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-lg sm:text-2xl font-bold text-[#263831] leading-relaxed">
              {currentPage.text}
            </p>

            {currentPage.cue && (
              <div className="mt-4 p-3.5 rounded-2xl bg-[#F0EBDD]/60 border border-[#EAE7DF] inline-flex items-center gap-2 text-xs font-semibold text-[#568469]">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>{currentPage.cue}</span>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-[#EAE7DF]/70 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentPageIndex((p) => Math.max(0, p - 1))}
              disabled={isFirst}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#EAE7DF] text-xs font-bold text-[#263831] hover:bg-[#F0EBDD] disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Page</span>
            </button>

            <div className="flex items-center gap-1.5">
              {story.pages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentPageIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    currentPageIndex === idx ? 'bg-[#568469] w-3.5' : 'bg-[#EAE7DF]'
                  }`}
                  aria-label={`Go to page ${idx + 1}`}
                />
              ))}
            </div>

            {isLast ? (
              <button
                type="button"
                onClick={() => navigate('/stories')}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#568469] text-white text-xs font-bold hover:bg-[#456C55] transition-all cursor-pointer shadow-2xs"
              >
                <Check className="w-4 h-4" />
                <span>Finish Story</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentPageIndex((p) => Math.min(story.pages.length - 1, p + 1))}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#568469] text-white text-xs font-bold hover:bg-[#456C55] transition-all cursor-pointer shadow-2xs"
              >
                <span>Next Page</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </BentoCard>
      </main>

      <RollingHillsFooter className="-mt-6" />
    </div>
  );
};
