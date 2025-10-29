import { MdDashboard } from "react-icons/md";
import { FaWallet, FaUser } from "react-icons/fa";
import { GiReceiveMoney, GiPayMoney } from "react-icons/gi";
import { IoCalendarNumber } from "react-icons/io5";
import { HiSparkles } from "react-icons/hi2";
import { BsFillGearFill } from "react-icons/bs";

export default function VerticalNavBar() {
  return (
    <nav className="flex flex-col justify-around items-center p-4 h-screen fixed left-0 top-0">
      <div className="flex flex-col gap-5 p-2 rounded-full bg-white/5">
        <MdDashboard className="text-xl cursor-pointer hover:text-red-400 transition" />
        <FaWallet className="text-xl cursor-pointer hover:text-red-400 transition" />
        <GiPayMoney className="text-xl cursor-pointer hover:text-red-400 transition" />
        <GiReceiveMoney className="text-xl cursor-pointer hover:text-red-400 transition" />
        <IoCalendarNumber className="text-xl cursor-pointer hover:text-red-400 transition" />
        <HiSparkles className="text-xl cursor-pointer hover:text-red-400 transition" />
      </div>

      <div className="flex flex-col gap-3 p-2">
        <BsFillGearFill className="text-xl cursor-pointer hover:text-red-400 transition" />
        <FaUser className="text-xl cursor-pointer hover:text-red-400 transition" />
      </div>
    </nav>
  );
}
