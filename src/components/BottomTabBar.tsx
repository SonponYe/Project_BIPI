"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Icon-driven bottom navigation, replacing text links in the old top nav —
// small inline SVGs rather than adding an icon library dependency this
// late, since these five are all this app needs.
const TABS = [
  {
    href: "/",
    label: "Home",
    icon: (
      <path d="M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
    ),
  },
  {
    href: "/tracks",
    label: "Tracks",
    icon: <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15ZM4 20.5A2.5 2.5 0 0 1 6.5 18H20" />,
  },
  {
    href: "/leaderboard",
    label: "Leaderboard",
    icon: (
      <>
        <path d="M8 21h8M12 17v4" />
        <path d="M7 4h10v6a5 5 0 0 1-10 0V4Z" />
        <path d="M7 6H4a2 2 0 0 0 2 4M17 6h3a2 2 0 0 1-2 4" />
      </>
    ),
  },
  {
    href: "/journal",
    label: "Journal",
    icon: <path d="M5 4h11l3 3v13H5V4Zm11 0v3h3M9 12h6M9 16h6" />,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c1.2-3.5 4-5.5 7-5.5s5.8 2 7 5.5" />
      </>
    ),
  },
];

// Hidden during onboarding (the 2-screen wizard shouldn't have nav chrome)
// and on the partner dashboard (which has its own header/audience).
export function BottomTabBar() {
  const pathname = usePathname();
  if (pathname?.startsWith("/onboarding") || pathname?.startsWith("/partner")) return null;

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-gray-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      {TABS.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium text-gray-400"
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                isActive ? "bg-pulse-500 text-white" : "text-gray-400"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                {tab.icon}
              </svg>
            </span>
            <span className={isActive ? "text-pulse-700" : ""}>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
