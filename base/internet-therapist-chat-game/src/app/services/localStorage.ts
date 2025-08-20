import { Message } from '../types';
import { PlayerStats, SessionProgress } from '../types/game';
interface UserPreferences {
  therapistPersonality: string;
  responseStyle: string;
  sessionLength: number;
  reminderEnabled: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  language: string;
  theme: string;
}

// Storage keys
const STORAGE_KEYS = {
  CONVERSATION_HISTORY: 'therapist_conversation_history',
  USER_PREFERENCES: 'therapist_user_preferences',
  SESSION_DATA: 'therapist_session_data',
  PLAYER_STATS: 'therapist_player_stats',
  PRIVACY_SETTINGS: 'therapist_privacy_settings'
} as const;

// Conversation history interface
interface ConversationSession {
  id: string;
  messages: Message[];
  startTime: Date;
  endTime?: Date;
  sessionType: 'therapy' | 'casual' | 'crisis';
  mood?: string;
  notes?: string;
}

// Privacy settings interface
interface PrivacySettings {
  dataCollection: boolean;
  analytics: boolean;
  crashReporting: boolean;
  personalizedContent: boolean;
  exportEnabled: boolean;
  retentionDays: number;
}

// Default privacy settings
const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  dataCollection: true,
  analytics: false,
  crashReporting: true,
  personalizedContent: true,
  exportEnabled: true,
  retentionDays: 30
};

// Default user preferences
const DEFAULT_USER_PREFERENCES: UserPreferences = {
  therapistPersonality: 'empathetic',
  responseStyle: 'supportive',
  sessionLength: 30,
  reminderEnabled: true,
  soundEnabled: true,
  notificationsEnabled: true,
  language: 'en',
  theme: 'light'
};

// Storage utility class
class LocalStorageService {
  private isClient(): boolean {
    return typeof window !== 'undefined';
  }

