import React from 'react';
import { Flame, Coins } from 'lucide-react';

interface ChallengeCompleteModalProps {
  challenge: any;
  streak: number;
  onClose: () => void;
}

export const ChallengeCompleteModal: React.FC<ChallengeCompleteModalProps> = ({
  challenge,
  streak,
  onClose
}) => {
  return (
    <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-5">
      <div className="bg-gradient-to-br from-purple-900/80 to-indigo-900/80 backdrop-blur-2xl rounded-3xl p-8 text-center max-w-sm w-full border border-purple-400/30">
        <div className="text-6xl mb-6 animate-bounce">{challenge?.task.emoji}</div>
        
        <h2 className="text-3xl font-bold mb-2">Челлендж выполнен!</h2>
        <p className="text-gray-300 mb-8">{challenge?.task.description}</p>

        <div className="bg-black/30 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-center gap-3 text-3xl text-amber-400 mb-2">
            <Coins className="w-8 h-8" />
            <span>+{challenge?.reward.stars}</span>
          </div>
          <p className="text-emerald-400">+{challenge?.reward.karma} кармы</p>
        </div>

        {streak > 1 && (
          <div className="flex items-center justify-center gap-2 text-orange-400 mb-8">
            <Flame className="w-6 h-6" />
            <span className="font-bold text-xl">Серия: {streak} дней!</span>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all"
        >
          Продолжить
        </button>
      </div>
    </div>
  );
};
