
import React, { useState, useRef, useEffect } from 'react';
import { DiaryEntry } from '../types';

interface FeedItemProps {
  entry: DiaryEntry;
  onUpdate: (id: string, newContent: string) => void;
  onDelete: (id: string) => void;
}

const FeedItem: React.FC<FeedItemProps> = ({ entry, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(entry.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editValue.trim()) {
      onUpdate(entry.id, editValue);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(entry.content);
    setIsEditing(false);
  };

  return (
    <div className="flex gap-4 p-5 border-b border-stone-100 hover:bg-stone-50 transition-colors group animate-[fadeIn_0.3s_ease-out]">
      {/* Avatar / Emotion Dot area */}
      <div className="flex-shrink-0 flex flex-col items-center gap-2 pt-1">
        <div 
          className="w-10 h-10 rounded-full shadow-sm relative overflow-hidden"
          style={{ 
            background: `radial-gradient(circle at 30% 30%, white, ${entry.dotColor})`,
          }}
        >
          <div className="absolute inset-0 bg-white/20"></div>
        </div>
        <div className="h-full w-0.5 bg-stone-100 rounded-full group-last:hidden min-h-[20px]"></div>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-stone-900 text-sm">mononoto</span>
            <span className="text-stone-400 text-xs flex items-center gap-1">
              <span>·</span>
              {entry.date}
            </span>
          </div>
          
          {/* Actions Dropdown/Buttons */}
          {!isEditing && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-200 rounded-full transition-colors"
                title="Edit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
              </button>
              <button 
                onClick={() => onDelete(entry.id)}
                className="p-1.5 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
                title="Delete"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Text Content */}
        {isEditing ? (
          <div className="mt-1">
            <textarea
              ref={textareaRef}
              value={editValue}
              onChange={(e) => {
                setEditValue(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              className="w-full bg-stone-50 p-3 rounded-xl text-stone-800 text-[0.95rem] leading-relaxed border border-stone-200 focus:outline-none focus:border-stone-400 resize-none overflow-hidden"
              rows={1}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button 
                onClick={handleCancel}
                className="px-3 py-1.5 text-xs font-medium text-stone-500 hover:bg-stone-100 rounded-full transition-colors"
              >
                취소
              </button>
              <button 
                onClick={handleSave}
                className="px-3 py-1.5 text-xs font-medium bg-stone-800 text-white rounded-full hover:bg-black transition-colors"
              >
                완료
              </button>
            </div>
          </div>
        ) : (
          <p className="text-stone-800 text-[0.95rem] leading-relaxed whitespace-pre-wrap font-light">
            {entry.content}
          </p>
        )}
        
        {/* Footer info (Emotion Label) */}
        {!isEditing && (
          <div className="mt-3 flex items-center">
            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-500 tracking-wide uppercase">
              {entry.emotionLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedItem;
