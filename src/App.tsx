import React, { useState, useEffect } from 'react';
import { SmokeOverlay } from './components/ui/SmokeOverlay';
import { LobbyScreen } from './components/lobby/LobbyScreen';
import { ChatScreen } from './components/chat/ChatScreen';
import { ReviewsScreen } from './components/reviews/ReviewsScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';

import { STRANGER_PERSONAS } from './data/mockData';
import { StrangerPersona, ChatMessage } from './types';

export default function App() {
  // Основные состояния
  const [activeTab, setActiveTab] = useState<'lobby' | 'chat' | 'reviews' | 'profile'>('lobby');
  const [chatSessionActive, setChatSessionActive] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [selectedStranger, setSelectedStranger] = useState<StrangerPersona>(STRANGER_PERSONAS[0]);

  // Экономика и статистика
  const [starsBalance, setStarsBalance] = useState(150);
  const [isRoomPlus, setIsRoomPlus] = useState(false);
  const [userKarma, setUserKarma] = useState(88);
  const [chatsCount, setChatsCount] = useState(42);
  const [totalReactions, setTotalReactions] = useState({ fire: 18, angel: 14, brain: 12, toxic: 2 });

  // Состояния чата
  const [chatTimer, setChatTimer] = useState(900);
  const [identityRequestState, setIdentityRequestState] = useState<'none' | 'sent' | 'received' | 'accepted' | 'declined'>('none');
  const [mediaUnblocked, setMediaUnblocked] = useState(false);

  // UI состояния
  const [showSmokeScreen, setShowSmokeScreen] = useState(false);
  const [smokeMessage, setSmokeMessage] = useState('');
  const [smokeType, setSmokeType] = useState<'match' | 'exit' | 'burn' | 'init'>('init');
  const [showRatingScreen, setShowRatingScreen] = useState(false);
  const [ratingReaction, setRatingReaction] = useState<string | null>(null);
  const [ratingNote, setRatingNote] = useState('');

  // Новые фичи (Часть 1)
  const [showRoomsModal, setShowRoomsModal] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [dailyChallenge, setDailyChallenge] = useState<any>(null);
  const [challengeStreak, setChallengeStreak] = useState(0);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [sentGifts, setSentGifts] = useState<any[]>([]);

  const handleStartSearch = () => {
    // Логика поиска (будет расширена)
    console.log("Поиск начат...");
  };

  const handleSendMessage = (text: string) => {
    // Логика отправки сообщения
    console.log("Сообщение отправлено:", text);
  };

  const handleExitChat = () => {
    setChatSessionActive(false);
    setActiveTab('lobby');
  };

  // Telegram WebApp инициализация
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#0A0A0B');
      tg.setBackgroundColor('#030305');
      if (tg.isVersionAtLeast('6.1')) tg.disableVerticalSwipes();
    }
  }, []);

  return (
    <div className="fixed inset-0 w-full bg-[#030305] text-white flex flex-col overflow-hidden select-none">
      
      <SmokeOverlay 
        show={showSmokeScreen} 
        type={smokeType} 
        message={smokeMessage} 
      />

      {/* HEADER */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-white/5 bg-[#0A0A0B]/90 backdrop-blur-xl z-40">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
          Room of Secrets
        </h1>
        <div className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-2xl border border-white/10">
          <span className="text-amber-400">⭐</span>
          <span className="font-mono font-bold text-lg text-amber-300">{starsBalance}</span>
        </div>
      </div>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'lobby' && (
          <LobbyScreen 
            onStartSearch={handleStartSearch}
            onOpenRooms={() => setShowRoomsModal(true)}
            starsBalance={starsBalance}
            dailyChallenge={dailyChallenge}
            challengeStreak={challengeStreak}
          />
        )}

        {activeTab === 'chat' && (
          <ChatScreen 
            messages={chatMessages}
            selectedStranger={selectedStranger}
            chatTimer={chatTimer}
            identityRequestState={identityRequestState}
            onSendMessage={handleSendMessage}
            onExitChat={handleExitChat}
            onRevealIdentity={() => {}}
            onBurnBridge={() => {}}
            onSendGift={() => setShowGiftModal(true)}
          />
        )}

        {activeTab === 'reviews' && <ReviewsScreen />}
        
        {activeTab === 'profile' && (
          <ProfileScreen 
            userKarma={userKarma}
            chatsCount={chatsCount}
            achievements={achievements}
            isRoomPlus={isRoomPlus}
            onOpenAchievements={() => setShowAchievementsModal(true)}
            onActivateRoomPlus={() => {}}
          />
        )}
      </div>

      {/* BOTTOM NAVIGATION */}
      {activeTab !== 'chat' && (
        <div className="bg-[#0A0A0B]/95 backdrop-blur-2xl border-t border-white/5 px-2 py-3 flex justify-around z-50">
          {[
            { id: 'lobby', icon: '🔮', label: 'Поиск' },
            { id: 'chat', icon: '💬', label: 'Чат', active: chatSessionActive },
            { id: 'reviews', icon: '🏆', label: 'Отзывы' },
            { id: 'profile', icon: '👤', label: 'Профиль' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${
                activeTab === tab.id ? 'text-purple-400 scale-110' : 'text-gray-400'
              }`}
            >
              <span className="text-2xl">{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* МОДАЛЬНЫЕ ОКНА */}
      {/* Здесь будут все модалки — будут добавлены в следующих файлах */}
    </div>
  );
}
