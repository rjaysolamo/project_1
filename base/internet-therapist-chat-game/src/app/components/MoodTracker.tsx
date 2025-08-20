'use client';

import React, { useState } from 'react';
import {  EmotionType, MoodEntry } from '../types/game';

interface MoodTrackerProps {
  onMoodSubmit: (moodEntry: MoodEntry) => void;
  isCompact?: boolean;
}

export default function MoodTracker({ onMoodSubmit, isCompact = false }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<number>(5);
  const [selectedEmotions, setSelectedEmotions] = useState<EmotionType[]>([]);
  const [intensity, setIntensity] = useState<number>(5);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const emotions = [
    { id: 'joy' as EmotionType, emoji: '😊', label: 'Happy' },
    { id: 'sadness' as EmotionType, emoji: '😢', label: 'Sad' },
    { id: 'anxiety' as EmotionType, emoji: '😰', label: 'Anxious' },
    { id: 'anger' as EmotionType, emoji: '😠', label: 'Angry' },
    { id: 'fear' as EmotionType, emoji: '😤', label: 'Frustrated' },
    { id: 'excitement' as EmotionType, emoji: '🌟', label: 'Hopeful' },
    { id: 'depression' as EmotionType, emoji: '😕', label: 'Confused' },
    { id: 'calm' as EmotionType, emoji: '💪', label: 'Confident' },
  ];

  const moodEmojis = ['😢', '😞', '😕', '😐', '🙂', '😊', '😄', '😁', '🤩', '🥳'];
  const moodLabels = ['Terrible', 'Bad', 'Poor', 'Okay', 'Good', 'Great', 'Amazing', 'Fantastic', 'Incredible', 'Perfect'];

  const handleEmotionToggle = (emotion: EmotionType) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleSubmit = () => {
    const moodData: MoodEntry = {
      timestamp: Date.now(),
      mood: selectedMood,
      emotions: selectedEmotions,
      intensity,
    };
    onMoodSubmit(moodData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 2000);
  };

  if (isCompact) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{moodEmojis[selectedMood - 1]}</span>
            <div>
              <p className="text-sm font-medium text-gray-900">Current Mood</p>
              <p className="text-xs text-gray-600">{moodLabels[selectedMood - 1]}</p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-sm"
          >
            Update
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">How are you feeling?</h3>
        <p className="text-sm text-gray-600">Track your emotional state to help guide our conversation</p>
      </div>
      
      {/* Overall Mood Selector */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Overall Mood</label>
        <div className="flex items-center justify-center space-x-2 mb-3">
          <span className="text-3xl">{moodEmojis[selectedMood - 1]}</span>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{selectedMood}/10</div>
            <div className="text-sm text-gray-600">{moodLabels[selectedMood - 1]}</div>
          </div>
        </div>
        <input
           type="range"
           min="1"
           max="10"
           value={selectedMood}
           onChange={(e) => setSelectedMood(Number(e.target.value))}
           className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
           aria-label="Overall mood level from 1 to 10"
           title={`Current mood: ${selectedMood}/10 - ${moodLabels[selectedMood - 1]}`}
         />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      {/* Emotion Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Specific Emotions</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {emotions.map(({ id, emoji, label }) => {
            const isSelected = selectedEmotions.includes(id);
            return (
              <button
                key={id}
                onClick={() => handleEmotionToggle(id)}
                className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="text-lg mb-1">{emoji}</div>
                <div className="capitalize">{label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Intensity Slider */}
      <div className="space-y-3">
        <label htmlFor="intensity-slider" className="block text-sm font-medium text-gray-700">
          Intensity Level
        </label>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">Mild</span>
          <input
            id="intensity-slider"
            type="range"
            min="1"
            max="10"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            aria-label="Emotion intensity level"
            title="Adjust the intensity of your emotions"
          />
          <span className="text-sm text-gray-500">Intense</span>
        </div>
        <div className="text-center">
          <span className="text-sm font-medium text-gray-900">{intensity}/10</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitted}
        className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
          isSubmitted
            ? 'bg-green-500 text-white'
            : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transform hover:scale-[1.02]'
        } shadow-lg`}
      >
        {isSubmitted ? (
          <div className="flex items-center justify-center space-x-2">
            <span>✓</span>
            <span>Mood Recorded</span>
          </div>
        ) : (
          'Record Mood'
        )}
      </button>
    </div>
  );
}