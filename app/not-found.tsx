import Link from "next/link";

export default function NotFound() {
  return <main className="not-found"><p>THIS RELEASE IS NOT HERE.</p><Link href="/catalogue">RETURN TO CATALOGUE</Link></main>;
}
