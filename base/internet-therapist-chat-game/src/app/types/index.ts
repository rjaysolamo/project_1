export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'therapist';
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
}

// Re-export types from other modules
export * from './therapist';
export * from './game';