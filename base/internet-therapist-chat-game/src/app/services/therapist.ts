import { TherapistPersonality, TherapeuticTechnique, TherapistResponse, ConversationContext, TherapistConfig } from '../types/therapist';

class TherapistService {
  private config: TherapistConfig;
  private context: ConversationContext;

  constructor(personality: TherapistPersonality = 'empathetic') {
    this.config = {
      personality,
      responseDelay: this.getResponseDelay(personality),
      techniques: this.getTechniquesForPersonality(personality)
    };
    
    this.context = {
      messageCount: 0,
      dominantEmotion: 'neutral',
      keyTopics: [],
      sessionDuration: 0,
      lastTechnique: 'active_listening'
    };
  }

  private getResponseDelay(personality: TherapistPersonality): number {
    const delays = {
      empathetic: 2000,
      analytical: 3000,
      supportive: 1500,
      challenging: 2500
    };
    return delays[personality];
  }

  private getTechniquesForPersonality(personality: TherapistPersonality): TherapeuticTechnique[] {
    const techniques = {
      empathetic: ['active_listening', 'validation', 'reflection'],
      analytical: ['questioning', 'reframing', 'summarizing'],
      supportive: ['validation', 'active_listening', 'summarizing'],
      challenging: ['questioning', 'reframing', 'active_listening']
    };
    return techniques[personality] as TherapeuticTechnique[];
  }

  private extractKeyPhrase(message: string): string {
    // Remove common words and extract meaningful phrases
    const commonWords = ['i', 'am', 'is', 'are', 'was', 'were', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'that', 'this', 'it', 'my', 'me', 'you', 'your'];
    
    const words = message.toLowerCase().split(/\s+/).filter(word => 
      word.length > 2 && !commonWords.includes(word) && /^[a-zA-Z]+$/.test(word)
    );
    
    if (words.length === 0) return 'this situation';
    if (words.length === 1) return words[0];
    
    // Return first 2-3 meaningful words as a phrase
    return words.slice(0, Math.min(3, words.length)).join(' ');
  }

