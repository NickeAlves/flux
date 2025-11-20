export class LucAIPrompt {
  private userMessage: string;
  private aiResponse: string;
  private timestamp: Date;

  constructor(userMessage: string, aiResponse: string) {
    this.userMessage = userMessage;
    this.aiResponse = aiResponse;
    this.timestamp = new Date();
  }

  getUserMessage(): string {
    return this.userMessage;
  }

  setUserMessage(userMessage: string): void {
    this.userMessage = userMessage;
  }

  getAiResponse(): string {
    return this.aiResponse;
  }

  setAiRespons(aiResponse: string): void {
    this.aiResponse = aiResponse;
  }

  getTimestamp(): Date {
    return this.timestamp;
  }

  setTimestamp(timestamp: Date): void {
    this.timestamp = timestamp;
  }
}
