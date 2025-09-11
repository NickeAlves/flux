import Image from "next/image";

type LogoButtonProps = {
  onClick: () => void;
};

export default function LogoButton({ onClick }: LogoButtonProps) {
  return (
    <button
      onClick={onClick}
      className="hidden lg:flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
    >
      <Image
        src="https://www.svgrepo.com/show/459911/dashboard.svg"
        alt="Flux"
        width={200}
        height={200}
        className="h-6 w-auto sm:h-6 md:h-8 cursor-pointer hover:opacity-80 transition-opacity"
      />
    </button>
  );
}
