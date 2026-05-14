import type { Achievement } from '../types';

export const ACHIEVEMENTS_LIST: Achievement[] = [
  { id: 'first-chat', name: 'Первый контакт', description: 'Завершите первый диалог', icon: '💬', rarity: 'common', unlocked: false, progress: 0, goal: 1, secret: false },
  { id: 'friendly', name: 'Дружелюбный', description: 'Получите 10 положительных отзывов', icon: '😊', rarity: 'common', unlocked: false, progress: 0, goal: 10, secret: false },
  { id: 'night-owl', name: 'Ночной волк', description: 'Общайтесь с 3:00 до 5:00', icon: '🌙', rarity: 'rare', unlocked: false, progress: 0, goal: 1, secret: true },
  { id: 'gift-giver', name: 'Щедрая душа', description: 'Отправьте 50 подарков', icon: '🎁', rarity: 'rare', unlocked: false, progress: 0, goal: 50, secret: false },
  { id: 'polyglot', name: 'Полиглот', description: 'Поговорите с людьми из 10 стран', icon: '🗺️', rarity: 'legendary', unlocked: false, progress: 0, goal: 10, secret: true },
  { id: 'confessor', name: 'Исповедник', description: 'Услышьте 100 секретов в исповедальне', icon: '🕯️', rarity: 'legendary', unlocked: false, progress: 0, goal: 100, secret: true },
  { id: 'karma-master', name: 'Мастер Кармы', description: 'Достигните 100 кармы', icon: '🏆', rarity: 'mythic', unlocked: false, progress: 0, goal: 100, secret: true },
  { id: 'chat-legend', name: 'Легенда чатов', description: 'Проведите 1000 диалогов', icon: '👑', rarity: 'mythic', unlocked: false, progress: 0, goal: 1000, secret: true }
];
