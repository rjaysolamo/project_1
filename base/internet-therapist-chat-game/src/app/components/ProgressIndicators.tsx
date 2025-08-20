import { SessionProgress, PlayerStats, Achievement } from '../types/game';

interface ProgressIndicatorsProps {
  sessionProgress: SessionProgress;
  playerStats: PlayerStats;
  achievements: Achievement[];
}

export default function ProgressIndicators({ 
  sessionProgress, 
  playerStats, 
  achievements 
}: ProgressIndicatorsProps) {
  const getProgressPercentage = (current: number, target: number): number => {
    return Math.min((current / target) * 100, 100);
  };

  const getRecentAchievements = (): Achievement[] => {
    if (!achievements || !Array.isArray(achievements)) {
      return [];
    }
    return achievements
      .filter(achievement => achievement.unlockedAt)
      .sort((a, b) => (b.unlockedAt || 0) - (a.unlockedAt || 0))
      .slice(0, 3);
  };

  const getLevelProgress = (): number => {
    const currentLevelXP = playerStats.level * 100;
    const nextLevelXP = (playerStats.level + 1) * 100;
    const progressInLevel = playerStats.experience - currentLevelXP;
    const xpNeededForLevel = nextLevelXP - currentLevelXP;
    return (progressInLevel / xpNeededForLevel) * 100;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
      {/* Session Progress */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Session Progress</h3>
          <span className="text-xs text-gray-500">
            {sessionProgress.messageCount} messages
          </span>
        </div>
        <div className="space-y-3">
          {sessionProgress.objectives.map((objective, index) => {
            const progress = getProgressPercentage(objective.progress, objective.maxProgress);
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{objective.description}</span>
                  <span className="text-xs font-medium text-gray-900">
                    {objective.progress}/{objective.maxProgress}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      objective.completed 
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                        : 'bg-gradient-to-r from-blue-400 to-indigo-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Player Level */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Level Progress</h3>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">{playerStats.level}</span>
            </div>
            <span className="text-xs text-gray-500">Level {playerStats.level}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Experience</span>
            <span className="text-xs font-medium text-gray-900">
              {playerStats.experience} XP
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 transition-all duration-500"
              style={{ width: `${getLevelProgress()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Achievements</h3>
        <div className="space-y-2">
          {getRecentAchievements().length > 0 ? (
            getRecentAchievements().map((achievement) => (
              <div key={achievement.id} className="flex items-center space-x-3 p-2 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">🏆</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">
                    {achievement.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {achievement.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-gray-400 text-lg">🎯</span>
              </div>
              <p className="text-xs text-gray-500">Complete objectives to unlock achievements</p>
            </div>
          )}
        </div>
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">{Math.round((Date.now() - sessionProgress.startTime) / 60000)}</div>
          <div className="text-xs text-gray-500">Minutes</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-emerald-600">{sessionProgress.score}</div>
          <div className="text-xs text-gray-500">Score</div>
        </div>
      </div>
    </div>
  );
}