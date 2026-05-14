// src/types/index.ts
export interface StrangerPersona {
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

export interface ChatMessage {
  id: string;
  sender: 'user' | 'stranger' | 'system';
  text: string;
  time: string;
  type?: 'text' | 'media' | 'voice';
}

export interface ConfessionSession {
  id: string;
  mode: 'confess' | 'listen';
  topic: 'любовь' | 'работа' | 'страхи' | 'мечты' | 'любое';
  burnAfter: number;
  isActive: boolean;
  createdAt: Date;
}

export interface DailyChallenge {
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
  reward: { stars: number; karma: number };
  streak: number;
}

export interface TopicRoom {
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

export interface Gift {
  id: string;
  name: string;
  emoji: string;
  animation: 'bounce' | 'float' | 'explode' | 'spin';
  cost: number;
  karmaBonus: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface SentGift {
  gift: Gift;
  timestamp: Date;
  sender: 'user' | 'stranger';
}

export interface Achievement {
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

export type ActiveTab = 'lobby' | 'chat' | 'reviews' | 'profile';
export type IdentityState = 'none' | 'sent' | 'received' | 'accepted' | 'declined';
export type SmokeType = 'match' | 'exit' | 'burn' | 'init';

export interface Filters {
  gender: 'all' | 'male' | 'female';
  country: string;
  ageRange: [number, number];
}

export interface Reactions {
  fire: number;
  angel: number;
  brain: number;
  toxic: number;
}
