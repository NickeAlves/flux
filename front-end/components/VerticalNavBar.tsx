import {
  Home,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  Sparkles,
  Settings,
  User,
} from "lucide-react";

export default function VerticalNavBar() {
  return (
    <div className="flex items-center justify-center min-h-screen from-slate-900 via-slate-800 to-slate-900 p-8">
      <nav className="flex flex-col justify-between items-center py-3 px-2 h-[600px] backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl">
        <div className="flex flex-col gap-1">
          <NavItem icon={<Home size={20} />} label="Dashboard" />
          <NavItem icon={<Wallet size={20} />} label="Balance" />
          <NavItem icon={<ArrowUpCircle size={20} />} label="Expenses" />
          <NavItem icon={<ArrowDownCircle size={20} />} label="Incomes" />
          <NavItem icon={<Calendar size={20} />} label="Google Calendar" />
          <NavItem icon={<Sparkles size={20} />} label="LucAI" />
        </div>

        <div className="flex flex-col gap-1 pt-3 border-t border-white/10">
          <NavItem icon={<Settings size={20} />} label="Settings" />
          <NavItem icon={<User size={20} />} label="Profile" />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ icon, label }) {
  return (
    <div className="group relative">
      <button className="p-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 ease-out active:scale-95">
        {icon}
      </button>

      <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-800/95 backdrop-blur-sm text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-lg border border-white/10 pointer-events-none">
        {label}
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-800/95"></div>
      </div>
    </div>
  );
}
