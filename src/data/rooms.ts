import type { TopicRoom } from '../types';

export const TOPIC_ROOMS: TopicRoom[] = [
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
