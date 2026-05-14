import { useState, useEffect } from 'react';
import { Achievement } from '../types';

export const useAchievements = (initialAchievements: Achievement[]) => {
  const [achievements, setAchievements] = useState(initialAchievements);
  const [newUnlock, setNewUnlock] = useState<Achievement | null>(null);

  const checkAchievements = (data: {
    chatsCount?: number;
    userKarma?: number;
    totalReactions?: any;
    sentGiftsCount?: number;
  }) => {
    setAchievements(prev => prev.map(ach => {
      if (ach.unlocked) return ach;

      let progress = ach.progress;
      let shouldUnlock = false;

      switch (ach.id) {
        case 'first-chat':
          progress = data.chatsCount && data.chatsCount > 0 ? 1 : 0;
          break;
        case 'friendly':
          progress = data.totalReactions ? 
            data.totalReactions.fire + data.totalReactions.angel + data.totalReactions.brain : 0;
          break;
        case 'gift-giver':
          progress = data.sentGiftsCount || 0;
          break;
        case 'karma-master':
          progress = data.userKarma || 0;
          break;
      }

      if (progress >= ach.goal) {
        shouldUnlock = true;
      }

      if (shouldUnlock) {
        setTimeout(() => setNewUnlock(ach), 600);
        return { ...ach, unlocked: true, unlockedAt: new Date(), progress: ach.goal };
      }

      return { ...ach, progress };
    }));
  };

  return { achievements, checkAchievements, newUnlock, setNewUnlock };
};