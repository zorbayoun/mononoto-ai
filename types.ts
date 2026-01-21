
export enum Sender {
  USER = 'user',
  MONO = 'mono'
}

export interface Message {
  id: string;
  sender: Sender;
  text: string;
  timestamp: number;
}

export interface DiaryEntry {
  id: string; // Unique ID
  timestamp: number; // Sortable timestamp
  content: string;
  emotionScore: number; // 0 to 100
  emotionLabel: string;
  dotColor: string;
  date: string; // Display string
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  roundCount: number;
  isFinished: boolean;
}

export type ViewMode = 'feed' | 'chat';
