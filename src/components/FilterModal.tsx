import React from 'react';
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
