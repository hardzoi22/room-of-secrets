import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Sparkles,
  Coins,
  User,
  ImageIcon,
  Clock,
  Flame,
  X,
  Award,
  Send,
  Copy,
  Check,
  Compass,
  Sliders,
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

// 🆕 НОВЫЕ ТИПЫ
interface ConfessionSession {
  id: string;
  mode: 'confess' | 'listen';
  topic: 'любовь' | 'работа' | 'страхи' | 'мечты' | 'любое';
  burnAfter: number;
  isActive: boolean;
  createdAt: Date;
}

interface DailyChallenge {
  id: string;
  date: string;
  task: {
    type: 'duration' | 'reactions' | 'reveals' | 'messages';
    goal: number;
    description: string;
    emoji: string;
  };
  progress: number;
  completed: boolean;
  reward: {
    stars: number;
    karma: number;
  };
  streak: number;
}

interface TopicRoom {
  id: string;
  name: string;
  emoji: string;
  description: string;
  activeUsers: number;
  vibe: 'chill' | 'deep' | 'fun' | 'chaotic';
  topics: string[];
  minKarma: number;
  isPremium: boolean;
}

interface Gift {
  id: string;
  name: string;
  emoji: string;
  animation: 'bounce' | 'float' | 'explode' | 'spin';
  cost: number;
  karmaBonus: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface SentGift {
  gift: Gift;
  timestamp: Date;
  sender: 'user' | 'stranger';
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'legendary' | 'mythic';
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  goal: number;
  secret: boolean;
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

const TOPIC_ROOMS: TopicRoom[] = [
  {
    id: 'midnight-philosophers',
    name: 'Полуночные философы',
    emoji: '🌙',
    description: 'Глубокие разговоры о смысле жизни',
    activeUsers: 24,
    vibe: 'deep',
    topics: ['экзистенциализм', 'смысл жизни', 'философия'],
    minKarma: 70,
    isPremium: false
  },
  {
    id: 'night-gamers',
    name: 'Геймеры в 3 ночи',
    emoji: '🎮',
    description: 'Обсуждаем игры и прокачиваем скилл',
    activeUsers: 47,
    vibe: 'fun',
    topics: ['gaming', 'киберспорт', 'стримы'],
    minKarma: 50,
    isPremium: false
  },
  {
    id: 'startup-chaos',
    name: 'Стартаперы',
    emoji: '🚀',
    description: 'Идеи, питчи, нетворкинг',
    activeUsers: 18,
    vibe: 'chaotic',
    topics: ['стартапы', 'бизнес', 'инвестиции'],
    minKarma: 80,
    isPremium: true
  },
  {
    id: 'book-club',
    name: 'Книжный клуб',
    emoji: '📚',
    description: 'Обсуждаем прочитанное',
    activeUsers: 31,
    vibe: 'chill',
    topics: ['книги', 'литература', 'авторы'],
    minKarma: 60,
    isPremium: false
  },
  {
    id: 'random-chaos',
    name: 'Случайный хаос',
    emoji: '🎲',
    description: 'Все темы, никаких правил',
    activeUsers: 89,
    vibe: 'chaotic',
    topics: ['всё подряд'],
    minKarma: 0,
    isPremium: false
  },
  {
    id: 'confession-room',
    name: 'Исповедальня',
    emoji: '🕯️',
    description: 'Расскажи то, что не можешь никому сказать',
    activeUsers: 12,
    vibe: 'deep',
    topics: ['секреты', 'исповедь', 'тайны'],
    minKarma: 75,
    isPremium: false
  }
];

const AVAILABLE_GIFTS: Gift[] = [
  { id: 'rose', name: 'Роза', emoji: '🌹', animation: 'float', cost: 10, karmaBonus: 2, rarity: 'common' },
  { id: 'coffee', name: 'Кофе', emoji: '☕', animation: 'bounce', cost: 15, karmaBonus: 3, rarity: 'common' },
  { id: 'champagne', name: 'Шампанское', emoji: '🍾', animation: 'explode', cost: 25, karmaBonus: 5, rarity: 'rare' },
  { id: 'fire', name: 'Огонь', emoji: '🔥', animation: 'spin', cost: 30, karmaBonus: 6, rarity: 'rare' },
  { id: 'crown', name: 'Корона', emoji: '👑', animation: 'float', cost: 100, karmaBonus: 20, rarity: 'epic' },
  { id: 'rocket', name: 'Ракета', emoji: '🚀', animation: 'explode', cost: 500, karmaBonus: 100, rarity: 'legendary' },
  { id: 'diamond', name: 'Бриллиант', emoji: '💎', animation: 'spin', cost: 1000, karmaBonus: 250, rarity: 'legendary' }
];

const ACHIEVEMENTS_LIST: Achievement[] = [
  { id: 'first-chat', name: 'Первый контакт', description: 'Завершите первый диалог', icon: '💬', rarity: 'common', unlocked: false, progress: 0, goal: 1, secret: false },
  { id: 'friendly', name: 'Дружелюбный', description: 'Получите 10 положительных отзывов', icon: '😊', rarity: 'common', unlocked: false, progress: 0, goal: 10, secret: false },
  { id: 'night-owl', name: 'Ночной волк', description: 'Общайтесь с 3:00 до 5:00', icon: '🌙', rarity: 'rare', unlocked: false, progress: 0, goal: 1, secret: true },
  { id: 'gift-giver', name: 'Щедрая душа', description: 'Отправьте 50 подарков', icon: '🎁', rarity: 'rare', unlocked: false, progress: 0, goal: 50, secret: false },
  { id: 'polyglot', name: 'Полиглот', description: 'Поговорите с людьми из 10 стран', icon: '🗺️', rarity: 'legendary', unlocked: false, progress: 0, goal: 10, secret: true },
  { id: 'confessor', name: 'Исповедник', description: 'Услышьте 100 секретов в исповедальне', icon: '🕯️', rarity: 'legendary', unlocked: false, progress: 0, goal: 100, secret: true },
  { id: 'karma-master', name: 'Мастер Кармы', description: 'Достигните 100 кармы', icon: '🏆', rarity: 'mythic', unlocked: false, progress: 0, goal: 100, secret: true },
  { id: 'chat-legend', name: 'Легенда чатов', description: 'Проведите 1000 диалогов', icon: '👑', rarity: 'mythic', unlocked: false, progress: 0, goal: 1000, secret: true }
];

const generateDailyChallenge = (date: Date): DailyChallenge => {
  const challenges = [
    { type: 'duration' as const, goal: 600, description: 'Общайтесь 10 минут', emoji: '⏱️' },
    { type: 'reactions' as const, goal: 5, description: 'Получите 5 положительных реакций', emoji: '🔥' },
    { type: 'reveals' as const, goal: 2, description: 'Раскройте личность с 2 людьми', emoji: '🎭' },
    { type: 'messages' as const, goal: 50, description: 'Отправьте 50 сообщений', emoji: '💬' }
  ];

  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const selectedChallenge = challenges[dayOfYear % challenges.length];

  return {
    id: `challenge-${date.toISOString().split('T')[0]}`,
    date: date.toISOString().split('T')[0],
    task: selectedChallenge,
    progress: 0,
    completed: false,
    reward: { stars: 50, karma: 5 },
    streak: 0
  };
};

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

  // 🆕 НОВЫЙ STATE
  const [confessionSession, setConfessionSession] = useState<ConfessionSession | null>(null);
  const [confessionTimer, setConfessionTimer] = useState(0);
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge>(generateDailyChallenge(new Date()));
  const [challengeStreak, setChallengeStreak] = useState(0);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<TopicRoom | null>(null);
  const [showRoomsModal, setShowRoomsModal] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [sentGifts, setSentGifts] = useState<SentGift[]>([]);
  const [giftAnimation, setGiftAnimation] = useState<{ gift: Gift; show: boolean } | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS_LIST);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [newAchievementUnlocked, setNewAchievementUnlocked] = useState<Achievement | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // ============================================
  // 🚀 ТЕЛЕГРАМ ИНИЦИАЛИЗАЦИЯ
  // ============================================
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#0A0A0B');
      tg.setBackgroundColor('#050506');
      if (tg.isVersionAtLeast('6.1')) {
        tg.disableVerticalSwipes();
      }
    }
  }, []);

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
  }, [chatSessionActive]);

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

  // 🆕 ИСПОВЕДАЛЬНЯ: Таймер сжигания
  useEffect(() => {
    let interval: any = null;
    if (confessionSession?.isActive && confessionTimer > 0) {
      interval = setInterval(() => {
        setConfessionTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setChatMessages(prev => prev.filter(m => m.sender === 'system'));
            setChatMessages(prev => [...prev, {
              id: `burn-${Date.now()}`,
              sender: 'system',
              text: '🔥 Исповедь сожжена. Секрет унесен ветром.',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            setConfessionSession(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [confessionSession, confessionTimer]);

  // 🆕 ДНЕВНОЙ ЧЕЛЛЕНДЖ: Проверка новой даты
  useEffect(() => {
    const checkDailyChallenge = () => {
      const today = new Date().toISOString().split('T')[0];
      if (dailyChallenge.date !== today) {
        const newChallenge = generateDailyChallenge(new Date());
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (dailyChallenge.date === yesterdayStr && dailyChallenge.completed) {
          newChallenge.streak = dailyChallenge.streak + 1;
          setChallengeStreak(newChallenge.streak);
        } else if (!dailyChallenge.completed) {
          newChallenge.streak = 0;
          setChallengeStreak(0);
        }
        
        setDailyChallenge(newChallenge);
      }
    };

    const interval = setInterval(checkDailyChallenge, 60000);
    checkDailyChallenge();
    return () => clearInterval(interval);
  }, [dailyChallenge]);

  // 🆕 ДНЕВНОЙ ЧЕЛЛЕНДЖ: Обновление прогресса
  useEffect(() => {
    if (dailyChallenge.completed) return;

    let newProgress = dailyChallenge.progress;

    switch (dailyChallenge.task.type) {
      case 'reactions':
        const positiveReactions = totalReactions.fire + totalReactions.angel + totalReactions.brain;
        newProgress = positiveReactions;
        break;
      case 'messages':
        const userMessages = chatMessages.filter(m => m.sender === 'user').length;
        newProgress = userMessages;
        break;
    }

    if (newProgress >= dailyChallenge.task.goal && !dailyChallenge.completed) {
      setDailyChallenge(prev => ({ ...prev, completed: true, progress: prev.task.goal }));
      setStarsBalance(prev => prev + dailyChallenge.reward.stars);
      setUserKarma(prev => Math.min(100, prev + dailyChallenge.reward.karma));
      
      triggerSmokeEffect('match', () => {
        setShowChallengeModal(true);
      }, `Челлендж выполнен! +${dailyChallenge.reward.stars}⭐`);
    } else if (newProgress !== dailyChallenge.progress) {
      setDailyChallenge(prev => ({ ...prev, progress: newProgress }));
    }
  }, [chatMessages, totalReactions, dailyChallenge]);

  // 🆕 ДОСТИЖЕНИЯ: Проверка условий
  useEffect(() => {
    const checkAchievements = () => {
      const now = new Date();
      const hour = now.getHours();

      setAchievements(prev => prev.map(achievement => {
        if (achievement.unlocked) return achievement;

        let newProgress = achievement.progress;
        let shouldUnlock = false;

        switch (achievement.id) {
          case 'first-chat':
            newProgress = chatsCount > 0 ? 1 : 0;
            break;
          case 'friendly':
            newProgress = totalReactions.fire + totalReactions.angel + totalReactions.brain;
            break;
          case 'night-owl':
            if (hour >= 3 && hour < 5 && chatSessionActive) {
              newProgress = 1;
            }
            break;
          case 'gift-giver':
            newProgress = sentGifts.filter(g => g.sender === 'user').length;
            break;
          case 'karma-master':
            newProgress = userKarma;
            break;
          case 'chat-legend':
            newProgress = chatsCount;
            break;
        }

        if (newProgress >= achievement.goal) {
          shouldUnlock = true;
        }

        if (shouldUnlock && !achievement.unlocked) {
          setTimeout(() => {
            setNewAchievementUnlocked(achievement);
            setTimeout(() => setNewAchievementUnlocked(null), 5000);
          }, 500);

          return {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date(),
            progress: achievement.goal
          };
        }

        return {
          ...achievement,
          progress: newProgress
        };
      }));
    };

    checkAchievements();
  }, [chatsCount, totalReactions, userKarma, chatSessionActive, sentGifts]);

  // ============================================
  // 🛠️ HELPERS & ACTIONS
  // ============================================
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const triggerSmokeEffect = (type: 'match' | 'exit' | 'burn' | 'init', callback: () => void, message: string = '') => {
    setSmokeType(type);
    setSmokeMessage(message);
    setShowSmokeScreen(true);
    setTimeout(() => { callback(); }, 1800);
    setTimeout(() => { setShowSmokeScreen(false); }, 2800);
  };

  const handleStartSearch = () => {
    if (isSearching) return;
    setIsSearching(true);
    setSearchProgress(0);

    const randomPersona = STRANGER_PERSONAS[Math.floor(Math.random() * STRANGER_PERSONAS.length)];
    setSelectedStranger(randomPersona);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setSearchProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        triggerSmokeEffect('match', () => {
          setIsSearching(false);
          setChatSessionActive(true);
          setChatTimer(isRoomPlus ? 3600 : 900);
          setIdentityRequestState('none');
          setMediaUnblocked(false);

          setChatMessages([
            {
              id: 'sys-start', sender: 'system',
              text: '⚠️ Чат полностью анонимен. Нажмите 🔥 для удаления переписки.',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            },
            {
              id: 'stranger-intro', sender: 'stranger',
              text: randomPersona.firstMsg,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
          setActiveTab('chat');
        }, `Соединение с ${randomPersona.tag}...`);
      }
    }, 250);
  };

  const handleSendMessage = (e?: React.FormEvent, customMedia?: { type: 'media' | 'voice', content: string }) => {
    if (e) e.preventDefault();
    const isMedia = !!customMedia;
    const text = isMedia ? customMedia!.content : messageInput.trim();
    if (!text && !isMedia) return;

    if (!isMedia) setMessageInput('');

    const newMsg: ChatMessage = {
      id: `user-msg-${Date.now()}`, sender: 'user', text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: isMedia ? customMedia!.type : 'text'
    };

    setChatMessages(prev => [...prev, newMsg]);
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

  const handleExitChat = (byTimeout = false) => {
    triggerSmokeEffect('exit', () => {
      setChatSessionActive(false);
      setShowRatingScreen(true);
      setRatingReaction(null);
      setRatingNote('');
    }, 'Выход...');
  };

  const handleBurnBridge = () => {
    triggerSmokeEffect('burn', () => {
      setChatSessionActive(false);
      setChatMessages([]);
      setActiveTab('lobby');
    }, 'Сжигание...');
  };

  const handleSubmitRating = () => {
    setChatsCount(prev => prev + 1);
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

  const handleSpendStars = (amount: number, purpose: string, successCallback: () => void) => {
    if (starsBalance < amount) {
      alert(`Недостаточно Stars! Нужно ${amount}, баланс: ${starsBalance}`);
      return;
    }
    setStarsBalance(prev => prev - amount);
    successCallback();
  };

  const handleRevealIdentity = () => {
    if (identityRequestState === 'accepted') return;
    handleSpendStars(50, 'Раскрытие личности', () => {
      setIdentityRequestState('sent');
      setTimeout(() => {
        setIdentityRequestState('accepted');
        setChatMessages(prev => [...prev, {
          id: 'reveal-sys', sender: 'system',
          text: `🔓 ЛИЧНОСТИ РАСКРЫТЫ! ${selectedStranger.name}, ${selectedStranger.age} лет, ${selectedStranger.city}`,
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

  // 🆕 НОВЫЕ HANDLERS
  const handleStartConfession = (mode: 'confess' | 'listen', topic: ConfessionSession['topic']) => {
    handleSpendStars(25, 'Исповедальня', () => {
      const session: ConfessionSession = {
        id: `confession-${Date.now()}`,
        mode,
        topic,
        burnAfter: 60,
        isActive: true,
        createdAt: new Date()
      };
      
      setConfessionSession(session);
      setConfessionTimer(60);
      handleStartSearch();
      
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          id: 'confession-warning',
          sender: 'system',
          text: `🕯️ РЕЖИМ ИСПОВЕДАЛЬНИ\n${mode === 'confess' ? 'Расскажите свой секрет.' : 'Выслушайте исповедь.'}\nПереписка сгорит через ${formatTime(60)}.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 2000);
    });
  };

  const handleJoinRoom = (room: TopicRoom) => {
    if (userKarma < room.minKarma) {
      alert(`Требуется карма ${room.minKarma}+. У вас: ${userKarma}`);
      return;
    }

    if (room.isPremium && !isRoomPlus) {
      alert('Эта комната доступна только для Room+ подписчиков');
      return;
    }

    setSelectedRoom(room);
    setShowRoomsModal(false);
    handleStartSearch();
    
    setTimeout(() => {
      setChatMessages(prev => [{
        id: 'room-enter',
        sender: 'system',
        text: `Добро пожаловать в комнату "${room.name}" ${room.emoji}\n${room.description}\n\nСейчас онлайн: ${room.activeUsers} чел.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }, ...prev]);
    }, 2000);
  };

  const handleSendGift = (gift: Gift) => {
    handleSpendStars(gift.cost, `Подарок: ${gift.name}`, () => {
      const sentGift: SentGift = {
        gift,
        timestamp: new Date(),
        sender: 'user'
      };
      
      setSentGifts(prev => [...prev, sentGift]);
      setShowGiftModal(false);
      
      setGiftAnimation({ gift, show: true });
      setTimeout(() => setGiftAnimation(null), 3000);
      
      setChatMessages(prev => [...prev, {
        id: `gift-${Date.now()}`,
        sender: 'system',
        text: `🎁 Вы отправили ${gift.emoji} ${gift.name}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          id: `gift-response-${Date.now()}`,
          sender: 'stranger',
          text: `Вау, спасибо за ${gift.emoji}! Это очень мило! 🥰`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        
        setUserKarma(prev => Math.min(100, prev + gift.karmaBonus));
      }, 2000);
    });
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'legendary': return 'text-purple-400';
      case 'mythic': return 'text-amber-400';
    }
  };

  const getRarityGlow = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return '';
      case 'rare': return 'shadow-[0_0_20px_rgba(59,130,246,0.5)]';
      case 'legendary': return 'shadow-[0_0_30px_rgba(168,85,247,0.6)]';
      case 'mythic': return 'shadow-[0_0_40px_rgba(251,191,36,0.7)] animate-pulse';
    }
  };

  // ============================================
  // 🎨 РЕНДЕР
  // ============================================
  return (
    <div className="fixed inset-0 w-full bg-[#050506] text-white flex flex-col overflow-hidden select-none">
      
      {/* SMOKE OVERLAY */}
      {showSmokeScreen && (
        <div className="absolute inset-0 bg-[#050506]/95 z-[999] flex flex-col items-center justify-center">
          <div className="w-32 h-32 bg-purple-500/20 blur-3xl rounded-full animate-pulse" />
          <div className="mt-8 text-center space-y-4">
            {smokeType === 'burn' ? <Flame className="w-16 h-16 text-red-500 mx-auto animate-bounce" /> : <Sparkles className="w-16 h-16 text-purple-500 mx-auto animate-spin" />}
            <h2 className="text-2xl font-bold text-white">{smokeMessage}</h2>
          </div>
        </div>
      )}

      {/* ВЕРХНЯЯ ПЛАШКА */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-white/[0.05] bg-[#0A0A0B] shrink-0 z-40">
        <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
          Room of Secrets
        </h1>
        <div className="flex items-center gap-2 bg-amber-500/10 px-3 py-1 rounded-full">
          <Coins className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-mono font-bold text-amber-300">{starsBalance}</span>
        </div>
      </div>

      {/* ЦЕНТРАЛЬНАЯ ЗОНА */}
      <div className="flex-1 overflow-y-auto relative custom-chat-scroll flex flex-col">
        
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

        {/* RATING OVERLAY */}
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

        {/* 🆕 КОМНАТЫ ПО ИНТЕРЕСАМ */}
        {showRoomsModal && (
          <div className="absolute inset-0 bg-[#050506]/95 z-50 overflow-y-auto p-4">
            <div className="max-w-2xl mx-auto space-y-4 pb-20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Комнаты по интересам</h2>
                <button onClick={() => setShowRoomsModal(false)} className="p-2 bg-white/5 rounded-xl">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {TOPIC_ROOMS.map(room => (
                <div
                  key={room.id}
                  className={`bg-[#1C1C1F] rounded-2xl p-5 border ${
                    room.isPremium ? 'border-amber-500/30' : 'border-white/5'
                  } space-y-3 relative overflow-hidden`}
                >
                  {room.isPremium && (
                    <div className="absolute top-3 right-3 bg-amber-500/20 text-amber-400 text-xs px-2 py-1 rounded-full font-bold">
                      PREMIUM
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3">
                    <div className="text-4xl">{room.emoji}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-white">{room.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{room.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {room.topics.map(topic => (
                      <span key={topic} className="text-xs bg-purple-500/10 text-purple-300 px-2 py-1 rounded-lg">
                        #{topic}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span>{room.activeUsers} онлайн</span>
                      </div>
                      <div>Карма: {room.minKarma}+</div>
                      <div className="capitalize">{room.vibe}</div>
                    </div>
                    
                    <button
                      onClick={() => handleJoinRoom(room)}
                      disabled={userKarma < room.minKarma || (room.isPremium && !isRoomPlus)}
                      className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                        userKarma < room.minKarma || (room.isPremium && !isRoomPlus)
                          ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                          : 'bg-purple-600 text-white hover:bg-purple-500 active:scale-95'
                      }`}
                    >
                      Войти
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🆕 ПОДАРКИ */}
        {showGiftModal && (
          <div className="absolute inset-0 bg-[#050506]/95 z-50 flex items-center justify-center p-4">
            <div className="bg-[#1C1C1F] w-full max-w-md rounded-3xl p-6 space-y-4 border border-purple-500/20">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <h3 className="font-bold text-xl">Отправить подарок</h3>
                <button onClick={() => setShowGiftModal(false)} className="text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto custom-chat-scroll">
                {AVAILABLE_GIFTS.map(gift => (
                  <button
                    key={gift.id}
                    onClick={() => handleSendGift(gift)}
                    className={`p-4 rounded-2xl border-2 transition-all hover:scale-105 active:scale-95 ${
                      gift.rarity === 'common' ? 'border-gray-600 bg-gray-800/30' :
                      gift.rarity === 'rare' ? 'border-blue-500/50 bg-blue-900/20' :
                      gift.rarity === 'epic' ? 'border-purple-500/50 bg-purple-900/20' :
                      'border-amber-500/50 bg-amber-900/20 shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                    }`}
                  >
                    <div className="text-5xl mb-2">{gift.emoji}</div>
                    <div className="text-sm font-bold text-white">{gift.name}</div>
                    <div className="text-xs text-gray-400 mt-1">+{gift.karmaBonus} karma</div>
                    <div className="flex items-center justify-center gap-1 mt-2 text-amber-400 font-bold text-sm">
                      <Coins className="w-4 h-4" />
                      <span>{gift.cost}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="text-center text-xs text-gray-500 pt-3 border-t border-white/5">
                Получатель получит 75% стоимости обратно
              </div>
            </div>
          </div>
        )}

        {/* 🆕 ДОСТИЖЕНИЯ */}
        {showAchievementsModal && (
          <div className="absolute inset-0 bg-[#050506]/95 z-50 overflow-y-auto p-4">
            <div className="max-w-2xl mx-auto space-y-4 pb-20">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Достижения</h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {achievements.filter(a => a.unlocked).length} / {achievements.length} разблокировано
                  </p>
                </div>
                <button onClick={() => setShowAchievementsModal(false)} className="p-2 bg-white/5 rounded-xl">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-3">
                {achievements.map(achievement => {
                  const isUnlocked = achievement.unlocked;
                  const isSecret = achievement.secret && !isUnlocked;
                  
                  return (
                    <div
                      key={achievement.id}
                      className={`bg-[#1C1C1F] rounded-2xl p-4 border transition-all ${
                        isUnlocked
                          ? `${getRarityGlow(achievement.rarity)}`
                          : 'border-white/5 opacity-60'
                      }`}
                      style={{
                        borderColor: isUnlocked ? (
                          achievement.rarity === 'mythic' ? '#fbbf24' :
                          achievement.rarity === 'legendary' ? '#a855f7' :
                          achievement.rarity === 'rare' ? '#3b82f6' : '#9ca3af'
                        ) : undefined
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`text-4xl ${isSecret ? 'blur-sm' : ''}`}>
                          {isSecret ? '❓' : achievement.icon}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-bold ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                              {isSecret ? '???' : achievement.name}
                            </h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getRarityColor(achievement.rarity)}`}>
                              {achievement.rarity.toUpperCase()}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-400 mb-3">
                            {isSecret ? 'Секретное достижение' : achievement.description}
                          </p>

                          {!isSecret && !isUnlocked && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>Прогресс</span>
                                <span>{achievement.progress} / {achievement.goal}</span>
                              </div>
                              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full bg-gradient-to-r ${
                                    achievement.rarity === 'common' ? 'from-gray-400 to-gray-500' :
                                    achievement.rarity === 'rare' ? 'from-blue-400 to-blue-600' :
                                    achievement.rarity === 'legendary' ? 'from-purple-400 to-purple-600' :
                                    'from-amber-400 to-amber-600'
                                  } transition-all duration-500`}
                                  style={{ width: `${Math.min(100, (achievement.progress / achievement.goal) * 100)}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {isUnlocked && achievement.unlockedAt && (
                            <div className="text-xs text-emerald-400 flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>
                                Разблокировано {new Date(achievement.unlockedAt).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 🆕 ДНЕВНОЙ ЧЕЛЛЕНДЖ - Модалка завершения */}
        {showChallengeModal && (
          <div className="absolute inset-0 bg-[#050506]/95 z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-xl w-full max-w-sm rounded-3xl p-8 text-center space-y-6 border border-purple-500/30">
              <div className="text-6xl animate-bounce">{dailyChallenge.task.emoji}</div>
              
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Челлендж выполнен!</h2>
                <p className="text-gray-300">{dailyChallenge.task.description}</p>
              </div>

              <div className="bg-black/30 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-center gap-2 text-amber-400">
                  <Coins className="w-6 h-6" />
                  <span className="text-2xl font-bold">+{dailyChallenge.reward.stars}</span>
                </div>
                <div className="text-emerald-400 text-sm">+{dailyChallenge.reward.karma} кармы</div>
              </div>

              {challengeStreak > 0 && (
                <div className="flex items-center justify-center gap-2 text-orange-400">
                  <Flame className="w-5 h-5" />
                  <span className="font-bold">Серия: {challengeStreak} дней!</span>
                </div>
              )}

              <button
                onClick={() => setShowChallengeModal(false)}
                className="w-full py-3 bg-purple-600 rounded-xl font-bold text-white hover:bg-purple-500 transition-all"
              >
                Продолжить
              </button>
            </div>
          </div>
        )}

        {/* 🆕 НОВОЕ ДОСТИЖЕНИЕ - Toast уведомление */}
        {newAchievementUnlocked && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-[slideDown_0.5s_ease-out]">
            <div className={`bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-4 shadow-2xl border-2 ${
              newAchievementUnlocked.rarity === 'mythic' ? 'border-amber-400' :
              newAchievementUnlocked.rarity === 'legendary' ? 'border-purple-400' :
              'border-blue-400'
            } ${getRarityGlow(newAchievementUnlocked.rarity)} min-w-[300px]`}>
              <div className="flex items-center gap-3">
                <div className="text-4xl">{newAchievementUnlocked.icon}</div>
                <div className="flex-1">
                  <div className="text-xs text-amber-400 font-bold mb-1">ДОСТИЖЕНИЕ РАЗБЛОКИРОВАНО!</div>
                  <div className="font-bold text-white">{newAchievementUnlocked.name}</div>
                  <div className="text-xs text-gray-300 mt-1">{newAchievementUnlocked.description}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 🆕 АНИМАЦИЯ ПОДАРКА */}
        {giftAnimation?.show && (
          <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
            <div className={`text-9xl animate-[giftFloat_2s_ease-out]`}>
              {giftAnimation.gift.emoji}
            </div>
          </div>
        )}

        {/* ЭКРАН 1: ЛОББИ */}
        {activeTab === 'lobby' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8 my-auto">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Тайный Чат 1-на-1</h2>
              <p className="text-sm text-gray-400">Войди. Поговори. Исчезни.</p>
            </div>

            <button 
              onClick={handleStartSearch}
              disabled={isSearching}
              className={`w-40 h-40 rounded-full flex flex-col items-center justify-center transition-all ${
                isSearching ? 'bg-[#1C1C1F] border-2 border-cyan-400/50 animate-pulse' : 'bg-gradient-to-br from-purple-600 to-indigo-700 shadow-[0_0_40px_rgba(168,85,247,0.3)] hover:scale-105 active:scale-95'
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

            <div className="flex gap-3">
              <button onClick={() => setShowFilterModal(true)} className="flex items-center gap-2 text-xs text-purple-400 px-4 py-2 bg-purple-900/20 rounded-full border border-purple-500/20">
                <Sliders className="w-4 h-4" />
                <span>Фильтры</span>
              </button>

              <button 
                onClick={() => setShowRoomsModal(true)}
                className="flex items-center gap-2 text-xs text-cyan-400 px-4 py-2 bg-cyan-900/20 rounded-full border border-cyan-500/20 hover:bg-cyan-900/30 transition-all"
              >
                <Compass className="w-4 h-4" />
                <span>Комнаты</span>
                <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  {TOPIC_ROOMS.reduce((acc, r) => acc + r.activeUsers, 0)}
                </span>
              </button>
            </div>

            {!dailyChallenge.completed && (
              <div className="w-full max-w-sm bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-2xl p-4 border border-purple-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{dailyChallenge.task.emoji}</div>
                  <div className="flex-1">
                    <div className="text-xs text-purple-400 font-bold">ДНЕВНОЙ ЧЕЛЛЕНДЖ</div>
                    <div className="text-sm text-white">{dailyChallenge.task.description}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Прогресс</span>
                    <span>{dailyChallenge.progress} / {dailyChallenge.task.goal}</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, (dailyChallenge.progress / dailyChallenge.task.goal) * 100)}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs pt-2">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Coins className="w-3 h-3" />
                      <span>+{dailyChallenge.reward.stars}⭐</span>
                    </div>
                    {challengeStreak > 0 && (
                      <div className="flex items-center gap-1 text-orange-400">
                        <Flame className="w-3 h-3" />
                        <span>Серия: {challengeStreak}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {chatSessionActive && (
              <button onClick={() => setActiveTab('chat')} className="text-xs text-cyan-400 underline animate-pulse">
                Вернуться в активный чат 💬
              </button>
            )}
          </div>
        )}

        {/* ЭКРАН 2: ЧАТ */}
        {activeTab === 'chat' && (
          <div className="absolute inset-0 flex flex-col bg-[#050506] z-20">
            <div className="bg-[#101012] px-4 py-3 flex items-center justify-between border-b border-white/[0.05] shrink-0">
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

            <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-[#08080a] custom-chat-scroll">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'system' ? (
                    <div className="bg-white/5 text-gray-400 text-xs p-3 rounded-xl text-center max-w-full mx-auto whitespace-pre-line">{msg.text}</div>
                  ) : msg.type === 'media' ? (
                    <div className="max-w-[80%] rounded-2xl overflow-hidden"><img src={msg.text} alt="media" className="rounded-xl max-h-40 object-cover" /></div>
                  ) : (
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-[#1C1C1F] text-gray-200 rounded-tl-none'}`}>
                      <p className="break-words">{msg.text}</p>
                      <span className="text-[10px] opacity-60 block text-right mt-1">{msg.time}</span>
                    </div>
                  )}
                </div>
              ))}
              {isStrangerTyping && (
                <div className="flex justify-start"><div className="bg-[#1C1C1F] px-4 py-2 rounded-2xl text-xs text-gray-500">печатает...</div></div>
              )}
              <div ref={chatBottomRef} />
            </div>

            <div className="bg-[#101012] p-3 border-t border-white/[0.05] shrink-0 space-y-2">
              <div className="flex justify-between items-center text-[10px] text-gray-400 px-1">
                <button onClick={handleExtendLimit} className="text-amber-400 flex items-center gap-1"><Clock className="w-3 h-3" /> +15м (15⭐)</button>
                <button onClick={handleUnlockMedia} className="text-cyan-400 flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Медиа (10⭐)</button>
                <button 
                  onClick={() => setShowGiftModal(true)}
                  className="text-pink-400 flex items-center gap-1 hover:text-pink-300 transition-colors"
                >
                  <span className="text-base">🎁</span>
                  <span>Подарок</span>
                </button>
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <button type="button" onClick={handleSendPhotoMock} className="p-2 bg-white/5 rounded-xl shrink-0"><ImageIcon className="w-5 h-5 text-gray-400" /></button>
                <input 
                  value={messageInput} 
                  onChange={e => setMessageInput(e.target.value)} 
                  onFocus={() => {
                    setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 150);
                  }}
                  placeholder="Сообщение..." 
                  className="flex-1 bg-[#1C1C1F] rounded-xl px-4 text-sm text-white focus:outline-none" 
                />
                <button type="submit" className="p-3 bg-purple-600 rounded-xl text-white shrink-0"><Send className="w-5 h-5" /></button>
              </form>
            </div>
          </div>
        )}

        {/* ЭКРАН 3: ОТЗЫВЫ */}
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

        {/* ЭКРАН 4: ПРОФИЛЬ */}
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Достижения</h3>
                <button 
                  onClick={() => setShowAchievementsModal(true)}
                  className="text-xs text-purple-400 hover:text-purple-300"
                >
                  Посмотреть все →
                </button>
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                {achievements.filter(a => a.unlocked).slice(0, 5).map(achievement => (
                  <div 
                    key={achievement.id}
                    className={`shrink-0 w-16 h-16 rounded-xl border-2 flex items-center justify-center text-3xl ${
                      getRarityGlow(achievement.rarity)
                    }`}
                    style={{
                      borderColor: achievement.rarity === 'mythic' ? '#fbbf24' :
                                  achievement.rarity === 'legendary' ? '#a855f7' :
                                  achievement.rarity === 'rare' ? '#3b82f6' : '#9ca3af'
                    }}
                  >
                    {achievement.icon}
                  </div>
                ))}
                
                {achievements.filter(a => a.unlocked).length === 0 && (
                  <div className="text-sm text-gray-500 text-center w-full py-4">
                    Достижений пока нет. Начните общаться!
                  </div>
                )}
              </div>
              
              <div className="text-xs text-gray-400 text-center mt-3">
                {achievements.filter(a => a.unlocked).length} / {achievements.length} разблокировано
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
                <input readOnly value="t.me/RoomOfSecretsBot?start=ref_123" className="flex-1 bg-white/5 rounded-lg px-3 py-2 text-xs text-gray-300" />
                <button onClick={handleCopyReferral} className="p-2 bg-purple-600 rounded-lg">{copiedReferral ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* НИЖНЕЕ МЕНЮ НАВИГАЦИИ */}
      {activeTab !== 'chat' && (
        <div className="bg-[#0A0A0B] border-t border-white/[0.05] px-2 py-2 flex justify-around shrink-0 z-50">
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
                className={`flex flex-col items-center gap-1 p-2 rounded-xl relative ${isActive ? 'text-purple-400' : 'text-gray-500'}`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px]">{tab.label}</span>
                {tab.active && <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full absolute top-1 right-2" />}
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
}
