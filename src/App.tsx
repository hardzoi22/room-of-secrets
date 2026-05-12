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
    <div className="min-h-screen bg-[#050506] text-white font-sans flex items-center justify-center p-4">
      
      {/* Overlays */}
      {showSafetyOnboarding && <SafetyModal />}
      {showSmokeScreen && <SmokeScreen />}

      {/* Main Container (Phone Mockup) */}
      <div className="w-full max-w-[400px] h-[850px] bg-[#0A0A0B] rounded-[40px] border-[8px] border-[#1C1C1F] shadow-2xl overflow-hidden flex flex-col relative">
        
        {/* Status Bar */}
        <div className="bg-[#0A0A0B] px-6 pt-4 pb-2 flex justify-between text-xs text-gray-400 font-medium z-10">
          <span>12:45</span>
          <div className="flex gap-1">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-amber-400">{starsBalance}</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-radial-gradient-lobby relative custom-chat-scroll">
          
          {/* LOBBY */}
          {activeTab === 'lobby' && (
            <div className="flex flex-col items-center justify-center h-full p-8 space-y-8">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">Room of Secrets</h1>
                <p className="text-gray-500 text-sm">Войди. Поговори. Исчезни.</p>
              </div>

              <button 
                onClick={handleStartSearch}
                className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-600 to-indigo-900 shadow-[0_0_40px_rgba(168,85,247,0.3)] flex flex-col items-center justify-center text-white transition-transform active:scale-95"
              >
                <Sparkles className="w-10 h-10 mb-2" />
                <span className="font-bold text-lg tracking-wider">ВОЙТИ</span>
              </button>

              <div className="w-full bg-[#1C1C1F] p-4 rounded-2xl border border-white/5 space-y-3">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Фильтры</span>
                  <span className="text-purple-400">Room+ Only</span>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-white/5 rounded-lg text-xs">Все 👤</span>
                  <span className="px-3 py-1 bg-white/5 rounded-lg text-xs">18-35 лет</span>
                </div>
              </div>
            </div>
          )}

          {/* CHAT */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-full">
              {/* Chat Header */}
              <div className="bg-[#101012] p-3 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${selectedStranger.avatarColor} flex items-center justify-center text-white font-bold`}>
                    {selectedStranger.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-sm">Незнакомец {selectedStranger.tag}</div>
                    <div className="text-[10px] text-purple-400 font-mono">⏳ {formatTime(chatTimer)}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleBurnBridge} className="p-2 bg-red-500/10 text-red-500 rounded-lg animate-pulse" title="SOS">
                    <Flame className="w-5 h-5" />
                  </button>
                  <button onClick={handleExitChat} className="p-2 bg-white/5 text-gray-400 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                {chatMessages.map(m => (
                  <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      m.sender === 'user' ? 'bg-purple-600 text-white' : 
                      m.sender === 'system' ? 'bg-white/5 text-gray-400 text-xs text-center w-full' : 'bg-[#1C1C1F] text-gray-200'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {isStrangerTyping && (
                  <div className="flex justify-start"><div className="bg-[#1C1C1F] px-4 py-2 rounded-2xl text-xs text-gray-500">печатает...</div></div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Input */}
              <div className="p-3 bg-[#101012] flex gap-2">
                <input 
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  className="flex-1 bg-[#1C1C1F] border-none rounded-xl px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="Сообщение..."
                />
                <button onClick={handleSendMessage} className="p-3 bg-purple-600 rounded-xl text-white">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="p-6 space-y-6 pt-12">
              <h2 className="text-xl font-bold text-center">Доска Отзывов</h2>
              
              <div className="bg-[#1C1C1F] p-6 rounded-3xl flex flex-col items-center border border-purple-500/20">
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">{userKarma}</span>
                <span className="text-gray-400 text-sm mt-2">Ваша Карма</span>
              </div>

              {!areReviewsUnlocked && (
                <div className="bg-black/50 p-6 rounded-2xl text-center border border-white/10 space-y-4 backdrop-blur-sm">
                  <LockKeyhole className="w-8 h-8 text-gray-500 mx-auto" />
                  <p className="text-sm text-gray-400">Тексты отзывов скрыты</p>
                  <button onClick={() => handleSpendStars(30, 'Разблокировка отзывов', () => setAreReviewsUnlocked(true))} className="px-4 py-2 bg-purple-600 rounded-lg text-sm font-bold">
                    Разблокировать за 30 ⭐
                  </button>
                </div>
              )}
            </div>
          )}

          {/* PROFILE */}
          {activeTab === 'profile' && (
            <div className="p-6 space-y-6 pt-12">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-2xl">👤</div>
                <div>
                  <h2 className="text-xl font-bold">Аноним #User</h2>
                  <p className="text-purple-400 text-sm">Karma: {userKarma}</p>
                </div>
              </div>
              
              <div className="bg-[#1C1C1F] p-4 rounded-xl border border-white/5">
                <h3 className="font-bold mb-2">Настройки</h3>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Безопасный режим</span>
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Nav */}
        <div className="bg-[#0A0A0B] border-t border-white/5 p-2 flex justify-around">
          {[
            { id: 'lobby', icon: Compass, label: 'Поиск' },
            { id: 'chat', icon: MessageSquare, label: 'Чат' },
            { id: 'reviews', icon: Award, label: 'Отзывы' },
            { id: 'profile', icon: User, label: 'Профиль' }
          ].map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center p-2 rounded-xl ${activeTab === item.id ? 'text-purple-400' : 'text-gray-600'}`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] mt-1">{item.label}</span>
            </button>
          ))}
        </div>

      </div>

      {/* Dev Tools Overlay (Desktop only) */}
      <div className="hidden xl:block absolute right-10 top-10 w-80 bg-[#1C1C1F] p-4 rounded-xl border border-white/10 font-mono text-xs text-gray-400">
        <div className="font-bold text-white mb-2">DEV LOGS</div>
        <div className="h-40 overflow-y-auto space-y-1">
          {telemetryLogs.map((l, i) => <div key={i} className="border-b border-white/5 pb-1">{l}</div>)}
        </div>
        <div className="mt-4 space-y-2">
          <button onClick={() => setStarsBalance(p => p + 100)} className="w-full py-1 bg-white/5 hover:bg-white/10 text-amber-400 rounded">+100 Stars</button>
          <a href="#moderator" target="_blank" className="block w-full text-center py-1 bg-purple-500/20 text-purple-400 rounded">Open Moderator Panel</a>
        </div>
      </div>

    </div>
  );
}
