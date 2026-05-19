import { cn } from "@/lib/utils";
import { Reveal } from "./Motion";

interface SectionHeaderProps {
  kicker?: string;
  title: string;
  description?: string;
  align?: "start" | "center";
  className?: string;
}

export function SectionHeader({
  kicker,
  title,
  description,
  align = "start",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex max-w-2xl flex-col gap-4",
        align === "center" && "mx-auto text-center items-center",
        className,
      )}
    >
      {kicker ? (
        <Reveal>
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/40">
            <span className="h-px w-8 bg-white/20" />
            {kicker}
          </span>
        </Reveal>
      ) : null}
      <Reveal delay={0.05}>
        <h2 className="h-display text-balance text-3xl font-semibold md:text-5xl">
          {title}
        </h2>
      </Reveal>
      {description ? (
        <Reveal delay={0.1}>
          <p className="text-pretty text-base text-white/60 md:text-lg">
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
