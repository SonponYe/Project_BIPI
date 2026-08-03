// Separate, partner-facing shell (pitch Section 7). Regular users never see
// this; institutional partners authenticate here via a distinct login from
// the main app's zero-login-wall onboarding.
export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-3">
        <span className="font-semibold text-pulse-700">BIPI Pulse — Partner Dashboard</span>
      </header>
      {children}
    </div>
  );
}
