"use client";

import Link from "next/link";
import CustomDatePicker from "@/components/CustomDatePicker";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "next/dist/server/api-utils";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Not is the same passwords.");
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
      setIsSubmitting(false);
      return;
    }

    const phoneRegex =
      /^\+?\d{1,4}?[\s-]?\(?\d{1,4}?\)?[\s-]?\d{3}[\s-]?\d{3,4}$/;
    if (!phoneRegex.test(formData.phone)) {
      setErrorMessage("Por favor, introduce un número de teléfono válido.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.identificationNumber) {
      setErrorMessage(
        "Por favor, introduce un DNI, Pasaporte o NIE válido (ej: 12345678Z o X1234567L)."
      );
      setIsSubmitting(false);
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.dateOfBirth)) {
      setErrorMessage(
        "Por favor, introduce una fecha de nacimiento válida (YYYY-MM-DD)."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      await api.register(formData);
      setSuccessMessage(true);
      setTimeout(() => {
        router.push("/cesta");
      }, 1000);
    } catch (error) {
      const err = error as Error;
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Error al creatu conta. Inténtalo de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-var(--background)">
      <main className="w-full max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome!</h1>
            <p className="text-gray-600">Register your Flux account</p>
          </div>

          <form className="space-y-6">
            <div>
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Last name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your last name"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Date of birth
              </label>
              <div>
                <CustomDatePicker
                  value={formData.dateOfBirth}
                  onChange={(date) =>
                    setFormData((prev) => ({ ...prev, dateOfBirth: date }))
                  }
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm password
              </label>
              <input
                type="password"
                id="confirmpassword"
                name="confirmpassword"
                required
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--red-button)] hover:bg-[var(--red-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Register
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in here
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
