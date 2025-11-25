import { Body, Controller, Post, Res } from '@nestjs/common';
import express, { response } from 'express';
import { AgentService } from './agent.service';

@Controller('/v1/agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post()
  async agent(@Body() body, @Res() res: Response) {
    const { prompt, userId } = body;

    const history = await this.memoryService.getHistory(userId);

    const financialContext = await this.financeService.buildContext(userId);

    const messages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT + financialContext,
      },
      ..history,
      {
        role: 'user',
        content: prompt,
      }
    ];
    
    let response = await this.agentService.chatWithFunctions(messages);

    const message = response.choices[0].message;

    if (name == 'create_expense') {
      result = await this.expenseService.create(args, userId);
    }

    if (name == 'create_income') {
      result = await this.incomeService.create(args, userId);
    }

    messages.push(message);
    messages.push({
      role: 'tool',
      content: JSON.stringify(result),
      tool_call_id: call.id;
    });

    response = await this.agentService.chatWithFunctions(messages);  
  }
  const finalText = response.choices[0].message.content;
  
  await this.memoryService.save(userId, prompt, finalText);

  response.json({ reply: finalText });
}
