'use client';

import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 group`}>
      {!isUser && (
        <div className="flex-shrink-0 mr-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-semibold text-sm">AI</span>
          </div>
        </div>
      )}
      <div className="flex flex-col max-w-xs lg:max-w-md">
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 ${
            isUser
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-auto rounded-br-md'
              : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md'
          }`}
        >
          <p className="text-sm leading-relaxed">{message.text}</p>
        </div>
        <div className={`flex items-center mt-1 text-xs text-gray-500 ${
          isUser ? 'justify-end mr-2' : 'justify-start ml-2'
        }`}>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
      {isUser && (
        <div className="flex-shrink-0 ml-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-semibold text-sm">You</span>
          </div>
        </div>
      )}
    </div>
  );
};

export { ChatMessage };
export default ChatMessage;
