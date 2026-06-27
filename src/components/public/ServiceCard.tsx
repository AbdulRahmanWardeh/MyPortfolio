import { Link } from "@/i18n/routing";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DynamicIcon } from "@/lib/hugeicon";
import { pickField, type Locale } from "@/lib/i18n-helpers";
import { parseJson } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  service: {
    icon: string;
    titleEn: string;
    descriptionEn: string;
    deliverables: unknown;
    timelineEn: string;
    ctaLabelEn: string;
  };
  locale: Locale;
  labels: {
    deliverables: string;
    timeline: string;
  };
  ctaIcon?: string;
}

export function ServiceCard({ service, locale, labels, ctaIcon }: ServiceCardProps) {
  const Icon =
    (Icons[service.icon as keyof typeof Icons] as LucideIcon) ?? Icons.Sparkles;

  const deliverables = parseJson<Array<{ en: string }>>(
    service.deliverables,
    [],
  );

  return (
    <div className="surface flex h-full flex-col gap-5 p-7 transition hover:bg-tint/[0.04]">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="h-display text-lg font-semibold leading-tight">
          {pickField(service, locale, "title")}
        </h3>
        <p className="mt-2 text-sm text-tint/55">
          {pickField(service, locale, "description")}
        </p>
      </div>

      {deliverables.length > 0 ? (
        <div className="border-t border-tint/[0.06] pt-5">
          <div className="text-xs uppercase tracking-wide text-tint/40">
            {labels.deliverables}
          </div>
          <ul className="mt-3 flex flex-col gap-1.5 text-sm text-tint/70">
            {deliverables.map((d, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 inline-block h-1 w-1 rounded-full bg-tint/40" />
                <span>{d.en}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-auto flex items-center justify-between border-t border-tint/[0.06] pt-5">
        <div className="text-xs text-tint/50">
          <div className="uppercase tracking-wide text-tint/40">{labels.timeline}</div>
          <div className="mt-1 text-sm text-tint/80">
            {pickField(service, locale, "timeline")}
          </div>
        </div>
        <Button asChild variant="accent" size="sm">
          <Link href="/contact">
            {pickField(service, locale, "ctaLabel")}
            <DynamicIcon name={ctaIcon} className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
