import Image from "next/image";
import type { Release } from "@/types/release";

export function ReleaseCover({ release }: { release: Release }) {
  return <Image src={release.coverImage} alt={`${release.title} release artwork`} width={900} height={900} sizes="(max-width: 700px) 90vw, 48vw" priority />;
}
