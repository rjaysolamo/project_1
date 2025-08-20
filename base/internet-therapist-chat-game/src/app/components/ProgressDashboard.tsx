'use client';

import { SessionProgress, PlayerStats } from '../types/game';

interface ProgressDashboardProps {
  currentSession: SessionProgress | null;
  playerStats: PlayerStats;
  progress: number;
  className?: string;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  currentSession,
  playerStats,
  progress,
  className = ''
}) => {
  const getProgressColor = (progress: number): string => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getSessionDuration = (): number => {
    if (!currentSession) return 0;
    const endTime = currentSession.endTime || Date.now();
    return endTime - currentSession.startTime;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Player Level & XP */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">Player Progress</h3>
          <span className="text-2xl font-bold text-blue-600">Lv.{playerStats.level}</span>
        </div>
        <div className="mb-2">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Experience</span>
            <span>{playerStats.experience} XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(playerStats.experience % 1000) / 10}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {1000 - (playerStats.experience % 1000)} XP to next level
          </div>
        </div>
      </div>

      {/* Current Session Progress */}
      {currentSession && (
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Current Session</h3>
          
          {/* Overall Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Session Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Session Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{currentSession.messageCount}</div>
              <div className="text-xs text-gray-500">Messages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{currentSession.moodEntries.length}</div>
              <div className="text-xs text-gray-500">Mood Checks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatDuration(getSessionDuration())}
              </div>
              <div className="text-xs text-gray-500">Duration</div>
            </div>
          </div>

          {/* Objectives */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Session Objectives</h4>
            <div className="space-y-2">
              {currentSession.objectives.map((objective) => (
                <div key={objective.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full ${
                      objective.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {objective.completed && (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <span className={`text-sm ${
                      objective.completed ? 'text-green-700 line-through' : 'text-gray-700'
                    }`}>
                      {objective.title}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {objective.progress}/{objective.maxProgress}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Player Stats */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Overall Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">{playerStats.totalSessions}</div>
            <div className="text-xs text-gray-500">Total Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">{playerStats.totalMessages}</div>
            <div className="text-xs text-gray-500">Total Messages</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-600">
              {playerStats.averageMood.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500">Avg Mood</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-orange-600">{playerStats.streakDays}</div>
            <div className="text-xs text-gray-500">Day Streak</div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Achievements</h3>
        <div className="grid grid-cols-2 gap-2">
          {playerStats.achievements.map((achievement) => (
            <div 
              key={achievement.id}
              className={`p-3 rounded-lg border-2 transition-all ${
                achievement.unlocked
                  ? 'border-yellow-400 bg-yellow-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className={`text-2xl ${
                  achievement.unlocked ? 'grayscale-0' : 'grayscale'
                }`}>
                  {achievement.icon}
                </span>
                <div className="flex-1">
                  <div className={`font-medium text-sm ${
                    achievement.unlocked ? 'text-yellow-800' : 'text-gray-500'
                  }`}>
                    {achievement.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {achievement.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;