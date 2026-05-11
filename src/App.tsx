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

// Define stranger profiles for simulation
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
  },
  {
    id: 'alina',
    name: 'Алина 🎵',
    age: 19,
    city: 'Алматы',
    tag: '#3D5B',
    avatarColor: 'from-emerald-400 to-teal-600',
    karma: 91,
    avatarSeed: 'music_girl',
    bio: 'Студентка консерватории, играю на виолончели. Обожаю инди-рок, астрологию и матча-латте.',
    firstMsg: 'Привеетик! Какое у тебя настроение сегодня? Надеюсь, всё супер! ✨',
    replies: [
      { keywords: ['привет', 'здравствуй', 'ку', 'прив', 'хай'], text: 'Привет! Рада поболтать) Я Алина, ой, то есть Незнакомка #3D5B 🤫' },
      { keywords: ['дела', 'как ты', 'настроение'], text: 'Пью холодный матча-латте и готовлюсь к зачету по зарубежной музыке. А у тебя?' },
      { keywords: ['кто ты', 'как зовут', 'имя', 'аватар'], text: 'Я скромная студентка-музыкант) Давай сначала поболтаем поближе, а потом, может, откроем личности через маску?' },
      { keywords: ['секрет', 'тайна', 'расскажи'], text: 'Мой секрет — я верю в совместимость по натальным картам и иногда тайно гадаю на своих знакомых... Надеюсь, ты не скептик! 🔮' },
      { keywords: ['карм', 'репутац'], text: 'Ой, у меня карма 91. Мне оставляют в основном реакции "😇 добрый" и "🧠 умный". Это так мило!' }
    ],
    defaultReplies: [
      'Вау! Звучит здорово. Давай сыграем в "правду или действие" или расскажи свой самый забавный фейл в жизни?',
      'Обожаю такие спонтанные разговоры! А какую музыку ты слушаешь, когда грустно?',
      'Кстати, а ты часто пользуешься Telegram Stars? Мне кажется, идея с деаноном за звезды очень забавная.'
    ]
  },
  {
    id: 'kirill',
    name: 'Кирилл ✈️',
    age: 31,
    city: 'Тбилиси',
    tag: '#7C8A',
    avatarColor: 'from-amber-500 to-rose-600',
    karma: 96,
    avatarSeed: 'startup_guy',
    bio: 'Основатель стартапа, путешественник, бывший мотогонщик. Люблю глубокие беседы.',
    firstMsg: 'Приветствую. Зашел протестировать формат анонимной комнаты. Надеюсь встретить интересного собеседника.',
    replies: [
      { keywords: ['привет', 'здравствуй', 'ку', 'прив', 'хай'], text: 'Добрый день. Рад знакомству. Из какого ты города?' },
      { keywords: ['дела', 'как ты', 'настроение'], text: 'Много задач по текущему проекту, решил сделать 10-минутный перерыв здесь, чтобы переключить мозг.' },
      { keywords: ['кто ты', 'как зовут', 'имя', 'аватар'], text: 'Я основатель небольшого туристического сервиса. Живу в Тбилиси. Готов обменяться профилями, если разговор пойдет отлично!' },
      { keywords: ['секрет', 'тайна', 'расскажи'], text: 'Мой главный секрет? Я продал свой первый автомобиль, чтобы запустить стартап, который полностью прогорел в первый месяц. Но это научило меня стойкости.' },
      { keywords: ['карм', 'репутац'], text: 'Моя карма 96. В этом чате это важно, так как позитивные пользователи быстрее находят собеседников в приоритетной очереди.' }
    ],
    defaultReplies: [
      'Полностью согласен. В наше время цифровая гигиена и анонимность — ценный ресурс.',
      'Интересный ответ. Расскажи, а какова твоя главная профессиональная цель на этот год?',
      'Здорово. В Тбилиси сейчас отличная погода, кстати. А у вас как?'
    ]
  }
];

