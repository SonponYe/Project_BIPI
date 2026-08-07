"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccessibilityToggle } from "@/components/AccessibilityToggle";

// Primary navigation moved to components/BottomTabBar.tsx (icon tabs,
// matching the reference design) — this top bar is now just the brand mark
// and the high-contrast toggle, which still needs a persistent, findable
// home.
export function NavHeader() {
  const pathname = usePathname();
  if (pathname?.startsWith("/onboarding") || pathname?.startsWith("/partner")) return null;

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-100 bg-white/90 px-4 py-2 backdrop-blur">
      <Link href="/" className="flex items-center gap-2 font-semibold text-pulse-700">
        <Image src="/icons/icon.png" alt="" width={28} height={28} className="rounded-full" />
        BIPI
      </Link>
      <AccessibilityToggle />
    </header>
  );
}
