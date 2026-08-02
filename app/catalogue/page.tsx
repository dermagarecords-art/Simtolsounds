import Link from "next/link";
import { releases } from "@/data/releases";
import { Footer } from "@/components/site/Footer";
import { CatalogueIndex } from "@/components/catalogue/CatalogueIndex";

export const metadata = { title: "Catalogue" };

export default function CataloguePage() {
  return (
    <main className="catalogue-page">
      <header className="catalogue-header">
        <Link href="/" className="wordmark">SIMTOL SOUNDS</Link>
        <span>CATALOGUE / ARCHIVE</span>
      </header>
      <CatalogueIndex releases={releases} />
      <Footer />
    </main>
  );
}
