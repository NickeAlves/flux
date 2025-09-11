"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-6 text-black">
        <Image
          src="/assets/flux-logo.png"
          alt="Flux"
          width={200}
          height={200}
          className="h-16 w-auto sm:h-20 md:h-20 hover:opacity-80 transition-opacity invert"
        />
        <h1 className="font-bold text-3xl">404 - Page Not Found</h1>
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Back to Home
        </Link>
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
        >
          ← Back
        </button>
      </div>
    </>
  );
};

export default NotFound;
