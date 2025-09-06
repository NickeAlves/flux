import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to{" "}
            <strong className="text-[var(--red-button)]">Flux</strong>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            All-in-one. All in Flux.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="bg-[var(--red-button)] text-white px-8 py-3 rounded-lg hover:bg-[var(--red-hover)] transition-colors text-center"
            >
              Get Started
            </Link>
            <button className="border border-gray-300 px-8 py-3 rounded-lg hover:bg-white/15 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
