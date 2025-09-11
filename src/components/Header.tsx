import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/assets/flux-logo.png"
              alt="Flux"
              width={200}
              height={200}
              className="h-12 w-auto sm:h-14 md:h-16 cursor-pointer hover:opacity-80 transition-opacity invert"
            />
          </Link>
        </div>
        <nav className="flex items-center justify-center flex-1 space-x-3 sm:space-x-4 md:space-x-6 lg:space-x-8">
          <Link
            href="/"
            className="text-black text-xs sm:text-sm lg:text-base hover:text-gray-500 transition-colors"
          >
            Home
          </Link>
          <Link
            href="#about"
            className="text-black text-xs sm:text-sm lg:text-base hover:text-gray-500 transition-colors"
          >
            About
          </Link>
          <Link
            href="#features"
            className="text-black text-xs sm:text-sm lg:text-base hover:text-gray-500 transition-colors"
          >
            Features
          </Link>
        </nav>
        <div className="flex items-center">
          <Link
            href="/login"
            className="bg-[var(--red-button)] text-white px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded text-xs sm:text-sm font-medium hover:bg-[var(--red-hover)] transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
