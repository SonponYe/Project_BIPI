"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/tracks", label: "Tracks" },
  { href: "/profile", label: "Profile" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/journal", label: "Journal" },
];

// Hidden during onboarding (the 2-screen wizard shouldn't have nav chrome
// pulling focus) and on the partner dashboard (which has its own header).
export function NavHeader() {
  const pathname = usePathname();
  if (pathname?.startsWith("/onboarding") || pathname?.startsWith("/partner")) return null;

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
      <Link href="/" className="font-semibold text-pulse-700">
        BIPI
      </Link>
      <nav className="flex gap-4 text-sm text-gray-600">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-pulse-700">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
