'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import ChatInput from './ChatInput';
import { Message } from '../types';
import ConversationFlow from '../services/conversationFlow';

interface ChatInterfaceProps {
  conversationFlow: ConversationFlow;
  onMessageSent?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ conversationFlow, onMessageSent }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load initial messages from conversation flow
    const history = conversationFlow.getMessageHistory();
    const formattedMessages: Message[] = history.map(msg => ({
      id: msg.id,
      text: msg.text,
      sender: msg.sender,
      timestamp: new Date(msg.timestamp)
    }));
    setMessages(formattedMessages);
  }, [conversationFlow]);

  const handleSendMessage = async (text: string) => {
    if (!conversationFlow || !conversationFlow.isSessionActive()) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await conversationFlow.processUserMessage(text);
      
      const therapistMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'therapist',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, therapistMessage]);
      
      // Notify parent component about message sent
      if (onMessageSent) {
        onMessageSent();
      }
    } catch (error) {
      console.error('Error generating response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble responding right now. Please try again.",
        sender: 'therapist',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput 
        onSendMessage={handleSendMessage} 
        disabled={isTyping || !conversationFlow || !conversationFlow.isSessionActive()} 
      />
    </div>
  );
};

export default ChatInterface;