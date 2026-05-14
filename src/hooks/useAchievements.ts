// src/hooks/useAchievements.ts
import { useState, useEffect, useCallback } from 'react';
import { Achievement } from '../types';
import { ACHIEVEMENTS_LIST } from '../data/achievements';

interface UseAchievementsProps {
  chatsCount: number;
  totalReactions: { fire: number; angel: number; brain: number; toxic: number };
  userKarma: number;
  sentGiftsCount: number;
  chatSessionActive: boolean;
}

export function useAchievements({
  chatsCount,
  totalReactions,
  userKarma,
  sentGiftsCount,
  chatSessionActive,
}: UseAchievementsProps) {
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS_LIST);
  const [newUnlocked, setNewUnlocked] = useState<Achievement | null>(null);

  const checkProgress = useCallback((achievement: Achievement, props: UseAchievementsProps) => {
    const hour = new Date().getHours();
    
    switch (achievement.id) {
      case 'first-chat': return props.chatsCount > 0 ? 1 : 0;
      case 'friendly': return props.totalReactions.fire + props.totalReactions.angel + props.totalReactions.brain;
      case 'night-owl': return (hour >= 3 && hour < 5 && props.chatSessionActive) ? 1 : 0;
      case 'gift-giver': return props.sentGiftsCount;
      case 'karma-master': return props.userKarma;
      case 'chat-legend': return props.chatsCount;
      default: return achievement.progress;
    }
  }, []);

  const checkAll = useCallback(() => {
    const props = { chatsCount, totalReactions, userKarma, sentGiftsCount, chatSessionActive };
    
    setAchievements(prev => prev.map(achievement => {
      if (achievement.unlocked) return achievement;
      
      const newProgress = checkProgress(achievement, props);
      
      if (newProgress >= achievement.goal && !achievement.secret) {
        // 🔔 Уведомление о новом достижении
        setTimeout(() => {
          setNewUnlocked(achievement);
          setTimeout(() => setNewUnlocked(null), 5000);
        }, 100);
        
        return {
          ...achievement,
          unlocked: true,
          unlockedAt: new Date(),
          progress: achievement.goal,
        };
      }
      
      return { ...achievement, progress: newProgress };
    }));
  }, [chatsCount, totalReactions, userKarma, sentGiftsCount, chatSessionActive, checkProgress]);

  // Авто-проверка при изменении зависимостей
  useEffect(() => {
    checkAll();
  }, [checkAll]);

  return {
    achievements,
    newUnlocked,
    checkAll,
    unlockedCount: achievements.filter(a => a.unlocked).length,
  };
}