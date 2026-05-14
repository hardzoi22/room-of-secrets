import React from 'react';
import { X, Coins } from 'lucide-react';
import { Gift } from '../../types';

interface GiftModalProps {
  gifts: Gift[];
  onClose: () => void;
  onSendGift: (gift: Gift) => void;
}

export const GiftModal: React.FC<GiftModalProps> = ({ gifts, onClose, onSendGift }) => {
  return (
    <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1A1A1F] w-full max-w-md rounded-3xl p-6 border border-purple-500/20">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Отправить подарок</h3>
          <button onClick={onClose}><X className="w-6 h-6" /></button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {gifts.map(gift => (
            <button
              key={gift.id}
              onClick={() => onSendGift(gift)}
              className="bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-2xl p-5 transition-all hover:scale-105 active:scale-95 text-left"
            >
              <div className="text-6xl mb-3">{gift.emoji}</div>
              <div className="font-bold">{gift.name}</div>
              <div className="text-xs text-gray-400">+{gift.karmaBonus} кармы</div>
              <div className="flex items-center gap-1 text-amber-400 mt-3 text-sm font-bold">
                <Coins className="w-4 h-4" /> {gift.cost}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};