import React from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { StrangerPersona, ChatMessage } from '../../types';

interface ChatScreenProps {
  messages: ChatMessage[];
  selectedStranger: StrangerPersona;
  chatTimer: number;
  identityRequestState: string;
  onSendMessage: (text: string) => void;
  onExitChat: () => void;
  onRevealIdentity: () => void;
  onBurnBridge: () => void;
  onSendGift: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  messages,
  selectedStranger,
  chatTimer,
  identityRequestState,
  onSendMessage,
  onExitChat,
  onRevealIdentity,
  onBurnBridge,
  onSendGift
}) => {
  const [messageInput, setMessageInput] = React.useState('');
  const chatBottomRef = React.useRef<HTMLDivElement>(null);   // ← исправлено

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      onSendMessage(messageInput.trim());
      setMessageInput('');
    }
  };

  const handleSendPhoto = () => {
    alert('Отправка фото будет добавлена позже');
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-[#030305]">
      <ChatHeader
        selectedStranger={selectedStranger}
        identityRequestState={identityRequestState}
        chatTimer={chatTimer}
        formatTime={(sec) => `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`}
        onRevealIdentity={onRevealIdentity}
        onBurnBridge={onBurnBridge}
        onExitChat={onExitChat}
      />

      <ChatMessages
        messages={messages}
        isStrangerTyping={false}
        chatBottomRef={chatBottomRef}
      />

      <ChatInput
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        onSendMessage={handleSend}
        onSendPhoto={handleSendPhoto}
        onSendGift={onSendGift}
      />
    </div>
  );
};
