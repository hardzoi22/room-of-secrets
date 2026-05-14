import React, { useState, useEffect } from 'react';
import { SmokeOverlay } from './components/ui/SmokeOverlay';
import { LobbyScreen } from './components/lobby/LobbyScreen';
import { ChatScreen } from './components/chat/ChatScreen';
import { ReviewsScreen } from './components/reviews/ReviewsScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';

import { RoomsModal } from './components/modals/RoomsModal';
import { GiftModal } from './components/modals/GiftModal';
import { AchievementsModal } from './components/modals/AchievementsModal';
import { ChallengeCompleteModal } from './components/modals/ChallengeCompleteModal';

import { STRANGER_PERSONAS, TOPIC_ROOMS, AVAILABLE_GIFTS, ACHIEVEMENTS_LIST, generateDailyChallenge } from './data/mockData';
import { StrangerPersona, ChatMessage, TopicRoom, Gift, Achievement } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'lobby' | 'chat' | 'reviews' | 'profile'>('lobby');
  const [chatSessionActive, setChatSessionActive] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [selectedStranger, setSelectedStranger] = useState<StrangerPersona>(STRANGER_PERSONAS[0]);

  const [starsBalance, setStarsBalance] = useState(150);
  const [isRoomPlus, setIsRoomPlus] = useState(false);
  const [userKarma, setUserKarma] = useState(88);
  const [chatsCount, setChatsCount] = useState(42);

  const [showSmokeScreen, setShowSmokeScreen] = useState(false);
  const [smokeMessage, setSmokeMessage] = useState('');
  const [smokeType, setSmokeType] = useState<'match' | 'exit' | 'burn' | 'init'>('init');

  // Новые фичи
  const [showRoomsModal, setShowRoomsModal] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);

  const [dailyChallenge, setDailyChallenge] = useState(generateDailyChallenge(new Date()));
  const [challengeStreak, setChallengeStreak] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS_LIST);
  const [sentGifts, setSentGifts] = useState<any[]>([]);

  const [isSearching, setIsSearching] = useState(false);

  const triggerSmokeEffect = (type: any, message: string, callback: () => void) => {
    setSmokeType(type);
    setSmokeMessage(message);
    setShowSmokeScreen(true);
    setTimeout(() => {
      callback();
      setShowSmokeScreen(false);
    }, 2000);
  };

  const handleStartSearch = () => {
    setIsSearching(true);
    triggerSmokeEffect('match', 'Поиск собеседника...', () => {
      setIsSearching(false);
      setChatSessionActive(true);
      setActiveTab('chat');
      setChatMessages([{
        id: 'welcome',
        sender: 'system',
        text: 'Соединение установлено. Чат анонимен.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    });
  };

  const handleSendMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, newMsg]);
  };

  const handleSendGift = (gift: Gift) => {
    setSentGifts(prev => [...prev, { gift, timestamp: new Date(), sender: 'user' }]);
    setShowGiftModal(false);
    alert(`Подарок ${gift.emoji} ${gift.name} отправлен!`);
  };

  const handleJoinRoom = (room: TopicRoom) => {
    setShowRoomsModal(false);
    handleStartSearch();
  };

  return (
    <div className="fixed inset-0 bg-[#030305] text-white flex flex-col overflow-hidden">
      <SmokeOverlay show={showSmokeScreen} type={smokeType} message={smokeMessage} />

      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5 bg-[#0A0A0B]/90 backdrop-blur-xl z-40 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Room of Secrets
        </h1>
        <div className="bg-white/5 px-4 py-1.5 rounded-2xl flex items-center gap-2">
          <span>⭐</span>
          <span className="font-mono font-bold">{starsBalance}</span>
        </div>
      </div>

      {/* Screens */}
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
            chatTimer={900}
            identityRequestState="none"
            onSendMessage={handleSendMessage}
            onExitChat={() => setActiveTab('lobby')}
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

      {/* Bottom Navigation */}
      {activeTab !== 'chat' && (
        <div className="bg-[#0A0A0B]/95 backdrop-blur-2xl border-t border-white/5 p-3 flex justify-around">
          {[
            { id: 'lobby', label: 'Поиск', icon: '🔮' },
            { id: 'chat', label: 'Чат', icon: '💬' },
            { id: 'reviews', label: 'Отзывы', icon: '🏆' },
            { id: 'profile', label: 'Профиль', icon: '👤' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${activeTab === tab.id ? 'text-purple-400' : 'text-gray-400'}`}
            >
              <span className="text-2xl">{tab.icon}</span>
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Modals */}
      {showRoomsModal && (
        <RoomsModal 
          rooms={TOPIC_ROOMS}
          userKarma={userKarma}
          isRoomPlus={isRoomPlus}
          onClose={() => setShowRoomsModal(false)}
          onJoinRoom={handleJoinRoom}
        />
      )}

      {showGiftModal && (
        <GiftModal 
          gifts={AVAILABLE_GIFTS}
          onClose={() => setShowGiftModal(false)}
          onSendGift={handleSendGift}
        />
      )}

      {showAchievementsModal && (
        <AchievementsModal 
          achievements={achievements}
          onClose={() => setShowAchievementsModal(false)}
        />
      )}

      {showChallengeModal && (
        <ChallengeCompleteModal 
          challenge={dailyChallenge}
          streak={challengeStreak}
          onClose={() => setShowChallengeModal(false)}
        />
      )}
    </div>
  );
}
