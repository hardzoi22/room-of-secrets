import React, { useState } from 'react';
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
      <div className="bg-[#1C1C1F] border border-purple-500/20 rounded-2xl overflow-hidden">
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-[#B388FF] fill-purple-400" />
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Подписка «Room+»</h4>
            </div>
            <span className="text-xs text-purple-300 font-extrabold font-mono">199 ⭐ / мес</span>
          </div>
          <ul className="text-[10px] text-gray-400 space-y-1.5">
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-purple-500/20 flex items-center justify-center text-[8px] text-purple-400">✓</span>
              Безлимитные медиа (фото, голосовые)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-purple-500/20 flex items-center justify-center text-[8px] text-purple-400">✓</span>
              Чат до 60 минут (вместо 15)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-purple-500/20 flex items-center justify-center text-[8px] text-purple-400">✓</span>
              Просмотр текстов отзывов
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-purple-500/20 flex items-center justify-center text-[8px] text-purple-400">✓</span>
              Приоритет в поиске собеседника
            </li>
          </ul>
          <button
            onClick={toggleRoomPlus}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
              isRoomPlus
                ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-glow-purple hover:opacity-90'
            }`}
          >
            {isRoomPlus ? 'Отключить Room+' : 'Активировать Room+'}
          </button>
        </div>
      </div>

      {/* Referrals */}
      <div className="bg-[#1C1C1F]/40 border border-white/[0.04] p-4 rounded-2xl space-y-3">
        <div className="flex items-center space-x-1.5">
          <Share2 className="w-4 h-4 text-[#00E5FF]" />
          <h4 className="text-xs font-bold text-white">Реферальная программа</h4>
        </div>
        <p className="text-[10px] text-gray-400">Пригласите друга и получите 50 ⭐ за каждого</p>
        <div className="bg-white/[0.03] border border-white/[0.08] p-2 rounded-xl flex items-center justify-between space-x-2">
          <span className="text-[9px] text-purple-300 font-mono overflow-hidden truncate">
            t.me/RoomOfSecretsBot?start=ref_1829a
          </span>
          <button
            onClick={handleCopyReferral}
            className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 active:scale-95 transition shrink-0"
            aria-label="Копировать ссылку"
          >
            {copiedReferral ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
        <div className="space-y-1.5 pt-1.5">
          <div className="flex justify-between text-[10px] text-gray-400 font-bold border-b border-white/[0.03] pb-1">
            <span>Приглашенные</span>
            <span>Заработано</span>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto custom-chat-scroll">
            {referrals.map((ref) => (
              <div key={ref.id} className="flex justify-between text-[9px] items-center">
                <span className="text-gray-300">
                  {ref.name} <span className="text-[8px] text-gray-500">({ref.date})</span>
                </span>
                <span className="text-amber-300 font-mono font-medium">+{ref.starsEarned} ⭐</span>
              </div>
            ))}
          </div>
          <button
            onClick={handleSimulateInvite}
            className="w-full py-1.5 bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] text-[9px] font-bold rounded-lg border border-[#00E5FF]/20 transition"
          >
            Симулировать приглашение друга (+50 ⭐)
          </button>
        </div>
      </div>
    </div>
  );
}
