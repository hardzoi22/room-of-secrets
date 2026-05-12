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

export interface Review {
  id: string;
  text: string;
  date: string;
  reaction: 'fire' | 'angel' | 'brain' | 'toxic';
}

export interface Referral {
  id: number;
  name: string;
  starsEarned: number;
  date: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export type Tab = 'lobby' | 'chat' | 'reviews' | 'profile';
export type IdentityState = 'none' | 'sent' | 'received' | 'accepted' | 'declined';
export type SmokeType = 'match' | 'exit' | 'burn' | 'init';
