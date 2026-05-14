import React from 'react';
import { ChatMessage } from '../../types';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isStrangerTyping: boolean;
  chatBottomRef: React.RefObject<HTMLDivElement>;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isStrangerTyping,
  chatBottomRef
}) => {
  return (
    <div className="flex-1 p-5 space-y-4 overflow-y-auto custom-chat-scroll bg-[#050507]">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
          {msg.sender === 'system' ? (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 text-gray-300 text-sm px-6 py-4 rounded-3xl max-w-[85%] mx-auto text-center">
              {msg.text}
            </div>
          ) : msg.type === 'media' ? (
            <div className="max-w-[75%] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <img src={msg.text} alt="media" className="rounded-3xl" />
            </div>
          ) : (
            <div className={`max-w-[78%] px-5 py-3.5 rounded-3xl text-[17px] leading-relaxed shadow-lg
              ${msg.sender === 'user' 
                ? 'bg-gradient-to-br from-purple-600 to-violet-600 text-white rounded-tr-none' 
                : 'bg-zinc-800/90 backdrop-blur-md border border-white/10 text-gray-100 rounded-tl-none'
              }`}>
              <p>{msg.text}</p>
              <span className="block text-[10px] mt-2 opacity-60 text-right">{msg.time}</span>
            </div>
          )}
        </div>
      ))}

      {isStrangerTyping && (
        <div className="flex justify-start">
          <div className="bg-zinc-800/80 backdrop-blur-md px-6 py-3 rounded-3xl text-sm text-gray-400">
            печатает...
          </div>
        </div>
      )}

      <div ref={chatBottomRef} />
    </div>
  );
};