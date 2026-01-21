
import React from 'react';
import { Message, Sender } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MonoAvatar = () => (
  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-white border border-stone-100 flex items-center justify-center overflow-hidden shadow-sm mt-0.5">
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="w-6 h-6 text-stone-600"
    >
        <path d="M30 40 C 25 25, 35 20, 40 30" />
        <path d="M70 40 C 75 25, 65 20, 60 30" />
        <path d="M32 42 C 32 42, 25 70, 35 80 C 45 90, 55 90, 65 80 C 75 70, 68 42, 68 42" />
        <path d="M42 55 L42 56" strokeWidth="6" />
        <path d="M58 55 L58 56" strokeWidth="6" />
        <path d="M48 68 Q 50 70, 52 68" />
    </svg>
  </div>
);

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isMono = message.sender === Sender.MONO;

  return (
    <div className={`flex w-full ${isMono ? 'justify-start items-start gap-3' : 'justify-end'} message-fade-in`}>
      {isMono && <MonoAvatar />}
      <div 
        className={`max-w-[75%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
          isMono 
            ? 'bg-white text-stone-700 border border-stone-100 shadow-sm rounded-tl-none' 
            : 'bg-stone-800 text-stone-50 rounded-br-none'
        }`}
      >
        {message.text}
      </div>
    </div>
  );
};

export default MessageBubble;
