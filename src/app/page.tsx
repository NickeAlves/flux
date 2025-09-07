import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";

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
              href="/login"
              className="bg-[var(--red-button)] text-white px-8 py-3 rounded-lg hover:bg-[var(--red-hover)] transition-colors text-center"
            >
              Get Started
            </Link>
            <button className="border border-gray-300 text-black text-xs sm:text-sm lg:text-base px-8 py-3 rounded-lg bg-white hover:bg-white/15 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
