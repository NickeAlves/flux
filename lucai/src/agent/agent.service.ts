import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AgentService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.API_URL,
    });
  }

  async generateStream(prompt: string, instructions: string) {
    return this.client.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: instructions },
        { role: 'user', content: prompt },
      ],
      stream: true,
    });
  }
}
