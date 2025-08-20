'use client';

import { useState, useEffect } from 'react';
import { Message, ChatState } from '../types/chat';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { initializeVeniceAI, getVeniceAI, ChatMessage as VeniceMessage } from '../services/veniceAI';

export default function ChatInterface() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [
      {
        id: '1',
        content: 'Hello! I\'m here to listen and support you. What would you like to talk about today?',
        sender: 'therapist',
        timestamp: new Date()
      }
    ],
    isTyping: false
  });
  
  const [apiKeyStatus, setApiKeyStatus] = useState<'loading' | 'valid' | 'invalid' | 'missing'>('loading');

  useEffect(() => {
    const initializeAI = async () => {
      const apiKey = process.env.NEXT_PUBLIC_VENICE_AI_API_KEY;
      
      if (!apiKey || apiKey === 'your_venice_ai_api_key_here') {
        setApiKeyStatus('missing');
        return;
      }

      try {
        const veniceAI = initializeVeniceAI(apiKey);
        const isValid = await veniceAI.validateApiKey();
        setApiKeyStatus(isValid ? 'valid' : 'invalid');
      } catch (error) {
        console.error('Failed to initialize Venice AI:', error);
        setApiKeyStatus('invalid');
      }
    };

    initializeAI();
  }, []);

  const convertToVeniceMessages = (messages: Message[]): VeniceMessage[] => {
    return messages
      .filter(msg => msg.sender === 'user' || msg.sender === 'therapist')
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
  };

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true
    }));

    try {
      const veniceAI = getVeniceAI();
      
      if (!veniceAI || apiKeyStatus !== 'valid') {
        throw new Error('Venice AI not available');
      }

      // Convert conversation history for Venice AI
      const conversationHistory = convertToVeniceMessages(chatState.messages);
      
      // Get AI response
      const aiResponse = await veniceAI.generateTherapeuticResponse(
        content,
        conversationHistory
      );

      const therapistMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'therapist',
        timestamp: new Date()
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, therapistMessage],
        isTyping: false
      }));
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I\'m having trouble connecting right now, but I\'m still here to listen. Could you tell me more about what\'s on your mind?',
        sender: 'therapist',
        timestamp: new Date()
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, fallbackMessage],
        isTyping: false
      }));
    }
  };

  const getStatusMessage = () => {
    switch (apiKeyStatus) {
      case 'loading':
        return { text: 'Connecting to AI therapist...', color: 'text-yellow-600' };
      case 'missing':
        return { text: 'AI unavailable - Please configure API key', color: 'text-red-600' };
      case 'invalid':
        return { text: 'AI connection failed - Check API key', color: 'text-red-600' };
      case 'valid':
        return { text: 'AI therapist ready', color: 'text-green-600' };
      default:
        return { text: '', color: '' };
    }
  };

  const status = getStatusMessage();

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white">
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-semibold">Internet Therapist Chat</h1>
        <p className="text-blue-100">A safe space for reflection and support</p>
        {status.text && (
          <div className={`text-sm mt-2 ${status.color} bg-white bg-opacity-20 px-2 py-1 rounded`}>
            {status.text}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatState.messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {chatState.isTyping && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <span className="text-sm">Therapist is typing...</span>
          </div>
        )}
      </div>

      <ChatInput onSendMessage={handleSendMessage} disabled={apiKeyStatus !== 'valid'} />
    </div>
  );
}