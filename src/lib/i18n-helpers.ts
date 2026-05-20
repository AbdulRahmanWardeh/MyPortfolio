export type Locale = "en" | "ar";

/**
 * Picks the localized field from a record with suffixed columns.
 * pickField({ titleEn: "A", titleAr: "ب" }, "ar", "title") → "ب"
 */
export function pickField<K extends string>(
  record: Record<string, unknown> | object,
  locale: Locale,
  key: K,
): string {
  const r = record as Record<string, unknown>;
  const suffix = locale === "ar" ? "Ar" : "En";
  const value = r[`${key}${suffix}`] ?? r[`${key}En`];
  return typeof value === "string" ? value : "";
}

export function dirFor(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function isRtl(locale: Locale) {
  return locale === "ar";
}
