export type Locale = "en" | "ar";

/**
 * Picks the localized field from a record with suffixed columns.
 * pickField({ titleEn: "A", titleAr: "ب" }, "ar", "title") → "ب"
 */
export function pickField<
  T extends Record<string, unknown>,
  K extends string,
>(record: T, locale: Locale, key: K): string {
  const suffix = locale === "ar" ? "Ar" : "En";
  const fieldKey = `${key}${suffix}` as keyof T;
  const fallbackKey = `${key}En` as keyof T;
  const value = record[fieldKey] ?? record[fallbackKey];
  return typeof value === "string" ? value : "";
}

export function dirFor(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function isRtl(locale: Locale) {
  return locale === "ar";
}
