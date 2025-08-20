export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'therapist';
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
}

export interface TherapistPersonality {
  name: string;
  style: string;
  responses: string[];
}