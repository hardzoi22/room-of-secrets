import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'lobby' | 'chat' | 'reviews' | 'profile'>('lobby');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [showRoomsModal, setShowRoomsModal] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'user',
        text: messageInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setMessageInput('');
    }
  };

  return (
    <div className="fixed inset-0 h-[100dvh] w-full bg-[#030305] text-white flex flex-col overflow-hidden select-none">
      
      {/* HEADER */}
      <div className="px-5 py-4 border-b border-white/5 bg-[#0A0A0B]/90 backdrop-blur-xl z-40">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Room of Secrets
        </h1>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-hidden relative">
        
        {/* ЛОББИ */}
        {activeTab === 'lobby' && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="text-6xl mb-6">🌌</div>
            <h2 className="text-4xl font-bold mb-3">Тайная Комната</h2>
            <p className="text-gray-400 text-lg mb-12">Говори. Слушай. Исчезай.</p>
            
            <button 
              onClick={() => alert('Поиск собеседника...')}
              className="relative w-40 h-40 rounded-3xl bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 flex flex-col items-center justify-center shadow-2xl shadow-purple-500/60 hover:scale-105 active:scale-95 transition-all group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-cyan-400 opacity-30 group-hover:opacity-50 transition-opacity animate-pulse" />
              <span className="text-5xl mb-3 relative z-10">🔮</span>
              <span className="text-sm font-bold tracking-widest relative z-10">ВОЙТИ В КОМНАТУ</span>
            </button>

            <button 
              onClick={() => setShowRoomsModal(true)}
              className="mt-8 text-cyan-400 flex items-center gap-2 text-sm"
            >
              Комнаты по интересам →
            </button>
          </div>
        )}

        {/* ЧАТ */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-full">
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#050507]">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] px-5 py-3 rounded-3xl text-[17px] ${msg.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-gray-100'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-[#0A0A0B]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Напишите сообщение..."
                  className="flex-1 bg-zinc-900 border border-white/10 rounded-2xl px-5 py-3 focus:outline-none"
                />
                <button type="submit" className="bg-purple-600 px-6 rounded-2xl">Отправить</button>
              </div>
            </form>
          </div>
        )}

        {/* ОТЗЫВЫ И ПРОФИЛЬ — заглушки */}
        {(activeTab === 'reviews' || activeTab === 'profile') && (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p className="text-xl">Раздел в разработке</p>
          </div>
        )}
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

      {/* МОДАЛКА КОМНАТ */}
      {showRoomsModal && (
        <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-6">
          <div className="bg-[#1A1A1F] w-full max-w-md rounded-3xl p-6">
            <h3 className="text-xl font-bold mb-4">Комнаты по интересам</h3>
            <button onClick={() => setShowRoomsModal(false)} className="text-purple-400">Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
}
