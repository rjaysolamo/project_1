interface VeniceAIConfig {
  apiKey: string;
  baseUrl: string;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface VeniceAIResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
}

class VeniceAIService {
  private config: VeniceAIConfig;

  constructor(config: VeniceAIConfig) {
    this.config = config;
  }

  async generateTherapeuticResponse(
    userMessage: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    try {
      const systemPrompt = {
        role: 'system' as const,
        content: `You are a compassionate and professional AI therapist. Your role is to:
        - Provide supportive, empathetic responses
        - Ask thoughtful questions to help users reflect
        - Offer gentle guidance and coping strategies
        - Maintain appropriate therapeutic boundaries
        - Never provide medical diagnoses or replace professional therapy
        - Keep responses conversational and engaging
        - Focus on mental wellness and self-reflection
        
        Respond in a warm, understanding tone that encourages the user to explore their thoughts and feelings.`
      };

      const messages = [
        systemPrompt,
        ...conversationHistory,
        { role: 'user' as const, content: userMessage }
      ];

      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instruct',
          messages: messages,
          max_tokens: 300,
          temperature: 0.7,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Venice AI API error: ${response.status} ${response.statusText}`);
      }

      const data: VeniceAIResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from Venice AI');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('Venice AI Service Error:', error);
      
      // Fallback response if API fails
      return "I'm here to listen and support you. Could you tell me more about what's on your mind today?";
    }
  }

  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Singleton instance
let veniceAIInstance: VeniceAIService | null = null;

export function initializeVeniceAI(apiKey: string): VeniceAIService {
  const config: VeniceAIConfig = {
    apiKey,
    baseUrl: 'https://api.venice.ai/api/v1'
  };
  
  veniceAIInstance = new VeniceAIService(config);
  return veniceAIInstance;
}

export function getVeniceAI(): VeniceAIService | null {
  return veniceAIInstance;
}

export type { ChatMessage, VeniceAIConfig };
export { VeniceAIService };