import React from 'react';
import { Send, ImageIcon } from 'lucide-react';

interface ChatInputProps {
  messageInput: string;
  setMessageInput: (text: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onSendPhoto: () => void;
  onSendGift: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  messageInput,
  setMessageInput,
  onSendMessage,
  onSendPhoto,
  onSendGift
}) => {
  return (
    <div className="p-4 bg-[#0A0A0B]/95 backdrop-blur-xl border-t border-white/5">
      <div className="flex justify-between text-xs text-gray-400 mb-2 px-1">
        <button className="flex items-center gap-1 hover:text-amber-400 transition-colors">
          <span>+15 мин</span>
        </button>
        <button onClick={onSendGift} className="flex items-center gap-1 hover:text-pink-400 transition-colors">
          🎁 Подарок
        </button>
      </div>

      <form onSubmit={onSendMessage} className="flex gap-2">
        <button
          type="button"
          onClick={onSendPhoto}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all"
        >
          <ImageIcon className="w-6 h-6" />
        </button>

        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Напишите сообщение..."
          className="flex-1 bg-zinc-900/70 border border-white/10 rounded-2xl px-5 py-3 focus:outline-none focus:border-purple-500 transition-colors"
        />

        <button
          type="submit"
          className="p-3 bg-gradient-to-br from-purple-600 to-violet-600 rounded-2xl hover:scale-105 active:scale-95 transition-all"
        >
          <Send className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};