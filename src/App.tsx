// ============================================
// 📦 НОВЫЕ TYPES & INTERFACES
// ============================================

// 1. ИСПОВЕДАЛЬНЯ
interface ConfessionSession {
  id: string;
  mode: 'confess' | 'listen';
  topic: 'любовь' | 'работа' | 'страхи' | 'мечты' | 'любое';
  burnAfter: number; // секунды
  isActive: boolean;
  createdAt: Date;
}

// 2. ДНЕВНОЙ ЧЕЛЛЕНДЖ
interface DailyChallenge {
  id: string;
  date: string; // YYYY-MM-DD
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

// 3. КОМНАТЫ ПО ИНТЕРЕСАМ
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

// 4. ПОДАРКИ
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

// 5. ДОСТИЖЕНИЯ
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
  secret: boolean; // Скрыто до получения
}

// ============================================
// 🎨 MOCK DATA ДЛЯ НОВЫХ ФИЧ
// ============================================

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
  {
    id: 'rose',
    name: 'Роза',
    emoji: '🌹',
    animation: 'float',
    cost: 10,
    karmaBonus: 2,
    rarity: 'common'
  },
  {
    id: 'coffee',
    name: 'Кофе',
    emoji: '☕',
    animation: 'bounce',
    cost: 15,
    karmaBonus: 3,
    rarity: 'common'
  },
  {
    id: 'champagne',
    name: 'Шампанское',
    emoji: '🍾',
    animation: 'explode',
    cost: 25,
    karmaBonus: 5,
    rarity: 'rare'
  },
  {
    id: 'fire',
    name: 'Огонь',
    emoji: '🔥',
    animation: 'spin',
    cost: 30,
    karmaBonus: 6,
    rarity: 'rare'
  },
  {
    id: 'crown',
    name: 'Корона',
    emoji: '👑',
    animation: 'float',
    cost: 100,
    karmaBonus: 20,
    rarity: 'epic'
  },
  {
    id: 'rocket',
    name: 'Ракета',
    emoji: '🚀',
    animation: 'explode',
    cost: 500,
    karmaBonus: 100,
    rarity: 'legendary'
  },
  {
    id: 'diamond',
    name: 'Бриллиант',
    emoji: '💎',
    animation: 'spin',
    cost: 1000,
    karmaBonus: 250,
    rarity: 'legendary'
  }
];

const ACHIEVEMENTS_LIST: Achievement[] = [
  // COMMON
  {
    id: 'first-chat',
    name: 'Первый контакт',
    description: 'Завершите первый диалог',
    icon: '💬',
    rarity: 'common',
    unlocked: false,
    progress: 0,
    goal: 1,
    secret: false
  },
  {
    id: 'friendly',
    name: 'Дружелюбный',
    description: 'Получите 10 положительных отзывов',
    icon: '😊',
    rarity: 'common',
    unlocked: false,
    progress: 0,
    goal: 10,
    secret: false
  },
  // RARE
  {
    id: 'night-owl',
    name: 'Ночной волк',
    description: 'Общайтесь с 3:00 до 5:00',
    icon: '🌙',
    rarity: 'rare',
    unlocked: false,
    progress: 0,
    goal: 1,
    secret: true
  },
  {
    id: 'gift-giver',
    name: 'Щедрая душа',
    description: 'Отправьте 50 подарков',
    icon: '🎁',
    rarity: 'rare',
    unlocked: false,
    progress: 0,
    goal: 50,
    secret: false
  },
  // LEGENDARY
  {
    id: 'polyglot',
    name: 'Полиглот',
    description: 'Поговорите с людьми из 10 стран',
    icon: '🗺️',
    rarity: 'legendary',
    unlocked: false,
    progress: 0,
    goal: 10,
    secret: true
  },
  {
    id: 'confessor',
    name: 'Исповедник',
    description: 'Услышьте 100 секретов в исповедальне',
    icon: '🕯️',
    rarity: 'legendary',
    unlocked: false,
    progress: 0,
    goal: 100,
    secret: true
  },
  // MYTHIC
  {
    id: 'karma-master',
    name: 'Мастер Кармы',
    description: 'Достигните 100 кармы',
    icon: '🏆',
    rarity: 'mythic',
    unlocked: false,
    progress: 0,
    goal: 100,
    secret: true
  },
  {
    id: 'chat-legend',
    name: 'Легенда чатов',
    description: 'Проведите 1000 диалогов',
    icon: '👑',
    rarity: 'mythic',
    unlocked: false,
    progress: 0,
    goal: 1000,
    secret: true
  }
];

const generateDailyChallenge = (date: Date): DailyChallenge => {
  const challenges = [
    {
      type: 'duration' as const,
      goal: 600,
      description: 'Общайтесь 10 минут',
      emoji: '⏱️'
    },
    {
      type: 'reactions' as const,
      goal: 5,
      description: 'Получите 5 положительных реакций',
      emoji: '🔥'
    },
    {
      type: 'reveals' as const,
      goal: 2,
      description: 'Раскройте личность с 2 людьми',
      emoji: '🎭'
    },
    {
      type: 'messages' as const,
      goal: 50,
      description: 'Отправьте 50 сообщений',
      emoji: '💬'
    }
  ];

  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const selectedChallenge = challenges[dayOfYear % challenges.length];

  return {
    id: `challenge-${date.toISOString().split('T')[0]}`,
    date: date.toISOString().split('T')[0],
    task: selectedChallenge,
    progress: 0,
    completed: false,
    reward: {
      stars: 50,
      karma: 5
    },
    streak: 0
  };
};
