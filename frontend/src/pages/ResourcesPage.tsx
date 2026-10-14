import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Clock, User, ArrowRight, Search, FileText, Heart } from 'lucide-react';
import { RESOURCES_CATALOG } from '../data/mockData';
import { BentoCard } from '../components/OrganicShapes';
import { SproutIcon, RollingHillsFooter } from '../components/OrganicDecorative';

export const ResourcesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const categories = ['All', 'Home Setup', 'Transitions', 'Affirming Care', 'Communication'];

  const filtered = RESOURCES_CATALOG.filter((res) => {
    const matchesCat = selectedCategory === 'All' || res.category === selectedCategory;
    const matchesSearch =
      res.title.toLowerCase().includes(search.toLowerCase()) ||
      res.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const leadResource = RESOURCES_CATALOG[0];
  const secondaryResources = RESOURCES_CATALOG.slice(1);

  return (
    <div className="flex-1 flex flex-col justify-between">
      <main className="px-4 sm:px-8 lg:px-12 py-4 max-w-[1360px] mx-auto w-full z-10">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8B5848] mb-2">
            <FileText className="w-4 h-4 text-[#8B5848]" />
            <span>Caregiver & Educator Resources</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#263831] tracking-tight">
            Practical Guides & Affirming Support
          </h1>
          <p className="text-sm text-[#728078] mt-1 font-medium max-w-xl">
            Evidence-informed, compassionate strategies for sensory environments, visual schedules, communication routines, and neurodiversity-affirming care.
          </p>
        </div>

        {/* Search and Category Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <div className="flex flex-wrap gap-2">
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

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#728078] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guides..."
              className="w-full pl-9 pr-3 py-2 rounded-full bg-[#FFFDF8] border border-[#EAE7DF] text-xs sm:text-sm text-[#263831] focus:outline-none focus:ring-2 focus:ring-[#568469]"
            />
          </div>
        </div>

        {/* Bento Layout */}
        <div className="space-y-6 mb-8">
          {/* Top Row: 8 cols Lead Resource + 4 cols Compassion Sanctuary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Lead Resource Bento (8 cols) */}
            <div className="lg:col-span-8">
              <BentoCard
                variant="hero"
                className="p-6 sm:p-8 h-full flex flex-col justify-between group cursor-pointer"
                onClick={() => navigate(`/resources/${leadResource.id}`)}
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#568469] uppercase tracking-wider mb-2">
                    <span>{leadResource.format}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-[#728078] normal-case">
                      <Clock className="w-3.5 h-3.5" />
                      {leadResource.readTime}
                    </span>
                    <span>·</span>
                    <span className="text-[#728078] normal-case">For {leadResource.audience}s</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#263831] mb-2 leading-tight group-hover:text-[#568469] transition-colors">
                    {leadResource.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#728078] leading-relaxed font-medium mb-5 max-w-2xl">
                    {leadResource.description}
                  </p>

                  {leadResource.takeaways && (
                    <div className="p-4 rounded-2xl bg-[#F0EBDD]/60 border border-[#EAE7DF] mb-5">
                      <p className="text-xs font-bold text-[#568469] mb-1.5 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Core Actionable Strategy:</span>
                      </p>
                      <p className="text-xs sm:text-sm text-[#263831] font-medium leading-relaxed">
                        {leadResource.takeaways[0]}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[#EAE7DF] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#728078]">
                    Evidence-informed · Practical implementation
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/resources/${leadResource.id}`);
                    }}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#568469] hover:bg-[#456C55] text-white text-xs font-bold shadow-2xs transition-all cursor-pointer"
                  >
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </BentoCard>
            </div>

            {/* Compassion Sanctuary Bento (4 cols) */}
            <div className="lg:col-span-4">
              <BentoCard
                variant="soft-cream"
                className="p-6 sm:p-7 h-full flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-9 h-9 rounded-2xl bg-[#F5DBD0] flex items-center justify-center text-[#8B5848]">
                      <Heart className="w-5 h-5 fill-[#8B5848]/20" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#8B5848] uppercase tracking-wider block">
                        Caregiver Note
                      </span>
                      <h3 className="font-bold text-base text-[#263831]">
                        Affirming Practice
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#728078] leading-relaxed mb-4 font-medium">
                    "Every autistic child communicates and perceives the world through a distinct sensory profile. Regulated caregivers create co-regulated children."
                  </p>

                  <div className="space-y-2 text-xs text-[#263831]">
                    <div className="p-3 rounded-2xl bg-[#FFFDF8] border border-[#E4DEC9] flex items-center gap-2">
                      <span className="text-[#568469] font-bold">🍃</span>
                      <span>Celebrate regulation before academic tasks</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#FFFDF8] border border-[#E4DEC9] flex items-center gap-2">
                      <span className="text-[#568469] font-bold">💛</span>
                      <span>Honor non-speaking and AAC communication</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E4DEC9] text-[11px] text-[#568469] font-bold">
                  You are doing meaningful work 💚
                </div>
              </BentoCard>
            </div>
          </div>

          {/* Lower Bento Grid: Filtered Resources */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {secondaryResources.map((res, index) => {
              const colSpan = index % 3 === 0 ? 'md:col-span-12' : index % 3 === 1 ? 'md:col-span-7' : 'md:col-span-5';
              const cardVariant = index % 2 === 0 ? 'companion' : 'featured';

              return (
                <div key={res.id} className={colSpan}>
                  <BentoCard
                    variant={cardVariant}
                    className="p-6 h-full flex flex-col justify-between group cursor-pointer"
                    onClick={() => navigate(`/resources/${res.id}`)}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#568469] uppercase tracking-wider">
                          {res.category} · {res.format}
                        </span>
                        <span className="text-xs font-semibold text-[#728078] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {res.readTime}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-[#263831] mb-2 group-hover:text-[#568469] transition-colors">
                        {res.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#728078] leading-relaxed mb-4 font-medium">
                        {res.description}
                      </p>

                      {res.takeaways && (
                        <div className="p-3.5 rounded-2xl bg-[#F0EBDD]/60 border border-[#EAE7DF] text-xs text-[#263831] mb-4">
                          <p className="font-bold text-[#568469] mb-1">Key Strategy:</p>
                          <p className="text-[#728078] leading-relaxed font-medium">{res.takeaways[0]}</p>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#EAE7DF] flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#728078]">
                        For {res.audience}s
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#568469] group-hover:translate-x-0.5 transition-transform">
                        <span>Read Guide</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
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
