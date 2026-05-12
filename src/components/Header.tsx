import React from 'react';
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
