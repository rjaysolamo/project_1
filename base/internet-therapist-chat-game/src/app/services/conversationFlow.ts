import TherapistService from './therapist';
import GameEngine from './gameEngine';
import { ResponseDelaySimulator } from './responseDelay';
import { TherapistResponse } from '../types/therapist';
import { MoodState, EmotionType } from '../types/game';

interface ConversationState {
  isActive: boolean;
  sessionId: string | null;
  messageHistory: Array<{
    id: string;
    text: string;
    sender: 'user' | 'therapist';
    timestamp: number;
    technique?: string;
  }>;
}

class ConversationFlow {
  private therapist: TherapistService;
  private gameEngine: GameEngine;
  private delaySimulator: ResponseDelaySimulator;
  private state: ConversationState;

  constructor() {
    this.therapist = new TherapistService();
    this.gameEngine = new GameEngine();
    this.delaySimulator = new ResponseDelaySimulator();
    this.state = {
      isActive: false,
      sessionId: null,
      messageHistory: []
    };
  }

  public startSession(): string {
    const sessionId = this.gameEngine.startSession();
    this.state = {
      isActive: true,
      sessionId,
      messageHistory: []
    };
    
    // Add welcome message
    this.addMessage(
      'Hello! I\'m here to listen and support you. How are you feeling today?',
      'therapist',
      'active_listening'
    );
    
    return sessionId;
  }

  public async processUserMessage(message: string): Promise<TherapistResponse> {
    if (!this.state.isActive) {
      throw new Error('No active session');
    }

    // Add user message to history
    this.addMessage(message, 'user');
    
    // Update game engine
    this.gameEngine.addMessage();
    
    // Extract emotions and topics for context
    const emotions = this.extractEmotions(message);
    const topics = this.extractTopics(message);
    
    // Update therapist context
    this.therapist.updateContext(emotions[0] || 'neutral', topics);
    
    // Generate therapist response
    const response = await this.therapist.generateResponse(message);
    
    // Simulate realistic response delay
    await this.delaySimulator.simulateDelay(message, response.text);
    
    // Add therapist response to history
    this.addMessage(response.text, 'therapist', response.technique);
    
    return response;
  }

  private extractEmotions(message: string): string[] {
    const emotionKeywords = {
      anxiety: ['anxious', 'worried', 'nervous', 'stressed', 'panic'],
      depression: ['sad', 'depressed', 'down', 'hopeless', 'empty'],
      anger: ['angry', 'mad', 'furious', 'irritated', 'frustrated'],
      joy: ['happy', 'joyful', 'excited', 'elated', 'cheerful'],
      fear: ['scared', 'afraid', 'terrified', 'frightened'],
      calm: ['calm', 'peaceful', 'relaxed', 'serene']
    };

    const detectedEmotions: string[] = [];
    const lowerMessage = message.toLowerCase();
    
    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        detectedEmotions.push(emotion);
      }
    });
    
    return detectedEmotions.length > 0 ? detectedEmotions : ['neutral'];
  }

  private extractTopics(message: string): string[] {
    const topicKeywords = {
      work: ['job', 'work', 'career', 'boss', 'colleague', 'office'],
      relationships: ['relationship', 'partner', 'friend', 'family', 'love'],
      health: ['health', 'sick', 'pain', 'doctor', 'medical'],
      money: ['money', 'financial', 'debt', 'income', 'budget'],
      education: ['school', 'study', 'exam', 'university', 'learning']
    };

    const detectedTopics: string[] = [];
    const lowerMessage = message.toLowerCase();
    
    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        detectedTopics.push(topic);
      }
    });
    
    return detectedTopics;
  }

  public trackMood(mood: MoodState, emotions: EmotionType[], intensity: number): void {
    if (!this.state.isActive) return;
    
    this.gameEngine.trackMood(mood, emotions, intensity);
  }

  public endSession() {
    if (!this.state.isActive) return null;
    
    const sessionResult = this.gameEngine.endSession();
    this.state.isActive = false;
    this.state.sessionId = null;
    
    return sessionResult;
  }

  private addMessage(text: string, sender: 'user' | 'therapist', technique?: string): void {
    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text,
      sender,
      timestamp: Date.now(),
      technique
    };
    
    this.state.messageHistory.push(message);
  }

  public getMessageHistory() {
    return [...this.state.messageHistory];
  }

  public getCurrentSession() {
    return this.gameEngine.getCurrentSession();
  }

  public getPlayerStats() {
    return this.gameEngine.getPlayerStats();
  }

  public getProgress(): number {
    return this.gameEngine.getProgress();
  }

  public isSessionActive(): boolean {
    return this.state.isActive;
  }

  public changeTherapistPersonality(personality: 'empathetic' | 'analytical' | 'supportive' | 'challenging'): void {
    this.therapist.changePersonality(personality);
  }

  public getConversationContext() {
    return this.therapist.getContext();
  }

  public getDifficultyLevel(): number {
    return this.gameEngine.getDifficultyLevel();
  }
}

export default ConversationFlow;