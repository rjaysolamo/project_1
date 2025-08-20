'use client';

import { useState, useEffect, useRef } from 'react';
import ChatInterface from '../components/ChatInterface';
import MoodTracker from '../components/MoodTracker';
import TherapistAvatar from '../components/TherapistAvatar';
import ProgressIndicators from '../components/ProgressIndicators';
import SettingsPanel from '../components/SettingsPanel';
import ResponsiveLayout, { MobileCard, MobileButton, toggleMobileSidebar } from '../components/ResponsiveLayout';
import { Message } from '../types';
import { PlayerStats, SessionProgress, MoodState } from '../types/game';
import { TherapistPersonality } from '../types/therapist';
import ConversationFlow from '../services/conversationFlow';
import { localStorageService, createSessionId } from '../services/localStorage';

export default function SessionPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    level: 1,
    experience: 0,
    totalSessions: 0,
    totalMessages: 0,
    averageMood: 0,
    streakDays: 0,
    achievements: []
  });
  const [sessionProgress, setSessionProgress] = useState<SessionProgress>({
    sessionId: '',
    startTime: Date.now(),
    endTime: null,
    messageCount: 0,
    moodEntries: [],
    score: 0,
    objectives: []
  });
  const [conversationFlow] = useState(() => new ConversationFlow());
  const [currentMood, setCurrentMood] = useState<MoodState>('neutral');
  const [currentTherapist, setCurrentTherapist] = useState<TherapistPersonality>('empathetic');
  const sessionStartTime = useRef<Date>(new Date());
  const sessionId = useRef<string>(createSessionId());

  useEffect(() => {
    // Start the conversation flow session
    conversationFlow.startSession();
    
    // Load saved data
    const savedStats = localStorageService.getPlayerStats();
    const savedSession = localStorageService.getCurrentSession();
    
    setPlayerStats(savedStats);
    
    if (savedSession && savedSession.messages.length > 0) {
      setMessages(savedSession.messages);
      setCurrentMood((savedSession.mood || 'neutral') as MoodState);
    } else {
      // Initialize new session
      const welcomeMessage: Message = {
        id: 'welcome',
        text: 'Hello! I\'m here to support you today. How are you feeling right now?',
        sender: 'therapist' as const,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }

    // Start session timer
    const timer = setInterval(() => {
      setSessionProgress(prev => ({
        ...prev,
        messageCount: prev.messageCount
      }));
    }, 1000);

    return () => {
      clearInterval(timer);
      // Save session on unmount
      saveCurrentSession();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveCurrentSession = () => {
    const session = {
      id: sessionId.current,
      messages,
      startTime: sessionStartTime.current,
      sessionType: 'therapy' as const,
      mood: currentMood
    };
    
    localStorageService.saveCurrentSession(session);
    localStorageService.savePlayerStats(playerStats);
  };

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user' as const,
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await conversationFlow.processUserMessage(text);

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: response.text,
        sender: 'therapist' as const,
        timestamp: new Date()
      };

      const finalMessages = [...newMessages, aiMessage];
      setMessages(finalMessages);
      
      // Update player stats
      const updatedStats = {
        ...playerStats,
        totalMessages: playerStats.totalMessages + 1,
        experience: playerStats.experience + 10
      };
      setPlayerStats(updatedStats);
      localStorageService.savePlayerStats(updatedStats);

      // Auto-save session
      setTimeout(saveCurrentSession, 100);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: 'I apologize, but I\'m having trouble responding right now. Please try again.',
        sender: 'therapist' as const,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoodChange = (mood: string, _intensity: number) => {
    setCurrentMood(mood as MoodState);
    setSessionProgress(prev => ({
      ...prev,
      mood
    }));
    saveCurrentSession();
  };

  const handleEndSession = () => {
    const session = {
      id: sessionId.current,
      messages,
      startTime: sessionStartTime.current,
      endTime: new Date(),
      sessionType: 'therapy' as const,
      mood: currentMood
    };
    
    localStorageService.saveConversationSession(session);
    localStorageService.clearCurrentSession();
    
    // Update stats
    const updatedStats = {
      ...playerStats,
      totalSessions: playerStats.totalSessions + 1,
      experience: playerStats.experience + 100
    };
    
    localStorageService.savePlayerStats(updatedStats);
    
    // Reset for new session
    sessionId.current = createSessionId();
    sessionStartTime.current = new Date();
    setMessages([]);
    setSessionProgress({
      sessionId: createSessionId(),
      startTime: Date.now(),
      endTime: null,
      messageCount: 0,
      moodEntries: [],
      score: 0,
      objectives: []
    });
  };

  // Header component
  const header = (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button 
          className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          onClick={toggleMobileSidebar}
        >
          <span className="text-gray-600">☰</span>
        </button>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Therapy Session</h1>
          <p className="text-sm text-gray-600">
            Messages: {sessionProgress.messageCount}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <MobileButton
          variant="outline"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
        >
          ⚙️ Settings
        </MobileButton>
        <MobileButton
          variant="secondary"
          size="sm"
          onClick={handleEndSession}
        >
          End Session
        </MobileButton>
      </div>
    </div>
  );

  // Sidebar component
  const sidebar = (
    <div className="space-y-4 p-4">
      {/* Therapist Avatar */}
      <MobileCard title="Your Therapist">
        <TherapistAvatar 
          personality={currentTherapist} 
          showProfile={true}
        />
        <div className="mt-2 text-xs text-gray-600 text-center">
           Dr. {currentTherapist === 'empathetic' ? 'Emma' : 
                currentTherapist === 'analytical' ? 'Alex' : 
                currentTherapist === 'supportive' ? 'Sam' : 
                currentTherapist === 'challenging' ? 'Dana' : 'Emma'}
         </div>
      </MobileCard>

      {/* Progress Indicators */}
      <MobileCard title="Progress">
        <ProgressIndicators
          playerStats={playerStats}
          sessionProgress={sessionProgress}
          achievements={playerStats.achievements}
        />
      </MobileCard>

      {/* Progress Dashboard */}
      <MobileCard>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="font-semibold mb-2">Progress Dashboard</h3>
          <p>Level: {playerStats.level}</p>
          <p>Experience: {playerStats.experience}</p>
          <p>Messages: {sessionProgress.messageCount}</p>
        </div>
      </MobileCard>

      {/* Mood Tracker */}
      <MobileCard title="How are you feeling?">
        <MoodTracker
          onMoodSubmit={(moodEntry) => {
            setSessionProgress(prev => ({
              ...prev,
              moodEntries: [...prev.moodEntries, moodEntry]
            }));
            
            // Update player stats with mood data
            const moodValue = moodEntry.mood === 'very_positive' ? 5 :
                             moodEntry.mood === 'positive' ? 4 :
                             moodEntry.mood === 'neutral' ? 3 :
                             moodEntry.mood === 'negative' ? 2 : 1;
            
            setPlayerStats(prev => ({
              ...prev,
              averageMood: (prev.averageMood + moodValue) / 2
            }));
            
            setCurrentMood(moodEntry.mood as MoodState);
          }}
        />
      </MobileCard>
    </div>
  );

  return (
    <ResponsiveLayout
      header={header}
      sidebar={sidebar}
    >
      {/* Settings Panel Overlay */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <span className="text-gray-600">✕</span>
              </button>
            </div>
            <div className="p-4">
              <SettingsPanel 
                preferences={{
                   therapistPersonality: currentTherapist,
                   notificationsEnabled: true,
                   soundEnabled: true,
                   darkMode: false,
                   language: 'en',
                   sessionReminders: true,
                   dataCollection: true,
                   exportFormat: 'json'
                 }}
                onPreferencesChange={(preferences) => {
                  if (preferences.therapistPersonality !== currentTherapist) {
                    setCurrentTherapist(preferences.therapistPersonality);
                    conversationFlow.changeTherapistPersonality(preferences.therapistPersonality);
                  }
                }}
                onClose={() => setShowSettings(false)}
                isOpen={showSettings}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Interface */}
      <MobileCard className="h-[calc(100vh-12rem)] lg:h-[600px]">
        <div className="h-full flex flex-col">
          <ChatInterface
          conversationFlow={conversationFlow}
          onMessageSent={() => {
            setPlayerStats(prev => ({
              ...prev,
              totalMessages: prev.totalMessages + 1
            }));
          }}
        />
        </div>
      </MobileCard>
    </ResponsiveLayout>
  );
}