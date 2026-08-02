import type { Metadata } from "next";
import "./globals.css";
import { gotham } from "./fonts";

export const metadata: Metadata = {
  metadataBase: new URL("https://simtolsounds.site"),
  title: {
    default: "Simtol Sounds",
    template: "%s — Simtol Sounds",
  },
  alternates: {
    canonical: "/",
  },
  description: "EU, a four-track compilation by Atmaji Pragiwaksono, Egi Hisni, Alfian Adzani, and Alyuadi. Released by Simtol Sounds in Bandung.",
  openGraph: {
    title: "Simtol Sounds",
    description: "EU, a four-track compilation by Atmaji Pragiwaksono, Egi Hisni, Alfian Adzani, and Alyuadi. Released by Simtol Sounds in Bandung.",
    url: "/",
    siteName: "Simtol Sounds",
    locale: "en_ID",
    type: "website",
    images: [{ url: "/images/releases/eu/cover.jpg", width: 900, height: 900, alt: "EU by Simtol Sounds" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Simtol Sounds",
    description: "EU, a four-track compilation by Atmaji Pragiwaksono, Egi Hisni, Alfian Adzani, and Alyuadi. Released by Simtol Sounds in Bandung.",
    images: ["/images/releases/eu/cover.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={gotham.variable}>{children}</body>
    </html>
  );
}
