"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CommunityFeed } from "@/components/dashboard/CommunityFeed";
import { DailyCheckCard } from "@/components/dashboard/DailyCheckCard";

// The home route is now the dashboard, not Stage 1 of onboarding — a device
// without a saved profile gets redirected into onboarding instead. This
// check has to run client-side (localStorage), so the page renders nothing
// until it resolves, to avoid a flash of dashboard content for new devices.
export default function DashboardPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const profile = window.localStorage.getItem("bipi_profile");
    if (!profile) {
      router.replace("/onboarding");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) return null;

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-6 p-6">
      <CommunityFeed />
      <DailyCheckCard />
    </main>
  );
}
