import { MoodState, EmotionType, MoodEntry, SessionProgress, GameObjective, Achievement, PlayerStats } from '../types/game';

class GameEngine {
  private currentSession: SessionProgress | null = null;
  private playerStats: PlayerStats;

  constructor() {
    this.playerStats = this.initializePlayerStats();
  }

  private initializePlayerStats(): PlayerStats {
    return {
      totalSessions: 0,
      totalMessages: 0,
      averageMood: 0,
      streakDays: 0,
      achievements: this.initializeAchievements(),
      level: 1,
      experience: 0
    };
  }

  private initializeAchievements(): Achievement[] {
    return [
      {
        id: 'first_session',
        title: 'First Steps',
        description: 'Complete your first therapy session',
        unlocked: false,
        unlockedAt: null,
        icon: '🌱'
      },
      {
        id: 'mood_improver',
        title: 'Mood Lifter',
        description: 'Improve your mood during a session',
        unlocked: false,
        unlockedAt: null,
        icon: '😊'
      },
      {
        id: 'consistent_user',
        title: 'Consistency Champion',
        description: 'Use the app for 7 days in a row',
        unlocked: false,
        unlockedAt: null,
        icon: '🔥'
      },
      {
        id: 'deep_talker',
        title: 'Deep Conversationalist',
        description: 'Send 50 messages in a single session',
        unlocked: false,
        unlockedAt: null,
        icon: '💬'
      }
    ];
  }

  public startSession(): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.currentSession = {
      sessionId,
      startTime: Date.now(),
      endTime: null,
      messageCount: 0,
      moodEntries: [],
      score: 0,
      objectives: this.generateSessionObjectives()
    };

