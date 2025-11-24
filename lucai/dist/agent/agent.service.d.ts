import OpenAI from 'openai';
export declare class AgentService {
    private client;
    constructor();
    generateStream(prompt: string, instructions: string): Promise<import("openai/core/streaming.js").Stream<OpenAI.Chat.Completions.ChatCompletionChunk> & {
        _request_id?: string | null;
    }>;
}
