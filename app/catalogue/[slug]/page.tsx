import { notFound } from "next/navigation";
import { InteractiveReleasePlayer } from "@/components/release/InteractiveReleasePlayer";
import { getRelease } from "@/data/releases";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const release = getRelease(slug);
  return release
    ? {
        title: release.title,
        description: "EU, a four-track compilation by Atmaji Pradjnawicaksana, Egi Hisni, Alfian Adzani, and Alyuadi. Released by Simtol Sounds in Bandung.",
        alternates: {
          canonical: `https://simtolsounds.site/catalogue/${release.slug}`,
        },
        openGraph: { title: `${release.title} — Simtol Sounds`, images: [{ url: release.coverImage, width: 900, height: 900, alt: `${release.title} by Simtol Sounds` }] },
      }
    : { title: "Release unavailable" };
}

export default async function ReleasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const release = getRelease(slug);
  if (!release) notFound();
  return <InteractiveReleasePlayer release={release} releasePage />;
}
