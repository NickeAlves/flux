"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LucAIPrompt = void 0;
class LucAIPrompt {
    userMessage;
    aiResponse;
    timestamp;
    constructor(userMessage, aiResponse) {
        this.userMessage = userMessage;
        this.aiResponse = aiResponse;
        this.timestamp = new Date();
    }
    getUserMessage() {
        return this.userMessage;
    }
    setUserMessage(userMessage) {
        this.userMessage = userMessage;
    }
    getAiResponse() {
        return this.aiResponse;
    }
    setAiRespons(aiResponse) {
        this.aiResponse = aiResponse;
    }
    getTimestamp() {
        return this.timestamp;
    }
    setTimestamp(timestamp) {
        this.timestamp = timestamp;
    }
}
exports.LucAIPrompt = LucAIPrompt;
//# sourceMappingURL=LucAIPrompt.js.map