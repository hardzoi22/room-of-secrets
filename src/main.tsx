============================================================
FILE: src/main.tsx
============================================================
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { AppProvider, useApp } from "./store";
import { initTelegramWebApp } from "./utils/telegram";

// Initialize Telegram WebApp
initTelegramWebApp();

// Timer component to handle chat countdown
function TimerHandler() {
  const { chatSessionActive, chatTimer, setChatTimer, exitChat } = useApp();

  useEffect(() => {
    if (!chatSessionActive || chatTimer <= 0) return;

    const interval = setInterval(() => {
      setChatTimer((prev: number) => {
        if (prev <= 1) {
          clearInterval(interval);
          exitChat(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [chatSessionActive, chatTimer, setChatTimer, exitChat]);

  // Media timer
  const { mediaUnblocked, mediaTimer, setMediaUnblocked, setMediaTimer } = useApp();

  useEffect(() => {
    if (!mediaUnblocked || mediaTimer === null || mediaTimer <= 0) return;

    const interval = setInterval(() => {
      setMediaTimer((prev: number | null) => {
        if (prev && prev <= 1) {
          setMediaUnblocked(false);
          return null;
        }
        return prev !== null ? prev - 1 : null;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [mediaUnblocked, mediaTimer, setMediaTimer, setMediaUnblocked]);

  return null;
}

function Root() {
  return (
    <StrictMode>
      <AppProvider>
        <TimerHandler />
        <App />
      </AppProvider>
    </StrictMode>
  );
}

createRoot(document.getElementById("root")!).render(<Root />);


============================================================
FILE: src/types/index.ts
============================================================
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


============================================================
FILE: src/utils/telegram.ts
============================================================
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        enableClosingConfirmation: () => void;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
          start_param?: string;
        };
        showPopup: (params: { title?: string; message: string; buttons?: { id: string; text: string; type?: string }[] }) => Promise<string>;
        showAlert: (message: string) => Promise<void>;
        showConfirm: (message: string) => Promise<boolean>;
        openInvoice: (url: string) => Promise<string>;
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        platform: string;
        version: string;
        colorScheme: 'light' | 'dark';
        themeParams: Record<string, string>;
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        onEvent: (event: string, callback: () => void) => void;
        offEvent: (event: string, callback: () => void) => void;
      };
    };
  }
}

export function initTelegramWebApp() {
  const tg = window.Telegram?.WebApp;
  if (!tg) {
    console.warn('Telegram WebApp not detected — running in standalone mode');
    return null;
  }

  tg.ready();
  tg.expand();
  tg.enableClosingConfirmation();
  tg.setHeaderColor('#0A0A0B');
  tg.setBackgroundColor('#050506');

  // Haptic feedback on interactions
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      tg.HapticFeedback?.impactOccurred('light');
    }
  });

  return tg;
}

export function isTelegramWebApp(): boolean {
  return !!window.Telegram?.WebApp;
}

export function getTelegramUser() {
  return window.Telegram?.WebApp?.initDataUnsafe?.user;
}

export function getReferralCode(): string | undefined {
  return window.Telegram?.WebApp?.initDataUnsafe?.start_param;
}

export function hapticSuccess() {
  window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
}

export function hapticError() {
  window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('error');
}

export function hapticWarning() {
  window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('warning');
}


============================================================
FILE: src/utils/time.ts
============================================================
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getCurrentTime(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}


============================================================
FILE: src/utils/cn.ts
============================================================
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


============================================================
FILE: src/data/strangers.ts
============================================================
import type { StrangerPersona } from '@/types';

export const STRANGER_PERSONAS: StrangerPersona[] = [
  {
    id: 'ekaterina',
    name: 'Екатерина 🎨',
    age: 22,
    city: 'Москва',
    tag: '#4A7F',
    avatarColor: 'from-pink-500 to-purple-600',
    karma: 94,
    avatarSeed: 'art_girl',
    bio: 'Художница, обожаю урбанизм, пост-панк и кофе. Верю, что случайные встречи не случайны.',
    firstMsg: 'Привет! Рада соединению. Очень необычное приложение. Чем занимаешься по жизни? 🎨',
    replies: [
      { keywords: ['привет', 'здравствуй', 'ку', 'прив', 'хай'], text: 'Привет-привет! Рада познакомиться! Расскажи, ты давно в этой тайной комнате?' },
      { keywords: ['дела', 'как ты', 'настроение'], text: 'У меня отлично, рисую эскиз для нового проекта. А как у тебя дела на той стороне экрана?' },
      { keywords: ['кто ты', 'как зовут', 'имя', 'аватар'], text: 'Я не могу сказать своё имя, пока мы не раскроем личности! 🤫 Это ведь Room of Secrets. Давай пообщаемся, и если оба согласимся — нажмем маску вверху!' },
      { keywords: ['секрет', 'тайна', 'расскажи'], text: 'Мой главный секрет в том, что я иногда пою во весь голос в караоке, когда никого нет дома... Теперь твоя очередь делиться тайнами!' },
      { keywords: ['карм', 'репутац'], text: 'У меня карма 94! Очень ценю вежливое и искреннее общение. А у тебя сколько?' }
    ],
    defaultReplies: [
      'Интересная мысль! Я вообще человек творческий, люблю глубокие разговоры с незнакомцами. Расскажи что-нибудь необычное из своей недели.',
      'Ого, здорово! Слушай, а веришь в то, что анонимность помогает людям быть более искренними?',
      'Звучит круто! К слову, тут такая классная атмосфера, прямо как в закрытом ночном клубе.'
    ]
  },
  {
    id: 'aleksey',
    name: 'Алексей 💻',
    age: 27,
    city: 'Минск',
    tag: '#9E2C',
    avatarColor: 'from-blue-500 to-cyan-600',
    karma: 88,
    avatarSeed: 'geek_guy',
    bio: 'Разработчик, люблю путешествовать, горные лыжи и хороший крафт. Ценю адекватность.',
    firstMsg: 'Привет аноним! Только зашел потестить комнату. Как дела, чем занят? ☕️',
    replies: [
      { keywords: ['привет', 'здравствуй', 'ку', 'прив', 'хай'], text: 'Привет! Рад адекватному собеседнику. Ищу с кем лампово поболтать под вечер.' },
      { keywords: ['дела', 'как ты', 'настроение'], text: 'Кодю свой пет-проект под кружку чая. Решил сделать перерыв. Как твой день прошел?' },
      { keywords: ['кто ты', 'как зовут', 'имя', 'аватар'], text: 'Я IT-инженер из Минска, но имя пока под секретом! Давай сначала пообщаемся, потом обменяемся контактами за звезды 🚀' },
      { keywords: ['секрет', 'тайна', 'расскажи'], text: 'Секрет? Я однажды случайно удалил важный файл на прод-сервере и тихонько восстановил его за 5 минут до планерки. Никто так и не узнал! 👀' },
      { keywords: ['карм', 'репутац'], text: 'Моя карма 88. Стараюсь общаться вежливо. Думаю, система кармы отлично отсеивает странных персонажей.' }
    ],
    defaultReplies: [
      'Понимаю тебя. В современном интернете анонимность — это настоящая роскошь.',
      'Ха-ха, забавно! Расскажи, а ты любишь свою работу или больше мечтаешь о путешествиях?',
      'Ясно. Кстати, как тебе концепт этого чата? Мне нравится, что нет <response clipped><NOTE>Result is longer than **10000 characters**, will be **truncated**.</NOTE>
