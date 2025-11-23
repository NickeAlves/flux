"use client";

import VerticalNavBar from "@/components/VerticalNavBar";
import Image from "next/image";

export default function GoogleCalendar() {
  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-900 to-slate-900">
      <VerticalNavBar />

      <header className="flex items-center p-6 relative z-50">
        <div className="flex items-center gap-3">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg"
            alt="Google Calendar"
            height={50}
            width={50}
          />
          <p
            className="text-lg font-medium text-white"
            suppressHydrationWarning
          >
            Google Calendar
          </p>
        </div>
      </header>
    </div>
  );
}
