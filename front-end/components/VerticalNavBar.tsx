"use client";

import {
  Home,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  Sparkles,
  Settings,
  User,
  LogOut,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function VerticalNavBar() {
  const pathname = usePathname();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await api.logout();
      setSuccessMessage(true);
      setTimeout(() => {
        router.replace("/");
      }, 1000);
    } catch (error) {
      const err = error as Error;
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Error while trying to logout. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      {successMessage && (
        <div className="fixed top-8 right-8 z-50 animate-in slide-in-from-top duration-300">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white font-medium">
              Logged out successfully!
            </span>
          </div>
        </div>
      )}
      {errorMessage && (
        <div className="mb-6 p-4 backdrop-blur-xl bg-red-500/10 border border-red-500/30 rounded-2xl">
          <p className="text-red-300 text-sm text-center">{errorMessage}</p>
        </div>
      )}
      <nav className="flex flex-col justify-between items-center py-3 px-2 h-[600px] backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl">
        <div className="flex flex-col gap-1">
          <Link href="/dashboard" aria-label="Dashboard">
            <NavItem
              icon={<Home size={20} />}
              label="Dashboard"
              isActive={pathname === "/dashboard"}
            />
          </Link>

          <Link href="/balance" aria-label="Balance">
            <NavItem
              icon={<Wallet size={20} />}
              label="Balance"
              isActive={pathname === "/balance"}
            />
          </Link>

          <Link href="/expenses" aria-label="Expenses">
            <NavItem
              icon={<ArrowUpCircle size={20} />}
              label="Expenses"
              isActive={pathname === "/expenses"}
            />
          </Link>

          <Link href="/incomes" aria-label="Incomes">
            <NavItem
              icon={<ArrowDownCircle size={20} />}
              label="Incomes"
              isActive={pathname === "/incomes"}
            />
          </Link>

          <Link href="/google-calendar" aria-label="Google Calendar">
            <NavItem
              icon={<Calendar size={20} />}
              label="Google Calendar"
              isActive={pathname === "/google-calendar"}
            />
          </Link>

          <Link href="/lucai" aria-label="LucAI">
            <NavItem
              icon={<Sparkles size={20} />}
              label="LucAI"
              isActive={pathname === "/lucai"}
            />
          </Link>
        </div>

        <div className="flex flex-col gap-1 pt-3 border-t border-white/10">
          <Link href="/settings" aria-label="Settings">
            <NavItem
              icon={<Settings size={20} />}
              label="Settings"
              isActive={pathname === "/settings"}
            />
          </Link>
          <Link href="/profile" aria-label="Profile">
            <NavItem
              icon={<User size={20} />}
              label="Profile"
              isActive={pathname === "/profile"}
            />
          </Link>
          <div className="group relative">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isSubmitting}
              className={`p-3 rounded-xl transition-all duration-200 ease-out ${
                isSubmitting
                  ? "bg-white/10 cursor-not-allowed text-white/50"
                  : "text-white/70 hover:text-white hover:bg-white/10 active:scale-95"
              }`}
            >
              {isSubmitting ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <LogOut size={20} />
              )}
            </button>

            <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-800/95 backdrop-blur-sm text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-lg border border-white/10 pointer-events-none">
              Logout
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-800/95"></div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function NavItem({ icon, label, isActive }: NavItemProps) {
  return (
    <div className="group relative">
      <button
        className={`p-3 rounded-xl transition-all duration-200 ease-out ${
          isActive
            ? "bg-white/20 text-white shadow-lg cursor-default"
            : "text-white/70 hover:text-white hover:bg-white/10 active:scale-95"
        }`}
        disabled={isActive}
      >
        {icon}
      </button>

      <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-800/95 backdrop-blur-sm text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-lg border border-white/10 pointer-events-none">
        {label}
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-800/95"></div>
      </div>
    </div>
  );
}
