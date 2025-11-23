"use client";

import { useEffect, useState } from "react";

import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import api from "@/services/api";
import { UUID } from "crypto";

interface Income {
  id: UUID;
  userId: UUID;
  title: string;
  description: string;
  category: string;
  amount: number;
  transactionDate: string;
}

interface Expense {
  id: UUID;
  userId: UUID;
  title: string;
  description: string;
  category: string;
  amount: number;
  transactionDate: string;
}

export default function GridLastExpensesAndIncomes() {
  const [incomeData, setIncomeData] = useState<Income[]>([]);
  const [expenseData, setExpenseData] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const incomes = await api.getLastIncomes(5);
        setIncomeData(incomes);
        const expenses = await api.getLastExpenses(5);
        setExpenseData(expenses);
      } catch (err) {
        console.error("Error while fetching last incomes and expenses:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="w-full space-y-6">
        <div className="flex flex-row justify-around w-full rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-6">
          <div className="flex flex-col gap-2 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-6">
            <div className="flex flex-row items-center justify-center gap-2">
              <ArrowUpCircle size={24} className="text-green-400" />
              <h1 className="flex flex-row gap-2 text-blue-200/70 text-xs tracking-wider font-semibold">
                Last Incomes
              </h1>
            </div>
          </div>
          <div className="flex flex-col gap-2 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-6">
            <div className="flex flex-row items-center justify-center gap-2">
              <ArrowDownCircle size={24} className="text-red-400" />
              <h1 className="flex flex-row gap-2 text-blue-200/70 text-xs tracking-wider font-semibold">
                Last Expenses
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
