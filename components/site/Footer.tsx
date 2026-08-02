import Link from "next/link";
import Image from "next/image";
import { euTypeImage } from "@/data/brandAssets";
import { featuredRelease } from "@/data/releases";

export function Footer() {
  return <footer className="site-footer">
    <nav className="footer-group" aria-label="Catalogue and purchase links">
      <Link href="/catalogue">CATALOGUE</Link>
      <a href={featuredRelease.bandcampUrl} target="_blank" rel="noreferrer">BANDCAMP</a>
    </nav>
    <Image className="footer-mark" src={euTypeImage} alt="EU" width={3972} height={2395} unoptimized />
    <nav className="footer-group footer-group-right" aria-label="Social and contact links">
      <a href="https://www.instagram.com/simtolsounds/" target="_blank" rel="noreferrer">INSTAGRAM</a>
      <a href="mailto:simtolsounds@gmail.com">EMAIL</a>
    </nav>
  </footer>;
}
