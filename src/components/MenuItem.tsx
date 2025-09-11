type MenuItemProps = {
  key: string;
  icon: () => React.ReactNode;
  onClick: () => void;
};

export default function MenuItem({ icon, onClick }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center p-1 sm:p-2 rounded-lg cursor-pointer text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
    >
      {icon()}
    </button>
  );
}
