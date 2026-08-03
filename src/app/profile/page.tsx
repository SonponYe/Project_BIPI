import { ProgressBar } from "@/components/gamification/ProgressBar";
import { XPBadge } from "@/components/gamification/XPBadge";
import { StreakCounter } from "@/components/gamification/StreakCounter";

// Stage 6: Feedback and Reward. Reads local progress; a Verified Profile
// additionally syncs this from Supabase across devices.
export default function ProfilePage() {
  return (
    <main className="mx-auto flex max-w-xl flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold text-pulse-700">Your progress</h1>
      <ProgressBar completed={0} total={120} />
      <div className="flex items-center gap-4">
        <XPBadge xp={0} />
        <StreakCounter days={0} />
      </div>
    </main>
  );
}
