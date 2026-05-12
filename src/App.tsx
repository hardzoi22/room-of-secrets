import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, Sparkles, Shield, Coins, Lock, User, Volume2, Image as ImageIcon,
  Clock, Flame, Share2, LogOut, Compass, Sliders, Check, X, Award, RefreshCw, Send,
  Zap, Copy, Info, CheckCircle2, LockKeyhole, AlertTriangle, ChevronRight, ShieldCheck
} from 'lucide-react';
// ============================================
// 🔍 DETECT ENVIRONMENT
// ============================================
const tg = (window as any).Telegram?.WebApp;
const isTelegram = !!tg?.initDataUnsafe?.user;
const isDevMode = !isTelegram; // В Telegram скрываем дев-тулзы
// --- Types ---
interface StrangerPersona {
  id: string;
  name: string;
  age: number;
  city: string;
  tag: string;
  avatarColor: string;
  karma: number;
  avatarSeed: string;
  bio: string;
  firstMsg: string;
  replies: { keywords: string[]; text: string }[];
  defaultReplies: string[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'stranger' | 'system';
  text: string;
  time: string;
  type?: 'text' | 'media' | 'voice';
}

// --- Data ---
const STRANGER_PERSONAS: StrangerPersona[] = [
  {
    id: 'ekaterina', name: 'Екатерина 🎨', age: 22, city: 'Москва', tag: '#4A7F',
    avatarColor: 'from-pink-500 to-purple-600', karma: 94, avatarSeed: 'art_girl',
    bio: 'Художница, обожаю урбанизм. Верю в случайные встречи.',
    firstMsg: 'Привет! Рада соединению. Чем занимаешься? 🎨',
    replies: [
      { keywords: ['привет', 'ку', 'хай'], text: 'Привет! Рада познакомиться! Расскажи, ты давно тут?' },
      { keywords: ['дела', 'как'], text: 'Рисую эскиз. А как у тебя?' },
      { keywords: ['секрет'], text: 'Мой секрет: я иногда пою в караоке, когда никого нет дома...' }
    ],
    defaultReplies: ['Интересно!', 'Круто.', 'А расскажи еще?']
  },
  {
    id: 'aleksey', name: 'Алексей 💻', age: 27, city: 'Минск', tag: '#9E2C',
    avatarColor: 'from-blue-500 to-cyan-600', karma: 88, avatarSeed: 'geek_guy',
    bio: 'Разработчик, люблю крафт. Ценю адекватность.',
    firstMsg: 'Привет аноним! Как дела? ☕️',
    replies: [
      { keywords: ['привет', 'ку'], text: 'Привет! Рад адекватному собеседнику.' },
      { keywords: ['кто'], text: 'Я IT-инженер, но имя пока под секретом!' },
      { keywords: ['секрет'], text: 'Я однажды удалил файл на проде и восстановил за 5 минут.' }
    ],
    defaultReplies: ['Понимаю.', 'Ха-ха, забавно!', 'Ясно.']
  }
];

export default function App() {
  // --- State ---
  const [activeTab, setActiveTab] = useState<'lobby' | 'chat' | 'reviews' | 'profile'>('lobby');
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [selectedStranger, setSelectedStranger] = useState<StrangerPersona>(STRANGER_PERSONAS[0]);
  const [chatSessionActive, setChatSessionActive] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isStrangerTyping, setIsStrangerTyping] = useState(false);
  
  // Stats & Economy
  const [starsBalance, setStarsBalance] = useState(150);
  const [isRoomPlus, setIsRoomPlus] = useState(false);
  const [userKarma, setUserKarma] = useState(88);
  const [chatsCount, setChatsCount] = useState(42);
  
  // Chat Mechanisms
  const [chatTimer, setChatTimer] = useState(900);
  const [identityRequestState, setIdentityRequestState] = useState<'none' | 'sent' | 'received' | 'accepted' | 'declined'>('none');
  const [mediaUnblocked, setMediaUnblocked] = useState(false);
  const [mediaTimer, setMediaTimer] = useState<number | null>(null);
  
  // Animations
  const [showSmokeScreen, setShowSmokeScreen] = useState(false);
  const [smokeMessage, setSmokeMessage] = useState('');
  const [smokeType, setSmokeType] = useState<'match' | 'exit' | 'burn' | 'init'>('init');
  
  // Rating
  const [showRatingScreen, setShowRatingScreen] = useState(false);
  const [ratingReaction, setRatingReaction] = useState<string | null>(null);
  
  // Reviews Unlock
  const [areReviewsUnlocked, setAreReviewsUnlocked] = useState(false);
  
