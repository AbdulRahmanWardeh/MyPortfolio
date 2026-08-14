import Image from "next/image";
import type { Block } from "@/lib/blocks";

/**
 * Renders a single content block. Kept free of client-only APIs so it can be
 * used from both server components and the interactive section accordion.
 */
export function BlockRenderer({ block }: { block: Block }) {
  if (!block || typeof block !== "object" || !("kind" in block)) return null;

  switch (block.kind) {
    case "metrics":
      return (
        <div className="grid gap-4 sm:grid-cols-3">
          {block.data.items?.map((m, i) => (
            <div key={i} className="surface p-6">
              <div className="text-3xl font-semibold tracking-tight">{m.value}</div>
              <div className="mt-1 text-sm text-tint/55">{m.labelEn}</div>
            </div>
          ))}
        </div>
      );

    case "gallery":
      return (
        <div className="grid gap-4 md:grid-cols-3">
          {block.data.images?.filter((img) => img.url).map((img, i) => (
            <div
              key={i}
              className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-tint/[0.06]"
            >
              <Image
                src={img.url}
                alt={img.altEn ?? ""}
                fill
                sizes="(min-width:768px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      );

    case "image":
      if (!block.data.url) return null;
      return (
        <figure className="overflow-hidden rounded-2xl border border-tint/[0.06]">
          <div className="relative aspect-[16/10]">
            <Image
              src={block.data.url}
              alt={block.data.captionEn ?? ""}
              fill
              sizes="(min-width:1280px) 80vw, (min-width:768px) 90vw, 100vw"
              className="object-cover"
            />
          </div>
          {block.data.captionEn ? (
            <figcaption className="px-4 py-3 text-xs text-tint/50">
              {block.data.captionEn}
            </figcaption>
          ) : null}
        </figure>
      );

    case "beforeAfter":
      return (
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { url: block.data.beforeUrl, label: "Before" },
            { url: block.data.afterUrl, label: "After" },
          ]
            .filter((b) => b.url)
            .map((b, i) => (
              <figure
                key={i}
                className="overflow-hidden rounded-2xl border border-tint/[0.06]"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={b.url}
                    alt={b.label}
                    fill
                    sizes="(min-width:768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="px-4 py-3 text-xs uppercase tracking-wide text-tint/40">
                  {b.label}
                </figcaption>
              </figure>
            ))}
        </div>
      );

    case "bullets":
      return (
        <ul className="ms-4 list-disc space-y-2 text-base text-tint/75">
          {block.data.items?.map((it, i) => (
            <li key={i}>{it.en}</li>
          ))}
        </ul>
      );

    case "quote":
      return (
        <blockquote className="surface p-8 text-lg italic text-tint/85">
          <p>&ldquo;{block.data.textEn}&rdquo;</p>
          {block.data.authorEn ? (
            <footer className="mt-4 text-sm not-italic text-tint/50">
              — {block.data.authorEn}
            </footer>
          ) : null}
        </blockquote>
      );

    case "cards":
      return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {block.data.items?.map((c, i) => (
            <div key={i} className="surface p-6">
              <h4 className="text-sm font-medium">{c.titleEn}</h4>
              <p className="mt-2 text-sm text-tint/55">{c.descEn}</p>
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
}
