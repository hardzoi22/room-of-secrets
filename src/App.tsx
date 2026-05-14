// src/App.tsx — после рефакторинга
import React, { useState, useEffect } from 'react';
import { useEconomy } from './hooks/useEconomy';
import { useAchievements } from './hooks/useAchievements';
import { useDailyChallenge } from './hooks/useDailyChallenge';
import { useChat } from './hooks/useChat';

import { LobbyScreen } from './components/screens/LobbyScreen';
import { ChatScreen } from './components/screens/ChatScreen';
import { ReviewsScreen } from './components/screens/ReviewsScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { BottomNav } from './components/layout/BottomNav';
import { SmokeOverlay } from './components/layout/SmokeOverlay';

import { ActiveTab } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('lobby');
  
  // 🎯 Подключаем хуки
  const economy = useEconomy();
  const achievements = useAchievements({
    chatsCount: 42, // 🔄 заменить на реальный стейт
    totalReactions: { fire: 18, angel: 14, brain: 12, toxic: 2 },
    userKarma: economy.userKarma,
    sentGiftsCount: 0,
    chatSessionActive: activeTab === 'chat',
  });
  const challenge = useDailyChallenge();
  const chat = useChat({
    onChatEnd: () => { /* логика завершения */ },
    onReaction: (type) => { /* обновляем totalReactions */ },
  });

  // 🔄 Telegram init
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#0A0A0B');
      tg.setBackgroundColor('#050506');
      if (tg.isVersionAtLeast('6.1')) {
        tg.disableVerticalSwipes();
      }
    }
  }, []);

  return (
    <div className="fixed inset-0 w-full bg-[#050506] text-white flex flex-col overflow-hidden">
      
      {/* Глобальные оверлеи */}
      <SmokeOverlay 
        visible={chat.showSmoke} 
        type={chat.smokeType} 
        message={chat.smokeMessage}
      />
      
      {achievements.newUnlocked && (
        <AchievementToast achievement={achievements.newUnlocked} />
      )}

      {/* Экраны */}
      {activeTab === 'lobby' && (
        <LobbyScreen
          onStartSearch={chat.startSearch}
          isSearching={chat.isSearching}
          searchProgress={chat.searchProgress}
          filters={chat.filters}
          onFiltersChange={chat.setFilters}
          dailyChallenge={challenge.current}
          onJoinRoom={chat.joinRoom}
        />
      )}
      
      {activeTab === 'chat' && chat.sessionActive && (
        <ChatScreen
          stranger={chat.currentStranger}
          messages={chat.messages}
          timer={chat.timer}
          onSendMessage={chat.sendMessage}
          onExit={chat.exitChat}
          onBurn={chat.burnBridge}
          economy={economy}
          onSendGift={chat.sendGift}
        />
      )}
      
      {activeTab === 'reviews' && (
        <ReviewsScreen
          karma={economy.userKarma}
          isUnlocked={chat.reviewsUnlocked}
          onUnlock={() => economy.spendStars(30, 'reviews', () => chat.setReviewsUnlocked(true))}
        />
      )}
      
      {activeTab === 'profile' && (
        <ProfileScreen
          karma={economy.userKarma}
          chatsCount={42}
          achievements={achievements.achievements}
          isRoomPlus={economy.isRoomPlus}
          onToggleRoomPlus={economy.toggleRoomPlus}
          starsBalance={economy.starsBalance}
        />
      )}

      {/* Навигация */}
      {activeTab !== 'chat' && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          hasActiveChat={chat.sessionActive}
        />
      )}
    </div>
  );
}
