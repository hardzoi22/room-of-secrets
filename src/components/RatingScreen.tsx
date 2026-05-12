import React from 'react';
import { Sparkles, Check, X } from 'lucide-react';
import { useApp } from '@/store';

const REACTIONS = [
  { id: 'fire', emoji: '🔥', label: 'Интересный', color: 'hover:bg-orange-500/20' },
  { id: 'angel', emoji: '😇', label: 'Добрый', color: 'hover:bg-emerald-500/20' },
  { id: 'brain', emoji: '🧠', label: 'Умный', color: 'hover:bg-purple-500/20' },
  { id: 'toxic', emoji: '💩', label: 'Токсичный', color: 'hover:bg-red-500/20' },
];

export default function RatingScreen() {
  const { showRatingScreen, ratingReaction, setRatingReaction, submitRating, setActiveTab } = useApp();

  if (!showRatingScreen) return null;

  return (
    <div className="absolute inset-0 bg-[#050506]/95 z-40 flex flex-col justify-center p-4">
      <div className="glass-panel-purple p-6 rounded-3xl space-y-5 text-center relative border-purple-500/20 max-w-md mx-auto w-full">
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full bg-[#1C1C1F] border border-purple-500/30 flex items-center justify-center shadow-glow-purple">
          <Sparkles className="w-10 h-10 text-[#B388FF] animate-pulse" />
        </div>

        <div className="pt-8">
          <h3 className="text-lg font-extrabold text-white">Оставьте тайный отзыв</h3>
          <p className="text-xs text-gray-400 mt-1">Ваш отзыв анонимен и влияет на карму собеседника</p>
        </div>

        <div className="space-y-2">
          <span className="text-[11px] text-gray-500 uppercase tracking-widest font-mono">Выберите реакцию</span>
          <div className="grid grid-cols-4 gap-2">
            {REACTIONS.map(react => (
              <button
                key={react.id}
                onClick={() => setRatingReaction(react.id)}
                className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center ${react.color} ${
                  ratingReaction === react.id
                    ? 'bg-purple-500/20 border-purple-400 scale-105 shadow-glow-purple'
                    : 'bg-white/[0.03] border-white/[0.05]'
                }`}
              >
                <span className="text-2xl mb-1">{react.emoji}</span>
                <span className="text-[9px] text-gray-400">{react.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => { setActiveTab('lobby'); }}
            className="py-2.5 rounded-xl border border-white/[0.1] hover:bg-white/[0.05] text-gray-400 text-xs font-semibold flex items-center justify-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> Пропустить
          </button>
          <button
            onClick={submitRating}
            disabled={!ratingReaction}
            className="py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 font-bold text-xs text-white shadow-glow-purple disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
          >
            <Check className="w-3.5 h-3.5" /> Отправить
          </button>
        </div>
      </div>
    </div>
  );
}
