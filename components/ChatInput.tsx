
import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to correctly calculate scrollHeight for shrinking
      textareaRef.current.style.height = 'auto';

      if (value === '') {
        // If empty, remove inline height style to let CSS/rows attribute control the height.
        // This prevents 'squashing' issues on initial render or when cleared.
        textareaRef.current.style.height = '';
      } else {
        // Set new height based on scrollHeight, capped at a certain max height (e.g., 120px)
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
      }
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (value.trim() && !disabled) {
      onSend(value);
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={disabled ? "생각하는 중..." : "이야기를 들려주세요."}
        rows={1}
        className="w-full bg-stone-50 border border-stone-200 rounded-[1.5rem] py-4 px-6 pr-12 focus:outline-none focus:border-stone-400 focus:bg-white transition-colors text-sm text-stone-800 disabled:opacity-50 resize-none overflow-hidden leading-relaxed"
        style={{ maxHeight: '120px' }}
      />
      <button
        type="submit"
        disabled={!value.trim() || disabled}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-stone-200 text-stone-500 hover:bg-stone-800 hover:text-white disabled:bg-transparent disabled:text-stone-300 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
        </svg>
      </button>
    </form>
  );
};

export default ChatInput;
