"use client";

import DashboardMenu from "@/components/DashboardMenu";

export default function Dashboard() {
  return (
    <>
      <DashboardMenu />

      <div className="flex h-screen text-black relative">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100"></div>
          <div className="absolute top-0 -left-4 w-72 h-72 sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px] bg-[var(--red-button)] rounded-full mix-blend-multiply filter blur-xl opacity-30 sm:opacity-25 lg:opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 sm:opacity-25 lg:opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 sm:opacity-25 lg:opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <main className="flex-1 overflow-y-auto"></main>
      </div>
    </>
  );
}
