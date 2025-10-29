import VerticalNavBar from "@/components/VerticalNavBar";
import Image from "next/image";
import { IoExitOutline } from "react-icons/io5";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen">
      <VerticalNavBar />

      <div className="flex flex-col flex-1 ml-20">
        <header className="flex flex-row justify-between items-center p-6">
          <div className="flex items-center gap-3">
            <Image
              src="/flux-logo.png"
              alt="logo-flux"
              height={50}
              width={50}
            />
            <p className="text-lg font-medium">Hello, Nicolas!</p>
          </div>
          <IoExitOutline className="text-xl cursor-pointer hover:text-red-400 transition" />
        </header>

        <main className="flex flex-col p-8 justify-center items-center flex-1">
          <div className="w-full max-w-6xl p-8 rounded-3xl bg-white/10">
            <p className="">dashboard</p>
          </div>
        </main>
      </div>
    </div>
  );
}
