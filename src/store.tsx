import React, { createContext, useContext, useState, useCallback } from 'react';
import type {
  ChatMessage, StrangerPersona, Review, Referral,
  Tab, IdentityState, Toast
} from '@/types';
import { STRANGER_PERSONAS } from '@/data/strangers';
import { getCurrentTime } from '@/utils/time';

interface AppState {
  // Navigation
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;

  // Chat
  chatSessionActive: boolean;
  chatMessages: ChatMessage[];
  isStrangerTyping: boolean;
  chatTimer: number;
  setChatTimer: React.Dispatch<React.SetStateAction<number>>;
  selectedStranger: StrangerPersona;
  identityRequestState: IdentityState;
  mediaUnblocked: boolean;
  setMediaUnblocked: React.Dispatch<React.SetStateAction<boolean>>;
  mediaTimer: number | null;
  setMediaTimer: React.Dispatch<React.SetStateAction<number | null>>;

  // Economy
  starsBalance: number;
  isRoomPlus: boolean;

  // Stats
  userKarma: number;
  chatsCount: number;
  totalReactions: { fire: number; angel: number; brain: number; toxic: number };
  reviews: Review[];
  referrals: Referral[];

  // Filters
  filters: {
    gender: string;
    country: string;
    ageRange: [number, number];
  };
  setFilters: (filters: AppState['filters']) => void;

  // UI
  showRatingScreen: boolean;
  ratingReaction: string | null;
  isSearching: boolean;
  searchProgress: number;
  showSmokeScreen: boolean;
  smokeType: 'match' | 'exit' | 'burn' | 'init';
  smokeMessage: string;
  toasts: Toast[];

  // Actions
  startSearch: () => void;
  cancelSearch: () => void;
  sendMessage: (text: string, type?: 'text' | 'media' | 'voice') => void;
  exitChat: (byTimeout?: boolean) => void;
  burnBridge: () => void;
  submitRating: () => void;
  revealIdentity: () => void;
  extendChat: () => void;
  unlockMedia: () => void;
  spendStars: (amount: number, purpose: string) => boolean;
  toggleRoomPlus: () => void;
  addReferral: (referral: Referral) => void;
  setRatingReaction: (reaction: string | null) => void;
  loadStranger: (id: string) => void;
  addStars: (amount: number) => void;
  showToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Navigation
  const [activeTab, setActiveTab] = useState<Tab>('lobby');