  // Logs
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([
    '⚙️ Room of Secrets Initialized',
    '🔌 Secure connection established'
  ]);

  // Safety Features
  const [showSafetyOnboarding, setShowSafetyOnboarding] = useState(true);
  const [safetyStep, setSafetyStep] = useState(0);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // --- Effects ---
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isStrangerTyping]);

  // Safety Steps Configuration
  const safetySteps = [
    { title: "Ваша безопасность", icon: Shield, desc: "Мы не храним переписки. Все сообщения шифруются." },
    { title: "Фото скрыты", icon: Eye, desc: "Все медиа размыты. Вы сами решаете, что смотреть." },
    { title: "Кнопка SOS", icon: Flame, desc: "При нарушении нажмите 🔥 — чат будет удален мгновенно." }
  ];

  // --- Helpers ---
  const addLog = (msg: string) => setTelemetryLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 20));
  const formatTime = (sec: number) => `${Math.floor(sec / 60).toString().padStart(2, '0')}:${(sec % 60).toString().padStart(2, '0')}`;
  
  const triggerSmokeEffect = (type: 'match' | 'exit' | 'burn' | 'init', callback: () => void, msg: string = '') => {
    setSmokeType(type);
    setSmokeMessage(msg);
    setShowSmokeScreen(true);
    setTimeout(() => { callback(); }, 1800);
    setTimeout(() => { setShowSmokeScreen(false); }, 2800);
  };

  // --- Actions ---
  const handleStartSearch = () => {
    if (isSearching) return;
    setIsSearching(true);
    setSearchProgress(0);
    let p = 0;
    const i = setInterval(() => {
      p += 10;
      setSearchProgress(p);
      if (p >= 100) {
        clearInterval(i);
        triggerSmokeEffect('match', () => {
          setIsSearching(false);
          setChatSessionActive(true);
          setChatTimer(900);
          setChatMessages([
            { id: 'sys', sender: 'system', text: '️ Анонимный чат. IP не логируются.', time: '12:00' },
            { id: 'intro', sender: 'stranger', text: selectedStranger.firstMsg, time: '12:00' }
          ]);
          setActiveTab('chat');
        }, 'Поиск собеседника...');
      }
    }, 200);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    const txt = messageInput;
    setChatMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: txt, time: '12:00' }]);
    setMessageInput('');
    setIsStrangerTyping(true);
    
    // Mock Reply
    setTimeout(() => {
      setIsStrangerTyping(false);
      const reply = selectedStranger.replies.find(r => r.keywords.some(k => txt.toLowerCase().includes(k)))?.text || selectedStranger.defaultReplies[0];
      setChatMessages(prev => [...prev, { id: Date.now().toString(), sender: 'stranger', text: reply || '...', time: '12:01' }]);
    }, 1500);
  };

  const handleBurnBridge = () => {
    triggerSmokeEffect('burn', () => {
      setChatSessionActive(false);
      setChatMessages([]);
      setActiveTab('lobby');
      addLog(' SOS: Мост сожжен. История удалена.');
      alert(' Переписка удалена. Жалоба отправлена модераторам.');
    }, 'Уничтожение данных...');
  };

  const handleExitChat = () => {
    triggerSmokeEffect('exit', () => {
      setChatSessionActive(false);
      setShowRatingScreen(true);
    }, 'Выход из комнаты...');
  };

  const handleSpendStars = (amount: number, action: string, callback: () => void) => {
    if (starsBalance >= amount) {
      setStarsBalance(prev => prev - amount);
      callback();
      addLog(`💰 Списано ${amount} ⭐: ${action}`);
    } else {
      alert(`Недостаточно Stars! Нужно ${amount}`);
    }
  };

  // --- Render Components ---

  // 1. Safety Onboarding Modal
  const SafetyModal = () => (
    <div className="fixed inset-0 z-[1000] bg-[#050506] flex items-center justify-center p-6">
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="w-20 h-20 mx-auto bg-purple-500/10 rounded-full flex items-center justify-center animate-pulse">
          {React.createElement(safetySteps[safetyStep].icon, { className: "w-10 h-10 text-purple-400" })}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{safetySteps[safetyStep].title}</h2>
          <p className="text-gray-400">{safetySteps[safetyStep].desc}</p>
        </div>
        
        <div className="flex justify-center gap-2">
          {safetySteps.map((_, idx) => (
            <div key={idx} className={`w-2 h-2 rounded-full ${idx === safetyStep ? 'bg-purple-500' : 'bg-gray-700'}`} />
          ))}
        </div>

        <button 
          onClick={() => {
            if (safetyStep < safetySteps.length - 1) setSafetyStep(p => p + 1);
            else setShowSafetyOnboarding(false);
          }}
          className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition"
        >
          {safetyStep === safetySteps.length - 1 ? 'Войти в Room of Secrets' : 'Далее'}
        </button>
      </div>
    </div>
  );

  // 2. Smoke Screen
  const SmokeScreen = () => (
    <div className="fixed inset-0 z-[900] bg-black/90 flex flex-col items-center justify-center">
      <div className="w-32 h-32 bg-purple-500/20 blur-3xl rounded-full animate-pulse" />
      <div className="mt-8 text-center space-y-4">
        {smokeType === 'burn' ? <Flame className="w-16 h-16 text-red-500 mx-auto animate-bounce" /> : <Sparkles className="w-16 h-16 text-purple-500 mx-auto animate-spin" />}
        <h2 className="text-2xl font-bold text-white">{smokeMessage}</h2>
      </div>
    </div>
  );

