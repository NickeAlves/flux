import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-3xl mb-8 mx-auto text-gray-900 font-medium">
            All-in-one. <br />
            All in <strong className="text-[var(--red-button)]">flux</strong>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-[var(--red-button)] text-white px-8 py-3 rounded-lg hover:bg-[var(--red-hover)] transition-colors text-center"
            >
              Get Started
            </Link>
            <Link
              href="#about"
              className="border border-gray-300 text-black text-xs sm:text-sm lg:text-base px-8 py-3 rounded-lg hover:bg-black hover:text-white transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
        <section id="about"></section>
        <section id="features">
          <div className="flex items-center justify-center mt-8">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg"
              alt="google-calendar-icon"
              width={200}
              height={200}
              className="h-12 w-auto sm:h-14 md:h-16 hover:opacity-80 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Apple_Calendar_%28iOS%29.svg"
              alt="apple-calendar-icon"
              width={200}
              height={200}
              className="h-12 w-auto sm:h-14 md:h-16 hover:opacity-80 transition-opacity"
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
