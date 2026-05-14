// src/constants/config.ts
export const CONFIG = {
  // Таймеры
  CHAT_DURATION_DEFAULT: 900,      // 15 минут
  CHAT_DURATION_PREMIUM: 3600,     // 1 час
  MEDIA_UNLOCK_DURATION: 300,      // 5 минут
  CONFESS_BURN_DELAY: 60,          // 60 секунд
  
  // Цены в звёздах
  COST_REVEAL_IDENTITY: 50,
  COST_EXTEND_CHAT: 15,
  COST_UNLOCK_MEDIA: 10,
  COST_UNLOCK_REVIEWS: 30,
  COST_ROOM_PLUS: 199,
  COST_CONFESSION: 25,
  
  // Награды
  REACTION_KARMA_BONUS: 1,
  DAILY_CHALLENGE_STARS: 50,
  DAILY_CHALLENGE_KARMA: 5,
  
  // Лимиты
  MAX_KARMA: 100,
  MAX_RATING_NOTE_LENGTH: 100,
  
  // Анимации
  SMOKE_TRANSITION_MS: 1800,
  SMOKE_HIDE_MS: 2800,
  ACHIEVEMENT_TOAST_MS: 5000,
  GIFT_ANIMATION_MS: 3000,
} as const;