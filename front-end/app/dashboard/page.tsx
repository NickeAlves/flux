"use client";

import VerticalNavBar from "@/components/VerticalNavBar";
import { UUID } from "crypto";
import Image from "next/image";
import { useState } from "react";

interface userData {
  id: UUID;
  name: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
  age: number;
  profileImageUrl: string;
}

export default function Dashboard() {
  const [user] = useState<userData | null>(() => {
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

  return (
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

        <main className="flex flex-col p-8 justify-center items-center flex-1">
          <div className="w-full max-w-6xl p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
            <p className="text-white">dashboard</p>
          </div>
        </main>
      </div>
    </div>
  );
}
