import Link from "next/link";
import type { Release } from "@/types/release";
import { ReleaseCover } from "@/components/release/ReleaseCover";

export function CatalogueItem({ release }: { release: Release }) {
  return <article className="release-index">
    <Link href={`/catalogue/${release.slug}`} className="cover-link" aria-label={`Open ${release.title}`}><ReleaseCover release={release} /></Link>
    <div className="release-index-meta">
      <Link href={`/catalogue/${release.slug}`}>{release.title}</Link>
      <Link href={`/catalogue/${release.slug}`}>{release.catalogueNumber}</Link>
      <span>{release.label}</span>
      <span>{release.location}</span>
    </div>
  </article>;
}
