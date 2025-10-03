import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Header />
      <main className="w-full max-w-7xl mx-auto px-4 py-12">
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
        <div className="text-center mt-12">
          <p className="mb-8 mx-auto text-black font-md max-w-2xl">
            The essential work tools that help you solve problems and stay
            organized effortlessly.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 justify-items-center max-w-4xl mx-auto">
          <div className="flex gap-2 p-6 rounded-md shadow-2xl shadow-black border border-gray-300 hover:bg-white/50 hover:transition-colors hover:duration-200">
            <Image
              src="https://www.svgrepo.com/show/353803/google-calendar.svg"
              alt="google-calendar"
              width={200}
              height={200}
              className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto hover:opacity-80 transition-opacity"
            />
            <h1 className="text-2xl text-black">Google Calendar</h1>
          </div>
          <div className="flex gap-2 p-6 rounded-md shadow-2xl shadow-black border border-gray-300 hover:bg-white/50 hover:transition-colors hover:duration-200">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/960px-Instagram_icon.png"
              alt="instagram"
              width={200}
              height={200}
              className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto hover:opacity-80 transition-opacity"
            />
            <h1 className="text-2xl text-black">Instagram</h1>
          </div>
          <div className="flex gap-2 p-6 rounded-md shadow-2xl shadow-black border border-gray-300 hover:bg-white/50 hover:transition-colors hover:duration-200">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/960px-Facebook_Logo_%282019%29.png"
              alt="facebook"
              width={200}
              height={200}
              className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto hover:opacity-80 transition-opacity"
            />
            <h1 className="text-2xl text-black">Facebook</h1>
          </div>
          <div className="flex gap-2 p-6 rounded-md shadow-2xl shadow-black border border-gray-300 hover:bg-white/50 hover:transition-colors hover:duration-200">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/2044px-WhatsApp.svg.png"
              alt="whatsapp"
              width={200}
              height={200}
              className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto hover:opacity-80 transition-opacity"
            />
            <h1 className="text-2xl text-black">WhatsApp</h1>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <div className="flex gap-2 p-6 rounded-md shadow-2xl shadow-black border border-gray-300 hover:bg-white/50 hover:transition-colors hover:duration-200">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/8/8f/Google-gemini-icon.svg"
              alt="gemini"
              width={200}
              height={200}
              className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto hover:opacity-80 transition-opacity"
            />
            <h1 className="text-2xl text-black">Gemini</h1>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
