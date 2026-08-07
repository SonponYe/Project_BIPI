"use client";

import { useEffect, useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// Time-of-day greeting rather than a name-based one ("Hey, Ethan!") — BIPI
// deliberately never collects a name (Guest Profiles are anonymous by
// design), so a warm, personal-feeling header has to come from context, not
// identity.
export function GreetingHeader() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  const greeting = now ? getGreeting(now.getHours()) : "Welcome back";
  const dateLabel = now
    ? now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })
    : "Know the signs. Act before the crisis.";

  return (
    <header className="flex items-center justify-between gap-2">
      <div>
        <h1 className="text-2xl font-bold text-pulse-800">{greeting}</h1>
        <p className="text-sm text-gray-500">{dateLabel}</p>
      </div>
      <SpeakButton text={`${greeting}. ${dateLabel}.`} />
    </header>
  );
}