    return sessionId;
  }

  private generateSessionObjectives(): GameObjective[] {
    return [
      {
        id: 'message_goal',
        title: 'Express Yourself',
        description: 'Send at least 10 messages',
        completed: false,
        progress: 0,
        maxProgress: 10
      },
      {
        id: 'mood_tracking',
        title: 'Mood Awareness',
        description: 'Track your mood 3 times',
        completed: false,
        progress: 0,
        maxProgress: 3
      },
      {
        id: 'session_duration',
        title: 'Take Your Time',
        description: 'Spend at least 10 minutes in session',
        completed: false,
        progress: 0,
        maxProgress: 600000 // 10 minutes in milliseconds
      }
    ];
  }

  public addMessage(): void {
    if (!this.currentSession) return;
    
    this.currentSession.messageCount++;
    this.playerStats.totalMessages++;
    
    // Update message objective
    const messageObjective = this.currentSession.objectives.find(obj => obj.id === 'message_goal');
    if (messageObjective && !messageObjective.completed) {
      messageObjective.progress = Math.min(messageObjective.progress + 1, messageObjective.maxProgress);
      if (messageObjective.progress >= messageObjective.maxProgress) {
        messageObjective.completed = true;
        this.addExperience(50);
      }
    }

    // Check for deep talker achievement
    if (this.currentSession.messageCount >= 50) {
      this.unlockAchievement('deep_talker');
    }
  }

  public trackMood(mood: MoodState, emotions: EmotionType[], intensity: number): void {
    if (!this.currentSession) return;

    const moodEntry: MoodEntry = {
      timestamp: Date.now(),
      mood,
      emotions,
      intensity
    };

    this.currentSession.moodEntries.push(moodEntry);
    
    // Update mood tracking objective
    const moodObjective = this.currentSession.objectives.find(obj => obj.id === 'mood_tracking');
    if (moodObjective && !moodObjective.completed) {
      moodObjective.progress = Math.min(moodObjective.progress + 1, moodObjective.maxProgress);
      if (moodObjective.progress >= moodObjective.maxProgress) {
        moodObjective.completed = true;
        this.addExperience(30);
      }
    }

    // Check for mood improvement
    if (this.currentSession.moodEntries.length >= 2) {
      const previousMood = this.getMoodValue(this.currentSession.moodEntries[this.currentSession.moodEntries.length - 2].mood);
      const currentMoodValue = this.getMoodValue(mood);
      
      if (currentMoodValue > previousMood) {
        this.unlockAchievement('mood_improver');
      }
    }
  }

  private getMoodValue(mood: MoodState): number {
    const values = {
      very_negative: 1,
      negative: 2,
      neutral: 3,
      positive: 4,
      very_positive: 5
    };
    return values[mood];
  }

  public endSession(): SessionProgress | null {
    if (!this.currentSession) return null;

    this.currentSession.endTime = Date.now();
    const sessionDuration = this.currentSession.endTime - this.currentSession.startTime;
    
    // Update duration objective
    const durationObjective = this.currentSession.objectives.find(obj => obj.id === 'session_duration');
    if (durationObjective && !durationObjective.completed) {
      durationObjective.progress = Math.min(sessionDuration, durationObjective.maxProgress);
      if (durationObjective.progress >= durationObjective.maxProgress) {
        durationObjective.completed = true;
        this.addExperience(40);
      }
    }

    // Calculate session score
    this.currentSession.score = this.calculateSessionScore();
    
    // Update player stats
    this.playerStats.totalSessions++;
    this.updateAverageMood();
    
    // Check for first session achievement
    if (this.playerStats.totalSessions === 1) {
      this.unlockAchievement('first_session');
    }

    const completedSession = { ...this.currentSession };
    this.currentSession = null;
    
    return completedSession;
  }

  private calculateSessionScore(): number {
    if (!this.currentSession) return 0;

    let score = 0;
    
    // Base score from messages
    score += this.currentSession.messageCount * 5;
    
    // Bonus for completed objectives
    const completedObjectives = this.currentSession.objectives.filter(obj => obj.completed).length;
    score += completedObjectives * 100;
    
    // Mood improvement bonus
    if (this.currentSession.moodEntries.length >= 2) {
      const firstMood = this.getMoodValue(this.currentSession.moodEntries[0].mood);
      const lastMood = this.getMoodValue(this.currentSession.moodEntries[this.currentSession.moodEntries.length - 1].mood);
      
      if (lastMood > firstMood) {
        score += (lastMood - firstMood) * 50;
      }
    }
    
    // Session duration bonus
    const duration = (this.currentSession.endTime || Date.now()) - this.currentSession.startTime;
    if (duration >= 600000) { // 10 minutes
      score += 200;
    }

    return Math.max(0, score);
  }

  private updateAverageMood(): void {
    if (!this.currentSession || this.currentSession.moodEntries.length === 0) return;

    const sessionMoodAverage = this.currentSession.moodEntries.reduce((sum, entry) => {
      return sum + this.getMoodValue(entry.mood);
    }, 0) / this.currentSession.moodEntries.length;

    // Update running average
    const totalSessions = this.playerStats.totalSessions;
    this.playerStats.averageMood = ((this.playerStats.averageMood * (totalSessions - 1)) + sessionMoodAverage) / totalSessions;
  }

  private addExperience(amount: number): void {
    this.playerStats.experience += amount;
    
    // Check for level up (every 1000 XP)
    const newLevel = Math.floor(this.playerStats.experience / 1000) + 1;
    if (newLevel > this.playerStats.level) {
      this.playerStats.level = newLevel;
    }
  }

  private unlockAchievement(achievementId: string): void {
    const achievement = this.playerStats.achievements.find(a => a.id === achievementId);
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.unlockedAt = Date.now();
      this.addExperience(100);
    }
  }

  public getCurrentSession(): SessionProgress | null {
    return this.currentSession ? { ...this.currentSession } : null;
  }

  public getPlayerStats(): PlayerStats {
    return { ...this.playerStats };
  }

  public getProgress(): number {
    if (!this.currentSession) return 0;
    
    const completedObjectives = this.currentSession.objectives.filter(obj => obj.completed).length;
    return (completedObjectives / this.currentSession.objectives.length) * 100;
  }

  public getDifficultyLevel(): number {
    // Simple difficulty progression based on player level
    return Math.min(this.playerStats.level, 10);
  }
}

export default GameEngine;