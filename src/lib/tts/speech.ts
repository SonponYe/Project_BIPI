// Browser-native TTS — no API key, works offline once the page is cached.
// This is the first-pass engine for users who chose "Listen" at onboarding;
// see docs/ARCHITECTURE.md for the planned upgrade to a dedicated
// Ghanaian-language TTS model.
export function speak(text: string, lang: "tw" | "pcm" | "en" = "en") {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  const utterance = new SpeechSynthesisUtterance(text);
  // Twi/Pidgin voices are rarely installed on Android browsers yet, so we
  // fall back to English speech synthesis with the text kept in-language —
  // intelligible for Pidgin, degraded but usable for Twi.
  utterance.lang = lang === "en" ? "en-GH" : "en-US";
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}
