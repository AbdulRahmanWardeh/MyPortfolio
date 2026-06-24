export type Locale = "en";

export function pickField<K extends string>(
  record: Record<string, unknown> | object,
  _locale: unknown,
  key: K,
): string {
  const r = record as Record<string, unknown>;
  const value = r[`${key}En`] ?? r[`${key}`];
  return typeof value === "string" ? value : "";
}

export function dirFor(_locale: unknown): "ltr" {
  return "ltr";
}
