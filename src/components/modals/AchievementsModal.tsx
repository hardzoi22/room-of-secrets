import React from 'react';
import { X, Check } from 'lucide-react';
import { Achievement } from '../../types';
import { getRarityColor, getRarityGlow } from '../../utils/helpers';

interface AchievementsModalProps {
  achievements: Achievement[];
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ achievements, onClose }) => {
  return (
    <div className="absolute inset-0 bg-black/95 z-50 overflow-y-auto p-5">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8 sticky top-0 bg-[#030305] py-4 z-10">
          <div>
            <h2 className="text-3xl font-bold">Достижения</h2>
            <p className="text-gray-400">
              {achievements.filter(a => a.unlocked).length} / {achievements.length} разблокировано
            </p>
          </div>
          <button onClick={onClose} className="p-3">
            <X className="w-7 h-7" />
          </button>
        </div>

        <div className="space-y-4">
          {achievements.map(achievement => {
            const isUnlocked = achievement.unlocked;
            const isSecret = achievement.secret && !isUnlocked;

            return (
              <div
                key={achievement.id}
                className={`bg-[#1A1A1F] rounded-3xl p-6 border transition-all ${
                  isUnlocked ? getRarityGlow(achievement.rarity) : 'border-white/5 opacity-70'
                }`}
              >
                <div className="flex gap-5">
                  <div className={`text-5xl ${isSecret ? 'blur-md' : ''}`}>
                    {isSecret ? '❓' : achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className={`font-bold text-xl ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                        {isSecret ? 'Секретное достижение' : achievement.name}
                      </h3>
                      <span className={`text-xs px-3 py-1 rounded-full ${getRarityColor(achievement.rarity)}`}>
                        {achievement.rarity.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-gray-400 mt-2">
                      {isSecret ? 'Откроется при выполнении...' : achievement.description}
                    </p>

                    {!isUnlocked && !isSecret && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1 text-gray-500">
                          <span>Прогресс</span>
                          <span>{achievement.progress} / {achievement.goal}</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-700"
                            style={{ width: `${(achievement.progress / achievement.goal) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {isUnlocked && achievement.unlockedAt && (
                      <div className="text-emerald-400 text-sm mt-3 flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        Разблокировано {new Date(achievement.unlockedAt).toLocaleDateString('ru-RU')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
