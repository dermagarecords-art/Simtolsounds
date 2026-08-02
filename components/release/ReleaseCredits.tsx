import type { Release } from "@/types/release";

export function ReleaseCredits({ release }: { release: Release }) {
  return <section className="release-notes" aria-label="Release details">
    <div><span className="meta-label">{release.catalogueNumber}</span><span>{release.year}</span><span>{release.label}</span></div>
    <div className="credits">{release.credits.map((credit) => <p key={credit}>{credit}</p>)}</div>
    <a className="bandcamp-link" href={release.bandcampUrl} target="_blank" rel="noreferrer">BUY ON BANDCAMP ↗</a>
  </section>;
}
