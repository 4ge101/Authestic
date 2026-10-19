import React from 'react';
import { X, BookOpen, Clock, User, ArrowLeft } from 'lucide-react';
import { ResourceItem } from '../types';

interface ResourceReaderModalProps {
  resource: ResourceItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ResourceReaderModal: React.FC<ResourceReaderModalProps> = ({
  resource,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !resource) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="resource-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#263831]/40 backdrop-blur-xs animate-in fade-in"
    >
      <div className="w-full max-w-2xl bg-[#FFFDF8] border border-[#EAE7DF] rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col justify-between max-h-[90vh] overflow-y-auto">
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
                {resource.category}
              </span>
              <h3 id="resource-title" className="text-xl font-bold text-[#263831]">
                {resource.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#728078] hover:text-[#263831] hover:bg-[#F0EBDD] transition-colors"
            aria-label="Close guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-6 space-y-4 text-[#263831]">
          <div className="flex items-center gap-4 text-xs text-[#728078] font-semibold">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {resource.readTime}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              For {resource.audience}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F0EBDD]/60 border border-[#EAE7DF] text-sm leading-relaxed text-[#263831]">
            <p className="font-semibold mb-2">Key Takeaway:</p>
            <p className="text-[#728078]">{resource.description}</p>
          </div>

          <div className="space-y-3 text-sm text-[#263831] leading-relaxed">
            <h4 className="font-bold text-base text-[#263831]">Practical Strategies</h4>
            <p className="text-[#728078]">
              Children thrive when sensory environments match their current nervous system capacity. Rather than pushing for fixed completion times or constant eye contact, allow spontaneous breaks, physical fidget objects, and comfortable lighting.
            </p>
            <p className="text-[#728078]">
              Supportive language like "Let us try together" and "You can pause whenever you need" preserves emotional safety and intrinsic motivation.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#EAE7DF] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#568469] text-[#FFFDF8] font-bold text-sm hover:bg-[#456C55] transition-colors"
          >
            Finished Reading
          </button>
        </div>
      </div>
    </div>
  );
};
