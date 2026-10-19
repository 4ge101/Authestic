import React, { useState } from 'react';
import { MessageSquare, Volume2, Trash2, ArrowLeft, Heart, Sparkles } from 'lucide-react';
import { speakCardLabel, playGentleChime } from '../utils/audio';
import { BentoCard } from '../components/OrganicShapes';
import { SproutIcon, RollingHillsFooter } from '../components/OrganicDecorative';

interface PecsCard {
  id: string;
  label: string;
  category: 'wants' | 'feelings' | 'actions' | 'sensory';
  symbol: string;
  bgColor: string;
  borderColor: string;
}

const PECS_CARDS: PecsCard[] = [
  // Wants
  { id: 'water', label: 'Water', category: 'wants', symbol: '💧', bgColor: 'bg-[#DCE8EE]', borderColor: 'border-[#9CB6C4]' },
  { id: 'snack', label: 'Snack', category: 'wants', symbol: '🍎', bgColor: 'bg-[#F4DDD3]', borderColor: 'border-[#D9A392]' },
  { id: 'break', label: 'Take a Break', category: 'wants', symbol: '🛋️', bgColor: 'bg-[#E2EBD9]', borderColor: 'border-[#568469]' },
  { id: 'quiet', label: 'Quiet Room', category: 'wants', symbol: '🎧', bgColor: 'bg-[#F0EBDD]', borderColor: 'border-[#C8BFAB]' },
  { id: 'toys', label: 'Play Toys', category: 'wants', symbol: '🧩', bgColor: 'bg-[#F5D998]', borderColor: 'border-[#E5BE60]' },
  { id: 'bathroom', label: 'Bathroom', category: 'wants', symbol: '🚪', bgColor: 'bg-[#DCE8EE]', borderColor: 'border-[#9CB6C4]' },

  // Feelings
  { id: 'happy', label: 'I Feel Happy', category: 'feelings', symbol: '😊', bgColor: 'bg-[#F5D998]', borderColor: 'border-[#E5BE60]' },
  { id: 'calm', label: 'I Feel Calm', category: 'feelings', symbol: '🍃', bgColor: 'bg-[#E2EBD9]', borderColor: 'border-[#568469]' },
  { id: 'tired', label: 'I Feel Tired', category: 'feelings', symbol: '😴', bgColor: 'bg-[#DCE8EE]', borderColor: 'border-[#9CB6C4]' },
  { id: 'overwhelmed', label: 'Need Quiet Time', category: 'feelings', symbol: '🫧', bgColor: 'bg-[#F4DDD3]', borderColor: 'border-[#D9A392]' },

  // Actions
  { id: 'help', label: 'I Need Help', category: 'actions', symbol: '🤝', bgColor: 'bg-[#F5D998]', borderColor: 'border-[#E5BE60]' },
  { id: 'outside', label: 'Go Outside', category: 'actions', symbol: '🌳', bgColor: 'bg-[#E2EBD9]', borderColor: 'border-[#568469]' },
  { id: 'hug', label: 'Gentle Hug', category: 'actions', symbol: '💛', bgColor: 'bg-[#F4DDD3]', borderColor: 'border-[#D9A392]' },
  { id: 'read', label: 'Read Story', category: 'actions', symbol: '📖', bgColor: 'bg-[#F0EBDD]', borderColor: 'border-[#C8BFAB]' },
];

export const CommunicationPage: React.FC = () => {
  const [selectedCards, setSelectedCards] = useState<PecsCard[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Wants', 'Feelings', 'Actions'];

  const filteredCards = PECS_CARDS.filter((c) => {
    if (selectedCategory === 'All') return true;
    return c.category === selectedCategory.toLowerCase();
  });

  const handleCardClick = (card: PecsCard) => {
    setSelectedCards((prev) => [...prev, card]);
    playGentleChime(true, 520);
    speakCardLabel(card.label, true);
  };

  const handleClear = () => {
    setSelectedCards([]);
  };

  const handleSpeakFullSentence = () => {
    if (selectedCards.length === 0) return;
    const sentence = selectedCards.map((c) => c.label).join(', ');
    speakCardLabel(sentence, true);
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <main className="px-4 sm:px-8 lg:px-12 py-4 max-w-[1360px] mx-auto w-full z-10">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#3E6C80] mb-2">
            <MessageSquare className="w-4 h-4 text-[#3E6C80]" />
            <span>Visual Communication Board</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#263831] tracking-tight">
            Picture Words & Choice Cards
          </h1>
          <p className="text-sm text-[#728078] mt-1 font-medium max-w-xl">
            Tap visual cards to build phrases and express feelings or wants. Tap "Speak Message" to hear your sentence read aloud.
          </p>
        </div>

        {/* Bento Sentence Strip */}
        <BentoCard
          variant="hero"
          className="mb-6 p-4 sm:p-6 min-h-[100px] flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex-1 flex flex-wrap items-center gap-2.5 w-full">
            {selectedCards.length === 0 ? (
              <span className="text-sm font-semibold text-[#728078] italic">
                Tap picture cards below to build your sentence...
              </span>
            ) : (
              selectedCards.map((card, idx) => (
                <div
                  key={`${card.id}-${idx}`}
                  style={{
                    borderRadius: '20px 28px 18px 24px / 26px 18px 24px 20px',
                  }}
                  className={`flex items-center gap-2 px-4 py-2 border ${card.bgColor} ${card.borderColor} text-xs font-bold text-[#263831] shadow-2xs animate-in zoom-in-95`}
                >
                  <span className="text-xl">{card.symbol}</span>
                  <span>{card.label}</span>
                </div>
              ))
            )}
          </div>

          {selectedCards.length > 0 && (
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={handleSpeakFullSentence}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#568469] text-white text-xs font-bold shadow-2xs hover:bg-[#456C55] transition-all cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Speak Message</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="p-2.5 rounded-full bg-[#F0EBDD] text-[#728078] hover:text-[#263831] transition-colors cursor-pointer"
                title="Clear sentence"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </BentoCard>

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

        {/* Cards Grid with Organic Shapes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {filteredCards.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => handleCardClick(card)}
              style={{
                borderRadius: '28px 36px 24px 32px / 34px 24px 32px 26px',
              }}
              className={`p-5 border-2 ${card.bgColor} ${card.borderColor} flex flex-col items-center justify-center text-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#568469] min-h-[120px]`}
            >
              <span className="text-3xl mb-2">{card.symbol}</span>
              <span className="text-xs font-bold text-[#263831]">
                {card.label}
              </span>
            </button>
          ))}
        </div>
      </main>

      <RollingHillsFooter className="-mt-6" />
    </div>
  );
};
