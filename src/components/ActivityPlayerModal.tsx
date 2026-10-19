import React, { useState } from 'react';
import { X, RotateCcw, Check, Sparkles, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { Activity } from '../types';
import { playGentleChime, playSoftSuccess } from '../utils/audio';

interface ActivityPlayerModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  onCompleteActivity: (activityId: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

interface PuzzleShape {
  id: string;
  name: string;
  iconSymbol: string;
  colorBg: string;
  colorBorder: string;
}

const PUZZLE_SHAPES: PuzzleShape[] = [
  { id: 'star', name: 'Star', iconSymbol: '★', colorBg: 'bg-[#F5D998]', colorBorder: 'border-[#E5BE60]' },
  { id: 'circle', name: 'Circle', iconSymbol: '●', colorBg: 'bg-[#DCE8EE]', colorBorder: 'border-[#9CB6C4]' },
  { id: 'leaf', name: 'Leaf', iconSymbol: '✿', colorBg: 'bg-[#E2EBD9]', colorBorder: 'border-[#568469]' },
  { id: 'moon', name: 'Moon', iconSymbol: '☾', colorBg: 'bg-[#F4DDD3]', colorBorder: 'border-[#D9A392]' },
];

export const ActivityPlayerModal: React.FC<ActivityPlayerModalProps> = ({
  activity,
  isOpen,
  onClose,
  onCompleteActivity,
  soundEnabled,
  onToggleSound,
}) => {
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [matchedShapes, setMatchedShapes] = useState<string[]>([]);
  const [affirmation, setAffirmation] = useState<string>('Match each friendly shape to its wooden spot.');

  if (!isOpen || !activity) return null;

  const handleSelectShape = (shapeId: string) => {
    if (matchedShapes.includes(shapeId)) return;
    setSelectedShape(shapeId);
    playGentleChime(soundEnabled, 480);
    setAffirmation('Now tap the matching slot below.');
  };

  const handleMatchSlot = (slotId: string) => {
    if (!selectedShape) {
      setAffirmation('Tap a shape from the shelf first.');
      return;
    }

    if (selectedShape === slotId) {
      const nextMatched = [...matchedShapes, slotId];
      setMatchedShapes(nextMatched);
      setSelectedShape(null);
      playSoftSuccess(soundEnabled);

      if (nextMatched.length === PUZZLE_SHAPES.length) {
        setAffirmation('Wonderful job! All pieces are resting happily.');
        onCompleteActivity(activity.id);
      } else {
        setAffirmation('Lovely match! Keep exploring at your own pace.');
      }
    } else {
      playGentleChime(soundEnabled, 330);
      setAffirmation('Almost! Let us try another spot together.');
    }
  };

  const handleReset = () => {
    setMatchedShapes([]);
    setSelectedShape(null);
    setAffirmation('Match each friendly shape to its wooden spot.');
  };

  const isCompleted = matchedShapes.length === PUZZLE_SHAPES.length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="activity-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#263831]/40 backdrop-blur-xs animate-in fade-in"
    >
      <div className="w-full max-w-2xl bg-[#FFFDF8] border border-[#EAE7DF] rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col justify-between max-h-[90vh] overflow-y-auto">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE7DF]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[#728078] hover:text-[#263831] hover:bg-[#F0EBDD] transition-colors"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-xs font-bold text-[#568469] uppercase tracking-wider">
                {activity.category}
              </span>
              <h3 id="activity-title" className="text-xl font-bold text-[#263831]">
                {activity.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleSound}
              className={`p-2 rounded-xl border transition-colors ${
                soundEnabled
                  ? 'bg-[#E2EBD9] border-[#568469] text-[#568469]'
                  : 'bg-[#FFFDF8] border-[#EAE7DF] text-[#728078]'
              }`}
              aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[#728078] hover:text-[#263831] hover:bg-[#F0EBDD] transition-colors"
              aria-label="Close activity"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="my-6">
          {activity.id === 'act-puzzle-time' ? (
            <div>
              {/* Encouragement message banner */}
              <div className="bg-[#F0EBDD]/70 border border-[#EAE7DF] rounded-2xl p-3.5 mb-6 text-center">
                <p className="text-sm font-bold text-[#263831]">
                  {affirmation}
                </p>
                <p className="text-xs text-[#728078] mt-0.5">
                  No rush, no timer. Take all the time you need.
                </p>
              </div>

              {/* Top Shelf: Available pieces */}
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[#728078] mb-2 text-center">
                  Puzzle Pieces Shelf
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {PUZZLE_SHAPES.map((shape) => {
                    const isMatched = matchedShapes.includes(shape.id);
                    const isSelected = selectedShape === shape.id;
                    return (
                      <button
                        key={shape.id}
                        type="button"
                        disabled={isMatched}
                        onClick={() => handleSelectShape(shape.id)}
                        className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-bold text-2xl transition-all shadow-xs border-2 ${
                          isMatched
                            ? 'opacity-20 cursor-default bg-[#F0EBDD] border-transparent'
                            : isSelected
                            ? `${shape.colorBg} ${shape.colorBorder} ring-4 ring-[#568469]/30 scale-105`
                            : `${shape.colorBg} ${shape.colorBorder} hover:scale-105`
                        }`}
                        aria-label={`Select ${shape.name}`}
                      >
                        <span>{shape.iconSymbol}</span>
                        <span className="text-[10px] mt-1 text-[#263831] font-semibold">
                          {shape.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Wooden Puzzle Board Slots */}
              <div className="bg-[#F0EBDD] border-4 border-[#EAE7DF] rounded-3xl p-6 shadow-inner">
                <p className="text-xs font-bold uppercase tracking-wider text-[#728078] mb-3 text-center">
                  Wooden Puzzle Board
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {PUZZLE_SHAPES.map((shape) => {
                    const isMatched = matchedShapes.includes(shape.id);
                    return (
                      <button
                        key={shape.id}
                        type="button"
                        onClick={() => handleMatchSlot(shape.id)}
                        className={`h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
                          isMatched
                            ? `${shape.colorBg} border-solid ${shape.colorBorder} shadow-sm`
                            : 'border-[#728078]/40 hover:border-[#568469] bg-[#FFFDF8]/40'
                        }`}
                        aria-label={`Slot for ${shape.name}`}
                      >
                        {isMatched ? (
                          <>
                            <span className="text-3xl">{shape.iconSymbol}</span>
                            <span className="text-[11px] font-bold text-[#263831] mt-1">
                              Matched!
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-xl text-[#728078]/50">{shape.iconSymbol}</span>
                            <span className="text-[10px] text-[#728078] font-medium mt-1">
                              Place {shape.name}
                            </span>
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Story View or Generic Activity View */
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden aspect-16/9 max-h-64 bg-[#F0EBDD] border border-[#EAE7DF]">
                <img
                  src={activity.thumbnail}
                  alt={activity.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-[#F0EBDD]/60 rounded-2xl p-5 border border-[#EAE7DF]">
                <h4 className="font-bold text-base text-[#263831] mb-2">
                  {activity.title}
                </h4>
                <p className="text-sm text-[#728078] leading-relaxed mb-4">
                  {activity.description}
                </p>
                <p className="text-xs text-[#568469] font-semibold">
                  Today's Story Step: Robin and the peaceful morning meadow.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-[#EAE7DF]">
          {activity.id === 'act-puzzle-time' ? (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#728078] hover:text-[#263831] hover:bg-[#F0EBDD] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Puzzle</span>
            </button>
          ) : (
            <span className="text-xs text-[#728078]">
              Read and explore at your own calm pace
            </span>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-[#728078] hover:bg-[#F0EBDD] transition-colors"
            >
              Take a break
            </button>

            <button
              type="button"
              onClick={() => {
                onCompleteActivity(activity.id);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#568469] hover:bg-[#456C55] text-[#FFFDF8] font-bold text-sm shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Done for now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
