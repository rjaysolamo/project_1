import { useState } from 'react';
import { TherapistPersonality } from '../types/therapist';

interface UserPreferences {
  therapistPersonality: TherapistPersonality;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  darkMode: boolean;
  sessionReminders: boolean;
  dataCollection: boolean;
  exportFormat: 'json' | 'csv' | 'txt';
  language: 'en' | 'es' | 'fr' | 'de';
}

interface SettingsPanelProps {
  preferences: UserPreferences;
  onPreferencesChange: (preferences: UserPreferences) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function SettingsPanel({ 
  preferences, 
  onPreferencesChange, 
  onClose, 
  isOpen 
}: SettingsPanelProps) {
  const [localPreferences, setLocalPreferences] = useState<UserPreferences>(preferences);
  const [activeTab, setActiveTab] = useState<'general' | 'privacy' | 'therapist' | 'export'>('general');

  const handleSave = () => {
    onPreferencesChange(localPreferences);
    onClose();
  };

  const handleReset = () => {
    const defaultPreferences: UserPreferences = {
      therapistPersonality: 'empathetic',
      notificationsEnabled: true,
      soundEnabled: true,
      darkMode: false,
      sessionReminders: true,
      dataCollection: true,
      exportFormat: 'json',
      language: 'en'
    };
    setLocalPreferences(defaultPreferences);
  };

  const updatePreference = <K extends keyof UserPreferences>(
    key: K, 
    value: UserPreferences[K]
  ) => {
    setLocalPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            aria-label="Close settings"
          >
            <span className="text-gray-600">✕</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'general', label: 'General', icon: '⚙️' },
            { id: 'therapist', label: 'Therapist', icon: '👨‍⚕️' },
            { id: 'privacy', label: 'Privacy', icon: '🔒' },
            { id: 'export', label: 'Export', icon: '📤' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">General Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Notifications</label>
                      <p className="text-xs text-gray-500">Receive session reminders and updates</p>
                    </div>
                    <button
                      onClick={() => updatePreference('notificationsEnabled', !localPreferences.notificationsEnabled)}
                      title="Toggle notifications"
                      aria-label="Toggle notifications"
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        localPreferences.notificationsEnabled ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          localPreferences.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Sound Effects</label>
                      <p className="text-xs text-gray-500">Play sounds for interactions</p>
                    </div>
                    <button
                      onClick={() => updatePreference('soundEnabled', !localPreferences.soundEnabled)}
                      title="Toggle sound effects"
                      aria-label="Toggle sound effects"
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        localPreferences.soundEnabled ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          localPreferences.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Session Reminders</label>
                      <p className="text-xs text-gray-500">Get reminded to continue your sessions</p>
                    </div>
                    <button
                      onClick={() => updatePreference('sessionReminders', !localPreferences.sessionReminders)}
                      title="Toggle session reminders"
                      aria-label="Toggle session reminders"
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        localPreferences.sessionReminders ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          localPreferences.sessionReminders ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={localPreferences.language}
                      onChange={(e) => updatePreference('language', e.target.value as UserPreferences['language'])}
                      title="Select language"
                      aria-label="Select language"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'therapist' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Therapist Personality</h3>
                <p className="text-sm text-gray-600 mb-4">Choose the therapeutic approach that works best for you</p>
                
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { type: 'empathetic', name: 'Dr. Emma', description: 'Warm and understanding, focuses on emotional connection', color: 'from-rose-400 to-pink-600' },
                    { type: 'analytical', name: 'Dr. Alex', description: 'Logical and structured, uses evidence-based approaches', color: 'from-blue-400 to-indigo-600' },
                    { type: 'supportive', name: 'Dr. Sam', description: 'Encouraging and positive, builds confidence and resilience', color: 'from-emerald-400 to-teal-600' },
                    { type: 'challenging', name: 'Dr. Dana', description: 'Straightforward and honest, provides clear guidance', color: 'from-orange-400 to-red-600' }
                  ].map(therapist => (
                    <button
                      key={therapist.type}
                      onClick={() => updatePreference('therapistPersonality', therapist.type as TherapistPersonality)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        localPreferences.therapistPersonality === therapist.type
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${therapist.color} flex items-center justify-center`}>
                          <span className="text-white font-bold text-sm">{therapist.name.charAt(3)}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{therapist.name}</h4>
                          <p className="text-sm text-gray-600">{therapist.description}</p>
                        </div>
                        {localPreferences.therapistPersonality === therapist.type && (
                          <div className="text-blue-500">✓</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy & Data</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Data Collection</label>
                      <p className="text-xs text-gray-500">Allow anonymous usage analytics to improve the service</p>
                    </div>
                    <button
                      onClick={() => updatePreference('dataCollection', !localPreferences.dataCollection)}
                      title="Toggle data collection"
                      aria-label="Toggle data collection"
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        localPreferences.dataCollection ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          localPreferences.dataCollection ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <span className="text-yellow-600">⚠️</span>
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800">Privacy Notice</h4>
                        <p className="text-xs text-yellow-700 mt-1">
                          All conversations are stored locally on your device. No personal data is sent to external servers without your explicit consent.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Export Data</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
                    <select
                      value={localPreferences.exportFormat}
                      onChange={(e) => updatePreference('exportFormat', e.target.value as UserPreferences['exportFormat'])}
                      title="Select export format"
                      aria-label="Select export format"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="json">JSON (Structured Data)</option>
                      <option value="csv">CSV (Spreadsheet)</option>
                      <option value="txt">TXT (Plain Text)</option>
                    </select>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <span className="text-blue-600">ℹ️</span>
                      <div>
                        <h4 className="text-sm font-medium text-blue-800">Export Information</h4>
                        <p className="text-xs text-blue-700 mt-1">
                          You can export your conversation history, mood tracking data, and progress statistics at any time.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Reset to Defaults
          </button>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}