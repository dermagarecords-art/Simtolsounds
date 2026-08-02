import Image from "next/image";
import Link from "next/link";
import { simtolSoundsTypeImage } from "@/data/brandAssets";

type Props = { catalogueNumber: string; title: string };

export function Header({ catalogueNumber, title }: Props) {
  return <header className="player-header">
    <Link href="/" className="wordmark"><Image src="/images/simtol-logo-transparent.png" alt="Simtol Sounds" width={220} height={266} priority /></Link>
    <Image className="header-type" src={simtolSoundsTypeImage} alt="Simtol Sounds" width={2894} height={272} priority unoptimized />
    <div className="header-release"><span>{catalogueNumber}</span><span> / </span><span>{title}</span></div>
  </header>;
}
