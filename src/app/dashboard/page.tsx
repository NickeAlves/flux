"use client";

import { useState } from "react";
import DashboardMenu from "@/components/DashboardMenu";
import DashboardGrid from "@/components/DashboardGrid";
import AppPage from "@/components/AppPage";
import MobileHeader from "@/components/MobileHeader";
import Calculator from "@/components/Calculator";
import NotesApp from "@/components/NotesApp";

export default function Dashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardGrid onAppSelect={setActivePage} />;
      case "google_calendar":
        return (
          <AppPage
            appKey="google_calendar"
            title="Google Calendar"
            iconSrc="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg"
            alt="Google Calendar"
          />
        );
      case "apple_calendar":
        return (
          <AppPage
            appKey="apple_calendar"
            title="Apple Calendar"
            iconSrc="https://upload.wikimedia.org/wikipedia/commons/5/5e/Apple_Calendar_%28iOS%29.svg"
            alt="Apple Calendar"
          />
        );
      case "instagram":
        return (
          <AppPage
            appKey="instagram"
            title="Instagram"
            iconSrc="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"
            alt="Instagram"
          />
        );
      case "facebook":
        return (
          <AppPage
            appKey="facebook"
            title="Facebook"
            iconSrc="https://upload.wikimedia.org/wikipedia/commons/1/1b/Facebook_icon.svg"
            alt="Facebook"
          />
        );
      case "whatsapp":
        return (
          <AppPage
            appKey="whatsapp"
            title="WhatsApp"
            iconSrc="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp"
          />
        );
      case "chatgpt":
        return (
          <AppPage
            appKey="chatgpt"
            title="ChatGPT"
            iconSrc="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"
            alt="ChatGPT"
          />
        );
      case "notes":
        return <NotesApp />;
      case "calculator":
        return <Calculator />;
      default:
        return <div className="p-6">Selecione uma opção no menu</div>;
    }
  };

  return (
    <div className="flex h-screen text-black relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px] bg-[var(--red-button)] rounded-full mix-blend-multiply filter blur-xl opacity-30 sm:opacity-25 lg:opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 sm:opacity-25 lg:opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 sm:opacity-25 lg:opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div
        className={`fixed inset-0 bg-black/30 z-30 lg:hidden transition-opacity ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <DashboardMenu
          onSelectAction={(page) => {
            setActivePage(page);
            setSidebarOpen(false);
          }}
        />
      </div>

      <main className="flex-1 overflow-y-auto">
        <MobileHeader onMenuToggle={() => setSidebarOpen((v) => !v)} />
        {renderContent()}
      </main>
    </div>
  );
}
