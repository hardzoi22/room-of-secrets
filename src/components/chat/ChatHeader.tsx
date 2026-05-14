import React from 'react';
import { X, Flame, User } from 'lucide-react';
import { StrangerPersona } from '../../types';

interface ChatHeaderProps {
  selectedStranger: StrangerPersona;
  identityRequestState: string;
  chatTimer: number;
  formatTime: (sec: number) => string;
  onRevealIdentity: () => void;
  onBurnBridge: () => void;
  onExitChat: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedStranger,
  identityRequestState,
  chatTimer,
  formatTime,
  onRevealIdentity,
  onBurnBridge,
  onExitChat
}) => {
  return (
    <div className="bg-[#0A0A0B]/95 backdrop-blur-xl px-5 py-4 border-b border-white/5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${identityRequestState === 'accepted' ? selectedStranger.avatarColor : 'from-zinc-700 to-zinc-800'} flex items-center justify-center text-2xl font-bold shadow-inner`}>
          {identityRequestState === 'accepted' ? selectedStranger.name[0] : '❓'}
        </div>
        <div>
          <p className="font-semibold">
            {identityRequestState === 'accepted' ? selectedStranger.name : `Незнакомец ${selectedStranger.tag}`}
          </p>
          <p className="text-xs text-purple-400 font-mono">⏳ {formatTime(chatTimer)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onRevealIdentity} className="p-3 hover:bg-white/5 rounded-xl transition-colors">
          <User className="w-5 h-5" />
        </button>
        <button onClick={onBurnBridge} className="p-3 hover:bg-red-500/10 text-red-400 rounded-xl transition-colors">
          <Flame className="w-5 h-5" />
        </button>
        <button onClick={onExitChat} className="p-3 hover:bg-white/5 rounded-xl transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};