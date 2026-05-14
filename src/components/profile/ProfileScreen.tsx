import React from 'react';
import { Award, Crown } from 'lucide-react';

interface ProfileScreenProps {
  userKarma: number;
  chatsCount: number;
  achievements: any[];
  isRoomPlus: boolean;
  onOpenAchievements: () => void;
  onActivateRoomPlus: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userKarma,
  chatsCount,
  achievements,
  isRoomPlus,
  onOpenAchievements,
  onActivateRoomPlus
}) => {
  return (
    <div className="p-6 space-y-8 overflow-y-auto">
      {/* Профиль */}
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl font-bold shadow-xl">
          U
        </div>
        <div>
          <h2 className="text-2xl font-bold">@secret_agent</h2>
          <p className="text-gray-400">Карма: <span className="text-purple-400 font-bold">{userKarma}</span></p>
          <p className="text-gray-400">Диалогов: {chatsCount}</p>
        </div>
      </div>

      {/* Достижения */}
      <div className="bg-[#1A1A1F] rounded-3xl p-6 border border-white/5">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Award className="text-yellow-400" /> Достижения
          </h3>
          <button 
            onClick={onOpenAchievements}
            className="text-purple-400 text-sm hover:text-purple-300 transition-colors"
          >
            Все →
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {achievements.filter(a => a.unlocked).slice(0, 6).map((ach, i) => (
            <div key={i} className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-3xl border border-purple-500/30">
              {ach.icon}
            </div>
          ))}
        </div>
      </div>

      {/* Room+ */}
      <div className="bg-gradient-to-br from-amber-500/10 to-purple-500/10 border border-amber-500/30 rounded-3xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-xl flex items-center gap-2">
              <Crown className="text-amber-400" /> Room+
            </h3>
            <p className="text-sm text-gray-400 mt-1">Безлимит + эксклюзивные функции</p>
          </div>
          <button 
            onClick={onActivateRoomPlus}
            className={`px-6 py-3 rounded-2xl font-bold transition-all ${
              isRoomPlus 
                ? 'bg-red-500/20 text-red-400' 
                : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black'
            }`}
          >
            {isRoomPlus ? 'Активна' : '199 ⭐'}
          </button>
        </div>
      </div>
    </div>
  );
};