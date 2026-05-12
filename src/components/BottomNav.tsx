import React from 'react';
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
