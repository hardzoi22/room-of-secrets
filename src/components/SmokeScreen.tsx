============================================================
FILE: src/components/SmokeScreen.tsx
============================================================
import { Sparkles, Compass, Flame } from 'lucide-react';
import { useApp } from '@/store';

export default function SmokeScreen() {
  const { showSmokeScreen, smokeType, smokeMessage } = useApp();

  if (!showSmokeScreen) return null;

  return (
    <div className="fixed inset-0 bg-[#050506]/95 z-[999] flex flex-col items-center justify-center overflow-hidden transition-all duration-500">
      <div className="absolute w-[300px] h-[300px] rounded-full bg-[#B388FF]/10 blur-[80px] animate-pulse-ring-slow" />
      <div className="absolute w-[180px] h-[180px] rounded-full bg-[#00E5FF]/10 blur-[50px] animate-pulse-ring-fast" />

      <div className="relative z-10 flex flex-col items-center space-y-6 px-6 text-center">
        {smokeType === 'burn' ? (
          <>
            <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/30 rounded-full flex items-center justify-center animate-bounce shadow-glow-purple">
              <Flame className="w-10 h-10 text-rose-500 animate-pulse" />
            </div>
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-300 to-rose-400 tracking-wider">СЖИГАНИЕ МОСТОВ</h2>
            <p className="text-gray-400 max-w-sm text-sm">Вся история переписки безвозвратно удаляется.</p>
          </>
        ) : smokeType === 'match' ? (
          <>
            <div className="w-24 h-24 bg-purple-500/10 border border-purple-500/30 rounded-full flex items-center justify-center animate-spin">
              <Sparkles className="w-12 h-12 text-[#B388FF]" />
            </div>
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-[#B388FF] to-cyan-400 tracking-wider">СОЕДИНЕНИЕ...</h2>
            <p className="text-gray-400 max-w-sm text-sm">{smokeMessage || 'Синхронизируем каналы...'}</p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center animate-pulse">
              <Compass className="w-10 h-10 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#00E5FF] tracking-wider text-glow-cyan">РАССЕИВАНИЕ</h2>
            <p className="text-gray-400 max-w-sm text-sm">Комната закрывается. Вы возвращаетесь в безопасную зону.</p>
          </>
        )}
      </div>
    </div>
  );
}


============================================================
FILE: src/components/ToastContainer.tsx
============================================================
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useApp } from '@/store';

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const STYLES = {
  success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  error: 'bg-red-500/10 border-red-500/30 text-red-400',
  info: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
  warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[1000] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
      {toasts.map(toast => {
        const Icon = ICONS[toast.type];
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-xl border backdrop-blur-md animate-in slide-in-from-top-2 fade-in duration-300 ${STYLES[toast.type]}`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="text-xs font-medium flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="opacity-60 hover:opacity-100 transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}


============================================================
FILE: src/pages/LobbyPage.tsx
============================================================
import { useState } from 'react';
import { Sliders, Sparkles } from 'lucide-react';
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


============================================================
FILE: src/pages/ChatPage.tsx
============================================================
import React, { useState, useRef, useEffect } from 'react';
import {
  Clock, User, Flame, X, Lock, CheckCircle2,
  ImageIcon, Volume2, Send, Info, Shield
} from 'lucide-react';
import { useApp } from '@/store';
import { formatTime } from '@/utils/time';

export default function ChatPage() {
  const {
    chatMessages, isStrangerTyping, chatTimer, selectedStranger,
    identityRequestState, mediaUnblocked, isRoomPlus,
    sendMessage, revealIdentity, burnBridge, exitChat, extendChat, unlockMedia
  } = useApp();

  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [chatMessages, isStrangerTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    sendMessage(messageInput);
    setMessageInput('');
  };

  const handleSendPhoto = () => {
    if (!mediaUnblocked && !isRoomPlus) {
      unlockMedia();
      return;
    }
    sendMessage('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80', 'media');
  };

  const handleSendVoice = () => {
    if (!mediaUnblocked && !isRoomPlus) {
      unlockMedia();
      return;
    }
    sendMessa<response clipped><NOTE>Result is longer than **10000 characters**, will be **truncated**.</NOTE>
