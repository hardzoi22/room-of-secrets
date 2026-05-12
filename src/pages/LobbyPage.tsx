import React, { useState } from 'react';
import { Compass, Sliders, Sparkles } from 'lucide-react';
import { useApp } from '@/store';
import FilterModal from '@/components/FilterModal';

export default function LobbyPage() {
  const { isSearching, searchProgress, startSearch, cancelSearch, filters } = useApp();
  const [showFilters, setShowFilters] = useState(false);

  const getFilterLabel = () => {
    const parts = [];
    if (filters.gender !== 'all') parts.push(filters.gender === 'male' ? '👨' : '👩');
    if (filters.country !== 'all') parts.push('🌍');
    if (filters.ageRange[0] !== 18 || filters.ageRange[1] !== 35) parts.push(`${filters.ageRange[0]}-${filters.ageRange[1]}л`);
    return parts.length > 0 ? parts.join(' • ') : 'Все';
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 space-y-6 overflow-y-auto relative">
      <FilterModal isOpen={showFilters} onClose={() => setShowFilters(false)} />

      <div className="text-center space-y-1.5 pt-2">
        <h2 className="text-xl font-bold text-glow-purple tracking-wide text-white">Тайный Чат 1-на-1</h2>
        <p className="text-xs text-gray-500">Анонимно. Безопасно. Интересно.</p>
      </div>

      <div className="flex flex-col items-center justify-center py-6 relative flex-1">
        {isSearching ? (
          <div className="absolute w-56 h-56 rounded-full bg-cyan-400/10 border border-cyan-400/20 animate-pulse-ring-fast flex items-center justify-center">
            <div className="w-44 h-44 rounded-full bg-purple-500/10 border border-purple-500/20 animate-pulse-ring-slow" />
          </div>
        ) : (
          <div className="absolute w-44 h-44 rounded-full bg-purple-500/5 border border-purple-500/10 animate-pulse-ring-slow" />
        )}

        <button
          onClick={isSearching ? cancelSearch : startSearch}
          className={`relative z-10 w-36 h-36 rounded-full flex flex-col items-center justify-center p-4 transition-all duration-300 ${
            isSearching
              ? 'bg-gradient-to-br from-[#00E5FF]/20 via-[#00E5FF]/5 to-[#B388FF]/10 border-2 border-cyan-400 shadow-glow-cyan scale-95'
              : 'bg-gradient-to-br from-[#B388FF] via-purple-700 to-indigo-900 text-white shadow-glow-purple border border-purple-400 hover:scale-105 active:scale-95'
          }`}
        >
          {isSearching ? (
            <>
              <span className="text-3xl mb-1.5 animate-spin">🔮</span>
              <span className="text-xs font-black tracking-widest text-cyan-400 text-glow-cyan animate-pulse">ПОИСК...</span>
              <span className="text-[9px] text-gray-400 font-mono mt-1 font-bold">{searchProgress}%</span>
            </>
          ) : (
            <>
              <Sparkles className="w-10 h-10 mb-2 text-white/90" />
              <span className="text-xs font-black tracking-wider text-center leading-tight">ВОЙТИ В<br/>КОМНАТУ</span>
            </>
          )}
        </button>

        <div className="mt-6 bg-[#1C1C1F]/80 border border-white/[0.04] px-4 py-1.5 rounded-full text-center flex items-center space-x-2 shadow-sm relative z-10">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[11px] text-gray-300">Сейчас <strong className="text-purple-300 font-mono">128</strong> человек ждут</span>
        </div>
      </div>

      <div className="space-y-3 bg-[#1C1C1F]/40 border border-white/[0.04] p-3 rounded-2xl">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-gray-300 flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            Фильтры поиска
          </span>
          <button
            onClick={() => setShowFilters(true)}
            className="text-[11px] font-bold text-[#00E5FF] hover:underline"
          >
            {getFilterLabel()}
          </button>
        </div>
      </div>
    </div>
  );
}
