"use client";

import { useEffect, useState } from "react";
import VerticalNavBar from "@/components/VerticalNavBar";
import { UUID } from "crypto";
import Image from "next/image";
import api from "@/services/api";
import { Loader2, Wallet, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import GridBalanceDashboard from "@/components/GridBalanceDashboard";
import GridLastExpenses from "@/components/GridLastExpenses";
import GridLastIncomes from "@/components/GridLastIncomes";

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
    if (typeof window === "undefined") {
      return null;
    }

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
      <div>
        <div className="flex justify-center items-center py-10">
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        </div>
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

      <div className="flex min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
        <VerticalNavBar />
        <div className="flex flex-col flex-1">
          <header className="flex flex-row justify-between items-center p-6">
            <div className="flex items-center gap-3">
              <Image
                src="/flux-logo.png"
                alt="logo-flux"
                height={50}
                width={50}
              />
              <p
                className="text-lg font-medium text-white"
                suppressHydrationWarning
              >
                Hello, {user?.name}!
              </p>
            </div>
          </header>
          <div className="flex flex-row pr-8 gap-6">
            <div className="relative flex-1 pr-8 p-4 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
              <div className="absolute -top-6 left-8 bg-linear-to-br from-purple-500 to-blue-500 p-2 rounded-2xl shadow-xl border border-white/20">
                <Wallet size={20} className="text-white" />
              </div>

              <div className="pt-2">
                <p className="text-white text-xl">
                  Total balance: <br />
                </p>
                <p>
                  ${" "}
                  {balanceData?.currentBalance?.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  }) ?? "00.00"}
                </p>
              </div>
            </div>

            <div className="relative flex-1 pr-8 p-4 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
              <div className="absolute -top-6 left-8 bg-linear-to-br from-purple-500 to-blue-500 p-2 rounded-2xl shadow-xl border border-white/20">
                <ArrowUpCircle size={20} className="text-white" />
              </div>

              <div className="pt-2">
                <p className="text-white text-xl">
                  Total expenses: <br />
                </p>
                <p>
                  ${" "}
                  {balanceData?.totalExpense?.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  }) ?? "00.00"}
                </p>
              </div>
            </div>

            <div className="relative flex-1 pr-8 p-4 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
              <div className="absolute -top-6 left-8 bg-linear-to-br from-purple-500 to-blue-500 p-2 rounded-2xl shadow-xl border border-white/20">
                <ArrowDownCircle size={20} className="text-white" />
              </div>

              <div className="pt-2">
                <p className="text-white text-xl">
                  Total incomes: <br />
                </p>
                <p>
                  ${" "}
                  {balanceData?.totalIncome?.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  }) ?? "00.00"}
                </p>
              </div>
            </div>
          </div>

          <main className="flex flex-row p-12 w-full h-full">
            <div className="flex p-6 flex-row justify-center gap-3 w-full h-full rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
              <GridBalanceDashboard /> <GridLastExpenses /> <GridLastIncomes />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
