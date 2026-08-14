/**
 * Shared shapes for project-section content blocks.
 *
 * Both the admin editor (BlockEditor) and the public renderer (BlockRenderer)
 * import from here so the two can't drift apart — these shapes are what gets
 * serialized into `ProjectSection.blocks`.
 */

export interface MetricsBlock {
  kind: "metrics";
  data: { items: Array<{ labelEn: string; value: string }> };
}
export interface GalleryBlock {
  kind: "gallery";
  data: { images: Array<{ url: string; altEn?: string }> };
}
export interface ImageBlock {
  kind: "image";
  data: { url: string; captionEn?: string };
}
export interface BeforeAfterBlock {
  kind: "beforeAfter";
  data: { beforeUrl: string; afterUrl: string };
}
export interface BulletsBlock {
  kind: "bullets";
  data: { items: Array<{ en: string }> };
}
export interface QuoteBlock {
  kind: "quote";
  data: { textEn: string; authorEn?: string };
}
export interface CardsBlock {
  kind: "cards";
  data: { items: Array<{ titleEn: string; descEn: string }> };
}

export type Block =
  | MetricsBlock
  | GalleryBlock
  | ImageBlock
  | BeforeAfterBlock
  | BulletsBlock
  | QuoteBlock
  | CardsBlock;

export type BlockKind = Block["kind"];

export const BLOCK_KINDS: { value: BlockKind; label: string; hint: string }[] = [
  { value: "image", label: "Image", hint: "One image with an optional caption" },
  { value: "gallery", label: "Image gallery", hint: "A grid of images" },
  { value: "beforeAfter", label: "Before / After", hint: "Two images side by side" },
  { value: "metrics", label: "Metrics", hint: "Big numbers with labels" },
  { value: "bullets", label: "Bullet list", hint: "A simple bulleted list" },
  { value: "quote", label: "Quote", hint: "A pull quote with optional author" },
  { value: "cards", label: "Cards", hint: "Titled cards with descriptions" },
];

/** A new, empty block of the given kind. */
export function emptyBlock(kind: BlockKind): Block {
  switch (kind) {
    case "metrics":
      return { kind, data: { items: [{ labelEn: "", value: "" }] } };
    case "gallery":
      return { kind, data: { images: [] } };
    case "image":
      return { kind, data: { url: "", captionEn: "" } };
    case "beforeAfter":
      return { kind, data: { beforeUrl: "", afterUrl: "" } };
    case "bullets":
      return { kind, data: { items: [{ en: "" }] } };
    case "quote":
      return { kind, data: { textEn: "", authorEn: "" } };
    case "cards":
      return { kind, data: { items: [{ titleEn: "", descEn: "" }] } };
  }
}

/**
 * Coerce unknown persisted JSON into well-formed blocks, dropping anything
 * unrecognized. Editors can then assume every field exists.
 */
export function normalizeBlocks(input: unknown): Block[] {
  if (!Array.isArray(input)) return [];
  const known = new Set<string>(BLOCK_KINDS.map((k) => k.value));

  return input.flatMap((raw): Block[] => {
    if (!raw || typeof raw !== "object") return [];
    const b = raw as { kind?: unknown; data?: unknown };
    if (typeof b.kind !== "string" || !known.has(b.kind)) return [];
    const kind = b.kind as BlockKind;
    const d = (b.data ?? {}) as Record<string, unknown>;
    const arr = (v: unknown) => (Array.isArray(v) ? v : []);
    const s = (v: unknown) => (typeof v === "string" ? v : "");

    switch (kind) {
      case "metrics":
        return [{
          kind,
          data: {
            items: arr(d.items).map((i) => {
              const it = (i ?? {}) as Record<string, unknown>;
              return { labelEn: s(it.labelEn), value: s(it.value) };
            }),
          },
        }];
      case "gallery":
        return [{
          kind,
          data: {
            images: arr(d.images).map((i) => {
              const it = (i ?? {}) as Record<string, unknown>;
              return { url: s(it.url), altEn: s(it.altEn) };
            }),
          },
        }];
      case "image":
        return [{ kind, data: { url: s(d.url), captionEn: s(d.captionEn) } }];
      case "beforeAfter":
        return [{ kind, data: { beforeUrl: s(d.beforeUrl), afterUrl: s(d.afterUrl) } }];
      case "bullets":
        return [{
          kind,
          data: {
            items: arr(d.items).map((i) => {
              const it = (i ?? {}) as Record<string, unknown>;
              return { en: s(it.en) };
            }),
          },
        }];
      case "quote":
        return [{ kind, data: { textEn: s(d.textEn), authorEn: s(d.authorEn) } }];
      case "cards":
        return [{
          kind,
          data: {
            items: arr(d.items).map((i) => {
              const it = (i ?? {}) as Record<string, unknown>;
              return { titleEn: s(it.titleEn), descEn: s(it.descEn) };
            }),
          },
        }];
    }
  });
}
