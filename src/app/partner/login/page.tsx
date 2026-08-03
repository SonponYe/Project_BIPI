"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Institutional partners (NADMO, EPA Ghana, MoFA, NGOs) authenticate via
// Supabase Auth — a normal email/password login, distinct from the
// device-UUID identity system used by regular learners.
export default function PartnerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.push("/partner/dashboard");
  }

  return (
    <main className="mx-auto flex max-w-sm flex-col gap-3 p-6">
      <h1 className="text-lg font-semibold">Partner login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Institutional email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="rounded-lg bg-pulse-500 px-4 py-2 text-white">
          Log in
        </button>
      </form>
    </main>
  );
}
