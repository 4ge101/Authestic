import React, { useState } from 'react';
import { X, Volume2, Trash2, ArrowLeft } from 'lucide-react';
import { speakCardLabel, playGentleChime } from '../utils/audio';

interface CommunicationBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  voiceGuidance: boolean;
  soundEnabled: boolean;
}

interface PecsCard {
  id: string;
  label: string;
  category: 'wants' | 'feelings' | 'actions';
  symbol: string;
  bgColor: string;
  borderColor: string;
}

const PECS_CARDS: PecsCard[] = [
  { id: 'water', label: 'Water', category: 'wants', symbol: '💧', bgColor: 'bg-[#DCE8EE]', borderColor: 'border-[#9CB6C4]' },
  { id: 'snack', label: 'Snack', category: 'wants', symbol: '🍎', bgColor: 'bg-[#F4DDD3]', borderColor: 'border-[#D9A392]' },
  { id: 'break', label: 'Take a Break', category: 'wants', symbol: '🛋️', bgColor: 'bg-[#E2EBD9]', borderColor: 'border-[#568469]' },
  { id: 'quiet', label: 'Quiet Room', category: 'wants', symbol: '🎧', bgColor: 'bg-[#F0EBDD]', borderColor: 'border-[#C8BFAB]' },
  { id: 'play', label: 'Play Toys', category: 'wants', symbol: '🧩', bgColor: 'bg-[#F5D998]', borderColor: 'border-[#E5BE60]' },
  { id: 'outside', label: 'Go Outside', category: 'actions', symbol: '🌳', bgColor: 'bg-[#E2EBD9]', borderColor: 'border-[#568469]' },
  { id: 'help', label: 'I Need Help', category: 'wants', symbol: '🤝', bgColor: 'bg-[#F5D998]', borderColor: 'border-[#E5BE60]' },
  { id: 'happy', label: 'I Feel Happy', category: 'feelings', symbol: '😊', bgColor: 'bg-[#F5D998]', borderColor: 'border-[#E5BE60]' },
  { id: 'tired', label: 'I Feel Tired', category: 'feelings', symbol: '😴', bgColor: 'bg-[#DCE8EE]', borderColor: 'border-[#9CB6C4]' },
  { id: 'hug', label: 'Gentle Hug', category: 'feelings', symbol: '💛', bgColor: 'bg-[#F4DDD3]', borderColor: 'border-[#D9A392]' },
];

export const CommunicationBoardModal: React.FC<CommunicationBoardModalProps> = ({
  isOpen,
  onClose,
  voiceGuidance,
  soundEnabled,
}) => {
  const [selectedCards, setSelectedCards] = useState<PecsCard[]>([]);

  if (!isOpen) return null;

  const handleCardClick = (card: PecsCard) => {
    setSelectedCards((prev) => [...prev, card]);
    playGentleChime(soundEnabled, 520);
    speakCardLabel(card.label, voiceGuidance);
  };

  const handleClearStrip = () => {
    setSelectedCards([]);
  };

  const handleSpeakSentence = () => {
    if (selectedCards.length === 0) return;
    const fullSentence = selectedCards.map((c) => c.label).join(', ');
    speakCardLabel(fullSentence, true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="comm-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#263831]/40 backdrop-blur-xs animate-in fade-in"
    >
      <div className="w-full max-w-3xl bg-[#FFFDF8] border border-[#EAE7DF] rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col justify-between max-h-[90vh] overflow-y-auto">
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
                Visual Choice Board
              </span>
              <h3 id="comm-title" className="text-xl font-bold text-[#263831]">
                Communication Cards
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#728078] hover:text-[#263831] hover:bg-[#F0EBDD] transition-colors"
            aria-label="Close communication board"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sentence Strip */}
        <div className="my-5 p-4 rounded-2xl bg-[#F0EBDD] border border-[#EAE7DF] min-h-[90px] flex items-center justify-between gap-3">
          <div className="flex-1 flex flex-wrap items-center gap-2">
            {selectedCards.length === 0 ? (
              <span className="text-sm font-semibold text-[#728078]">
                Tap cards below to build your message...
              </span>
            ) : (
              selectedCards.map((card, idx) => (
                <div
                  key={`${card.id}-${idx}`}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${card.bgColor} ${card.borderColor} shadow-xs font-bold text-xs text-[#263831]`}
                >
                  <span className="text-base">{card.symbol}</span>
                  <span>{card.label}</span>
                </div>
              ))
            )}
          </div>

          {selectedCards.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSpeakSentence}
                className="p-2.5 rounded-xl bg-[#568469] text-[#FFFDF8] hover:bg-[#456C55] transition-colors flex items-center gap-1 text-xs font-bold shadow-xs"
                title="Speak message aloud"
              >
                <Volume2 className="w-4 h-4" />
                <span className="hidden sm:inline">Speak</span>
              </button>
              <button
                type="button"
                onClick={handleClearStrip}
                className="p-2.5 rounded-xl bg-[#FFFDF8] border border-[#EAE7DF] text-[#728078] hover:text-[#263831] transition-colors"
                title="Clear message"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 my-2">
          {PECS_CARDS.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => handleCardClick(card)}
              className={`p-4 rounded-2xl border-2 ${card.bgColor} ${card.borderColor} flex flex-col items-center justify-center text-center transition-all hover:scale-105 active:scale-95 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#568469]`}
            >
              <span className="text-3xl mb-1.5">{card.symbol}</span>
              <span className="text-xs font-bold text-[#263831]">
                {card.label}
              </span>
            </button>
          ))}
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-[#EAE7DF] flex items-center justify-between text-xs text-[#728078]">
          <span>Non-verbal & PECS supportive visual cues</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#568469] text-[#FFFDF8] font-bold"
          >
            Finished
          </button>
        </div>
      </div>
    </div>
  );
};