return (
  <div className="min-h-screen bg-[#050506] text-white font-sans flex flex-col">
    
    {/* === SMOKE/BURN SCREEN OVERLAY === */}
    {showSmokeScreen && (
      <div className="fixed inset-0 bg-[#050506]/95 z-[999] flex flex-col items-center justify-center">
        <div className="w-32 h-32 bg-purple-500/10 blur-[80px] rounded-full animate-pulse" />
        <div className="text-center space-y-4 px-6">
          {smokeType === 'burn' ? (
            <>
              <Flame className="w-16 h-16 text-red-500 mx-auto animate-bounce" />
              <h2 className="text-2xl font-bold text-white">СЖИГАНИЕ МОСТОВ</h2>
              <p className="text-gray-400 text-sm">Переписка удаляется безвозвратно...</p>
            </>
          ) : smokeType === 'match' ? (
            <>
              <Sparkles className="w-16 h-16 text-purple-400 mx-auto animate-spin" />
              <h2 className="text-2xl font-bold text-white">СОЕДИНЕНИЕ...</h2>
              <p className="text-gray-400 text-sm">{smokeMessage}</p>
            </>
          ) : (
            <>
              <Compass className="w-16 h-16 text-cyan-400 mx-auto animate-pulse" />
              <h2 className="text-2xl font-bold text-white">ВЫХОД</h2>
              <p className="text-gray-400 text-sm">Возвращаемся в лобби...</p>
            </>
          )}
        </div>
      </div>
    )}

    {/* === SAFETY ONBOARDING === */}
    {showSafetyOnboarding && (
      <div className="fixed inset-0 bg-[#050506] z-[1000] flex items-center justify-center p-6">
        <div className="max-w-sm w-full text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-purple-500/10 rounded-full flex items-center justify-center">
            {React.createElement(safetySteps[safetyStep].icon, { className: "w-10 h-10 text-purple-400" })}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">{safetySteps[safetyStep].title}</h2>
            <p className="text-gray-400 text-sm">{safetySteps[safetyStep].desc}</p>
          </div>
          <div className="flex justify-center gap-2">
            {safetySteps.map((_, idx) => (
              <div key={idx} className={`w-2 h-2 rounded-full ${idx === safetyStep ? 'bg-purple-500' : 'bg-gray-700'}`} />
            ))}
          </div>
          <button 
            onClick={() => {
              if (safetyStep < safetySteps.length - 1) setSafetyStep(p => p + 1);
              else setShowSafetyOnboarding(false);
            }}
            className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl"
          >
            {safetyStep === safetySteps.length - 1 ? 'Войти' : 'Далее'}
          </button>
        </div>
      </div>
    )}

    {/* === MAIN APP CONTENT (FULL SCREEN) === */}
    <div className="flex-1 flex flex-col max-w-md mx-auto w-full bg-[#0A0A0B] relative">
      
      {/* Status Bar Spacer */}
      <div className="h-safe-top" />

      {/* Header with Stars Balance */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-white/[0.05] bg-[#0A0A0B]">
        <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
          Room of Secrets
        </h1>
        <div className="flex items-center gap-2 bg-amber-500/10 px-3 py-1 rounded-full">
          <Coins className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-mono font-bold text-amber-300">{starsBalance}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-radial-gradient-lobby custom-chat-scroll">
        
        {/* === LOBBY TAB === */}
        {activeTab === 'lobby' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 space-y-8">
            <div className="text-center space-y-2">
              <p className="text-gray-400 text-sm">Войди. Поговори. Исчезни.</p>
            </div>

            {/* Main Button */}
            <button 
              onClick={handleStartSearch}
              disabled={isSearching}
              className={`w-40 h-40 rounded-full flex flex-col items-center justify-center transition-all ${
                isSearching 
                  ? 'bg-[#1C1C1F] border-2 border-cyan-400/50 animate-pulse' 
                  : 'bg-gradient-to-br from-purple-600 to-indigo-700 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(168,85,247,0.3)]'
              }`}
            >
              {isSearching ? (
                <>
                  <span className="text-3xl mb-2">🔮</span>
                  <span className="text-xs font-bold text-cyan-400">ПОИСК...</span>
                  <div className="w-20 h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-cyan-400 transition-all duration-200" style={{ width: `${searchProgress}%` }} />
                  </div>
                </>
              ) : (
                <>
                  <span className="text-4xl mb-2">🔮</span>
                  <span className="text-xs font-bold text-center">ВОЙТИ В КОМНАТУ</span>
                </>
              )}
            </button>

            {/* Online Counter */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span>128 человек ждут собеседника</span>
            </div>

            {/* Filters Preview */}
            <button
              onClick={() => setShowFilterModal(true)}
              className="flex items-center gap-2 text-xs text-purple-400 hover:text-purple-300"
            >
              <Sliders className="w-4 h-4" />
              <span>Настроить фильтры</span>
            </button>
          </div>
        )}

        {/* === CHAT TAB === */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-white/[0.05] bg-[#101012]">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${selectedStranger.avatarColor} flex items-center justify-center text-white font-bold`}>
                  {identityRequestState === 'accepted' ? selectedStranger.name[0] : '?'}
                </div>
                <div>
                  <div className="font-bold text-sm">
                    {identityRequestState === 'accepted' ? selectedStranger.name : `Незнакомец ${selectedStranger.tag}`}
                  </div>
                  <div className="text-xs text-purple-400 font-mono">⏳ {formatTime(chatTimer)}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleRevealIdentity} className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                  <User className="w-5 h-5" />
                </button>
                <button onClick={handleBurnBridge} className="p-2 bg-red-500/10 rounded-lg text-red-400 animate-pulse">
                  <Flame className="w-5 h-5" />
                </button>
                <button onClick={() => handleExitChat(false)} className="p-2 bg-white/5 rounded-lg text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'system' ? (
                    <div className="bg-white/5 text-gray-400 text-xs p-3 rounded-xl text-center max-w-full">
                      {msg.text}
                    </div>
                  ) : (
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.sender === 'user' 
                        ? 'bg-purple-600 text-white rounded-tr-none' 
                        : 'bg-[#1C1C1F] text-gray-200 rounded-tl-none'
                    }`}>
                      {msg.type === 'media' ? (
                        <img src={msg.text} alt="Media" className="rounded-lg max-h-40" />
                      ) : (
                        <p>{msg.text}</p>
                      )}
                      <span className="text-[10px] opacity-60 block text-right mt-1">{msg.time}</span>
                    </div>
                  )}
                </div>
              ))}
              {isStrangerTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#1C1C1F] px-4 py-2 rounded-2xl text-xs text-gray-500">печатает...</div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-white/[0.05] bg-[#101012] flex gap-2">
              <input
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                placeholder="Напишите сообщение..."
                className="flex-1 bg-[#1C1C1F] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <button type="submit" className="p-3 bg-purple-600 rounded-xl text-white">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* === REVIEWS TAB === */}
        {activeTab === 'reviews' && (
          <div className="p-6 space-y-6">
            <h2 className="text-xl font-bold text-center">Доска Отзывов</h2>
            
            {/* Karma */}
            <div className="bg-[#1C1C1F] p-6 rounded-2xl flex flex-col items-center">
              <span className="text-4xl font-black text-purple-400">{userKarma}</span>
              <span className="text-gray-400 text-sm mt-1">Ваша Карма</span>
            </div>

            {/* Reviews List */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Полученные реакции</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { emoji: '🔥', count: totalReactions.fire },
                  { emoji: '😇', count: totalReactions.angel },
                  { emoji: '🧠', count: totalReactions.brain },
                  { emoji: '💩', count: totalReactions.toxic }
                ].map((r, i) => (
                  <div key={i} className="bg-[#1C1C1F] p-3 rounded-xl text-center">
                    <span className="text-xl">{r.emoji}</span>
                    <div className="text-sm font-bold text-white">{r.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === PROFILE TAB === */}
        {activeTab === 'profile' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold">
                U
              </div>
              <div>
                <h2 className="text-lg font-bold">@secret_agent</h2>
                <p className="text-gray-400 text-sm">Karma: {userKarma} • Диалогов: {chatsCount}</p>
              </div>
            </div>

            {/* Room+ Card */}
            <div className="bg-[#1C1C1F] p-4 rounded-2xl border border-purple-500/20">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">Подписка Room+</span>
                <span className="text-purple-400 font-mono">199 ⭐/мес</span>
              </div>
              <p className="text-xs text-gray-400 mb-3">Безлимит, фильтры, приоритетный поиск</p>
              <button 
                onClick={() => handleSpendStars(199, 'Room+', () => setIsRoomPlus(!isRoomPlus))}
                className={`w-full py-2 rounded-xl font-bold text-sm ${
                  isRoomPlus ? 'bg-red-500/10 text-red-400' : 'bg-purple-600 text-white'
                }`}
              >
                {isRoomPlus ? 'Отключить' : 'Активировать'}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* === BOTTOM NAV === */}
      <div className="border-t border-white/[0.05] bg-[#0A0A0B] px-2 py-2 flex justify-around">
        {[
          { id: 'lobby', icon: Compass, label: 'Поиск' },
          { id: 'chat', icon: MessageSquare, label: 'Чат', active: chatSessionActive },
          { id: 'reviews', icon: Award, label: 'Отзывы' },
          { id: 'profile', icon: User, label: 'Профиль' }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl ${
                isActive ? 'text-purple-400' : 'text-gray-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{tab.label}</span>
              {tab.active && <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />}
            </button>
          );
        })}
      </div>

    </div>

    {/* === MODALS (Filters, Rating) === */}
    {showFilterModal && (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center p-4">
        <div className="bg-[#1C1C1F] w-full max-w-md rounded-3xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white">Фильтры</h3>
            <button onClick={() => setShowFilterModal(false)}><X className="w-5 h-5" /></button>
          </div>
          {/* Filter controls here */}
          <button 
            onClick={() => { setShowFilterModal(false); }}
            className="w-full py-3 bg-purple-600 rounded-xl font-bold"
          >
            Применить
          </button>
        </div>
      </div>
    )}

    {showRatingScreen && (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6">
        <div className="bg-[#1C1C1F] w-full max-w-sm rounded-3xl p-6 space-y-4 text-center">
          <h3 className="font-bold text-white text-lg">Оставьте отзыв</h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'fire', emoji: '🔥' },
              { id: 'angel', emoji: '😇' },
              { id: 'brain', emoji: '🧠' },
              { id: 'toxic', emoji: '💩' }
            ].map(r => (
              <button
                key={r.id}
                onClick={() => setRatingReaction(r.id)}
                className={`p-3 rounded-xl text-2xl ${
                  ratingReaction === r.id ? 'bg-purple-500/20 ring-2 ring-purple-400' : 'bg-white/5'
                }`}
              >
                {r.emoji}
              </button>
            ))}
          </div>
          <textarea
            maxLength={100}
            rows={2}
            value={ratingNote}
            onChange={e => setRatingNote(e.target.value)}
            placeholder="Заметка (не показывается собеседнику)..."
            className="w-full bg-white/5 rounded-xl p-3 text-sm text-white"
          />
          <div className="flex gap-3">
            <button onClick={() => setShowRatingScreen(false)} className="flex-1 py-3 bg-white/5 rounded-xl">Пропустить</button>
            <button onClick={handleSubmitRating} className="flex-1 py-3 bg-purple-600 rounded-xl font-bold">Отправить</button>
          </div>
        </div>
      </div>
    )}

    {/* === DEV TOOLS (ONLY IN BROWSER, NOT IN TELEGRAM) === */}
    {isDevMode && (
      <div className="hidden xl:block fixed right-4 top-4 w-80 bg-[#1C1C1F] p-4 rounded-xl border border-white/10 text-xs text-gray-400 font-mono max-h-[80vh] overflow-y-auto">
        <div className="font-bold text-white mb-2">🛠️ DEV PANEL</div>
        <div className="space-y-2">
          <button onClick={() => setStarsBalance(p => p + 100)} className="w-full py-1 bg-amber-500/10 text-amber-400 rounded">+100 ⭐</button>
          <button onClick={() => setIsRoomPlus(!isRoomPlus)} className="w-full py-1 bg-purple-500/10 text-purple-400 rounded">
            {isRoomPlus ? 'Отключить Room+' : 'Включить Room+'}
          </button>
          <div className="pt-2 border-t border-white/10">
            <div className="font-bold mb-1">Логи:</div>
            <div className="h-40 overflow-y-auto space-y-1">
              {telemetryLogs.slice(0, 10).map((l, i) => <div key={i}>{l}</div>)}
            </div>
          </div>
        </div>
      </div>
    )}

  </div>
);
