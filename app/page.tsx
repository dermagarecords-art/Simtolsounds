import { featuredRelease } from "@/data/releases";
import { InteractiveReleasePlayer } from "@/components/release/InteractiveReleasePlayer";

export default function HomePage() {
  return <InteractiveReleasePlayer release={featuredRelease} />;
}
