import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flux",
  description: "All-in-one. All in Flux",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative overflow-hidden`}
      >
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100"></div>
          <div className="absolute top-0 -left-4 w-72 h-72 sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px] bg-[var(--red-button)] rounded-full mix-blend-multiply filter blur-xl opacity-30 sm:opacity-25 lg:opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 sm:opacity-25 lg:opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 sm:opacity-25 lg:opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {children}
      </body>
    </html>
  );
}
