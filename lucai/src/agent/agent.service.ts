import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AgentService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async chatWithFunctions(messages: any[]) {
    return this.client.chat.completions.create({
      model: 'gpt-4.1',
      messages: messages,
      functions: [
        {
          name: 'createExpense',
          description: 'Create a new expense.',
          parameters: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              category: { type: 'string' },
              amount: { type: 'number' },
              transactionDate: { type: 'string', format: 'date-time' },
              description: { type: 'string' },
            },
            required: ['title', 'category', 'amount', 'transactionDate'],
          },
        },
        {
          name: 'createIncome',
          description: 'Create a new income.',
          parameters: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              category: { type: 'string' },
              amount: { type: 'number' },
              transactionDate: { type: 'string', format: 'date-time' },
              description: { type: 'string' },
            },
            required: ['title', 'category', 'amount', 'transactionDate'],
          },
        },
      ],
    });
  }
}
