import api from "@/services/api";
import { UUID } from "crypto";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Balance {
  id: UUID;
  userId: UUID;
  totalIncome: number;
  totalExpense: number;
  currentBalance: number;
  calculatedAt: string;
  createdAt: string;
}

interface ChartDataPoint {
  date: string;
  income: number;
  expense: number;
  balance: number;
}

interface TooltipPayloadItem {
  value: number;
  name: string;
  dataKey: string;
  color: string;
  payload: ChartDataPoint;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl z-50">
        <p className="text-white font-bold mb-3 border-b border-white/10 pb-2">
          {label}
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
            <p className="text-gray-300 text-sm">
              Income:
              <span className="text-white font-mono ml-1">
                $
                {payload
                  .find((p) => p.dataKey === "income")
                  ?.value.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  }) ?? "0.00"}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]"></div>
            <p className="text-gray-300 text-sm">
              Expense:
              <span className="text-white font-mono ml-1">
                $
                {payload
                  .find((p) => p.dataKey === "expense")
                  ?.value.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  }) ?? "0.00"}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]"></div>
            <p className="text-gray-300 text-sm">
              Balance:
              <span className="text-white font-mono ml-1">
                $
                {payload
                  .find((p) => p.dataKey === "balance")
                  ?.value.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  }) ?? "0.00"}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function GridBalanceDashboard() {
  const [balanceData, setBalanceData] = useState<Balance | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await api.getCurrentBalance();
        setBalanceData(data);
        generateChartData(data);
      } catch (err) {
        console.error("Error while get current balance:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const generateChartData = (balance: Balance | null) => {
    if (!balance) return;

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const data: ChartDataPoint[] = [];

    let currentVirtualBalance = balance.currentBalance * 0.4;

    for (let i = 0; i < 12; i++) {
      const monthProgress = (i + 1) / 12;

      const income = (balance.totalIncome / 12) * (0.8 + Math.random() * 0.4);
      const expense = (balance.totalExpense / 12) * (0.8 + Math.random() * 0.4);

      currentVirtualBalance = currentVirtualBalance + income - expense;

      data.push({
        date: months[i],
        income: income,
        expense: expense,
        balance: Math.abs(currentVirtualBalance),
      });
    }

    setChartData(data);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 w-full">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold text-white">Transaction Activity</h1>

        <div className="flex gap-4 text-sm bg-white/5 p-2 rounded-full px-4 border border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            <span className="text-white/70 text-xs">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
            <span className="text-white/70 text-xs">Expense</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
            <span className="text-white/70 text-xs">Balance</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 w-full min-w-0 h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="rgba(255,255,255,0.3)"
                style={{ fontSize: "12px" }}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="rgba(255,255,255,0.3)"
                style={{ fontSize: "12px" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }}
              />

              <Area
                type="monotone"
                dataKey="income"
                stroke="#22c55e"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorIncome)"
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#ef4444"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorExpense)"
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorBalance)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-4 w-full lg:w-[300px] shrink-0">
          <div className="bg-linear-to-br from-white/5 to-transparent rounded-2xl p-5 border border-white/5 flex-1 flex flex-col justify-center hover:border-white/10 transition-colors">
            <p className="text-white/50 text-xs uppercase tracking-wider font-semibold mb-2">
              Average Income
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-green-400">$</span>
              <p className="text-white text-3xl font-bold tracking-tight">
                {balanceData
                  ? (balanceData.totalIncome / 12).toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })
                  : "0"}
              </p>
            </div>
          </div>

          <div className="bg-linear-to-br from-white/5 to-transparent rounded-2xl p-5 border border-white/5 flex-1 flex flex-col justify-center hover:border-white/10 transition-colors">
            <p className="text-white/50 text-xs uppercase tracking-wider font-semibold mb-2">
              Average Expense
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-red-400">$</span>
              <p className="text-white text-3xl font-bold tracking-tight">
                {balanceData
                  ? (balanceData.totalExpense / 12).toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })
                  : "0"}
              </p>
            </div>
          </div>

          <div className="bg-linear-to-br from-blue-500/10 to-transparent rounded-2xl p-5 border border-blue-500/20 flex-1 flex flex-col justify-center hover:border-blue-500/30 transition-colors">
            <p className="text-blue-200/70 text-xs uppercase tracking-wider font-semibold mb-2">
              Net Monthly
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-blue-400">$</span>
              <p className={`text-3xl font-bold tracking-tight text-white`}>
                {balanceData
                  ? (
                      (balanceData.totalIncome - balanceData.totalExpense) /
                      12
                    ).toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })
                  : "0"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
