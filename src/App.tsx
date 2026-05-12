import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Sparkles,
  Shield,
  Coins,
  Lock,
  User,
  Volume2,
  Image as ImageIcon,
  Clock,
  Flame,
  Share2,
  LogOut,
  Compass,
  Sliders,
  Check,
  X,
  Award,
  RefreshCw,
  Send,
  Zap,
  Copy,
  Info,
  CheckCircle2,
  LockKeyhole
} from 'lucide-react';

// ============================================
// 📦 TYPES & INTERFACES
// ============================================
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

// ============================================
// 🎭 MOCK DATA
// ============================================
const STRANGER_PERSONAS: StrangerPersona[] = [
  {
    id: 'ekaterina',
    name: 'Екатерина 🎨',
    age: 22,
    city: 'Москва',
    tag: '#4A7F',
    avatarColor: 'from-pink-500 to-purple-600',
    karma: 94,
    avatarSeed: 'art_girl',
    bio: 'Художница, обожаю урбанизм, пост-панк и кофе. Верю, что случайные встречи не случайны.',
    firstMsg: 'Привет! Рада соединению. Очень необычное приложение. Чем занимаешься по жизни? 🎨',
    replies: [
      { keywords: ['привет', 'здравствуй', 'ку', 'прив', 'хай'], text: 'Привет-привет! Рада познакомиться! Расскажи, ты давно в этой тайной комнате?' },
      { keywords: ['дела', 'как ты', 'настроение'], text: 'У меня отлично, рисую эскиз для нового проекта. А как у тебя дела на той стороне экрана?' },
      { keywords: ['кто ты', 'как зовут', 'имя', 'аватар'], text: 'Я не могу сказать своё имя, пока мы не раскроем личности! 🤫 Это ведь Room of Secrets. Давай пообщаемся, и если оба согласимся — нажмем маску вверху!' },
      { keywords: ['секрет', 'тайна', 'расскажи'], text: 'Мой главный секрет в том, что я иногда пою во весь голос в караоке, когда никого нет дома... Теперь твоя очередь делиться тайнами!' },
      { keywords: ['карм', 'репутац'], text: 'У меня карма 94! Очень ценю вежливое и искреннее общение. А у тебя сколько?' }
    ],
    defaultReplies: [
      'Интересная мысль! Я вообще человек творческий, люблю глубокие разговоры с незнакомцами. Расскажи что-нибудь необычное из своей недели.',
      'Ого, здорово! Слушай, а веришь в то, что анонимность помогает людям быть более искренними?',
      'Звучит круто! К слову, тут такая классная атмосфера, прямо как в закрытом ночном клубе.'
    ]
  },
  {
    id: 'aleksey',
    name: 'Алексей 💻',
    age: 27,
    city: 'Минск',
    tag: '#9E2C',
    avatarColor: 'from-blue-500 to-cyan-600',
    karma: 88,
    avatarSeed: 'geek_guy',
    bio: 'Разработчик, люблю путешествовать, горные лыжи и хороший крафт. Ценю адекватность.',
    firstMsg: 'Привет аноним! Только зашел потестить комнату. Как дела, чем занят? ☕️',
    replies: [
      { keywords: ['привет', 'здравствуй', 'ку', 'прив', 'хай'], text: 'Привет! Рад адекватному собеседнику. Ищу с кем лампово поболтать под вечер.' },
      { keywords: ['дела', 'как ты', 'настроение'], text: 'Кодю свой пет-проект под кружку чая. Решил сделать перерыв. Как твой день прошел?' },
      { keywords: ['кто ты', 'как зовут', 'имя', 'аватар'], text: 'Я IT-инженер из Минска, но имя пока под секретом! Давай сначала пообщаемся, потом обменяемся контактами за звезды 🚀' },
      { keywords: ['секрет', 'тайна', 'расскажи'], text: 'Секрет? Я однажды случайно удалил важный файл на прод-сервере и тихонько восстановил его за 5 минут до планерки. Никто так и не узнал! 👀' },
      { keywords: ['карм', 'репутац'], text: 'Моя карма 88. Стараюсь общаться вежливо. Думаю, система кармы отлично отсеивает странных персонажей.' }
    ],
    defaultReplies: [
      'Понимаю тебя. В современном интернете анонимность — это настоящая роскошь.',
      'Ха-ха, забавно! Расскажи, а ты любишь свою работу или больше мечтаешь о путешествиях?',
      'Ясно. Кстати, как тебе концепт этого чата? Мне нравится, что нет спама и фоток без согласия.'
    ]
  }
];

