
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sender, Message, ChatState, DiaryEntry, ViewMode } from './types';
import { INITIAL_QUESTIONS } from './constants';
import { getMonoResponse, generateDiary } from './services/geminiService';
import MessageBubble from './components/MessageBubble';
import ChatInput from './components/ChatInput';
import Feed from './components/Feed';

const getRandomInitialQuestion = () => {
  const randomIndex = Math.floor(Math.random() * INITIAL_QUESTIONS.length);
  return INITIAL_QUESTIONS[randomIndex];
};

const App: React.FC = () => {
  // --- Global State ---
  const [viewMode, setViewMode] = useState<ViewMode>('feed');
  const [diaries, setDiaries] = useState<DiaryEntry[]>(() => {
    const saved = localStorage.getItem('mononoto-diaries');
    return saved ? JSON.parse(saved) : [];
  });
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // --- Chat State ---
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isTyping: false,
    roundCount: 0,
    isFinished: false
  });

  // --- Scroll Logic for Chat ---
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior
        });
      }
    });
  };

  useEffect(() => {
    if (viewMode === 'chat') {
      scrollToBottom();
    }
  }, [chatState.messages, chatState.isTyping, viewMode]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isNotAtBottom = scrollHeight - scrollTop - clientHeight > 100;
      setShowScrollButton(isNotAtBottom);
    }
  };

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('mononoto-diaries', JSON.stringify(diaries));
  }, [diaries]);

  // --- Handlers ---

  const startNewChat = () => {
    setChatState({
      messages: [{
        id: 'init',
        sender: Sender.MONO,
        text: getRandomInitialQuestion(),
        timestamp: Date.now()
      }],
      isTyping: false,
      roundCount: 0,
      isFinished: false
    });
    setViewMode('chat');
  };

  const handleExitChatRequest = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    setViewMode('feed');
    setShowExitConfirm(false);
  };

  const cancelExit = () => {
    setShowExitConfirm(false);
  };

  const handleUpdateDiary = (id: string, newContent: string) => {
    setDiaries(prev => prev.map(d => d.id === id ? { ...d, content: newContent } : d));
  };

  const handleDeleteRequest = (id: string) => {
    setDeleteTargetId(id);
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      setDiaries(prev => prev.filter(d => d.id !== deleteTargetId));
      setDeleteTargetId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteTargetId(null);
  };

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || chatState.isFinished || chatState.isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: Sender.USER,
      text,
      timestamp: Date.now()
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMsg],
      isTyping: true,
      roundCount: prev.roundCount + 1
    }));

    const delay = Math.min(Math.max(text.length * 50, 1500), 3000);
    
    try {
      if (chatState.roundCount >= 2 && chatState.roundCount < 4) {
        // Intermediate round
        const history = chatState.messages.map(m => ({
          role: m.sender === Sender.USER ? 'user' as const : 'model' as const,
          parts: [{ text: m.text }]
        }));
        history.push({ role: 'user', parts: [{ text }] });

        const monoReply = await getMonoResponse(history);
        
        setTimeout(() => {
            setChatState(prev => ({ 
              ...prev, 
              messages: [...prev.messages, {
                id: `mono-${Date.now()}`,
                sender: Sender.MONO,
                text: monoReply || "무슨 말인지 잘 모르겠어요...",
                timestamp: Date.now()
              }], 
              isTyping: false 
            }));
        }, delay);

      } else if (chatState.roundCount >= 4) {
        // Finishing round
        const finishMsg: Message = {
          id: `mono-finish`,
          sender: Sender.MONO,
          text: "오늘의 대화를 모노노토에 소중히 기록해 드릴게요.",
          timestamp: Date.now()
        };

        setTimeout(async () => {
          setChatState(prev => ({ ...prev, messages: [...prev.messages, finishMsg], isTyping: true }));
          
          const chatString = chatState.messages.concat(userMsg, finishMsg).map(m => `${m.sender}: ${m.text}`).join('\n');
          const diaryResult = await generateDiary(chatString);
          
          if (diaryResult) {
            const newEntry: DiaryEntry = {
              id: crypto.randomUUID(),
              timestamp: Date.now(),
              content: diaryResult.content,
              emotionScore: diaryResult.emotionScore,
              emotionLabel: diaryResult.emotionLabel,
              dotColor: diaryResult.dotColor,
              date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
            };

            setDiaries(prev => [newEntry, ...prev]);
            setViewMode('feed'); // Go back to feed after generation
          } else {
             // Fallback if fails
             setChatState(prev => ({ ...prev, isTyping: false, isFinished: true }));
          }
        }, delay);
      } else {
        // Early round
        const history = chatState.messages.map(m => ({
          role: m.sender === Sender.USER ? 'user' as const : 'model' as const,
          parts: [{ text: m.text }]
        }));
        history.push({ role: 'user', parts: [{ text }] });

        const monoReply = await getMonoResponse(history);
        
        setTimeout(() => {
            setChatState(prev => ({ 
              ...prev, 
              messages: [...prev.messages, {
                id: `mono-${Date.now()}`,
                sender: Sender.MONO,
                text: monoReply || "당신의 이야기가 궁금해요.",
                timestamp: Date.now()
              }], 
              isTyping: false 
            }));
        }, delay);
      }
    } catch (error) {
      console.error(error);
      setChatState(prev => ({ ...prev, isTyping: false }));
    }
  }, [chatState.messages, chatState.roundCount, chatState.isFinished, chatState.isTyping]);

  return (
    <div className="max-w-md mx-auto h-[100dvh] bg-[#fafaf9] flex flex-col shadow-xl relative overflow-hidden">
      {/* Header */}
      <header className="p-4 px-6 flex justify-between items-center border-b border-stone-100 bg-white z-20 shrink-0 h-16">
        <h1 
          className="text-xl font-light tracking-widest text-stone-800 cursor-pointer"
          onClick={() => viewMode === 'chat' && handleExitChatRequest()}
        >
          mononoto
        </h1>
        
        {viewMode === 'chat' && (
           <button 
             type="button"
             onClick={handleExitChatRequest}
             className="w-8 h-8 flex items-center justify-center text-stone-400 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
             aria-label="Exit Chat"
           >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
             </svg>
           </button>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">
        {viewMode === 'feed' ? (
          <Feed 
            diaries={diaries} 
            onUpdate={handleUpdateDiary}
            onDelete={handleDeleteRequest}
            onCreateNew={startNewChat}
          />
        ) : (
          <div className="flex flex-col h-full bg-[#fafaf9]">
            <main 
              className="flex-1 overflow-y-auto p-4 space-y-4" 
              ref={scrollRef}
              onScroll={handleScroll}
            >
              {chatState.messages.map(msg => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {chatState.isTyping && (
                <div className="flex items-center space-x-2 text-stone-400 text-sm animate-pulse px-4 pl-14">
                  <span className="w-2 h-2 bg-stone-200 rounded-full"></span>
                  <span>모노가 입력 중...</span>
                </div>
              )}
              <div className="h-2" />
            </main>

            {/* Scroll Button in Chat */}
            {showScrollButton && !chatState.isFinished && (
              <button
                type="button"
                onClick={() => scrollToBottom('smooth')}
                className="absolute bottom-24 right-6 w-10 h-10 bg-white rounded-full shadow-md border border-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-all z-20 animate-[fadeIn_0.2s_ease-out] cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            )}

            {/* Input Area */}
            {!chatState.isFinished && (
              <div className="p-4 bg-white border-t border-stone-100 z-10 shrink-0">
                <ChatInput onSend={handleSendMessage} disabled={chatState.isTyping} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl transform transition-all animate-[fadeIn_0.2s_ease-out]">
            <h3 className="text-lg font-medium text-stone-800 mb-2">대화를 종료하시겠어요?</h3>
            <p className="text-sm text-stone-500 mb-6">지금 나가시면 작성 중인 내용은 저장되지 않습니다.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelExit}
                className="px-4 py-2 rounded-xl text-sm font-medium text-stone-500 hover:bg-stone-100 transition-colors"
              >
                취소
              </button>
              <button
                onClick={confirmExit}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-stone-800 text-white hover:bg-black transition-colors"
              >
                종료하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl transform transition-all animate-[fadeIn_0.2s_ease-out]">
            <h3 className="text-lg font-medium text-stone-800 mb-2">기록을 삭제하시겠어요?</h3>
            <p className="text-sm text-stone-500 mb-6">삭제된 기록은 다시 복구할 수 없습니다.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-xl text-sm font-medium text-stone-500 hover:bg-stone-100 transition-colors"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-rose-500 text-white hover:bg-rose-600 transition-colors"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
