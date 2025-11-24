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
  Menu,
  X,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function VerticalNavBar() {
  const pathname = usePathname();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <div
        className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-2xl bg-white/10 border-b border-white/20 shadow-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <h1 className="text-white font-bold text-xl">Flux</h1>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={closeMenu}
        />
      )}

      <div
        className={`lg:hidden fixed top-0 right-0 bottom-0 w-64 z-50 backdrop-blur-2xl bg-white/10 border-l border-white/20 shadow-2xl transform transition-transform duration-300 ease-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-semibold text-lg">Menu</h2>
            <button
              onClick={closeMenu}
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>

          {successMessage && (
            <div className="mb-4 animate-in slide-in-from-top duration-300">
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white text-sm font-medium">
                  Logged out successfully!
                </span>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 backdrop-blur-xl bg-red-500/10 border border-red-500/30 rounded-2xl">
              <p className="text-red-300 text-xs text-center">{errorMessage}</p>
            </div>
          )}

          <nav className="flex flex-col justify-between flex-1">
            <div className="flex flex-col gap-2">
              <Link href="/dashboard" onClick={closeMenu}>
                <MobileNavItem
                  icon={<Home size={20} />}
                  label="Dashboard"
                  isActive={pathname === "/dashboard"}
                />
              </Link>

              <Link href="/balance" onClick={closeMenu}>
                <MobileNavItem
                  icon={<Wallet size={20} />}
                  label="Balance"
                  isActive={pathname === "/balance"}
                />
              </Link>

              <Link href="/expenses" onClick={closeMenu}>
                <MobileNavItem
                  icon={<ArrowUpCircle size={20} />}
                  label="Expenses"
                  isActive={pathname === "/expenses"}
                />
              </Link>

              <Link href="/incomes" onClick={closeMenu}>
                <MobileNavItem
                  icon={<ArrowDownCircle size={20} />}
                  label="Incomes"
                  isActive={pathname === "/incomes"}
                />
              </Link>

              <Link href="/google-calendar" onClick={closeMenu}>
                <MobileNavItem
                  icon={<Calendar size={20} />}
                  label="Google Calendar"
                  isActive={pathname === "/google-calendar"}
                />
              </Link>

              <Link href="/lucai" onClick={closeMenu}>
                <MobileNavItem
                  icon={<Sparkles size={20} />}
                  label="LucAI"
                  isActive={pathname === "/lucai"}
                />
              </Link>
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
              <Link href="/settings" onClick={closeMenu}>
                <MobileNavItem
                  icon={<Settings size={20} />}
                  label="Settings"
                  isActive={pathname === "/settings"}
                />
              </Link>

              <Link href="/profile" onClick={closeMenu}>
                <MobileNavItem
                  icon={<User size={20} />}
                  label="Profile"
                  isActive={pathname === "/profile"}
                />
              </Link>

              <button
                onClick={handleLogout}
                disabled={isSubmitting}
                className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 ${
                  isSubmitting
                    ? "bg-white/10 cursor-not-allowed text-white/50"
                    : "text-white/70 hover:text-white hover:bg-white/10"
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
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      <div className="hidden lg:flex items-start justify-center p-8 relative z-100">
        <div
          className={`fixed transition-all duration-300 ${
            scrolled ? "top-4" : "top-8"
          }`}
        >
          {successMessage && (
            <div className="absolute -top-20 left-0 right-0 animate-in slide-in-from-top duration-300">
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

          <nav className="flex flex-col justify-between items-center py-3 px-2 h-[600px] backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl relative z-10">
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

                <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-800/95 backdrop-blur-sm text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-lg border border-white/10 pointer-events-none z-9999">
                  Logout
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-800/95"></div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
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

      <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-800/95 backdrop-blur-sm text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-lg border border-white/10 pointer-events-none z-9999">
        {label}
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-800/95"></div>
      </div>
    </div>
  );
}

function MobileNavItem({ icon, label, isActive }: NavItemProps) {
  return (
    <div
      className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 ${
        isActive
          ? "bg-white/20 text-white shadow-lg"
          : "text-white/70 hover:text-white hover:bg-white/10"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </div>
  );
}