  private getItem<T>(key: string, defaultValue: T): T {
    if (!this.isClient()) return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      
      const parsed = JSON.parse(item);
      // Handle date parsing for conversation sessions
      if (key === STORAGE_KEYS.CONVERSATION_HISTORY && Array.isArray(parsed)) {
        return parsed.map((session: any) => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: session.endTime ? new Date(session.endTime) : undefined,
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        })) as T;
      }
      
      return parsed;
    } catch (error) {
      console.error(`Error reading from localStorage key ${key}:`, error);
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): boolean {
    if (!this.isClient()) return false;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage key ${key}:`, error);
      return false;
    }
  }

  private removeItem(key: string): boolean {
    if (!this.isClient()) return false;
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key ${key}:`, error);
      return false;
    }
  }

  // Conversation history methods
  getConversationHistory(): ConversationSession[] {
    return this.getItem(STORAGE_KEYS.CONVERSATION_HISTORY, []);
  }

  saveConversationSession(session: ConversationSession): boolean {
    const history = this.getConversationHistory();
    const existingIndex = history.findIndex(s => s.id === session.id);
    
    if (existingIndex >= 0) {
      history[existingIndex] = session;
    } else {
      history.push(session);
    }
    
    // Keep only recent sessions based on privacy settings
    const privacySettings = this.getPrivacySettings();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - privacySettings.retentionDays);
    
    const filteredHistory = history.filter(s => s.startTime > cutoffDate);
    
    return this.setItem(STORAGE_KEYS.CONVERSATION_HISTORY, filteredHistory);
  }

  deleteConversationSession(sessionId: string): boolean {
    const history = this.getConversationHistory();
    const filteredHistory = history.filter(s => s.id !== sessionId);
    return this.setItem(STORAGE_KEYS.CONVERSATION_HISTORY, filteredHistory);
  }

  clearConversationHistory(): boolean {
    return this.removeItem(STORAGE_KEYS.CONVERSATION_HISTORY);
  }

  // User preferences methods
  getUserPreferences(): UserPreferences {
    return this.getItem(STORAGE_KEYS.USER_PREFERENCES, DEFAULT_USER_PREFERENCES);
  }

  saveUserPreferences(preferences: Partial<UserPreferences>): boolean {
    const current = this.getUserPreferences();
    const updated = { ...current, ...preferences };
    return this.setItem(STORAGE_KEYS.USER_PREFERENCES, updated);
  }

  resetUserPreferences(): boolean {
    return this.setItem(STORAGE_KEYS.USER_PREFERENCES, DEFAULT_USER_PREFERENCES);
  }

  // Session data methods
  getCurrentSession(): ConversationSession | null {
    return this.getItem(STORAGE_KEYS.SESSION_DATA, null);
  }

  saveCurrentSession(session: ConversationSession): boolean {
    return this.setItem(STORAGE_KEYS.SESSION_DATA, session);
  }

  clearCurrentSession(): boolean {
    return this.removeItem(STORAGE_KEYS.SESSION_DATA);
  }

  // Player stats methods
  getPlayerStats(): PlayerStats {
    return this.getItem(STORAGE_KEYS.PLAYER_STATS, {
      level: 1,
      experience: 0,
      totalSessions: 0,
      totalMessages: 0,
      averageMood: 0,
      streakDays: 0,
      achievements: []
    });
  }

  savePlayerStats(stats: PlayerStats): boolean {
    return this.setItem(STORAGE_KEYS.PLAYER_STATS, stats);
  }

  // Privacy settings methods
  getPrivacySettings(): PrivacySettings {
    return this.getItem(STORAGE_KEYS.PRIVACY_SETTINGS, DEFAULT_PRIVACY_SETTINGS);
  }

  savePrivacySettings(settings: Partial<PrivacySettings>): boolean {
    const current = this.getPrivacySettings();
    const updated = { ...current, ...settings };
    return this.setItem(STORAGE_KEYS.PRIVACY_SETTINGS, updated);
  }

  // Export functionality
  exportAllData(): string {
    const data = {
      conversationHistory: this.getConversationHistory(),
      userPreferences: this.getUserPreferences(),
      playerStats: this.getPlayerStats(),
      privacySettings: this.getPrivacySettings(),
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    
    return JSON.stringify(data, null, 2);
  }

  exportConversationsAsCSV(): string {
    const history = this.getConversationHistory();
    const csvRows = ['Session ID,Start Time,End Time,Message Count,Session Type,Mood'];
    
    history.forEach(session => {
      const row = [
        session.id,
        session.startTime.toISOString(),
        session.endTime?.toISOString() || '',
        session.messages.length.toString(),
        session.sessionType,
        session.mood || ''
      ];
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  }

  exportConversationsAsText(): string {
    const history = this.getConversationHistory();
    let textOutput = 'Therapy Chat Conversations Export\n';
    textOutput += '=====================================\n\n';
    
    history.forEach((session, index) => {
      textOutput += `Session ${index + 1} (${session.id})\n`;
      textOutput += `Date: ${session.startTime.toLocaleDateString()}\n`;
      textOutput += `Type: ${session.sessionType}\n`;
      if (session.mood) textOutput += `Mood: ${session.mood}\n`;
      textOutput += '\nConversation:\n';
      textOutput += '-'.repeat(40) + '\n';
      
      session.messages.forEach(message => {
        const sender = message.sender === 'user' ? 'You' : 'Therapist';
        const time = message.timestamp.toLocaleTimeString();
        textOutput += `[${time}] ${sender}: ${message.text}\n`;
      });
      
      textOutput += '\n' + '='.repeat(50) + '\n\n';
    });
    
    return textOutput;
  }

  // Data cleanup methods
  clearAllData(): boolean {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        this.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing all data:', error);
      return false;
    }
  }

  getStorageUsage(): { used: number; available: number; percentage: number } {
    if (!this.isClient()) {
      return { used: 0, available: 0, percentage: 0 };
    }
    
    try {
      let used = 0;
      Object.values(STORAGE_KEYS).forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
          used += item.length;
        }
      });
      
      // Estimate available storage (5MB typical limit)
      const available = 5 * 1024 * 1024; // 5MB in bytes
      const percentage = (used / available) * 100;
      
      return { used, available, percentage };
    } catch (error) {
      console.error('Error calculating storage usage:', error);
      return { used: 0, available: 0, percentage: 0 };
    }
  }
}

// Export singleton instance
export const localStorageService = new LocalStorageService();

// Export types
export type { ConversationSession, PrivacySettings };

// Export utility functions
export const createSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const downloadFile = (content: string, filename: string, mimeType: string = 'text/plain'): void => {
  if (typeof window === 'undefined') return;
  
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};