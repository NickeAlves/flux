import Image from "next/image";

type AppPageProps = {
  appKey: string;
  title: string;
  iconSrc: string;
  alt: string;
};

export default function AppPage({ appKey, title, iconSrc, alt }: AppPageProps) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <Image
        src={iconSrc}
        alt={alt}
        width={120}
        height={120}
        className="h-16 w-auto"
      />
    </div>
  );
}
