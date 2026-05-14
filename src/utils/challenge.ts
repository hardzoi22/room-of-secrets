// src/utils/challenge.ts
import type { DailyChallenge } from '../types';
import { CONFIG } from '../constants/config';

export const generateDailyChallenge = (date: Date): DailyChallenge => {
  const challenges = [
    { type: 'duration' as const, goal: 600, description: 'Общайтесь 10 минут', emoji: '⏱️' },
    { type: 'reactions' as const, goal: 5, description: 'Получите 5 положительных реакций', emoji: '🔥' },
    { type: 'reveals' as const, goal: 2, description: 'Раскройте личность с 2 людьми', emoji: '🎭' },
    { type: 'messages' as const, goal: 50, description: 'Отправьте 50 сообщений', emoji: '💬' }
  ];
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const selected = challenges[dayOfYear % challenges.length];
  return {
    id: `challenge-${date.toISOString().split('T')[0]}`,
    date: date.toISOString().split('T')[0],
    task: selected,
    progress: 0,
    completed: false,
    reward: { stars: CONFIG.DAILY_CHALLENGE_STARS, karma: CONFIG.DAILY_CHALLENGE_KARMA },
    streak: 0
  };
};
