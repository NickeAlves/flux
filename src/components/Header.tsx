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
              className="h-14 w-auto sm:h-16 cursor-pointer hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>
        <nav className="hidden md:flex items-center justify-center flex-1 space-x-6 lg:space-x-8">
          <Link
            href="/"
            className="text-sm lg:text-base hover:text-gray-500 transition-colors"
          >
            Home
          </Link>
          <Link
            href="#"
            className="text-sm lg:text-base hover:text-gray-500 transition-colors"
          >
            About
          </Link>
          <Link
            href="#"
            className="text-sm lg:text-base hover:text-gray-500 transition-colors"
          >
            Contact
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link
            href="/login"
            className="hidden sm:block bg-[var(--red-button)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--red-hover)] transition-colors"
          >
            Login
          </Link>
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
