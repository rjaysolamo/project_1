import { TherapistPersonality } from '../types/therapist';

interface TherapistAvatarProps {
  personality: TherapistPersonality;
  isOnline?: boolean;
  showProfile?: boolean;
}

export default function TherapistAvatar({ 
  personality, 
  isOnline = true, 
  showProfile = false 
}: TherapistAvatarProps) {
  const getAvatarColor = (type: TherapistPersonality) => {
    switch (type) {
      case 'empathetic':
        return 'from-rose-400 to-pink-600';
      case 'analytical':
        return 'from-blue-400 to-indigo-600';
      case 'supportive':
        return 'from-emerald-400 to-teal-600';
      case 'challenging':
        return 'from-orange-400 to-red-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const getPersonalityName = (type: TherapistPersonality) => {
    switch (type) {
      case 'empathetic':
        return 'Dr. Emma';
      case 'analytical':
        return 'Dr. Alex';
      case 'supportive':
        return 'Dr. Sam';
      case 'challenging':
        return 'Dr. Dana';
      default:
        return 'Therapist';
    }
  };

  const getPersonalityDescription = (type: TherapistPersonality) => {
    switch (type) {
      case 'empathetic':
        return 'Warm and understanding, focuses on emotional connection';
      case 'analytical':
        return 'Logical and structured, uses evidence-based approaches';
      case 'supportive':
        return 'Encouraging and positive, builds confidence and resilience';
      case 'challenging':
        return 'Encourages growth through thoughtful challenges';
      default:
        return 'Professional therapeutic support';
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarColor(personality)} flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-105`}>
          <span className="text-white font-bold text-lg">
            {getPersonalityName(personality).charAt(3)}
          </span>
        </div>
        {isOnline && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
        )}
      </div>
      
      {showProfile && (
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {getPersonalityName(personality)}
          </h3>
          <p className="text-xs text-gray-500 truncate">
            {getPersonalityDescription(personality)}
          </p>
          <div className="flex items-center mt-1">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span className="text-xs text-green-600 font-medium">Online</span>
          </div>
        </div>
      )}
    </div>
  );
}