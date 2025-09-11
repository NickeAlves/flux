type AppCardProps = {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
};

export default function AppCard({ label, children, onClick }: AppCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 p-4 cursor-pointer bg-transparent border border-gray-200 rounded-lg hover:bg-white/50 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
    >
      <div className="h-12 flex items-center">{children}</div>
      <div className="text-sm text-gray-700">{label}</div>
    </button>
  );
}
