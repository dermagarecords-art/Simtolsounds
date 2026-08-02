import type { MetadataRoute } from "next";
import { releases } from "@/data/releases";

const baseUrl = "https://simtolsounds.site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/catalogue`, changeFrequency: "monthly", priority: 0.8 },
    ...releases.map((release) => ({
      url: `${baseUrl}/catalogue/${release.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
