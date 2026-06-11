import Image from "next/image";
import { Reveal } from "./Motion";
import { pickField, type Locale } from "@/lib/i18n-helpers";
import { parseJson } from "@/lib/utils";
import type { CaseStudySection } from "@prisma/client";

interface MetricBlock {
  kind: "metrics";
  data: { items: Array<{ labelEn: string; value: string }> };
}
interface GalleryBlock {
  kind: "gallery";
  data: { images: Array<{ url: string; altEn?: string }> };
}
interface ImageBlock {
  kind: "image";
  data: { url: string; captionEn?: string };
}
interface BeforeAfterBlock {
  kind: "beforeAfter";
  data: { beforeUrl: string; afterUrl: string };
}
interface BulletsBlock {
  kind: "bullets";
  data: { items: Array<{ en: string }> };
}
interface QuoteBlock {
  kind: "quote";
  data: { textEn: string; authorEn?: string };
}
interface CardsBlock {
  kind: "cards";
  data: {
    items: Array<{ titleEn: string; descEn: string }>;
  };
}

type Block =
  | MetricBlock
  | GalleryBlock
  | ImageBlock
  | BeforeAfterBlock
  | BulletsBlock
  | QuoteBlock
  | CardsBlock;

export function CaseStudyRenderer({
  sections,
  locale,
}: {
  sections: CaseStudySection[];
  locale: Locale;
}) {
  const ordered = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col gap-24">
      {ordered.map((section, idx) => (
        <Reveal key={section.id}>
          <section id={`section-${idx + 1}`} className="scroll-mt-32">
            <div className="mb-6 flex items-baseline gap-4">
              <span className="font-mono text-xs text-white/30">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <h2 className="h-display text-2xl font-semibold md:text-3xl">
                {pickField(section, locale, "title")}
              </h2>
            </div>

            {pickField(section, locale, "body") ? (
              <p className="max-w-3xl whitespace-pre-line text-pretty text-base text-white/70 md:text-lg">
                {pickField(section, locale, "body")}
              </p>
            ) : null}

            <div className="mt-8 flex flex-col gap-6">
              {parseJson<Block[]>(section.blocks, []).map((block, i) => (
                <BlockRenderer key={i} block={block} />
              ))}
            </div>
          </section>
        </Reveal>
      ))}
    </div>
  );
}

function BlockRenderer({ block }: { block: Block }) {
  if (!block || typeof block !== "object" || !("kind" in block)) return null;

  switch (block.kind) {
    case "metrics":
      return (
        <div className="grid gap-4 sm:grid-cols-3">
          {block.data.items?.map((m, i) => (
            <div key={i} className="surface p-6">
              <div className="text-3xl font-semibold tracking-tight">{m.value}</div>
              <div className="mt-1 text-sm text-white/55">{m.labelEn}</div>
            </div>
          ))}
        </div>
      );

    case "gallery":
      return (
        <div className="grid gap-4 md:grid-cols-3">
          {block.data.images?.map((img, i) => (
            <div
              key={i}
              className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/[0.06]"
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
      return (
        <figure className="overflow-hidden rounded-2xl border border-white/[0.06]">
          <div className="relative aspect-[16/10]">
            <Image
              src={block.data.url}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
          {block.data.captionEn ? (
            <figcaption className="px-4 py-3 text-xs text-white/50">
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
          ].map((b, i) => (
            <figure
              key={i}
              className="overflow-hidden rounded-2xl border border-white/[0.06]"
            >
              <div className="relative aspect-[4/3]">
                <Image src={b.url} alt={b.label} fill className="object-cover" />
              </div>
              <figcaption className="px-4 py-3 text-xs uppercase tracking-wide text-white/40">
                {b.label}
              </figcaption>
            </figure>
          ))}
        </div>
      );

    case "bullets":
      return (
        <ul className="ms-4 list-disc space-y-2 text-base text-white/75">
          {block.data.items?.map((it, i) => (
            <li key={i}>{it.en}</li>
          ))}
        </ul>
      );

    case "quote":
      return (
        <blockquote className="surface p-8 text-lg italic text-white/85">
          <p>&ldquo;{block.data.textEn}&rdquo;</p>
          {block.data.authorEn ? (
            <footer className="mt-4 text-sm not-italic text-white/50">
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
              <p className="mt-2 text-sm text-white/55">{c.descEn}</p>
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
}
