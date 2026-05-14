import React from 'react';
import { Compass, Sliders } from 'lucide-react';

interface LobbyScreenProps {
  onStartSearch: () => void;
  onOpenRooms: () => void;
  starsBalance: number;
  dailyChallenge: any;
  challengeStreak: number;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  onStartSearch,
  onOpenRooms,
  dailyChallenge,
  challengeStreak
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-12 bg-gradient-to-b from-[#030305] to-[#0A0A0B]">
      <div className="text-center space-y-4">
        <div className="text-6xl mb-2">🌌</div>
        <h2 className="text-4xl font-bold tracking-tighter">Тайная Комната</h2>
        <p className="text-gray-400 text-lg max-w-xs">
          Анонимные разговоры.<br />Настоящие эмоции.
        </p>
      </div>

      <button
        onClick={onStartSearch}
        className="w-56 h-56 rounded-3xl bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 
                   flex flex-col items-center justify-center shadow-2xl shadow-purple-500/40 
                   hover:scale-105 active:scale-95 transition-all duration-300 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity" />
        <span className="text-7xl mb-4 transition-transform group-hover:scale-110">🔮</span>
        <span className="text-xl font-bold tracking-widest">ВОЙТИ В КОМНАТУ</span>
      </button>

      <div className="flex gap-4">
        <button className="flex items-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all">
          <Sliders className="w-5 h-5" />
          <span>Фильтры</span>
        </button>

        <button 
          onClick={onOpenRooms}
          className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/30 hover:border-cyan-400/50 rounded-2xl transition-all"
        >
          <Compass className="w-5 h-5 text-cyan-400" />
          <span>Комнаты</span>
        </button>
      </div>

      {/* Дневной челлендж */}
      {dailyChallenge && !dailyChallenge.completed && (
        <div className="w-full max-w-md bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-500/30 rounded-3xl p-5">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{dailyChallenge.task.emoji}</span>
            <div>
              <p className="text-purple-400 text-xs font-bold">ДНЕВНОЙ ЧЕЛЛЕНДЖ</p>
              <p className="text-white">{dailyChallenge.task.description}</p>
            </div>
          </div>
          {challengeStreak > 0 && (
            <div className="mt-3 text-orange-400 text-sm flex items-center gap-1">
              🔥 Серия: {challengeStreak} дней
            </div>
          )}
        </div>
      )}
    </div>
  );
};