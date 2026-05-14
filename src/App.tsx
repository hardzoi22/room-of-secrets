import React, { useState, useEffect } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'lobby' | 'chat' | 'reviews' | 'profile'>('lobby');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [selectedStranger, setSelectedStranger] = useState<any>(null);
  const [starsBalance, setStarsBalance] = useState(150);
  const [userKarma, setUserKarma] = useState(88);
  const [chatTimer, setChatTimer] = useState(900);
  const [isConfessionMode, setIsConfessionMode] = useState(false);
  const [confessionTimer, setConfessionTimer] = useState(0);

  const [showRoomsModal, setShowRoomsModal] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);

  // Форматирование времени
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Таймер чата
  useEffect(() => {
    let interval: any = null;
    if (activeTab === 'chat' && chatTimer > 0) {
      interval = setInterval(() => setChatTimer(p => p - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [activeTab, chatTimer]);

  // Таймер исповедальни
  useEffect(() => {
    let interval: any = null;
    if (isConfessionMode && confessionTimer > 0) {
      interval = setInterval(() => {
        setConfessionTimer(p => {
          if (p <= 1) {
            setIsConfessionMode(false);
            setChatMessages(prev => [...prev, { sender: 'system', text: '🔥 Исповедь сожжена.', time: '' }]);
            return 0;
          }
          return p - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConfessionMode, confessionTimer]);

  const handleStartSearch = () => {
    setIsSearching(true);
    setSearchProgress(0);

    const interval = setInterval(() => {
      setSearchProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsSearching(false);
          setSelectedStranger({ name: "Незнакомец #47", tag: "#A3F9" });
          setChatMessages([{
            id: 'sys1',
            sender: 'system',
            text: '⚠️ Чат полностью анонимен.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
          setActiveTab('chat');
          setChatTimer(900);
          return 100;
        }
        return p + 12;
      });
    }, 80);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMsg]);
    setMessageInput('');

    setTimeout(() => {
      const replies = ["Интересно...", "Согласен", "А у меня было так...", "Ого!", "Ха-ха, забавно!"];
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'stranger',
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1100);
  };

  const handleBurnBridge = () => {
    if (confirm("Сжечь мост? Переписка будет удалена.")) {
      setChatMessages([]);
      setActiveTab('lobby');
      setChatTimer(900);
    }
  };

  const handleSendGift = (giftName: string) => {
    setStarsBalance(p => Math.max(0, p - 20));
    setShowGiftModal(false);
    setUserKarma(p => Math.min(100, p + 2));
    
    const giftEl = document.createElement('div');
    giftEl.textContent = giftName;
    giftEl.style.position = 'fixed';
    giftEl.style.fontSize = '80px';
    giftEl.style.left = '50%';
    giftEl.style.top = '40%';
    giftEl.style.transition = 'all 2.5s ease-out';
    giftEl.style.zIndex = '1000';
    document.body.appendChild(giftEl);

    setTimeout(() => {
      giftEl.style.transform = 'translateY(-400px) scale(0.3)';
      giftEl.style.opacity = '0';
    }, 100);

    setTimeout(() => document.body.removeChild(giftEl), 3000);
  };

  return (
    <div className="fixed inset-0 h-[100dvh] w-full bg-[#030305] text-white flex flex-col overflow-hidden select-none">
      
      {/* HEADER */}
      <div className="px-5 py-4 border-b border-white/5 bg-[#0A0A0B]/90 backdrop-blur-xl z-40 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Room of Secrets
        </h1>
        <div className="text-sm font-mono text-amber-400">⭐ {starsBalance}</div>
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
              onClick={handleStartSearch}
              className="relative w-40 h-40 rounded-3xl bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 flex flex-col items-center justify-center shadow-2xl shadow-purple-500/60 hover:scale-105 active:scale-95 transition-all group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-cyan-400 opacity-30 group-hover:opacity-50 transition-opacity animate-pulse" />
              <span className="text-5xl mb-3 relative z-10">🔮</span>
              <span className="text-sm font-bold tracking-widest relative z-10">ВОЙТИ В КОМНАТУ</span>
            </button>
          </div>
        )}

        {/* АНИМАЦИЯ ПОИСКА */}
        {isSearching && (
          <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center">
            <div className="text-6xl mb-6 animate-pulse">🔍</div>
            <h3 className="text-xl font-bold mb-2">Поиск собеседника...</h3>
            <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-400 to-cyan-400 transition-all duration-200" style={{ width: `${searchProgress}%` }} />
            </div>
          </div>
        )}

        {/* ЧАТ */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-white/5 bg-[#0A0A0B] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">?</div>
                <div>
                  <p className="font-medium">{selectedStranger?.name || "Незнакомец"}</p>
                  <p className="text-xs text-emerald-400">Онлайн • {formatTime(chatTimer)}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => {
                  setIsConfessionMode(true);
                  setConfessionTimer(60);
                }} className="text-purple-400 text-sm">🕯️ Исповедь</button>
                <button onClick={() => {
                  if (confirm("Сжечь мост?")) {
                    setChatMessages([]);
                    setActiveTab('lobby');
                  }
                }} className="text-red-400 text-sm">Сжечь мост 🔥</button>
              </div>
            </div>

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
                  className="flex-1 bg-zinc-900 border border-white/10 rounded-2xl px-5 py-3 focus:outline-none text-base"
                />
                <button type="submit" className="bg-purple-600 px-8 rounded-2xl font-medium">→</button>
              </div>
              <button type="button" onClick={() => setShowGiftModal(true)} className="text-pink-400 text-xs mt-3">🎁 Отправить подарок</button>
            </form>
          </div>
        )}

        {/* Заглушки */}
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

      {/* МОДАЛКИ */}
      {showRoomsModal && (
        <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-6">
          <div className="bg-[#1A1A1F] w-full max-w-md rounded-3xl p-6">
            <h3 className="text-xl font-bold mb-4">Комнаты по интересам</h3>
            <div className="space-y-3">
              {['Полуночные философы 🌙', 'Геймеры в 3 ночи 🎮', 'Стартаперы 🚀', 'Книжный клуб 📚'].map((room, i) => (
                <button key={i} className="w-full text-left p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all" onClick={() => alert(`Вход в комнату: ${room}`)}>
                  {room}
                </button>
              ))}
            </div>
            <button onClick={() => setShowRoomsModal(false)} className="mt-6 text-purple-400">Закрыть</button>
          </div>
        </div>
      )}

      {showGiftModal && (
        <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-6">
          <div className="bg-[#1A1A1F] w-full max-w-md rounded-3xl p-6">
            <h3 className="text-xl font-bold mb-4">Отправить подарок</h3>
            <div className="grid grid-cols-3 gap-4">
              {['🌹', '☕', '🍾', '🔥', '👑'].map((emoji, i) => (
                <button key={i} onClick={() => handleSendGift(emoji)} className="text-5xl p-6 hover:bg-white/10 rounded-2xl transition-all">
                  {emoji}
                </button>
              ))}
            </div>
            <button onClick={() => setShowGiftModal(false)} className="mt-6 text-purple-400 w-full">Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
}
