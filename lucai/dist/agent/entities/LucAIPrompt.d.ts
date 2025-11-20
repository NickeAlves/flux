export declare class LucAIPrompt {
    private userMessage;
    private aiResponse;
    private timestamp;
    constructor(userMessage: string, aiResponse: string);
    getUserMessage(): string;
    setUserMessage(userMessage: string): void;
    getAiResponse(): string;
    setAiRespons(aiResponse: string): void;
    getTimestamp(): Date;
    setTimestamp(timestamp: Date): void;
}
