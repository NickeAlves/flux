import Image from "next/image";
import AppCard from "./AppCard";

type DashboardGridProps = {
  onAppSelect: (appKey: string) => void;
};

export default function DashboardGrid({ onAppSelect }: DashboardGridProps) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Apps</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        <AppCard
          label="Google Calendar"
          onClick={() => onAppSelect("google_calendar")}
        >
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg"
            alt="Google Calendar"
            width={80}
            height={80}
            className="h-12 w-auto"
          />
        </AppCard>
        <AppCard
          label="Apple Calendar"
          onClick={() => onAppSelect("apple_calendar")}
        >
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Apple_Calendar_%28iOS%29.svg"
            alt="Apple Calendar"
            width={80}
            height={80}
            className="h-12 w-auto"
          />
        </AppCard>
        <AppCard
          label="Instagram"
          onClick={() => onAppSelect("instagram")}
        >
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"
            alt="Instagram"
            width={80}
            height={80}
            className="h-12 w-auto"
          />
        </AppCard>
        <AppCard
          label="Facebook"
          onClick={() => onAppSelect("facebook")}
        >
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Facebook_icon.svg"
            alt="Facebook"
            width={80}
            height={80}
            className="h-12 w-auto"
          />
        </AppCard>
        <AppCard
          label="WhatsApp"
          onClick={() => onAppSelect("whatsapp")}
        >
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp"
            width={80}
            height={80}
            className="h-12 w-auto"
          />
        </AppCard>
        <AppCard 
          label="ChatGPT" 
          onClick={() => onAppSelect("chatgpt")}
        >
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"
            alt="ChatGPT"
            width={80}
            height={80}
            className="h-12 w-auto"
          />
        </AppCard>
        <AppCard 
          label="Notes" 
          onClick={() => onAppSelect("notes")}
        >
          📝
        </AppCard>
        <AppCard
          label="Calculator"
          onClick={() => onAppSelect("calculator")}
        >
          🧮
        </AppCard>
      </div>
    </div>
  );
}
