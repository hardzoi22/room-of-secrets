import React from 'react';
import { X } from 'lucide-react';
import { TopicRoom } from '../../types';

interface RoomsModalProps {
  rooms: TopicRoom[];
  userKarma: number;
  isRoomPlus: boolean;
  onClose: () => void;
  onJoinRoom: (room: TopicRoom) => void;
}

export const RoomsModal: React.FC<RoomsModalProps> = ({
  rooms,
  userKarma,
  isRoomPlus,
  onClose,
  onJoinRoom
}) => {
  return (
    <div className="absolute inset-0 bg-black/90 z-50 flex flex-col">
      <div className="p-5 border-b border-white/10 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Комнаты по интересам</h2>
        <button onClick={onClose} className="p-2">
          <X className="w-7 h-7" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {rooms.map(room => (
          <div 
            key={room.id}
            className="bg-[#1A1A1F] rounded-3xl p-6 border border-white/5 hover:border-purple-500/30 transition-all"
          >
            <div className="flex justify-between">
              <div className="flex items-start gap-4">
                <span className="text-5xl">{room.emoji}</span>
                <div>
                  <h3 className="font-bold text-xl">{room.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">{room.description}</p>
                </div>
              </div>
              {room.isPremium && <span className="text-amber-400 text-xs font-bold">PREMIUM</span>}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {room.topics.map(t => (
                <span key={t} className="text-xs bg-white/5 px-3 py-1 rounded-full">#{t}</span>
              ))}
            </div>

            <button
              onClick={() => onJoinRoom(room)}
              disabled={userKarma < room.minKarma || (room.isPremium && !isRoomPlus)}
              className="mt-6 w-full py-3.5 rounded-2xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-purple-600 hover:bg-purple-500"
            >
              Войти в комнату
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};