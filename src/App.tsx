// src/App.tsx — верхняя часть (заменить старую)
import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, Sparkles, Coins, User, ImageIcon, Clock,
  Flame, X, Award, Send, Copy, Check, Compass, Sliders, LockKeyhole
} from 'lucide-react';

// ✅ Импортируем только типы и константы (файлы уже созданы)
import type {
  StrangerPersona, ChatMessage, ConfessionSession, DailyChallenge,
  TopicRoom, Gift, SentGift, Achievement, ActiveTab,
  IdentityState, SmokeType, Filters, Reactions
} from './types';
import { CONFIG } from './constants/config';

// ✅ Мок-данные пока оставляем здесь (вынесем позже)
import { STRANGER_PERSONAS } from './data/strangers'; // создадим на следующем шаге
import { TOPIC_ROOMS } from './data/rooms';
import { AVAILABLE_GIFTS } from './data/gifts';
import { ACHIEVEMENTS_LIST } from './data/achievements';
