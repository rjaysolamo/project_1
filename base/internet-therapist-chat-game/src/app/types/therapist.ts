export type TherapistPersonality = 'empathetic' | 'analytical' | 'supportive' | 'challenging';

export type TherapeuticTechnique = 
  | 'active_listening'
  | 'reflection'
  | 'reframing'
  | 'validation'
  | 'questioning'
  | 'summarizing';

export interface TherapistResponse {
  text: string;
  technique: TherapeuticTechnique;
  personality: TherapistPersonality;
  confidence: number;
}

export interface ConversationContext {
  messageCount: number;
  dominantEmotion: string;
  keyTopics: string[];
  sessionDuration: number;
  lastTechnique: TherapeuticTechnique;
}

export interface TherapistConfig {
  personality: TherapistPersonality;
  responseDelay: number;
  techniques: TherapeuticTechnique[];
}