type MobileHeaderProps = {
  onMenuToggle: () => void;
};

export default function MobileHeader({ onMenuToggle }: MobileHeaderProps) {
  return (
    <div className="lg:hidden sticky top-0 z-20 bg-gray-50/80 backdrop-blur border-b border-gray-200 px-3 py-2 flex items-center gap-2">
      <button
        type="button"
        onClick={onMenuToggle}
        className="p-2 rounded-md border border-gray-200 bg-white active:scale-95"
        aria-label="Open menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path
            fillRule="evenodd"
            d="M3.75 6.75a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div className="font-medium">Dashboard</div>
    </div>
  );
}
