import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

type ProfileButtonProps = {
  onClick: () => void;
};

export default function ProfileButton({ onClick }: ProfileButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
    >
      <FontAwesomeIcon icon={faUser} className="cursor-pointer text-black" />
    </button>
  );
}
