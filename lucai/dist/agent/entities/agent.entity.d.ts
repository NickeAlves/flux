import { UUID } from 'crypto';
export declare class Agent {
    private id;
    private userId;
    private LucAIPrompt;
    private longTermContext;
    private createdAt;
    private updatedAt;
    construnctor(id: UUID, userId: UUID, LucAIPrompt: string[], longTermContext: string): void;
    getId(): UUID;
    getUserId(): UUID;
    getLucAIPrompt(): string[];
    getLongTermContext(): string;
    getCreatedAt(): Date;
    getUpdatedAt(): Date;
    setLucAIPrompt(LucAIPrompt: string[]): void;
    setLongTermContext(longTermContext: string): void;
}
