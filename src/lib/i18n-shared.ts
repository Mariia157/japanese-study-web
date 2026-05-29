export type Locale = "en" | "uk";
export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "EN" },
  { code: "uk", label: "Українська", flag: "UK" },
];
export const LOCALE_COOKIE = "locale";

export type Vars = Record<string, string | number>;

export function format(template: string, vars?: Vars): string {
  if (!vars) return template;
  let s = template;
  for (const [k, v] of Object.entries(vars)) {
    s = s.replaceAll(`{${k}}`, String(v));
  }
  return s;
}

/** Pick the right field for the current locale. Falls back to `en` if `uk` is empty/null. */
export function pickL<T>(locale: Locale, en: T, uk: T | null | undefined): T {
  if (locale === "uk" && uk !== null && uk !== undefined && uk !== ("" as unknown as T)) return uk;
  return en;
}
