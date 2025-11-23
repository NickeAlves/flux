"use client";

import api from "@/services/api";
import CustomDatePicker from "@/components/CustomDatePicker";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

interface RegisterCredentials {
  name: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  password: string;
  confirmPassword: string;
  profileImageUrl: string;
}

const Register: NextPage = () => {
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    name: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImageUrl: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const checkAuthentication = async () => {
      try {
        const isLogged = await api.isAuthenticated();
        if (isLogged) {
          router.replace("/dashboard");
        }
      } catch (error) {
        console.error("Authentication verification error :", error);
      }
    };

    checkAuthentication();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    if (!credentials.name) {
      setErrorMessage("Please, enter your name.");
      setIsSubmitting(false);
      return;
    }
    if (!credentials.lastName) {
      setErrorMessage("Please, enter your last name.");
      setIsSubmitting(false);
      return;
    }

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(credentials.dateOfBirth)) {
      setErrorMessage("Please enter a valid date of birth. (MM/dd/yyyy).");
      setIsSubmitting(false);
      return;
    }

    if (credentials.password !== credentials.confirmPassword) {
      setErrorMessage("The passwords are not the same.");
      setIsSubmitting(false);
      return;
    }

    if (credentials.password.length < 8) {
      setErrorMessage("Password must be a minimum of 8 characters.");
      setIsSubmitting(false);
      return;
    }

    try {
      await api.register(
        credentials.name,
        credentials.lastName,
        credentials.dateOfBirth,
        credentials.email,
        credentials.password,
        credentials.profileImageUrl
      );

      setSuccessMessage(true);
      setTimeout(() => {
        router.replace("/dashboard");
      }, 1000);
    } catch (error) {
      const err = error as Error;
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Error signing in. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <head>
        <title>Register | Flux</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" type="image/png" sizes="32x32" href="/flux-logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/flux-logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/flux-logo.png" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </head>

      <div className="min-h-screen w-full relative overflow-hidden bg-linear-to-br from-slate-900 via-black/30 to-slate-900">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute top-0 -left-4 w-96 h-96 bg-black rounded-full mix-blend-multiply filter blur-3xl opacity-20 transition-transform duration-3000 ${
              mounted ? "translate-x-12 translate-y-12" : ""
            }`}
          />
          <div
            className={`absolute top-0 -right-4 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transition-transform duration-4000 ${
              mounted ? "-translate-x-12 translate-y-24" : ""
            }`}
          />
          <div
            className={`absolute -bottom-8 left-20 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transition-transform duration-3500 ${
              mounted ? "translate-y-12" : ""
            }`}
          />
        </div>

        {successMessage && (
          <div className="fixed top-8 right-8 z-50 animate-in slide-in-from-top duration-300">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white font-medium">
                Registered in successfully!
              </span>
            </div>
          </div>
        )}

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
          <div
            className={`mb-8 transition-all duration-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
          >
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-3xl blur-lg opacity-60" />
              <div className="relative w-20 h-20 rounded-3xl flex items-center justify-center">
                <Image
                  src="/flux-logo.png"
                  alt="Flux Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <div
            className={`w-full max-w-md transition-all duration-700 delay-150 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-semibold text-white mb-2">
                  Welcome to Flux
                </h2>
                <p className="text-white/60 text-sm">
                  Register your Flux account
                </p>
              </div>

              {errorMessage && (
                <div className="mb-6 p-4 backdrop-blur-xl bg-red-500/10 border border-red-500/30 rounded-2xl">
                  <p className="text-red-300 text-sm text-center">
                    {errorMessage}
                  </p>
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-white/80 mb-2"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={credentials.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-300"
                    placeholder="Your first name"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-white/80 mb-2"
                  >
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={credentials.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-300"
                    placeholder="Your last name"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <div>
                    <CustomDatePicker
                      value={credentials.dateOfBirth}
                      onChange={(date) =>
                        setCredentials((prev) => ({
                          ...prev,
                          dateOfBirth: date,
                        }))
                      }
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white/80 mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={credentials.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-300"
                    placeholder="name@example.com"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-white/80 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={credentials.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pr-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-300"
                      placeholder="••••••••"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors focus:outline-none"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-white/80 mb-2"
                  >
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={credentials.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pr-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-300"
                      placeholder="••••••••"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors focus:outline-none"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 mt-6 text-sm font-semibold text-white rounded-xl transition-all duration-300 transform ${
                    isSubmitting
                      ? "bg-white/10 cursor-not-allowed"
                      : "bg-linear-to-br from-red-600 to-red-600 hover:from-red-500 hover:to-red-500 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
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
                      Registering...
                    </span>
                  ) : (
                    "Register"
                  )}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-transparent text-white/50">
                      or
                    </span>
                  </div>
                </div>

                <p className="text-center text-sm text-white/60">
                  Have a Flux account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-purple-400 hover:text-purple-300 transition-colors duration-200"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </div>

          <div
            className={`mt-8 text-center transition-all duration-700 delay-300 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            <p className="text-white/40 text-xs">
              © 2024 Flux. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
