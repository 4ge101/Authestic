import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, CheckCircle2, Bookmark, Share2 } from 'lucide-react';
import { RESOURCES_CATALOG } from '../data/mockData';
import { BentoCard } from '../components/OrganicShapes';
import { RollingHillsFooter } from '../components/OrganicDecorative';

export const ResourceDetailPage: React.FC = () => {
  const { resourceId } = useParams<{ resourceId: string }>();
  const navigate = useNavigate();

  const resource = RESOURCES_CATALOG.find((r) => r.id === resourceId);

  if (!resource) {
    return (
      <div className="px-6 py-16 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-[#263831] mb-2">Guide not found</h2>
        <p className="text-sm text-[#728078] mb-6 font-medium">We could not find the requested caregiver resource.</p>
        <button
          type="button"
          onClick={() => navigate('/resources')}
          className="px-6 py-2.5 rounded-full bg-[#568469] text-white font-bold text-xs"
        >
          Back to Resources
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between">
      <main className="px-4 sm:px-8 py-6 max-w-3xl mx-auto w-full z-10">
        {/* Back button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate('/resources')}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#728078] hover:text-[#263831] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Resources Library</span>
          </button>
        </div>

        {/* Main Content Article inside BentoCard */}
        <BentoCard variant="hero" className="p-6 sm:p-10 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold text-[#568469] uppercase tracking-wider mb-3">
            <span>{resource.category}</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-[#728078] normal-case">
              <Clock className="w-3.5 h-3.5" />
              {resource.readTime}
            </span>
            <span>·</span>
            <span className="text-[#728078] normal-case">For {resource.audience}s</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#263831] tracking-tight mb-4">
            {resource.title}
          </h1>

          <p className="text-sm sm:text-base text-[#728078] leading-relaxed mb-6 font-medium">
            {resource.description}
          </p>

          {/* Actionable takeaways */}
          {resource.takeaways && (
            <div className="p-5 rounded-2xl bg-[#F0EBDD]/70 border border-[#EAE7DF] mb-8">
              <h2 className="text-xs font-bold text-[#568469] uppercase tracking-wider mb-3">
                Actionable Strategies
              </h2>
              <ul className="space-y-2.5">
                {resource.takeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#263831] font-medium leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-[#568469] shrink-0 mt-0.5" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Full content paragraphs */}
          {resource.fullContent && (
            <div className="space-y-4 text-sm sm:text-base text-[#263831] leading-relaxed mb-8">
              <h2 className="text-lg font-bold text-[#263831]">
                In-Depth Practical Guidance
              </h2>
              {resource.fullContent.map((paragraph, idx) => (
                <p key={idx} className="text-[#728078] leading-relaxed font-medium">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          <div className="pt-6 border-t border-[#EAE7DF]/70 flex items-center justify-between">
            <span className="text-xs text-[#728078] font-semibold">
              Little Steps Affirming Care Framework
            </span>
            <button
              type="button"
              onClick={() => navigate('/resources')}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#568469] text-white text-xs font-bold hover:bg-[#456C55] transition-all cursor-pointer shadow-2xs"
            >
              <span>Explore More Guides</span>
            </button>
          </div>
        </BentoCard>
      </main>

      <RollingHillsFooter className="-mt-6" />
    </div>
  );
};
