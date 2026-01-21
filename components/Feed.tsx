
import React from 'react';
import { DiaryEntry } from '../types';
import FeedItem from './FeedItem';

interface FeedProps {
  diaries: DiaryEntry[];
  onUpdate: (id: string, newContent: string) => void;
  onDelete: (id: string) => void;
  onCreateNew: () => void;
}

const Feed: React.FC<FeedProps> = ({ diaries, onUpdate, onDelete, onCreateNew }) => {
  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Feed List */}
      <div className="flex-1 overflow-y-auto">
        {diaries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-stone-400 space-y-4 p-8 text-center animate-[fadeIn_0.5s_ease-out]">
            <div className="w-16 h-16 rounded-full bg-stone-50 flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8 text-stone-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </div>
            <p className="font-light text-sm">아직 기록된 이야기가 없어요.<br/>오늘 하루는 어땠나요?</p>
          </div>
        ) : (
          <div className="pb-20">
             {diaries.map(diary => (
               <FeedItem 
                 key={diary.id} 
                 entry={diary} 
                 onUpdate={onUpdate} 
                 onDelete={onDelete} 
               />
             ))}
             
             {/* End of Feed Indicator */}
             <div className="py-8 flex justify-center text-stone-300">
                <span className="w-1 h-1 rounded-full bg-stone-300 mx-1"></span>
                <span className="w-1 h-1 rounded-full bg-stone-300 mx-1"></span>
                <span className="w-1 h-1 rounded-full bg-stone-300 mx-1"></span>
             </div>
          </div>
        )}
      </div>

      {/* Floating Action Button for New Chat */}
      <button
        onClick={onCreateNew}
        className="absolute bottom-6 right-6 w-14 h-14 bg-stone-900 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 hover:bg-black transition-all duration-300 z-30"
        aria-label="New Note"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    </div>
  );
};

export default Feed;
