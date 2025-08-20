export type MoodState = 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive';

export type EmotionType = 
  | 'anxiety'
  | 'depression'
  | 'anger'
  | 'joy'
  | 'fear'
  | 'sadness'
  | 'excitement'
  | 'calm';

export interface MoodEntry {
  timestamp: number;
  mood: MoodState;
  emotions: EmotionType[];
  intensity: number;
}

export interface SessionProgress {
  sessionId: string;
  startTime: number;
  endTime: number | null;
  messageCount: number;
  moodEntries: MoodEntry[];
  score: number;
  objectives: GameObjective[];
}

export interface GameObjective {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  progress: number;
  maxProgress: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt: number | null;
  icon: string;
}

export interface PlayerStats {
  totalSessions: number;
  totalMessages: number;
  averageMood: number;
  streakDays: number;
  achievements: Achievement[];
  level: number;
  experience: number;
}