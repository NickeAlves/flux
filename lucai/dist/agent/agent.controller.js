"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentController = void 0;
const common_1 = require("@nestjs/common");
const express_1 = __importDefault(require("express"));
const openai_1 = __importDefault(require("openai"));
let AgentController = class AgentController {
    async testAgent(prompt, res) {
        const API_URL = process.env.API_URL;
        const instructions = 'Your name is LucAI, you are a friendly and helpful financial assistant. Your role is to help users manage their personal finances. Conversational Style Rules: NEVER SAY greetings such as Olá, Oi, Hello, or similar unless it is clearly the first message of a new conversation. CONTINUE ongoing conversations naturally, without any introductory phrases or greetings. Maintain a warm, conversational tone without sounding repetitive. Available Expense Categories: HOUSING, UTILITIES, TRANSPORTATION, GROCERIES, FOOD_AND_DINING, HEALTHCARE, WELLNESS, PERSONAL_CARE, FAMILY, EDUCATION, ENTERTAINMENT, LEISURE, FINANCIAL_OBLIGATIONS, SAVINGS, INVESTMENTS, DONATIONS, MISCELLANEOUS, OTHER. Available Income Categories: SALARY, BONUSES, FREELANCE, COMMISSIONS, SALES, SERVICE, RENTAL, DIVIDENDS, INTEREST, CAPITAL_GAINS, ROYALTIES, PENSIONS, GOVERNMENT_BENEFITS, OTHER. When users want to register a transaction: Identify if its an expense or income based on context. Extract or ask for: title, category, transaction date, and amount. ALWAYS ask for the transaction date. Ask if they want to add an optional description. Once all required information is provided, call the appropriate function. Confirm the action with a friendly, conversational message. Be conversational, friendly, and provide financial insights when appropriate. Always respond in the users language.';
        const client = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY?.toString(),
            baseURL: API_URL,
        });
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        try {
            const stream = await client.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: instructions },
                    { role: 'user', content: prompt },
                ],
                stream: true,
            });
            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || '';
                if (content) {
                    res.write(`data: ${JSON.stringify({ content })}\n\n`);
                }
            }
            res.write('data: [DONE]\n\n');
            res.end();
        }
        catch (error) {
            console.error('Streaming error:', error);
            res.write(`data: ${JSON.stringify({ error: 'Stream failed' })}\n\n`);
            res.end();
        }
    }
};
exports.AgentController = AgentController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)('prompt')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "testAgent", null);
exports.AgentController = AgentController = __decorate([
    (0, common_1.Controller)('/v1/agent')
], AgentController);
//# sourceMappingURL=agent.controller.js.map