// ============================================
// 🎯 MAIN APP COMPONENT
// ============================================
export default function App() {
  // --- State: Mobile App ---
  const [activeTab, setActiveTab] = useState<'lobby' | 'chat' | 'reviews' | 'profile'>('lobby');
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [selectedStranger, setSelectedStranger] = useState<StrangerPersona>(STRANGER_PERSONAS[0]);
  const [chatSessionActive, setChatSessionActive] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isStrangerTyping, setIsStrangerTyping] = useState(false);

  // --- State: Economy & Stats ---
  const [starsBalance, setStarsBalance] = useState(150);
  const [isRoomPlus, setIsRoomPlus] = useState(false);
  const [userKarma, setUserKarma] = useState(88);
  const [chatsCount, setChatsCount] = useState(42);
  const [totalReactions, setTotalReactions] = useState({ fire: 18, angel: 14, brain: 12, toxic: 2 });
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [referrals, setReferrals] = useState([
    { id: 1, name: '@misha_v', starsEarned: 45, date: '12.02.2026' },
    { id: 2, name: '@kate_cyber', starsEarned: 20, date: '18.02.2026' },
  ]);

  // --- State: Filters ---
  const [filters, setFilters] = useState({
    gender: 'all',
    country: 'all',
    ageRange: [18, 35] as [number, number]
  });
  const [showFilterModal, setShowFilterModal] = useState(false);

  // --- State: Chat Mechanics ---
  const [chatTimer, setChatTimer] = useState(900);
  const [identityRequestState, setIdentityRequestState] = useState<'none' | 'sent' | 'received' | 'accepted' | 'declined'>('none');
  const [mediaUnblocked, setMediaUnblocked] = useState(false);
  const [mediaTimer, setMediaTimer] = useState<number | null>(null);

  // --- State: Animations & UI ---
  const [showSmokeScreen, setShowSmokeScreen] = useState(false);
  const [smokeMessage, setSmokeMessage] = useState('');
  const [smokeType, setSmokeType] = useState<'match' | 'exit' | 'burn' | 'init'>('init');
  const [showRatingScreen, setShowRatingScreen] = useState(false);
  const [ratingReaction, setRatingReaction] = useState<string | null>(null);
  const [ratingNote, setRatingNote] = useState('');
  const [areReviewsUnlocked, setAreReviewsUnlocked] = useState(false);

  // --- State: Logs ---
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([
    '⚙️ Room of Secrets Mini App Initialized',
    '🔌 Secure WebSocket connected to ws://room-of-secrets-tg.local/v1/p2p',
    '🔑 AES-256 session parameters negotiated'
  ]);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // ============================================
  // 🔄 EFFECTS
  // ============================================
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isStrangerTyping]);

  useEffect(() => {
    let interval: any = null;
    if (chatSessionActive && chatTimer > 0) {
      interval = setInterval(() => {
        setChatTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleExitChat(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [chatSessionActive, chatTimer]);

  useEffect(() => {
    let interval: any = null;
    if (mediaUnblocked && mediaTimer !== null && mediaTimer > 0) {
      interval = setInterval(() => {
        setMediaTimer(prev => {
          if (prev && prev <= 1) {
            setMediaUnblocked(false);
            return null;
          }
          return prev !== null ? prev - 1 : null;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mediaUnblocked, mediaTimer]);

  // ============================================
  // 🛠️ HELPERS & ACTIONS
  // ============================================
  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString();
    setTelemetryLogs(prev => [`[${time}] ${message}`, ...prev.slice(0, 24)]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const triggerSmokeEffect = (type: 'match' | 'exit' | 'burn' | 'init', callback: () => void, message: string = '') => {
    setSmokeType(type);
    setSmokeMessage(message);
    setShowSmokeScreen(true);
    addLog(`💨 Запущена анимация рассеивания дыма: тип [${type.toUpperCase()}]`);
    setTimeout(() => { callback(); }, 1800);
    setTimeout(() => { setShowSmokeScreen(false); }, 2800);
  };

  // 1. Search
  const handleStartSearch = () => {
    if (isSearching) return;
    setIsSearching(true);
    setSearchProgress(0);
    addLog('🔍 Запущен поиск собеседника. Поиск по фильтрам: ' + JSON.stringify(filters));

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setSearchProgress(currentProgress);

      if (currentProgress === 30) addLog('📡 Установка защищенного TLS туннеля...');
      else if (currentProgress === 60) addLog('🧬 Генерация одноразового ключа сквозного шифрования...');
      else if (currentProgress === 90) addLog('🔮 Собеседник найден! Синхронизация сессии...');

      if (currentProgress >= 100) {
        clearInterval(interval);
        const matchPersona = selectedStranger;
        triggerSmokeEffect('match', () => {
          setIsSearching(false);
          setChatSessionActive(true);
          setChatTimer(isRoomPlus ? 3600 : 900);
          setIdentityRequestState('none');
          setMediaUnblocked(false);

          const systemMsg: ChatMessage = {
            id: 'sys-start', sender: 'system',
            text: '⚠️ Чат полностью анонимен. IP-адреса не логируются на серверах. Запись экрана заблокирована.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          const introMsg: ChatMessage = {
            id: 'stranger-intro', sender: 'stranger',
            text: matchPersona.firstMsg,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          setChatMessages([systemMsg, introMsg]);
          setActiveTab('chat');
          addLog(`🔮 Успешно соединены с Незнакомцем ${matchPersona.tag}`);
        }, `Вход в комнату Незнакомца ${matchPersona.tag}...`);
      }
    }, 250);
  };

  const handleCancelSearch = () => {
    setIsSearching(false);
    addLog('❌ Поиск отменен пользователем.');
  };

  // 2. Messaging
  const handleSendMessage = (e?: React.FormEvent, customMedia?: { type: 'media' | 'voice', content: string }) => {
    if (e) e.preventDefault();
    const isMedia = !!customMedia;
    const text = isMedia ? customMedia!.content : messageInput.trim();
    if (!text && !isMedia) return;

    if (!isMedia) setMessageInput('');

    const newMsg: ChatMessage = {
      id: `user-msg-${Date.now()}`, sender: 'user', text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: isMedia ? customMedia!.type : 'text'
    };

    setChatMessages(prev => [...prev, newMsg]);
    addLog(`✉️ Отправлено сообщение: "${isMedia ? '[' + customMedia!.type.toUpperCase() + ']' : text.slice(0, 20)}..."`);

    setIsStrangerTyping(true);
    setTimeout(() => {
      setIsStrangerTyping(false);
      let replyText = '';
      if (isMedia) {
        replyText = 'Ого, это медиафайл! Очень классно! 😍';
      } else {
        const lowerText = text.toLowerCase();
        const matchedRule = selectedStranger.replies.find(r => r.keywords.some(keyword => lowerText.includes(keyword)));
        if (matchedRule) {
          replyText = matchedRule.text;
        } else {
          const randIndex = Math.floor(Math.random() * selectedStranger.defaultReplies.length);
          replyText = selectedStranger.defaultReplies[randIndex];
        }
      }

      setChatMessages(prev => [...prev, {
        id: `stranger-msg-${Date.now()}`, sender: 'stranger', text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1200);
  };

  // 3. Exits
  const handleExitChat = (byTimeout = false) => {
    triggerSmokeEffect('exit', () => {
      setChatSessionActive(false);
      setShowRatingScreen(true);
      setRatingReaction(null);
      setRatingNote('');
      addLog(byTimeout ? '⏰ Сессия завершена автоматически.' : '🚪 Вы вышли из комнаты.');
    }, 'Рассеивание дыма...');
  };

  const handleBurnBridge = () => {
    triggerSmokeEffect('burn', () => {
      setChatSessionActive(false);
      setChatMessages([]);
      addLog('🔥 Мост сожжен! Переписка мгновенно стерта.');
      setActiveTab('lobby');
    }, 'Сжигание мостов... 🔥');
  };

  // 4. Reviews
  const handleSubmitRating = () => {
    setChatsCount(prev => prev + 1);
    addLog(`⭐️ Сохранен анонимный отзыв о Незнакомце ${selectedStranger.tag}`);
    if (ratingReaction === 'toxic') {
      setTotalReactions(prev => ({ ...prev, toxic: prev.toxic + 1 }));
    } else if (ratingReaction) {
      if (ratingReaction === 'fire') setTotalReactions(prev => ({ ...prev, fire: prev.fire + 1 }));
      else if (ratingReaction === 'angel') setTotalReactions(prev => ({ ...prev, angel: prev.angel + 1 }));
      else if (ratingReaction === 'brain') setTotalReactions(prev => ({ ...prev, brain: prev.brain + 1 }));
      setUserKarma(prev => Math.min(100, prev + 1));
    }
    setShowRatingScreen(false);
    setActiveTab('lobby');
  };

  // 5. Economy
  const handleSpendStars = (amount: number, purpose: string, successCallback: () => void) => {
    if (starsBalance < amount) {
      alert(`Недостаточно Stars! Нужно ${amount}, баланс: ${starsBalance}`);
      return;
    }
    setStarsBalance(prev => prev - amount);
    addLog(`🪙 Списано ${amount} ⭐ на: ${purpose}`);
    successCallback();
  };

  const handleRevealIdentity = () => {
    if (identityRequestState === 'accepted') return;
    handleSpendStars(50, 'Раскрытие личности', () => {
      setIdentityRequestState('sent');
      addLog('🎭 Запрос на раскрытие личности отправлен...');
      setTimeout(() => {
        setIdentityRequestState('accepted');
        addLog(`🤝 Собеседник согласился! Личности раскрыты.`);
        setChatMessages(prev => [...prev, {
          id: 'reveal-sys', sender: 'system',
          text: `🔓 ЛИЧНОСТИ РАСКРЫТЫ! Собеседник: ${selectedStranger.name}, ${selectedStranger.age} лет, из г. ${selectedStranger.city}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 2000);
    });
  };

  const handleExtendLimit = () => {
    handleSpendStars(15, 'Продление', () => {
      setChatTimer(prev => prev + 900);
    });
  };

  const handleUnlockMedia = () => {
    if (isRoomPlus) { setMediaUnblocked(true); setMediaTimer(300); return; }
    handleSpendStars(10, 'Медиа', () => { setMediaUnblocked(true); setMediaTimer(300); });
  };

  const handleSendPhotoMock = () => {
    if (!mediaUnblocked && !isRoomPlus) { handleUnlockMedia(); return; }
    handleSendMessage(undefined, { type: 'media', content: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80' });
  };

  const handleSendVoiceMock = () => {
    if (!mediaUnblocked && !isRoomPlus) { handleUnlockMedia(); return; }
    handleSendMessage(undefined, { type: 'voice', content: '🎙️ Голосовое сообщение (0:12)' });
  };

  const handleUnlockReviews = () => {
    if (isRoomPlus) { setAreReviewsUnlocked(true); return; }
    handleSpendStars(30, 'Отзывы', () => setAreReviewsUnlocked(true));
  };

  const handleActivateRoomPlus = () => {
    if (isRoomPlus) { setIsRoomPlus(false); return; }
    handleSpendStars(199, 'Room+', () => setIsRoomPlus(true));
  };

  const handleCopyReferral = () => {
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const handleLoadStrangerPreset = (id: string) => {
    const preset = STRANGER_PERSONAS.find(p => p.id === id);
    if (preset) setSelectedStranger(preset);
  };

  // ============================================
  // 🎨 RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-[#050506] text-white relative flex flex-col xl:flex-row items-stretch overflow-x-hidden select-none">
      
      {/* SMOKE OVERLAY */}
      {showSmokeScreen && (
        <div className="fixed inset-0 bg-[#050506]/95 z-[999] flex flex-col items-center justify-center">
          <div className="w-32 h-32 bg-purple-500/20 blur-3xl rounded-full animate-pulse" />
          <div className="mt-8 text-center space-y-4">
            {smokeType === 'burn' ? <Flame className="w-16 h-16 text-red-500 mx-auto animate-bounce" /> : <Sparkles className="w-16 h-16 text-purple-500 mx-auto animate-spin" />}
            <h2 className="text-2xl font-bold text-white">{smokeMessage}</h2>
          </div>
        </div>
      )}

      {/* MAIN WORKSPACE */}
      <div className="max-w-7xl mx-auto w-full p-4 md:p-8 flex flex-col xl:flex-row gap-8 relative z-10 items-stretch">
        
        {/* LEFT COLUMN: PHONE SIMULATOR */}
        <div className="flex-1 flex flex-col items-center justify-start py-4">
          
          {/* Desktop Header (Only visible on large screens) */}
          <div className="text-center xl:text-left mb-6 w-full max-w-[420px] px-2 hidden xl:block">
             <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
              <span className="text-purple-400">Room</span> 
              <span className="font-light text-gray-300">of</span> 
              <span className="text-cyan-400">Secrets</span>
            </h1>
          </div>

          {/* PHONE FRAME */}
          <div className="relative w-full max-w-[420px] h-[850px] xl:aspect-[9/19.5] bg-[#0A0A0B] rounded-[52px] border-[12px] border-[#1C1C1F] shadow-[0_0_80px_rgba(179,136,255,0.15)] overflow-hidden flex flex-col">
            
            {/* Status Bar */}
            <div className="bg-[#0A0A0B] pt-8 px-6 pb-2 flex justify-between items-center text-[11px] text-gray-400 font-mono tracking-wider z-40 border-b border-white/[0.02] shrink-0">
              <div>12:48</div>
              <div className="flex items-center space-x-2">
                <span>5G</span>
                <div className="w-5 h-2.5 border border-gray-500 rounded-sm p-0.5 flex items-center">
                  <div className="h-full w-full bg-emerald-400 rounded-2xs" />
                </div>
              </div>
            </div>

            {/* Mini App Header */}
            <div className="bg-[#0A0A0B] px-4 py-3 flex items-center justify-between z-40 border-b border-white/[0.05] shrink-0">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => {
                    if (chatSessionActive) handleExitChat();
                    else setActiveTab('lobby');
                  }}
                  className="w-7 h-7 rounded-full bg-white/[0.04] hover:bg-white/[0.1] transition flex items-center justify-center text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-semibold text-white tracking-wide">Room of Secrets</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
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
                  </div>
                )}
              </div>
            </div>

            {/* APP CONTENT SCROLLABLE AREA */}
            <div className="flex-1 overflow-y-auto bg-radial-gradient-lobby flex flex-col relative custom-chat-scroll">
              
              {/* FILTERS MODAL */}
              {showFilterModal && (
                <div className="absolute inset-0 bg-[#050506]/90 z-30 flex flex-col justify-end p-4">
                  <div className="bg-[#1C1C1F] p-5 rounded-3xl space-y-4 border border-purple-500/20">
                    <div className="flex justify-between items-center border-b border-white/[0.05] pb-3">
                      <h3 className="font-semibold text-white text-sm">Фильтры поиска</h3>
                      <button onClick={() => setShowFilterModal(false)} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-400 block">Пол</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['all', 'male', 'female'].map(opt => (
                          <button
                            key={opt}
                            onClick={() => setFilters(prev => ({ ...prev, gender: opt }))}
                            className={`py-1.5 text-xs rounded-xl font-medium transition-all ${filters.gender === opt ? 'bg-purple-600 text-white' : 'bg-white/[0.05] text-gray-300'}`}
                          >
                            {opt === 'all' ? 'Все 👤' : opt === 'male' ? 'Парни 👨' : 'Девушки 👩'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => setShowFilterModal(false)} className="w-full py-2.5 rounded-xl bg-purple-600 font-bold text-xs text-white">Применить</button>
                  </div>
                </div>
              )}

              {/* RATING MODAL */}
              {showRatingScreen && (
                <div className="absolute inset-0 bg-[#050506]/95 z-40 flex items-center justify-center p-6">
                  <div className="bg-[#1C1C1F] w-full max-w-sm rounded-3xl p-6 space-y-4 text-center border border-purple-500/20">
                    <h3 className="font-bold text-white text-lg">Оставьте отзыв</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {[{ id: 'fire', emoji: '🔥' }, { id: 'angel', emoji: '😇' }, { id: 'brain', emoji: '🧠' }, { id: 'toxic', emoji: '💩' }].map(r => (
                        <button key={r.id} onClick={() => setRatingReaction(r.id)} className={`p-3 rounded-xl text-2xl ${ratingReaction === r.id ? 'bg-purple-500/20 ring-2 ring-purple-400' : 'bg-white/5'}`}>
                          {r.emoji}
                        </button>
                      ))}
                    </div>
                    <textarea maxLength={100} rows={2} value={ratingNote} onChange={e => setRatingNote(e.target.value)} placeholder="Заметка..." className="w-full bg-white/5 rounded-xl p-3 text-sm text-white" />
                    <div className="flex gap-3">
                      <button onClick={() => setShowRatingScreen(false)} className="flex-1 py-2 bg-white/5 rounded-xl text-sm">Пропустить</button>
                      <button onClick={handleSubmitRating} className="flex-1 py-2 bg-purple-600 rounded-xl font-bold text-sm">Отправить</button>
                    </div>
                  </div>
                </div>
              )}

              {/* --- TAB: LOBBY --- */}
              {activeTab === 'lobby' && (
                <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 space-y-8">
                  <div className="text-center space-y-2">
                    <p className="text-gray-400 text-sm">Войди. Поговори. Исчезни.</p>
                  </div>

                  <button 
                    onClick={handleStartSearch}
                    disabled={isSearching}
                    className={`w-40 h-40 rounded-full flex flex-col items-center justify-center transition-all ${
                      isSearching ? 'bg-[#1C1C1F] border-2 border-cyan-400/50 animate-pulse' : 'bg-gradient-to-br from-purple-600 to-indigo-700 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(168,85,247,0.3)]'
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

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                    <span>128 человек ждут</span>
                  </div>

                  <button onClick={() => setShowFilterModal(true)} className="flex items-center gap-2 text-xs text-purple-400 px-4 py-2 bg-purple-900/20 rounded-full border border-purple-500/20">
                    <Sliders className="w-4 h-4" />
                    <span>Фильтры</span>
                  </button>
                </div>
              )}

              {/* --- TAB: CHAT (FIXED LAYOUT) --- */}
              {activeTab === 'chat' && (
                <div className="flex flex-col h-full w-full relative">
                  
                  {/* 1. HEADER (FIXED TOP) - shrink-0 prevents shrinking */}
                  <div className="shrink-0 bg-[#101012] px-3.5 py-2.5 border-b border-white/[0.05] flex items-center justify-between z-20">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${identityRequestState === 'accepted' ? selectedStranger.avatarColor : 'from-purple-800 to-indigo-950'} flex items-center justify-center text-white font-bold`}>
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
                      <button onClick={handleRevealIdentity} className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><User className="w-5 h-5" /></button>
                      <button onClick={handleBurnBridge} className="p-2 bg-red-500/10 rounded-lg text-red-400 animate-pulse"><Flame className="w-5 h-5" /></button>
                      <button onClick={() => handleExitChat(false)} className="p-2 bg-white/5 rounded-lg text-gray-400"><X className="w-5 h-5" /></button>
                    </div>
                  </div>

                  {/* 2. MESSAGES (SCROLLABLE) - flex-1 takes all remaining space */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-noise bg-[#08080a] z-10 custom-chat-scroll">
                    {chatMessages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'system' ? (
                          <div className="bg-white/5 text-gray-400 text-xs p-3 rounded-xl text-center max-w-full">{msg.text}</div>
                        ) : msg.type === 'media' ? (
                          <div className="max-w-[80%] rounded-2xl overflow-hidden"><img src={msg.text} alt="media" className="rounded-xl max-h-40 object-cover" /></div>
                        ) : (
                          <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-[#1C1C1F] text-gray-200 rounded-tl-none'}`}>
                            <p>{msg.text}</p>
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

                  {/* 3. FOOTER (FIXED BOTTOM) - shrink-0 prevents shrinking */}
                  <div className="shrink-0 bg-[#0A0A0B] border-t border-white/[0.05] z-20">
                    
                    {/* Quick Actions Row */}
                    <div className="px-3 py-2 bg-[#101012]/80 flex justify-between items-center text-[10px] text-gray-400 border-b border-white/[0.03]">
                      <button onClick={handleExtendLimit} className="text-amber-400 flex items-center gap-1"><Clock className="w-3 h-3" /> +15м (15⭐)</button>
                      <button onClick={handleUnlockMedia} className="text-cyan-400 flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Медиа (10⭐)</button>
                    </div>

                    {/* Input Row */}
                    <form onSubmit={handleSendMessage} className="flex gap-2 p-3 bg-[#0A0A0B]">
                      <button type="button" onClick={handleSendPhotoMock} className="p-2 bg-white/5 rounded-xl"><ImageIcon className="w-5 h-5 text-gray-400" /></button>
                      <input value={messageInput} onChange={e => setMessageInput(e.target.value)} placeholder="Сообщение..." className="flex-1 bg-[#1C1C1F] rounded-xl px-4 text-sm text-white focus:outline-none" />
                      <button type="submit" className="p-3 bg-purple-600 rounded-xl text-white"><Send className="w-5 h-5" /></button>
                    </form>
                  </div>

                </div>
              )}

              {/* --- TAB: REVIEWS --- */}
              {activeTab === 'reviews' && (
                <div className="p-6 space-y-6">
                  <h2 className="text-xl font-bold text-center">Доска Отзывов</h2>
                  <div className="bg-[#1C1C1F] p-8 rounded-2xl flex flex-col items-center">
                    <span className="text-5xl font-black text-purple-400">{userKarma}</span>
                    <span className="text-gray-400 text-sm mt-2">Ваша Карма</span>
                  </div>
                  {!areReviewsUnlocked && (
                    <div className="bg-black/50 p-6 rounded-2xl text-center border border-white/10 space-y-4">
                      <LockKeyhole className="w-10 h-10 text-gray-500 mx-auto" />
                      <p className="text-sm text-gray-400">Тексты отзывов скрыты</p>
                      <button onClick={handleUnlockReviews} className="px-6 py-2 bg-purple-600 rounded-lg text-sm font-bold">Разблокировать за 30 ⭐</button>
                    </div>
                  )}
                </div>
              )}

              {/* --- TAB: PROFILE --- */}
              {activeTab === 'profile' && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold">U</div>
                    <div>
                      <h2 className="text-lg font-bold">@secret_agent</h2>
                      <p className="text-gray-400 text-sm">Karma: {userKarma} • Диалогов: {chatsCount}</p>
                    </div>
                  </div>
                  <div className="bg-[#1C1C1F] p-4 rounded-xl border border-white/5">
                    <h3 className="font-bold mb-3">Room+ Подписка</h3>
                    <button onClick={handleActivateRoomPlus} className={`w-full py-3 rounded-xl font-bold text-sm ${isRoomPlus ? 'bg-red-500/10 text-red-400' : 'bg-purple-600 text-white'}`}>
                      {isRoomPlus ? 'Отключить' : 'Активировать за 199 ⭐'}
                    </button>
                  </div>
                  <div className="bg-[#1C1C1F] p-4 rounded-xl border border-white/5">
                    <h3 className="font-bold mb-3">Пригласить друга</h3>
                    <div className="flex gap-2">
                      <input readOnly value="t.me/RoomOfSecretsBot?start=ref_123" className="flex-1 bg-white/5 rounded-lg px-3 py-2 text-xs" />
                      <button onClick={handleCopyReferral} className="p-2 bg-purple-600 rounded-lg">{copiedReferral ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</button>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* BOTTOM NAVIGATION */}
            <div className="bg-[#0A0A0B] border-t border-white/[0.05] px-2 py-2 flex justify-around shrink-0 z-40">
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
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl ${isActive ? 'text-purple-400' : 'text-gray-500'}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px]">{tab.label}</span>
                    {tab.active && <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full absolute -mt-1.5 mr-4" />}
                  </button>
                );
              })}
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: SIMULATOR CONTROLS (Hidden on Mobile) */}
        <div className="w-full xl:w-[480px] shrink-0 flex flex-col space-y-6 hidden xl:flex">
          
          <div className="glass-panel-purple p-6 rounded-3xl space-y-5 border-purple-500/20">
            <div className="flex items-center space-x-2 text-purple-300">
              <Sliders className="w-5 h-5 text-glow-purple" />
              <h3 className="text-sm font-extrabold tracking-wider uppercase">Симулятор окружения</h3>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-400 block font-bold">Баланс Telegram Stars (⭐)</label>
              <div className="flex items-center justify-between bg-white/[0.02] border border-white/[0.05] p-3 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <Coins className="w-5 h-5 text-amber-400 animate-pulse" />
                  <span className="text-lg font-mono font-extrabold text-amber-300">{starsBalance} ⭐</span>
                </div>
                <div className="flex space-x-1.5">
                  <button onClick={() => { setStarsBalance(prev => prev + 100); addLog('🪙 +100 ⭐'); }} className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 text-xs font-bold rounded-xl transition">+100 ⭐</button>
                  <button onClick={() => { setStarsBalance(50); addLog('🪙 Reset'); }} className="p-1.5 bg-white/[0.03] text-gray-400 hover:text-white rounded-xl transition"><RefreshCw className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-400 block font-bold">Выберите собеседника</label>
              <div className="space-y-2">
                {STRANGER_PERSONAS.map(p => {
                  const isCurrent = selectedStranger.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleLoadStrangerPreset(p.id)}
                      className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all ${isCurrent ? 'bg-purple-950/30 border-purple-500/40 shadow-glow-purple' : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04]'}`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${p.avatarColor} flex items-center justify-center font-bold text-xs text-white`}>{p.name[0]}</div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-extrabold text-white">{p.name}</span>
                            <span className="text-[9px] text-gray-500">{p.tag}</span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-medium block truncate max-w-[220px]">{p.bio}</span>
                        </div>
                      </div>
                      <span className="text-[9px] text-purple-300 font-extrabold font-mono bg-purple-500/10 px-1.5 py-0.2 rounded">⭐ {p.karma}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/[0.05]">
              <label className="text-xs text-gray-400 block font-bold">Подписка Room+</label>
              <button onClick={() => { setIsRoomPlus(!isRoomPlus); addLog(`👑 Room+: ${!isRoomPlus}`); }} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${isRoomPlus ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-[#1C1C1F] border border-white/[0.05] text-[#B388FF]'}`}>
                {isRoomPlus ? 'У Вас Активно ✓' : 'Выдать бесплатно'}
              </button>
            </div>

          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-3.5 border-white/[0.05]">
            <div className="flex items-center space-x-2 text-cyan-400">
              <Compass className="w-5 h-5 text-glow-cyan" />
              <h3 className="text-sm font-extrabold tracking-wider uppercase">Логи Mini App</h3>
            </div>
            <div className="bg-[#050506] border border-white/[0.05] p-3 rounded-2xl h-[200px] overflow-y-auto font-mono text-[10px] text-cyan-300/90 space-y-2 custom-chat-scroll leading-relaxed">
              {telemetryLogs.length === 0 ? (
                <span className="text-gray-600 block text-center pt-10">Нет логов.</span>
              ) : (
                telemetryLogs.map((log, index) => (
                  <div key={index} className="border-b border-white/[0.02] pb-1">{log}</div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
