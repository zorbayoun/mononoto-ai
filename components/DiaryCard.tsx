
import React from 'react';
import { DiaryEntry } from '../types';

interface DiaryCardProps {
  diary: DiaryEntry;
}

const DiaryCard: React.FC<DiaryCardProps> = ({ diary }) => {
  return (
    <div className="p-8 flex flex-col items-center message-fade-in space-y-12">
      <div className="relative flex flex-col items-center">
        {/* The Emotion Dot */}
        <div 
          className="w-32 h-32 rounded-full relative z-10 transition-transform duration-1000 animate-[pulse_4s_infinite]"
          style={{ 
            background: `radial-gradient(circle at 30% 30%, white, ${diary.dotColor})`,
            boxShadow: `0 20px 50px -10px ${diary.dotColor}88`
          }}
        >
          <div 
            className="absolute inset-0 rounded-full dot-glow"
            style={{ backgroundColor: diary.dotColor }}
          ></div>
        </div>
        <p className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-stone-400">
          Emotion: {diary.emotionLabel}
        </p>
      </div>

      <div className="w-full bg-white rounded-3xl p-8 shadow-sm border border-stone-100 space-y-6">
        <div className="flex justify-between items-center border-b border-stone-50 pb-4">
          <span className="text-stone-300 text-xs tracking-widest">{diary.date}</span>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: diary.dotColor }}></span>
        </div>
        
        <p className="text-stone-700 leading-[1.8] text-[0.95rem] font-light italic whitespace-pre-wrap">
          {diary.content}
        </p>
        
        <div className="pt-4 flex justify-center">
          <span className="text-stone-200 text-sm">🐾</span>
        </div>
      </div>
    </div>
  );
};

export default DiaryCard;
