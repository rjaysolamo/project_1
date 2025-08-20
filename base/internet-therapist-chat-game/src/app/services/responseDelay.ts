export interface DelayConfig {
  baseDelay: number; // Base delay in milliseconds
  variability: number; // Random variability factor (0-1)
  readingSpeed: number; // Words per minute reading speed
  typingSpeed: number; // Words per minute typing speed
}

export class ResponseDelaySimulator {
  private config: DelayConfig;

  constructor(config: Partial<DelayConfig> = {}) {
    this.config = {
      baseDelay: 1000, // 1 second base delay
      variability: 0.3, // 30% variability
      readingSpeed: 200, // 200 WPM reading
      typingSpeed: 40, // 40 WPM typing
      ...config
    };
  }

  /**
   * Calculate realistic response delay based on message length and complexity
   */
  calculateDelay(userMessage: string, responseMessage: string): number {
    const userWordCount = this.countWords(userMessage);
    const responseWordCount = this.countWords(responseMessage);

    // Time to read user message
    const readingTime = (userWordCount / this.config.readingSpeed) * 60 * 1000;
    
    // Time to "think" (processing time)
    const thinkingTime = this.config.baseDelay + (userWordCount * 50);
    
    // Time to "type" response
    const typingTime = (responseWordCount / this.config.typingSpeed) * 60 * 1000;

    // Total delay with some randomness
    const totalDelay = readingTime + thinkingTime + typingTime;
    const randomFactor = 1 + (Math.random() - 0.5) * this.config.variability;
    
    return Math.max(500, Math.min(8000, totalDelay * randomFactor)); // Min 0.5s, max 8s
  }

  /**
   * Create a delay promise that resolves after the calculated time
   */
  async simulateDelay(userMessage: string, responseMessage: string): Promise<void> {
    const delay = this.calculateDelay(userMessage, responseMessage);
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Get typing indicator duration (shorter than full delay)
   */
  getTypingIndicatorDelay(userMessage: string, responseMessage: string): number {
    const fullDelay = this.calculateDelay(userMessage, responseMessage);
    return Math.max(800, fullDelay * 0.7); // Show typing for 70% of total delay
  }

  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Update delay configuration
   */
  updateConfig(newConfig: Partial<DelayConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  getConfig(): DelayConfig {
    return { ...this.config };
  }
}

// Default instance
export const defaultDelaySimulator = new ResponseDelaySimulator();