"use client";

import api from "@/services/api";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface LoginCredentials {
  email: string;
  password: string;
}

const Login: NextPage = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const router = useRouter();

  useEffect(() => {
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
  }, []);

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

    try {
      await api.login(credentials.email, credentials.password);
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
        <title>Sign in | Flux</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" type="image/png" sizes="32x32" href="/flux-logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/flux-logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/flux-logo.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <header></header>
      {successMessage && (
        <div className="fixed top-4 md:top-20 right-4 p-3 text-white bg-green-500 rounded-lg shadow-lg transition-opacity duration-200 animate-fade-out z-50">
          Logged in successfully!
        </div>
      )}
      <div className="flex justify-center items-center">
        <Image src="/flux-logo.png" alt="logo-flux" height={50} width={50} />
      </div>

      <div className="flex justify-center md:items-center p-2 ">
        <div className="w-full max-w-md ">
          <div className="bg-white p-6 rounded-lg shadow-lg shadow-gray-950">
            <h2 className="text-center text-2xl font-bold text-black/80 mb-6">
              Log in
            </h2>

            {errorMessage && (
              <div className="mb-4 p-3 text-sm text-red-500 bg-red-500/10 rounded-md">
                {errorMessage}
              </div>
            )}
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-800 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={credentials.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm text-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-800 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  minLength={8}
                  value={credentials.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm text-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2.5 mt-2 text-sm font-medium text-white/80 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 focus:ring-offset-gray-800 ${
                  isSubmitting
                    ? "bg-gray-800"
                    : "bg-gray-800 hover:bg-gray-900 transition-colors"
                }`}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>

              <p className="text-center text-sm text-gray-800 mt-4">
                Don&apos;t have a Flux account?{" "}
                <Link
                  href="/register"
                  className="font-medium text-gray-800 hover:text-indigo-900 underline"
                >
                  Create a Flux account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
