import en from "@/i18n/en.json";
import pcm from "@/i18n/pcm.json";
import tw from "@/i18n/tw.json";
import type { Language } from "@/types/user";

const dictionaries = { en, pcm, tw };

export function t(key: keyof typeof en, language: Language): string {
  const dict = dictionaries[language] as Record<string, string>;
  return dict[key] || dictionaries.en[key] || key;
}
