import type { Release } from "@/types/release";

export const releases: Release[] = [
  {
    slug: "eu",
    title: "EU",
    catalogueNumber: "SS-001",
    coverImage: "/images/releases/eu/cover.jpg",
    year: "2026",
    location: "Bandung, Indonesia",
    label: "Simtol Sounds",
    bandcampUrl:
      "https://simtolsounds.bandcamp.com/album/eu?search_item_id%3D2203674936%26search_item_type%3Da%26search_match_part%3D%253F%26search_page_id%3D5624204496%26search_page_no%3D0%26search_rank%3D1=",
    featured: true,
    credits: [
      "All tracks composed and mixed by the respective artists.",
      "Mastered by Alyuadi Febriansyah.",
      "Released by Simtol Sounds.",
      "Bandung, Indonesia.",
    ],
    visualConfig: {
      desktopFocalPoint: [0.5, 0.42],
      mobileFocalPoint: [0.48, 0.34],
    },
    tracks: [
      {
        number: "01",
        artist: "Atmaji Pradjnawicaksana",
        title: "Another Graphic Imbalance",
        audioSource: "/audio/eu/01-another-graphic-imbalance.mp3",
        direction: "northwest",
        blobPath:
          "M100 23C127 27 129 57 149 70C173 86 184 110 171 137C158 164 147 188 118 194C84 201 79 170 54 153C28 136 21 113 27 86C34 57 65 59 77 36C83 25 90 21 100 23Z",
      },
      {
        number: "02",
        artist: "Egi Hisni",
        title: "NYONG BA-",
        audioSource: "/audio/eu/02-nyong-ba.mp3",
        direction: "northeast",
        blobPath:
          "M103 17C133 17 144 46 159 68C178 96 181 119 166 145C149 171 118 160 92 151C68 143 35 139 26 114C18 89 47 75 61 57C75 38 78 18 103 17Z",
      },
      {
        number: "03",
        artist: "Alfian Adzani",
        title: "Gore-Jat",
        audioSource: "/audio/eu/03-gore-jat.mp3",
        direction: "southwest",
        blobPath:
          "M43 29C66 17 106 13 135 20C166 28 183 52 174 79C167 100 184 128 166 153C149 177 121 158 93 165C68 170 48 180 33 160C21 144 30 119 20 98C8 73 15 45 43 29Z",
      },
      {
        number: "04",
        artist: "Alyuadi",
        title: "mencari",
        audioSource: "/audio/eu/04-mencari.mp3",
        direction: "southeast",
        blobPath:
          "M111 17C141 19 145 49 160 69C178 91 193 117 177 140C164 159 140 159 119 175C94 193 72 174 53 158C35 142 19 123 29 99C37 80 59 78 69 59C81 37 84 16 111 17Z",
      },
    ],
  },
];

export const featuredRelease = releases.find((release) => release.featured) ?? releases[0];

export function getRelease(slug: string) {
  return releases.find((release) => release.slug === slug);
}
