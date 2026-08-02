import Link from "next/link";
import { featuredRelease } from "@/data/releases";

export function Footer() {
  return <footer className="site-footer">
    <span>SIMTOL SOUNDS</span>
    <Link href="/catalogue">CATALOGUE</Link>
    <a href={featuredRelease.bandcampUrl} target="_blank" rel="noreferrer">BANDCAMP</a>
    <a href="https://www.instagram.com/simtolsounds/" target="_blank" rel="noreferrer">INSTAGRAM</a>
    <a href="mailto:simtolsounds@gmail.com">EMAIL</a>
    <span>BANDUNG, INDONESIA</span>
  </footer>;
}
