import { useEffect } from 'react';

export const useTelegram = () => {
  const tg = (window as any).Telegram?.WebApp;

  const haptic = {
    light: () => tg?.HapticFeedback?.impactOccurred('light'),
    medium: () => tg?.HapticFeedback?.impactOccurred('medium'),
    heavy: () => tg?.HapticFeedback?.impactOccurred('heavy'),
    success: () => tg?.HapticFeedback?.notificationOccurred('success'),
    error: () => tg?.HapticFeedback?.notificationOccurred('error'),
  };

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#0A0A0B');
      tg.setBackgroundColor('#030305');
      
      if (tg.isVersionAtLeast('6.1')) {
        tg.disableVerticalSwipes();
      }
    }
  }, []);

  return { tg, haptic };
};