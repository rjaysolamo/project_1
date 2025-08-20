'use client';

import Link from 'next/link';

export default function CompletePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Session Complete
          </h1>
          <p className="text-gray-600">
            Thank you for taking time for yourself today. Remember, healing is a journey.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg text-left">
            <h3 className="font-medium text-blue-900 mb-2">Remember:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your feelings are valid</li>
              <li>• Progress takes time</li>
              <li>• You're not alone in this</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <Link 
              href="/session"
              className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Start New Session
            </Link>
            <Link 
              href="/welcome"
              className="block w-full text-gray-500 hover:text-gray-700 transition-colors"
            >
              Return to Welcome
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}