"use client";

import { useEffect, useState } from "react";
import { ArrowUpCircle, ArrowDownCircle, Loader2 } from "lucide-react";
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
      setLoading(true);
      try {
        const incomes = await api.getLastMonthIncomes();
        const expenses = await api.getLastMonthExpenses();

        if (!incomes) {
          console.error("Error while fetching last incomes.");
          return null;
        }

        if (!expenses) {
          console.error("Error while fetching last expenses.");
          return null;
        }

        setIncomeData(incomes);
        setExpenseData(expenses);
      } catch (err) {
        console.error("Error while fetching last incomes and expenses:", err);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCategory = (category: string) => {
    if (!category) return "";
    const lower = category.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="bg-slate-900 min-h-screen flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="w-full space-y-6">
        <div className="flex flex-col gap-3 justify-around w-full rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-6">
          <div className="flex flex-col gap-2 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-6">
            <div className="flex flex-row items-center justify-center gap-2">
              <ArrowUpCircle size={24} className="text-green-400" />
              <h1 className="flex flex-row gap-2 text-blue-200/70 text-xs tracking-wider font-semibold">
                Last Incomes
              </h1>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-6 text-blue-200/90 text-xs tracking-wider font-semibold border-b border-white/10 pb-2">
              <h1 className="text-left">Title</h1>
              <h1 className="text-left">Category</h1>
              <h1 className="text-center">Date</h1>
              <h1 className="text-right">Value</h1>
            </div>
            <div className="flex flex-col text-lg font-bold tracking-tight text-white  gap-2 mt-2">
              {incomeData.map((income) => (
                <div
                  key={income.id}
                  className="grid grid-cols-4 gap-4 items-center"
                >
                  <p className="text-left truncate">{income.title}</p>
                  <p className="text-left truncate">
                    {formatCategory(income.category)}
                  </p>
                  <p className="text-center">
                    {formatDate(income.transactionDate)}
                  </p>
                  <p className="text-right text-green-400 font-medium">
                    {formatAmount(income.amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 rounded-3xl  bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-6">
            <div className="flex flex-row items-center justify-center gap-2">
              <ArrowDownCircle size={24} className="text-red-400" />
              <h1 className="flex flex-row gap-2 text-blue-200/70 text-xs tracking-wider font-semibold">
                Last Expenses
              </h1>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-6 text-blue-200/90 text-xs tracking-wider font-semibold border-b border-white/10 pb-2">
              <h1 className="text-left">Title</h1>
              <h1 className="text-left">Category</h1>
              <h1 className="text-center">Date</h1>
              <h1 className="text-right">Value</h1>
            </div>
            <div className="flex flex-col text-lg font-bold tracking-tight text-white gap-2 mt-2">
              {expenseData.map((expense) => (
                <div
                  key={expense.id}
                  className="grid grid-cols-4 gap-4 items-center"
                >
                  <p className="text-left truncate">{expense.title}</p>
                  <p className="text-left truncate">
                    {formatCategory(expense.category)}
                  </p>
                  <p className="text-center">
                    {formatDate(expense.transactionDate)}
                  </p>
                  <p className="text-right text-red-400 font-medium">
                    {formatAmount(expense.amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