  // Chat
  const [chatSessionActive, setChatSessionActive] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isStrangerTyping, setIsStrangerTyping] = useState(false);
  const [chatTimer, setChatTimer] = useState(900);
  const [selectedStranger, setSelectedStranger] = useState<StrangerPersona>(STRANGER_PERSONAS[0]);
  const [identityRequestState, setIdentityRequestState] = useState<IdentityState>('none');
  const [mediaUnblocked, setMediaUnblocked] = useState(false);
  const [mediaTimer, setMediaTimer] = useState<number | null>(null);

  // Economy
  const [starsBalance, setStarsBalance] = useState(150);
  const [isRoomPlus, setIsRoomPlus] = useState(false);

  // Stats
  const [userKarma, setUserKarma] = useState(88);
  const [chatsCount, setChatsCount] = useState(42);
  const [totalReactions, setTotalReactions] = useState({ fire: 18, angel: 14, brain: 12, toxic: 2 });
  const [reviews] = useState<Review[]>([
    { id: '1', text: 'Обсудили философию и взгляды на жизнь.', date: 'Вчера', reaction: 'brain' },
    { id: '2', text: 'Очень забавный собеседник!', date: '18.02.2026', reaction: 'fire' },
    { id: '3', text: 'Приятно пообщались, много смеялись.', date: '15.02.2026', reaction: 'angel' },
  ]);
  const [referrals, setReferrals] = useState<Referral[]>([
    { id: 1, name: '@misha_v', starsEarned: 45, date: '12.02.2026' },
    { id: 2, name: '@kate_cyber', starsEarned: 20, date: '18.02.2026' },
  ]);

  // Filters
  const [filters, setFilters] = useState({
    gender: 'all',
    country: 'all',
    ageRange: [18, 35] as [number, number],
  });

  // UI
  const [showRatingScreen, setShowRatingScreen] = useState(false);
  const [ratingReaction, setRatingReactionState] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [showSmokeScreen, setShowSmokeScreen] = useState(false);
  const [smokeType, setSmokeType] = useState<'match' | 'exit' | 'burn' | 'init'>('init');
  const [smokeMessage, setSmokeMessage] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Toast system
  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const spendStars = useCallback((amount: number, purpose: string): boolean => {
    if (starsBalance < amount) {
      showToast(`Недостаточно Stars! Нужно ${amount} ⭐`, 'error');
      return false;
    }
    setStarsBalance(prev => prev - amount);
    showToast(`Списано ${amount} ⭐: ${purpose}`, 'success');
    return true;
  }, [starsBalance, showToast]);

  const addStars = useCallback((amount: number) => {
    setStarsBalance(prev => prev + amount);
    if (amount > 0) showToast(`+${amount} ⭐`, 'success');
  }, [showToast]);

  const triggerSmoke = useCallback((type: 'match' | 'exit' | 'burn', message: string, callback: () => void) => {
    setSmokeType(type);
    setSmokeMessage(message);
    setShowSmokeScreen(true);
    setTimeout(() => { callback(); }, 1800);
    setTimeout(() => { setShowSmokeScreen(false); }, 2800);
  }, []);

  const startSearch = useCallback(() => {
    if (isSearching) return;
    setIsSearching(true);
    setSearchProgress(0);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setSearchProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        triggerSmoke('match', 'Синхронизация сессии...', () => {
          setIsSearching(false);
          setChatSessionActive(true);
          setChatTimer(isRoomPlus ? 3600 : 900);
          setIdentityRequestState('none');
          setMediaUnblocked(false);

          const systemMsg: ChatMessage = {
            id: 'sys-start', sender: 'system',
            text: '⚠️ Чат полностью анонимен. IP-адреса не логируются.',
            time: getCurrentTime()
          };
          const introMsg: ChatMessage = {
            id: 'stranger-intro', sender: 'stranger',
            text: selectedStranger.firstMsg,
            time: getCurrentTime()
          };

          setChatMessages([systemMsg, introMsg]);
          setActiveTab('chat');
        });
      }
    }, 250);
  }, [isSearching, isRoomPlus, selectedStranger, triggerSmoke]);

  const cancelSearch = useCallback(() => {
    setIsSearching(false);
    showToast('Поиск отменён', 'info');
  }, [showToast]);

  const sendMessage = useCallback((text: string, type: 'text' | 'media' | 'voice' = 'text') => {
    if (!text.trim() && type === 'text') return;

    const newMsg: ChatMessage = {
      id: `user-msg-${Date.now()}`,
      sender: 'user',
      text: text,
      time: getCurrentTime(),
      type
    };

    setChatMessages(prev => [...prev, newMsg]);

    setIsStrangerTyping(true);
    setTimeout(() => {
      setIsStrangerTyping(false);
      let replyText = '';
      if (type !== 'text') {
        replyText = 'Ого, это медиафайл! Очень классно! 😍';
      } else {
        const lowerText = text.toLowerCase();
        const matchedRule = selectedStranger.replies.find(r =>
          r.keywords.some(keyword => lowerText.includes(keyword))
        );
        if (matchedRule) {
          replyText = matchedRule.text;
        } else {
          const randIndex = Math.floor(Math.random() * selectedStranger.defaultReplies.length);
          replyText = selectedStranger.defaultReplies[randIndex];
        }
      }

      setChatMessages(prev => [...prev, {
        id: `stranger-msg-${Date.now()}`,
        sender: 'stranger',
        text: replyText,
        time: getCurrentTime()
      }]);
    }, 1200);
  }, [selectedStranger]);

  const exitChat = useCallback((byTimeout = false) => {
    triggerSmoke('exit', 'Рассеивание дыма...', () => {
      setChatSessionActive(false);
      setShowRatingScreen(true);
      setRatingReactionState(null);
      if (byTimeout) showToast('Время диалога истекло', 'info');
    });
  }, [triggerSmoke, showToast]);

  const burnBridge = useCallback(() => {
    triggerSmoke('burn', 'Сжигание мостов... 🔥', () => {
      setChatSessionActive(false);
      setChatMessages([]);
      setActiveTab('lobby');
      showToast('Мост сожжён. Переписка удалена.', 'success');
    });
  }, [triggerSmoke, showToast]);

  const submitRating = useCallback(() => {
    setChatsCount(prev => prev + 1);
    if (ratingReaction === 'toxic') {
      setTotalReactions(prev => ({ ...prev, toxic: prev.toxic + 1 }));
      showToast('Отзыв отправлен. Спасибо!', 'info');
    } else if (ratingReaction) {
      setUserKarma(prev => Math.min(100, prev + 1));
      if (ratingReaction === 'fire') setTotalReactions(prev => ({ ...prev, fire: prev.fire + 1 }));
      else if (ratingReaction === 'angel') setTotalReactions(prev => ({ ...prev, angel: prev.angel + 1 }));
      else if (ratingReaction === 'brain') setTotalReactions(prev => ({ ...prev, brain: prev.brain + 1 }));
      showToast('Отзыв отправлен! +1 к карме', 'success');
    }
    setShowRatingScreen(false);
    setActiveTab('lobby');
  }, [ratingReaction, showToast]);

  const revealIdentity = useCallback(() => {
    if (identityRequestState === 'accepted') return;
    if (!spendStars(50, 'Раскрытие личности')) return;
    setIdentityRequestState('sent');
    setTimeout(() => {
      setIdentityRequestState('accepted');
      setChatMessages(prev => [...prev, {
        id: 'reveal-sys', sender: 'system',
        text: `🔓 ЛИЧНОСТИ РАСКРЫТЫ! ${selectedStranger.name}, ${selectedStranger.age} лет, ${selectedStranger.city}`,
        time: getCurrentTime()
      }]);
    }, 2000);
  }, [identityRequestState, spendStars, selectedStranger]);

  const extendChat = useCallback(() => {
    if (!spendStars(15, 'Продление чата')) return;
    setChatTimer(prev => prev + 900);
  }, [spendStars]);

  const unlockMedia = useCallback(() => {
    if (isRoomPlus) {
      setMediaUnblocked(true);
      setMediaTimer(300);
      showToast('Медиа разблокировано (Room+)', 'success');
      return;
    }
    if (!spendStars(10, 'Разблокировка медиа')) return;
    setMediaUnblocked(true);
    setMediaTimer(300);
  }, [isRoomPlus, spendStars, showToast]);

  const toggleRoomPlus = useCallback(() => {
    if (isRoomPlus) {
      setIsRoomPlus(false);
      showToast('Room+ отключён', 'info');
      return;
    }
    if (!spendStars(199, 'Подписка Room+')) return;
    setIsRoomPlus(true);
    showToast('Room+ активирован!', 'success');
  }, [isRoomPlus, spendStars, showToast]);

  const addReferral = useCallback((referral: Referral) => {
    setReferrals(prev => [referral, ...prev]);
    setStarsBalance(prev => prev + 50);
    showToast(`+50 ⭐ за реферала ${referral.name}`, 'success');
  }, [showToast]);

  const loadStranger = useCallback((id: string) => {
    const preset = STRANGER_PERSONAS.find(p => p.id === id);
    if (preset) setSelectedStranger(preset);
  }, []);

  const value: AppState = {
    activeTab, setActiveTab,
    chatSessionActive, chatMessages, isStrangerTyping, chatTimer, setChatTimer,
    selectedStranger, identityRequestState, mediaUnblocked, setMediaUnblocked,
    mediaTimer, setMediaTimer,
    starsBalance, isRoomPlus,
    userKarma, chatsCount, totalReactions, reviews, referrals,
    filters, setFilters,
    showRatingScreen, ratingReaction, isSearching, searchProgress,
    showSmokeScreen, smokeType, smokeMessage, toasts,
    startSearch, cancelSearch, sendMessage, exitChat, burnBridge,
    submitRating, revealIdentity, extendChat, unlockMedia, spendStars,
    toggleRoomPlus, addReferral, setRatingReaction: setRatingReactionState,
    loadStranger, addStars, showToast, removeToast,
  };

  return React.createElement(AppContext.Provider, { value }, children);
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
