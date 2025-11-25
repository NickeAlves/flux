"use client";

import { useEffect, useState } from "react";
import VerticalNavBar from "@/components/VerticalNavBar";
import { UUID } from "crypto";
import Image from "next/image";
import api from "@/services/api";
import { Loader2, Wallet, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import GridBalanceDashboard from "@/components/Dashboard/GridBalanceDashboard";
import GridLastExpensesAndIncomes from "@/components/Dashboard/GridLastExpensesAndIncomes";

interface UserData {
  id: UUID;
  name: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
  age: number;
  profileImageUrl: string;
}

interface Balance {
  id: UUID;
  userId: UUID;
  totalIncome: number;
  totalExpense: number;
  currentBalance: number;
  calculatedAt: string;
  createdAt: string;
}

export default function Dashboard() {
  const [balanceData, setBalanceData] = useState<Balance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await api.getCurrentBalance();
        setBalanceData(data);
      } catch (err) {
        console.error("Error while get current balance:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [user] = useState<UserData | null>(() => {
    if (typeof window === "undefined") return null;
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      try {
        return JSON.parse(userDataString);
      } catch (error) {
        console.error("Error parsing user data:", error);
        return null;
      }
    }
    return null;
  });

  if (loading) {
    return (
      <div className="bg-slate-900 min-h-screen flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <>
      <head>
        <title>Dashboard | Flux</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" type="image/png" sizes="32x32" href="/flux-logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/flux-logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/flux-logo.png" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </head>

      <div className="flex min-h-screen bg-slate-900 pt-12 text-white">
        <VerticalNavBar />

        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex flex-row justify-between items-center p-8">
            <div className="flex items-center gap-3">
              <Image
                src="/flux-logo.png"
                alt="logo-flux"
                height={40}
                width={40}
              />
              <p
                className="text-xl font-medium text-white"
                suppressHydrationWarning
              >
                Hello, {user?.name}!
              </p>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden group hover:bg-white/10 transition-all">
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all"></div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-black/40 rounded-2xl border border-white/10">
                    <Wallet size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm font-medium">
                      Total Balance
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      $
                      {balanceData?.currentBalance?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      }) ?? "0.00"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden group hover:bg-white/10 transition-all">
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-red-500/20 rounded-full blur-3xl group-hover:bg-red-500/30 transition-all"></div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-black/40 rounded-2xl border border-white/10">
                    <ArrowDownCircle size={24} className="text-red-400" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm font-medium">
                      Total Expenses
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      $
                      {balanceData?.totalExpense?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      }) ?? "0.00"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden group hover:bg-white/10 transition-all">
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-green-500/20 rounded-full blur-3xl group-hover:bg-green-500/30 transition-all"></div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-black/40 rounded-2xl border border-white/10">
                    <ArrowUpCircle size={24} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm font-medium">
                      Total Incomes
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      $
                      {balanceData?.totalIncome?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      }) ?? "0.00"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-6">
              <GridBalanceDashboard />
            </div>
            <div>
              <GridLastExpensesAndIncomes />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
