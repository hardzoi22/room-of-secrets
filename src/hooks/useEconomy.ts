// src/hooks/useEconomy.ts
import { useState, useCallback } from 'react';
import { CONFIG } from '../constants/config';

interface UseEconomyProps {
  initialStars?: number;
  initialKarma?: number;
  isRoomPlus?: boolean;
}

export function useEconomy({ 
  initialStars = 150, 
  initialKarma = 88, 
  isRoomPlus = false 
}: UseEconomyProps = {}) {
  const [starsBalance, setStarsBalance] = useState(initialStars);
  const [userKarma, setUserKarma] = useState(initialKarma);
  const [subscription, setIsRoomPlus] = useState(isRoomPlus);

  const spendStars = useCallback((
    amount: number, 
    purpose: string, 
    onSuccess: () => void,
    onError?: (error: string) => void
  ) => {
    if (starsBalance < amount) {
      onError?.(`Недостаточно Stars! Нужно ${amount}, баланс: ${starsBalance}`);
      return false;
    }
    setStarsBalance(prev => prev - amount);
    onSuccess();
    return true;
  }, [starsBalance]);

  const addKarma = useCallback((amount: number) => {
    setUserKarma(prev => Math.min(CONFIG.MAX_KARMA, prev + amount));
  }, []);

  const addStars = useCallback((amount: number) => {
    setStarsBalance(prev => prev + amount);
  }, []);

  const toggleRoomPlus = useCallback(() => {
    if (subscription) {
      setIsRoomPlus(false);
      return true;
    }
    return spendStars(
      CONFIG.COST_ROOM_PLUS, 
      'Room+ подписка', 
      () => setIsRoomPlus(true)
    );
  }, [subscription, spendStars]);

  return {
    starsBalance,
    userKarma,
    isRoomPlus: subscription,
    spendStars,
    addKarma,
    addStars,
    toggleRoomPlus,
  };
}