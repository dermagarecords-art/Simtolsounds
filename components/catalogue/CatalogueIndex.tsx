import type { Release } from "@/types/release";
import { CatalogueItem } from "@/components/catalogue/CatalogueItem";

export function CatalogueIndex({ releases }: { releases: Release[] }) {
  return <section className="release-grid" aria-label="Release archive">{releases.map((release) => <CatalogueItem key={release.slug} release={release} />)}</section>;
}
