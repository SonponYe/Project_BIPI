// Small, consistent line-icon set — same stroke style as BottomTabBar's
// inline SVGs. Replaces emoji (🔥, 🏅) and text-character glyphs (▶, ❚❚)
// used as icons elsewhere, which read as informal/childish rather than a
// professional product.
import type { SVGProps } from "react";

function Icon({ children, ...props }: SVGProps<SVGSVGElement> & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function PlayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M7 5.5v13l11-6.5-11-6.5Z" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function PauseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="7" y="5.5" width="3.5" height="13" rx="1" fill="currentColor" stroke="none" />
      <rect x="13.5" y="5.5" width="3.5" height="13" rx="1" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function SpeakerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
    </Icon>
  );
}

export function SpeakerOffIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      <path d="m16 9 5 6M21 9l-5 6" />
    </Icon>
  );
}

export function FlameIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M12 3c1 3-3 4-3 7.5A3.5 3.5 0 0 0 12 14a3.5 3.5 0 0 0 3-5c1.5 1 2 2.8 2 4.5a5 5 0 0 1-10 0C7 9.5 10.5 8 12 3Z" />
    </Icon>
  );
}

export function MedalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="14.5" r="5.5" />
      <path d="M9 4h6l-2 6.5h-2L9 4Z" />
      <path d="M10.3 12.8 12 14.5l1.7-1.7" />
    </Icon>
  );
}