  private identifyEmotion(message: string): string {
    const emotionKeywords = {
      anxious: ['anxious', 'worried', 'nervous', 'scared', 'afraid', 'panic', 'stress'],
      sad: ['sad', 'depressed', 'down', 'low', 'blue', 'unhappy', 'miserable'],
      angry: ['angry', 'mad', 'furious', 'irritated', 'frustrated', 'annoyed'],
      confused: ['confused', 'lost', 'uncertain', 'unclear', 'puzzled'],
      overwhelmed: ['overwhelmed', 'too much', 'can\'t handle', 'exhausted'],
      lonely: ['lonely', 'alone', 'isolated', 'disconnected'],
      hopeful: ['hopeful', 'optimistic', 'positive', 'better', 'good'],
      grateful: ['grateful', 'thankful', 'appreciate', 'blessed']
    };
    
    const lowerMessage = message.toLowerCase();
    
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return emotion;
      }
    }
    
    // Default emotions based on message tone
    if (lowerMessage.includes('?')) return 'curious';
    if (lowerMessage.includes('!')) return 'intense';
    
    return 'uncertain';
  }

  private selectTechnique(userMessage: string): TherapeuticTechnique {
    const availableTechniques = this.config.techniques;
    const lowerMessage = userMessage.toLowerCase();
    const emotion = this.identifyEmotion(userMessage);
    
    // Advanced technique selection based on multiple factors
    
    // For questions, use reflection or questioning
    if (userMessage.includes('?')) {
      return Math.random() > 0.5 ? 'reflection' : 'questioning';
    }
    
    // For emotional content, prioritize validation
    if (lowerMessage.includes('feel') || lowerMessage.includes('emotion') || 
        ['anxious', 'sad', 'angry', 'overwhelmed', 'lonely'].includes(emotion)) {
      return Math.random() > 0.3 ? 'validation' : 'active_listening';
    }
    
    // For cognitive content, use reframing or questioning
    if (lowerMessage.includes('think') || lowerMessage.includes('believe') || 
        lowerMessage.includes('should') || lowerMessage.includes('must')) {
      return Math.random() > 0.5 ? 'reframing' : 'questioning';
    }
    
    // For long messages, use summarizing
    if (userMessage.split(' ').length > 20) {
      return 'summarizing';
    }
    
    // For positive emotions, use active listening or validation
    if (['hopeful', 'grateful'].includes(emotion)) {
      return Math.random() > 0.5 ? 'active_listening' : 'validation';
    }
    
    // Every 4th message, use summarizing to check understanding
    if (this.context.messageCount % 4 === 0 && availableTechniques.includes('summarizing')) {
      return 'summarizing';
    }
    
    // Avoid repeating the same technique consecutively
    const filtered = availableTechniques.filter(t => t !== this.context.lastTechnique);
    if (filtered.length === 0) return availableTechniques[0];
    
    return filtered[Math.floor(Math.random() * filtered.length)];
  }

  private generateResponseByTechnique(technique: TherapeuticTechnique, userMessage: string): string {
    const responses = {
      active_listening: [
        `I hear you saying that ${this.extractKeyPhrase(userMessage)}.`,
        `It sounds like you're experiencing ${this.identifyEmotion(userMessage)}.`,
        `Let me make sure I understand - you're feeling ${this.identifyEmotion(userMessage)} about ${this.extractKeyPhrase(userMessage)}?`,
        `I'm picking up that ${this.extractKeyPhrase(userMessage)} is really affecting you.`,
        `What I'm hearing is that ${this.extractKeyPhrase(userMessage)} has been on your mind.`
      ],
      reflection: [
        `What I'm hearing is that ${this.extractKeyPhrase(userMessage)} feels overwhelming right now.`,
        `It seems like you feel ${this.identifyEmotion(userMessage)} when ${this.extractKeyPhrase(userMessage)} happens.`,
        `So you're saying that ${this.extractKeyPhrase(userMessage)} is causing you to feel ${this.identifyEmotion(userMessage)}.`,
        `It sounds like ${this.extractKeyPhrase(userMessage)} brings up some difficult feelings for you.`,
        `I'm reflecting back that ${this.extractKeyPhrase(userMessage)} seems to be a significant concern for you.`
      ],
      validation: [
        `That sounds really difficult to deal with.`,
        `Your feelings about ${this.extractKeyPhrase(userMessage)} are completely valid.`,
        `It makes perfect sense that you'd feel ${this.identifyEmotion(userMessage)} about this situation.`,
        `Anyone would struggle with ${this.extractKeyPhrase(userMessage)} - your reaction is completely normal.`,
        `You're not alone in feeling this way about ${this.extractKeyPhrase(userMessage)}.`,
        `It's understandable that ${this.extractKeyPhrase(userMessage)} would affect you so deeply.`
      ],
      reframing: [
        `Have you considered that ${this.extractKeyPhrase(userMessage)} might also be an opportunity for growth?`,
        `What if we thought about ${this.extractKeyPhrase(userMessage)} as a challenge rather than a threat?`,
        `Another way to look at ${this.extractKeyPhrase(userMessage)} might be as a learning experience.`,
        `Could there be any hidden benefits or lessons in ${this.extractKeyPhrase(userMessage)}?`,
        `What would it look like if ${this.extractKeyPhrase(userMessage)} was actually helping you in some way?`
      ],
      questioning: [
        `What do you think might help you cope with ${this.extractKeyPhrase(userMessage)}?`,
        `How does ${this.extractKeyPhrase(userMessage)} make you feel in your body?`,
        `What would you like to see change about ${this.extractKeyPhrase(userMessage)}?`,
        `When did you first notice ${this.extractKeyPhrase(userMessage)} becoming an issue?`,
        `What resources do you have to help you deal with ${this.extractKeyPhrase(userMessage)}?`,
        `How has ${this.extractKeyPhrase(userMessage)} impacted other areas of your life?`
      ],
      summarizing: [
        `Let me summarize - you're dealing with ${this.extractKeyPhrase(userMessage)} and it's making you feel ${this.identifyEmotion(userMessage)}.`,
        `So far, we've talked about how ${this.extractKeyPhrase(userMessage)} is affecting your daily life.`,
        `The main issue seems to be ${this.extractKeyPhrase(userMessage)} and how it's impacting your wellbeing.`,
        `What I'm hearing is that ${this.extractKeyPhrase(userMessage)} is a central concern that's causing you ${this.identifyEmotion(userMessage)}.`
      ]
    };

    const options = responses[technique];
    return options[Math.floor(Math.random() * options.length)];
  }

  public async generateResponse(userMessage: string): Promise<TherapistResponse> {
    this.context.messageCount++;
    
    const technique = this.selectTechnique(userMessage);
    const baseResponse = this.generateResponseByTechnique(technique, userMessage);
    
    // Add personality-specific modifications
    const personalityModifier = this.getPersonalityModifier();
    const finalResponse = `${baseResponse} ${personalityModifier}`;
    
    this.context.lastTechnique = technique;
    
    return {
      text: finalResponse,
      technique,
      personality: this.config.personality,
      confidence: Math.random() * 0.3 + 0.7 // 0.7-1.0 range
    };
  }

  private getPersonalityModifier(): string {
    const modifiers = {
      empathetic: [
        "I'm here to support you through this.",
        "Your feelings matter and are valid.",
        "It takes courage to share these thoughts.",
        "I can sense this is important to you.",
        "Thank you for trusting me with this.",
        "I'm listening and I care about what you're going through."
      ],
      analytical: [
        "Let's explore this step by step.",
        "What patterns do you notice here?",
        "Let's break this down together.",
        "What evidence supports this thought?",
        "How might we approach this systematically?",
        "What factors might be contributing to this?"
      ],
      supportive: [
        "You're doing great by talking about this.",
        "You're stronger than you realize.",
        "Every step forward counts, no matter how small.",
        "You're not alone in feeling this way.",
        "I believe in your ability to work through this.",
        "You're making progress just by being here."
      ],
      challenging: [
        "What steps can you take to address this?",
        "How might you challenge this thought?",
        "What would you tell a friend in this situation?",
        "What's one small action you could take today?",
        "How does holding onto this serve you?",
        "What would change if you let go of this belief?"
      ]
    };
    
    const options = modifiers[this.config.personality];
    return options[Math.floor(Math.random() * options.length)];
  }



  public updateContext(emotion: string, topics: string[]): void {
    this.context.dominantEmotion = emotion;
    this.context.keyTopics = [...new Set([...this.context.keyTopics, ...topics])];
  }

  public getContext(): ConversationContext {
    return { ...this.context };
  }

  public changePersonality(personality: TherapistPersonality): void {
    this.config.personality = personality;
    this.config.responseDelay = this.getResponseDelay(personality);
    this.config.techniques = this.getTechniquesForPersonality(personality);
  }
}

export default TherapistService;