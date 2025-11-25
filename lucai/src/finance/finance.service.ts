import { Injectable } from '@nestjs/common';

@Injectable()
export class FinanceService {
  constructor(
    private balance: BalanceService,
    private expenses: ExpenseService,
    private incomes: IncomeService,
  ) {}
}
