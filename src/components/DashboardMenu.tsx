import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardMenu() {
  const currentPath = usePathname();

  const isActive = (path: string) => currentPath === path;

  const navItems = [
    {
      href: "/dashboard",
      src: "https://www.svgrepo.com/show/459911/dashboard.svg",
      alt: "dashboard-image",
      className:
        "w-5 sm:w-6 invert transition-all duration-300 ease-in-out hover:invert-0",
    },
    {
      href: "/google-calendar",
      src: "https://www.svgrepo.com/show/353803/google-calendar.svg",
      alt: "google-calendar-image",
      className: "w-5 sm:w-6",
    },
    {
      href: "/instagram",
      src: "https://www.svgrepo.com/show/521711/instagram.svg",
      alt: "instagram-image",
      className:
        "w-5 sm:w-6 invert transition-all duration-300 ease-in-out hover:invert-0",
    },
    {
      href: "/facebook",
      src: "https://www.svgrepo.com/show/503338/facebook.svg",
      alt: "facebook-image",
      className:
        "w-5 sm:w-6 invert transition-all duration-300 ease-in-out hover:invert-0",
    },
    {
      href: "/whatsapp",
      src: "https://www.svgrepo.com/show/513060/whatsapp-128.svg",
      alt: "whatsapp-image",
      className:
        "w-4 sm:w-5 invert transition-all duration-300 ease-in-out hover:invert-0",
    },
    {
      href: "/gemini",
      src: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Google-gemini-icon.svg",
      alt: "gemini-image",
      className:
        "w-4 sm:w-5 transition-all duration-300 ease-in-out hover:invert-0",
    },
    {
      href: "/notes",
      src: "https://www.svgrepo.com/show/522208/note-text.svg",
      alt: "note-image",
      className:
        "w-4 sm:w-5 invert transition-all duration-300 ease-in-out hover:invert-0",
    },
    {
      href: "/calculator",
      src: "https://www.svgrepo.com/show/504193/calculator-plus.svg",
      alt: "calculator-image",
      className:
        "w-4 sm:w-5 invert transition-all duration-300 ease-in-out hover:invert-0",
    },
  ];

  return (
    <header className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-3">
      <div className="flex items-center justify-between">
        <Link href="/dashboard">
          <Image
            src="/assets/flux-logo.png"
            alt="Flux"
            width={200}
            height={200}
            className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto cursor-pointer hover:opacity-80 transition-opacity invert"
          />
        </Link>

        <nav className="hidden sm:flex items-center gap-2 md:gap-4 p-1 px-3 md:px-4 justify-center rounded-full bg-black">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-2 py-1 transition-all duration-300 ease-in-out hover:bg-white hover:text-black hover:shadow-md hover:scale-110 ${
                  active ? "bg-white text-black shadow-md" : ""
                }`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={200}
                  height={200}
                  className={
                    active
                      ? item.className
                          .replace("invert", "")
                          .replace("hover:invert-0", "")
                      : item.className
                  }
                />
              </Link>
            );
          })}
        </nav>

        <nav className="sm:hidden flex items-center gap-1 p-1 px-2 justify-center rounded-full bg-black overflow-x-auto max-w-[60vw]">
          {navItems.slice(0, 5).map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-1.5 py-1 transition-all duration-300 ease-in-out hover:bg-white hover:text-black hover:shadow-md flex-shrink-0 ${
                  active ? "bg-white text-black shadow-md" : ""
                }`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={200}
                  height={200}
                  className={
                    active
                      ? item.className
                          .replace("invert", "")
                          .replace("hover:invert-0", "")
                      : item.className
                  }
                />
              </Link>
            );
          })}
        </nav>

        <Link
          href="/profile"
          className={`w-8 sm:w-10 rounded-full transition-all duration-300 ease-in-out hover:bg-black hover:text-white hover:shadow-md hover:scale-110 ${
            isActive("/profile")
              ? "bg-black text-white shadow-md scale-110"
              : ""
          }`}
        >
          <Image
            src="https://www.svgrepo.com/show/486506/user-profile-filled.svg"
            alt="profile"
            width={200}
            height={200}
            className={`w-8 sm:w-10 transition-all duration-300 ease-in-out ${
              isActive("/profile") ? "invert" : "hover:invert"
            }`}
          />
        </Link>
      </div>
    </header>
  );
}
