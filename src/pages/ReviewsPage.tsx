============================================================
FILE: src/pages/ReviewsPage.tsx
============================================================
import { useState } from 'react';
import { Award, Lock, LockKeyhole, TrendingUp, MessageCircle } from 'lucide-react';
import { useApp } from '@/store';

const REACTION_ICONS = {
  fire: '🔥',
  angel: '😇',
  brain: '🧠',
  toxic: '💩',
};

const REACTION_LABELS = {
  fire: 'Интересный',
  angel: 'Добрый',
  brain: 'Умный',
  toxic: 'Токсичный',
};

export default function ReviewsPage() {
  const { userKarma, totalReactions, reviews, isRoomPlus, spendStars } = useApp();
  const [areReviewsUnlocked, setAreReviewsUnlocked] = useState(false);

  const handleUnlock = () => {
    if (isRoomPlus) {
      setAreReviewsUnlocked(true);
      return;
    }
    if (!spendStars(30, 'Просмотр отзывов')) return;
    setAreReviewsUnlocked(true);
  };

  const karmaPercent = (userKarma / 100) * 100;

  return (
    <div className="flex-1 p-5 space-y-5 overflow-y-auto custom-chat-scroll">
      <div className="text-center space-y-1">
        <h2 className="text-lg font-extrabold text-white flex items-center justify-center gap-2">
          <Award className="w-5 h-5 text-purple-400" />
          Доска Отзывов
        </h2>
        <p className="text-xs text-gray-500">Ваша репутация в сообществе</p>
      </div>

      {/* Karma Circle */}
      <div className="bg-[#1C1C1F]/60 border border-white/[0.04] p-5 rounded-2xl flex flex-col items-center justify-center relative">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" className="text-white/[0.03]" strokeWidth="8" stroke="currentColor" fill="transparent" />
            <circle
              cx="60"
              cy="60"
              r="52"
              className="text-purple-400 transition-all duration-1000"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 52}`}
              strokeDashoffset={`${2 * Math.PI * 52 * (1 - karmaPercent / 100)}`}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-extrabold text-white text-glow-purple font-mono">{userKarma}</span>
            <span className="text-[10px] text-purple-200 tracking-wider uppercase font-semibold">КАРМА</span>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-400">
          <TrendingUp className="w-3 h-3 text-emerald-400" />
          <span>+3 за последнюю неделю</span>
        </div>
      </div>

      {/* Reactions */}
      <div className="space-y-2">
        <span className="text-[11px] text-gray-400 uppercase tracking-widest font-bold">Полученные реакции</span>
        <div className="grid grid-cols-4 gap-2">
          {[
            { key: 'fire', icon: '🔥', count: totalReactions.fire },
            { key: 'angel', icon: '😇', count: totalReactions.angel },
            { key: 'brain', icon: '🧠', count: totalReactions.brain },
            { key: 'toxic', icon: '💩', count: totalReactions.toxic },
          ].map((react) => (
            <div key={react.key} className="bg-white/[0.02] border border-white/[0.04] p-2.5 rounded-xl text-center flex flex-col items-center hover:bg-white/[0.04] transition">
              <span className="text-xl mb-1">{react.icon}</span>
              <span className="text-xs font-mono font-bold text-white">{react.count}</span>
              <span className="text-[8px] text-gray-500 mt-0.5">{REACTION_LABELS[react.key as keyof typeof REACTION_LABELS]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[11px] text-gray-400 uppercase tracking-widest font-bold flex items-center gap-1">
            <MessageCircle className="w-3 h-3" /> Тексты отзывов
          </span>
          {!areReviewsUnlocked && !isRoomPlus && (
            <span className="text-[10px] text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center space-x-0.5">
              <Lock className="w-2.5 h-2.5" />
              <span>30 ⭐</span>
            </span>
          )}
        </div>

        <div className="relative">
          <div className="space-y-2">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className={`bg-[#1C1C1F]/40 border border-white/[0.03] p-3 rounded-xl space-y-1.5 transition-all duration-300 ${
                  !areReviewsUnlocked && !isRoomPlus ? 'blur-sm select-none pointer-events-none' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{REACTION_ICONS[rev.reaction]}</span>
                  <span className="text-[9px] text-gray-500">{rev.date}</span>
                </div>
                <p className="text-xs text-gray-300 italic">«{rev.text}»</p>
              </div>
            ))}
          </div>

          {!areReviewsUnlocked && !isRoomPlus && (
            <div className="absolute inset-0 bg-[#0A0A0B]/80 flex flex-col items-center justify-center text-center p-4 rounded-xl border border-white/[0.05]">
              <LockKeyhole className="w-8 h-8 text-[#B388FF] mb-2 animate-bounce" />
              <h4 className="text-xs font-bold text-white">Тексты отзывов заблокированы</h4>
              <p className="text-[10px] text-gray-400 mt-1">Разблокируйте, чтобы прочитать</p>
              <button
                onClick={handleUnlock}
                className="mt-3 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-[11px] font-bold text-white shadow-glow-purple hover:opacity-90 transition"
              >
                Разблокировать за 30 ⭐
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


============================================================
FILE: src/pages/ProfilePage.tsx
============================================================
import { useState } from 'react';
import { Share2, Copy, Check, Zap, RefreshCw, Coins, Crown, Gift } from 'lucide-react';
import { useApp } from '@/store';

export default function ProfilePage() {
  const {
    starsBalance, isRoomPlus, userKarma, chatsCount,
    referrals, toggleRoomPlus, addReferral, addStars
  } = useApp();

  const [copiedReferral, setCopiedReferral] = useState(false);

  const handleCopyReferral = () => {
    const link = 't.me/RoomOfSecretsBot?start=ref_1829a';
    navigator.clipboard.writeText(link).then(() => {
      setCopiedReferral(true);
      setTimeout(() => setCopiedReferral(false), 2000);
    });
  };

  const handleSimulateInvite = () => {
    const newRef = {
      id: Date.now(),
      name: '@friend_' + Math.floor(Math.random() * 999),
      starsEarned: Math.floor(Math.random() * 30) + 10,
      date: new Date().toLocaleDateString()
    };
    addReferral(newRef);
  };

  return (
    <div className="flex-1 p-5 space-y-5 overflow-y-auto custom-chat-scroll">
      {/* User Card */}
      <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/20 p-4 rounded-2xl flex items-center space-x-3.5">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center font-bold text-xl text-white text-glow-purple shrink-0">
          U
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-sm font-extrabold text-white truncate">@secret_agent</span>
            {isRoomPlus && (
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 text-[#050506] text-[8px] uppercase font-black tracking-widest px-1.5 py-0.5 rounded shrink-0 flex items-center gap-0.5">
                <Crown className="w-3 h-3" /> Room+
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[10px] text-gray-400">Karma: <span className="text-purple-300 font-bold">{userKarma}</span>/100</span>
            <span className="text-[10px] text-gray-400">Диалогов: <span className="text-white font-bold">{chatsCount}</span></span>
          </div>
        </div>
      </div>

      {/* Stars Balance */}
      <div className="bg-[#1C1C1F]/60 border border-white/[0.04] p-4 rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-gray-300 flex items-center gap-1">
            <Coins className="w-4 h-4 text-amber-400" /> Баланс Stars
          </span>
          <div className="flex items-center space-x-1">
            <span className="text-2xl font-mono font-extrabold text-amber-300">{starsBalance}</span>
            <span className="text-xs text-amber-400">⭐</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => addStars(100)}
            className="flex-1 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1"
          >
            <Gift className="w-3.5 h-3.5" /> +100 ⭐ (тест)
          </button>
          <button
            onClick={() => addStars(-starsBalance + 50)}
            className="px-3 py-2 bg-white/[0.03] text-gray-400 hover:text-white rounded-xl transition"
            title="Сбросить баланс"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Room+ */}
      <div className="bg-[#1C1C1F] border border-p<response clipped><NOTE>Result is longer than **10000 characters**, will be **truncated**.</NOTE>
