import Image from "next/image";
import { Link } from "@/i18n/routing";
import { pickField, type Locale } from "@/lib/i18n-helpers";

interface ProjectCardProps {
  project: {
    slug: string;
    coverImage: string | null;
    category: string;
    tags?: string;
    titleEn: string;
    titleAr: string;
    shortDescEn: string;
    shortDescAr: string;
  };
  locale: Locale;
}

export function ProjectCard({ project, locale }: ProjectCardProps) {
  const tags = (project.tags ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block focus-visible:outline-none"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/[0.10] bg-white/[0.04]">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={pickField(project, locale, "title")}
            fill
            sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent" />
        )}
      </div>

      <div className="mt-4 flex flex-nowrap items-center justify-between gap-3 px-1">
        <h3 className="h-display shrink-0 text-lg font-semibold leading-tight">
          {pickField(project, locale, "title")}
        </h3>
        {tags.length > 0 ? (
          <div className="flex min-w-0 flex-nowrap items-center justify-end gap-1.5 overflow-hidden">
            {tags.map((t) => (
              <span
                key={t}
                className="shrink-0 rounded-full border border-accent/30 bg-accent/15 px-2.5 py-1 text-[0.7rem] font-medium uppercase tracking-wide text-accent"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
