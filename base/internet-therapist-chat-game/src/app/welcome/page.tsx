'use client';

import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to Therapy Chat
        </h1>
        <p className="text-gray-600 mb-8">
          A safe space to explore your thoughts and feelings through AI-powered therapeutic conversation.
        </p>
        <div className="space-y-4">
          <Link 
            href="/session"
            className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Start Session
          </Link>
          <p className="text-sm text-gray-500">
            Your conversations are private and secure
          </p>
        </div>
      </div>
    </div>
  );
}