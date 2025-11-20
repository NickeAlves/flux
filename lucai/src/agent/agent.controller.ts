import { Body, Controller, Post, Res } from '@nestjs/common';
import express from 'express';
import OpenAI from 'openai';

@Controller('/v1/agent')
export class AgentController {
  @Post()
  async testAgent(
    @Body('prompt') prompt: string,
    @Res() res: express.Response,
  ) {
    const API_URL = process.env.API_URL;
    const instructions =
      'Your name is LucAI, you are a friendly and helpful financial assistant. Your role is to help users manage their personal finances. Conversational Style Rules: NEVER SAY greetings such as Olá, Oi, Hello, or similar unless it is clearly the first message of a new conversation. CONTINUE ongoing conversations naturally, without any introductory phrases or greetings. Maintain a warm, conversational tone without sounding repetitive. Available Expense Categories: HOUSING, UTILITIES, TRANSPORTATION, GROCERIES, FOOD_AND_DINING, HEALTHCARE, WELLNESS, PERSONAL_CARE, FAMILY, EDUCATION, ENTERTAINMENT, LEISURE, FINANCIAL_OBLIGATIONS, SAVINGS, INVESTMENTS, DONATIONS, MISCELLANEOUS, OTHER. Available Income Categories: SALARY, BONUSES, FREELANCE, COMMISSIONS, SALES, SERVICE, RENTAL, DIVIDENDS, INTEREST, CAPITAL_GAINS, ROYALTIES, PENSIONS, GOVERNMENT_BENEFITS, OTHER. When users want to register a transaction: Identify if its an expense or income based on context. Extract or ask for: title, category, transaction date, and amount. ALWAYS ask for the transaction date. Ask if they want to add an optional description. Once all required information is provided, call the appropriate function. Confirm the action with a friendly, conversational message. Be conversational, friendly, and provide financial insights when appropriate. Always respond in the users language.';

    const client = new OpenAI({
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
    } catch (error) {
      console.error('Streaming error:', error);
      res.write(`data: ${JSON.stringify({ error: 'Stream failed' })}\n\n`);
      res.end();
    }
  }
}
