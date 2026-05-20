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
      <div className="rounded-3xl border border-white/[0.10] bg-white/[0.04] p-3 transition-all duration-500 group-hover:border-white/20 group-hover:bg-white/[0.06]">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl">
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
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 px-2">
        <h3 className="h-display text-lg font-semibold leading-tight">
          {pickField(project, locale, "title")}
        </h3>
        {tags.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[0.7rem] font-medium uppercase tracking-wide text-white/55"
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
