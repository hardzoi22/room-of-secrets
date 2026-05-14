import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'lobby' | 'chat' | 'reviews' | 'profile'>('lobby');

  return (
    <div className="fixed inset-0 h-[100dvh] w-full bg-[#030305] text-white flex flex-col overflow-hidden select-none">
      
      {/* HEADER */}
      <div className="px-5 py-4 border-b border-white/5 bg-[#0A0A0B]/90 backdrop-blur-xl z-40">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Room of Secrets
        </h1>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center w-full max-w-xs">
          <div className="text-5xl mb-6">🌌</div>
          <h2 className="text-4xl font-bold mb-3">Тайная Комната</h2>
          <p className="text-gray-400 text-lg mb-10">Говори. Слушай. Исчезай.</p>
          
          {/* Ещё меньше в 2 раза */}
          <div className="flex justify-center">
            <button className="w-32 h-32 rounded-3xl bg-gradient-to-br from-purple-600 to-violet-600 flex flex-col items-center justify-center shadow-2xl shadow-purple-500/50 hover:scale-105 active:scale-95 transition-all">
              <span className="text-4xl mb-2">🔮</span>
              <span className="text-xs font-bold tracking-widest text-center leading-tight">
                ВОЙТИ В<br />КОМНАТУ
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM NAVIGATION */}
      <div className="bg-[#0A0A0B]/95 backdrop-blur-2xl border-t border-white/5 p-3 flex justify-around z-50">
        {[
          { id: 'lobby', label: 'Поиск', icon: '🔮' },
          { id: 'chat', label: 'Чат', icon: '💬' },
          { id: 'reviews', label: 'Отзывы', icon: '🏆' },
          { id: 'profile', label: 'Профиль', icon: '👤' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${activeTab === tab.id ? 'text-purple-400' : 'text-gray-400'}`}
          >
            <span className="text-2xl">{tab.icon}</span>
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
