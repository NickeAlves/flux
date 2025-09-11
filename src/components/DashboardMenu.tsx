"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import LogoButton from "./LogoButton";
import MenuItem from "./MenuItem";
import ProfileButton from "./ProfileButton";

type DashboardMenuProps = {
  onSelectAction: (key: string) => void;
};

export default function DashboardMenu({ onSelectAction }: DashboardMenuProps) {
  const router = useRouter();

  const menuItems = [
    {
      key: "google_calendar",
      icon: () => (
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg"
          alt="Google Calendar"
          width={20}
          height={20}
          className="h-5 w-5"
        />
      ),
    },
    {
      key: "apple_calendar",
      icon: () => (
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Apple_Calendar_%28iOS%29.svg"
          alt="Apple Calendar"
          width={20}
          height={20}
          className="h-5 w-5"
        />
      ),
    },
    {
      key: "instagram",
      icon: () => (
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"
          alt="Instagram"
          width={20}
          height={20}
          className="h-5 w-5"
        />
      ),
    },
    {
      key: "facebook",
      icon: () => (
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Facebook_icon.svg"
          alt="Facebook"
          width={20}
          height={20}
          className="h-5 w-5"
        />
      ),
    },
    {
      key: "whatsapp",
      icon: () => (
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          width={20}
          height={20}
          className="h-5 w-5"
        />
      ),
    },
    {
      key: "chatgpt",
      icon: () => (
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"
          alt="ChatGPT"
          width={20}
          height={20}
          className="h-5 w-5"
        />
      ),
    },
    { key: "notes", icon: () => <span className="text-lg">📝</span> },
    { key: "calculator", icon: () => <span className="text-lg">🧮</span> },
  ];

  return (
    <aside className="flex lg:flex-col items-center justify-between lg:justify-start h-16 lg:h-screen w-full lg:w-20 bg-white border-t lg:border-t-0 lg:border-r border-gray-200 p-2 lg:p-4 fixed bottom-0 lg:static z-50">
      <div className="flex flex-col mb-6 gap-2">
        <LogoButton onClick={() => onSelectAction("dashboard")} />
        <div className="flex justify-center text-black/30 border-b-1" />
      </div>

      <nav className="flex flex-row lg:flex-col items-center justify-evenly w-full lg:w-auto space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-0 lg:space-y-3 text-sm">
        {menuItems.map((item) => (
          <MenuItem
            key={item.key}
            icon={item.icon}
            onClick={() => onSelectAction(item.key)}
          />
        ))}
      </nav>

      <div className="flex flex-col gap-2 mt-12 mb-6">
        <div className="flex justify-center text-black/30 border-b-1" />
        <ProfileButton onClick={() => router.push("/profile")} />
      </div>
    </aside>
  );
}
