import React, { useState } from 'react';
import { X, Play, Clock, ArrowLeft } from 'lucide-react';
import { Activity, ActivityCategory } from '../types';

interface AllActivitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: Activity[];
  onSelectActivity: (activity: Activity) => void;
  initialCategory?: ActivityCategory | 'All';
}

export const AllActivitiesModal: React.FC<AllActivitiesModalProps> = ({
  isOpen,
  onClose,
  activities,
  onSelectActivity,
  initialCategory = 'All',
}) => {
  const [selectedFilter, setSelectedFilter] = useState<ActivityCategory | 'All'>(initialCategory);

  if (!isOpen) return null;

  const categories: (ActivityCategory | 'All')[] = [
    'All',
    'Learn',
    'Play',
    'Communication',
    'Life Skills',
    'Stories',
    'Sensory',
  ];

  const filtered = activities.filter((act) => {
    if (selectedFilter === 'All') return true;
    return act.category === selectedFilter;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="all-activities-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#263831]/40 backdrop-blur-xs animate-in fade-in"
    >
      <div className="w-full max-w-4xl bg-[#FFFDF8] border border-[#EAE7DF] rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col justify-between max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE7DF]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[#728078] hover:text-[#263831] hover:bg-[#F0EBDD] transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-xs font-bold text-[#568469] uppercase tracking-wider">
                Learning Activities
              </span>
              <h3 id="all-activities-title" className="text-xl font-bold text-[#263831]">
                Activities Catalogue
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#728078] hover:text-[#263831] hover:bg-[#F0EBDD] transition-colors"
            aria-label="Close activities catalogue"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="py-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === cat
                  ? 'bg-[#568469] text-[#FFFDF8] shadow-xs'
                  : 'bg-[#F0EBDD] text-[#728078] hover:text-[#263831] hover:bg-[#EAE7DF]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Activity Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-3">
          {filtered.map((activity) => (
            <div
              key={activity.id}
              className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#EAE7DF] hover:border-[#568469]/50 transition-all flex flex-col justify-between group shadow-xs"
            >
              <div>
                <div className="rounded-xl overflow-hidden aspect-16/10 mb-3 bg-[#F0EBDD] border border-[#EAE7DF]">
                  <img
                    src={activity.thumbnail}
                    alt={activity.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-bold text-[#728078] mb-1">
                  <span className="text-[#568469]">{activity.category}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activity.durationMinutes}m
                  </span>
                </div>

                <h4 className="font-bold text-sm text-[#263831] mb-1">
                  {activity.title}
                </h4>
                <p className="text-xs text-[#728078] line-clamp-2 leading-relaxed">
                  {activity.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#EAE7DF] flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#728078]">
                  {activity.completedSteps ? `${activity.completedSteps}/${activity.totalSteps} steps` : 'Not started'}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    onSelectActivity(activity);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#568469] hover:bg-[#456C55] text-[#FFFDF8] text-xs font-bold transition-colors shadow-xs"
                >
                  <Play className="w-3 h-3 fill-[#FFFDF8]" />
                  <span>Start</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#EAE7DF] flex items-center justify-between text-xs text-[#728078]">
          <span>Showing {filtered.length} accessible activities</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#F0EBDD] text-[#263831] font-bold hover:bg-[#EAE7DF] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
