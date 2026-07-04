import { Reveal } from "./Motion";

export interface LegalBlock {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

/**
 * Shared reading layout for static legal pages (Terms, Privacy).
 * Content is passed in as structured blocks so each page only supplies data.
 */
export function LegalDocument({
  title,
  updated,
  intro,
  blocks,
}: {
  title: string;
  updated: string;
  intro?: string;
  blocks: LegalBlock[];
}) {
  return (
    <section className="pb-32 pt-6 md:pt-12">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal>
          <h1 className="h-display text-balance text-4xl font-semibold md:text-6xl">
            {title}
          </h1>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-4 text-xs uppercase tracking-[0.15em] text-tint/40">
            Last updated · {updated}
          </p>
        </Reveal>
        {intro ? (
          <Reveal delay={0.1}>
            <p className="mt-8 text-pretty text-base leading-relaxed text-tint/70 md:text-lg">
              {intro}
            </p>
          </Reveal>
        ) : null}

        <div className="mt-12 flex flex-col gap-10">
          {blocks.map((b) => (
            <Reveal key={b.heading}>
              <div className="flex flex-col gap-3">
                <h2 className="h-display text-xl font-semibold text-tint md:text-2xl">
                  {b.heading}
                </h2>
                {b.paragraphs?.map((p, i) => (
                  <p
                    key={i}
                    className="text-pretty text-sm leading-relaxed text-tint/65 md:text-base"
                  >
                    {p}
                  </p>
                ))}
                {b.bullets ? (
                  <ul className="mt-1 flex flex-col gap-2">
                    {b.bullets.map((li, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-sm leading-relaxed text-tint/65 md:text-base"
                      >
                        <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        <span>{li}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
