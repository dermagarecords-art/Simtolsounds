import { featuredRelease } from "@/data/releases";
import { InteractiveReleasePlayer } from "@/components/release/InteractiveReleasePlayer";

export const metadata = {
  alternates: {
    canonical: "https://simtolsounds.site/",
  },
};

export default function HomePage() {
  return <InteractiveReleasePlayer release={featuredRelease} />;
}
