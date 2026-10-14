import React from 'react';
import { Play, Sparkles, BookOpen } from 'lucide-react';
import { Activity, ResourceItem } from '../types';

interface SearchResultsOverlayProps {
  query: string;
  activities: Activity[];
  resources: ResourceItem[];
  onSelectActivity: (activity: Activity) => void;
  onOpenResource: (resource: ResourceItem) => void;
  onClose: () => void;
}

export const SearchResultsOverlay: React.FC<SearchResultsOverlayProps> = ({
  query,
  activities,
  resources,
  onSelectActivity,
  onOpenResource,
  onClose,
}) => {
  if (!query.trim()) return null;

  const lower = query.toLowerCase();

  const matchingActivities = activities.filter(
    (a) =>
      a.title.toLowerCase().includes(lower) ||
      a.description.toLowerCase().includes(lower) ||
      a.category.toLowerCase().includes(lower) ||
      a.tags.some((t) => t.toLowerCase().includes(lower))
  );

  const matchingResources = resources.filter(
    (r) =>
      r.title.toLowerCase().includes(lower) ||
      r.description.toLowerCase().includes(lower) ||
      r.category.toLowerCase().includes(lower)
  );

  const hasResults = matchingActivities.length > 0 || matchingResources.length > 0;

  return (
    <div className="absolute right-0 top-full mt-2 w-full max-w-lg bg-[#FFFDF8] border border-[#EAE7DF] rounded-2xl shadow-xl p-4 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
      <div className="flex items-center justify-between pb-2 border-b border-[#EAE7DF] mb-3 text-xs">
        <span className="font-bold text-[#263831]">
          Results for "{query}"
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-[#728078] hover:text-[#263831] font-medium"
        >
          Dismiss
        </button>
      </div>

      {!hasResults ? (
        <div className="py-6 text-center text-xs text-[#728078]">
          <p className="font-semibold text-[#263831] mb-1">No activities found</p>
          <p>Try searching for "puzzle", "story", "shapes", or "sensory".</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
          {matchingActivities.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-[#568469] uppercase tracking-wider mb-2">
                Activities ({matchingActivities.length})
              </p>
              <div className="space-y-2">
                {matchingActivities.map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => {
                      onSelectActivity(act);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-[#F8F6F0] hover:bg-[#F0EBDD] transition-colors flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#E2EBD9] flex items-center justify-center text-[#568469] shrink-0">
                        <Play className="w-3.5 h-3.5 fill-[#568469]" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-[#263831] group-hover:text-[#568469] truncate">
                          {act.title}
                        </p>
                        <p className="text-[11px] text-[#728078] truncate">
                          {act.category} · {act.durationMinutes}m
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-[#568469] shrink-0">
                      Open
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchingResources.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-[#728078] uppercase tracking-wider mb-2">
                Caregiver Guides ({matchingResources.length})
              </p>
              <div className="space-y-2">
                {matchingResources.map((res) => (
                  <button
                    key={res.id}
                    type="button"
                    onClick={() => {
                      onOpenResource(res);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-[#F8F6F0] hover:bg-[#F0EBDD] transition-colors flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#DCE8EE] flex items-center justify-center text-[#486D7D] shrink-0">
                        <BookOpen className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-[#263831] group-hover:text-[#568469] truncate">
                          {res.title}
                        </p>
                        <p className="text-[11px] text-[#728078] truncate">
                          {res.category} · {res.readTime}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-[#728078] shrink-0">
                      Read
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
