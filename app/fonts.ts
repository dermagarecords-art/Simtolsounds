import localFont from "next/font/local";

export const gotham = localFont({
  src: [
    { path: "../public/fonts/iciel-gotham/iCiel-Gotham-Medium.ttf.woff", weight: "500", style: "normal" },
    { path: "../public/fonts/iciel-gotham/iCiel-Gotham-Ultra.ttf.woff", weight: "800", style: "normal" },
  ],
  display: "swap",
  variable: "--font-gotham-local",
  fallback: ["Arial", "Helvetica", "sans-serif"],
  adjustFontFallback: false,
});
