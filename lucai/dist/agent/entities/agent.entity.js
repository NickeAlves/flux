"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = void 0;
class Agent {
    id;
    userId;
    LucAIPrompt;
    longTermContext;
    createdAt;
    updatedAt;
    construnctor(id, userId, LucAIPrompt, longTermContext) {
        this.id = id;
        this.userId = userId;
        this.LucAIPrompt = LucAIPrompt;
        this.longTermContext = longTermContext;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
    getId() {
        return this.id;
    }
    getUserId() {
        return this.userId;
    }
    getLucAIPrompt() {
        return this.LucAIPrompt;
    }
    getLongTermContext() {
        return this.longTermContext;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }
    setLucAIPrompt(LucAIPrompt) {
        this.LucAIPrompt = LucAIPrompt;
        this.updatedAt = new Date();
    }
    setLongTermContext(longTermContext) {
        this.longTermContext = longTermContext;
        this.updatedAt = new Date();
    }
}
exports.Agent = Agent;
//# sourceMappingURL=agent.entity.js.map