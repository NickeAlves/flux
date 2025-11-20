import { UUID } from 'crypto';

export class Agent {
  private id: UUID;
  private userId: UUID;
  private LucAIPrompt: string[];
  private longTermContext: string;
  private createdAt: Date;
  private updatedAt: Date;

  construnctor(
    id: UUID,
    userId: UUID,
    LucAIPrompt: string[],
    longTermContext: string,
  ) {
    this.id = id;
    this.userId = userId;
    this.LucAIPrompt = LucAIPrompt;
    this.longTermContext = longTermContext;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  getId(): UUID {
    return this.id;
  }

  getUserId(): UUID {
    return this.userId;
  }

  getLucAIPrompt(): string[] {
    return this.LucAIPrompt;
  }

  getLongTermContext(): string {
    return this.longTermContext;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  setLucAIPrompt(LucAIPrompt: string[]): void {
    this.LucAIPrompt = LucAIPrompt;
    this.updatedAt = new Date();
  }

  setLongTermContext(longTermContext: string): void {
    this.longTermContext = longTermContext;
    this.updatedAt = new Date();
  }
}
