import React from 'react';
import { LockKeyhole } from 'lucide-react';

export const ReviewsScreen: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center mb-10">Доска Отзывов</h2>

      <div className="bg-[#1A1A1F] rounded-3xl p-12 text-center border border-purple-500/20">
        <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-cyan-400 mb-4">
          88
        </div>
        <p className="text-xl text-gray-400">Текущая карма</p>
      </div>

      <div className="mt-8 bg-black/40 border border-white/10 rounded-3xl p-10 text-center">
        <LockKeyhole className="mx-auto w-12 h-12 text-gray-500 mb-4" />
        <p className="text-gray-400">Полный список отзывов доступен после разблокировки</p>
        <button className="mt-6 px-8 py-3 bg-purple-600 rounded-2xl font-bold">
          Разблокировать за 30 ⭐
        </button>
      </div>
    </div>
  );
};