export default function App() {
  // Mobile app state
  const [activeTab, setActiveTab] = useState<'lobby' | 'chat' | 'reviews' | 'profile'>('lobby');
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [selectedStranger, setSelectedStranger] = useState<StrangerPersona>(STRANGER_PERSONAS[0]);
  const [chatSessionActive, setChatSessionActive] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isStrangerTyping, setIsStrangerTyping] = useState(false);
  
  // Custom user preferences / stats
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

  // Filters State
  const [filters, setFilters] = useState({
    gender: 'all', // 'all' | 'male' | 'female'
    country: 'all', // 'all' | 'RU' | 'CIS' | 'EU'
    ageRange: [18, 35] as [number, number],
    premiumInterests: [] as string[]
  });
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Chat Interactive Mechanisms
  const [chatTimer, setChatTimer] = useState(900); // 15 mins in seconds
  const [identityRequestState, setIdentityRequestState] = useState<'none' | 'sent' | 'received' | 'accepted' | 'declined'>('none');
  const [mediaUnblocked, setMediaUnblocked] = useState(false);
  const [mediaTimer, setMediaTimer] = useState<number | null>(null); // Time in seconds for media unlock

  // Smoke Screen / Burn Bridge Animations
  const [showSmokeScreen, setShowSmokeScreen] = useState(false);
  const [smokeMessage, setSmokeMessage] = useState('');
  const [smokeType, setSmokeType] = useState<'match' | 'exit' | 'burn' | 'init'>('init');

  // Rating Screen
  const [showRatingScreen, setShowRatingScreen] = useState(false);
  const [ratingReaction, setRatingReaction] = useState<string | null>(null);
  const [ratingNote, setRatingNote] = useState('');

  // Unblurred reviews
  const [areReviewsUnlocked, setAreReviewsUnlocked] = useState(false);

  // Live System Logs (Telemetry for preview)
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([
    '⚙️ Room of Secrets Mini App Initialized',
    '🔌 Secure WebSocket connected to ws://room-of-secrets-tg.local/v1/p2p',
    '🔑 AES-256 session parameters negotiated'
  ]);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isStrangerTyping]);

  // Add simulated log
  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString();
    setTelemetryLogs(prev => [`[${time}] ${message}`, ...prev.slice(0, 24)]);
  };

  // Timer Countdown inside Chat
  useEffect(() => {
    let interval: any = null;
    if (chatSessionActive && chatTimer > 0) {
      interval = setInterval(() => {
        setChatTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleExitChat(true); // Automatically leave when timer hits zero
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [chatSessionActive, chatTimer]);

  // Countdown for media unlock
  useEffect(() => {
    let interval: any = null;
    if (mediaUnblocked && mediaTimer !== null && mediaTimer > 0) {
      interval = setInterval(() => {
        setMediaTimer(prev => {
          if (prev && prev <= 1) {
            setMediaUnblocked(false);
            addLog('🔒 Временный доступ к медиа завершен (5 минут истекли)');
            return null;
          }
          return prev !== null ? prev - 1 : null;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mediaUnblocked, mediaTimer]);

  // Format time (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Trigger Smoke Screen Animation
  const triggerSmokeEffect = (type: 'match' | 'exit' | 'burn' | 'init', callback: () => void, message: string = '') => {
    setSmokeType(type);
    setSmokeMessage(message);
    setShowSmokeScreen(true);
    addLog(`💨 Запущена анимация рассеивания дыма: тип [${type.toUpperCase()}]`);
    setTimeout(() => {
      callback();
    }, 1800);
    setTimeout(() => {
      setShowSmokeScreen(false);
    }, 2800);
  };

  // Start Searching Flow
  const handleStartSearch = () => {
    if (isSearching) return;
    setIsSearching(true);
    setSearchProgress(0);
    addLog('🔍 Запущен поиск собеседника. Поиск по фильтрам: ' + JSON.stringify(filters));
    
    // Simulate progression
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setSearchProgress(currentProgress);
      if (currentProgress === 30) {
        addLog('📡 Установка защищенного TLS туннеля...');
      } else if (currentProgress === 60) {
        addLog('🧬 Генерация одноразового ключа сквозного шифрования (AES-GCM-256)...');
      } else if (currentProgress === 90) {
        addLog('🔮 Собеседник найден! Синхронизация сессии...');
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        // Execute Match
        const matchPersona = selectedStranger; // uses current selected persona in the developer side-panel
        triggerSmokeEffect('match', () => {
          setIsSearching(false);
          setChatSessionActive(true);
          setChatTimer(isRoomPlus ? 3600 : 900); // 60 mins for Room+, 15 mins free
          setIdentityRequestState('none');
          setMediaUnblocked(false);
          
          const systemMsg: ChatMessage = {
            id: 'sys-start',
            sender: 'system',
            text: '⚠️ Чат полностью анонимен. IP-адреса не логируются на серверах. Запись экрана заблокирована. Вы можете раскрыть свою личность или отправить медиа за Stars.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          const introMsg: ChatMessage = {
            id: 'stranger-intro',
            sender: 'stranger',
            text: matchPersona.firstMsg,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          setChatMessages([systemMsg, introMsg]);
          setActiveTab('chat');
          addLog(`🔮 Успешно соединены с Незнакомцем ${matchPersona.tag}. Начался отсчет сессии.`);
        }, `Вход в комнату Незнакомца ${matchPersona.tag}...`);
      }
    }, 250);
  };

  // Cancel Search
  const handleCancelSearch = () => {
    setIsSearching(false);
    addLog('❌ Поиск отменен пользователем.');
  };

  // Send message
  const handleSendMessage = (e?: React.FormEvent, customMedia?: { type: 'media' | 'voice', content: string }) => {
    if (e) e.preventDefault();
    
    const isMedia = !!customMedia;
    const text = isMedia ? customMedia!.content : messageInput.trim();
    if (!text && !isMedia) return;

    if (!isMedia) {
      setMessageInput('');
    }

    const newMsg: ChatMessage = {
      id: `user-msg-${Date.now()}`,
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: isMedia ? customMedia!.type : 'text'
    };

    setChatMessages(prev => [...prev, newMsg]);
    addLog(`✉️ Отправлено сообщение: "${isMedia ? '[' + customMedia!.type.toUpperCase() + ']' : text.slice(0, 20)}..."`);

    // Simulate Stranger response
    setIsStrangerTyping(true);
    setTimeout(() => {
      setIsStrangerTyping(false);
      
      // Compute response based on keywords
      let replyText = '';
      if (isMedia) {
        replyText = 'Ого, это медиафайл! Но я не могу его просмотреть без Room+ подписки или оплаты... Шучу, я его вижу! Очень классно! 😍';
      } else {
        const lowerText = text.toLowerCase();
        const matchedRule = selectedStranger.replies.find(r => 
          r.keywords.some(keyword => lowerText.includes(keyword))
        );
        
        if (matchedRule) {
          replyText = matchedRule.text;
        } else {
          // pick a random default reply
          const randIndex = Math.floor(Math.random() * selectedStranger.defaultReplies.length);
          replyText = selectedStranger.defaultReplies[randIndex];
        }
      }

      const strangerMsg: ChatMessage = {
        id: `stranger-msg-${Date.now()}`,
        sender: 'stranger',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, strangerMsg]);
      addLog(`📩 Получено сообщение от Незнакомца ${selectedStranger.tag}`);
    }, 1200);
  };

  // Exit Chat and trigger review dialog
  const handleExitChat = (byTimeout = false) => {
    triggerSmokeEffect('exit', () => {
      setChatSessionActive(false);
      setShowRatingScreen(true);
      setRatingReaction(null);
      setRatingNote('');
      addLog(byTimeout ? '⏰ Сессия завершена автоматически по истечению таймера.' : '🚪 Вы вышли из комнаты. Сессия закрыта.');
    }, 'Рассеивание дыма...');
  };

  // Burn Bridge (Immediate total delete)
  const handleBurnBridge = () => {
    triggerSmokeEffect('burn', () => {
      setChatSessionActive(false);
      setChatMessages([]);
      addLog('🔥 Мост сожжен! Переписка мгновенно стерта с обоих устройств.');
      setActiveTab('lobby');
    }, 'Сжигание мостов... 🔥');
  };

  // Complete rating of partner
  const handleSubmitRating = () => {
    // Save review simulation
    setChatsCount(prev => prev + 1);
    addLog(`⭐️ Сохранен анонимный отзыв о Незнакомце ${selectedStranger.tag}: Реакция [${ratingReaction || 'Не выбрана'}], Текст: "${ratingNote}"`);
    
    // Simulate Karma update
    if (ratingReaction === 'toxic') {
      addLog('⚠️ Собеседник получил жалобу на токсичность. Его теневая репутация понижена.');
      // Increment own reactions list mock
      setTotalReactions(prev => ({ ...prev, toxic: prev.toxic + 1 }));
    } else if (ratingReaction) {
      addLog('📈 Собеседник получил положительную оценку. Его карма и приоритет повышены!');
      if (ratingReaction === 'fire') {
        setTotalReactions(prev => ({ ...prev, fire: prev.fire + 1 }));
        setUserKarma(prev => Math.min(100, prev + 1));
      } else if (ratingReaction === 'angel') {
        setTotalReactions(prev => ({ ...prev, angel: prev.angel + 1 }));
        setUserKarma(prev => Math.min(100, prev + 1));
      } else if (ratingReaction === 'brain') {
        setTotalReactions(prev => ({ ...prev, brain: prev.brain + 1 }));
        setUserKarma(prev => Math.min(100, prev + 1));
      }
    }

    // Simulate notification after a delay: "Кто-то оставил о тебе отзыв"
    setTimeout(() => {
      addLog('🔔 Уведомление из бота @RoomOfSecretsBot: "Кто-то только что оставил о тебе отзыв на Доске Отзывов! Загляни в свой профиль."');
    }, 3000);

    setShowRatingScreen(false);
    setActiveTab('lobby');
  };

  // Spend Stars Logic
  const handleSpendStars = (amount: number, purpose: string, successCallback: () => void) => {
    if (starsBalance < amount) {
      addLog(`❌ Недостаточно Telegram Stars для действия: ${purpose}. Баланс: ${starsBalance} ⭐, Требуется: ${amount} ⭐`);
      alert(`Недостаточно Telegram Stars!\nВам нужно ${amount} ⭐, но ваш баланс ${starsBalance} ⭐.\nПополните баланс в панели справа!`);
      return;
    }

    setStarsBalance(prev => prev - amount);
    addLog(`🪙 Списано ${amount} ⭐ на: ${purpose}. Баланс: ${starsBalance - amount} ⭐`);
    successCallback();
  };

  // Mutual Identity Reveal Flow
  const handleRevealIdentity = () => {
    if (identityRequestState === 'accepted') return;

    handleSpendStars(50, 'Раскрытие личности', () => {
      setIdentityRequestState('sent');
      addLog('🎭 Запрос на раскрытие личности отправлен собеседнику за 50 ⭐...');
      
      // Simulate partner reaction after 2.5 seconds
      setTimeout(() => {
        // Random chance of accepting or forced acceptance for amazing demonstration
        setIdentityRequestState('accepted');
        addLog(`🤝 Собеседник согласился! Собеседник получил +25 ⭐. Личности раскрыты: Незнакомец ${selectedStranger.tag} на самом деле ${selectedStranger.name} (${selectedStranger.city})`);
        
        // Push identity info to messages
        setChatMessages(prev => [
          ...prev,
          {
            id: 'reveal-sys',
            sender: 'system',
            text: `🔓 ЛИЧНОСТИ РАСКРЫТЫ! Собеседник: ${selectedStranger.name}, ${selectedStranger.age} лет, из г. ${selectedStranger.city}. Вы получили доступ к Telegram-аккаунту!`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 2500);
    });
  };

  // Extend Chat Limit
  const handleExtendLimit = () => {
    handleSpendStars(15, 'Продление чата на 15 минут', () => {
      setChatTimer(prev => prev + 900);
      setChatMessages(prev => [
        ...prev,
        {
          id: `extend-${Date.now()}`,
          sender: 'system',
          text: '⏰ Чат продлен на 15 минут за 15 ⭐',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      addLog('⏰ Время чата увеличено на 15 минут.');
    });
  };

  // Unlock Media (voice messages / photos) for 5 minutes
  const handleUnlockMedia = () => {
    if (isRoomPlus) {
      setMediaUnblocked(true);
      setMediaTimer(300);
      addLog('🔓 Медиа бесплатно разблокировано на 5 минут по подписке Room+');
      return;
    }

    handleSpendStars(10, 'Разблокировка отправки медиа на 5 минут', () => {
      setMediaUnblocked(true);
      setMediaTimer(300);
      addLog('🔓 Медиа разблокировано на 5 минут за 10 ⭐');
    });
  };

  // Simulate Sending Photo Message
  const handleSendPhotoMock = () => {
    if (!mediaUnblocked && !isRoomPlus) {
      handleUnlockMedia();
      return;
    }
    
    const photoUrls = [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=80'
    ];
    const randPhoto = photoUrls[Math.floor(Math.random() * photoUrls.length)];
    
    handleSendMessage(undefined, {
      type: 'media',
      content: randPhoto
    });
  };

  // Simulate Sending Voice Message
  const handleSendVoiceMock = () => {
    if (!mediaUnblocked && !isRoomPlus) {
      handleUnlockMedia();
      return;
    }
    
    handleSendMessage(undefined, {
      type: 'voice',
      content: '🎙️ Голосовое сообщение (0:12)'
    });
  };

  // Unlock Own Reviews Board
  const handleUnlockReviews = () => {
    if (isRoomPlus) {
      setAreReviewsUnlocked(true);
      addLog('🔓 Доска отзывов у вас открыта бесплатно благодаря подписке Room+');
      return;
    }

    handleSpendStars(30, 'Просмотр полной доски отзывов', () => {
      setAreReviewsUnlocked(true);
      addLog('🔓 Доска отзывов успешно разблокирована за 30 ⭐');
    });
  };

  // Activate Room+
  const handleActivateRoomPlus = () => {
    if (isRoomPlus) {
      setIsRoomPlus(false);
      addLog('👑 Подписка Room+ отключена.');
      return;
    }

    handleSpendStars(199, 'Подписка Room+ (1 месяц)', () => {
      setIsRoomPlus(true);
      addLog('👑 Подписка Room+ УСПЕШНО АКТИВИРОВАНА! Доступны расширенные фильтры, безлимитное время, приоритетный поиск, бесплатный просмотр отзывов и отправка медиа!');
    });
  };

  // Mock Referral actions
  const handleCopyReferral = () => {
    setCopiedReferral(true);
    addLog('🔗 Реферальная ссылка скопирована в буфер обмена.');
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  // Invite Simulated Friend
  const handleInviteSimulatedFriend = () => {
    const friendNames = ['@andrey_tg', '@julia_rose', '@dimon_k', '@vlad_web', '@secret_user'];
    const randomFriend = friendNames[Math.floor(Math.random() * friendNames.length)];
    
    const newRef = {
      id: Date.now(),
      name: randomFriend,
      starsEarned: Math.floor(Math.random() * 30) + 10,
      date: new Date().toLocaleDateString()
    };

    setReferrals(prev => [newRef, ...prev]);
    setStarsBalance(prev => prev + 50); // Bonus for invitation simulation
    addLog(`🎁 Приглашен реферал ${randomFriend}! Начислен бонус 50 ⭐`);
  };

  // Quick preset loader from sidepanel
  const handleLoadStrangerPreset = (id: string) => {
    const preset = STRANGER_PERSONAS.find(p => p.id === id);
    if (preset) {
      setSelectedStranger(preset);
      addLog(`👉 В симуляторе выбран собеседник по умолчанию: ${preset.name}`);
      if (chatSessionActive) {
        // immediately switch persona mid-conversation to test!
        addLog(`🔄 Внимание! Собеседник изменен посреди чата на ${preset.name}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050506] text-[#f3f4f6] relative flex flex-col xl:flex-row items-stretch overflow-x-hidden select-none font-sans bg-noise">
      
      {/* 1. APP HERO HEADER (Desktop view only) */}
      <div className="absolute top-0 left-0 w-full h-[320px] bg-gradient-to-b from-[#19142e] to-transparent opacity-40 pointer-events-none z-0" />

      {/* 2. DYNAMIC SMOKE/BURNING DISPERSION SCREEN MOCK */}
      {showSmokeScreen && (
        <div className="fixed inset-0 bg-[#050506]/95 z-[999] flex flex-col items-center justify-center overflow-hidden transition-all duration-500">
          {/* Animated smoke rings and glowing particles */}
          <div className="absolute w-[300px] h-[300px] rounded-full bg-[#B388FF]/10 blur-[80px] animate-pulse-ring-slow" />
          <div className="absolute w-[180px] h-[180px] rounded-full bg-[#00E5FF]/10 blur-[50px] animate-pulse-ring-fast" />
          
          <div className="relative z-10 flex flex-col items-center space-y-6 px-6 text-center">
            {smokeType === 'burn' ? (
              <>
                <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/30 rounded-full flex items-center justify-center animate-bounce shadow-glow-purple">
                  <Flame className="w-10 h-10 text-rose-500 animate-pulse" />
                </div>
                <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-300 to-rose-400 tracking-wider">
                  СЖИГАНИЕ МОСТОВ
                </h2>
                <p className="text-gray-400 max-w-sm text-sm">
                  Вся история переписки безвозвратно удаляется с вашего экрана и экрана собеседника. Никаких следов.
                </p>
              </>
            ) : smokeType === 'match' ? (
              <>
                <div className="w-24 h-24 bg-purple-500/10 border border-purple-500/30 rounded-full flex items-center justify-center animate-spin">
                  <Sparkles className="w-12 h-12 text-[#B388FF]" />
                </div>
                <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-[#B388FF] to-cyan-400 tracking-wider">
                  СОЕДИНЕНИЕ...
                </h2>
                <p className="text-gray-400 max-w-sm text-sm">
                  {smokeMessage || 'Синхронизируем зашифрованные каналы...'}
                </p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center animate-pulse">
                  <Compass className="w-10 h-10 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-extrabold text-[#00E5FF] tracking-wider text-glow-cyan">
                  РАССЕИВАНИЕ ДЫМА
                </h2>
                <p className="text-gray-400 max-w-sm text-sm">
                  Комната закрывается. Вы возвращаетесь в безопасную зону.
                </p>
              </>
            )}

            {/* Simulated smoking dust particles */}
            <div className="flex space-x-2 mt-4">
              <span className="w-2 h-2 rounded-full bg-purple-500/60 animate-bounce" style={{ animationDelay: '0.1s' }} />
              <span className="w-2 h-2 rounded-full bg-cyan-400/60 animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="w-2 h-2 rounded-full bg-rose-500/60 animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN WORKSPACE CONTENT */}
      <div className="max-w-7xl mx-auto w-full p-4 md:p-8 flex flex-col xl:flex-row gap-8 relative z-10 items-stretch">
        
        {/* ========================================================
            LEFT COLUMN: INTERACTIVE TELEGRAM MINI APP SIMULATOR
            ======================================================== */}
        <div className="flex-1 flex flex-col items-center justify-start py-4">
          
          {/* Slogan and Brand badge on top */}
          <div className="text-center xl:text-left mb-6 w-full max-w-[420px] px-2">
            <div className="inline-flex items-center space-x-2 bg-purple-900/40 border border-purple-500/30 px-3 py-1 rounded-full mb-3 shadow-glow-purple">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-xs uppercase font-semibold text-purple-200 tracking-widest">Telegram Mini App UI</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center justify-center xl:justify-start gap-2">
              <span className="text-glow-purple text-purple-400">Room</span> 
              <span className="font-light text-gray-300">of</span> 
              <span className="text-glow-cyan text-cyan-400">Secrets</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Войди. Поговори. Исчезни. <span className="text-purple-400 font-medium">Рандом-чат с анонимной кармой</span>
            </p>
          </div>

          {/* SMARTPHONE FRAME CONTAINER */}
          <div className="relative w-full max-w-[420px] aspect-[9/19.5] bg-[#0A0A0B] rounded-[52px] border-[12px] border-[#1C1C1F] shadow-[0_0_80px_rgba(179,136,255,0.15)] overflow-hidden flex flex-col select-none">
            
            {/* Phone Front Camera & Speaker Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-[#1C1C1F] rounded-b-3xl z-50 flex items-center justify-center">
              <div className="w-16 h-1 bg-[#101012] rounded-full mb-1.5" />
              <div className="w-3.5 h-3.5 bg-[#0A0A0B] rounded-full absolute right-8 bottom-1.5 border border-[#1C1C1F]/40 flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-blue-900/60" />
              </div>
            </div>

            {/* Phone Status Bar (Simulated Telegram Mini App Interface) */}
            <div className="bg-[#0A0A0B] pt-8 px-6 pb-2 flex justify-between items-center text-[11px] text-gray-400 font-mono tracking-wider z-40 border-b border-white/[0.02]">
              <div>12:48</div>
              <div className="flex items-center space-x-2">
                <span>5G</span>
                <div className="w-5 h-2.5 border border-gray-500 rounded-sm p-0.5 flex items-center">
                  <div className="h-full w-full bg-emerald-400 rounded-2xs" />
                </div>
              </div>
            </div>

            {/* Telegram Web App Top Bar Header */}
            <div className="bg-[#0A0A0B] px-4 py-3 flex items-center justify-between z-40 border-b border-white/[0.05]">
              <div className="flex items-center space-x-3">
                {/* Back / Close Buttons */}
                <div className="flex space-x-1.5">
                  <button 
                    onClick={() => {
                      if (chatSessionActive) {
                        handleExitChat();
                      } else {
                        setActiveTab('lobby');
                      }
                    }}
                    className="w-7 h-7 rounded-full bg-white/[0.04] active:bg-white/[0.1] hover:text-white transition flex items-center justify-center text-gray-400"
                    title="Назад"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-semibold text-white tracking-wide">Room of Secrets</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <span className="text-[10px] text-gray-500">bot mini app</span>
                </div>
              </div>

              {/* User Stats / TG Stars Balance indicator inside the header */}
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

            {/* MAIN MINI APP SCREEN CONTENT SCROLLABLE */}
            <div className="flex-1 overflow-y-auto bg-radial-gradient-lobby flex flex-col relative custom-chat-scroll">
              
              {/* INTERACTIVE FILTERS BUTTON OVERLAY */}
              {showFilterModal && (
                <div className="absolute inset-0 bg-[#050506]/90 z-30 flex flex-col justify-end p-4 transition-all duration-300">
                  <div className="glass-panel-purple p-5 rounded-3xl space-y-4">
                    <div className="flex justify-between items-center border-b border-white/[0.05] pb-3">
                      <div className="flex items-center space-x-2">
                        <Sliders className="w-4 h-4 text-purple-400" />
                        <h3 className="font-semibold text-white text-sm">Фильтры поиска</h3>
                      </div>
                      <button onClick={() => setShowFilterModal(false)} className="text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Gender filter */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-400 block">Пол собеседника</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'all', label: 'Все 👤' },
                          { id: 'male', label: 'Парни 👨' },
                          { id: 'female', label: 'Девушки 👩' }
                        ].map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => setFilters(prev => ({ ...prev, gender: opt.id }))}
                            className={`py-1.5 text-xs rounded-xl font-medium transition-all ${
                              filters.gender === opt.id 
                                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md' 
                                : 'bg-white/[0.05] hover:bg-white/[0.08] text-gray-300'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Geolocation/Country filter */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs text-gray-400">Регион поиска</label>
                        {!isRoomPlus && (
                          <span className="text-[10px] text-purple-300 flex items-center gap-0.5 font-bold">
                            <Lock className="w-2.5 h-2.5" /> Room+
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'all', label: 'Весь мир 🌍', requiresPremium: false },
                          { id: 'RU', label: 'Россия 🇷🇺', requiresPremium: true },
                          { id: 'CIS', label: 'СНГ 🌍', requiresPremium: true },
                          { id: 'EU', label: 'Европа 🇪🇺', requiresPremium: true }
                        ].map(opt => {
                          const isLocked = opt.requiresPremium && !isRoomPlus;
                          return (
                            <button
                              key={opt.id}
                              disabled={isLocked && false /* Allow selection for preview with lock feedback */}
                              onClick={() => {
                                if (isLocked) {
                                  alert("Для выбора региональных фильтров требуется подписка Room+!");
                                  return;
                                }
                                setFilters(prev => ({ ...prev, country: opt.id }));
                              }}
                              className={`py-2 px-2 text-xs rounded-xl font-medium transition-all flex items-center justify-between ${
                                isLocked 
                                  ? 'opacity-60 bg-white/[0.02] border border-white/[0.03] text-gray-500 cursor-not-allowed'
                                  : filters.country === opt.id 
                                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md' 
                                    : 'bg-white/[0.05] hover:bg-white/[0.08] text-gray-300'
                              }`}
                            >
                              <span>{opt.label}</span>
                              {isLocked && <Lock className="w-3 h-3 text-purple-400" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Age Range Filter */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Возрастной диапазон</span>
                        <span className="text-purple-300 font-mono">{filters.ageRange[0]} - {filters.ageRange[1]} лет</span>
                      </div>
                      <div className="space-y-1">
                        <input 
                          type="range" 
                          min="18" 
                          max="50" 
                          value={filters.ageRange[1]} 
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setFilters(prev => ({ ...prev, ageRange: [18, val] }));
                          }}
                          className="w-full accent-purple-500" 
                        />
                        <span className="text-[10px] text-gray-500 italic block text-right">настраивается ползунком</span>
                      </div>
                    </div>

                    {/* Save Action Button */}
                    <button
                      onClick={() => {
                        setShowFilterModal(false);
                        addLog('💾 Фильтры сохранены успешно.');
                      }}
                      className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 font-bold text-xs text-white shadow-glow-purple flex items-center justify-center space-x-1 transition-all"
                    >
                      <Check className="w-4 h-4" />
                      <span>Применить фильтры</span>
                    </button>
                  </div>
                </div>
              )}

              {/* POST CHAT FEEDBACK RATING OVERLAY */}
              {showRatingScreen && (
                <div className="absolute inset-0 bg-[#050506]/95 z-40 flex flex-col justify-center p-4">
                  <div className="glass-panel-purple p-6 rounded-3xl space-y-5 text-center relative border-purple-500/20">
                    
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full bg-[#1C1C1F] border border-purple-500/30 flex items-center justify-center shadow-glow-purple">
                      <Sparkles className="w-10 h-10 text-[#B388FF] animate-pulse" />
                    </div>

                    <div className="pt-8">
                      <h3 className="text-lg font-extrabold text-white">Оставьте тайный отзыв</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        Ваш отзыв формирует «теневую репутацию» (Карму) Незнакомца #{selectedStranger.tag}, но имя и лицо остаются скрыты!
                      </p>
                    </div>

                    {/* Reaction options */}
                    <div className="space-y-2">
                      <span className="text-[11px] text-gray-500 uppercase tracking-widest font-mono">Выберите одну реакцию</span>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { id: 'fire', emoji: '🔥', label: 'Интересный', color: 'hover:bg-orange-500/20 border-orange-500/20' },
                          { id: 'angel', emoji: '😇', label: 'Добрый', color: 'hover:bg-emerald-500/20 border-emerald-500/20' },
                          { id: 'brain', emoji: '🧠', label: 'Умный', color: 'hover:bg-purple-500/20 border-purple-500/20' },
                          { id: 'toxic', emoji: '💩', label: 'Токсичный', color: 'hover:bg-red-500/20 border-red-500/20' }
                        ].map(react => (
                          <button
                            key={react.id}
                            onClick={() => {
                              setRatingReaction(react.id);
                              addLog(`👍 Выбрана предварительная оценка: [${react.label}]`);
                            }}
                            className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center ${react.color} ${
                              ratingReaction === react.id 
                                ? 'bg-purple-500/20 border-purple-400 scale-105 shadow-glow-purple' 
                                : 'bg-white/[0.03] border-white/[0.05]'
                            }`}
                          >
                            <span className="text-2xl mb-1">{react.emoji}</span>
                            <span className="text-[9px] text-gray-300 font-medium">{react.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Text Note up to 100 characters */}
                    <div className="space-y-1.5 text-left">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400">Анонимная заметка</span>
                        <span className={`font-mono text-[10px] ${ratingNote.length > 90 ? 'text-red-400' : 'text-gray-500'}`}>
                          {ratingNote.length}/100
                        </span>
                      </div>
                      <textarea
                        maxLength={100}
                        rows={2}
                        value={ratingNote}
                        onChange={(e) => setRatingNote(e.target.value)}
                        placeholder="Опишите ваши впечатления от общения (не показывается собеседнику)..."
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition"
                      />
                      <span className="text-[9px] text-gray-500 italic">
                        🔒 Сохранится в теневом профиле и повлияет на его Karma.
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => {
                          setShowRatingScreen(false);
                          setActiveTab('lobby');
                          addLog('🚪 Выход без отзыва.');
                        }}
                        className="py-2.5 rounded-xl border border-white/[0.1] hover:bg-white/[0.05] text-gray-400 text-xs font-semibold"
                      >
                        Пропустить
                      </button>
                      <button
                        onClick={handleSubmitRating}
                        className="py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 font-bold text-xs text-white shadow-glow-purple"
                      >
                        Отправить отзыв
                      </button>
                    </div>

                  </div>
                </div>
              )}


              {/* ----------------------------------------------------
                  A. LOBBY TAB
                  ---------------------------------------------------- */}
              {activeTab === 'lobby' && (
                <div className="flex-1 flex flex-col justify-between p-5 space-y-6">
                  
                  {/* Slogan Intro */}
                  <div className="text-center space-y-1.5 pt-2">
                    <h2 className="text-xl font-bold text-glow-purple tracking-wide text-white">
                      Тайный Чат 1-на-1
                    </h2>
                    <p className="text-xs text-gray-400 max-w-xs mx-auto">
                      Полная анонимность. Мгновенный подбор. Система отзывов и репутации.
                    </p>
                  </div>

                  {/* GIANT MATCH BUTTON AREA */}
                  <div className="flex flex-col items-center justify-center py-6 relative">
                    
                    {/* Ring animators background */}
                    {isSearching ? (
                      <div className="absolute w-56 h-56 rounded-full bg-cyan-400/10 border border-cyan-400/20 animate-pulse-ring-fast flex items-center justify-center">
                        <div className="w-44 h-44 rounded-full bg-purple-500/10 border border-purple-500/20 animate-pulse-ring-slow" />
                      </div>
                    ) : (
                      <div className="absolute w-44 h-44 rounded-full bg-purple-500/5 border border-purple-500/10 animate-pulse-ring-slow" />
                    )}

                    {/* Smoke particles simulations */}
                    <div className="absolute top-2 left-1/4 w-3 h-3 bg-[#B388FF]/30 rounded-full blur-xs animate-smoke" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute bottom-6 right-1/4 w-4 h-4 bg-[#00E5FF]/20 rounded-full blur-xs animate-smoke" style={{ animationDelay: '1.5s' }} />
                    
                    <button
                      onClick={isSearching ? handleCancelSearch : handleStartSearch}
                      className={`relative z-10 w-36 h-36 rounded-full flex flex-col items-center justify-center p-4 transition-all duration-300 ${
                        isSearching 
                          ? 'bg-gradient-to-br from-[#00E5FF]/20 via-[#00E5FF]/5 to-[#B388FF]/10 border-2 border-cyan-400 shadow-glow-cyan scale-95' 
                          : 'bg-gradient-to-br from-[#B388FF] via-purple-700 to-indigo-900 text-white shadow-glow-purple border border-purple-400 hover:scale-105 active:scale-95'
                      }`}
                    >
                      {isSearching ? (
                        <>
                          <span className="text-3xl mb-1.5 animate-spin">🔮</span>
                          <span className="text-xs font-black tracking-widest text-cyan-400 text-glow-cyan animate-pulse">
                            ПОИСК...
                          </span>
                          <span className="text-[9px] text-gray-400 font-mono mt-1 font-bold">
                            {searchProgress}%
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-4xl mb-1.5">🔮</span>
                          <span className="text-xs font-black tracking-wider text-center leading-tight">
                            ВОЙТИ В<br/>КОМНАТУ
                          </span>
                          <span className="text-[9px] text-purple-200 mt-1 font-mono font-medium tracking-normal">
                            Нажмите для входа
                          </span>
                        </>
                      )}
                    </button>

                    {/* Online counter */}
                    <div className="mt-6 bg-[#1C1C1F]/80 border border-white/[0.04] px-4 py-1.5 rounded-full text-center flex items-center space-x-2 shadow-sm relative z-10">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-[11px] text-gray-300">
                        Сейчас <strong className="text-purple-300 font-mono">128</strong> человек ждут собеседника
                      </span>
                    </div>
                  </div>

                  {/* QUICK STATS & FILTERS BADGES */}
                  <div className="space-y-3 bg-[#1C1C1F]/40 border border-white/[0.04] p-3 rounded-2xl">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-300 flex items-center gap-1">
                        <Sliders className="w-3.5 h-3.5 text-purple-400" />
                        Фильтры поиска
                      </span>
                      <button
                        onClick={() => setShowFilterModal(true)}
                        className="text-[11px] font-bold text-[#00E5FF] hover:underline"
                      >
                        Изменить
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <span className="bg-white/[0.04] border border-white/[0.05] text-[10px] text-gray-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                        Пол: {filters.gender === 'all' ? 'Все 👤' : filters.gender === 'male' ? 'Парни 👨' : 'Девушки 👩'}
                      </span>
                      <span className="bg-white/[0.04] border border-white/[0.05] text-[10px] text-gray-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                        Возраст: {filters.ageRange[0]}-{filters.ageRange[1]} лет
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                        filters.country !== 'all' 
                          ? 'bg-purple-950/40 border-purple-500/30 text-purple-300' 
                          : 'bg-white/[0.04] border-white/[0.05] text-gray-300'
                      }`}>
                        Регион: {filters.country === 'all' ? 'Любой 🌍' : filters.country}
                        {filters.country !== 'all' && !isRoomPlus && <Lock className="w-2.5 h-2.5 text-purple-400" />}
                      </span>
                    </div>

                    {/* Prompt info */}
                    <p className="text-[10px] text-gray-500 leading-tight">
                      *Региональные фильтры и интересы доступны по подписке <strong className="text-purple-400">Room+</strong>.
                    </p>
                  </div>

                  {/* BENEFITS BANNER */}
                  <div className="bg-gradient-to-r from-purple-900/20 to-indigo-900/30 border border-purple-500/20 p-3.5 rounded-2xl flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-white">Анонимная Карма</h4>
                      <p className="text-[10px] text-gray-400 leading-snug">
                        У нас нет спама. Ваша Карма <strong className="text-purple-300 font-mono">({userKarma})</strong> определяет качество ваших будущих собеседников в очереди.
                      </p>
                    </div>
                  </div>

                </div>
              )}


              {/* ----------------------------------------------------
                  B. CHAT TAB
                  ---------------------------------------------------- */}
              {activeTab === 'chat' && (
                <div className="flex-1 flex flex-col justify-between">
                  
                  {/* Chat Session Header */}
                  <div className="bg-[#101012] px-3.5 py-2.5 border-b border-white/[0.05] flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      {/* Avatar placeholder with colorful blur pattern */}
                      <div className="relative">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${identityRequestState === 'accepted' ? selectedStranger.avatarColor : 'from-purple-800 to-indigo-950'} flex items-center justify-center overflow-hidden border border-white/[0.1]`}>
                          {identityRequestState === 'accepted' ? (
                            <span className="text-xs font-bold text-white">{selectedStranger.name[0]}</span>
                          ) : (
                            <div className="w-full h-full bg-white/[0.03] backdrop-blur-md flex items-center justify-center">
                              <span className="text-xs text-purple-300 font-mono font-bold">?</span>
                            </div>
                          )}
                        </div>
                        {/* Live Online Dot */}
                        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-[#101012]" />
                      </div>

                      <div>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs font-extrabold text-white">
                            {identityRequestState === 'accepted' ? selectedStranger.name : `Незнакомец ${selectedStranger.tag}`}
                          </span>
                          <span className="text-[9px] text-purple-400 font-semibold font-mono bg-purple-500/10 px-1 py-0.2 rounded">
                            ⭐ {selectedStranger.karma}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-[9px] text-gray-400">
                          <Clock className="w-2.5 h-2.5 text-purple-400" />
                          <span>Осталось {formatTime(chatTimer)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Chat Action Header Icons */}
                    <div className="flex items-center space-x-1.5">
                      
                      {/* Reveal ID action with Mask */}
                      <button
                        onClick={handleRevealIdentity}
                        disabled={identityRequestState === 'accepted'}
                        className={`p-1.5 rounded-lg border transition flex items-center space-x-1 ${
                          identityRequestState === 'accepted'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : identityRequestState === 'sent'
                              ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse'
                              : 'bg-purple-500/10 border-purple-500/20 text-purple-300 hover:bg-purple-500/20'
                        }`}
                        title="Раскрыть личность за 50 звёзд"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold">
                          {identityRequestState === 'accepted' ? 'Раскрыт' : identityRequestState === 'sent' ? 'Ждем' : '50 ⭐'}
                        </span>
                      </button>

                      {/* Burn Bridge emergency exit */}
                      <button
                        onClick={handleBurnBridge}
                        className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all flex items-center justify-center"
                        title="Сжечь мост (удалить историю)"
                      >
                        <Flame className="w-3.5 h-3.5" />
                      </button>

                      {/* Regular Exit */}
                      <button
                        onClick={() => handleExitChat(false)}
                        className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-gray-400 hover:text-white transition-all"
                        title="Выйти"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* MESSAGES VIEW */}
                  <div className="flex-1 overflow-y-auto p-3.5 space-y-3 flex flex-col bg-noise bg-[#08080a] min-h-[180px] max-h-[360px] custom-chat-scroll">
                    
                    {chatMessages.map((msg) => {
                      if (msg.sender === 'system') {
                        return (
                          <div key={msg.id} className="bg-white/[0.02] border border-white/[0.05] p-2.5 rounded-2xl text-center text-[10px] text-gray-400 leading-snug space-y-1 mx-2">
                            <Info className="w-4 h-4 text-purple-400 mx-auto" />
                            <p>{msg.text}</p>
                          </div>
                        );
                      }

                      const isUser = msg.sender === 'user';
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col max-w-[80%] ${isUser ? 'self-end items-end' : 'self-start items-start'}`}
                        >
                          {/* Sender name for clear visual distinction */}
                          <span className="text-[9px] text-gray-500 mb-0.5 px-1">
                            {isUser ? 'Вы' : (identityRequestState === 'accepted' ? selectedStranger.name : `Незнакомец ${selectedStranger.tag}`)}
                          </span>

                          <div
                            className={`p-2.5 rounded-2xl text-xs relative overflow-hidden ${
                              isUser
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none'
                                : 'bg-[#1C1C1F] text-gray-200 rounded-tl-none border border-white/[0.03]'
                            }`}
                          >
                            {msg.type === 'media' ? (
                              <div className="space-y-1.5">
                                <img 
                                  src={msg.text} 
                                  alt="Media upload" 
                                  className="rounded-lg max-h-36 object-cover w-full opacity-90"
                                />
                                <span className="text-[9px] text-white/50 block text-right">{msg.time}</span>
                              </div>
                            ) : msg.type === 'voice' ? (
                              <div className="flex items-center space-x-2 py-1">
                                <Volume2 className="w-4 h-4 text-purple-300 animate-pulse" />
                                <span className="font-mono text-[10px] text-white font-medium">{msg.text}</span>
                                <span className="text-[8px] text-white/50">{msg.time}</span>
                              </div>
                            ) : (
                              <>
                                <p className="leading-snug break-words">{msg.text}</p>
                                <span className={`text-[8px] mt-1 block text-right ${isUser ? 'text-white/60' : 'text-gray-500'}`}>
                                  {msg.time}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Stranger Typing Simulator */}
                    {isStrangerTyping && (
                      <div className="self-start flex flex-col items-start max-w-[80%]">
                        <span className="text-[9px] text-gray-500 mb-0.5 px-1">Незнакомец {selectedStranger.tag}</span>
                        <div className="bg-[#1C1C1F] p-2.5 rounded-2xl rounded-tl-none text-xs text-gray-400 flex items-center space-x-1.5 border border-white/[0.03]">
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                        </div>
                      </div>
                    )}

                    <div ref={chatBottomRef} />
                  </div>

                  {/* CHAT PREMIUM CONTROLS TRAY */}
                  <div className="bg-[#101012]/80 border-t border-white/[0.04] p-2 flex items-center justify-between space-x-1.5">
                    
                    {/* Media attachments lock info/toggle */}
                    <button
                      onClick={handleUnlockMedia}
                      className={`px-2 py-1 rounded-lg text-[10px] flex items-center space-x-1 border transition-all ${
                        mediaUnblocked || isRoomPlus
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : 'bg-[#1C1C1F] border-white/[0.05] text-[#00E5FF] hover:border-cyan-400/30'
                      }`}
                    >
                      {mediaUnblocked || isRoomPlus ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Медиа: ОК</span>
                          {mediaTimer !== null && (
                            <span className="text-[9px] font-mono font-medium">({formatTime(mediaTimer)})</span>
                          )}
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3 text-cyan-400" />
                          <span>Медиа за 10 ⭐</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center space-x-1">
                      {/* Extend chat button */}
                      <button
                        onClick={handleExtendLimit}
                        className="px-2 py-1 rounded-lg bg-[#1C1C1F] border border-white/[0.05] text-amber-300 hover:border-amber-300/30 text-[10px] flex items-center space-x-1 transition-all"
                        title="Добавить 15 минут за 15 Stars"
                      >
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>⏰ +15м (15 ⭐)</span>
                      </button>
                    </div>

                  </div>

                  {/* INPUT BAR */}
                  <form onSubmit={handleSendMessage} className="bg-[#0A0A0B] p-2.5 border-t border-white/[0.05] flex items-center space-x-2">
                    
                    {/* Mock Photo Send (conditional color) */}
                    <button
                      type="button"
                      onClick={handleSendPhotoMock}
                      className={`p-2 rounded-xl transition ${
                        mediaUnblocked || isRoomPlus
                          ? 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20'
                          : 'bg-[#1C1C1F] text-gray-500 hover:text-gray-300'
                      }`}
                      title={mediaUnblocked || isRoomPlus ? "Отправить случайное фото" : "Купите разблокировку медиа за 10 Stars"}
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>

                    {/* Mock Voice Send */}
                    <button
                      type="button"
                      onClick={handleSendVoiceMock}
                      className={`p-2 rounded-xl transition ${
                        mediaUnblocked || isRoomPlus
                          ? 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20'
                          : 'bg-[#1C1C1F] text-gray-500 hover:text-gray-300'
                      }`}
                      title={mediaUnblocked || isRoomPlus ? "Записать голосовое сообщение" : "Купите разблокировку медиа за 10 Stars"}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder={isStrangerTyping ? 'Печатает ответ...' : 'Напишите сообщение...'}
                      className="flex-1 bg-[#1C1C1F] border border-white/[0.05] text-xs text-white rounded-xl py-2 px-3 placeholder-gray-500 focus:outline-none focus:border-purple-400 transition"
                    />

                    <button
                      type="submit"
                      className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:opacity-90 active:scale-95 transition flex items-center justify-center shadow-glow-purple"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>

                </div>
              )}


              {/* ----------------------------------------------------
                  C. REVIEWS BOARD TAB
                  ---------------------------------------------------- */}
              {activeTab === 'reviews' && (
                <div className="flex-1 p-5 space-y-5">
                  
                  {/* Headline */}
                  <div className="text-center space-y-1">
                    <h2 className="text-lg font-extrabold text-white">Доска Отзывов</h2>
                    <p className="text-[11px] text-gray-400">
                      Здесь хранятся анонимные отзывы, которые влияют на твою Карму
                    </p>
                  </div>

                  {/* Karma Circular Progress Metric */}
                  <div className="bg-[#1C1C1F]/60 border border-white/[0.04] p-4 rounded-2xl flex flex-col items-center justify-center relative">
                    
                    {/* Glowing background */}
                    <div className="absolute w-24 h-24 rounded-full bg-purple-500/5 blur-xl pointer-events-none" />

                    <div className="relative w-28 h-28 flex items-center justify-center">
                      {/* Svg circular background indicator */}
                      <svg className="w-full h-full transform -rotate-90">
                        <circle 
                          cx="56" cy="56" r="48" 
                          className="text-white/[0.03]" strokeWidth="6" stroke="currentColor" fill="transparent" 
                        />
                        <circle 
                          cx="56" cy="56" r="48" 
                          className="text-purple-400" strokeWidth="6" strokeDasharray="301.6" strokeDashoffset={301.6 - (301.6 * userKarma) / 100} 
                          strokeLinecap="round" fill="transparent" 
                        />
                      </svg>
                      
                      <div className="absolute flex flex-col items-center">
                        <span className="text-3xl font-extrabold text-white text-glow-purple font-mono">{userKarma}</span>
                        <span className="text-[10px] text-purple-200 tracking-wider uppercase font-semibold">КАРМА</span>
                      </div>
                    </div>

                    <div className="text-center mt-3 space-y-1">
                      <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        Высокий приоритет очереди ⚡
                      </span>
                      <p className="text-[10px] text-gray-400 max-w-xs leading-normal pt-1">
                        Вы вежливый собеседник. Вы соединяетесь с другими высокорейтинговыми анонимами в 3 раза быстрее!
                      </p>
                    </div>
                  </div>

                  {/* REACTION COUNTERS GRID */}
                  <div className="space-y-2">
                    <span className="text-[11px] text-gray-400 uppercase tracking-widest font-bold">Полученные реакции</span>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { icon: '🔥', count: totalReactions.fire, label: 'Интересный' },
                        { icon: '😇', count: totalReactions.angel, label: 'Добрый' },
                        { icon: '🧠', count: totalReactions.brain, label: 'Умный' },
                        { icon: '💩', count: totalReactions.toxic, label: 'Токсичный' }
                      ].map((react, idx) => (
                        <div key={idx} className="bg-white/[0.02] border border-white/[0.04] p-2.5 rounded-xl text-center flex flex-col items-center">
                          <span className="text-xl mb-1">{react.icon}</span>
                          <span className="text-xs font-mono font-bold text-white">{react.count}</span>
                          <span className="text-[8px] text-gray-500">{react.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* REVIEWS LIST SECTION WITH STAR UNLOCK MECHANIC */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-gray-400 uppercase tracking-widest font-bold">Тексты отзывов</span>
                      {!areReviewsUnlocked && !isRoomPlus && (
                        <span className="text-[10px] text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center space-x-0.5">
                          <Lock className="w-2.5 h-2.5" />
                          <span>30 ⭐</span>
                        </span>
                      )}
                    </div>

                    {/* Lock Screen overlay on reviews */}
                    <div className="relative">
                      
                      {/* Review cards */}
                      <div className="space-y-2">
                        {[
                          { text: 'Обсудили философию и взгляды на жизнь. Редкий и глубокий человек, рекомендую!', date: 'Вчера, 23:12' },
                          { text: 'Очень забавный собеседник, шутил всю дорогу! С удовольствием раскрыл личность.', date: '18.02.2026' },
                          { text: 'Долго молчал, но в итоге душевно поговорили про стартапы и Тбилиси.', date: '14.02.2026' }
                        ].map((rev, idx) => (
                          <div 
                            key={idx} 
                            className={`bg-[#1C1C1F]/40 border border-white/[0.03] p-3 rounded-xl space-y-1.5 transition-all duration-300 ${
                              !areReviewsUnlocked && !isRoomPlus ? 'blur-sm select-none pointer-events-none' : ''
                            }`}
                          >
                            <p className="text-xs text-gray-300 italic">«{rev.text}»</p>
                            <span className="text-[9px] text-gray-500 block text-right">{rev.date}</span>
                          </div>
                        ))}
                      </div>

                      {/* Lock mask */}
                      {!areReviewsUnlocked && !isRoomPlus && (
                        <div className="absolute inset-0 bg-[#0A0A0B]/80 flex flex-col items-center justify-center text-center p-4 rounded-xl border border-white/[0.05]">
                          <LockKeyhole className="w-8 h-8 text-[#B388FF] mb-2 animate-bounce" />
                          <h4 className="text-xs font-bold text-white">Тексты отзывов заблокированы</h4>
                          <p className="text-[10px] text-gray-400 max-w-xs mt-1 mb-3 leading-normal">
                            В бесплатной версии видно только количество реакций. Хочешь прочитать, что именно о тебе пишут собеседники?
                          </p>
                          <div className="flex space-x-2">
                            <button
                              onClick={handleUnlockReviews}
                              className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-[11px] font-bold text-white shadow-glow-purple"
                            >
                              Разблокировать за 30 ⭐
                            </button>
                            <button
                              onClick={() => {
                                handleSpendStars(199, 'Подписка Room+', () => {
                                  setIsRoomPlus(true);
                                  setAreReviewsUnlocked(true);
                                  addLog('👑 Room+ активирован! Отзывы разблокированы.');
                                });
                              }}
                              className="px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] rounded-xl text-[11px] font-bold text-gray-300 border border-white/[0.05]"
                            >
                              Взять Room+
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              )}


              {/* ----------------------------------------------------
                  D. PROFILE & REFERRALS TAB
                  ---------------------------------------------------- */}
              {activeTab === 'profile' && (
                <div className="flex-1 p-5 space-y-5">
                  
                  {/* User Badge Info */}
                  <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/20 p-4 rounded-2xl flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center font-bold text-lg text-white text-glow-purple">
                      U
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-sm font-extrabold text-white">@secret_agent</span>
                        {isRoomPlus && (
                          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 text-[#050506] text-[8px] uppercase font-black tracking-widest px-1.5 py-0.2 rounded">
                            Room+
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400">Karma: {userKarma}/100 • Всего диалогов: {chatsCount}</span>
                    </div>
                  </div>

                  {/* ROOM+ SUBSCRIPTION BANNER CARD */}
                  <div className="bg-[#1C1C1F] border border-purple-500/20 rounded-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
                    
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <Zap className="w-4 h-4 text-[#B388FF] fill-purple-400" />
                          <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Подписка «Room+»</h4>
                        </div>
                        <span className="text-xs text-purple-300 font-extrabold font-mono">199 ⭐ / мес</span>
                      </div>

                      <p className="text-[10px] text-gray-400 leading-relaxed">
                        Дает продвинутые фильтры, безлимитное время, приоритетное соединение, 2 бесплатных раскрытия в месяц и безлимитный чат без лимитов.
                      </p>

                      {/* Key features bullets */}
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9px] text-gray-300 font-medium">
                        <div className="flex items-center space-x-1">
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Фильтры пола/возраста</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Безлимитные чаты</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Чтение текстов отзывов</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Бесплатные медиа</span>
                        </div>
                      </div>

                      <button
                        onClick={handleActivateRoomPlus}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                          isRoomPlus 
                            ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20' 
                            : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-glow-purple'
                        }`}
                      >
                        {isRoomPlus ? 'Отключить Room+' : 'Активировать Room+'}
                      </button>
                    </div>
                  </div>

                  {/* ANONYMOUS ACHIEVEMENT BADGES */}
                  <div className="space-y-2">
                    <span className="text-[11px] text-gray-400 uppercase tracking-widest font-bold block">
                      Достижения анонима
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { title: 'Душа компании', desc: 'За 40+ диалогов', icon: '😇', unlocked: chatsCount >= 40 },
                        { title: 'Хранитель тайн', desc: 'За 100 диалогов', icon: '🔑', unlocked: chatsCount >= 100 },
                        { title: 'Святой аноним', desc: 'Карма {">"} 90', icon: '🌟', unlocked: userKarma >= 90 },
                        { title: 'Подрывник', desc: '10 сожженных мостов', icon: '💥', unlocked: true }
                      ].map((badge, idx) => (
                        <div 
                          key={idx} 
                          className={`p-2.5 rounded-xl border flex items-center space-x-2.5 ${
                            badge.unlocked 
                              ? 'bg-white/[0.02] border-white/[0.05]' 
                              : 'bg-white/[0.01] border-white/[0.02] opacity-40'
                          }`}
                        >
                          <span className="text-xl">{badge.icon}</span>
                          <div>
                            <h5 className="text-[10px] font-bold text-white leading-tight">{badge.title}</h5>
                            <p className="text-[8px] text-gray-500">{badge.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* REFERRAL PROGRAM CARD */}
                  <div className="bg-[#1C1C1F]/40 border border-white/[0.04] p-4 rounded-2xl space-y-3">
                    <div className="flex items-center space-x-1.5">
                      <Share2 className="w-4 h-4 text-[#00E5FF]" />
                      <h4 className="text-xs font-bold text-white">Реферальная программа</h4>
                    </div>

                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      Пригласите друзей в чат! Приглашённый друг получит <strong className="text-amber-300 font-mono">50 ⭐</strong> на баланс при регистрации, а вы будете получать <strong className="text-[#00E5FF]">10%</strong> от всех его трат звёзд пожизненно!
                    </p>

                    {/* Copy Link Widget */}
                    <div className="bg-white/[0.03] border border-white/[0.08] p-2 rounded-xl flex items-center justify-between space-x-2">
                      <span className="text-[9px] text-purple-300 font-mono overflow-hidden truncate">
                        t.me/RoomOfSecretsBot?start=ref_1829a
                      </span>
                      
                      <button 
                        onClick={handleCopyReferral}
                        className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 active:scale-95 transition"
                      >
                        {copiedReferral ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Referrals list */}
                    <div className="space-y-1.5 pt-1.5">
                      <div className="flex justify-between text-[10px] text-gray-400 font-bold border-b border-white/[0.03] pb-1">
                        <span>Приглашенные</span>
                        <span>Заработано</span>
                      </div>
                      
                      <div className="space-y-1 max-h-24 overflow-y-auto">
                        {referrals.map((ref) => (
                          <div key={ref.id} className="flex justify-between text-[9px]">
                            <span className="text-gray-300">{ref.name} <span className="text-[8px] text-gray-500">({ref.date})</span></span>
                            <span className="text-amber-300 font-mono font-medium">+{ref.starsEarned} ⭐</span>
                          </div>
                        ))}
                      </div>

                      {/* Mock simulator button */}
                      <button
                        onClick={handleInviteSimulatedFriend}
                        className="w-full py-1 bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] text-[9px] font-bold rounded-lg border border-[#00E5FF]/20"
                      >
                        Симулировать приглашение друга (+50 ⭐)
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* TG MINI APP BOTTOM FOOTER TAB NAV BAR */}
            <div className="bg-[#0A0A0B] border-t border-white/[0.05] px-2 py-2.5 flex justify-around items-center z-40">
              {[
                { id: 'lobby', icon: Compass, label: 'Поиск' },
                { id: 'chat', icon: MessageSquare, label: 'Чат', badge: chatSessionActive },
                { id: 'reviews', icon: Award, label: 'Отзывы' },
                { id: 'profile', icon: User, label: 'Профиль' }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (tab.id === 'chat' && !chatSessionActive) {
                        alert('Сначала войдите в комнату для начала диалога!');
                        return;
                      }
                      setActiveTab(tab.id as any);
                      addLog(`📱 Переход на вкладку [${tab.label.toUpperCase()}]`);
                    }}
                    className={`flex flex-col items-center space-y-1 py-1 px-3 rounded-xl transition-all relative ${
                      isActive 
                        ? 'text-purple-400' 
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[8px] tracking-wide font-medium">{tab.label}</span>
                    
                    {/* Simulated indicators */}
                    {tab.badge && (
                      <span className="absolute top-1 right-3.5 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

          </div>

        </div>

        {/* ========================================================
            RIGHT COLUMN: PREVIEW CONTROLLER & TELEMETRY MONITOR
            ======================================================== */}
        <div className="w-full xl:w-[480px] shrink-0 flex flex-col space-y-6">
          
          {/* A. PRODUCT CONCEPT OVERVIEW */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 border-white/[0.05] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-b from-[#B388FF]/10 to-transparent rounded-full blur-xl" />
            
            <div className="flex items-center space-x-2 text-[#B388FF]">
              <Sparkles className="w-5 h-5 text-glow-purple" />
              <h3 className="text-sm font-extrabold tracking-wider uppercase">О концепте проекта</h3>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              <strong>Room of Secrets</strong> — это революционный анонимный 1-на-1 рандом-чат внутри Telegram, решающий проблему отсутствия культуры общения в традиционных чат-рулетках с помощью уникальной <strong className="text-purple-300">системы теневой репутации (Karma)</strong>.
            </p>

            {/* Key USPs */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] text-gray-500 uppercase font-mono tracking-widest block">Уникальные торговые преимущества</span>
              <div className="space-y-2 text-xs">
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-300 font-extrabold text-[10px]">1</div>
                  <p className="text-gray-300 leading-tight">
                    <strong className="text-white">Анонимная Карма:</strong> Собеседники оценивают друг друга реакциями. Высокая карма ставит в приоритет в очереди подбора.
                  </p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-300 font-extrabold text-[10px]">2</div>
                  <p className="text-gray-300 leading-tight">
                    <strong className="text-white">Деанон за Stars:</strong> Добровольное раскрытие контактов стоит 50 ⭐. Получатель согласия получает 25 ⭐ на баланс!
                  </p>
                </div>

                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-300 font-extrabold text-[10px]">3</div>
                  <p className="text-gray-300 leading-tight">
                    <strong className="text-white">Сжигание мостов:</strong> Кнопка экстренного выхода стирает переписку на серверах и на экране партнера безвозвратно.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* B. INTERACTIVE PREVIEW CONTROLLER */}
          <div className="glass-panel-purple p-6 rounded-3xl space-y-5 border-purple-500/20">
            <div className="flex items-center space-x-2 text-purple-300">
              <Sliders className="w-5 h-5 text-glow-purple" />
              <h3 className="text-sm font-extrabold tracking-wider uppercase">Симулятор окружения</h3>
            </div>

            {/* Simulate Stars controls */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 block font-bold">Баланс Telegram Stars (⭐)</label>
              <div className="flex items-center justify-between bg-white/[0.02] border border-white/[0.05] p-3 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <Coins className="w-5 h-5 text-amber-400 animate-pulse" />
                  <span className="text-lg font-mono font-extrabold text-amber-300">{starsBalance} ⭐</span>
                </div>
                <div className="flex space-x-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setStarsBalance(prev => prev + 100);
                      addLog('🪙 Симуляция: Пополнен баланс на +100 ⭐');
                    }}
                    className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 text-xs font-bold rounded-xl transition"
                  >
                    +100 ⭐
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStarsBalance(prev => prev + 500);
                      addLog('🪙 Симуляция: Пополнен баланс на +500 ⭐');
                    }}
                    className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 text-xs font-bold rounded-xl transition"
                  >
                    +500 ⭐
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStarsBalance(50);
                      addLog('🪙 Симуляция: Сброс баланса звезд до 50 ⭐');
                    }}
                    className="p-1.5 bg-white/[0.03] text-gray-400 hover:text-white rounded-xl transition"
                    title="Сбросить баланс"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* PRE-CONVERSTATION ACTIVE PERSONA SELECTION */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 block font-bold">Выберите собеседника для симуляции</label>
              <div className="space-y-2">
                {STRANGER_PERSONAS.map(p => {
                  const isCurrent = selectedStranger.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleLoadStrangerPreset(p.id)}
                      className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isCurrent 
                          ? 'bg-purple-950/30 border-purple-500/40 shadow-glow-purple' 
                          : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${p.avatarColor} flex items-center justify-center font-bold text-xs text-white`}>
                          {p.name[0]}
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-extrabold text-white">{p.name}</span>
                            <span className="text-[9px] text-gray-500">{p.tag}</span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-medium block truncate max-w-[220px]">
                            {p.bio}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="text-[9px] text-purple-300 font-extrabold font-mono bg-purple-500/10 px-1.5 py-0.2 rounded">
                          ⭐ {p.karma}
                        </span>
                        {isCurrent && (
                          <span className="text-[8px] text-emerald-400 font-extrabold uppercase tracking-widest mt-1">
                            Активен
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SIMULATE RANDOM BOT EVENT */}
            <div className="space-y-2 pt-2 border-t border-white/[0.05]">
              <label className="text-xs text-gray-400 block font-bold">Управление подпиской Room+</label>
              <div className="flex items-center justify-between bg-white/[0.02] border border-white/[0.04] p-3 rounded-2xl">
                <div>
                  <span className="text-xs font-bold text-white block">Подписка Room+</span>
                  <span className="text-[9px] text-gray-400 leading-tight">Безлимитный доступ ко всему</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsRoomPlus(!isRoomPlus);
                    addLog(`👑 Симуляция: Состояние Room+ изменено на: ${!isRoomPlus}`);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isRoomPlus 
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
                      : 'bg-[#1C1C1F] border border-white/[0.05] text-[#B388FF]'
                  }`}
                >
                  {isRoomPlus ? 'У Вас Активно ✓' : 'Выдать бесплатно'}
                </button>
              </div>
            </div>

          </div>

          {/* C. LIVE BOT & WEBSOCKET CONSOLE LOGS */}
          <div className="glass-panel p-6 rounded-3xl space-y-3.5 border-white/[0.05]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-cyan-400">
                <Compass className="w-5 h-5 text-glow-cyan" />
                <h3 className="text-sm font-extrabold tracking-wider uppercase">Логи Mini App и TG-Блока</h3>
              </div>
              <button
                onClick={() => setTelemetryLogs([])}
                className="text-[10px] text-gray-500 hover:text-gray-300 font-bold"
              >
                Очистить
              </button>
            </div>

            {/* Simulated Live logs stack */}
            <div className="bg-[#050506] border border-white/[0.05] p-3 rounded-2xl h-[240px] overflow-y-auto font-mono text-[10px] text-cyan-300/90 space-y-2 custom-chat-scroll leading-relaxed">
              {telemetryLogs.length === 0 ? (
                <span className="text-gray-600 block text-center pt-10">Нет логов. Сделайте действие в приложении.</span>
              ) : (
                telemetryLogs.map((log, index) => (
                  <div key={index} className="border-b border-white/[0.02] pb-1">
                    {log}
                  </div>
                ))
              )}
            </div>

            <div className="flex items-start space-x-2 bg-white/[0.02] p-3 rounded-xl border border-white/[0.03]">
              <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div className="text-[10px] text-gray-400 leading-snug space-y-1">
                <p>
                  <strong>💡 Инструкция по тестированию:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-0.5">
                  <li>Нажмите <strong>«🔮 Войти в комнату»</strong> в телефоне для поиска незнакомца.</li>
                  <li>После соединения вы можете <strong>написать реальное сообщение</strong>. Собеседник вам ответит!</li>
                  <li>Попробуйте сделать платные действия за звезды: <strong>«Раскрыть личность» (🎭)</strong> или <strong>«Продлить» (⏰)</strong>.</li>
                  <li>Нажмите на крестик или <strong>«Сжечь мост» (🔥)</strong> для выхода и открытия экрана отзывов!</li>
                </ol>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 4. FOOTER DETAILS */}
      <footer className="mt-auto py-6 border-t border-white/[0.03] bg-[#050506]/80 text-center text-xs text-gray-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 Room of Secrets — Все права защищены. Разработано специально для демонстрации ТГ Mini App.</p>
          <div className="flex space-x-4 text-gray-400">
            <a href="#lobby" onClick={(e) => { e.preventDefault(); alert("Это интерактивная модель-превью интерфейса!") }} className="hover:text-purple-400 transition">Условия использования</a>
            <span>•</span>
            <a href="#lobby" onClick={(e) => { e.preventDefault(); alert("Безопасность подтверждена сквозным AES-шифрованием.") }} className="hover:text-cyan-400 transition">Политика конфиденциальности</a>
          </div>
        </div>
      </footer>

    </div>
  );
}