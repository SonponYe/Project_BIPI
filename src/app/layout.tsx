import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SessionTracker } from "@/components/SessionTracker";

export const metadata: Metadata = {
  title: "BIPI — Ghana's Ecological Pulse",
  description: "Know the signs. Act before the crisis.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0f766e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <SessionTracker />
        {children}
      </body>
    </html>
  );
}
