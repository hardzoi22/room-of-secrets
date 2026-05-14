import type { Gift } from '../types';

export const AVAILABLE_GIFTS: Gift[] = [
  { id: 'rose', name: 'Роза', emoji: '🌹', animation: 'float', cost: 10, karmaBonus: 2, rarity: 'common' },
  { id: 'coffee', name: 'Кофе', emoji: '☕', animation: 'bounce', cost: 15, karmaBonus: 3, rarity: 'common' },
  { id: 'champagne', name: 'Шампанское', emoji: '🍾', animation: 'explode', cost: 25, karmaBonus: 5, rarity: 'rare' },
  { id: 'fire', name: 'Огонь', emoji: '🔥', animation: 'spin', cost: 30, karmaBonus: 6, rarity: 'rare' },
  { id: 'crown', name: 'Корона', emoji: '👑', animation: 'float', cost: 100, karmaBonus: 20, rarity: 'epic' },
  { id: 'rocket', name: 'Ракета', emoji: '🚀', animation: 'explode', cost: 500, karmaBonus: 100, rarity: 'legendary' },
  { id: 'diamond', name: 'Бриллиант', emoji: '💎', animation: 'spin', cost: 1000, karmaBonus: 250, rarity: 'legendary' }
];
