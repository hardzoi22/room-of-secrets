============================================================
FILE: src/components/BottomNav.tsx
============================================================
import { Compass, MessageSquare, Award, User } from 'lucide-react';
import { useApp } from '@/store';
import type { Tab } from '@/types';

const TABS: { id: Tab; icon: typeof Compass; label: string }[] = [
  { id: 'lobby', icon: Compass, label: 'Поиск' },
  { id: 'chat', icon: MessageSquare, label: 'Чат' },
  { id: 'reviews', icon: Award, label: 'Отзывы' },
  { id: 'profile', icon: User, label: 'Профиль' },
];

export default function BottomNav() {
  const { activeTab, setActiveTab, chatSessionActive } = useApp();

  return (
    <nav className="bg-[#0A0A0B] border-t border-white/[0.05] px-2 py-2.5 flex justify-around items-center z-40 shrink-0">
      {TABS.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const isDisabled = tab.id === 'chat' && !chatSessionActive;

        return (
          <button
            key={tab.id}
            onClick={() => {
              if (isDisabled) return;
              setActiveTab(tab.id);
            }}
            disabled={isDisabled}
            className={`flex flex-col items-center space-y-1 py-1 px-3 rounded-xl transition-all relative ${
              isActive ? 'text-purple-400' : isDisabled ? 'text-gray-700 cursor-not-allowed' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-[8px] tracking-wide font-medium">{tab.label}</span>
            {tab.id === 'chat' && chatSessionActive && (
              <span className="absolute top-1 right-3.5 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            )}
          </button>
        );
      })}
    </nav>
  );
}


============================================================
FILE: src/components/FilterModal.tsx
============================================================
import { X, Sliders, Check, Globe, Users } from 'lucide-react';
import { useApp } from '@/store';

const GENDERS = [
  { id: 'all', label: 'Все 👤' },
  { id: 'male', label: 'Парни 👨' },
  { id: 'female', label: 'Девушки 👩' },
];

const COUNTRIES = [
  { id: 'all', label: 'Все страны 🌍' },
  { id: 'RU', label: 'Россия 🇷🇺' },
  { id: 'CIS', label: 'СНГ 🌏' },
  { id: 'EU', label: 'Европа 🇪🇺' },
];

export default function FilterModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { filters, setFilters } = useApp();

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-[#050506]/90 z-30 flex flex-col justify-end p-4 transition-all duration-300">
      <div className="glass-panel-purple p-5 rounded-3xl space-y-4 max-w-sm mx-auto w-full">
        <div className="flex justify-between items-center border-b border-white/[0.05] pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            <h3 className="font-semibold text-white text-sm">Фильтры поиска</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Gender */}
        <div className="space-y-1.5">
          <label className="text-xs text-gray-400 block flex items-center gap-1">
            <Users className="w-3 h-3" /> Пол собеседника
          </label>
          <div className="grid grid-cols-3 gap-2">
            {GENDERS.map(opt => (
              <button
                key={opt.id}
                onClick={() => setFilters({ ...filters, gender: opt.id })}
                className={`py-1.5 text-xs rounded-xl font-medium transition-all ${
                  filters.gender === opt.id
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                    : 'bg-white/[0.05] hover:bg-white/[0.08] text-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Country */}
        <div className="space-y-1.5">
          <label className="text-xs text-gray-400 block flex items-center gap-1">
            <Globe className="w-3 h-3" /> Регион
          </label>
          <div className="grid grid-cols-2 gap-2">
            {COUNTRIES.map(opt => (
              <button
                key={opt.id}
                onClick={() => setFilters({ ...filters, country: opt.id })}
                className={`py-1.5 text-xs rounded-xl font-medium transition-all ${
                  filters.country === opt.id
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                    : 'bg-white/[0.05] hover:bg-white/[0.08] text-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Age Range */}
        <div className="space-y-1.5">
          <label className="text-xs text-gray-400 block">Возраст: {filters.ageRange[0]} — {filters.ageRange[1]} лет</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="18"
              max="60"
              value={filters.ageRange[0]}
              onChange={(e) => setFilters({ ...filters, ageRange: [parseInt(e.target.value), filters.ageRange[1]] })}
              className="flex-1 accent-purple-500"
            />
            <input
              type="range"
              min="18"
              max="60"
              value={filters.ageRange[1]}
              onChange={(e) => setFilters({ ...filters, ageRange: [filters.ageRange[0], parseInt(e.target.value)] })}
              className="flex-1 accent-purple-500"
            />
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 font-bold text-xs text-white shadow-glow-purple flex items-center justify-center space-x-1 transition-all"
        >
          <Check className="w-4 h-4" />
          <span>Применить</span>
        </button>
      </div>
    </div>
  );
}


============================================================
FILE: src/components/Header.tsx
============================================================
import { X, Coins, Zap, Sparkles } from 'lucide-react';
import { useApp } from '@/store';

export default function Header() {
  const { starsBalance, isRoomPlus, chatSessionActive, exitChat, setActiveTab } = useApp();

  return (
    <header className="bg-[#0A0A0B] px-4 py-3 flex items-center justify-between z-40 border-b border-white/[0.05] shrink-0">
      <div className="flex items-center space-x-3">
        <div className="flex space-x-1.5">
          <button
            onClick={() => {
              if (chatSessionActive) exitChat();
              else setActiveTab('lobby');
            }}
            className="w-7 h-7 rounded-full bg-white/[0.04] active:bg-white/[0.1] hover:text-white transition flex items-center justify-center text-gray-400"
            aria-label="Назад"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400 hidden sm:block" />
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-semibold text-white tracking-wide">Room of Secrets</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full flex items-center space-x-1">
          <Coins className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="text-[11px] font-extrabold text-amber-300 font-mono">{starsBalance}</span>
        </div>
        {isRoomPlus && (
          <div className="bg-purple-500/20 border border-purple-500/30 px-2 py-1 rounded-full flex items-center">
            <Zap className="w-3 h-3 text-purple-400 fill-purple-400" />
            <span className="text-[9px] text-purple-300 font-bold ml-1 hidden sm:inline">Room+</span>
          </div>
        )}
      </div>
    </header>
  );
}


============================================================
FILE: src/components/RatingScreen.tsx
============================================================
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
          <p className="text-xs text-gray-400 mt-1">Ваш отзыв анонимен и влияет на кар<response clipped><NOTE>Result is longer than **10000 characters**, will be **truncated**.</NOTE>
