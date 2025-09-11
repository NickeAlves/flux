import Image from "next/image";

export const menuItems = [
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
