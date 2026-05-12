import React, { useState, useRef, useEffect } from 'react';
import {
  Clock, User, Flame, X, Lock, CheckCircle2,
  ImageIcon, Volume2, Send, Info, Shield
} from 'lucide-react';
import { useApp } from '@/store';
import { formatTime } from '@/utils/time';

export default function ChatPage() {
  const {
    chatMessages, isStrangerTyping, chatTimer, selectedStranger,
    identityRequestState, mediaUnblocked, isRoomPlus,
    sendMessage, revealIdentity, burnBridge, exitChat, extendChat, unlockMedia
  } = useApp();

  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [chatMessages, isStrangerTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    sendMessage(messageInput);
    setMessageInput('');
  };

  const handleSendPhoto = () => {
    if (!mediaUnblocked && !isRoomPlus) {
      unlockMedia();
      return;
    }
    sendMessage('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80', 'media');
  };

  const handleSendVoice = () => {
    if (!mediaUnblocked && !isRoomPlus) {
      unlockMedia();
      return;
    }
    sendMessage('🎙️ Голосовое сообщение (0:12)', 'voice');
  };

  const isTimerLow = chatTimer < 300;
  const isTimerCritical = chatTimer < 60;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* === TOP HEADER (always fixed at top) === */}
      <div className="shrink-0 bg-[#101012] px-3.5 py-2.5 border-b border-white/[0.05] flex items-center justify-between z-10">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="relative shrink-0">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${identityRequestState === 'accepted' ? selectedStranger.avatarColor : 'from-purple-800 to-indigo-950'} flex items-center justify-center overflow-hidden border border-white/[0.1]`}>
              {identityRequestState === 'accepted' ? (
                <span className="text-xs font-bold text-white">{selectedStranger.name[0]}</span>
              ) : (
                <Shield className="w-4 h-4 text-purple-300" />
              )}
            </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-[#101012]" />
          </div>

          <div className="min-w-0 overflow-hidden">
            <div className="flex items-center space-x-1">
              <span className="text-xs font-extrabold text-white truncate block">
                {identityRequestState === 'accepted' ? selectedStranger.name : `Незнакомец ${selectedStranger.tag}`}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-[9px]">
              <Clock className={`w-2.5 h-2.5 shrink-0 ${isTimerCritical ? 'text-red-400 animate-pulse' : isTimerLow ? 'text-amber-400' : 'text-purple-400'}`} />
              <span className={`truncate ${isTimerCritical ? 'text-red-400 font-bold' : isTimerLow ? 'text-amber-400' : 'text-gray-400'}`}>
                {formatTime(chatTimer)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          <button
            onClick={revealIdentity}
            disabled={identityRequestState === 'accepted'}
            className={`p-1.5 rounded-lg border transition flex items-center space-x-1 shrink-0 ${
              identityRequestState === 'accepted'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : identityRequestState === 'sent'
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse'
                : 'bg-purple-500/10 border-purple-500/20 text-purple-300 hover:bg-purple-500/20'
            }`}
          >
            <User className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[10px] font-bold whitespace-nowrap">
              {identityRequestState === 'accepted' ? 'Раскрыт' : identityRequestState === 'sent' ? 'Ждём...' : '50 ⭐'}
            </span>
          </button>
          <button
            onClick={burnBridge}
            className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all shrink-0"
            aria-label="Сжечь мост"
          >
            <Flame className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => exitChat(false)}
            className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-gray-400 hover:text-white transition-all shrink-0"
            aria-label="Выйти из чата"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* === SCROLLABLE MESSAGES AREA (flex-1, takes all available space) === */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 space-y-3 flex flex-col bg-noise bg-[#08080a] min-h-0 custom-chat-scroll"
      >
        {chatMessages.map((msg) => {
          if (msg.sender === 'system') {
            return (
              <div key={msg.id} className="shrink-0 bg-white/[0.02] border border-white/[0.05] p-2.5 rounded-2xl text-center text-[10px] text-gray-400 leading-snug space-y-1 mx-2">
                <Info className="w-4 h-4 text-purple-400 mx-auto" />
                <p>{msg.text}</p>
              </div>
            );
          }

          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} className={`shrink-0 flex flex-col max-w-[80%] ${isUser ? 'self-end items-end' : 'self-start items-start'}`}>
              <span className="text-[9px] text-gray-500 mb-0.5 px-1">
                {isUser ? 'Вы' : (identityRequestState === 'accepted' ? selectedStranger.name : `Незнакомец ${selectedStranger.tag}`)}
              </span>

              <div className={`p-2.5 rounded-2xl text-xs relative overflow-hidden ${
                isUser
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none'
                  : 'bg-[#1C1C1F] text-gray-200 rounded-tl-none border border-white/[0.03]'
              }`}>
                {msg.type === 'media' ? (
                  <div className="space-y-1.5">
                    <img src={msg.text} alt="Media" className="rounded-lg max-h-36 object-cover w-full opacity-90" loading="lazy" />
                    <span className="text-[9px] text-white/50 block text-right">{msg.time}</span>
                  </div>
                ) : msg.type === 'voice' ? (
                  <div className="flex items-center space-x-2 py-1">
                    <Volume2 className="w-4 h-4 text-purple-300 animate-pulse" />
                    <span className="font-mono text-[10px] text-white font-medium">{msg.text}</span>
                  </div>
                ) : (
                  <>
                    <p className="leading-snug break-words">{msg.text}</p>
                    <span className={`text-[8px] mt-1 block text-right ${isUser ? 'text-white/60' : 'text-gray-500'}`}>{msg.time}</span>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {isStrangerTyping && (
          <div className="shrink-0 self-start flex flex-col items-start max-w-[80%]">
            <span className="text-[9px] text-gray-500 mb-0.5 px-1">Незнакомец {selectedStranger.tag}</span>
            <div className="bg-[#1C1C1F] p-2.5 rounded-2xl rounded-tl-none text-xs text-gray-400 flex items-center space-x-1.5 border border-white/[0.03]">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="shrink-0 h-0" />
      </div>

      {/* === BOTTOM AREA (always fixed at bottom) === */}
      <div className="shrink-0">
        {/* Media Bar */}
        <div className="bg-[#101012]/80 border-t border-white/[0.04] p-2 flex items-center justify-between space-x-1.5">
          <button
            onClick={unlockMedia}
            className={`px-2 py-1 rounded-lg text-[10px] flex items-center space-x-1 border transition-all shrink-0 ${
              mediaUnblocked || isRoomPlus
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-[#1C1C1F] border-white/[0.05] text-[#00E5FF] hover:border-cyan-400/30'
            }`}
          >
            {mediaUnblocked || isRoomPlus ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Медиа: ОК</span>
              </>
            ) : (
              <>
                <Lock className="w-3 h-3 text-cyan-400 shrink-0" />
                <span>Медиа за 10 ⭐</span>
              </>
            )}
          </button>

          <button
            onClick={extendChat}
            className="px-2 py-1 rounded-lg bg-[#1C1C1F] border border-white/[0.05] text-amber-300 hover:border-amber-300/30 text-[10px] flex items-center space-x-1 transition-all shrink-0"
          >
            <Clock className="w-3 h-3 text-amber-400 shrink-0" />
            <span>⏰ +15м (15 ⭐)</span>
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-[#0A0A0B] p-2.5 border-t border-white/[0.05] flex items-center space-x-2">
          <button
            type="button"
            onClick={handleSendPhoto}
            className={`p-2 rounded-xl transition shrink-0 ${
              mediaUnblocked || isRoomPlus
                ? 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20'
                : 'bg-[#1C1C1F] text-gray-500 hover:text-gray-300'
            }`}
            aria-label="Отправить фото"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleSendVoice}
            className={`p-2 rounded-xl transition shrink-0 ${
              mediaUnblocked || isRoomPlus
                ? 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20'
                : 'bg-[#1C1C1F] text-gray-500 hover:text-gray-300'
            }`}
            aria-label="Отправить голосовое"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder={isStrangerTyping ? 'Печатает ответ...' : 'Напишите сообщение...'}
            className="flex-1 min-w-0 bg-[#1C1C1F] border border-white/[0.05] text-xs text-white rounded-xl py-2 px-3 placeholder-gray-500 focus:outline-none focus:border-purple-400 transition"
          />

          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:opacity-90 active:scale-95 transition flex items-center justify-center shadow-glow-purple disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            aria-label="Отправить"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
