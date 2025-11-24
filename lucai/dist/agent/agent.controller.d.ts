import express from 'express';
import { AgentService } from './agent.service';
export declare class AgentController {
    private readonly agentService;
    constructor(agentService: AgentService);
    agent(prompt: string, res: express.Response): Promise<void>;
}
